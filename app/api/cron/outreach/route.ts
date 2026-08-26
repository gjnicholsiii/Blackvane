import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function db() {
  const url = process.env.BLACKVANE_DATABASE_URL || process.env.DATABASE_URL
  if (!url) throw new Error('BLACKVANE_DATABASE_URL is not configured')
  return neon(url)
}

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

function addBusinessDays(start: Date, days: number) {
  const d = new Date(start)
  let remaining = days
  while (remaining > 0) {
    d.setUTCDate(d.getUTCDate() + 1)
    const day = d.getUTCDay()
    if (day !== 0 && day !== 6) remaining--
  }
  d.setUTCHours(15, 30, 0, 0)
  return d
}

function firstName(name: string | null) {
  return (name || '').trim().split(/\s+/)[0] || 'there'
}

function firstContact(company: string, person: string | null, trigger: string | null) {
  const name = firstName(person)
  const signal = trigger || 'growing the team'
  return {
    subject: company,
    body: `Hi ${name},\n\nI saw ${company} is ${signal.charAt(0).toLowerCase()}${signal.slice(1)} and thought I’d reach out.\n\nBlackvane is pretty simple. We help companies sell more and get better at the mechanics behind selling. That can mean a diagnostic when something in sales clearly isn’t working, fractional sales when you need someone actually doing the work, fractional sales leadership when the team needs direction, or helping rebuild the process around prospecting, pipeline, follow-up, forecasting, territories, comp and accountability.\n\nWe can tell you where we think the problem is, help fix it, or both. We also put a money-back guarantee behind our work.\n\nIf sales is part of what’s driving the hiring at ${company}, let’s talk.\n\nJoe\nBlackvane\nblackvane13.com`
  }
}

function draft(step: number, company: string, person: string | null, lane: string | null, trigger: string | null) {
  const name = firstName(person)
  if (step === 1) return firstContact(company, person, trigger)
  if (step === 2) return {
    subject: `Re: ${company}`,
    body: `${name}, just bringing this back up. If sales growth is creating a need for more hands, better direction, or a stronger process at ${company}, Blackvane can step in for the diagnostic, the fractional sales work, the leadership, or all three.\n\nIf it is relevant, let’s talk.\n\nJoe`
  }
  return {
    subject: `Re: ${company}`,
    body: `${name}, last note from me. If sales becomes something you want another set of experienced eyes or hands on at ${company}, I’m easy to find.\n\nJoe`
  }
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ ok: false }, { status: 401 })
  const sql = db()
  const settingsRows = await sql`select mode,paused,daily_new_limit,daily_followup_limit,sender_name,sender_email from outreach_settings where id=1`
  const settings = settingsRows[0] as any
  if (!settings || settings.paused) return NextResponse.json({ ok: true, paused: true })

  const now = new Date()
  let created = 0
  let sent = 0
  let failed = 0

  const sentTodayRows = await sql`
    select
      count(*) filter (where status='SENT' and sequence_step=1 and sent_at::date=current_date)::int as new_sent,
      count(*) filter (where status='SENT' and sequence_step>1 and sent_at::date=current_date)::int as followup_sent
    from outreach_messages
  ` as Array<{ new_sent: number; followup_sent: number }>
  const sentToday = sentTodayRows[0] || { new_sent: 0, followup_sent: 0 }
  const remainingNew = Math.max(0, Number(settings.daily_new_limit || 15) - Number(sentToday.new_sent || 0))
  const remainingFollowup = Math.max(0, Number(settings.daily_followup_limit || 25) - Number(sentToday.followup_sent || 0))

  if (remainingFollowup > 0) {
    const due = await sql`
      select id,company,decision_maker,email,lane,trigger_text,sequence_step,status
      from outreach_companies
      where suppressed=false and email is not null and next_send_at is not null and next_send_at<=now()
        and sequence_step between 1 and 2 and status in ('FOLLOW_UP','SENT')
      order by next_send_at asc
      limit ${remainingFollowup}
    ` as any[]

    for (const c of due) {
      const step = Number(c.sequence_step || 1) + 1
      const msg = draft(step, c.company, c.decision_maker, c.lane, c.trigger_text)
      const status = settings.mode === 'AUTO' ? 'QUEUED' : 'DRAFT'
      await sql`insert into outreach_messages(company_id,sequence_step,subject,body,status,scheduled_at) values(${c.id},${step},${msg.subject},${msg.body},${status},${status === 'QUEUED' ? now.toISOString() : null})`
      await sql`update outreach_companies set sequence_step=${step},status=${status === 'QUEUED' ? 'QUEUED' : 'DRAFT'},next_send_at=null,updated_at=now() where id=${c.id}`
      created++
    }
  }

  if (settings.mode !== 'AUTO') {
    return NextResponse.json({ ok: true, mode: settings.mode, created, sent: 0, sending: 'disabled-in-draft-mode' })
  }

  if (remainingNew > 0) {
    const newRows = await sql`
      select id,company,decision_maker,email,lane,trigger_text
      from outreach_companies
      where suppressed=false and email is not null and status in ('NEW','READY') and sequence_step=0
      order by score desc, created_at asc
      limit ${remainingNew}
    ` as any[]
    for (const c of newRows) {
      const msg = draft(1, c.company, c.decision_maker, c.lane, c.trigger_text)
      await sql`insert into outreach_messages(company_id,sequence_step,subject,body,status,scheduled_at) values(${c.id},1,${msg.subject},${msg.body},'QUEUED',now())`
      await sql`update outreach_companies set sequence_step=1,status='QUEUED',next_send_at=now(),updated_at=now() where id=${c.id}`
      created++
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = settings.sender_email || process.env.BLACKVANE_FROM_EMAIL
  if (!apiKey || !from) return NextResponse.json({ ok: true, created, sent: 0, sending: 'not-configured' })

  const resend = new Resend(apiKey)
  const queued = await sql`
    select m.id,m.company_id,m.sequence_step,m.subject,m.body,c.company,c.email
    from outreach_messages m join outreach_companies c on c.id=m.company_id
    where m.status='QUEUED' and c.suppressed=false and m.scheduled_at<=now()
      and (
        (m.sequence_step=1 and ${remainingNew} > 0)
        or
        (m.sequence_step>1 and ${remainingFollowup} > 0)
      )
    order by m.scheduled_at asc,m.id asc
    limit ${remainingNew + remainingFollowup}
  ` as any[]

  let newSentThisRun = 0
  let followupSentThisRun = 0

  for (const m of queued) {
    const isNew = Number(m.sequence_step) === 1
    if (isNew && newSentThisRun >= remainingNew) continue
    if (!isNew && followupSentThisRun >= remainingFollowup) continue

    try {
      const response = await resend.emails.send({ from: `${settings.sender_name || 'Joe'} <${from}>`, to: [m.email], subject: m.subject, text: m.body, replyTo: from })
      if (response.error) throw new Error(response.error.message)
      await sql`update outreach_messages set status='SENT',provider_message_id=${response.data?.id || null},sent_at=now(),error=null where id=${m.id}`
      const next = Number(m.sequence_step) < 3 ? addBusinessDays(now, Number(m.sequence_step) === 1 ? 3 : 5).toISOString() : null
      await sql`update outreach_companies set status=${Number(m.sequence_step) < 3 ? 'FOLLOW_UP' : 'SEQUENCE_COMPLETE'},last_sent_at=now(),next_send_at=${next},updated_at=now() where id=${m.company_id}`
      await sql`insert into outreach_events(company_id,message_id,event_type,detail) values(${m.company_id},${m.id},'SENT',${`Sequence step ${m.sequence_step}`})`
      if (isNew) newSentThisRun++
      else followupSentThisRun++
      sent++
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Send failed'
      await sql`update outreach_messages set status='FAILED',error=${message} where id=${m.id}`
      await sql`insert into outreach_events(company_id,message_id,event_type,detail) values(${m.company_id},${m.id},'SEND_FAILED',${message})`
      failed++
    }
  }

  return NextResponse.json({ ok: true, created, sent, failed, remainingNew, remainingFollowup })
}

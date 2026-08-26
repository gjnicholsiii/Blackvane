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

function draft(step: number, company: string, person: string | null, lane: string | null, trigger: string | null) {
  const name = firstName(person)
  const signal = trigger || 'growing the business'

  if (step === 1) return {
    subject: 'A growth question',
    body: `Hi ${name},\n\nI’ve spent the last few years helping companies grow by roughly $25 million.\n\nWhat I learned is that growth usually exposes the problem before management can see it clearly. Sales, estimating, leadership, handoffs, accountability, margin. One of them starts costing money long before anyone labels it the problem.\n\nI’ve been looking at ${company} because ${signal.charAt(0).toLowerCase()}${signal.slice(1)}.\n\nI have a thought about where I’d look first.\n\nWorth a conversation?\n\nJoe`
  }

  if (step === 2) return {
    subject: `Re: ${company}`,
    body: `${name}, one follow-up because the growth signal at ${company} is the kind of thing that usually exposes an expensive constraint before it becomes obvious.\n\nIf useful, I’ll tell you where I’d look first.\n\nJoe`
  }

  return {
    subject: `Re: ${company}`,
    body: `${name}, I’ll leave it here after this one. I’ve spent enough time inside growing companies to know the expensive problem is often sitting one layer below the obvious one.\n\nIf you want another set of eyes on ${company}, let’s talk.\n\nJoe`
  }
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ ok: false }, { status: 401 })
  const sql = db()
  const settingsRows = await sql`select mode,paused,daily_new_limit,daily_followup_limit,sender_name,sender_email from outreach_settings where id=1`
  const settings = settingsRows[0] as any

  // Absolute safety gate. Cron cannot create, queue, or send outreach unless Auto Mode is explicitly enabled and the engine is unpaused.
  if (!settings || settings.paused || settings.mode !== 'AUTO') {
    return NextResponse.json({ ok: true, paused: Boolean(settings?.paused), mode: settings?.mode || 'UNKNOWN', sending: 'disabled' })
  }

  const now = new Date()
  let created = 0
  let sent = 0
  let failed = 0

  // True day-wide limits, never per cron invocation.
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
      where suppressed=false
        and email is not null
        and upper(contact_quality)='VERIFIED'
        and next_send_at is not null
        and next_send_at<=now()
        and sequence_step between 1 and 2
        and status in ('FOLLOW_UP','SENT')
      order by next_send_at asc
      limit ${remainingFollowup}
    ` as any[]

    for (const c of due) {
      const step = Number(c.sequence_step || 1) + 1
      const msg = draft(step, c.company, c.decision_maker, c.lane, c.trigger_text)
      await sql`insert into outreach_messages(company_id,sequence_step,subject,body,status,scheduled_at) values(${c.id},${step},${msg.subject},${msg.body},'QUEUED',now())`
      await sql`update outreach_companies set sequence_step=${step},status='QUEUED',next_send_at=null,updated_at=now() where id=${c.id}`
      created++
    }
  }

  if (remainingNew > 0) {
    const newRows = await sql`
      select id,company,decision_maker,email,lane,trigger_text
      from outreach_companies
      where suppressed=false
        and email is not null
        and upper(contact_quality)='VERIFIED'
        and decision_maker is not null
        and status in ('NEW','READY')
        and sequence_step=0
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
    where m.status='QUEUED'
      and c.suppressed=false
      and upper(c.contact_quality)='VERIFIED'
      and c.decision_maker is not null
      and m.scheduled_at<=now()
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

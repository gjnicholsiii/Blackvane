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
  const signal = trigger || 'the growth activity around the company'
  if (step === 1) {
    if ((lane || '').includes('Revenue')) return {
      subject: 'Before you add more sales capacity',
      body: `Hi ${name} — I noticed ${company} is ${signal.charAt(0).toLowerCase()}${signal.slice(1)}.\n\nThat caught my attention because adding sales capacity can accelerate revenue, but it can also conceal a sales-system problem for another six months.\n\nI work with growing security and low-voltage companies on revenue, retention and execution problems. Blackvane's initial engagement is a short diagnostic: find the constraint, document it, and put it on the desk of the person who can fix it.\n\nGiven what is happening at ${company}, I thought it might be worth comparing notes for 15 minutes.\n\nJoe`
    }
    return {
      subject: 'Growth showing up in operations',
      body: `Hi ${name} — I noticed ${company} is ${signal.charAt(0).toLowerCase()}${signal.slice(1)}.\n\nGrowth in security and low-voltage companies tends to expose the expensive parts of the operation first: project ownership, labor utilization, handoffs, margin, scheduling and management bandwidth.\n\nThat is the work I diagnose through Blackvane. I identify the actual failure point and give management a specific written finding rather than another consulting deck.\n\nGiven the activity at ${company}, I thought it might be worth a 15-minute conversation.\n\nJoe`
    }
  }
  if (step === 2) return {
    subject: `Re: ${company}`,
    body: `${name}, bringing this back up because the growth signal at ${company} is exactly when I usually find something worth fixing.\n\nHappy to tell you in 15 minutes what I would look at first.\n\nJoe`
  }
  return {
    subject: 'Last note from me',
    body: `${name}, I’ll leave this with you after this one. If revenue production, retention, estimating, project handoff or execution starts costing more than it should at ${company}, that is my lane.\n\nJoe`
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

  const due = await sql`
    select id,company,decision_maker,email,lane,trigger_text,sequence_step,status
    from outreach_companies
    where suppressed=false and email is not null and next_send_at is not null and next_send_at<=now()
      and sequence_step between 1 and 2 and status in ('FOLLOW_UP','SENT')
    order by next_send_at asc
    limit ${Number(settings.daily_followup_limit || 25)}
  ` as any[]

  for (const c of due) {
    const step = Number(c.sequence_step || 1) + 1
    const msg = draft(step, c.company, c.decision_maker, c.lane, c.trigger_text)
    const status = settings.mode === 'AUTO' ? 'QUEUED' : 'DRAFT'
    await sql`insert into outreach_messages(company_id,sequence_step,subject,body,status,scheduled_at) values(${c.id},${step},${msg.subject},${msg.body},${status},${status === 'QUEUED' ? now.toISOString() : null})`
    await sql`update outreach_companies set sequence_step=${step},status=${status === 'QUEUED' ? 'QUEUED' : 'DRAFT'},next_send_at=null,updated_at=now() where id=${c.id}`
    created++
  }

  if (settings.mode === 'AUTO') {
    const newRows = await sql`
      select id,company,decision_maker,email,lane,trigger_text
      from outreach_companies
      where suppressed=false and email is not null and status in ('NEW','READY') and sequence_step=0
      order by score desc, created_at asc
      limit ${Number(settings.daily_new_limit || 15)}
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
    order by m.scheduled_at asc,m.id asc limit 40
  ` as any[]

  for (const m of queued) {
    try {
      const response = await resend.emails.send({ from: `${settings.sender_name || 'Joe'} <${from}>`, to: [m.email], subject: m.subject, text: m.body, replyTo: from })
      if (response.error) throw new Error(response.error.message)
      await sql`update outreach_messages set status='SENT',provider_message_id=${response.data?.id || null},sent_at=now(),error=null where id=${m.id}`
      const next = Number(m.sequence_step) < 3 ? addBusinessDays(now, Number(m.sequence_step) === 1 ? 3 : 5).toISOString() : null
      await sql`update outreach_companies set status=${Number(m.sequence_step) < 3 ? 'FOLLOW_UP' : 'SEQUENCE_COMPLETE'},last_sent_at=now(),next_send_at=${next},updated_at=now() where id=${m.company_id}`
      await sql`insert into outreach_events(company_id,message_id,event_type,detail) values(${m.company_id},${m.id},'SENT',${`Sequence step ${m.sequence_step}`})`
      sent++
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Send failed'
      await sql`update outreach_messages set status='FAILED',error=${message} where id=${m.id}`
      await sql`insert into outreach_events(company_id,message_id,event_type,detail) values(${m.company_id},${m.id},'SEND_FAILED',${message})`
      failed++
    }
  }

  return NextResponse.json({ ok: true, created, sent, failed })
}

import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const TOKEN = 'b7k2m9q4x6n8r1s3'

const BATCH = [
  'ADT',
  'Advanced Security Systems',
  'Alarm Detection Systems Inc.',
  'Alarm New England',
  'All Guard Alarm Systems Inc.',
  'CPI Security Systems Inc.',
  'Cook Solutions Group',
  'Custom Alarm',
  'Doyle Security Systems Inc.',
  'EPS Security',
  'EyeQ Monitoring',
  'Gillmore Security Systems Inc.',
  'Guardian Protection',
  'Habitec Security',
  'Minuteman Security & Life Safety',
  'Pavion Corp.',
  'Post Alarm Systems',
  'Powered Protection',
  'RapidFire Safety & Security',
  'Revolution Fire Alarm',
  'Safe Home Security Inc. / Security Systems Inc.',
  'Safe and Sound Security',
  'SafeTouch LLC',
  'Securitas Technology',
  'Security 101',
  'Security Alarm Corporation',
  'Security Equipment Inc.',
  'Sonitrol of Evansville Inc.',
  'Source 1 Solutions',
  'SSD Alarm',
  'Tech Systems Inc.',
  'Titan Alarm, Inc',
  'Vector Security',
  'Zeus Fire and Security',
  'N&W Systems'
]

function db() {
  const url = process.env.BLACKVANE_DATABASE_URL || process.env.DATABASE_URL
  if (!url) throw new Error('BLACKVANE_DATABASE_URL is not configured')
  return neon(url)
}

function firstName(name: string | null) {
  return (name || '').trim().split(/\s+/)[0] || 'there'
}

function draft(company: string, person: string | null, trigger: string | null) {
  const name = firstName(person)
  const signal = trigger || 'growing the business'
  return {
    subject: 'A growth question',
    body: `Hi ${name},\n\nI’ve spent the last few years helping companies grow by roughly $25 million.\n\nWhat I learned is that growth usually exposes the problem before management can see it clearly. Sales, estimating, leadership, handoffs, accountability, margin. One of them starts costing money long before anyone labels it the problem.\n\nI’ve been looking at ${company} because ${signal.charAt(0).toLowerCase()}${signal.slice(1)}.\n\nI have a thought about where I’d look first.\n\nWorth a conversation?\n\nJoe`
  }
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('token') !== TOKEN) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const sql = db()
  const settingsRows = await sql`select sender_name,sender_email from outreach_settings where id=1`
  const settings = settingsRows[0] as any
  const apiKey = process.env.RESEND_API_KEY
  const from = settings?.sender_email || process.env.BLACKVANE_FROM_EMAIL
  if (!apiKey || !from) return NextResponse.json({ ok: false, error: 'sender-not-configured' }, { status: 500 })

  const rows = await sql`
    select id,company,decision_maker,email,trigger_text,status,sequence_step,suppressed,contact_quality
    from outreach_companies
    where company = any(${BATCH})
    order by company asc
  ` as any[]

  const resend = new Resend(apiKey)
  const sent: Array<{company:string;email:string;providerId:string|null}> = []
  const skipped: Array<{company:string;reason:string}> = []
  const failed: Array<{company:string;error:string}> = []

  for (const c of rows) {
    if (c.company === 'EMC Security' || c.company === 'Kastle Systems International') {
      skipped.push({ company: c.company, reason: 'excluded-from-this-batch' })
      continue
    }
    if (c.suppressed) { skipped.push({ company: c.company, reason: 'suppressed' }); continue }
    if (!c.decision_maker || !c.email) { skipped.push({ company: c.company, reason: 'missing-contact' }); continue }
    if (String(c.contact_quality || '').toUpperCase() !== 'VERIFIED') { skipped.push({ company: c.company, reason: 'not-verified' }); continue }
    const prior = await sql`select id from outreach_messages where company_id=${c.id} and sequence_step=1 and status='SENT' limit 1`
    if (prior.length) { skipped.push({ company: c.company, reason: 'already-sent' }); continue }

    const msg = draft(c.company, c.decision_maker, c.trigger_text)
    try {
      const response = await resend.emails.send({
        from: `${settings?.sender_name || 'Joe'} <${from}>`,
        to: [c.email],
        subject: msg.subject,
        text: msg.body,
        replyTo: from
      })
      if (response.error) throw new Error(response.error.message)
      const inserted = await sql`
        insert into outreach_messages(company_id,sequence_step,subject,body,status,scheduled_at,sent_at,provider_message_id)
        values(${c.id},1,${msg.subject},${msg.body},'SENT',now(),now(),${response.data?.id || null})
        returning id
      ` as Array<{id:number}>
      const messageId = inserted[0]?.id || null
      await sql`update outreach_companies set sequence_step=1,status='FOLLOW_UP',last_sent_at=now(),updated_at=now() where id=${c.id}`
      await sql`insert into outreach_events(company_id,message_id,event_type,detail) values(${c.id},${messageId},'SENT','One-time alarm/security batch 2026-08-27')`
      sent.push({ company: c.company, email: c.email, providerId: response.data?.id || null })
    } catch (error) {
      failed.push({ company: c.company, error: error instanceof Error ? error.message : 'send-failed' })
    }
  }

  const found = rows.map(r => r.company)
  for (const name of BATCH) {
    if (!found.includes(name)) skipped.push({ company: name, reason: 'not-found' })
  }

  return NextResponse.json({ ok: failed.length === 0, requested: BATCH.length, found: rows.length, sentCount: sent.length, skippedCount: skipped.length, failedCount: failed.length, sent, skipped, failed })
}

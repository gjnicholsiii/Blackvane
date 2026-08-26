import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { Webhook } from 'svix'

export const dynamic = 'force-dynamic'

function db() {
  const url = process.env.BLACKVANE_DATABASE_URL || process.env.DATABASE_URL
  if (!url) throw new Error('BLACKVANE_DATABASE_URL is not configured')
  return neon(url)
}

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ ok: false, error: 'Webhook secret not configured' }, { status: 503 })

  const payload = await request.text()
  let event: any
  try {
    const wh = new Webhook(secret)
    event = wh.verify(payload, {
      'svix-id': request.headers.get('svix-id') || '',
      'svix-timestamp': request.headers.get('svix-timestamp') || '',
      'svix-signature': request.headers.get('svix-signature') || '',
    })
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const sql = db()
  const type = String(event?.type || '')
  const data = event?.data || {}
  const providerId = data?.email_id || data?.id || null
  const to = Array.isArray(data?.to) ? data.to[0] : data?.to || null
  const from = Array.isArray(data?.from) ? data.from[0] : data?.from || null

  let companyId: number | null = null
  if (providerId) {
    const rows = await sql`select company_id from outreach_messages where provider_message_id=${providerId} limit 1` as Array<{company_id:number}>
    companyId = rows[0]?.company_id || null
  }
  if (!companyId && (from || to)) {
    const email = String(from || to).toLowerCase()
    const rows = await sql`select id from outreach_companies where lower(email)=${email} limit 1` as Array<{id:number}>
    companyId = rows[0]?.id || null
  }

  if (companyId) {
    if (type === 'email.bounced' || type === 'email.complained') {
      await sql`update outreach_companies set suppressed=true,status='SUPPRESSED',suppression_reason=${type === 'email.bounced' ? 'Bounce' : 'Complaint'},next_send_at=null,updated_at=now() where id=${companyId}`
      await sql`update outreach_messages set status='CANCELLED' where company_id=${companyId} and status in ('DRAFT','QUEUED')`
    } else if (type === 'email.received') {
      await sql`update outreach_companies set status='REPLIED',last_reply_at=now(),next_send_at=null,updated_at=now() where id=${companyId}`
      await sql`update outreach_messages set status='CANCELLED' where company_id=${companyId} and status in ('DRAFT','QUEUED')`
    }
    await sql`insert into outreach_events(company_id,event_type,detail) values(${companyId},${type},${JSON.stringify(data).slice(0,4000)})`
  }

  return NextResponse.json({ ok: true })
}

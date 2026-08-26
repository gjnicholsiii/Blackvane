import { neon } from '@neondatabase/serverless'

export type OutreachCompany = {
  id: number
  company: string
  decision_maker: string | null
  decision_title: string | null
  email: string | null
  phone: string | null
  trigger_text: string | null
  lane: string | null
  score: number
  contact_quality: string
  status: string
  suppressed: boolean
  suppression_reason: string | null
  sequence_step: number
  next_send_at: string | null
  last_sent_at: string | null
}

export type OutreachSettings = {
  mode: string
  paused: boolean
  daily_new_limit: number
  daily_followup_limit: number
  sender_name: string
  sender_email: string | null
}

function sql() {
  const url = process.env.BLACKVANE_DATABASE_URL || process.env.DATABASE_URL
  if (!url) throw new Error('BLACKVANE_DATABASE_URL is not configured')
  return neon(url)
}

export async function getOutreachDashboard() {
  const db = sql()
  const companies = await db`
    select id, company, decision_maker, decision_title, email, phone, trigger_text, lane,
      score, contact_quality, status, suppressed, suppression_reason, sequence_step,
      next_send_at, last_sent_at
    from outreach_companies
    order by suppressed asc,
      case status when 'READY' then 0 when 'DRAFT' then 1 when 'QUEUED' then 2 when 'FOLLOW_UP' then 3 when 'NEW' then 4 else 9 end,
      score desc, company asc
  ` as OutreachCompany[]

  const settingsRows = await db`select mode, paused, daily_new_limit, daily_followup_limit, sender_name, sender_email from outreach_settings where id=1` as OutreachSettings[]
  const settings = settingsRows[0] || { mode: 'DRAFT', paused: false, daily_new_limit: 15, daily_followup_limit: 25, sender_name: 'Joe', sender_email: null }

  const messageStats = await db`
    select
      count(*) filter (where status='DRAFT')::int drafts,
      count(*) filter (where status='QUEUED')::int queued,
      count(*) filter (where status='SENT' and sent_at::date=current_date)::int sent_today,
      count(*) filter (where status='FAILED')::int failed
    from outreach_messages
  ` as Array<{drafts:number;queued:number;sent_today:number;failed:number}>

  const companyStats = await db`
    select
      count(*) filter (where suppressed=false)::int active,
      count(*) filter (where suppressed=true)::int suppressed,
      count(*) filter (where status='REPLIED')::int replied,
      count(*) filter (where status='MEETING')::int meetings,
      count(*) filter (where status in ('READY','DRAFT','QUEUED','FOLLOW_UP'))::int workable
    from outreach_companies
  ` as Array<{active:number;suppressed:number;replied:number;meetings:number;workable:number}>

  return { companies, settings, messages: messageStats[0], stats: companyStats[0] }
}

function firstName(name: string | null) {
  return (name || '').trim().split(/\s+/)[0] || 'there'
}

function subjectFor(company: OutreachCompany, step: number) {
  if (step === 1) return 'A growth question'
  return `Re: ${company.company}`
}

function bodyFor(company: OutreachCompany, step: number) {
  const name = firstName(company.decision_maker)
  const trigger = company.trigger_text || 'growing the business'

  if (step === 1) {
    return `Hi ${name},\n\nI’ve spent the last few years helping companies grow by roughly $25 million.\n\nWhat I learned is that growth usually exposes the problem before management can see it clearly. Sales, estimating, leadership, handoffs, accountability, margin. One of them starts costing money long before anyone labels it the problem.\n\nI’ve been looking at ${company.company} because ${trigger.charAt(0).toLowerCase()}${trigger.slice(1)}.\n\nI have a thought about where I’d look first.\n\nWorth a conversation?\n\nJoe`
  }

  if (step === 2) {
    return `${name}, one follow-up because the growth signal at ${company.company} is the kind of thing that usually exposes an expensive constraint before it becomes obvious.\n\nIf useful, I’ll tell you where I’d look first.\n\nJoe`
  }

  return `${name}, I’ll leave it here after this one. I’ve spent enough time inside growing companies to know the expensive problem is often sitting one layer below the obvious one.\n\nIf you want another set of eyes on ${company.company}, let’s talk.\n\nJoe`
}

export async function createDraft(companyId: number, step = 1) {
  const db = sql()
  const rows = await db`select id, company, decision_maker, decision_title, email, phone, trigger_text, lane, score, contact_quality, status, suppressed, suppression_reason, sequence_step, next_send_at, last_sent_at from outreach_companies where id=${companyId} limit 1` as OutreachCompany[]
  const company = rows[0]
  if (!company || company.suppressed || !company.email) return
  const subject = subjectFor(company, step)
  const body = bodyFor(company, step)
  await db`
    insert into outreach_messages(company_id,sequence_step,subject,body,status)
    values(${company.id},${step},${subject},${body},'DRAFT')
  `
  await db`update outreach_companies set status='DRAFT', sequence_step=${step}, updated_at=now() where id=${company.id}`
  await db`insert into outreach_events(company_id,event_type,detail) values(${company.id},'DRAFT_CREATED',${`Sequence step ${step}`})`
}

export async function mutateOutreach(companyId: number | null, action: string) {
  const db = sql()
  if (action === 'PAUSE_ALL') {
    await db`update outreach_settings set paused=true, updated_at=now() where id=1`
    return
  }
  if (action === 'RESUME_ALL') {
    await db`update outreach_settings set paused=false, updated_at=now() where id=1`
    return
  }
  if (action === 'MODE_DRAFT') {
    await db`update outreach_settings set mode='DRAFT', updated_at=now() where id=1`
    return
  }
  if (action === 'MODE_AUTO') {
    await db`update outreach_settings set mode='AUTO', updated_at=now() where id=1`
    return
  }
  if (!companyId) return
  if (action === 'SUPPRESS') {
    await db`update outreach_companies set suppressed=true,status='SUPPRESSED',suppression_reason='Never Contact',next_send_at=null,updated_at=now() where id=${companyId}`
    await db`update outreach_messages set status='CANCELLED' where company_id=${companyId} and status in ('DRAFT','QUEUED')`
    await db`insert into outreach_events(company_id,event_type,detail) values(${companyId},'SUPPRESSED','Never Contact')`
  } else if (action === 'RESTORE') {
    await db`update outreach_companies set suppressed=false,status='NEW',suppression_reason=null,updated_at=now() where id=${companyId}`
    await db`insert into outreach_events(company_id,event_type,detail) values(${companyId},'RESTORED','Restored to active pool')`
  } else if (action === 'REMOVE') {
    await db`update outreach_companies set status='SKIPPED',next_send_at=null,updated_at=now() where id=${companyId}`
    await db`insert into outreach_events(company_id,event_type,detail) values(${companyId},'REMOVED_FROM_BRIEF','Can reappear on a future signal')`
  } else if (action === 'HOLD') {
    await db`update outreach_companies set status='HOLD',next_send_at=null,updated_at=now() where id=${companyId}`
  } else if (action === 'READY') {
    await db`update outreach_companies set status='READY',updated_at=now() where id=${companyId}`
  } else if (action === 'QUEUE') {
    await db`update outreach_companies set status='QUEUED',next_send_at=now(),updated_at=now() where id=${companyId}`
    await db`update outreach_messages set status='QUEUED',scheduled_at=now() where id=(select id from outreach_messages where company_id=${companyId} and status='DRAFT' order by created_at desc limit 1)`
  } else if (action === 'DRAFT') {
    await createDraft(companyId, 1)
  }
}

export async function getSuppressedCompanies() {
  const db = sql()
  return await db`select id,company,decision_maker,email,suppression_reason from outreach_companies where suppressed=true order by company asc`
}

export type DecisionMaker = {
  name: string
  title: string
  email: string
  phone: string
  linkedinUrl: string
  organizationDomain: string
  source: 'Apollo' | 'Public'
  verified: boolean
}

const EXEC_TITLES = [
  'owner','founder','chief executive officer','ceo','president','chief operating officer','coo',
  'executive vice president','managing partner','general manager'
]

function str(v: unknown) { return typeof v === 'string' ? v : '' }
function firstPhone(person: any) {
  const direct = Array.isArray(person?.phone_numbers) ? person.phone_numbers.find((p:any)=>p?.sanitized_number || p?.raw_number) : null
  return str(direct?.sanitized_number || direct?.raw_number || person?.organization?.primary_phone?.number || person?.organization?.phone)
}

async function apollo(path: string, body: Record<string, unknown>) {
  const key = process.env.APOLLO_API_KEY
  if (!key) return null
  const res = await fetch(`https://api.apollo.io/api/v1/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'x-api-key': key, accept: 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store'
  })
  if (!res.ok) return null
  return res.json()
}

export async function findDecisionMaker(company: string): Promise<DecisionMaker | null> {
  if (!process.env.APOLLO_API_KEY || !company) return null

  const search: any = await apollo('mixed_people/api_search', {
    q_keywords: company,
    person_titles: EXEC_TITLES,
    person_seniorities: ['owner','founder','c_suite','vp'],
    person_locations: ['United States'],
    per_page: 10,
    page: 1
  })
  const people: any[] = search?.people || search?.contacts || []
  if (!people.length) return null

  const companyLower = company.toLowerCase()
  const ranked = people.sort((a:any,b:any) => {
    const aOrg = str(a?.organization?.name || a?.organization_name).toLowerCase()
    const bOrg = str(b?.organization?.name || b?.organization_name).toLowerCase()
    const aExact = aOrg.includes(companyLower) || companyLower.includes(aOrg) ? 1 : 0
    const bExact = bOrg.includes(companyLower) || companyLower.includes(bOrg) ? 1 : 0
    return bExact - aExact
  })
  const candidate = ranked[0]
  if (!candidate?.id) return null

  const match: any = await apollo('people/match', { id: candidate.id, reveal_personal_emails: false, reveal_phone_number: false })
  const person = match?.person || match
  if (!person) return null

  return {
    name: str(person.name || `${str(person.first_name)} ${str(person.last_name)}`.trim()),
    title: str(person.title),
    email: str(person.email),
    phone: firstPhone(person),
    linkedinUrl: str(person.linkedin_url),
    organizationDomain: str(person.organization?.primary_domain || person.organization?.website_url || person.organization?.domain),
    source: 'Apollo',
    verified: person.email_status === 'verified' || Boolean(person.email)
  }
}

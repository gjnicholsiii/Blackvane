import type { DecisionMaker } from './apollo-enrichment'

const EXECUTIVE_TERMS = [
  'owner','founder','chief executive officer','ceo','president','chief operating officer','coo',
  'executive vice president','managing partner','general manager'
]

function str(v: unknown) { return typeof v === 'string' ? v : '' }
function arr(v: unknown): any[] { return Array.isArray(v) ? v : [] }

async function lusha(path: string, body: Record<string, unknown>) {
  const key = process.env.LUSHA_API_KEY
  if (!key) return null
  const res = await fetch(`https://api.lusha.com/v3/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      api_key: key,
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(body),
    cache: 'no-store'
  })
  if (!res.ok) {
    console.error('Lusha API error', path, res.status, await res.text().catch(()=>''))
    return null
  }
  return res.json()
}

function getEmail(person: any) {
  const emails = arr(person?.emails)
  const work = emails.find((e:any)=> /work|business|professional/i.test(str(e?.type))) || emails[0]
  return str(work?.email || work?.address || work?.value || person?.email)
}

function getPhone(person: any) {
  const phones = arr(person?.phones)
  const direct = phones.find((p:any)=> /direct|mobile|work|business/i.test(str(p?.type))) || phones[0]
  return str(direct?.number || direct?.phone || direct?.value || person?.phone)
}

function getName(person: any) {
  return str(person?.name || person?.fullName || `${str(person?.firstName || person?.first_name)} ${str(person?.lastName || person?.last_name)}`.trim())
}

function getTitle(person: any) { return str(person?.title || person?.jobTitle || person?.job_title) }

function executiveRank(person: any) {
  const title = getTitle(person).toLowerCase()
  let rank = Number(person?.score || 0) * 10
  EXECUTIVE_TERMS.forEach((term, index)=> { if (title.includes(term)) rank += 100 - index })
  return rank
}

function flattenBuyingGroup(body: any) {
  const groups = arr(body?.results || body?.companies || body?.data)
  const contacts: any[] = []
  for (const group of groups) {
    const nested = arr(group?.contacts || group?.people || group?.results)
    for (const person of nested) contacts.push({ ...person, _companyRef: group?.clientReferenceId || group?.company?.clientReferenceId })
  }
  if (!contacts.length && Array.isArray(body?.results)) {
    for (const person of body.results) if (person?.id && (person?.title || person?.jobTitle || person?.roles)) contacts.push(person)
  }
  return contacts
}

export async function enrichCompaniesWithLusha(companies: string[], maxCompanies = 8): Promise<Map<string, DecisionMaker | null>> {
  const result = new Map<string, DecisionMaker | null>()
  const unique = [...new Set(companies.map(x=>x.trim()).filter(Boolean))].slice(0, Math.max(0, Math.min(maxCompanies, 20)))
  unique.forEach(c=>result.set(c, null))
  if (!process.env.LUSHA_API_KEY || !unique.length) return result

  const companySearch: any = await lusha('companies/search', {
    companies: unique.map((name, i)=>({ clientReferenceId: String(i), name })),
    options: { includePartialProfiles: true }
  })
  const companyRows = arr(companySearch?.results)
  const targets: Array<{company:string,id?:string,domain?:string,ref:string}> = []
  for (let i=0;i<unique.length;i++) {
    const row = companyRows.find((r:any)=> str(r?.clientReferenceId) === String(i)) || companyRows[i]
    if (!row) continue
    const id = str(row?.id || row?.companyId || row?.lushaCompanyId)
    const domain = str(row?.domain || row?.website || row?.companyDomain)
    if (id || domain) targets.push({ company: unique[i], id, domain, ref: String(i) })
  }
  if (!targets.length) return result

  const buying: any = await lusha('contacts/buying-group', {
    companies: targets.map(t=>({ clientReferenceId: t.ref, ...(t.id ? { id:t.id } : { domain:t.domain }) })),
    personas: ['decision_maker'],
    contactsLimit: 5,
    pagination: { page: 1, size: Math.max(10, Math.min(100, targets.length * 5)) }
  })
  const candidates = flattenBuyingGroup(buying)
  if (!candidates.length) return result

  const selected: Array<{company:string,person:any}> = []
  for (const target of targets) {
    const same = candidates.filter((p:any)=> {
      const ref = str(p?._companyRef || p?.clientReferenceId || p?.company?.clientReferenceId)
      const domain = str(p?.company?.domain || p?.companyDomain).toLowerCase()
      return ref === target.ref || (target.domain && domain === target.domain.toLowerCase())
    })
    const pool = same.length ? same : candidates.filter((p:any)=> {
      const companyName = str(p?.company?.name || p?.companyName).toLowerCase()
      return companyName && (companyName.includes(target.company.toLowerCase()) || target.company.toLowerCase().includes(companyName))
    })
    const person = [...pool].sort((a,b)=>executiveRank(b)-executiveRank(a))[0]
    if (person?.id) selected.push({ company:target.company, person })
  }
  if (!selected.length) return result

  const enriched: any = await lusha('contacts/enrich', {
    ids: selected.map(x=>str(x.person.id)),
    reveal: ['emails','phones']
  })
  const fullRows = arr(enriched?.results)
  for (const item of selected) {
    const full = fullRows.find((r:any)=>str(r?.id) === str(item.person.id)) || item.person
    const person = full || item.person
    result.set(item.company, {
      name: getName(person) || getName(item.person),
      title: getTitle(person) || getTitle(item.person),
      email: getEmail(person),
      phone: getPhone(person),
      linkedinUrl: str(person?.linkedinUrl || person?.linkedin_url || item.person?.linkedinUrl),
      organizationDomain: str(person?.company?.domain || person?.companyDomain || item.person?.company?.domain),
      source: 'Public',
      verified: Boolean(getEmail(person) || getPhone(person))
    })
  }
  return result
}

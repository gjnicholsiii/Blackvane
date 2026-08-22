import { findDecisionMaker, type DecisionMaker } from './apollo-enrichment'

export type LeadSignal = {
  company: string
  title: string
  location: string
  source: string
  sourceUrl: string
  publishedAt?: string
  vertical: 'PRIMARY' | 'SECONDARY'
  category: string
  score: number
  reason: string
  fit: string
  decisionMaker?: DecisionMaker | null
}

const CATEGORY_TERMS: Record<string,string[]> = {
  'ACCESS CONTROL': ['access control','card access','door access','credential','physical access'],
  'SURVEILLANCE': ['video surveillance','cctv','video security','camera systems','vms'],
  'SECURITY': ['security integrator','security integration','electronic security','physical security','intrusion','alarm systems'],
  'FIRE / LIFE SAFETY': ['fire alarm','life safety','fire protection','mass notification'],
  'NURSE CALL': ['nurse call','patient communication','wander management','healthcare communications'],
  'LOW VOLTAGE': ['low voltage','low-voltage','structured cabling','voice data','network cabling'],
  'AUDIO VISUAL': ['audio visual','audio/visual','av integration','pro av'],
  'BUILDING SYSTEMS': ['building automation','systems integrator','smart building','building controls']
}

const PRIMARY_TERMS = Object.values(CATEGORY_TERMS).flat()
const SALES_TERMS = [
  'vp sales','vice president sales','vice president of sales','director of sales','sales director','regional sales manager',
  'sales manager','business development director','director business development','chief revenue officer','cro','branch manager',
  'general manager','president','coo','chief operating officer','head of sales','sales leader'
]
const HIGH_VALUE_TERMS = ['vp sales','vice president','chief revenue officer','cro','director of sales','sales director','general manager','president','coo','head of sales']
const RECRUITER_TERMS = ['recruiter','staffing','talent acquisition','executive search','headhunter','recruitment']

function text(v: unknown) { return typeof v === 'string' ? v : '' }
function includesAny(haystack: string, terms: string[]) { const h = haystack.toLowerCase(); return terms.some(t => h.includes(t)) }
function categoryFor(blob: string) {
  const h = blob.toLowerCase()
  for (const [category, terms] of Object.entries(CATEGORY_TERMS)) if (terms.some(t=>h.includes(t))) return category
  return 'RELATED SYSTEMS'
}

function scoreLead(input: { title: string; company: string; description: string; location: string }) {
  const blob = `${input.title} ${input.company} ${input.description} ${input.location}`.toLowerCase()
  const primary = includesAny(blob, PRIMARY_TERMS)
  const sales = includesAny(blob, SALES_TERMS)
  let score = 30
  if (primary) score += 38
  if (sales) score += 18
  if (includesAny(blob, HIGH_VALUE_TERMS)) score += 10
  if (/sales|revenue|business development/.test(blob)) score += 4
  if (/manager|director|vice president|president|chief|head of/.test(blob)) score += 5
  if (includesAny(input.company, RECRUITER_TERMS)) score -= 25
  score = Math.max(0, Math.min(score, 99))
  const vertical = primary ? 'PRIMARY' as const : 'SECONDARY' as const
  const category = categoryFor(blob)
  const reason = primary && sales
    ? `${category} company showing a revenue-leadership hiring signal.`
    : primary
      ? `${category} company showing active hiring or expansion.`
      : 'Secondary company showing a potentially useful leadership or revenue signal.'
  const fit = includesAny(blob, HIGH_VALUE_TERMS) ? 'Fractional Sales Leadership' : sales ? 'Fractional / Diagnostic' : 'Diagnostic'
  return { score, vertical, category, reason, fit }
}

async function fetchPublicJobs(): Promise<LeadSignal[]> {
  const queries = [
    'access control sales director','security director of sales','video surveillance sales director','fire alarm sales director',
    'nurse call sales director','low voltage sales director','security integrator business development','structured cabling sales manager',
    'physical security sales manager','electronic security sales director','fire life safety business development','av integration sales director'
  ]
  const out: LeadSignal[] = []
  for (const q of queries) {
    try {
      const url = `https://api.jobopportunitiesapi.org/public/jobs?country=US&limit=100&q=${encodeURIComponent(q)}`
      const res = await fetch(url, { next: { revalidate: 3600 }, headers: { accept: 'application/json' } })
      if (!res.ok) continue
      const body: any = await res.json()
      const rows: any[] = Array.isArray(body) ? body : body.jobs || body.results || body.data || []
      for (const row of rows) {
        const title = text(row.title || row.job_title || row.position)
        const company = text(row.company?.name || row.company_name || row.company)
        const description = text(row.description || row.summary || row.snippet)
        const location = text(row.location?.name || row.location || row.city || row.region)
        const sourceUrl = text(row.url || row.apply_url || row.job_url || row.source_url)
        if (!title || !company) continue
        const scored = scoreLead({ title, company, description, location })
        if (scored.score < 58) continue
        out.push({ company, title, location, source: 'Public Jobs', sourceUrl, publishedAt: text(row.published_at || row.date_posted || row.created_at), ...scored })
      }
    } catch {}
  }
  return out
}

async function fetchMuseJobs(): Promise<LeadSignal[]> {
  const out: LeadSignal[] = []
  try {
    for (let page = 0; page < 8; page++) {
      const res = await fetch(`https://www.themuse.com/api/public/jobs?page=${page}`, { next: { revalidate: 3600 } })
      if (!res.ok) break
      const body: any = await res.json()
      const rows: any[] = body.results || []
      for (const row of rows) {
        const title = text(row.name)
        const company = text(row.company?.name)
        const description = text(row.contents)
        const location = Array.isArray(row.locations) ? row.locations.map((x:any)=>x.name).filter(Boolean).join(', ') : ''
        const sourceUrl = text(row.refs?.landing_page)
        const scored = scoreLead({ title, company, description, location })
        if (scored.score < 58) continue
        out.push({ company, title, location, source: 'The Muse', sourceUrl, publishedAt: text(row.publication_date), ...scored })
      }
    }
  } catch {}
  return out
}

function dedupe(leads: LeadSignal[]) {
  const seen = new Set<string>()
  return leads.filter(l => {
    const key = `${l.company}|${l.title}`.toLowerCase().replace(/\s+/g,' ')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function enrichTop(leads: LeadSignal[]) {
  const limit = Math.max(0, Math.min(Number(process.env.BLACKVANE_DAILY_ENRICH_LIMIT || 10), 25))
  if (!process.env.APOLLO_API_KEY || limit === 0) return leads
  const top = leads.filter(x => x.vertical === 'PRIMARY' && x.score >= 75 && !includesAny(x.company, RECRUITER_TERMS)).slice(0, limit)
  const map = new Map<string, DecisionMaker | null>()
  for (const lead of top) {
    try { map.set(lead.company, await findDecisionMaker(lead.company)) } catch { map.set(lead.company, null) }
  }
  return leads.map(l => ({ ...l, decisionMaker: map.has(l.company) ? map.get(l.company) : null }))
}

export async function getMorningBrief() {
  const gathered = dedupe([...(await fetchPublicJobs()), ...(await fetchMuseJobs())]).sort((a,b) => b.score - a.score)
  const enriched = await enrichTop(gathered)
  const primary = enriched.filter(x => x.vertical === 'PRIMARY')
  const secondary = enriched.filter(x => x.vertical === 'SECONDARY')
  return {
    generatedAt: new Date().toISOString(),
    primary: primary.slice(0, 40),
    secondary: secondary.slice(0, 10),
    stats: {
      scanned: gathered.length,
      primary: primary.length,
      highPriority: gathered.filter(x => x.score >= 80).length,
      enriched: primary.filter(x => x.decisionMaker?.name).length,
      sources: 2
    }
  }
}

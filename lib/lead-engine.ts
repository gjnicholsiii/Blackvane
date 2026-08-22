export type LeadSignal = {
  company: string
  title: string
  location: string
  source: string
  sourceUrl: string
  publishedAt?: string
  vertical: 'LOW VOLTAGE / SECURITY' | 'SECONDARY'
  score: number
  reason: string
  fit: string
}

const PRIMARY_TERMS = [
  'security integrator','security integration','access control','video surveillance','cctv','low voltage','low-voltage',
  'structured cabling','fire alarm','intrusion','physical security','electronic security','av integration','audio visual',
  'audio/visual','systems integrator','building automation','life safety'
]

const SALES_TERMS = [
  'vp sales','vice president sales','vice president of sales','director of sales','sales director','regional sales manager',
  'sales manager','business development director','director business development','chief revenue officer','cro','branch manager',
  'general manager','president','coo','chief operating officer'
]

const HIGH_VALUE_TERMS = ['vp sales','vice president','chief revenue officer','cro','director of sales','sales director','general manager','president','coo']

function text(v: unknown) { return typeof v === 'string' ? v : '' }
function includesAny(haystack: string, terms: string[]) { const h = haystack.toLowerCase(); return terms.some(t => h.includes(t)) }

function scoreLead(input: { title: string; company: string; description: string; location: string }) {
  const blob = `${input.title} ${input.company} ${input.description} ${input.location}`.toLowerCase()
  const primary = includesAny(blob, PRIMARY_TERMS)
  const sales = includesAny(blob, SALES_TERMS)
  let score = 35
  if (primary) score += 35
  if (sales) score += 18
  if (includesAny(blob, HIGH_VALUE_TERMS)) score += 10
  if (/sales|revenue|business development/.test(blob)) score += 5
  if (/manager|director|vice president|president|chief|head of/.test(blob)) score += 5
  score = Math.min(score, 99)
  const vertical = primary ? 'LOW VOLTAGE / SECURITY' as const : 'SECONDARY' as const
  const reason = primary && sales
    ? 'Primary vertical company showing a revenue-leadership hiring signal.'
    : primary
      ? 'Primary vertical company showing active hiring/growth.'
      : 'Secondary company showing a potentially useful leadership or revenue signal.'
  const fit = includesAny(blob, HIGH_VALUE_TERMS) ? 'Fractional Sales Leadership' : sales ? 'Fractional / Diagnostic' : 'Diagnostic'
  return { score, vertical, reason, fit }
}

async function fetchPublicJobs(): Promise<LeadSignal[]> {
  const queries = [
    'security sales manager','security director of sales','access control sales','low voltage sales manager',
    'security integrator business development','low voltage business development','structured cabling sales','physical security sales'
  ]
  const out: LeadSignal[] = []

  for (const q of queries) {
    try {
      const url = `https://api.jobopportunitiesapi.org/public/jobs?country=US&limit=50&q=${encodeURIComponent(q)}`
      const res = await fetch(url, { next: { revalidate: 3600 }, headers: { 'accept': 'application/json' } })
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
    for (let page = 0; page < 5; page++) {
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

export async function getMorningBrief() {
  const gathered = dedupe([...(await fetchPublicJobs()), ...(await fetchMuseJobs())])
    .sort((a,b) => b.score - a.score)
  const primary = gathered.filter(x => x.vertical === 'LOW VOLTAGE / SECURITY')
  const secondary = gathered.filter(x => x.vertical === 'SECONDARY')
  return {
    generatedAt: new Date().toISOString(),
    primary: primary.slice(0, 20),
    secondary: secondary.slice(0, 10),
    stats: {
      scanned: gathered.length,
      primary: primary.length,
      highPriority: gathered.filter(x => x.score >= 80).length,
      sources: 2
    }
  }
}

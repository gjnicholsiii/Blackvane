import { NextResponse } from 'next/server'
import { getMorningBrief } from '../../../../lib/lead-engine'

export const dynamic = 'force-dynamic'

export async function GET() {
  const brief = await getMorningBrief()
  return NextResponse.json(brief, {
    headers: {
      'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600'
    }
  })
}

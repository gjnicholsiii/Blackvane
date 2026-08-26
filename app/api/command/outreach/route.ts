import { NextRequest, NextResponse } from 'next/server'
import { mutateOutreach } from '../../../../lib/outreach-engine'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const action = String(form.get('action') || '')
  const rawId = form.get('companyId')
  const companyId = rawId ? Number(rawId) : null

  try {
    await mutateOutreach(Number.isFinite(companyId as number) ? companyId : null, action)
    return NextResponse.redirect(new URL('/command', request.url), 303)
  } catch (error) {
    const target = new URL('/command', request.url)
    target.searchParams.set('outreachError', error instanceof Error ? error.message : 'Outreach update failed')
    return NextResponse.redirect(target, 303)
  }
}

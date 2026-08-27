import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export const dynamic = 'force-dynamic'

const TOKEN = 'lv7q2m9k4x1p8s6r'
const PRIOR = [
'ADT','Advanced Security Systems','Alarm Detection Systems Inc.','Alarm New England','All Guard Alarm Systems Inc.','CPI Security Systems Inc.','Cook Solutions Group','Custom Alarm','Doyle Security Systems Inc.','EPS Security','EyeQ Monitoring','Gillmore Security Systems Inc.','Guardian Protection','Habitec Security','Minuteman Security & Life Safety','Pavion Corp.','Post Alarm Systems','Powered Protection','RapidFire Safety & Security','Revolution Fire Alarm','Safe Home Security Inc. / Security Systems Inc.','Safe and Sound Security','SafeTouch LLC','Securitas Technology','Security 101','Security Alarm Corporation','Security Equipment Inc.','Sonitrol of Evansville Inc.','Source 1 Solutions','SSD Alarm','Tech Systems Inc.','Titan Alarm, Inc','Vector Security','Zeus Fire and Security','N&W Systems','EMC Security','Kastle Systems International'
]
function db(){ const url=process.env.BLACKVANE_DATABASE_URL||process.env.DATABASE_URL; if(!url) throw new Error('DB not configured'); return neon(url) }
export async function GET(request:NextRequest){
 if(request.nextUrl.searchParams.get('token')!==TOKEN) return NextResponse.json({ok:false},{status:401})
 const sql=db()
 const rows=await sql`
  select id,company,decision_maker,decision_title,email,lane,trigger_text,score,status,suppressed
  from outreach_companies
  where suppressed=false
    and decision_maker is not null
    and email is not null
    and company <> all(${PRIOR})
    and (
      lower(company) like '%security%'
      or lower(company) like '%systems%'
      or lower(company) like '%technology%'
      or lower(company) like '%communications%'
      or lower(company) like '%low voltage%'
      or lower(company) like '%integration%'
      or lower(company) like '%integrator%'
      or lower(lane) like '%security%'
      or lower(lane) like '%low voltage%'
      or lower(trigger_text) like '%access control%'
      or lower(trigger_text) like '%video surveillance%'
      or lower(trigger_text) like '%low voltage%'
      or lower(trigger_text) like '%security integration%'
    )
    and lower(company) not like '%sprinkler%'
    and lower(company) not like '%fire protection%'
    and lower(company) not like '%firestop%'
  order by score desc, company asc
 ` as any[]
 return NextResponse.json({ok:true,count:rows.length,rows})
}

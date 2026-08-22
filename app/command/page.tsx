import './command.css'
import { getMorningBrief } from '../../lib/lead-engine'

export default async function CommandPage() {
  const brief = await getMorningBrief()
  return (
    <main className="command-shell">
      <aside className="command-rail">
        <div><div className="command-mark">BLACKVANE</div><div className="command-label">MORNING BRIEF</div></div>
        <nav><a className="active" href="#brief">Brief</a><a href="#primary">Low Voltage + Security <span>{brief.stats.primary}</span></a><a href="#secondary">Secondary <span>{brief.secondary.length}</span></a></nav>
        <div className="rail-foot">PRIVATE / OWNER ACCESS</div>
      </aside>
      <section className="command-main">
        <header className="command-top" id="brief"><div><p className="eyebrow">BLACKVANE INTERNAL · LIVE MORNING BRIEF</p><h1>Here’s where the money is.</h1></div><a className="run-button" href="/command">REFRESH BRIEF</a></header>
        <section className="brief-card"><div className="brief-kicker">TODAY’S READ</div><p><strong>{brief.stats.primary} primary-vertical signals</strong> are live right now. {brief.stats.highPriority} score 80 or higher. Every lead below is tied to a current public source.</p><div className="brief-actions"><span>PRIMARY VERTICAL</span><b>LOW VOLTAGE + SECURITY</b><span>UPDATED</span><b>{new Date(brief.generatedAt).toLocaleString('en-US',{timeZone:'America/Chicago',hour:'numeric',minute:'2-digit',month:'short',day:'numeric'})} CT</b></div></section>
        <section className="metrics-grid"><article><span>SIGNALS SCANNED</span><strong>{brief.stats.scanned}</strong><em>Current qualified records</em></article><article><span>PRIMARY SIGNALS</span><strong>{brief.stats.primary}</strong><em>Low voltage + security</em></article><article><span>HIGH PRIORITY</span><strong>{brief.stats.highPriority}</strong><em>Score 80+</em></article><article className="priority"><span>DATA SOURCES</span><strong>{brief.stats.sources}</strong><em>Live feeds</em></article></section>
        <section className="command-section" id="primary"><div className="section-head"><div><p className="eyebrow">PRIMARY VERTICAL</p><h2>Low voltage + security</h2></div></div><div className="lead-table"><div className="lead-row live-head"><span>SCORE</span><span>COMPANY / SIGNAL</span><span>LOCATION</span><span>BLACKVANE FIT</span><span>SOURCE</span><span></span></div>{brief.primary.length ? brief.primary.map((lead)=><div className="lead-row" key={`${lead.company}-${lead.title}`}><span className="score">{lead.score}</span><span><b>{lead.company}</b><small>{lead.title}</small></span><span>{lead.location||'US'}</span><span>{lead.fit}</span><span><small>{lead.source}</small></span><span>{lead.sourceUrl?<a className="source-link" href={lead.sourceUrl} target="_blank" rel="noreferrer">SOURCE</a>:null}</span></div>):<div className="empty-state">No primary-vertical signals were returned on this refresh.</div>}</div></section>
        <section className="command-section secondary-section" id="secondary"><div className="section-head"><div><p className="eyebrow">SECONDARY VERTICALS</p><h2>Everything else worth seeing</h2></div></div><div className="lead-table"><div className="lead-row live-head"><span>SCORE</span><span>COMPANY / SIGNAL</span><span>LOCATION</span><span>BLACKVANE FIT</span><span>SOURCE</span><span></span></div>{brief.secondary.length ? brief.secondary.map((lead)=><div className="lead-row subdued" key={`${lead.company}-${lead.title}`}><span className="score">{lead.score}</span><span><b>{lead.company}</b><small>{lead.title}</small></span><span>{lead.location||'US'}</span><span>{lead.fit}</span><span><small>{lead.source}</small></span><span>{lead.sourceUrl?<a className="source-link" href={lead.sourceUrl} target="_blank" rel="noreferrer">SOURCE</a>:null}</span></div>):<div className="empty-state">No secondary signals on this refresh.</div>}</div></section>
      </section>
    </main>
  )
}

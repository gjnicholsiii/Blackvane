import './command.css'

const leads = [
  { company: 'Northstar Industrial', score: 94, signal: 'VP Sales open 52 days', size: '84 employees', buyer: 'CEO', angle: 'Fractional Sales', value: '$90K ARR' },
  { company: 'Harbor Systems', score: 91, signal: 'Sales leader departed', size: '61 employees', buyer: 'President', angle: 'Diagnostic + Fractional', value: '$120K' },
  { company: 'Keystone Services', score: 88, signal: '6 revenue hires in 30 days', size: '133 employees', buyer: 'Founder', angle: 'Revenue Diagnostic', value: '$30K' },
  { company: 'Crestline Group', score: 86, signal: 'New market expansion', size: '47 employees', buyer: 'CEO', angle: 'Fractional Sales', value: '$72K ARR' },
  { company: 'Ironwood Technologies', score: 82, signal: 'Director of Sales open 39 days', size: '102 employees', buyer: 'COO', angle: 'Fractional Sales', value: '$72K ARR' },
]

export default function CommandPage() {
  return (
    <main className="command-shell">
      <aside className="command-rail">
        <div><div className="command-mark">BLACKVANE</div><div className="command-label">COMMAND</div></div>
        <nav><a className="active" href="#overview">Overview</a><a href="#leads">Lead Feed <span>22</span></a><a href="#outreach">Outreach <span>19</span></a><a href="#replies">Replies <span>6</span></a><a href="#pipeline">Pipeline <span>4</span></a></nav>
        <div className="rail-foot">PRIVATE / OWNER ACCESS</div>
      </aside>
      <section className="command-main">
        <header className="command-top"><div><p className="eyebrow">BLACKVANE INTERNAL</p><h1>Find me revenue.</h1></div><button className="run-button">RUN SEARCH</button></header>
        <section id="overview" className="metrics-grid">
          <article><span>COMPANIES SCANNED</span><strong>186</strong><em>+31 today</em></article><article><span>QUALIFIED</span><strong>22</strong><em>11.8% hit rate</em></article><article><span>ACTIVE OUTREACH</span><strong>19</strong><em>3 paused</em></article><article className="priority"><span>NEEDS YOU</span><strong>3</strong><em>Interested buyers</em></article>
        </section>
        <section className="command-section" id="leads">
          <div className="section-head"><div><p className="eyebrow">TODAY'S SIGNALS</p><h2>Best opportunities</h2></div><div className="filter-row"><button className="selected">ALL</button><button>FRACTIONAL</button><button>DIAGNOSTIC</button></div></div>
          <div className="lead-table"><div className="lead-row table-head"><span>SCORE</span><span>COMPANY / SIGNAL</span><span>BUYER</span><span>BLACKVANE FIT</span><span>VALUE</span><span></span></div>{leads.map((lead) => (<div className="lead-row" key={lead.company}><span className="score">{lead.score}</span><span><b>{lead.company}</b><small>{lead.signal} · {lead.size}</small></span><span>{lead.buyer}</span><span>{lead.angle}</span><span>{lead.value}</span><span><button className="review">REVIEW</button></span></div>))}</div>
        </section>
        <section className="lower-grid"><article className="panel" id="replies"><div className="panel-head"><p className="eyebrow">REPLIES</p><span className="live-dot">LIVE</span></div><h3>3 conversations need you</h3><div className="reply-item"><b>Sarah Miller · CEO</b><span>“Yes, send me the two things you noticed.”</span><button>OPEN</button></div><div className="reply-item"><b>David Chen · Founder</b><span>“We may need interim sales leadership.”</span><button>OPEN</button></div><div className="reply-item"><b>Marcus Reid · President</b><span>“Can you talk next week?”</span><button>OPEN</button></div></article><article className="panel opportunity-panel" id="pipeline"><p className="eyebrow">OPEN PIPELINE</p><div className="pipeline-number">$312K</div><p className="muted">Potential first-year value</p><div className="pipeline-line"><span>Fractional Sales</span><b>$252K</b></div><div className="pipeline-line"><span>Diagnostics</span><b>$60K</b></div><div className="pipeline-line"><span>Active prospects</span><b>14</b></div></article></section>
        <section className="command-section" id="outreach"><div className="section-head"><div><p className="eyebrow">OUTREACH QUEUE</p><h2>Ready to send</h2></div><button className="ghost-button">APPROVE TOP 5</button></div><div className="outreach-card"><div className="outreach-meta"><span>94</span><div><b>Northstar Industrial</b><small>To: Sarah Miller, CEO</small></div></div><div className="message-preview">Sarah, I noticed Northstar has been looking for a VP of Sales for nearly two months while the team keeps growing. That is usually the point where the leadership gap starts costing more than the search itself. I had two observations about what Northstar appears to be dealing with. Worth sending them over?</div><div className="outreach-actions"><button className="reject">SKIP</button><button className="approve">APPROVE & SEND</button></div></div></section>
      </section>
    </main>
  )
}

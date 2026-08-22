import './command.css'

const primaryLeads = [
  { company: 'Sentinel Integration Group', score: 96, vertical: 'Security Integrator', signal: 'Hiring VP Sales · 41 days', buyer: 'President', fit: 'Fractional Sales', value: '$90K ARR' },
  { company: 'Apex Low Voltage', score: 93, vertical: 'Low Voltage', signal: '3 sales hires + new branch', buyer: 'Owner', fit: 'Fractional Sales', value: '$72K ARR' },
  { company: 'Metro Access Systems', score: 91, vertical: 'Access Control', signal: 'Sales leader departed', buyer: 'CEO', fit: 'Diagnostic + Fractional', value: '$120K' },
  { company: 'SecurePath Technologies', score: 89, vertical: 'Video / Security', signal: 'Director of Sales open 36 days', buyer: 'COO', fit: 'Fractional Sales', value: '$72K ARR' },
]

const secondaryLeads = [
  { company: 'Northstar Industrial', score: 84, vertical: 'Industrial Services', signal: 'VP Sales open 52 days', buyer: 'CEO', fit: 'Fractional Sales', value: '$90K ARR' },
  { company: 'Keystone Services', score: 81, vertical: 'Business Services', signal: '6 revenue hires in 30 days', buyer: 'Founder', fit: 'Revenue Diagnostic', value: '$30K' },
]

export default function CommandPage() {
  return (
    <main className="command-shell">
      <aside className="command-rail">
        <div><div className="command-mark">BLACKVANE</div><div className="command-label">MORNING BRIEF</div></div>
        <nav>
          <a className="active" href="#brief">Brief</a>
          <a href="#primary">Low Voltage + Security <span>14</span></a>
          <a href="#secondary">Secondary <span>8</span></a>
          <a href="#outreach">Outreach <span>11</span></a>
          <a href="#replies">Replies <span>3</span></a>
        </nav>
        <div className="rail-foot">PRIVATE / OWNER ACCESS</div>
      </aside>

      <section className="command-main">
        <header className="command-top" id="brief">
          <div><p className="eyebrow">BLACKVANE INTERNAL · MORNING BRIEF</p><h1>Here’s where the money is.</h1></div>
          <button className="run-button">REFRESH BRIEF</button>
        </header>

        <section className="brief-card">
          <div className="brief-kicker">TODAY’S READ</div>
          <p><strong>14 high-fit companies</strong> surfaced in low-voltage and security. Four are worth immediate attention. Two have open sales leadership roles, one just lost its sales leader, and one is expanding while adding sales headcount.</p>
          <div className="brief-actions"><span>PRIMARY VERTICAL</span><b>LOW VOLTAGE + SECURITY</b><span>SECONDARY</span><b>ALL OTHER FITS</b></div>
        </section>

        <section className="metrics-grid">
          <article><span>PRIMARY SIGNALS</span><strong>14</strong><em>Low voltage + security</em></article>
          <article><span>HIGH PRIORITY</span><strong>4</strong><em>Score 89+</em></article>
          <article><span>READY TO SEND</span><strong>11</strong><em>Email only</em></article>
          <article className="priority"><span>NEEDS YOU</span><strong>3</strong><em>Interested buyers</em></article>
        </section>

        <section className="command-section" id="primary">
          <div className="section-head"><div><p className="eyebrow">PRIMARY VERTICAL</p><h2>Low voltage + security</h2></div><div className="filter-row"><button className="selected">ALL</button><button>SECURITY</button><button>LOW VOLTAGE</button><button>ACCESS</button></div></div>
          <div className="lead-table">
            <div className="lead-row table-head"><span>SCORE</span><span>COMPANY / SIGNAL</span><span>VERTICAL</span><span>BUYER</span><span>BLACKVANE FIT</span><span>VALUE</span></div>
            {primaryLeads.map((lead) => (<div className="lead-row" key={lead.company}><span className="score">{lead.score}</span><span><b>{lead.company}</b><small>{lead.signal}</small></span><span>{lead.vertical}</span><span>{lead.buyer}</span><span>{lead.fit}</span><span>{lead.value}</span></div>))}
          </div>
        </section>

        <section className="lower-grid" id="replies">
          <article className="panel"><div className="panel-head"><p className="eyebrow">WHAT NEEDS YOUR ATTENTION</p><span className="live-dot">3 OPEN</span></div><h3>Three conversations. That’s your work.</h3><div className="reply-item"><b>Security Integrator · President</b><span>“Yes. Send me what you noticed.”</span><button>OPEN</button></div><div className="reply-item"><b>Low Voltage Contractor · Owner</b><span>“We are looking at outside sales leadership.”</span><button>OPEN</button></div><div className="reply-item"><b>Access Control Firm · CEO</b><span>“Can you talk this week?”</span><button>OPEN</button></div></article>
          <article className="panel opportunity-panel"><p className="eyebrow">PRIMARY VERTICAL PIPELINE</p><div className="pipeline-number">$354K</div><p className="muted">Potential first-year value</p><div className="pipeline-line"><span>Low voltage + security</span><b>$294K</b></div><div className="pipeline-line"><span>Secondary verticals</span><b>$60K</b></div><div className="pipeline-line"><span>Active prospects</span><b>14</b></div></article>
        </section>

        <section className="command-section" id="outreach">
          <div className="section-head"><div><p className="eyebrow">BEST OUTREACH THIS MORNING</p><h2>Ready to send</h2></div><button className="ghost-button">APPROVE TOP 5</button></div>
          <div className="outreach-card"><div className="outreach-meta"><span>96</span><div><b>Sentinel Integration Group</b><small>Security Integrator · President</small></div></div><div className="message-preview">I noticed Sentinel has been looking for sales leadership for more than a month while continuing to pursue integration work. In this industry, that gap usually shows up fast in pipeline ownership, estimator handoff and account coverage. I had two observations about what I’d look at first. Worth sending them over?</div><div className="outreach-actions"><button className="reject">SKIP</button><button className="approve">APPROVE & SEND</button></div></div>
        </section>

        <section className="command-section secondary-section" id="secondary">
          <div className="section-head"><div><p className="eyebrow">SECONDARY VERTICALS</p><h2>Everything else worth seeing</h2></div></div>
          <div className="lead-table">
            <div className="lead-row table-head"><span>SCORE</span><span>COMPANY / SIGNAL</span><span>VERTICAL</span><span>BUYER</span><span>BLACKVANE FIT</span><span>VALUE</span></div>
            {secondaryLeads.map((lead) => (<div className="lead-row subdued" key={lead.company}><span className="score">{lead.score}</span><span><b>{lead.company}</b><small>{lead.signal}</small></span><span>{lead.vertical}</span><span>{lead.buyer}</span><span>{lead.fit}</span><span>{lead.value}</span></div>))}
          </div>
        </section>
      </section>
    </main>
  )
}

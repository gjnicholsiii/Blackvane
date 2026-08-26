import './command.css'
import { getMorningBrief } from '../../lib/lead-engine'
import { getOutreachDashboard } from '../../lib/outreach-engine'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function statusClass(status: string) {
  return `status-pill status-${status.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`
}

export default async function CommandPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const paramError = Array.isArray(params.outreachError) ? params.outreachError[0] : params.outreachError
  const brief = await getMorningBrief()
  let outreach: Awaited<ReturnType<typeof getOutreachDashboard>> | null = null
  let outreachError = paramError || ''
  try { outreach = await getOutreachDashboard() } catch (error) { outreachError = outreachError || (error instanceof Error ? error.message : 'Outreach database unavailable') }

  const activeCompanies = outreach?.companies.filter(c => !c.suppressed && !['SKIPPED','WON','CLOSED'].includes(c.status)) || []
  const suppressedCompanies = outreach?.companies.filter(c => c.suppressed) || []

  return (
    <main className="command-shell">
      <aside className="command-rail">
        <div><div className="command-mark">BLACKVANE</div><div className="command-label">MORNING BRIEF</div></div>
        <nav>
          <a className="active" href="#brief">Brief</a>
          <a href="#engine">Email Engine <span>{outreach?.stats.workable || 0}</span></a>
          <a href="#database">Prospects <span>{outreach?.stats.active || 0}</span></a>
          <a href="#suppressed">Suppressed <span>{outreach?.stats.suppressed || 0}</span></a>
          <a href="#signals">Live Signals <span>{brief.stats.primary}</span></a>
        </nav>
        <div className="rail-foot">PRIVATE / OWNER ACCESS</div>
      </aside>

      <section className="command-main">
        <header className="command-top" id="brief">
          <div><p className="eyebrow">BLACKVANE INTERNAL · LIVE MORNING BRIEF</p><h1>People worth contacting.</h1></div>
          <a className="run-button" href="/command">REFRESH BRIEF</a>
        </header>

        {outreachError && <section className="engine-alert"><strong>Email engine needs one connection.</strong><span>{outreachError}</span></section>}

        <section className="brief-card">
          <div className="brief-kicker">TODAY’S READ</div>
          <p><strong>{outreach?.stats.active || 52} persistent prospects</strong> in the master pool. {brief.stats.primary} new primary-vertical signals are being watched. {brief.stats.highPriority} current live signals score 80 or higher.</p>
          <div className="brief-actions"><span>PRIMARY</span><b>ACCESS · SURVEILLANCE · SECURITY · FIRE · NURSE CALL · LOW VOLTAGE · AV</b><span>UPDATED</span><b>{new Date(brief.generatedAt).toLocaleString('en-US',{timeZone:'America/Chicago',hour:'numeric',minute:'2-digit',month:'short',day:'numeric'})} CT</b></div>
        </section>

        <section className="metrics-grid">
          <article><span>MASTER PROSPECTS</span><strong>{outreach?.stats.active ?? 52}</strong><em>Persistent company records</em></article>
          <article><span>DRAFTS</span><strong>{outreach?.messages.drafts ?? 0}</strong><em>Awaiting review</em></article>
          <article><span>QUEUED</span><strong>{outreach?.messages.queued ?? 0}</strong><em>Ready to send</em></article>
          <article className="priority"><span>REPLIES / MEETINGS</span><strong>{outreach ? `${outreach.stats.replied} / ${outreach.stats.meetings}` : '0 / 0'}</strong><em>Actual outcomes</em></article>
        </section>

        <section className="command-section engine-section" id="engine">
          <div className="section-head engine-head">
            <div><p className="eyebrow">EMAIL ENGINE</p><h2>Draft first. Automate when proven.</h2></div>
            {outreach && <div className="engine-controls">
              <form action="/api/command/outreach" method="post"><input type="hidden" name="action" value={outreach.settings.paused ? 'RESUME_ALL' : 'PAUSE_ALL'} /><button className={outreach.settings.paused ? 'run-button' : 'danger-button'}>{outreach.settings.paused ? 'RESUME ALL' : 'PAUSE ALL'}</button></form>
              <form action="/api/command/outreach" method="post"><input type="hidden" name="action" value={outreach.settings.mode === 'AUTO' ? 'MODE_DRAFT' : 'MODE_AUTO'} /><button className="run-button">MODE: {outreach.settings.mode}</button></form>
            </div>}
          </div>
          <div className="engine-strip">
            <div><span>STATUS</span><b>{outreach?.settings.paused ? 'PAUSED' : 'ACTIVE'}</b></div>
            <div><span>NEW / DAY</span><b>{outreach?.settings.daily_new_limit ?? 15}</b></div>
            <div><span>FOLLOW-UPS / DAY</span><b>{outreach?.settings.daily_followup_limit ?? 25}</b></div>
            <div><span>SENDER</span><b>{outreach?.settings.sender_email || 'NOT CONNECTED'}</b></div>
          </div>
        </section>

        <section className="command-section" id="database">
          <div className="section-head"><div><p className="eyebrow">MASTER PROSPECT DATABASE</p><h2>One company. One history. One outreach state.</h2></div></div>
          <div className="prospect-stack">
            {activeCompanies.length ? activeCompanies.map(company => (
              <article className="prospect-card" key={company.id}>
                <div className="prospect-score"><strong>{company.score}</strong><span>SCORE</span></div>
                <div className="prospect-core">
                  <div className="prospect-title"><div><h3>{company.company}</h3><span className={statusClass(company.status)}>{company.status}</span></div><small>{company.lane || 'Diagnostic'}</small></div>
                  <p>{company.trigger_text || 'Qualified Blackvane prospect.'}</p>
                  <div className="prospect-contact"><span><b>{company.decision_maker || 'Decision maker pending'}</b>{company.decision_title ? ` · ${company.decision_title}` : ''}</span><span>{company.email || 'No public email'}{company.contact_quality === 'routing' ? ' · ROUTING INBOX' : ''}</span><span>{company.phone || 'Phone unavailable'}</span></div>
                </div>
                <div className="prospect-actions">
                  <form action="/api/command/outreach" method="post"><input type="hidden" name="companyId" value={company.id}/><input type="hidden" name="action" value="DRAFT"/><button>DRAFT</button></form>
                  <form action="/api/command/outreach" method="post"><input type="hidden" name="companyId" value={company.id}/><input type="hidden" name="action" value="QUEUE"/><button>QUEUE</button></form>
                  <form action="/api/command/outreach" method="post"><input type="hidden" name="companyId" value={company.id}/><input type="hidden" name="action" value="HOLD"/><button>HOLD</button></form>
                  <form action="/api/command/outreach" method="post"><input type="hidden" name="companyId" value={company.id}/><input type="hidden" name="action" value="REMOVE"/><button>REMOVE FROM BRIEF</button></form>
                  <form action="/api/command/outreach" method="post"><input type="hidden" name="companyId" value={company.id}/><input type="hidden" name="action" value="SUPPRESS"/><button className="danger-text">NEVER CONTACT</button></form>
                </div>
              </article>
            )) : <div className="empty-state">The persistent prospect database will appear here when the database connection is active.</div>}
          </div>
        </section>

        <section className="command-section" id="suppressed">
          <div className="section-head"><div><p className="eyebrow">SUPPRESSED COMPANIES</p><h2>Companies Blackvane will never contact.</h2></div></div>
          <div className="suppressed-list">
            {suppressedCompanies.length ? suppressedCompanies.map(company => <div className="suppressed-row" key={company.id}><div><b>{company.company}</b><small>{company.suppression_reason || 'Suppressed'}</small></div><span>{company.email || '—'}</span><form action="/api/command/outreach" method="post"><input type="hidden" name="companyId" value={company.id}/><input type="hidden" name="action" value="RESTORE"/><button>RESTORE</button></form></div>) : <div className="empty-state">No companies are permanently suppressed.</div>}
          </div>
        </section>

        <section className="command-section secondary-section" id="signals">
          <div className="section-head"><div><p className="eyebrow">LIVE DISCOVERY</p><h2>New signals feeding the master database.</h2></div></div>
          <div className="lead-table contact-table">
            <div className="contact-row live-head"><span>SCORE</span><span>COMPANY</span><span>VERTICAL / SIGNAL</span><span>DECISION MAKER</span><span>EMAIL</span><span>PHONE</span><span>SOURCE</span></div>
            {brief.primary.slice(0,20).map((lead)=><div className="contact-row" key={`${lead.company}-${lead.title}`}><span className="score">{lead.score}</span><span><b>{lead.company}</b><small>{lead.location||'United States'}</small></span><span><b>{lead.category}</b><small>{lead.title}</small></span><span>{lead.decisionMaker?.name?<><b>{lead.decisionMaker.name}</b><small>{lead.decisionMaker.title||'Executive'}</small></>:<small>Not enriched</small>}</span><span>{lead.decisionMaker?.email?<a className="contact-link" href={`mailto:${lead.decisionMaker.email}`}>{lead.decisionMaker.email}</a>:<small>—</small>}</span><span>{lead.decisionMaker?.phone||'—'}</span><span>{lead.sourceUrl?<a className="source-link" href={lead.sourceUrl} target="_blank" rel="noreferrer">EVIDENCE</a>:lead.source}</span></div>)}
          </div>
        </section>
      </section>
    </main>
  )
}

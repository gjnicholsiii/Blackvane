export default function ExpertisePage() {
  const disciplines = [
    ["Growth", "Revenue strategy, pipeline discipline, pricing, sales execution, and the operating habits that turn opportunity into repeatable performance."],
    ["People & Culture", "Leadership behavior, accountability, engagement, retention, and the signals that shape how people actually experience the organization."],
    ["Operational Performance", "Workflow, ownership, decision speed, handoffs, capacity, and the systems that determine whether execution moves or stalls."],
    ["Strategy & Alignment", "Priority clarity, resource allocation, cross-functional alignment, and the decisions that connect intention to execution."],
    ["Risk & Governance", "Exposure, controls, leadership judgment, reputational vulnerability, and the conditions that can quietly compromise results."],
    ["Executive Counsel", "Direct perspective for leaders facing consequential decisions, stalled performance, organizational friction, or change that cannot wait."],
  ];

  return (
    <main className="bv-page">
      <section className="bv-hero">
        <div className="bv-hero-copy">
          <p className="bv-kicker">Expertise</p>
          <h1>Experience built<br />inside the work.</h1>
          <p className="bv-hero-lead">
            Blackvane 13 brings an operator&apos;s view to organizational performance. Sales, operations, leadership, execution, and the decisions that connect them.
          </p>
        </div>
        <div className="bv-hero-side">
          Operator perspective.<br />Commercial discipline.<br />Organizational judgment.<br />Executive focus.
        </div>
      </section>

      <section className="bv-section">
        <div className="bv-section-head">
          <h2>Depth that<br />crosses functions.</h2>
          <p>
            Organizational problems rarely respect department lines. The useful perspective is the one that can follow a signal from strategy into behavior, from behavior into execution, and from execution into results.
          </p>
        </div>
        <div className="bv-list">
          {disciplines.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bv-section">
        <div className="bv-section-head">
          <h2>Perspective<br />earned over time.</h2>
          <p>Years inside complex sales and operating environments create pattern recognition that is difficult to reproduce from outside the work.</p>
        </div>
        <div className="bv-metrics">
          <div className="bv-metric"><strong>25+</strong><span>Years across sales, operations and organizational performance</span></div>
          <div className="bv-metric"><strong>Sales</strong><span>Growth engines, pricing, pipeline and execution</span></div>
          <div className="bv-metric"><strong>Ops</strong><span>Structure, accountability and operating discipline</span></div>
          <div className="bv-metric"><strong>Leadership</strong><span>Judgment, alignment and consequential decisions</span></div>
        </div>
      </section>

      <section className="bv-callout">
        <div className="bv-callout-copy">
          <p className="bv-kicker">What Matters</p>
          <h2>Experience is useful when it improves the next decision.</h2>
          <p>That is the standard applied to every Blackvane 13 engagement.</p>
        </div>
        <a className="bv-button" href="mailto:joe@blackvane13.com">Start a Confidential Conversation</a>
      </section>
    </main>
  );
}

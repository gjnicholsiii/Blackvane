export default function DiagnosticsPage() {
  const areas = [
    ["01", "Revenue", "Pipeline quality, forecast integrity, sales execution, pricing power, compensation, and the behaviors driving the number."],
    ["02", "Retention", "Leadership behavior, engagement, recognition, cultural friction, and the conditions that determine who stays and who leaves."],
    ["03", "Execution", "Decision speed, handoffs, bottlenecks, meetings, metrics, ownership, and the operating drag slowing the business."],
    ["04", "Strategy", "Choice clarity, resource alignment, tradeoffs, priorities, and whether the stated strategy survives contact with daily operations."],
    ["05", "Risk & Exposure", "Financial, operational, reputational, and leadership risks capable of undermining performance before they become obvious."],
  ];

  return (
    <main className="bv-page">
      <section className="bv-hero">
        <div className="bv-hero-copy">
          <p className="bv-kicker">Organizational Diagnostics</p>
          <h1>See what&apos;s real.<br />Fix what matters.</h1>
          <p className="bv-hero-lead">
            Blackvane 13 examines the signals leadership rarely gets to see together and turns them into one clear finding: what is happening, why it is happening, and what deserves action first.
          </p>
        </div>
        <div className="bv-hero-side">
          Revenue.<br />Retention.<br />Execution.<br />Strategy.<br />Exposure.
        </div>
      </section>

      <section className="bv-section">
        <div className="bv-section-head">
          <h2>The organization<br />beneath the story.</h2>
          <p>
            Performance leaves evidence. Incentives, decisions, recurring behaviors, reporting habits, and operating friction form patterns. We read those patterns together.
          </p>
        </div>

        <div className="bv-grid">
          {areas.map(([number, title, copy]) => (
            <article className="bv-card" key={number}>
              <span className="bv-card-number">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bv-section">
        <div className="bv-section-head">
          <h2>Two ways<br />to engage.</h2>
          <p>Start with the depth the situation requires. Both begin with direct access, focused examination, and a written finding delivered to leadership.</p>
        </div>
        <div className="bv-metrics">
          <div className="bv-metric"><strong>$10K</strong><span>The Read<br />Focused diagnostic</span></div>
          <div className="bv-metric"><strong>$30K</strong><span>Full Engagement<br />Deeper examination</span></div>
          <div className="bv-metric"><strong>1</strong><span>Written finding<br />One clear point of view</span></div>
          <div className="bv-metric"><strong>Now</strong><span>Decision value<br />Built for action</span></div>
        </div>
      </section>

      <section className="bv-callout">
        <div className="bv-callout-copy">
          <p className="bv-kicker">Begin</p>
          <h2>A clearer picture changes the decision.</h2>
          <p>Start with a confidential conversation about what leadership is seeing, what it suspects, and where performance has stopped making sense.</p>
        </div>
        <a className="bv-button" href="mailto:joe@blackvane13.com">Begin The Read</a>
      </section>
    </main>
  );
}

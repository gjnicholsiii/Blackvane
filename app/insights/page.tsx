export default function InsightsPage() {
  const insights = [
    ["Leadership", "Beyond Titles and Organizational Charts", "Real leadership appears in decisions, standards, accountability, and what the organization learns to tolerate."],
    ["Strategy", "Clarity in a Noisy World", "The quality of strategy improves when leadership can distinguish activity, aspiration, and actual choice."],
    ["Performance", "Execution Is a Leadership Discipline", "Results improve when ownership, cadence, measures, and consequences reinforce the same priorities."],
  ];

  return (
    <main className="bv-page">
      <section className="bv-hero">
        <div className="bv-hero-copy">
          <p className="bv-kicker">Insights</p>
          <h1>Ideas that move<br />leadership.</h1>
          <p className="bv-hero-lead">
            Perspective on leadership, execution, growth, organizational behavior, and the signals that reveal what a business is becoming.
          </p>
        </div>
        <div className="bv-hero-media" style={{ backgroundImage: "url('/solutions/management-topography.jpg')" }}>
          <div className="bv-media-caption">Leadership. Performance. Culture. Strategy. Operations.</div>
        </div>
      </section>

      <section className="bv-image-band">
        <div className="bv-image-band-copy">
          <p className="bv-kicker">What We Notice</p>
          <h2>The signal hiding inside ordinary behavior.</h2>
          <p>The most useful organizational insight often starts with something everyone can see and nobody has connected yet.</p>
        </div>
        <div className="bv-image-band-media" style={{ backgroundImage: "url('/solutions/hero-vane.jpg')" }} />
      </section>

      <section className="bv-section" id="featured-insights">
        <div className="bv-section-head">
          <h2>Featured<br />thinking.</h2>
          <p>Short, direct examinations of the decisions, habits, incentives, and operating conditions that shape organizational performance.</p>
        </div>

        <div className="bv-insight-grid">
          {insights.map(([category, title, copy]) => (
            <article className="bv-insight" key={title}>
              <p className="bv-kicker">{category}</p>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>

        <div className="bv-visual-grid" aria-hidden="true">
          <div className="bv-visual-card" style={{ backgroundImage: "url('/solutions/hero-vane.jpg')" }}><span>Leadership</span></div>
          <div className="bv-visual-card" style={{ backgroundImage: "url('/solutions/sales-compass.jpg')" }}><span>Strategy</span></div>
          <div className="bv-visual-card" style={{ backgroundImage: "url('/solutions/management-topography.jpg')" }}><span>Performance</span></div>
        </div>
      </section>

      <section className="bv-section">
        <div className="bv-section-head">
          <h2>What we pay<br />attention to.</h2>
          <p>
            The gap between what leadership believes and what the organization rewards. The difference between pipeline and probability. The behaviors hiding inside retention numbers. The decisions that quietly become culture.
          </p>
        </div>
        <div className="bv-metrics">
          <div className="bv-metric"><strong>01</strong><span>Leadership<br />Judgment and accountability</span></div>
          <div className="bv-metric"><strong>02</strong><span>Performance<br />Revenue and execution</span></div>
          <div className="bv-metric"><strong>03</strong><span>Culture<br />Behavior and retention</span></div>
          <div className="bv-metric"><strong>04</strong><span>Strategy<br />Choice and alignment</span></div>
        </div>
      </section>

      <section className="bv-callout">
        <div className="bv-callout-copy">
          <p className="bv-kicker">A Better Question</p>
          <h2>What is your organization already telling you?</h2>
          <p>Blackvane 13 helps leadership read the answer before the consequences make it obvious.</p>
        </div>
        <a className="bv-button" href="mailto:joe@blackvane13.com">Start a Confidential Conversation</a>
      </section>
    </main>
  );
}

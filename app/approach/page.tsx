export default function ApproachPage() {
  const steps = [
    ["01", "See Clearly", "Get beneath the surface. Data, systems, behaviors, incentives, and blind spots reveal the conditions shaping performance."],
    ["02", "Define the Real Problem", "Separate symptoms from source and identify the problem leadership can actually solve."],
    ["03", "Design the Right Response", "Build the response around the organization as it exists, the people inside it, and the result leadership needs."],
    ["04", "Execute with Precision", "Turn the finding into deliberate action, clear ownership, and measurable movement."],
    ["05", "Build What Lasts", "Strengthen capability, judgment, and operating discipline so improvement continues after the engagement."],
  ];

  return (
    <main className="bv-page">
      <section className="bv-hero">
        <div className="bv-hero-copy">
          <p className="bv-kicker">Our Approach</p>
          <h1>Clarity first.<br />Then everything else.</h1>
          <p className="bv-hero-lead">
            Blackvane 13 starts with the organization as it actually operates. We identify the forces shaping performance, isolate the real problem, and give leadership a clear course of action.
          </p>
        </div>
        <div className="bv-hero-side">
          Diagnose the conditions.<br />Find the pattern.<br />Name the decision.<br />Move.
        </div>
      </section>

      <section className="bv-section">
        <div className="bv-section-head">
          <h2>Five stages.<br />One finding.</h2>
          <p>
            The work is deliberately direct. Each stage reduces noise and increases the quality of the decision in front of leadership.
          </p>
        </div>

        <div className="bv-grid">
          {steps.map(([number, title, copy]) => (
            <article className="bv-card" key={number}>
              <span className="bv-card-number">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bv-callout">
        <div className="bv-callout-copy">
          <p className="bv-kicker">The Standard</p>
          <h2>See the organization clearly enough to act.</h2>
          <p>Every engagement ends with direction leadership can use immediately.</p>
        </div>
        <a className="bv-button" href="mailto:joe@blackvane13.com">Start a Confidential Conversation</a>
      </section>
    </main>
  );
}

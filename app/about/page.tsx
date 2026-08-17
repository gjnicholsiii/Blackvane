export default function AboutPage() {
  const principles = [
    ["The Necessary Truth", "A useful finding gives leadership something concrete to act on, especially when the organization has learned to talk around the problem."],
    ["Outsider. Operator.", "I study the business from outside its internal assumptions while bringing the perspective of someone who has spent decades inside sales, operations, and organizational performance."],
    ["Built for Action", "The work is designed to sharpen judgment, clarify priorities, and improve the decisions that shape performance."],
  ];

  return (
    <main className="bv-page">
      <section className="bv-hero bv-about-hero">
        <div className="bv-hero-copy">
          <p className="bv-kicker">About Blackvane 13</p>
          <h1>I look for what<br />others overlook.</h1>
          <p className="bv-hero-lead">
            Organizations reveal themselves through what they reward, excuse, repeat, and avoid examining. Blackvane 13 reads those signals clearly and turns them into decisions leadership can use.
          </p>
        </div>
        <div className="bv-portrait-wrap">
          <img className="bv-portrait" src="/about-portrait-approved.png" alt="Joe Nichols" />
        </div>
      </section>

      <section className="bv-section">
        <div className="bv-section-head">
          <h2>Operator&apos;s experience.<br />Outsider&apos;s view.</h2>
          <p>
            I bring more than two decades of experience across sales, operations, and organizational performance to leadership teams facing stalled growth, weak execution, cultural decay, or decisions made from an incomplete picture.
          </p>
        </div>
        <div className="bv-grid">
          {principles.map(([title, copy], index) => (
            <article className="bv-card" key={title}>
              <span className="bv-card-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bv-section">
        <div className="bv-section-head">
          <h2>Why Blackvane 13.</h2>
          <p>
            Strong organizations still develop blind spots. Pressure, hierarchy, incentives, and familiarity can make obvious problems difficult to see from inside. Blackvane 13 exists to give leaders an independent reading of what the organization is telling them.
          </p>
        </div>
      </section>

      <section className="bv-callout">
        <div className="bv-callout-copy">
          <p className="bv-kicker">The Work</p>
          <h2>Clarity is rare. Courage is rarer. Results are everything.</h2>
        </div>
        <a className="bv-button" href="mailto:joe@blackvane13.com">Start a Confidential Conversation</a>
      </section>
    </main>
  );
}

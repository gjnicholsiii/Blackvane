import "./campus-security.css";

const stages = [
  {
    number: "01",
    title: "ASSESS",
    items: ["Campus vulnerabilities", "Existing security systems", "Access control", "Video surveillance", "Emergency communications", "Operations & policies", "Capital priorities"],
  },
  {
    number: "02",
    title: "DEFINE",
    items: ["Security strategy", "Conceptual design", "Technology standards", "Basis of design", "Performance requirements", "Budget & phasing", "Procurement strategy"],
  },
  {
    number: "03",
    title: "PROCURE",
    items: ["RFP review & development", "Bidder questions", "Specification review", "Vendor qualification", "Bid normalization", "Commercial analysis", "Integrator selection"],
  },
  {
    number: "04",
    title: "PROTECT",
    items: ["Project oversight", "Submittal review", "Change-order analysis", "Substitution review", "Acceptance verification", "Progress review", "Closeout support"],
  },
];

const breakpoints = [
  "Specification ambiguity",
  "Missing scope",
  "Proprietary requirements",
  "Labor assumptions",
  "Licensing & permits",
  "Recurring fees",
  "Substitution language",
  "Network & IT responsibility",
  "Integration responsibility",
  "Warranty & training",
  "Commissioning & acceptance",
  "Change-order exposure",
];

export default function CampusSecurityPage() {
  return (
    <main className="campus-page">
      <section className="campus-hero">
        <div className="campus-hero-image" aria-hidden="true" />
        <div className="campus-hero-shade" />
        <div className="campus-hero-copy">
          <p className="campus-kicker">CAMPUS SECURITY ADVISORY</p>
          <h1>WE KNOW HOW<br />THE BID GETS BUILT.</h1>
          <p>
            Blackvane works on the institution&apos;s side of the table, bringing the perspective of the people who have estimated, pursued, negotiated and won security projects from the other side.
          </p>
          <p>
            We assess what you need, help define what gets bought, interrogate what gets bid, and protect the project through delivery.
          </p>
          <a className="campus-button" href="mailto:joe@blackvane13.com?subject=Campus%20Security%20Advisory">DISCUSS YOUR CAMPUS <span>→</span></a>
        </div>
      </section>

      <section className="campus-split bidder-chair">
        <div className="campus-photo chair-photo" aria-hidden="true" />
        <div className="campus-copy">
          <p className="campus-kicker">THE BLACKVANE DIFFERENCE</p>
          <h2>WE&apos;VE SAT IN<br />THE BIDDER&apos;S CHAIR.</h2>
          <div className="campus-rule" />
          <p>We know how projects are pursued, estimated, scoped, priced and sold.</p>
          <p>We know where bidders find opportunity and how that opportunity can surface later in substitutions, exclusions, recurring costs and change orders.</p>
          <p>That perspective changes what we see, the questions we ask, and the advice we give.</p>
        </div>
      </section>

      <section className="campus-process">
        <p className="campus-kicker">OUR ENGAGEMENT</p>
        <div className="campus-stage-grid">
          {stages.map((stage) => (
            <article key={stage.number} className="campus-stage">
              <div className="campus-stage-number">{stage.number}</div>
              <h3>{stage.title}</h3>
              <ul>
                {stage.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="campus-break">
        <div className="campus-break-copy">
          <p className="campus-kicker">BEFORE THE RFP GOES OUT</p>
          <h2>LET US TRY TO<br />BREAK IT.</h2>
          <div className="campus-rule" />
          <p>
            Blackvane reviews the procurement like a bidder would. We look for ambiguity, missing scope, commercial openings and assumptions that can turn into expensive surprises after award.
          </p>
        </div>
        <div className="campus-break-image" aria-hidden="true" />
        <div className="campus-break-list">
          {breakpoints.map((item) => <div key={item}><span>—</span>{item}</div>)}
        </div>
      </section>

      <section className="campus-bids">
        <div className="campus-bids-image" aria-hidden="true" />
        <div className="campus-bids-copy">
          <p className="campus-kicker">AFTER BIDS ARRIVE</p>
          <h2>WHICH ONE IS<br />ACTUALLY LOW?</h2>
          <p>We normalize proposals and expose the true cost to deliver.</p>
          <div className="bid-grid">
            <div><span>BIDDER A</span><strong>$1.72M</strong></div>
            <div><span>BIDDER B</span><strong>$2.06M</strong></div>
            <div><span>BIDDER C</span><strong>$2.41M</strong></div>
          </div>
          <div className="bid-factors">
            <span>Scope equivalency</span><span>Labor assumptions</span><span>Excluded work</span><span>Equipment substitutions</span><span>Recurring costs</span><span>Warranty</span><span>Schedule assumptions</span><span>Commercial risk</span>
          </div>
          <p className="adjusted-label">ADJUSTED TRUE COST <em>(ILLUSTRATIVE)</em></p>
          <div className="adjusted-grid"><strong>$2.31M</strong><strong>$2.12M</strong><strong>$2.46M</strong></div>
        </div>
      </section>

      <section className="campus-client">
        <div className="campus-client-copy">
          <h2>ONE CLIENT.<br /><span>THE INSTITUTION.</span></h2>
          <div className="campus-rule" />
          <p>Blackvane does not manufacture equipment. We do not make margin from cameras, readers, controllers or installation labor. We do not earn more when the project gets larger.</p>
          <p><strong>Our job is to determine what the institution should buy, how it should buy it, and whether it receives what it paid for.</strong></p>
        </div>
        <div className="campus-client-image" aria-hidden="true" />
      </section>

      <section className="campus-deliverable">
        <div>
          <p className="campus-kicker">THE DELIVERABLE</p>
          <h2>A SECURITY PLAN LEADERSHIP<br />CAN ACTUALLY USE.</h2>
        </div>
        <div className="deliverable-grid">
          {["WHAT WE FOUND", "WHAT MATTERS", "WHAT CAN WAIT", "WHAT SHOULD CHANGE", "WHAT IT SHOULD COST", "WHAT GETS DONE FIRST"].map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="campus-final">
        <div className="campus-final-image" aria-hidden="true" />
        <div className="campus-final-shade" />
        <div className="campus-final-copy">
          <h2>BEFORE YOU ISSUE THE NEXT RFP,<br />LET&apos;S READ IT <span>LIKE A BIDDER.</span></h2>
          <p>Campus assessment, modernization, upcoming procurement or an existing project already going sideways. Bring us the problem.</p>
          <a className="campus-button" href="mailto:joe@blackvane13.com?subject=Campus%20Security%20Advisory">CONFIDENTIAL CONVERSATION <span>→</span></a>
        </div>
      </section>
    </main>
  );
}

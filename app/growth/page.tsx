import type { Metadata } from "next";
import "./growth.css";

export const metadata: Metadata = {
  title: "Make the Company Bigger | Blackvane 13",
  description:
    "Commercial expansion for companies ready to build new verticals, enterprise accounts, channels, markets, and revenue engines.",
};

const builds = [
  {
    number: "01",
    title: "New Verticals",
    copy: "Find where your capability travels, identify the buyers who matter, and build a deliberate commercial attack instead of waiting for accidental wins.",
  },
  {
    number: "02",
    title: "Deeper Vertical Penetration",
    copy: "Turn occasional business inside a market into a position. Expand relationships, buying centers, account targets, and the size of the opportunity.",
  },
  {
    number: "03",
    title: "Enterprise Accounts",
    copy: "Identify the companies worth hunting, create entry, reach the people who can move the deal, and build pursuits large enough to change the year.",
  },
  {
    number: "04",
    title: "New Geographies",
    copy: "Prove a market before building payroll around it. Create relationships, opportunities, and commercial traction first.",
  },
  {
    number: "05",
    title: "Channels & Partnerships",
    copy: "Build the manufacturer, contractor, consultant, association, developer, and strategic relationships that multiply reach and create leverage.",
  },
  {
    number: "06",
    title: "Commercial Positioning",
    copy: "Turn capability the market overlooks into an offer buyers understand, value, and act on.",
  },
];

export default function GrowthPage() {
  return (
    <main className="growth-page">
      <section className="growth-hero">
        <div className="growth-hero-copy">
          <p className="growth-eyebrow">COMMERCIAL EXPANSION</p>
          <h1>MAKE THE<br />COMPANY<br /><em>BIGGER.</em></h1>
          <p className="growth-lead">
            Your sales team sells the business you have. I build the business you
            do not have yet.
          </p>
          <div className="growth-hero-actions">
            <a href="tel:+18884881961" className="growth-primary">CALL JOE · (888) 488-1961</a>
            <a href="mailto:joe@blackvane13.com" className="growth-secondary">EMAIL JOE</a>
          </div>
        </div>
        <div className="growth-hero-visual" aria-hidden="true">
          <div className="growth-hero-image" />
          <div className="growth-hero-stamp">BLACKVANE 13<br />GROWTH</div>
        </div>
      </section>

      <section className="growth-manifesto">
        <p className="growth-eyebrow">THE DIFFERENCE</p>
        <h2>YOUR TEAM KEEPS<br />THE BUSINESS.</h2>
        <h2 className="growth-gold">I GO BUILD WHAT&apos;S NEXT.</h2>
        <p>
          I am not there to take accounts away from your people, inherit a list,
          or become another body inside the existing sales structure. I work
          beyond its current boundary. New customers. New verticals. Larger
          accounts. Stronger market positions. New ways into revenue.
        </p>
      </section>

      <section className="growth-comparison">
        <div className="growth-comparison-label">BEFORE YOU ADD HEADCOUNT</div>
        <div className="growth-comparison-grid">
          <div className="growth-compare-left">
            <span>ANOTHER SALESPERSON</span>
            <p>Works the existing playbook.</p>
            <p>Asks which accounts are theirs.</p>
            <p>Sells the current offer.</p>
            <p>Covers a lane.</p>
          </div>
          <div className="growth-compare-center" aria-hidden="true">/</div>
          <div className="growth-compare-right">
            <span>BLACKVANE 13</span>
            <p>Challenges the playbook.</p>
            <p>Finds the accounts you are missing.</p>
            <p>Finds where the company has the right to win bigger.</p>
            <p>Builds the lane.</p>
          </div>
        </div>
        <div className="growth-comparison-close">
          <p>HIRE A SALESPERSON IF YOU NEED ANOTHER TERRITORY COVERED.</p>
          <strong>CALL ME IF YOU NEED A TERRITORY CREATED.</strong>
        </div>
      </section>

      <section className="growth-build">
        <div className="growth-build-head">
          <p className="growth-eyebrow">WHAT I BUILD</p>
          <h2>THE NEXT<br />REVENUE ENGINE.</h2>
          <p>
            The assignment changes. The objective does not: find meaningful
            commercial opportunity and turn it into something the company can
            own, repeat, and scale.
          </p>
        </div>
        <div className="growth-build-grid">
          {builds.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="growth-proof">
        <div className="growth-proof-image" aria-hidden="true" />
        <div className="growth-proof-copy">
          <p className="growth-eyebrow">THIS IS OPERATOR WORK</p>
          <h2>I HUNT.<br />I OPEN.<br />I BUILD.</h2>
          <p>
            This work lives in the market, not in a presentation. It means
            finding the opportunity, finding the buyer, earning access, creating
            the commercial argument, building the pursuit, and staying with it
            until the company has something real.
          </p>
          <div className="growth-proof-numbers">
            <div><strong>$40M+</strong><span>Enterprise technology sales</span></div>
            <div><strong>$25M</strong><span>Video, fire &amp; access · recent 3 years</span></div>
          </div>
        </div>
      </section>

      <section className="growth-question">
        <p className="growth-eyebrow">THE QUESTION</p>
        <h2>DO YOU NEED MORE PEOPLE<br />SELLING THE SAME THING?</h2>
        <div className="growth-question-rule" />
        <h2 className="growth-gold">OR SOMEONE TO FIND<br />THE NEXT THING WORTH SELLING?</h2>
      </section>

      <section className="growth-final">
        <div>
          <p className="growth-eyebrow">BLACKVANE 13 · COMMERCIAL EXPANSION</p>
          <h2>I DON&apos;T COME IN<br />TO CARRY YOUR BAG.</h2>
          <h2 className="growth-gold">I COME IN TO MAKE<br />THE COMPANY BIGGER.</h2>
        </div>
        <div className="growth-final-cta">
          <p>If that is the assignment, call me.</p>
          <a href="tel:+18884881961">(888) 488-1961</a>
          <span>JOE NICHOLS · BLACKVANE 13</span>
          <a className="growth-email" href="mailto:joe@blackvane13.com">joe@blackvane13.com</a>
        </div>
      </section>
    </main>
  );
}

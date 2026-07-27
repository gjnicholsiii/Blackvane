"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./solutions.css";

const sales = [
  "Sales Strategy & Revenue Planning",
  "Pipeline Management & Forecast Accuracy",
  "Team Leadership, Coaching & Accountability",
  "Compensation, Incentives & Sales Process",
  "CRM Discipline, Reporting & Metrics",
  "Pricing, Margin & Deal Strategy",
  "Hiring, Onboarding & Performance Management",
];

const management = [
  "Interim Department Leadership",
  "Operational Improvement & Oversight",
  "Team Accountability & Performance",
  "Cross-Functional Coordination",
  "Executive Priority Execution",
  "Process Improvement & Efficiency",
  "Leadership Transitions & Restructuring",
  "Special Initiatives Requiring Senior Ownership",
];

const consulting = [
  "Revenue & Growth Strategy",
  "Organizational Diagnostics",
  "Leadership Effectiveness",
  "Change, Engagement & Retention",
  "Operating Model & Structure",
  "M&A & Commercial Strategy",
  "Executive Alignment & Decision Support",
  "Strategic Planning & Execution",
];

export default function SolutionsPage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy > *",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" }
      );
      gsap.fromTo(
        ".hero-image",
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 1.15, ease: "power2.out" }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="solutions-page">
      <header className="header">
        <a className="wordmark" href="/">BLACKVANE</a>
        <nav aria-label="Primary navigation">
          <a href="/">HOME</a>
          <a href="/about">ABOUT</a>
          <a className="active" href="/solutions">SOLUTIONS</a>
          <a href="/diagnostics">THE BLACKVANE FINDING</a>
          <a href="/insights">INSIGHTS</a>
          <a href="/contact">CONTACT</a>
        </nav>
        <a className="talk" href="/contact">LET&apos;S TALK</a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SOLUTIONS</p>
          <h1>Leadership. Clarity.<br />Results that last.</h1>
          <p>
            Blackvane delivers senior-level expertise that strengthens your
            business, your team, and your bottom line.
          </p>
          <p>On your terms. On your timeline.</p>
        </div>
        <div className="hero-image" aria-hidden="true" />
      </section>

      <section className="statement">
        <h2>EVERY BUSINESS FACES MOMENTS THAT REQUIRE MORE.</h2>
        <p>
          More leadership. More clarity. More execution. Blackvane steps in with
          the experience,
        </p>
        <p>judgment, and discipline to move your business forward.</p>
        <p>Three solutions. One objective: your success.</p>
        <span />
      </section>

      <Service
        icon="↗"
        title={<>FRACTIONAL<br />SALES LEADERSHIP</>}
        strap={<>SENIOR LEADERSHIP.<br />MEASURABLE GROWTH.</>}
        intro="We lead your sales organization as if it were our own. Driving strategy, execution, and accountability to build a predictable, scalable revenue engine."
        items={sales}
        image="/solutions/sales-compass.jpg"
      />

      <Service
        icon="◎"
        title={<>FRACTIONAL<br />MANAGEMENT</>}
        strap={<>EXPERIENCED LEADERSHIP.<br />STRONGER OPERATIONS.</>}
        intro="We step in to lead, stabilize, and move critical initiatives forward. The right leader, right now."
        items={management}
        image="/solutions/management-topography.jpg"
      />

      <Service
        icon="◉"
        title={<>EXECUTIVE<br />CONSULTING</>}
        strap={<>CLARITY FOR DECISIONS<br />THAT SHAPE THE FUTURE.</>}
        intro="Objective counsel and practical solutions for your most important challenges and opportunities."
        items={consulting}
        image="/solutions/consulting-turbine.jpg"
      />

      <section className="finding">
        <div className="finding-intro">
          <p className="eyebrow">THE BLACKVANE FINDING</p>
          <h2>Clarity begins<br />with the truth.</h2>
          <p>
            A focused examination of your organization, the real problem, and
            the forces sustaining it. We deliver a written finding with
            priorities, risks, and a clear course of action.
          </p>
        </div>

        <div className="finding-options">
          <article>
            <div className="finding-icon">⌕</div>
            <h3>The Read</h3>
            <p>
              A focused diagnostic designed to identify the core problem and
              give leadership a clear course of action.
            </p>
          </article>
          <article>
            <div className="finding-icon">⌾</div>
            <h3>Full Engagement</h3>
            <p>
              A deeper organizational examination with broader interviews,
              analysis, action stages, and guidance through the first steps of
              execution.
            </p>
          </article>
        </div>
      </section>

      <section className="closing">
        <div className="closing-copy">
          <p className="eyebrow">HOW ENGAGEMENTS BEGIN</p>
          <p>Some need an adviser.<br />Some need a leader.<br />Some need both.</p>
          <p>
            We begin by listening, then tell you what is clear, the result you
            suspect, and the conditions required to achieve it.
          </p>
        </div>
        <div className="closing-mark" aria-hidden="true">✦</div>
        <div className="closing-cta">
          <h2>Then we get to work.</h2>
          <p>CLEAR DIRECTION. DISCIPLINED EXECUTION.<br />RESULTS THAT ENDURE.</p>
          <a href="/contact">LET&apos;S TALK</a>
        </div>
      </section>
    </main>
  );
}

function Service({
  icon,
  title,
  strap,
  intro,
  items,
  image,
}: {
  icon: string;
  title: React.ReactNode;
  strap: React.ReactNode;
  intro: string;
  items: string[];
  image: string;
}) {
  return (
    <section className="service">
      <div className="service-title">
        <div className="service-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{strap}</p>
      </div>

      <div className="service-copy">
        <p>{intro}</p>
        <ul>
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <div className="service-image" style={{ backgroundImage: `url(${image})` }} />
    </section>
  );
}

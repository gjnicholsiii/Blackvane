"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./solutions.css";

const services = [
  {
    number: "01",
    title: "Fractional Sales Leadership",
    strap: "Senior sales leadership inside the business.",
    description:
      "Blackvane takes responsibility for the commercial engine. We lead the team, establish forecast discipline, strengthen pipeline quality, improve pricing, and create a sales cadence leadership can trust.",
    capabilities: [
      "Revenue strategy and planning",
      "Pipeline and forecast discipline",
      "Sales team leadership and coaching",
      "Compensation and territory design",
      "CRM accountability and reporting",
      "Pricing, margin, and deal strategy",
      "Hiring and performance management",
      "Executive revenue visibility",
    ],
    bestFor:
      "Founder-led companies, teams between sales leaders, and organizations carrying an expensive gap between activity and revenue.",
  },
  {
    number: "02",
    title: "Fractional Management",
    strap: "Experienced leadership where the company needs control.",
    description:
      "Blackvane steps into a department, transition, or critical initiative and carries real operating responsibility. The work centers on order, accountability, decision-making, and forward movement.",
    capabilities: [
      "Interim department leadership",
      "Operational management",
      "Team accountability and performance",
      "Cross-functional coordination",
      "Executive priority execution",
      "Process improvement",
      "Leadership transitions",
      "Special initiative ownership",
    ],
    bestFor:
      "Leadership vacancies, stalled initiatives, rapid growth, restructuring, and periods that demand experienced direction now.",
  },
  {
    number: "03",
    title: "Executive Consulting",
    strap: "Clear judgment for decisions with consequences.",
    description:
      "Blackvane works directly with CEOs, owners, and senior leaders on revenue, leadership, culture, execution, organizational design, and the decisions already consuming time and attention.",
    capabilities: [
      "Revenue and growth strategy",
      "Organizational diagnostics",
      "Leadership effectiveness",
      "Culture and retention",
      "Operating model review",
      "Decision support",
      "Executive alignment",
      "Strategic execution",
    ],
    bestFor:
      "Leadership teams facing consequential choices, internal friction, weak execution, or a problem that resists an easy answer.",
  },
];

export default function SolutionsPage() {
  const page = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy > *",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".vane-object",
        { opacity: 0, rotate: -8, scale: 0.94 },
        {
          opacity: 1,
          rotate: 0,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={page} className="solutions-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Blackvane home">
          <span className="brand-mark" aria-hidden="true">
            B
          </span>
          <span>BLACKVANE</span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/approach">Our Approach</a>
          <a href="/diagnostics">Diagnostics</a>
          <a className="active" href="/solutions">
            Solutions
          </a>
          <a href="/expertise">Expertise</a>
          <a href="/about">About</a>
          <a href="/insights">Insights</a>
        </nav>

        <a className="header-cta" href="/contact">
          Confidential Conversation
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Solutions</p>
          <h1>
            Experienced leadership,
            <br />
            where the business needs it most.
          </h1>
          <p className="hero-lead">
            Blackvane steps inside the work. We lead sales organizations,
            manage critical functions, advise executives, and diagnose the
            problems consuming revenue, attention, and trust.
          </p>
          <a className="primary-button" href="#services">
            Explore the work
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="halo" />
          <div className="vane-object">
            <span className="vane-wing wing-one" />
            <span className="vane-wing wing-two" />
            <span className="vane-wing wing-three" />
            <span className="vane-center" />
          </div>
          <div className="hero-rule" />
        </div>
      </section>

      <section className="positioning">
        <p className="eyebrow">The work</p>
        <div className="positioning-grid">
          <h2>Clarity matters when it changes the business.</h2>
          <p>
            Some companies need an answer. Some need a leader. Some need both.
            Blackvane begins with the responsibility the business needs carried,
            the result leadership expects, and the conditions required to
            produce it.
          </p>
        </div>
      </section>

      <section id="services" className="services">
        {services.map((service) => (
          <article className="service" key={service.number}>
            <div className="service-index">{service.number}</div>

            <div className="service-main">
              <p className="service-kicker">{service.strap}</p>
              <h2>{service.title}</h2>
              <p className="service-description">{service.description}</p>
              <p className="best-for">
                <span>Best suited for</span>
                {service.bestFor}
              </p>
            </div>

            <div className="service-capabilities">
              <p className="capability-title">Core responsibilities</p>
              <ul>
                {service.capabilities.map((capability) => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="finding">
        <div className="finding-copy">
          <p className="eyebrow">The Blackvane Finding</p>
          <h2>A written diagnosis leadership can act on.</h2>
          <p>
            We interview the right people, study the evidence, test the
            prevailing explanations, and identify the real cause. Leadership
            receives a concise written finding with priorities, risks, and
            recommended action.
          </p>
        </div>

        <div className="finding-options">
          <article>
            <span>Focused Diagnostic</span>
            <h3>The Read</h3>
            <p>
              A focused examination built to identify the central problem and
              give leadership a clear course of action.
            </p>
          </article>

          <article>
            <span>Organizational Engagement</span>
            <h3>Full Engagement</h3>
            <p>
              A deeper examination with broader interviews, operational
              analysis, written findings, and guidance through the first stage
              of execution.
            </p>
          </article>
        </div>
      </section>

      <section className="closing">
        <div>
          <p className="eyebrow">How engagements begin</p>
          <h2>Define the responsibility. Set the result. Get to work.</h2>
        </div>
        <div className="closing-copy">
          <p>
            Blackvane identifies what the business needs carried, what
            leadership expects to change, and what must happen next.
          </p>
          <a className="primary-button" href="/contact">
            Start a confidential conversation
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <span>BLACKVANE</span>
        <span>Clarity. Execution. Results.</span>
      </footer>
    </main>
  );
}

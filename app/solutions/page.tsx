"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./solutions.css";

export default function SolutionsPage() {
  const page = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".solutions-inner",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" }
      );
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={page} className="solutions-page">
      <div className="solutions-inner">
        <section className="solutions-visual">
          <img
            src="/solutions-approved.png"
            alt=""
            className="solutions-art"
            draggable={false}
          />

          <nav className="solutions-hotspots" aria-label="Primary navigation">
            <a className="home-link" href="/">Home</a>
            <a className="about-link" href="/about">About</a>
            <a className="solutions-link" href="/solutions">Solutions</a>
            <a className="finding-link" href="/diagnostics">The Blackvane Finding</a>
            <a className="insights-link" href="/insights">Insights</a>
            <a className="contact-link" href="/contact">Contact</a>
            <a className="talk-link" href="/contact">Let's Talk</a>
          </nav>

          <a
            className="bottom-talk-link"
            href="/contact"
            aria-label="Start a confidential conversation"
          />
        </section>
      </div>

      <div className="sr-only">
        <h1>Leadership. Clarity. Results that last.</h1>
        <p>
          Blackvane delivers senior-level expertise that strengthens your
          business, your team, and your bottom line. On your terms. On your
          timeline.
        </p>

        <section>
          <h2>Fractional Sales Leadership</h2>
          <p>Senior leadership. Measurable growth.</p>
          <ul>
            <li>Sales strategy and revenue planning</li>
            <li>Pipeline management and forecast accuracy</li>
            <li>Team leadership, coaching, and accountability</li>
            <li>Compensation, incentives, and sales process</li>
            <li>CRM discipline, reporting, and metrics</li>
            <li>Pricing, margin, and deal strategy</li>
            <li>Hiring, onboarding, and performance management</li>
          </ul>
        </section>

        <section>
          <h2>Fractional Management</h2>
          <p>Experienced leadership. Stronger operations.</p>
          <ul>
            <li>Interim department leadership</li>
            <li>Operational improvement and oversight</li>
            <li>Team accountability and performance</li>
            <li>Cross-functional coordination</li>
            <li>Executive priority execution</li>
            <li>Process improvement and efficiency</li>
            <li>Leadership transitions and restructuring</li>
            <li>Special initiatives requiring senior ownership</li>
          </ul>
        </section>

        <section>
          <h2>Executive Consulting</h2>
          <p>Clarity for decisions that shape the future.</p>
          <ul>
            <li>Revenue and growth strategy</li>
            <li>Organizational diagnostics</li>
            <li>Leadership effectiveness</li>
            <li>Change, engagement, and retention</li>
            <li>Operating model and structure</li>
            <li>Merger and acquisition commercial strategy</li>
            <li>Executive alignment and decision support</li>
            <li>Strategic planning and execution</li>
          </ul>
        </section>

        <section>
          <h2>The Blackvane Finding</h2>
          <h3>Clarity begins with the truth.</h3>
          <p>
            A focused examination of your organization, the real problem, and
            the forces sustaining it. We deliver a written finding with
            priorities, risks, and a clear course of action.
          </p>
          <h3>The Read</h3>
          <p>
            A focused diagnostic designed to identify the core problem and give
            leadership a clear course of action.
          </p>
          <h3>Full Engagement</h3>
          <p>
            A deeper organizational examination with broader interviews,
            analysis, action stages, and guidance through the first steps of
            execution.
          </p>
        </section>

        <section>
          <h2>How engagements begin</h2>
          <p>
            Some need an adviser. Some need a leader. Some need both. We begin
            by listening, then tell you what is clear, the result you suspect,
            and the conditions required to achieve it.
          </p>
          <h3>Then we get to work.</h3>
          <p>Clear direction. Disciplined execution. Results that endure.</p>
        </section>
      </div>
    </main>
  );
}

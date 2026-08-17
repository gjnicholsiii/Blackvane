"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./expertise.css";

export default function ExpertisePage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".expertise-inner",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="expertise-page">
      <div className="expertise-inner">
        <section className="expertise-visual">
          <img
            src="/expertise-approved.png"
            alt=""
            className="expertise-art"
            draggable={false}
          />

          <nav className="expertise-hotspots" aria-label="Primary navigation">
            <a className="home-link" href="/">Home</a>
            <a className="approach-link" href="/approach">Our Approach</a>
            <a className="diagnostics-link" href="/diagnostics">Diagnostics</a>
            <a className="solutions-link" href="/solutions">Solutions</a>
            <a className="expertise-link" href="/expertise">Expertise</a>
            <a className="about-link" href="/about">About</a>
            <a className="insights-link" href="/insights">Insights</a>
            <a className="contact-link" href="mailto:joe@blackvane13.com">Confidential Conversation</a>
          </nav>

          <a className="experience-link" href="#experience" aria-label="View our experience" />
          <a className="contact-cta" href="mailto:joe@blackvane13.com" aria-label="Start a confidential conversation" />
        </section>
      </div>

      <div className="sr-only">
        <h1>Experience that runs deep. Impact that runs long.</h1>
        <p>
          Decades of work inside organizations across industries, functions,
          and moments that mattered. We have sat at the table, rolled up our
          sleeves, and helped leaders move from insight to results that last.
        </p>

        <section id="experience">
          <h2>Credibility earned in the real world</h2>

          <h3>25+ Years</h3>
          <p>Solving complex business challenges across industries and organizations.</p>

          <h3>200+ Engagements</h3>
          <p>Diagnostics and advisory engagements completed with leadership teams.</p>

          <h3>Industries Served</h3>
          <p>From emerging companies to global enterprises across the private sector.</p>

          <h3>Single Focus</h3>
          <p>Unfiltered attention on what drives your business forward.</p>
        </section>

        <section>
          <h2>Depth that drives impact</h2>

          <h3>Growth</h3>
          <p>
            Fuel your top line with stronger pipeline, sharper execution,
            and disciplined strategy.
          </p>

          <h3>People and Culture</h3>
          <p>
            Build environments where people commit, contribute,
            and raise the standard every day.
          </p>

          <h3>Operational Performance</h3>
          <p>
            Streamline work, increase capacity, and build systems that support execution.
          </p>

          <h3>Strategy and Alignment</h3>
          <p>
            Bring clarity to direction and alignment to teams so decisions create momentum.
          </p>

          <h3>Risk and Governance</h3>
          <p>
            Strengthen controls, safeguard reputation, and build confidence with stakeholders.
          </p>
        </section>

        <section>
          <h2>Perspective that moves leadership</h2>
          <p>
            Time in the arena builds perspective through direct experience.
            We have led teams, shaped organizations, closed deals, and guided
            businesses through critical moments.
          </p>
          <p>
            That experience brings clarity. It connects the signals across the
            organization and turns insight into decisions that move the business forward.
          </p>
        </section>

        <h2>Your business has potential. We help you realize it.</h2>
        <p>Experience. Perspective. Results that endure.</p>
      </div>
    </main>
  );
}

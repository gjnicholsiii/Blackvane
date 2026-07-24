"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./solutions.css";

export default function SolutionsPage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".solutions-inner",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="solutions-page">
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
            <a className="approach-link" href="/approach">Our Approach</a>
            <a className="diagnostics-link" href="/diagnostics">Diagnostics</a>
            <a className="solutions-link" href="/solutions">Solutions</a>
            <a className="expertise-link" href="/expertise">Expertise</a>
            <a className="about-link" href="/about">About</a>
            <a className="insights-link" href="/insights">Insights</a>
            <a className="contact-link" href="/contact">Confidential Conversation</a>
          </nav>

          <a className="how-link" href="#how-we-work" aria-label="How we work" />
          <a className="contact-cta" href="/contact" aria-label="Start a confidential conversation" />
        </section>
      </div>

      <div className="sr-only">
        <h1>Clarity is the first solution. Action is the next.</h1>
        <p>
          Blackvane turns insight into action. We partner with leaders to close
          the gap between where you are and where you need to be, delivering
          solutions that endure.
        </p>

        <section id="how-we-work">
          <h2>A focused path. Measurable results.</h2>

          <h3>Focus</h3>
          <p>We define what matters most and set a clear direction for impact.</p>

          <h3>Uncover</h3>
          <p>We dig beneath the surface to reveal root causes, patterns, and opportunities.</p>

          <h3>Clarify</h3>
          <p>We make sense of complexity and identify the right path forward.</p>

          <h3>Align</h3>
          <p>We align strategy, teams, and resources around shared priorities.</p>

          <h3>Act</h3>
          <p>We execute with discipline and drive measurable, sustained results.</p>
        </section>

        <section>
          <h2>We build what lasts.</h2>

          <h3>Practical, not theoretical.</h3>
          <p>We deliver solutions grounded in real-world context and proven thinking.</p>

          <h3>Tailored, not templated.</h3>
          <p>Every engagement is customized to your challenges, your industry, and your reality.</p>

          <h3>Partner, not presenter.</h3>
          <p>We work alongside your team as a trusted partner, not a spectator.</p>

          <h3>Sustainable, not short-lived.</h3>
          <p>We build capabilities and momentum that endure long after the engagement ends.</p>
        </section>

        <h2>Solutions without execution are just potential.</h2>
        <p>Let&apos;s build what&apos;s next.</p>
      </div>
    </main>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./diagnostics.css";

export default function DiagnosticsPage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".diagnostics-inner",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="diagnostics-page">
      <div className="diagnostics-inner">
        <section className="diagnostics-visual">
          <img
            src="/diagnostics-approved.png"
            alt=""
            className="diagnostics-art"
            draggable={false}
          />

          <nav className="diagnostics-hotspots" aria-label="Primary navigation">
            <a className="home-link" href="/">Home</a>
            <a className="approach-link" href="/approach">Our Approach</a>
            <a className="diagnostics-link" href="/diagnostics">Diagnostics</a>
            <a className="solutions-link" href="/solutions">Solutions</a>
            <a className="expertise-link" href="/expertise">Expertise</a>
            <a className="about-link" href="/about">About</a>
            <a className="insights-link" href="/insights">Insights</a>
            <a className="contact-link" href="/contact">Confidential Conversation</a>
          </nav>

          <a className="hero-read-link" href="/contact" aria-label="Begin The Read" />
          <a className="read-link" href="/contact" aria-label="Begin The Read" />
          <a className="bottom-contact-link" href="/contact" aria-label="Start a confidential conversation" />
        </section>
      </div>

      <div className="sr-only">
        <h1>See what&apos;s real. Fix what matters.</h1>
        <p>
          Blackvane diagnostics cut through noise, politics, and performance theater
          to reveal what is actually driving your results and what stands in the way.
        </p>

        <h2>Every organization has a story. We find the one beneath the story.</h2>
        <p>
          We study the patterns most leaders do not have time to see. The incentives.
          The behaviors. The decisions. The gaps between what is said and what is rewarded.
        </p>

        <h3>Revenue</h3>
        <p>
          We examine your growth engine. Pipeline quality. Forecast integrity.
          Sales execution. Pricing power. Compensation that drives the right behavior.
        </p>

        <h3>Retention</h3>
        <p>
          We evaluate the culture you have. Leadership behavior. Engagement.
          Recognition. The reasons good people leave.
        </p>

        <h3>Execution</h3>
        <p>
          We map how work moves. Handoffs. Bottlenecks. Meetings. Metrics.
          Decision speed. Operational drag.
        </p>

        <h3>Strategy</h3>
        <p>
          We test the coherence of your strategy. Clarity of choices.
          Resource alignment. Trade-offs made or avoided.
        </p>

        <h3>Risk and Exposure</h3>
        <p>
          We surface what could undermine results. Financial, operational,
          reputational, and leadership risks hiding in plain sight.
        </p>

        <h2>A clear-eyed read of your organization.</h2>
        <p>
          The Read delivers an unfiltered written diagnostic that is specific,
          prioritized, and actionable.
        </p>

        <h2>You cannot improve what you will not face.</h2>
      </div>
    </main>
  );
}

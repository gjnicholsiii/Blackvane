"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./insights.css";

export default function InsightsPage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".insights-inner",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="insights-page">
      <div className="insights-inner">
        <section className="insights-visual">
          <img
            src="/insights-approved.png"
            alt=""
            className="insights-art"
            draggable={false}
          />

          <nav className="insights-hotspots" aria-label="Primary navigation">
            <a className="home-link" href="/">Home</a>
            <a className="approach-link" href="/approach">Our Approach</a>
            <a className="diagnostics-link" href="/diagnostics">Diagnostics</a>
            <a className="solutions-link" href="/solutions">Solutions</a>
            <a className="expertise-link" href="/expertise">Expertise</a>
            <a className="about-link" href="/about">About</a>
            <a className="insights-link" href="/insights">Insights</a>
            <a className="contact-link" href="/contact">Confidential Conversation</a>
          </nav>

          <a className="latest-link" href="#featured-insights" aria-label="Latest insights" />
          <a className="subscribe-link" href="#subscribe" aria-label="Subscribe" />
          <a className="contact-cta" href="/contact" aria-label="Start a confidential conversation" />
        </section>
      </div>

      <div className="sr-only">
        <h1>Ideas that move leadership.</h1>
        <p>
          Sharp perspective on leadership, execution, performance, and the
          organizational truths that separate momentum from noise.
        </p>

        <section id="featured-insights">
          <h2>Featured insights</h2>

          <article>
            <h3>Leadership</h3>
            <h4>Beyond Titles and Organizational Charts</h4>
            <p>
              What real leadership looks like in practice, and why it matters
              more than ever.
            </p>
          </article>

          <article>
            <h3>Strategy</h3>
            <h4>Clarity in a Noisy World</h4>
            <p>
              How to cut through complexity, align on what matters, and make
              decisions with conviction.
            </p>
          </article>

          <article>
            <h3>Performance</h3>
            <h4>Execution Is a Leadership Discipline</h4>
            <p>
              Building the systems and habits that turn strategy into
              sustainable results.
            </p>
          </article>
        </section>

        <section>
          <h2>Explore by topic</h2>
          <p>Leadership. Performance. Culture. Strategy. Operations.</p>
        </section>

        <section id="subscribe">
          <h2>Insights that drive better decisions.</h2>
          <p>
            Timely insights on leadership, execution, and organizational
            performance delivered straight to your inbox.
          </p>
        </section>

        <section>
          <h2>Let&apos;s talk about what&apos;s next.</h2>
          <p>
            Every organization has a set of choices that define its future.
            We&apos;d welcome the chance to explore yours.
          </p>
        </section>
      </div>
    </main>
  );
}

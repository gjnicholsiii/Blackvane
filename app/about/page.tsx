"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./about.css";

export default function AboutPage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-page-inner",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="about-page">
      <div className="about-page-inner">
        <section className="about-visual">
          <img
            src="/about-approved.png"
            alt=""
            className="about-art"
            draggable={false}
          />

          <nav className="about-hotspots" aria-label="Primary navigation">
            <a className="home-link" href="/">Home</a>
            <a className="approach-link" href="/approach">Our Approach</a>
            <a className="diagnostics-link" href="/diagnostics">Diagnostics</a>
            <a className="solutions-link" href="/solutions">Solutions</a>
            <a className="expertise-link" href="/expertise">Expertise</a>
            <a className="about-link" href="/about">About</a>
            <a className="insights-link" href="/insights">Insights</a>
            <a className="contact-link" href="/contact">Confidential Conversation</a>
          </nav>

          <a className="expertise-cta" href="/expertise" aria-label="View expertise" />
          <a className="contact-cta" href="/contact" aria-label="Start a confidential conversation" />
        </section>
      </div>

      <div className="sr-only">
        <h1>I look for what others overlook.</h1>
        <p>
          Organizations reveal themselves through what they reward, excuse,
          repeat, and refuse to examine.
        </p>
        <p>Blackvane reads those signals clearly.</p>
        <p>
          I bring an outsider&apos;s perspective and an operator&apos;s experience to
          leadership teams facing stalled growth, weak execution, cultural decay,
          and decisions made from an incomplete picture.
        </p>

        <h2>My Perspective</h2>
        <h3>The Necessary Truth</h3>
        <p>Clear findings give leaders something solid to act on.</p>

        <h3>Outsider. Operator.</h3>
        <p>
          I study the organization as it operates, challenge assumptions that
          distort the picture, and bring the real conditions into view.
        </p>

        <h3>Built to Last</h3>
        <p>
          The work strengthens clarity, capability, alignment, and leadership
          judgment over time.
        </p>

        <h2>Experience That Matters</h2>
        <p>
          With more than two decades leading in sales, operations, and
          organizational performance, I have seen how strong organizations
          perform, how problems take hold, and how leadership decisions shape both.
        </p>

        <p>
          Blackvane is the result of putting that experience to work for leaders
          who are serious about results.
        </p>

        <h2>Clarity is rare. Courage is rarer. Results are everything.</h2>
      </div>
    </main>
  );
}

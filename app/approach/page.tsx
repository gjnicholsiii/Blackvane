"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./approach.css";

export default function ApproachPage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".approach-approved",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.15, ease: "power2.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="approach-page">
      <div className="approach-approved">
        <img src="/approach-approved.png" alt="" className="approach-art" draggable={false} />
        <nav className="approach-hotspots" aria-label="Primary navigation">
          <a className="home-link" href="/">Home</a>
          <a className="approach-link" href="/approach">Our Approach</a>
          <a className="diagnostics-link" href="/diagnostics">Diagnostics</a>
          <a className="solutions-link" href="/solutions">Solutions</a>
          <a className="expertise-link" href="/expertise">Expertise</a>
          <a className="about-link" href="/about">About</a>
          <a className="insights-link" href="/insights">Insights</a>
          <a className="contact-link" href="mailto:joe@blackvane13.com">Confidential Conversation</a>
        </nav>
      </div>

      <div className="sr-only">
        <h1>Clarity First. Then Everything Else.</h1>
        <p>We do not lead with tools. We lead with truth. Our approach is built to cut through noise, surface what matters, and drive change that lasts.</p>
        <h2>Five steps. One outcome. Real transformation.</h2>
        <ol>
          <li><h3>See Clearly</h3><p>Diagnose. We get beneath the surface. Data, systems, behaviors, and blind spots. We find the root causes others overlook.</p></li>
          <li><h3>Define the Real Problem</h3><p>Focus. We separate symptoms from the source. Together, we define the true problem worth solving.</p></li>
          <li><h3>Design the Right Solution</h3><p>Align. No templates. No repackaged frameworks. We design a solution built for your reality, your people, and your goals.</p></li>
          <li><h3>Execute with Precision</h3><p>Deliver. We move fast and stay close. Every action is deliberate. Every milestone drives measurable progress.</p></li>
          <li><h3>Build What Lasts</h3><p>Sustain. We do not hand off and disappear. We embed change, strengthen capability, and ensure results endure.</p></li>
        </ol>
        <h2>We do not just solve problems. We change outcomes.</h2>
        <p>This is not consulting as usual. This is Blackvane. Clarity. Focus. Execution. Results. That is our approach.</p>
      </div>
    </main>
  );
}

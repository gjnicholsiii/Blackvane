"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";

export default function HomePage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      const intro = gsap.timeline();

      intro
        .set(".approved-page", { autoAlpha: 0 })
        .set(".intro-logo", { autoAlpha: 0, filter: "brightness(0.08) contrast(1.2)" })
        .set(".intro-light", { xPercent: -220, autoAlpha: 0 })
        .to({}, { duration: 2 })
        .to(".intro-logo", { autoAlpha: 1, duration: 1.2, ease: "power2.out" })
        .to(".intro-light", { autoAlpha: 1, duration: 0.35 }, 3.5)
        .to(".intro-light", { xPercent: 420, duration: 2.6, ease: "power1.inOut" }, 3.5)
        .to(".intro-logo", { filter: "brightness(1) contrast(1)", duration: 2.3, ease: "power1.inOut" }, 3.6)
        .to(".intro-wordmark", { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" }, 5.8)
        .to(".intro-tagline", { autoAlpha: 1, y: 0, duration: 0.8 }, 6.7)
        .to(".approved-page", { autoAlpha: 1, duration: 1.15, ease: "power2.inOut" }, 7.8)
        .to(".intro", { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" }, 8.0)
        .set(".intro", { display: "none" });
    }, root);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <main ref={root}>
      <section className="intro" aria-hidden="true">
        <div className="intro-light" />
        <img className="intro-logo" src="/logo-approved.jpg" alt="" />
        <div className="intro-wordmark">BLACKVANE</div>
        <div className="intro-tagline">SEE CLEARLY. LEAD DECISIVELY.</div>
      </section>

      <div className="approved-page">
        <section className="approved-section hero-section">
          <img src="/hero-approved.jpg" alt="" />
          <nav className="nav-hotspots" aria-label="Primary navigation">
            <a href="/approach">Approach</a>
            <a href="/diagnostics">Diagnostics</a>
            <a href="/solutions">Solutions</a>
            <a href="/industries">Industries</a>
            <a href="/about">About</a>
            <a href="/insights">Insights</a>
            <a className="talk" href="/contact">Let's Talk</a>
          </nav>
          <a className="scroll-hotspot" href="#reveal" aria-label="Scroll to next section" />
        </section>

        <section id="reveal" className="approved-section">
          <img src="/reveal-approved.jpg" alt="" />
          <div className="section-links reveal-links">
            <a href="/diagnostics" aria-label="The Blackvane Finding" />
            <a href="/approach" aria-label="Our approach" />
          </div>
        </section>

        <section className="approved-section">
          <img src="/pattern-approved.jpg" alt="" />
        </section>

        <section className="approved-section">
          <img src="/finding-approved.jpg" alt="" />
          <a className="learn-hotspot" href="/diagnostics" aria-label="Learn more about the Blackvane Finding" />
        </section>
      </div>

      <div className="sr-only">
        <h1>Blackvane</h1>
        <p>See clearly. Lead decisively.</p>
        <h2>Your company already knows what is wrong.</h2>
        <p>We help you see it clearly, name it precisely, and move on what actually matters.</p>
        <h2>The pattern is the problem.</h2>
        <h2>Clarity that cuts through. Truth that drives change.</h2>
      </div>
    </main>
  );
}

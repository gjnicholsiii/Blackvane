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
        .set(".homepage", { autoAlpha: 0 })
        .set(".intro-logo", { autoAlpha: 0, scale: 0.97, filter: "brightness(0.12)" })
        .set(".intro-light", { xPercent: -220, autoAlpha: 0 })
        .to({}, { duration: 1.2 })
        .to(".intro-logo", { autoAlpha: 1, duration: 1.1, ease: "power2.out" })
        .to(".intro-light", { autoAlpha: 1, duration: 0.3 }, 2.1)
        .to(".intro-light", { xPercent: 420, duration: 2.2, ease: "power1.inOut" }, 2.1)
        .to(".intro-logo", { filter: "brightness(1)", scale: 1, duration: 1.8 }, 2.2)
        .to(".intro-tagline", { autoAlpha: 1, y: 0, duration: 0.7 }, 3.6)
        .to(".homepage", { autoAlpha: 1, duration: 1.0, ease: "power2.inOut" }, 4.6)
        .to(".intro", { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 4.7)
        .set(".intro", { display: "none" });

      gsap.fromTo(
        ".hero-copy > *",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power2.out", delay: 5.1 }
      );
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
        <img className="intro-logo" src="/blackvane-logo-approved.png" alt="" />
        <div className="intro-tagline">SEE CLEARLY. LEAD DECISIVELY.</div>
      </section>

      <div className="homepage">
        <header className="home-header">
          <a className="home-logo" href="/" aria-label="Blackvane home">
            <img src="/blackvane-logo-approved.png" alt="Blackvane" />
          </a>

          <nav aria-label="Primary navigation">
            <a href="/approach">Approach</a>
            <a href="/diagnostics">Diagnostics</a>
            <a href="/solutions">Solutions</a>
            <a href="/expertise">Expertise</a>
            <a href="/about">About</a>
            <a href="/insights">Insights</a>
          </nav>

          <a className="header-talk" href="/contact">Let&apos;s Talk</a>
        </header>

        <section className="video-hero">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/blackvane-hero-poster.jpg"
          >
            <source src="/blackvane-hero.mp4" type="video/mp4" />
          </video>

          <div className="hero-shade" />

          <div className="hero-copy">
            <p className="hero-eyebrow">Organizational Diagnostics</p>
            <h1>See clearly.<br />Lead decisively.</h1>
            <p className="hero-lead">
              Blackvane gives leadership an unfiltered view of the business,
              the forces shaping performance, and the decisions that matter now.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="/diagnostics">Explore Diagnostics</a>
              <a className="secondary-cta" href="/contact">Confidential Conversation</a>
            </div>
          </div>

          <a className="hero-scroll" href="#reveal" aria-label="Continue">
            <span />
          </a>
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
    </main>
  );
}

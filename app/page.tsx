"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";

export default function HomePage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true, wheelMultiplier: 0.85 });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      const params = new URLSearchParams(window.location.search);
      const forceIntro = params.get("intro") === "1";
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const seenIntro = window.sessionStorage.getItem("blackvane13-intro-seen") === "1";
      const playIntro = forceIntro || (!seenIntro && !reducedMotion);

      if (!playIntro) {
        gsap.set(".intro", { display: "none" });
        gsap.set(".homepage", { autoAlpha: 1 });
        gsap.fromTo(
          ".hero-copy > *",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: "power2.out" }
        );
        return;
      }

      gsap.set(".intro", { display: "flex", autoAlpha: 1 });
      window.sessionStorage.setItem("blackvane13-intro-seen", "1");

      const intro = gsap.timeline();

      intro
        .set(".homepage", { autoAlpha: 0 })
        .set(".intro-panel", { xPercent: 0 })
        .set(".intro-center", { autoAlpha: 1 })
        .set(".intro-signal", { autoAlpha: 0 })
        .set(".intro-incision", { scaleY: 0, autoAlpha: 1, transformOrigin: "50% 50%" })
        .set(".intro-approved-logo", { autoAlpha: 0, scale: 0.985 })
        .set(".intro-thesis", { autoAlpha: 0, y: 10 })
        .to(".signal-revenue", { autoAlpha: 1, duration: 0.25 }, 0.55)
        .to(".signal-revenue", { autoAlpha: 1, duration: 0.70 }, 0.80)
        .to(".signal-revenue", { autoAlpha: 0, duration: 0.25 }, 1.50)
        .to(".signal-retention", { autoAlpha: 1, duration: 0.25 }, 1.85)
        .to(".signal-retention", { autoAlpha: 1, duration: 0.70 }, 2.10)
        .to(".signal-retention", { autoAlpha: 0, duration: 0.25 }, 2.80)
        .to(".signal-execution", { autoAlpha: 1, duration: 0.25 }, 3.15)
        .to(".signal-execution", { autoAlpha: 1, duration: 0.70 }, 3.40)
        .to(".signal-execution", { autoAlpha: 0, duration: 0.25 }, 4.10)
        .to(".signal-exposure", { autoAlpha: 1, duration: 0.25 }, 4.45)
        .to(".signal-exposure", { autoAlpha: 1, duration: 0.70 }, 4.70)
        .to(".signal-exposure", { autoAlpha: 0, duration: 0.25 }, 5.40)
        .to(".intro-incision", { scaleY: 1, duration: 0.85, ease: "power3.inOut" }, 5.75)
        .to(".intro-approved-logo", { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" }, 6.15)
        .to(".intro-incision", { autoAlpha: 0, duration: 0.45 }, 6.55)
        .to(".intro-thesis", { autoAlpha: 1, y: 0, duration: 0.70, ease: "power2.out" }, 7.45)
        .set(".homepage", { autoAlpha: 1 }, 8.70)
        .to(".intro-approved-logo, .intro-thesis", { autoAlpha: 0, duration: 0.35 }, 8.70)
        .to(".intro-panel-left", { xPercent: -101, duration: 1.10, ease: "power3.inOut" }, 9.05)
        .to(".intro-panel-right", { xPercent: 101, duration: 1.10, ease: "power3.inOut" }, 9.05)
        .fromTo(
          ".hero-copy > *",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: "power2.out" },
          9.28
        )
        .set(".intro", { display: "none" }, 10.20);
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
        <div className="intro-panel intro-panel-left" />
        <div className="intro-panel intro-panel-right" />

        <div className="intro-signals">
          <span className="intro-signal signal-revenue">REVENUE</span>
          <span className="intro-signal signal-retention">RETENTION</span>
          <span className="intro-signal signal-execution">EXECUTION</span>
          <span className="intro-signal signal-exposure">EXPOSURE</span>
        </div>

        <div className="intro-center">
          <div className="intro-incision" />
          <img
            className="intro-approved-logo"
            src="/blackvane13-approved.svg"
            alt=""
            style={{ width: "min(620px, 82vw)", height: "auto", display: "block", objectFit: "contain" }}
          />
          <div className="intro-thesis">Every organization tells the truth eventually.</div>
        </div>
      </section>

      <div className="homepage">
        <header className="home-header">
          <a className="home-wordmark" href="/" aria-label="Blackvane 13 home">
            BLACKVANE <span>13</span>
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
          <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/blackvane-hero-poster.jpg">
            <source src="/blackvane-hero.mp4" type="video/mp4" />
          </video>
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="hero-eyebrow">Organizational Diagnostics</p>
            <h1>See clearly.<br />Lead decisively.</h1>
            <p className="hero-lead">
              Blackvane 13 gives leadership an unfiltered view of the business,
              the forces shaping performance, and the decisions that matter now.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="/diagnostics">Explore Diagnostics</a>
              <a className="secondary-cta" href="/contact">Confidential Conversation</a>
            </div>
          </div>
          <a className="hero-scroll" href="#reveal" aria-label="Continue"><span /></a>
        </section>

        <section id="reveal" className="approved-section">
          <img src="/reveal-approved.jpg" alt="" />
          <div className="section-links reveal-links">
            <a href="/diagnostics" aria-label="The Blackvane Finding" />
            <a href="/approach" aria-label="Our approach" />
          </div>
        </section>

        <section className="approved-section"><img src="/pattern-approved.jpg" alt="" /></section>

        <section className="approved-section">
          <img src="/finding-approved.jpg" alt="" />
          <a className="learn-hotspot" href="/diagnostics" aria-label="Learn more about the Blackvane Finding" />
        </section>
      </div>
    </main>
  );
}

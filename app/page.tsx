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

      // Explicit inline display override makes ?intro=1 replay even when
      // the visitor's OS/browser has prefers-reduced-motion enabled.
      gsap.set(".intro", { display: "flex", autoAlpha: 1 });
      window.sessionStorage.setItem("blackvane13-intro-seen", "1");

      const intro = gsap.timeline();

      intro
        .set(".homepage", { autoAlpha: 0 })
        .set(".intro-panel", { xPercent: 0 })
        .set(".intro-center", { autoAlpha: 1 })
        .set(".intro-signal", { autoAlpha: 0 })
        .set(".intro-incision", { scaleY: 0, autoAlpha: 1, transformOrigin: "50% 50%" })
        .set(".intro-mark-piece", { autoAlpha: 0, y: 8 })
        .set(".intro-wordmark, .intro-discipline, .intro-thesis", { autoAlpha: 0, y: 8 })
        .to(".signal-revenue", { autoAlpha: 1, duration: 0.12 }, 0.28)
        .to(".signal-revenue", { autoAlpha: 0, duration: 0.16 }, 0.56)
        .to(".signal-retention", { autoAlpha: 1, duration: 0.12 }, 0.72)
        .to(".signal-retention", { autoAlpha: 0, duration: 0.16 }, 1.0)
        .to(".signal-execution", { autoAlpha: 1, duration: 0.12 }, 1.12)
        .to(".signal-execution", { autoAlpha: 0, duration: 0.16 }, 1.4)
        .to(".signal-exposure", { autoAlpha: 1, duration: 0.12 }, 1.52)
        .to(".signal-exposure", { autoAlpha: 0, duration: 0.16 }, 1.8)
        .to(".intro-incision", { scaleY: 1, duration: 0.6, ease: "power3.inOut" }, 1.86)
        .to(".intro-mark-piece", { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.06, ease: "power2.out" }, 2.28)
        .to(".intro-incision", { autoAlpha: 0, duration: 0.22 }, 2.58)
        .to(".intro-wordmark", { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 2.72)
        .to(".intro-discipline", { autoAlpha: 1, y: 0, duration: 0.4 }, 3.12)
        .to(".intro-thesis", { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 3.48)
        .set(".homepage", { autoAlpha: 1 }, 4.5)
        .to(".intro-center", { autoAlpha: 0, duration: 0.32 }, 4.52)
        .to(".intro-panel-left", { xPercent: -101, duration: 0.9, ease: "power3.inOut" }, 4.7)
        .to(".intro-panel-right", { xPercent: 101, duration: 0.9, ease: "power3.inOut" }, 4.7)
        .fromTo(
          ".hero-copy > *",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power2.out" },
          4.92
        )
        .set(".intro", { display: "none" }, 5.62);
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
          <div className="intro-mark" aria-hidden="true">
            <span className="intro-mark-piece mark-left" />
            <span className="intro-mark-piece mark-right mark-right-one" />
            <span className="intro-mark-piece mark-right mark-right-two" />
            <span className="intro-mark-piece mark-right mark-right-three" />
          </div>
          <div className="intro-wordmark">
            <span>BLACKVANE</span><sup>13</sup>
          </div>
          <div className="intro-discipline">ORGANIZATIONAL DIAGNOSTICS</div>
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
              Blackvane 13 gives leadership an unfiltered view of the business,
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

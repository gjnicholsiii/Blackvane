"use client";

import { usePathname } from "next/navigation";

type SiteHeaderProps = {
  embeddedHome?: boolean;
};

export default function SiteHeader({ embeddedHome = false }: SiteHeaderProps) {
  const pathname = usePathname();

  // The homepage places the same component inside its animated shell so the
  // header remains hidden until the opening sequence finishes.
  if (pathname === "/" && !embeddedHome) return null;

  return (
    <header className={`bv-site-header${embeddedHome ? " bv-site-header-home" : ""}`}>
      <a className="bv-site-wordmark-distressed" href="/" aria-label="Blackvane 13 home">
        <span className="bv-distressed-name" aria-hidden="true">BLACKVANE</span>
        <span className="bv-wordmark-13" aria-hidden="true">13</span>
      </a>

      <nav aria-label="Primary navigation">
        <a href="/approach">Approach</a>
        <a href="/diagnostics">Diagnostics</a>
        <a href="/solutions">Solutions</a>
        <a href="/expertise">Expertise</a>
        <a href="/about">About</a>
        <a href="/insights">Insights</a>
      </nav>

      <a className="bv-site-talk" href="mailto:joe@blackvane13.com">Let&apos;s Talk</a>

      <details className="bv-site-mobile">
        <summary>Menu</summary>
        <div className="bv-site-mobile-menu">
          <a href="/">Home</a>
          <a href="/approach">Approach</a>
          <a href="/diagnostics">Diagnostics</a>
          <a href="/solutions">Solutions</a>
          <a href="/expertise">Expertise</a>
          <a href="/about">About</a>
          <a href="/insights">Insights</a>
          <a href="mailto:joe@blackvane13.com">Email</a>
          <a href="tel:+18884881961">Call (888) 488-1961</a>
        </div>
      </details>
    </header>
  );
}

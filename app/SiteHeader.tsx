"use client";

import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <header className="site-header">
      <a className="site-wordmark" href="/" aria-label="Blackvane 13 home">
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
      <a className="site-talk" href="mailto:joe@blackvane13.com">Let&apos;s Talk</a>
    </header>
  );
}

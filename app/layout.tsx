import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./editorial.css";
import "./editorial-images.css";
import SiteHeader from "./SiteHeader";

export const metadata: Metadata = {
  title: "Blackvane 13 | See Clearly. Lead Decisively.",
  description: "Executive organizational diagnostics for leaders who need the truth.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <a
          className="global-phone"
          href="tel:+18884881961"
          aria-label="Call Blackvane 13 at 888 488 1961"
        >
          <span>CALL</span>
          <strong>(888) 488-1961</strong>
        </a>
      </body>
    </html>
  );
}

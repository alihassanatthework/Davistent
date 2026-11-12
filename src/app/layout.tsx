import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/Cart";
import { MobileActionBar } from "@/components/layout";
import { JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { accountUrl, checkoutUrl } from "@/lib/commerce";

/* Self-hosted at build, subset to Latin, font-display: swap, size-adjusted fallbacks */
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Canvas Tents, Glamping Tents & Camping Gear | Davis Tent", template: "%s | Davis Tent" },
  description:
    "Canvas wall tents, hot-tent packages, glamping tents, wood stoves and packing gear, handcrafted in Denver, Colorado since 1955.",
  openGraph: { type: "website", siteName: "Davis Tent", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#1F3A2E", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable} no-js antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.remove('no-js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <CartProvider checkoutUrl={checkoutUrl}>
          <Header accountUrl={accountUrl} />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
          <MobileActionBar />
        </CartProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": ["Organization", "LocalBusiness"],
            name: site.legalName,
            url: site.url,
            telephone: site.phone.display,
            email: site.email,
            foundingDate: "1955",
            slogan: site.tagline,
            address: {
              "@type": "PostalAddress",
              streetAddress: site.address.street,
              addressLocality: site.address.city,
              addressRegion: site.address.region,
              postalCode: site.address.postalCode,
              addressCountry: site.address.country,
            },
            sameAs: site.social.map((s) => s.href),
          }}
        />
      </body>
    </html>
  );
}

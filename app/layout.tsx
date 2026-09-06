import type { Metadata } from "next";
import site from "@/src/content/site.json";
import { asset, localBusinessJsonLd, siteUrl } from "./seo";
import "@fontsource/archivo-black/400.css";
import "@fontsource/azeret-mono/400.css";
import "@fontsource/azeret-mono/500.css";
import "@fontsource/azeret-mono/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.title,
    locale: "en_US",
    images: [{ url: asset(site.socialImage), width: 1200, height: 630, alt: `${site.title} social preview` }],
  },
  twitter: { card: "summary_large_image", images: [asset(site.socialImage)] },
  icons: { icon: asset(site.favicon) },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const businessJsonLd = localBusinessJsonLd();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.title,
    url: site.siteUrl,
    description: site.description,
  };
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }} />
        {businessJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd).replace(/</g, "\\u003c") }} />}
      </body>
    </html>
  );
}

import site from "@/src/content/site.json";

export const siteUrl = new URL(site.siteUrl);

// Prefix a public/ path with basePath so assets resolve on GitHub Pages
// project sites. Returns the path unchanged everywhere else.
export function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return path.startsWith("/") ? `${base}${path}` : path;
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export const locales = ["en", "es", "ja", "zh", "ko"] as const;
export type Locale = (typeof locales)[number];

const ogLocale: Record<Locale, string> = { en: "en_US", es: "es_ES", ja: "ja_JP", zh: "zh_CN", ko: "ko_KR" };

export function localePath(locale: string) {
  return locale === "en" ? "/" : `/${locale}/`;
}

export function hreflangAlternates() {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(localePath(l));
  languages["x-default"] = absoluteUrl("/");
  return languages;
}

export function localeMetadata(locale: Locale, title: string, description: string) {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(localePath(locale)), languages: hreflangAlternates() },
    openGraph: {
      type: "website" as const,
      siteName: site.title,
      title,
      description,
      url: absoluteUrl(localePath(locale)),
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ url: asset(site.socialImage), width: 1200, height: 630, alt: `${title} social preview` }],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [asset(site.socialImage)] },
  };
}

export function localBusinessJsonLd() {
  const business = site.localBusiness;
  if (!business?.enabled) return null;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name || site.title,
    url: site.siteUrl,
    ...(business.telephone && { telephone: business.telephone }),
    ...(business.email && { email: business.email }),
    address: {
      "@type": "PostalAddress",
      ...(business.streetAddress && { streetAddress: business.streetAddress }),
      ...(business.addressLocality && { addressLocality: business.addressLocality }),
      ...(business.addressRegion && { addressRegion: business.addressRegion }),
      ...(business.postalCode && { postalCode: business.postalCode }),
      ...(business.addressCountry && { addressCountry: business.addressCountry }),
    },
  };
}

import type { MetadataRoute } from "next";
import { absoluteUrl, hreflangAlternates, localePath, locales } from "./seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = hreflangAlternates();
  return locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified,
    alternates: { languages },
  }));
}

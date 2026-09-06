import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioExperience from "@/components/PortfolioExperience";
import home from "@/src/content/home.json";
import es from "@/src/content/i18n/es.json";
import ja from "@/src/content/i18n/ja.json";
import zh from "@/src/content/i18n/zh.json";
import ko from "@/src/content/i18n/ko.json";
import { localeMetadata, type Locale } from "../seo";

const DATA = { es, ja, zh, ko } as const;
type NonDefaultLocale = keyof typeof DATA;

export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(DATA) as NonDefaultLocale[]).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const data = DATA[locale as NonDefaultLocale];
  if (!data) return {};
  return localeMetadata(locale as Locale, data.meta.title, data.meta.description);
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = DATA[locale as NonDefaultLocale];
  if (!data) notFound();
  // A locale may add its own "home" block to translate the résumé content.
  // Without one it falls back to src/content/home.json, so translating the UI
  // alone is enough to ship a locale.
  const content = ("home" in data ? data.home : home) as typeof home;
  return <PortfolioExperience content={content} t={data.ui as never} locale={locale} />;
}

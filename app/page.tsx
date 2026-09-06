import type { Metadata } from "next";
import PortfolioExperience from "@/components/PortfolioExperience";
import content from "@/src/content/home.json";
import en from "@/src/content/i18n/en.json";
import { localeMetadata } from "./seo";

export const metadata: Metadata = localeMetadata("en", en.meta.title, en.meta.description);

export default function HomePage() {
  return <PortfolioExperience content={content} t={en.ui as never} locale="en" />;
}

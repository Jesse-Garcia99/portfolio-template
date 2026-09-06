import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <main><h1>Page not found</h1><p>The page may have moved or the link is incorrect.</p><a href="/">Return home</a></main>;
}

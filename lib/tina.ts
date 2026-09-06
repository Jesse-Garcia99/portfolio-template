import { client } from "@/tina/__generated__/client";
import fs from "fs";
import path from "path";

export async function getSiteData() {
  const result = await client.queries.site({ relativePath: "site.json" });
  return {
    data: result.data,
    variables: result.variables,
    query: result.query,
  };
}

export async function getPageData(slug: string) {
  return client.queries.page({ relativePath: `${slug}.json` });
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const res = await client.queries.pageConnection();
    const slugs = (res.data.pageConnection.edges ?? [])
      .map((edge) => edge?.node?.slug)
      .filter((slug): slug is string => typeof slug === "string");
    if (slugs.length > 0) return slugs;
  } catch {
    // fall through to filesystem fallback
  }

  const pagesDir = path.join(process.cwd(), "src", "content", "pages");
  if (!fs.existsSync(pagesDir)) return [];
  return fs
    .readdirSync(pagesDir)
    .filter((f: string) => f.endsWith(".json"))
    .map((f: string) => f.replace(/\.json$/, ""));
}

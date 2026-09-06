"use client";

import { useTina, tinaField } from "tinacms/dist/react";
import type { SiteQuery, SiteQueryVariables } from "@/tina/__generated__/types";

interface Props {
  data: SiteQuery;
  variables: SiteQueryVariables;
  query: string;
}

export default function TinaPage(props: Props) {
  const { data } = useTina(props);
  const site = data.site;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 data-tina-field={tinaField(site, "title")}>{site.title}</h1>
      <p data-tina-field={tinaField(site, "description")}>{site.description}</p>
    </div>
  );
}

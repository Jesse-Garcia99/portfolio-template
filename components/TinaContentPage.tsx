"use client";

import { tinaField, useTina } from "tinacms/dist/react";

type ContentRecord = Record<string, unknown>;

function string(value: unknown) {
  return typeof value === "string" ? value : "";
}

function Link({ href, label }: { href: string; label: string }) {
  const external = /^https?:\/\//.test(href);
  return <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{label}</a>;
}

function Section({ section }: { section: ContentRecord }) {
  const template = string(section._template);
  const title = string(section.title);
  const body = string(section.body);
  const image = string(section.image);
  const imageAlt = string(section.imageAlt);

  if (template === "cards") {
    const cards = Array.isArray(section.cards) ? section.cards as ContentRecord[] : [];
    return <section><h2>{title}</h2><div>{cards.map((card, index) => <article key={`${string(card.title)}-${index}`}><h3>{string(card.title)}</h3><p>{string(card.body)}</p>{string(card.url) && <Link href={string(card.url)} label={string(card.linkLabel) || "Learn more"} />}</article>)}</div></section>;
  }
  if (template === "list") {
    const items = Array.isArray(section.listItems) ? section.listItems : [];
    return <section><h2>{title}</h2><ul>{items.map((item, index) => <li key={`${string(item)}-${index}`}>{string(item)}</li>)}</ul></section>;
  }
  if (template === "links") {
    const links = Array.isArray(section.linkItems) ? section.linkItems as ContentRecord[] : [];
    return <section><h2>{title}</h2><ul>{links.map((item, index) => <li key={`${string(item.url)}-${index}`}><Link href={string(item.url)} label={string(item.label)} /></li>)}</ul></section>;
  }
  if (template === "stats") {
    const stats = Array.isArray(section.statItems) ? section.statItems as ContentRecord[] : [];
    return <section><div>{stats.map((item, index) => <div key={`${string(item.value)}-${index}`}><strong>{string(item.value)}</strong><p>{string(item.body)}</p></div>)}</div></section>;
  }
  if (template === "cta") {
    const buttons = Array.isArray(section.buttons) ? section.buttons as ContentRecord[] : [];
    return <section><h2>{title}</h2><p>{body}</p>{buttons.map((button, index) => <Link key={`${string(button.url)}-${index}`} href={string(button.url)} label={string(button.label)} />)}</section>;
  }
  if (template === "form") {
    const formSlug = string(section.formSlug);
    return <section><h2>{title}</h2><p>{body}</p>{formSlug && <Link href={`/forms/${formSlug}/`} label="Open form" />}</section>;
  }
  return <section><h2>{title}</h2>{body && <p>{body}</p>}{image && <img src={image} alt={imageAlt} />}</section>;
}

export default function TinaContentPage(props: { data: unknown; variables: unknown; query: string }) {
  const { data } = useTina(props as never) as { data: { page: ContentRecord } };
  const page = data.page;
  const hero = (page.hero ?? {}) as ContentRecord;
  const sections = Array.isArray(page.sections) ? page.sections as ContentRecord[] : [];

  return <main>
    <header>
      <p>{string(hero.kicker)}</p>
      <h1 data-tina-field={tinaField(page, "title")}>{string(hero.title) || string(page.title)}</h1>
      {string(hero.lede) && <p>{string(hero.lede)}</p>}
      {string(hero.image) && <img src={string(hero.image)} alt={string(hero.imageAlt)} />}
    </header>
    {sections.map((section, index) => <Section key={`${string(section._template)}-${index}`} section={section} />)}
  </main>;
}

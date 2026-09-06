# Portfolio Template

## What it is

A static, animated, multilingual portfolio site. One person's name, work
history, skills, and contact details, presented as a single scrolling page in
five languages.

## What it is not

Not a CMS-backed blog, not a marketing site, not a multi-page app. There is no
server and no database. Adding those is possible on Cloudflare Pages, but
nothing here depends on them.

## Principles

- Content lives in JSON under `src/content/`. Changing your copy should never
  mean editing a component.
- The default build takes no credentials. Accounts are opt-in.
- Motion is decoration. Every animation respects `prefers-reduced-motion`, and
  the page reads correctly with all of it disabled.
- The SEO audit runs in CI and fails the build, so metadata and alt text cannot
  quietly rot.

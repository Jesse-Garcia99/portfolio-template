# Site quality contract

Every agent changing this site must leave its affected pages more complete than it found them. Make safe, in-scope updates directly rather than merely reporting obvious omissions.

- Before shipping, run `npm run build` and `npm run audit:seo`.
- Keep `src/content/site.json` accurate: `siteUrl` must be the production HTTPS custom domain; set `socialImage`, `favicon`, and local-business details before launch.
- Every indexable page needs one descriptive `h1`, a unique title and description, a canonical URL, and crawlable internal links. Use the shared metadata helpers rather than hand-writing tags.
- Provide meaningful alt text for informative images. Decorative images must use an empty alt string deliberately.
- Add new public pages to `app/sitemap.ts`; do not include previews, admin, API endpoints, or 404 pages.
- Preserve `app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx`, structured data, and social metadata when refactoring.
- Never add development overlays, placeholder copy, source maps, or unhandled console errors to production. Keep client JavaScript minimal and lazy-load optional interactivity.
- When a task uncovers a crawler, accessibility, metadata, or console issue that can be fixed safely in the touched code, fix it in the same change and rerun validation.

Deployment tasks still require a human with provider access: attach the custom domain, set the production `SITE_URL`, submit the generated sitemap in Search Console, and resolve provider-reported indexing or DNS errors.

## Portfolio demo verification


## Workspace standards

- Comments: follow the code-comment-writer skill (<https://skills.rest/skill/code-comment-writer>). Why over what, minimal, no commented-out code.
- UI/design work: use design-taste-frontend, gpt-taste, impeccable (<https://www.tasteskill.dev/>).
- Always use graphify for codebase questions (`graphify query "<q>"` before raw browsing); `graphify update .` after code changes.
- Long-form docs live in the Obsidian vault (`~/Documents/Obsidian Vault/<project-folder>/`); code keeps a one-line pointer. Extend an existing related note; group docs by feature, never a doc per issue.
- Never place files directly in `~/developer` or `~/developer/Code`; everything goes inside a project folder.

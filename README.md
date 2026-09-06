# Portfolio Template

An animated, multilingual portfolio site. Next.js static export, TinaCMS for editing, Motion for the animation, and no server to run.

- Five locales out of the box (English, Spanish, Japanese, Chinese, Korean) with `hreflang`, per-locale metadata, and a language switcher
- Scroll-driven hero, an interactive skills panel, and a work timeline
- SEO and accessibility guardrails, plus a build-time audit that fails on missing metadata or alt text
- Builds with no accounts, no API keys, and no environment variables

## Quick start

```bash
git clone https://github.com/YOUR-HANDLE/YOUR-REPO.git
cd YOUR-REPO
npm install
npm run dev          # http://localhost:3000
```

`npm run build` writes a static site to `out/`. It needs no credentials.

## Make it yours

Everything you need to change is in `src/content/`. No component edits required.

| File | What it holds |
| --- | --- |
| `src/content/site.json` | Your name, email, domain, footer links, résumé link, navigation, SEO defaults |
| `src/content/home.json` | Hero copy, the manifesto, work history, skills, education |
| `src/content/i18n/en.json` | Interface text and headline copy for English |
| `src/content/i18n/{es,ja,zh,ko}.json` | The same for the other locales |
| `public/headshot.svg` | Placeholder portrait. Replace with your own image and update the filename in `components/PortfolioExperience.tsx` if the extension changes |
| `public/favicon.svg`, `public/social-card.svg` | Icon and social share image |

Set `siteUrl` in `site.json` to your real HTTPS domain before you deploy. It drives every canonical URL, the sitemap, and the social tags.

A locale file only has to translate the `ui` block. Add an optional `home` block to a locale to translate the résumé content too; without one it falls back to `src/content/home.json`.

To drop a locale, delete its JSON file and remove it from the `LOCALES` array in `components/PortfolioExperience.tsx`, the `DATA` map in `app/[locale]/page.tsx`, and the `locales` array in `app/seo.ts`.

Run the checks before you ship:

```bash
npm run lint         # TypeScript
npm run audit:seo    # metadata, headings, alt text, source maps
```

## Deploy

### Cloudflare Pages (recommended)

Recommended because the same project can later add D1, KV, R2, Workers AI, and Workers functions without moving hosts or changing your build. Free tier, global CDN, unlimited bandwidth.

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, then pick the repo.
3. Set the build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `out`
4. Add one environment variable under **Settings → Variables**: `NODE_VERSION` = `22.22.0`.
5. Deploy. Every push to `main` rebuilds automatically.
6. **Custom domain → Set up a domain** to attach your own, then update `siteUrl` in `src/content/site.json` to match.

Prefer the CLI:

```bash
npx wrangler pages project create my-portfolio --production-branch main
npm run pages:deploy
```

`wrangler.jsonc` sets the project name and output directory. Change `name` there if you use a different project name.

### GitHub Pages

Free and fine for a static portfolio, but there is no database, no serverless function, and no AI binding if you want one later.

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. The included `.github/workflows/github-pages.yml` handles the rest. Push to `main` to deploy.

The workflow sets `BASE_PATH` to `/<repo>` because a project site is served from `https://<user>.github.io/<repo>`. If you use a custom domain or name the repo `<user>.github.io`, the site serves from the root: delete the `BASE_PATH` line from the workflow.

Set `siteUrl` in `site.json` to the full published URL, including the `/<repo>` part if you keep it.

### Anywhere else

`npm run build` produces a plain static `out/` directory. Netlify, Vercel, S3, and any static host will serve it. Set `BASE_PATH` only if the site is served from a subpath.

## Optional: TinaCMS editing

The site builds and deploys without this. Add it when you want to edit content in a browser instead of a text editor.

1. Create a project at [app.tina.io](https://app.tina.io) and connect it to your repo.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_TINA_CLIENT_ID` — your project's Client ID (public)
   - `TINA_TOKEN` — a read-only token from **your project → Tokens** (secret)
3. Add both to your host's environment variables. On Cloudflare Pages, add `TINA_TOKEN` as an encrypted secret.
4. Change the build command to `npm run build:cloud` so the build pulls content from Tina Cloud.
5. Visit `/admin` on the deployed site and sign in.

`.env` and `.env.local` are gitignored. Never commit `TINA_TOKEN`.

## Notes

- Requires Node 22.22.0 or newer, pinned in `.nvmrc`.
- Security headers ship in `public/_headers`, which Cloudflare Pages applies automatically. GitHub Pages ignores this file; use a proxy if you need those headers there.
- Every animation is behind `prefers-reduced-motion`.
- `AGENTS.md` is a working contract for AI coding agents. Keep it, edit it, or delete it.

## License

MIT. See [LICENSE](LICENSE). Attribution is welcome but not required.

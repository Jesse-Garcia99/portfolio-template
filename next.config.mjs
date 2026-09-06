// GitHub Pages project sites are served from /<repo>, so every asset needs that
// prefix. Set BASE_PATH="/<repo>" in that one case. Cloudflare Pages, GitHub
// Pages user sites, and custom domains all serve from the root: leave it unset.
const basePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};

export default nextConfig;

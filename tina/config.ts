import { defineConfig } from "tinacms";
import { sectionTemplates, heroFields, navLinkFields } from "./schema/shared";

const branch = process.env.TINA_BRANCH || "main";
// Both come from the environment. clientId is public (it ships in the browser
// bundle); TINA_TOKEN is a secret and must never be committed.
const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "";
const token = process.env.TINA_TOKEN || "";

export default defineConfig({
  branch,
  clientId,
  token,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "site",
        label: "Site Settings",
        path: "src/content",
        format: "json",
        match: { include: "site" },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/",
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Site Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Site Description",
            ui: { component: "textarea" },
          },
          { type: "string", name: "siteUrl", label: "Production site URL", required: true, description: "HTTPS custom domain, without a trailing slash" },
          { type: "string", name: "owner", label: "Your name", required: true, description: "Shown in the wordmark and the footer" },
          { type: "string", name: "resumeUrl", label: "Résumé link", description: "Public path or URL, e.g. /resume.pdf. Leave empty to hide the footer link." },
          {
            type: "object", name: "social", label: "Footer links", list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Link" }) },
            fields: [
              { type: "string", name: "label", label: "Label", required: true },
              { type: "string", name: "url", label: "URL", required: true },
            ],
          },
          { type: "string", name: "socialImage", label: "Social share image", required: true, description: "Public path, e.g. /social-card.png (1200 × 630 recommended)" },
          { type: "string", name: "favicon", label: "Favicon", required: true, description: "Public path, e.g. /favicon.svg" },
          {
            type: "object", name: "localBusiness", label: "Local business structured data",
            fields: [
              { type: "boolean", name: "enabled", label: "Publish LocalBusiness schema" },
              { type: "string", name: "name", label: "Business name" },
              { type: "string", name: "telephone", label: "Telephone" },
              { type: "string", name: "email", label: "Email" },
              { type: "string", name: "streetAddress", label: "Street address" },
              { type: "string", name: "addressLocality", label: "City / locality" },
              { type: "string", name: "addressRegion", label: "State / region" },
              { type: "string", name: "postalCode", label: "Postal code" },
              { type: "string", name: "addressCountry", label: "Country code" },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact info",
            fields: [
              { type: "string", name: "phone", label: "Phone" },
              { type: "string", name: "phoneUrl", label: "Phone URL (tel:...)" },
              { type: "string", name: "email", label: "Email" },
              { type: "string", name: "emailUrl", label: "Email URL (mailto:...)" },
              { type: "string", name: "address", label: "Address" },
            ],
          },
          {
            type: "object",
            name: "navigation",
            label: "Main navigation",
            list: true,
            fields: navLinkFields,
          },
          {
            type: "object",
            name: "actions",
            label: "Global action URLs",
            fields: [
              { type: "string", name: "donate", label: "Donate URL" },
              { type: "string", name: "newsletter", label: "Newsletter signup URL" },
            ],
          },
        ],
      },

      {
        name: "home",
        label: "Portfolio Homepage",
        path: "src/content",
        format: "json",
        match: { include: "home" },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/",
        },
        fields: [
          { type: "string", name: "availability", label: "Availability message", required: true },
          { type: "string", name: "heroLead", label: "Hero introduction", required: true, ui: { component: "textarea" } },
          { type: "string", name: "manifestoTitle", label: "Manifesto heading", required: true, ui: { component: "textarea" } },
          { type: "string", name: "manifestoBody", label: "Manifesto body", required: true, ui: { component: "textarea" } },
          {
            type: "object",
            name: "experience",
            label: "Experience",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.role || "Experience" }) },
            fields: [
              { type: "string", name: "period", label: "Period", required: true },
              { type: "string", name: "role", label: "Role", required: true },
              { type: "string", name: "company", label: "Company", required: true },
              { type: "string", name: "summary", label: "Summary", required: true, ui: { component: "textarea" } }
            ]
          },
          {
            type: "object",
            name: "skills",
            label: "Skill demonstrations",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Skill" }) },
            fields: [
              { type: "string", name: "id", label: "Demo ID", required: true, options: ["code", "build", "data", "ship", "ai", "human"] },
              { type: "string", name: "label", label: "Label", required: true },
              { type: "string", name: "statement", label: "Statement", required: true, ui: { component: "textarea" } },
              { type: "string", name: "tools", label: "Tools", required: true, ui: { component: "textarea" } }
            ]
          },
          {
            type: "object",
            name: "education",
            label: "Education",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.school || "Education" }) },
            fields: [
              { type: "string", name: "school", label: "School", required: true },
              { type: "string", name: "degree", label: "Degree", required: true },
              { type: "string", name: "year", label: "Year", required: true }
            ]
          }
        ]
      },

      {
        name: "page",
        label: "Pages",
        path: "src/content/pages",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify: (values: Record<string, unknown>) =>
              (values?.slug as string) ||
              (values?.title as string)?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
              "page",
          },
          router: ({ document }: { document: Record<string, unknown> }) => {
            const slug = document.slug as string | undefined;
            return slug ? `/${slug}/` : undefined;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "URL slug",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Meta description",
            ui: { component: "textarea" },
          },
          { type: "boolean", name: "noIndex", label: "Keep this page out of search results", description: "Use for campaign, thank-you, or utility pages only" },
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: heroFields,
          },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            templates: sectionTemplates,
          },
        ],
      },

      {
        name: "form",
        label: "Forms",
        path: "src/content/forms",
        format: "json",
        ui: {
          router: ({ document }: { document: Record<string, unknown> }) => {
            const slug = document.slug as string | undefined;
            return slug ? `/forms/${slug}/` : undefined;
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Form title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "URL slug",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Form description",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "successMessage",
            label: "Success message",
            ui: { component: "textarea" },
            description: "Shown to the user after a successful submission",
          },
          {
            type: "string",
            name: "submitLabel",
            label: "Submit button label",
          },
          {
            type: "string",
            name: "submissionEndpoint",
            label: "Form submission endpoint",
            description: "Required in production. Use a secure external endpoint or a Cloudflare Pages Function URL.",
          },
          {
            type: "object",
            name: "fields",
            label: "Form fields",
            list: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "Field name (machine-readable, no spaces)",
                required: true,
              },
              {
                type: "string",
                name: "label",
                label: "Field label",
                required: true,
              },
              {
                type: "string",
                name: "type",
                label: "Field type",
                required: true,
                options: ["text", "email", "tel", "textarea", "select", "checkbox"],
                ui: { component: "select" },
              },
              {
                type: "boolean",
                name: "required",
                label: "Required",
              },
              {
                type: "string",
                name: "placeholder",
                label: "Placeholder",
              },
              {
                type: "string",
                name: "options",
                label: "Options (select only)",
                description: "Comma-separated list of options, e.g. 'Option A,Option B,Option C'",
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
    ],
  },
});

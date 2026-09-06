import type { Template } from "tinacms";

export const buttonFields = [
  {
    type: "string" as const,
    name: "label",
    label: "Button label",
  },
  {
    type: "string" as const,
    name: "url",
    label: "URL",
  },
  {
    type: "string" as const,
    name: "style",
    label: "Style",
    options: ["primary", "outline", "light"],
    ui: { component: "select" },
  },
  {
    type: "boolean" as const,
    name: "external",
    label: "Open in new tab",
  },
];

export const cardItemFields = [
  {
    type: "string" as const,
    name: "title",
    label: "Title",
  },
  {
    type: "string" as const,
    name: "body",
    label: "Body",
    ui: { component: "textarea" },
  },
  {
    type: "string" as const,
    name: "linkLabel",
    label: "Link label",
  },
  {
    type: "string" as const,
    name: "url",
    label: "Link URL",
  },
  {
    type: "boolean" as const,
    name: "external",
    label: "External link",
  },
];

export const heroFields = [
  {
    type: "string" as const,
    name: "kicker",
    label: "Eyebrow",
  },
  {
    type: "string" as const,
    name: "title",
    label: "Title",
    required: true,
  },
  {
    type: "string" as const,
    name: "lede",
    label: "Lead paragraph",
    ui: { component: "textarea" },
  },
  {
    type: "string" as const,
    name: "image",
    label: "Hero background image",
    description: "Filename in public/assets/images/ — optional",
  },
  {
    type: "string" as const,
    name: "imageAlt",
    label: "Hero image alt text",
  },
];

export const sectionTemplates: Template[] = [
  {
    name: "intro",
    label: "Intro (text + image)",
    fields: [
      { type: "string", name: "eyebrow", label: "Eyebrow" },
      { type: "string", name: "title", label: "Heading" },
      {
        type: "string",
        name: "body",
        label: "Body",
        ui: { component: "textarea" },
      },
      {
        type: "string",
        name: "image",
        label: "Image filename",
        description: "Optional — uses a default image if empty",
      },
      { type: "string", name: "imageAlt", label: "Image alt text" },
    ],
  },
  {
    name: "cards",
    label: "Card grid",
    fields: [
      { type: "string", name: "title", label: "Section heading" },
      {
        type: "object",
        name: "cards",
        label: "Cards",
        list: true,
        fields: cardItemFields,
      },
    ],
  },
  {
    name: "split",
    label: "Split (text + image)",
    fields: [
      { type: "string", name: "eyebrow", label: "Eyebrow" },
      { type: "string", name: "title", label: "Heading" },
      {
        type: "string",
        name: "body",
        label: "Body",
        ui: { component: "textarea" },
      },
      {
        type: "string",
        name: "image",
        label: "Image filename",
        description: "Filename in public/assets/images/",
      },
      { type: "string", name: "imageAlt", label: "Image alt text" },
    ],
  },
  {
    name: "list",
    label: "Checklist",
    fields: [
      { type: "string", name: "title", label: "Heading" },
      {
        type: "string",
        name: "listItems",
        label: "Items",
        list: true,
      },
    ],
  },
  {
    name: "stats",
    label: "Statistics",
    fields: [
      {
        type: "object",
        name: "statItems",
        label: "Stats",
        list: true,
        fields: [
          { type: "string", name: "value", label: "Value" },
          {
            type: "string",
            name: "body",
            label: "Description",
            ui: { component: "textarea" },
          },
        ],
      },
    ],
  },
  {
    name: "links",
    label: "Link list",
    fields: [
      { type: "string", name: "eyebrow", label: "Eyebrow" },
      { type: "string", name: "title", label: "Heading" },
      {
        type: "object",
        name: "linkItems",
        label: "Links",
        list: true,
        fields: [
          { type: "string", name: "label", label: "Label" },
          { type: "string", name: "url", label: "URL" },
        ],
      },
    ],
  },
  {
    name: "contact",
    label: "Contact cards",
    fields: [
      {
        type: "object",
        name: "contactItems",
        label: "Contact items",
        list: true,
        fields: [
          { type: "string", name: "label", label: "Label" },
          {
            type: "string",
            name: "value",
            label: "Value",
            ui: { component: "textarea" },
          },
          { type: "string", name: "url", label: "Link (optional)" },
        ],
      },
    ],
  },
  {
    name: "cta",
    label: "Call to action",
    fields: [
      { type: "string", name: "title", label: "Heading" },
      {
        type: "string",
        name: "body",
        label: "Body",
        ui: { component: "textarea" },
      },
      {
        type: "object",
        name: "buttons",
        label: "Buttons",
        list: true,
        fields: buttonFields,
      },
    ],
  },
  {
    name: "form",
    label: "Form",
    fields: [
      { type: "string", name: "eyebrow", label: "Eyebrow" },
      { type: "string", name: "title", label: "Heading" },
      {
        type: "string",
        name: "body",
        label: "Body",
        ui: { component: "textarea" },
      },
      {
        type: "string",
        name: "formSlug",
        label: "Form slug",
        description:
          "The slug of the form to embed (matches a file in src/content/forms/). E.g. 'contact'",
      },
    ],
  },
];

export const navLinkFields = [
  { type: "string" as const, name: "label", label: "Label", required: true },
  { type: "string" as const, name: "url", label: "URL", required: true },
];

export const statFields = [
  { type: "string" as const, name: "value", label: "Value" },
  {
    type: "string" as const,
    name: "body",
    label: "Description",
    ui: { component: "textarea" },
  },
];

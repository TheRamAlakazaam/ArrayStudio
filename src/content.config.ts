import { defineCollection, z } from "astro:content";

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    intro: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    author: z.string(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
  }),
});

export const collections = { pages, blog };

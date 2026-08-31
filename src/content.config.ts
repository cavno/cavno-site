import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 作品条目集合：每个条目一个 Markdown 文件，位于 src/content/items/。
 * section / subsection 刻意用 z.string() 而非枚举——
 * 这样在后台给 nav.json 新增板块时，旧 schema 不会阻塞构建。
 */
const items = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/items' }),
  schema: z.object({
    title: z.string(),
    section: z.string(),
    subsection: z.string().default(''),
    href: z.string(),
    date: z.coerce.date(),
    uploadedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().default(''),
  }),
});

export const collections = { items };

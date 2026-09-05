import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import nav from '../content/nav.json';
import { concepts, groups, conceptUpdated } from '../content/concepts';
import {
  derivePresentation,
  htmlToPlainText,
  makeBodyLookup,
} from '../lib/content-presentation';
import { compareItemsNewestFirst, itemUpdateTimestamp } from '../lib/content-order';

export const prerender = true;

const legacyBodies = import.meta.glob('../legacy/**/body.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const bodyByHref = makeBodyLookup(legacyBodies);

export const GET: APIRoute = async () => {
  const entries = (await getCollection('items'))
    // Working 由 Cloudflare Access 保护；公开索引不能泄露其标题和正文。
    .filter((item) => item.data.section !== 'working')
    .sort(compareItemsNewestFirst)
    .map((item) => {
      const body = bodyByHref[item.data.href] ?? '';
      const section = nav.sections.find((entry) => entry.slug === item.data.section);
      const subsection = section?.subsections.find((entry) => entry.slug === item.data.subsection);
      const presentation = derivePresentation({
        href: item.data.href,
        title: item.data.title,
        summary: item.data.summary,
        tags: item.data.tags,
        section: item.data.section,
        subsection: item.data.subsection,
        body,
      });
      const sectionLabel = section?.en ?? item.data.section;
      const subsectionLabel = subsection?.en ?? item.data.subsection;
      const content = htmlToPlainText(body);

      return {
        href: item.data.href,
        title: item.data.title,
        summary: presentation.summary,
        tags: presentation.keywords,
        section: item.data.section,
        subsection: item.data.subsection,
        sectionLabel,
        subsectionLabel,
        date: item.data.date.toISOString().slice(0, 10),
        updatedAt: itemUpdateTimestamp(item),
        cover: {
          hue: presentation.hue,
          saturation: presentation.saturation,
          theme: presentation.theme,
          layout: presentation.layout,
          texture: presentation.texture,
          variant: presentation.variant,
          serial: presentation.serial,
          motif: presentation.motif,
        },
        text: [
          item.data.title,
          presentation.summary,
          item.data.tags.join(' '),
          sectionLabel,
          subsectionLabel,
          content,
        ].join(' '),
      };
    });

  const conceptEntries = concepts.map((concept) => {
    const href = `/about/concepts/#${concept.slug}`;
    const group = groups.find((g) => g.id === concept.group)!;
    const presentation = derivePresentation({
      href, title: concept.name, summary: concept.definition,
      tags: [concept.en, group.name], section: 'about', subsection: 'concepts', body: '',
    });
    return {
      href, title: `${concept.name} · 概念库`, summary: concept.definition,
      tags: [concept.en, group.name], section: 'about', subsection: 'concepts',
      sectionLabel: 'About', subsectionLabel: '概念库', date: conceptUpdated,
      updatedAt: Date.parse(`${conceptUpdated}T00:00:00+08:00`),
      cover: {
        hue: presentation.hue, saturation: presentation.saturation,
        theme: presentation.theme, layout: presentation.layout,
        texture: presentation.texture, variant: presentation.variant,
        serial: presentation.serial, motif: presentation.motif,
      },
      text: [concept.name, concept.en, group.name, '概念库', concept.definition, concept.essentials, concept.boundary, concept.example].join(' '),
    };
  });
  return new Response(JSON.stringify({ version: 2, items: [...entries, ...conceptEntries] }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};

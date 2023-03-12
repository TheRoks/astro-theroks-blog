import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

import { SITE } from './src/config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  SITE.googleAnalyticsId ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  output: 'static',

  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    robotsTxt(),
    sitemap({
      serialize(item) {
        if (/blog/.test(item.url) || /about/.test(item.url)) {
          return undefined;
        }
        item.changefreq = 'weekly';
        item.priority = 0.7;

        return item;
      },
    }),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      svg: false,

      logger: 1,
    }),
  ],

  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'github-dark-dimmed',
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: false,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          content: {
            type: 'element',
            tagName: 'span',
            properties: { className: ['heading-link', 'not-prose'] },
            children: [
              {
                type: 'element',
                tagName: 'img',
                properties: { src: '/assets/link.svg', width: '16px', height: '16px' },
                children: [],
              },
            ],
          },
        },
      ],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          content: {
            type: 'element',
            tagName: 'img',
            properties: {
              src: '/assets/external-link.svg',
              alt: 'External link icon',
              width: '16px',
              height: '16px'
            },
            children: [],
          },
          contentProperties: { className: ['external-link-icon', 'not-prose'] },
        },
      ],
    ],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
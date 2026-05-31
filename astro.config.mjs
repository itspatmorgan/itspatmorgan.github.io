// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

/** Wraps <p><img title="Caption"></p> in <figure><img><figcaption>Caption</figcaption></figure> */
function rehypeFigure() {
  return (tree) => {
    function walk(node) {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.tagName === 'p') {
          const real = child.children.filter(n => n.type !== 'text' || n.value.trim() !== '');
          if (real.length === 1 && real[0].tagName === 'img') {
            const img = real[0];
            const title = img.properties?.title;
            if (title) {
              delete img.properties.title;
              node.children[i] = {
                type: 'element',
                tagName: 'figure',
                properties: {},
                children: [
                  img,
                  { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: title }] },
                ],
              };
            }
          }
        }
        walk(child);
      }
    }
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://itspatmorgan.com',
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), mdx()],
  markdown: {
    rehypePlugins: [rehypeFigure],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

import { defineConfig } from 'vitepress';

function canonicalPath(relativePath: string): string {
  if (relativePath === 'index.md') {
    return '/';
  }

  return `/${relativePath.replace(/\.md$/, '.html')}`;
}

export default defineConfig({
  lang: 'en-US',
  title: 'Grain',
  description: 'Universal interaction layer for AI interfaces',
  base: '/grain/',
  lastUpdated: true,
  markdown: {
    languageAlias: {
      grain: 'xml',
      ebnf: 'txt'
    }
  },
  sitemap: {
    hostname: 'https://sir-ad.github.io/grain'
  },
  transformHead({ pageData }) {
    return [
      ['link', {
        rel: 'canonical',
        href: `https://sir-ad.github.io/grain${canonicalPath(pageData.relativePath)}`
      }]
    ];
  },
  head: [
    ['link', { rel: 'icon', href: '/grain/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Grain' }],
    ['meta', { property: 'og:description', content: 'Universal interaction layer for AI interfaces' }],
    ['meta', { property: 'og:image', content: 'https://sir-ad.github.io/grain/og-image.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  themeConfig: {
    logo: {
      src: '/logo.svg',
      alt: 'Grain logo'
    },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Primitives', link: '/primitives/overview' },
      { text: 'G-Lang', link: '/g-lang/syntax' },
      { text: 'API', link: '/api/core' },
      { text: 'About', link: '/about' },
      { text: 'Privacy', link: '/privacy' },
      { text: 'Contact', link: '/contact' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Examples', link: '/guide/examples' }
          ]
        }
      ],
      '/primitives/': [
        {
          text: 'Primitives',
          items: [
            { text: 'Overview', link: '/primitives/overview' },
            { text: 'Stream', link: '/primitives/stream' },
            { text: 'Think', link: '/primitives/think' },
            { text: 'Tool', link: '/primitives/tool' },
            { text: 'Artifact', link: '/primitives/artifact' },
            { text: 'Input', link: '/primitives/input' },
            { text: 'Context', link: '/primitives/context' },
            { text: 'State', link: '/primitives/state' },
            { text: 'Error', link: '/primitives/error' },
            { text: 'Approve', link: '/primitives/approve' },
            { text: 'Branch', link: '/primitives/branch' }
          ]
        }
      ],
      '/g-lang/': [
        {
          text: 'G-Lang',
          items: [
            { text: 'Syntax', link: '/g-lang/syntax' },
            { text: 'Grammar', link: '/g-lang/grammar' },
            { text: 'Examples', link: '/g-lang/examples' }
          ]
        }
      ],
      '/adapters/': [
        {
          text: 'Adapters',
          items: [
            { text: 'Web', link: '/adapters/web' },
            { text: 'CLI', link: '/adapters/cli' },
            { text: 'MCP', link: '/adapters/mcp' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API',
          items: [
            { text: 'Core', link: '/api/core' },
            { text: 'Web Adapter', link: '/api/web' },
            { text: 'CLI Adapter', link: '/api/cli' },
            { text: 'MCP Adapter', link: '/api/mcp' }
          ]
        }
      ],
      '/contributing/': [
        {
          text: 'Contributing',
          items: [
            { text: 'Overview', link: '/contributing/index' },
            { text: 'Infrastructure', link: '/contributing/infrastructure' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sir-ad/grain' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Grain'
    },
    search: {
      provider: 'local'
    },
    outline: 'deep'
  }
});

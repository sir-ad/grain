import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Grain',
  description: 'Universal interaction layer for AI interfaces',
  base: '/grain/',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/grain/' },
      { text: 'Guide', link: '/grain/guide/getting-started' },
      { text: 'Primitives', link: '/grain/primitives/overview' },
      { text: 'G-Lang', link: '/grain/g-lang/syntax' },
      { text: 'API', link: '/grain/api/core' },
    ],
    
    sidebar: {
      '/grain/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/grain/guide/getting-started' },
            { text: 'Quick Start', link: '/grain/guide/quick-start' },
            { text: 'Examples', link: '/grain/guide/examples' },
          ]
        }
      ],
      '/grain/primitives/': [
        {
          text: 'Primitives',
          items: [
            { text: 'Overview', link: '/grain/primitives/overview' },
            { text: 'Stream', link: '/grain/primitives/stream' },
            { text: 'Think', link: '/grain/primitives/think' },
            { text: 'Tool', link: '/grain/primitives/tool' },
            { text: 'Artifact', link: '/grain/primitives/artifact' },
            { text: 'Input', link: '/grain/primitives/input' },
            { text: 'Context', link: '/grain/primitives/context' },
            { text: 'State', link: '/grain/primitives/state' },
            { text: 'Error', link: '/grain/primitives/error' },
            { text: 'Approve', link: '/grain/primitives/approve' },
            { text: 'Branch', link: '/grain/primitives/branch' },
          ]
        }
      ],
      '/grain/g-lang/': [
        {
          text: 'G-Lang',
          items: [
            { text: 'Syntax', link: '/grain/g-lang/syntax' },
            { text: 'Grammar', link: '/grain/g-lang/grammar' },
            { text: 'Examples', link: '/grain/g-lang/examples' },
          ]
        }
      ],
      '/grain/adapters/': [
        {
          text: 'Adapters',
          items: [
            { text: 'Web', link: '/grain/adapters/web' },
            { text: 'CLI', link: '/grain/adapters/cli' },
            { text: 'MCP', link: '/grain/adapters/mcp' },
          ]
        }
      ],
      '/grain/api/': [
        {
          text: 'API',
          items: [
            { text: 'Core', link: '/grain/api/core' },
            { text: 'Web Adapter', link: '/grain/api/web' },
            { text: 'CLI Adapter', link: '/grain/api/cli' },
            { text: 'MCP Adapter', link: '/grain/api/mcp' },
          ]
        }
      ],
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sir-ad/grain' }
    ],
    
    footer: {
      message: 'Released under MIT License.',
      copyright: 'Copyright © 2024 Grain'
    },
    
    search: {
      provider: 'local'
    },
    
    outline: 'deep'
  },
  
  head: [
    ['link', { rel: 'icon', href: '/grain/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#000000' }],
  ]
})

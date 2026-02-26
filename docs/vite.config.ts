import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Grain',
  description: 'Universal interaction layer for AI interfaces',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Primitives', link: '/primitives/overview' },
      { text: 'G-Lang', link: '/g-lang/syntax' },
      { text: 'API', link: '/api/core' },
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Examples', link: '/guide/examples' },
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
            { text: 'Branch', link: '/primitives/branch' },
          ]
        }
      ],
      '/g-lang/': [
        {
          text: 'G-Lang',
          items: [
            { text: 'Syntax', link: '/g-lang/syntax' },
            { text: 'Grammar', link: '/g-lang/grammar' },
            { text: 'Examples', link: '/g-lang/examples' },
          ]
        }
      ],
      '/adapters/': [
        {
          text: 'Adapters',
          items: [
            { text: 'Web', link: '/adapters/web' },
            { text: 'CLI', link: '/adapters/cli' },
            { text: 'MCP', link: '/adapters/mcp' },
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
            { text: 'MCP Adapter', link: '/api/mcp' },
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
    
    outline: 'deep',
    
    editLink: {
      pattern: 'https://github.com/sir-ad/grain/edit/main/docs/:path',
      text: 'Edit this page'
    }
  },
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#000000' }],
  ]
})

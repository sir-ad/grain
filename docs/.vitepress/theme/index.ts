import DefaultTheme from 'vitepress/theme'
import { defineComponent, h, onMounted, ref } from 'vue'
import Playground from './components/Playground.vue'
import { setupSiteA11y } from './site-a11y'
import './custom.css'

const ClientPlayground = defineComponent({
  name: 'ClientPlayground',
  setup() {
    const mounted = ref(false)

    onMounted(() => {
      mounted.value = true
    })

    return () => {
      if (mounted.value) {
        return h(Playground)
      }

      return h('div', { class: 'playground-fallback glass' }, [
        h('p', { class: 'playground-fallback-title' }, 'Interactive preview initializes in the browser.'),
        h('p', { class: 'playground-fallback-copy' }, 'Use the editor and rendered preview after the page hydrates. The docs site is mounted under /grain/.')
      ])
    }
  }
})

export default {
  ...DefaultTheme,
  Layout: () => {
    return h('div', { class: 'grain-layout-shell' }, [
      h(DefaultTheme.Layout, null, {
        'home-hero-after': () => h('div', { class: 'home-playground' }, [
          h(ClientPlayground)
        ])
      })
    ])
  },
  enhanceApp({ app, router }) {
    setupSiteA11y(router)
    app.component('Playground', Playground)
    app.component('ClientPlayground', ClientPlayground)
  }
}

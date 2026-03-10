import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Playground from './components/Playground.vue'
import SiteA11y from './components/SiteA11y.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout: () => {
    return h('div', { class: 'grain-layout-shell' }, [
      h(SiteA11y),
      h(DefaultTheme.Layout, null, {
      'home-hero-after': () => h('div', { class: 'home-playground' }, [
        h(Playground)
      ])
      })
    ])
  },
  enhanceApp({ app }) {
    app.component('Playground', Playground)
    app.component('SiteA11y', SiteA11y)
  }
}

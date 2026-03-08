import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Playground from './components/Playground.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-after': () => h('div', { class: 'home-playground' }, [
        h(Playground)
      ])
    })
  },
  enhanceApp({ app }) {
    app.component('Playground', Playground)
  }
}

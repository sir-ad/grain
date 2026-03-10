<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
let observer: MutationObserver | null = null

function addRelToken(anchor: HTMLAnchorElement, token: string) {
  const tokens = new Set(anchor.rel.split(/\s+/).filter(Boolean))
  tokens.add(token)
  anchor.rel = Array.from(tokens).join(' ')
}

function applyEnhancements() {
  const main = document.querySelector('#VPContent')
  if (main instanceof HTMLElement) {
    const pageMain = document.querySelector('main.main')

    if (pageMain instanceof HTMLElement) {
      main.removeAttribute('role')
      main.removeAttribute('aria-label')
    } else {
      main.setAttribute('role', 'main')
      main.setAttribute('aria-label', 'Main documentation content')
    }
  }

  const searchButton = document.querySelector('.DocSearch-Button')
  if (searchButton instanceof HTMLButtonElement) {
    searchButton.setAttribute('aria-label', 'Search documentation (Command+K)')
    searchButton.setAttribute('title', 'Search documentation (Command+K)')
  }

  document.querySelectorAll<HTMLButtonElement>('.VPSwitchAppearance').forEach((button) => {
    button.setAttribute('aria-label', 'Toggle color theme')
    button.setAttribute('title', 'Toggle color theme')
  })

  document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]').forEach((anchor) => {
    addRelToken(anchor, 'noopener')
    addRelToken(anchor, 'noreferrer')
  })

  const logo = document.querySelector('.VPNavBarTitle .logo')
  if (logo instanceof HTMLImageElement) {
    logo.setAttribute('width', '24')
    logo.setAttribute('height', '24')
    logo.setAttribute('decoding', 'async')
  }
}

async function applyAfterRender() {
  await nextTick()
  applyEnhancements()
}

onMounted(() => {
  applyAfterRender()

  observer = new MutationObserver(() => {
    applyEnhancements()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})

watch(() => route.path, () => {
  applyAfterRender()
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template></template>

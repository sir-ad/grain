import type { Router } from 'vitepress'

let initialized = false
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

  document.querySelectorAll<HTMLAnchorElement>('.VPSocialLink[aria-label="github"]').forEach((anchor) => {
    anchor.setAttribute('aria-label', 'GitHub')
    anchor.setAttribute('title', 'GitHub')
  })
}

function scheduleEnhancements() {
  window.requestAnimationFrame(() => {
    applyEnhancements()
  })
}

export function setupSiteA11y(router: Router) {
  if (typeof window === 'undefined' || initialized) {
    return
  }

  initialized = true
  scheduleEnhancements()

  observer = new MutationObserver(() => {
    applyEnhancements()
  })

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  const previousAfterRouteChange = router.onAfterRouteChange
  router.onAfterRouteChange = async (to) => {
    await previousAfterRouteChange?.(to)
    scheduleEnhancements()
  }

  window.addEventListener('beforeunload', () => {
    observer?.disconnect()
    observer = null
  }, { once: true })
}

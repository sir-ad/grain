import { WebAdapter } from '@grain/web';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://sir-ad.github.io/grain';
const SITE_NAME = 'Grain';

const adapter = new WebAdapter({
  theme: {
    '--grain-primary': 'var(--text)',
    '--grain-background': 'transparent',
    '--grain-border': 'var(--border)',
    '--grain-font-family': 'var(--font-sans)',
  }
});

// @ts-ignore
window.adapter = adapter;

// Register custom elements for G-Lang primitives
adapter.registerCustomElements();


const exampleGrain = `<message role="assistant">
  <think visible="true">Initializing Grain Preview for ${SITE_NAME}...</think>
  <stream speed="fast">Welcome to the future of interaction at ${SITE_URL}</stream>
  <layout type="grid" direction="row" gap="20px">
    <chart type="bar" title="Performance" data="[10, 45, 30, 70]" />
    <form action="/submit" schema='{"type": "object", "properties": {"email": {"type": "string"}}}' />
  </layout>
</message>`;

const target = document.getElementById('grain-render-target');
if (target) {
  adapter.render(exampleGrain, { container: target });
}

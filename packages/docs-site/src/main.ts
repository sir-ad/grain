import { WebAdapter } from '@grain.sh/web';

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

// Typewriter effect for the installation command
const typeCommand = async (elementId: string, text: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
  }
};

typeCommand('typewriter-command', 'pnpm add @grain.sh/web');

// Add subtle scroll reveal effect
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.glass').forEach(el => observer.observe(el));

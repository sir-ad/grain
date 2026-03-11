// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from 'vitest';

import { WebAdapter } from '../src/index';

describe('WebAdapter', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('injects the default stylesheet only once across renders', () => {
    const firstAdapter = new WebAdapter();
    const secondAdapter = new WebAdapter();
    const firstHost = document.createElement('div');
    const secondHost = document.createElement('div');

    firstAdapter.registerCustomElements();
    secondAdapter.registerCustomElements();

    firstAdapter.render('<message role="assistant"><stream>Hello</stream></message>', { container: firstHost });
    secondAdapter.render('<message role="assistant"><stream>Again</stream></message>', { container: secondHost });

    expect(document.head.querySelectorAll('#grain-web-default-styles')).toHaveLength(1);
  });

  it('renders documented primitives with root theme hooks and status data', () => {
    const adapter = new WebAdapter({
      theme: {
        '--grain-primary': '#123456'
      }
    });
    const host = document.createElement('div');

    adapter.render(
      `<message role="assistant">
        <stream>Hello from Grain.</stream>
        <tool name="get_weather" status="running">
          <progress value="45" max="100">45%</progress>
          <result>Sunny</result>
        </tool>
      </message>`,
      { container: host }
    );

    const message = host.querySelector('grain-message');
    const tool = host.querySelector('grain-tool');
    const progress = host.querySelector('grain-progress');

    expect(host.getAttribute('data-grain-root')).toBe('true');
    expect(host.style.getPropertyValue('--grain-primary')).toBe('#123456');
    expect(message?.getAttribute('data-role')).toBe('assistant');
    expect(tool?.getAttribute('data-title')).toBe('Tool · get_weather');
    expect(tool?.getAttribute('data-status')).toBe('running');
    expect(progress?.style.getPropertyValue('--grain-progress-scale')).toBe('0.45');
  });

  it('keeps hidden think blocks collapsed until toggled', () => {
    const adapter = new WebAdapter();
    const host = document.createElement('div');

    adapter.render(
      `<message role="assistant"><think visible="false">Private reasoning</think></message>`,
      { container: host }
    );

    const think = host.querySelector('grain-think');
    expect(think?.getAttribute('data-hidden')).toBe('true');
    expect(think?.getAttribute('data-visible')).toBe('false');
    expect(think?.getAttribute('aria-expanded')).toBe('false');

    think?.dispatchEvent(new MouseEvent('click'));

    expect(think?.getAttribute('data-visible')).toBe('true');
    expect(think?.getAttribute('aria-expanded')).toBe('true');
  });
});

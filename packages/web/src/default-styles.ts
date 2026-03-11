export const DEFAULT_THEME = {
  '--grain-primary': '#2155ff',
  '--grain-secondary': '#5c6c87',
  '--grain-background': '#f6efe5',
  '--grain-surface': '#fffaf3',
  '--grain-surface-strong': '#eef4ff',
  '--grain-border': '#d8d0c4',
  '--grain-text': '#162033',
  '--grain-muted': '#5d6b82',
  '--grain-error': '#cf465d',
  '--grain-success': '#0d8f63',
  '--grain-warning': '#c77a12',
  '--grain-shadow': '0 18px 42px rgba(17, 24, 39, 0.14)',
  '--grain-radius': '18px',
  '--grain-font-family': '"Outfit", "Avenir Next", "Segoe UI", sans-serif',
  '--grain-font-mono': '"JetBrains Mono", "SF Mono", Monaco, Consolas, monospace',
  '--grain-space-xs': '4px',
  '--grain-space-sm': '8px',
  '--grain-space-md': '16px',
  '--grain-space-lg': '24px',
  '--grain-space-xl': '32px',
  '--grain-duration-fast': '150ms',
  '--grain-duration-normal': '300ms'
} as const;

export const DEFAULT_STYLES = `
:where([data-grain-root]) {
  color: var(--grain-text, #162033);
  font-family: var(--grain-font-family, "Outfit", "Avenir Next", "Segoe UI", sans-serif);
  display: block;
}

:where([data-grain-root] *) {
  box-sizing: border-box;
}

:where([data-grain-root] > * + *) {
  margin-top: var(--grain-space-md, 16px);
}

:where([data-grain-root]) :is(
  grain-message,
  grain-stream,
  grain-think,
  grain-tool,
  grain-artifact,
  grain-context,
  grain-approve,
  grain-error,
  grain-input,
  grain-action,
  grain-option,
  grain-result,
  grain-progress,
  grain-warning,
  grain-layout,
  grain-table,
  grain-memory,
  grain-form,
  grain-chart
) {
  display: block;
  font-family: inherit;
  color: inherit;
}

:where([data-grain-root]) :is(grain-action, grain-option) {
  display: inline-flex;
}

:where([data-grain-root]) grain-message {
  position: relative;
  padding: 18px 20px;
  border-radius: calc(var(--grain-radius, 18px) + 2px);
  border: 1px solid var(--grain-border, #d8d0c4);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.2)),
    var(--grain-surface, #fffaf3);
  box-shadow: var(--grain-shadow, 0 18px 42px rgba(17, 24, 39, 0.14));
}

:where([data-grain-root]) grain-message[data-role="user"] {
  margin-left: 12%;
  border-color: rgba(33, 85, 255, 0.18);
  background:
    linear-gradient(135deg, rgba(33, 85, 255, 0.96), rgba(66, 167, 234, 0.88)),
    var(--grain-primary, #2155ff);
  color: #f8fbff;
}

:where([data-grain-root]) grain-message[data-role="assistant"] {
  margin-right: 12%;
}

:where([data-grain-root]) grain-message[data-role="system"] {
  border-color: rgba(199, 122, 18, 0.32);
  background: rgba(199, 122, 18, 0.12);
}

:where([data-grain-root]) grain-message[data-role="assistant"]::before,
:where([data-grain-root]) grain-message[data-role="user"]::before,
:where([data-grain-root]) grain-message[data-role="system"]::before {
  content: attr(data-role);
  display: inline-flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(22, 32, 51, 0.08);
  color: var(--grain-muted, #5d6b82);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

:where([data-grain-root]) grain-message[data-role="user"]::before {
  background: rgba(255, 255, 255, 0.18);
  color: rgba(248, 251, 255, 0.92);
}

:where([data-grain-root]) :is(grain-stream, grain-result, grain-warning, grain-progress, grain-input, grain-tool, grain-artifact, grain-approve, grain-error, grain-context, grain-table, grain-layout, grain-memory, grain-form, grain-chart) {
  position: relative;
  border-radius: var(--grain-radius, 18px);
}

:where([data-grain-root]) grain-stream {
  padding: 8px 0 2px;
  font-size: 1rem;
  line-height: 1.7;
}

:where([data-grain-root]) grain-stream::after {
  content: '';
  display: inline-block;
  width: 0.6ch;
  height: 1.1em;
  margin-left: 0.28rem;
  border-radius: 999px;
  background: currentColor;
  vertical-align: text-bottom;
  opacity: 0.75;
  animation: grain-cursor-blink 1s step-end infinite;
}

:where([data-grain-root]) grain-stream[cursor="false"]::after {
  display: none;
}

:where([data-grain-root]) grain-think {
  padding: 14px 16px;
  border: 1px dashed rgba(93, 107, 130, 0.35);
  background: rgba(93, 107, 130, 0.08);
  color: var(--grain-muted, #5d6b82);
  font-size: 0.92rem;
}

:where([data-grain-root]) grain-think[data-hidden="true"] {
  cursor: pointer;
}

:where([data-grain-root]) grain-think[data-hidden="true"]::before {
  content: 'Thought hidden. Click to reveal reasoning.';
  display: block;
  font-weight: 600;
}

:where([data-grain-root]) grain-think[data-hidden="true"]:not([data-visible="true"]) > * {
  display: none;
}

:where([data-grain-root]) grain-think[data-visible="true"]::before {
  content: 'Reasoning';
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
  color: var(--grain-text, #162033);
}

:where([data-grain-root]) :is(grain-tool, grain-artifact, grain-approve, grain-error, grain-input, grain-result, grain-progress, grain-warning, grain-context, grain-table, grain-layout, grain-memory, grain-form, grain-chart) {
  padding: 16px 18px;
  border: 1px solid var(--grain-border, #d8d0c4);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.28));
}

:where([data-grain-root]) :is(grain-tool, grain-artifact, grain-approve, grain-error, grain-input, grain-result, grain-progress, grain-warning, grain-context, grain-table, grain-layout, grain-memory, grain-form, grain-chart)::before {
  content: attr(data-title);
  display: block;
  margin-bottom: 12px;
  color: var(--grain-muted, #5d6b82);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

:where([data-grain-root]) grain-tool[data-status="running"] {
  border-color: rgba(199, 122, 18, 0.42);
  box-shadow: inset 0 0 0 1px rgba(199, 122, 18, 0.12);
}

:where([data-grain-root]) grain-tool[data-status="complete"] {
  border-color: rgba(13, 143, 99, 0.38);
  background:
    linear-gradient(180deg, rgba(13, 143, 99, 0.1), rgba(255, 255, 255, 0.3)),
    var(--grain-surface, #fffaf3);
}

:where([data-grain-root]) grain-tool[data-status="error"],
:where([data-grain-root]) grain-error {
  border-color: rgba(207, 70, 93, 0.4);
  background:
    linear-gradient(180deg, rgba(207, 70, 93, 0.12), rgba(255, 255, 255, 0.3)),
    var(--grain-surface, #fffaf3);
}

:where([data-grain-root]) grain-warning {
  border-color: rgba(199, 122, 18, 0.34);
  background:
    linear-gradient(180deg, rgba(199, 122, 18, 0.12), rgba(255, 255, 255, 0.26)),
    var(--grain-surface, #fffaf3);
}

:where([data-grain-root]) grain-result {
  border-color: rgba(13, 143, 99, 0.3);
  background:
    linear-gradient(180deg, rgba(13, 143, 99, 0.1), rgba(255, 255, 255, 0.26)),
    var(--grain-surface, #fffaf3);
}

:where([data-grain-root]) grain-progress {
  overflow: hidden;
}

:where([data-grain-root]) grain-progress::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--grain-primary, #2155ff), #42a7ea);
  transform-origin: left center;
  transform: scaleX(var(--grain-progress-scale, 0));
}

:where([data-grain-root]) grain-input {
  min-height: 72px;
}

:where([data-grain-root]) grain-input::after {
  content: attr(data-placeholder);
  position: absolute;
  right: 18px;
  top: 16px;
  color: rgba(93, 107, 130, 0.75);
  font-size: 0.8rem;
}

:where([data-grain-root]) :is(grain-approve, grain-error) :is(grain-action, grain-option),
:where([data-grain-root]) :is(grain-tool, grain-result) :is(grain-action, grain-option) {
  margin-top: 12px;
  margin-right: 10px;
}

:where([data-grain-root]) :is(grain-action, grain-option) {
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(93, 107, 130, 0.24);
  background: rgba(255, 255, 255, 0.84);
  color: var(--grain-text, #162033);
  font-size: 0.87rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform var(--grain-duration-fast, 150ms) ease,
    background var(--grain-duration-fast, 150ms) ease,
    border-color var(--grain-duration-fast, 150ms) ease;
}

:where([data-grain-root]) :is(grain-action, grain-option):hover {
  transform: translateY(-1px);
  border-color: rgba(33, 85, 255, 0.25);
}

:where([data-grain-root]) :is(grain-action, grain-option)[data-primary="true"] {
  border-color: transparent;
  background: linear-gradient(135deg, var(--grain-primary, #2155ff), #42a7ea);
  color: #f8fbff;
}

:where([data-grain-root]) grain-artifact {
  font-family: var(--grain-font-mono, "JetBrains Mono", monospace);
  white-space: pre-wrap;
  word-break: break-word;
}

:where([data-grain-root]) grain-context {
  display: inline-flex;
  align-items: center;
  width: auto;
  gap: 8px;
}

:where([data-grain-root]) grain-context::before {
  margin-bottom: 0;
}

:where([data-grain-root]) :is(grain-tool, grain-artifact, grain-approve, grain-error, grain-input, grain-result, grain-progress, grain-warning, grain-context, grain-table, grain-layout, grain-memory, grain-form, grain-chart) > :first-child {
  margin-top: 0;
}

:where([data-grain-root]) :is(grain-tool, grain-artifact, grain-approve, grain-error, grain-input, grain-result, grain-progress, grain-warning, grain-context, grain-table, grain-layout, grain-memory, grain-form, grain-chart) > :last-child {
  margin-bottom: 0;
}

@keyframes grain-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

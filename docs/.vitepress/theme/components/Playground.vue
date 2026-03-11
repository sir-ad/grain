<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { WebAdapter } from '@grain.sh/web'
import { DEFAULT_PLAYGROUND_CODE } from '../playground-sample'

const props = withDefaults(defineProps<{
  defaultCode?: string
}>(), {
  defaultCode: ''
})

function decodeEntities(value: string): string {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&')
}

const code = ref(props.defaultCode ? decodeEntities(props.defaultCode) : DEFAULT_PLAYGROUND_CODE)

const error = ref<string | null>(null)
const adapter = ref<WebAdapter | null>(null)
const hasRendered = ref(false)
const previewHost = ref<HTMLDivElement | null>(null)

const isClient = ref(false)
const editorId = 'grain-playground-editor'
const editorHelpId = 'grain-playground-editor-help'
const previewStatus = computed(() => {
  if (error.value) {
    return error.value
  }

  if (!isClient.value) {
    return 'Interactive preview initializes after hydration.'
  }

  if (hasRendered.value) {
    return 'Preview rendered with live Grain components.'
  }

  return 'Preview is waiting for valid Grain markup.'
})

onMounted(() => {
  isClient.value = true
  if (typeof window !== 'undefined') {
    adapter.value = new WebAdapter({
      theme: {
        '--grain-primary': 'var(--grain-ui-accent)',
        '--grain-secondary': 'var(--grain-ui-muted)',
        '--grain-background': 'var(--grain-ui-bg)',
        '--grain-surface': 'var(--grain-ui-panel)',
        '--grain-surface-strong': 'var(--grain-ui-panel-soft)',
        '--grain-border': 'var(--grain-ui-border-strong)',
        '--grain-text': 'var(--grain-ui-text)',
        '--grain-muted': 'var(--grain-ui-muted)',
        '--grain-error': 'var(--grain-ui-danger)',
        '--grain-success': 'var(--grain-ui-success)',
        '--grain-warning': 'var(--grain-ui-warning)',
        '--grain-shadow': 'var(--grain-ui-shadow)',
        '--grain-font-family': 'var(--grain-font-sans)',
        '--grain-font-mono': 'var(--grain-font-mono)'
      }
    })
    adapter.value.registerCustomElements()
    void nextTick(renderPreview)
  }
})

watch(code, () => {
  if (isClient.value && adapter.value) {
    renderPreview()
  }
})

watch(() => props.defaultCode, (value) => {
  code.value = value ? decodeEntities(value) : DEFAULT_PLAYGROUND_CODE
})

function renderPreview() {
  if (!adapter.value || !previewHost.value) return
  
  error.value = null
  
  try {
    previewHost.value.replaceChildren()
    hasRendered.value = false
    const result = adapter.value.render(code.value, { container: previewHost.value })
    
    if (result) {
      result.setAttribute('data-grain-preview-mounted', 'true')
      hasRendered.value = true
    } else {
      error.value = 'The current Grain document could not be rendered.'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to render'
    hasRendered.value = false
  }
}

const lines = computed(() => code.value.split('\n').length)
</script>

<template>
  <div class="playground">
    <div class="pane editor-pane">
      <div class="pane-header">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="pane-title">editor.g</span>
      </div>
      <div class="editor-wrapper">
        <div class="line-numbers" :style="{ '--lines': lines }">
          <span v-for="n in lines" :key="n">{{ n }}</span>
        </div>
        <label :for="editorId" class="sr-only">Grain document editor</label>
        <p :id="editorHelpId" class="sr-only">
          Edit the Grain document and inspect the rendered preview beside it.
        </p>
        <textarea
          :id="editorId"
          v-model="code"
          spellcheck="false"
          placeholder="Type Grain language here..."
          aria-label="Grain document editor"
          :aria-describedby="editorHelpId"
        ></textarea>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="pane preview-pane">
      <div class="pane-header">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="pane-title">preview</span>
      </div>
      <div
        class="preview-content"
        role="region"
        aria-label="Rendered Grain preview"
        aria-live="polite"
      >
        <p class="preview-status" :class="{ 'is-error': Boolean(error) }">{{ previewStatus }}</p>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-else-if="!isClient" class="placeholder">
          {{ previewStatus }}
          <span class="placeholder-note">
            Open the docs preview at <code>/grain/</code>; the site is mounted under the project base path.
          </span>
        </div>
        <div v-else class="rendered-frame">
          <div ref="previewHost" class="rendered"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: row;
  min-height: 32rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.04) 100%),
    var(--grain-ui-panel);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--grain-ui-border-strong);
  box-shadow: var(--grain-ui-shadow);
}

.pane {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.editor-pane {
  flex: 1.06 1 0;
}

.preview-pane {
  flex: 0.94 1 0;
}

.pane-header {
  height: 40px;
  background: var(--grain-ui-panel);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--grain-ui-border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.pane-title {
  font-family: var(--grain-font-mono);
  font-size: 0.75rem;
  color: var(--grain-ui-muted);
  margin-left: auto;
  margin-right: auto;
  padding-right: 48px;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  position: relative;
  min-height: 0;
  overflow: hidden;
}

.line-numbers {
  width: 48px;
  padding: 16px 0;
  text-align: right;
  font-family: var(--grain-font-mono);
  font-size: 0.8rem;
  color: var(--grain-ui-muted);
  opacity: 0.55;
  user-select: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1.6;
  overflow: hidden;
}

.line-numbers span {
  padding-right: 12px;
}

textarea {
  flex: 1;
  min-height: 22rem;
  background: transparent;
  color: var(--grain-ui-text);
  font-family: var(--grain-font-mono);
  font-size: 0.85rem;
  border: none;
  padding: 16px 16px 16px 0;
  resize: none;
  line-height: 1.6;
  outline: none;
  overflow: auto;
}

textarea::placeholder {
  color: var(--grain-ui-muted);
  opacity: 0.45;
}

.divider {
  width: 1px;
  height: auto;
  background: var(--grain-ui-border);
}

.preview-pane {
  background: var(--grain-ui-panel-soft);
}

.preview-content {
  flex: 1;
  min-height: 0;
  padding: 20px 24px 24px;
  overflow: auto;
}

.preview-status {
  margin: 0 0 14px;
  color: var(--grain-ui-muted);
  font-size: 0.85rem;
  letter-spacing: 0.01em;
}

.preview-status.is-error {
  color: var(--grain-ui-danger);
}

.rendered-frame {
  min-height: 22rem;
  border-radius: 18px;
  border: 1px solid var(--grain-ui-border);
  background: var(--grain-ui-panel);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24);
  overflow: hidden;
}

.rendered {
  min-height: 100%;
  padding: 20px;
}

.placeholder {
  color: var(--grain-ui-muted);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}

.placeholder-note {
  max-width: 24rem;
  line-height: 1.5;
}

.placeholder code {
  background: rgba(33, 85, 255, 0.1);
  border-radius: 6px;
  padding: 2px 6px;
}

.error {
  color: var(--grain-ui-danger);
  font-family: var(--grain-font-mono);
  font-size: 0.85rem;
  padding: 16px;
  background: rgba(207, 70, 93, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(207, 70, 93, 0.24);
}

@media (max-width: 1080px) {
  .playground {
    flex-direction: column;
    min-height: 0;
  }
  
  .divider {
    width: 100%;
    height: 1px;
  }
  
  .pane {
    min-height: 18rem;
  }

  .editor-pane {
    min-height: 24rem;
  }

  .preview-pane {
    min-height: 22rem;
  }

  .rendered-frame,
  textarea {
    min-height: 20rem;
  }
}

@media (max-width: 640px) {
  .playground {
    border-radius: 20px;
  }

  .pane-header {
    padding: 0 12px;
  }

  .pane-title {
    padding-right: 36px;
  }

  .line-numbers {
    width: 42px;
  }

  .line-numbers span {
    padding-right: 10px;
  }

  .preview-content,
  .rendered {
    padding: 16px;
  }

  .rendered-frame,
  textarea {
    min-height: 18rem;
  }
}
</style>

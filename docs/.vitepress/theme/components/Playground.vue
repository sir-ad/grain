<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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

const previewKey = ref(0)
const output = ref<HTMLElement | null>(null)
const error = ref<string | null>(null)
const adapter = ref<WebAdapter | null>(null)

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
  if (typeof window !== 'undefined') {
    adapter.value = new WebAdapter({
      theme: {
        '--grain-primary': '#ffffff',
        '--grain-secondary': '#a1a1a6',
        '--grain-background': 'transparent',
        '--grain-surface': 'rgba(255, 255, 255, 0.02)',
        '--grain-border': 'rgba(255, 255, 255, 0.08)',
        '--grain-font-family': "'Inter', sans-serif",
        '--grain-font-mono': "'JetBrains Mono', monospace"
      }
    })
    adapter.value.registerCustomElements()
    renderPreview()
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
  if (!adapter.value) return
  
  error.value = null
  
  try {
    const container = document.createElement('div')
    container.id = 'grain-preview-container'
    
    const result = adapter.value.render(code.value, { container })
    
    if (result) {
      output.value = result
      previewKey.value++
    } else {
      error.value = 'The current Grain document could not be rendered.'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to render'
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
        <textarea
          v-model="code"
          spellcheck="false"
          placeholder="Type Grain language here..."
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
      <div class="preview-content" :key="previewKey">
        <div v-if="error" class="error">{{ error }}</div>
        <div v-else-if="output" class="rendered" v-html="output.outerHTML"></div>
        <div v-else class="placeholder">Preview will appear here</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: row;
  height: 480px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.6);
}

.pane {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pane-header {
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #86868b;
  margin-left: auto;
  margin-right: auto;
  padding-right: 48px;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.line-numbers {
  width: 48px;
  padding: 16px 0;
  text-align: right;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.2);
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
  background: transparent;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  border: none;
  padding: 16px 16px 16px 0;
  resize: none;
  line-height: 1.6;
  outline: none;
  overflow: auto;
}

textarea::placeholder {
  color: rgba(255, 255, 255, 0.15);
}

.divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.preview-pane {
  background: rgba(10, 10, 10, 0.6);
}

.preview-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.rendered {
  font-family: 'Inter', sans-serif;
}

.placeholder {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.error {
  color: #ef4444;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

@media (max-width: 768px) {
  .playground {
    flex-direction: column;
    height: auto;
    min-height: 400px;
  }
  
  .divider {
    width: 100%;
    height: 1px;
  }
  
  .pane {
    min-height: 200px;
  }
}
</style>

<template>
  <div class="ai-message-content" v-html="compiledMarkdown"></div>
</template>
<script setup lang="ts">
import { Marked } from "marked";
import hljs from "highlight.js";
import { markedHighlight } from "marked-highlight";
import { computed } from "vue";

const props = defineProps({
  content: { type: String, required: true },
});

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

const compiledMarkdown = computed(() => {
  return marked.parse(props.content);
});
</script>

<style scoped>
.ai-message-content {
  line-height: 1.5;
  color: #333;
  padding: 6px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>

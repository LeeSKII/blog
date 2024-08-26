<template>
  <div v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import katex from "katex"; // KaTeX库
import "katex/dist/katex.min.css"; // KaTeX的CSS

const latexFormula = String.raw` [ \text{Var}(X) = \mathbb{E}[X^2]`;

// 使用 KaTeX 将 LaTeX 公式转换成 HTML
const renderedHtml = katex.renderToString(latexFormula, {
  throwOnError: false,
  displayMode: true,
});
</script>

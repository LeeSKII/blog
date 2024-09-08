<template>
  <article v-for="chart in chartCompletions" :key="chart.id">
    <div @click="setChartCompletion(chart.id)" class="chart-completion">
      <div class="chart-name">{{ chart.messages[1].content }}</div>
      <div>
        <button class="contrast" @click.stop="deleteChartCompletion(chart.id)">
          Delete
        </button>
      </div>
    </div>
  </article>
  <button class="contrast outline" @click="setChartCompletion()">
    New Chart
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChartCompletion, Message } from "./types.ts";

const emit = defineEmits<{
  (e: "set-completion", id: string | undefined): void;
}>();

function setChartCompletion(id?: string) {
  emit("set-completion", id);
}

const chartCompletions = ref<ChartCompletion[]>([]);

function deleteChartCompletion(id: string) {
  chartCompletions.value.splice(
    chartCompletions.value.findIndex((c) => c.id === id),
    1
  );
  window.localStorage.setItem(
    "history",
    JSON.stringify(chartCompletions.value)
  );
}

onMounted(() => {
  const historyStore = window.localStorage.getItem("history");
  if (historyStore) {
    chartCompletions.value = JSON.parse(
      historyStore || "[]"
    ) as ChartCompletion[];
  }
});
</script>

<style scoped>
.chart-name {
  max-width: 80ch;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 768px) {
  .chart-name {
    max-width: 20ch;
  }
}

.chart-completion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
</style>

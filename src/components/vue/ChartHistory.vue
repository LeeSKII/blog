<template>
  <article v-for="chart in chartCompletions" :key="chart.id">
    <div @click="setChartCompletion(chart.id)">
      {{ chart.messages[1].content }}
    </div>
  </article>
  <button @click="setChartCompletion()">New Chart</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

type ChartCompletion = {
  id: string;
  messages: Message[];
};
type Message = {
  role: string;
  content: string;
};

const props = defineProps<{ setCompletion: (id: string | null) => void }>();

function setChartCompletion(id?: string) {
  props.setCompletion(id || null);
}

const chartCompletions = ref<ChartCompletion[]>([]);

onMounted(() => {
  const historyStore = window.localStorage.getItem("history");
  if (historyStore) {
    chartCompletions.value = JSON.parse(
      historyStore || "[]"
    ) as ChartCompletion[];
  }
});
</script>

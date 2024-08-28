<template>
  <article v-for="chart in chartCompletions" :key="chart.id">
    <div @click="setChartCompletion(chart.id)" class="chart-completion">
      <div>{{ chart.messages[1].content }}</div>
      <div>
        <button @click.stop="deleteChartCompletion(chart.id)" class="contrast">
          Delete
        </button>
      </div>
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
.chart-completion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
</style>

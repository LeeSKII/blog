<template>
  count:{{ props.count }}
  <div v-if="error">{{ error }}</div>
  <ol v-else-if="data">
    <li v-for="item in data" :key="item.id">
      {{ item.name }}
    </li>
  </ol>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import useFetchJsonPlaceHolder from "./useFetchJsonPlaceHolder";
import { onUpdated } from "vue";
console.log("JsonPlaceHolder mounted");

const props = defineProps(['count']);

const { data, error } = useFetchJsonPlaceHolder();

onUpdated(() => {
  console.log("JsonPlaceHolder updated");
})
</script>

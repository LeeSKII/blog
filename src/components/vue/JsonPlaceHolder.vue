<template>
  <div v-if="isLoadings">Loading...</div>
  <ol v-else>
    <li v-for="item in data" :key="item.id">
      {{ item.name }}
    </li>
  </ol>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const data = ref([]);
const isLoadings = ref(false);

const fetchData = async () => {
  isLoadings.value = true;
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts/2/comments"
    );
    data.value = response.data;
  } catch (error) {
  } finally {
    isLoadings.value = false;
  }
};

fetchData();
</script>

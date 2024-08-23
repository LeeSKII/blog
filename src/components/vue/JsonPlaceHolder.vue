<template>
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
const { data, error } = useFetchJsonPlaceHolder();
</script>

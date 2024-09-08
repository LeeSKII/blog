<template>
  {{ count }}
  <button @click="count++">Click me</button>
  <JsonPlaceHolder :count="count" />
  <JsonPlaceHolder :count="count" />
  <JsonPlaceHolder :count="count" />
</template>

<script setup>
import JsonPlaceHolder from './JsonPlaceHolder.vue';
import { ref, onUpdated } from 'vue';

const count = ref(0);

onUpdated(() => {
  console.log('Index Vue Updated');
});

</script>
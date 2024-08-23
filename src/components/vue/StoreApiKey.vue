<template>
  <label>
    <input name="terms" type="checkbox" role="switch" v-model="isShowKey" />
    Show Key
  </label>
  <form v-if="isShowKey" role="group" @submit="saveKey">
    <input width="500" type="text" v-model="key" />
    <button type="submit">Save</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
const isShowKey = ref(false);
const key = ref<string | null>(null);
key.value = window.localStorage.getItem("key");

function saveKey(e: Event) {
  e.preventDefault();
  if (key.value) {
    window.localStorage.setItem("key", key.value);
  }
  isShowKey.value = false;
}
</script>

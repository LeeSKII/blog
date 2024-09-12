<template>
  <label class="flex items-center cursor-pointer">
    <div class="relative">
      <input type="checkbox" class="sr-only peer" v-model="isShowKey" />
      <div
        class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-zinc-300 dark:peer-focus:ring-zinc-600 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-zinc-800"
      ></div>
    </div>
    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
      >Show Key</span
    >
  </label>
  <form
    v-if="isShowKey"
    class="flex flex-row items-center justify-center gap-3 mt-2"
    @submit.prevent="saveKey"
  >
    <input
      class="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
      type="text"
      v-model="key"
    />
    <button
      class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
      type="submit"
    >
      Save
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
const isShowKey = ref(false);
const key = ref<string | null>(null);
key.value = window.localStorage.getItem("key");

function saveKey(e: Event) {
  if (key.value) {
    window.localStorage.setItem("key", key.value);
  }
  isShowKey.value = false;
}
</script>

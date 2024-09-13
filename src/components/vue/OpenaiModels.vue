<template>
  <select
    name="favorite-cuisine"
    aria-label="Select which model to use"
    required
    v-model="model"
    class="block w-full px-4 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-zinc-500 dark:focus:border-zinc-400 transition duration-150 ease-in-out appearance-none"
  >
    >
    <option selected disabled value="">Select which model to use</option>
    <option v-for="(model, index) in models" :key="`${model.id}-${index}`">
      {{ model.id }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import useModel from "@/hooks/vue/useModel";

type Model = {
  id: string;
  object: "model";
  created: number;
  owned_by: "openai";
};

const apiUrl = "https://api.gptapi.us/v1/models";
const localStorageModels = window.localStorage.getItem("models");
const initModels = localStorageModels
  ? (JSON.parse(localStorageModels) as Model[])
  : ([
      {
        id: "gpt-4o",
        object: "model",
        created: 1636531200,
        owned_by: "openai",
      },
    ] as Model[]);

const models = ref<Model[]>(initModels);

const model = useModel();

const getModels = async () => {
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("key")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const responseData = await response.json();
  return responseData.data as Model[];
};

const fetchModels = async () => {
  try {
    const modelsData = await getModels();
    models.value = modelsData;
  } catch {
    model.value = "gpt-4o";
    models.value = [
      {
        id: "gpt-4o",
        object: "model",
        created: 1636531200,
        owned_by: "openai",
      },
    ];
  }
};

fetchModels();

watch(model, (newVal, oldVal) => {
  window.localStorage.setItem("model", newVal);
});
watch(models, (newVal, oldVal) => {
  window.localStorage.setItem("models", JSON.stringify(newVal));
});
</script>

<template>
  <div class="openai-models">
    <div>OpenAI Models:</div>
    <select
      name="favorite-cuisine"
      aria-label="Select which model to use"
      required
      v-model="model"
    >
      <option selected disabled value="">Select which model to use</option>
      <option v-for="model in models" :key="model.id">
        {{ model.id }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

type Model = {
  id: string;
  object: "model";
  created: number;
  owned_by: "openai";
};

const apiUrl = "https://api.gptapi.us/v1/models";

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

const initialModel = window.localStorage.getItem("model") || "gpt-4o";

const models = ref<Model[] | null>(null);
const model = ref<string>(initialModel);

fetchModels();

watch(model, (newVal, oldVal) => {
  window.localStorage.setItem("model", newVal);
});
</script>

<style scoped>
.openai-models {
  display: flex;
  justify-content: center;
}
</style>

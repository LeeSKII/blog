import { ref } from "vue";

// 状态提升到全局
const model = ref("");

export default function useModel(defaultModel?: string) {
  if (model.value) {
    return model;
  }
  if (defaultModel) {
    model.value = defaultModel;
  } else {
    model.value = window.localStorage.getItem("model") || "gpt-4o";
  }

  return model;
}

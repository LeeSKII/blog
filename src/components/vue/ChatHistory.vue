<template>
  <article v-for="chat in chatCompletions" :key="chat.id">
    <div @click="setChatCompletion(chat.id)" class="chat-completion">
      <div class="chat-name">{{ chat.messages[1].content }}</div>
      <div>
        <button class="contrast" @click.stop="deleteChatCompletion(chat.id)">
          Delete
        </button>
      </div>
    </div>
  </article>
  <button class="contrast outline" @click="setChatCompletion()">
    New Chat
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChatCompletion, Message } from "./types.ts";

const emit = defineEmits<{
  (e: "set-completion", id: string | undefined): void;
}>();

function setChatCompletion(id?: string) {
  emit("set-completion", id);
}

const chatCompletions = ref<ChatCompletion[]>([]);

function deleteChatCompletion(id: string) {
  chatCompletions.value.splice(
    chatCompletions.value.findIndex((c) => c.id === id),
    1
  );
  window.localStorage.setItem(
    "history",
    JSON.stringify(chatCompletions.value)
  );
}

onMounted(() => {
  const historyStore = window.localStorage.getItem("history");
  if (historyStore) {
    chatCompletions.value = JSON.parse(
      historyStore || "[]"
    ) as ChatCompletion[];
  }
});
</script>

<style scoped>
.chat-name {
  max-width: 80ch;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 768px) {
  .chat-name {
    max-width: 20ch;
  }
}

.chat-completion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
</style>

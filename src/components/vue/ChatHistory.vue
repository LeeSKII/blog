<template>
  <div class="flex flex-col gap-1 justify-between">
    <article
      class="border border-zinc-300 rounded-md p-3"
      v-for="chat in chatCompletions"
      :key="chat.id"
    >
      <div @click="setChatCompletion(chat.id)" class="chat-completion">
        <div class="chat-name">{{ chat.messages[1].content }}</div>

        <button
          class="bg-zinc-900 text-white rounded-md p-1"
          @click.stop="deleteChatCompletion(chat.id)"
        >
          Delete
        </button>
      </div>
    </article>
  </div>

  <button
    class="bg-zinc-900 text-white rounded-md p-1 mt-3"
    @click="setChatCompletion()"
  >
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
  window.localStorage.setItem("history", JSON.stringify(chatCompletions.value));
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

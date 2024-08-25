<template>
  <div class="chart-container">
    <div v-for="message in messages" :key="message.content">
      <div v-if="message.role === 'user'">
        User
        <div class="user-message-content">
          <p>{{ message.content }}</p>
        </div>
      </div>
      <div v-if="message.role === 'assistant'">
        AI <MarkdownRender :content="message.content" />
      </div>
    </div>
  </div>
  <form class="chart-form" role="group" @submit="sendPrompt">
    <input type="text" v-model="prompt" />
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? "Loading..." : "Send" }}
    </button>
  </form>
</template>
<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import MarkdownRender from "./MarkdownRender.vue";
type Message = {
  role: string;
  content: string;
};
const key = ref<string | null>(null);
const prompt = ref<string>("");
const messages = ref<Message[]>([
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
]);
const isLoading = ref(false);

function sendPrompt(e: Event) {
  e.preventDefault();
  key.value = window.localStorage.getItem("key");
  if (!key.value) {
    return;
  }
  isLoading.value = true;
  messages.value.push({
    role: "user",
    content: prompt.value,
  });

  axios
    .post(
      "https://api.gptapi.us/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: messages.value,
      },
      {
        headers: {
          Authorization: `Bearer ${key.value}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      const responseMsg: Message = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };
      messages.value.push(responseMsg);
      prompt.value = "";
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error("Error sending prompt", error.message);
        messages.value.pop();
      } else {
        console.error(error);
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<style scoped>
.chart-container {
  margin: 10px;
}
.user-message-content {
  line-height: 1.5;
  color: #333;
  padding: 6px;
  background-color: #f2f2f2;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>

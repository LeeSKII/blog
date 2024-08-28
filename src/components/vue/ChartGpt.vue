<template>
  <details>
    <summary role="button" class="outline contrast">ChartHistory</summary>
    <ChartHistory :key="chartCompletion.id" :setCompletion="setCompletion" />
  </details>

  <div class="chart-container">
    <div v-for="message in chartCompletion.messages" :key="message.content">
      <article v-if="message.role === 'user'">
        <div class="user-message-header">
          <span class="user-avatar">User</span>
        </div>
        <div>
          <p>{{ message.content }}</p>
        </div>
      </article>
      <article v-if="message.role === 'assistant'">
        <div>
          <span class="assistant-avatar">AI</span>
        </div>
        <MarkdownRender :content="message.content" />
      </article>
    </div>
  </div>
  <form class="chart-form" role="group" @submit="sendPrompt">
    <input type="text" v-model="prompt" />
    <button type="submit" :aria-busy="isLoading" :disabled="isLoading">
      {{ isLoading ? "Loading..." : "Send" }}
    </button>
  </form>
</template>
<script setup lang="ts">
import axios from "axios";
import { ref, watch, onMounted } from "vue";
import { nanoid } from "nanoid";
import MarkdownRender from "./MarkdownRender.vue";
import ChartHistory from "./ChartHistory.vue";

const props = defineProps<{
  completionId?: string;
}>();

type ChartCompletion = {
  id: string;
  messages: Message[];
};
type Message = {
  role: string;
  content: string;
};

const key = ref<string | null>(null);
const prompt = ref<string>("");
const chartCompletion = ref<ChartCompletion>({
  id: nanoid(),
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ],
});

const isLoading = ref(false);

const historyC = window.localStorage.getItem("history");
if (historyC) {
  const history = JSON.parse(historyC) as ChartCompletion[];
  if (history.findIndex((c) => c.id === props.completionId) !== -1) {
    chartCompletion.value = history.find(
      (c) => c.id === props.completionId
    ) as ChartCompletion;
  }
}

function setCompletion(completionId: string | null) {
  if (!completionId) {
    chartCompletion.value = {
      id: nanoid(),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
      ],
    };
  }
  const history = window.localStorage.getItem("history");
  if (history) {
    const parsedHistory = JSON.parse(history) as ChartCompletion[];
    if (parsedHistory) {
      const completion = parsedHistory.find(
        (c) => c.id === completionId
      ) as ChartCompletion;
      if (completion) {
        chartCompletion.value = completion;
      }
    }
  }
}

function sendPrompt(e: Event) {
  e.preventDefault();
  key.value = window.localStorage.getItem("key");
  if (!key.value) {
    return;
  }
  isLoading.value = true;
  chartCompletion.value.messages.push({
    role: "user",
    content: prompt.value,
  });

  axios
    .post(
      "https://api.gptapi.us/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: chartCompletion.value.messages,
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
      chartCompletion.value.messages.push(responseMsg);
      prompt.value = "";
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error("Error sending prompt", error.message);
        //chartCompletion.value.messages.pop();
      } else {
        console.error(error);
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
}

watch(
  chartCompletion,
  (completion) => {
    window.localStorage.setItem(
      "messages",
      JSON.stringify(chartCompletion.value.messages)
    );

    if (completion.messages.length <= 1) {
      return;
    }

    // Store the completion in local storage

    const history = window.localStorage.getItem("history");
    if (history) {
      const parsedHistory = JSON.parse(history) as ChartCompletion[];
      if (parsedHistory) {
        if (parsedHistory.findIndex((c) => c.id === completion.id) === -1) {
          parsedHistory.push(completion);
          window.localStorage.setItem("history", JSON.stringify(parsedHistory));
        } else {
          const index = parsedHistory.findIndex((c) => c.id === completion.id);
          parsedHistory.splice(index, 1, completion);
          window.localStorage.setItem("history", JSON.stringify(parsedHistory));
        }
      }
    } else {
      if (completion.messages.length > 1)
        window.localStorage.setItem("history", JSON.stringify([completion]));
    }
  },
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  margin-top: 10px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #333;
  color: #fff;
  margin: 10px;
}
.assistant-avatar {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #333;
  color: #fff;
  margin: 10px;
}
.user-message-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.dark .assistant-avatar {
  background-color: #ccc;
  color: black;
}
.dark .user-avatar {
  background-color: #ccc;
  color: black;
}
</style>

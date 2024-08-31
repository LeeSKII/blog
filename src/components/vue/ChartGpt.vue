<template>
  <div class="chart-header">
    <details ref="chartHistoryPanel" class="chart-history-panel">
      <summary role="button" class="outline contrast">ChartHistory</summary>
      <ChartHistory :key="chartCompletion.id" @setCompletion="setCompletion" />
    </details>
    <ChartSetting />
  </div>

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
        <div class="assistant-message-header">
          <span class="assistant-avatar">AI</span>
          <span class="assistant-model">{{ message.model }}</span>
        </div>
        <MarkdownRender :content="message.content" />
      </article>
    </div>
  </div>
  <form class="chart-form" @submit.prevent="sendPrompt">
    <data role="group" class="form-group">
      <input type="text" required v-model="prompt" />
      <button
        class="contrast"
        type="submit"
        :aria-busy="isLoading"
        :disabled="isLoading"
      >
        {{ isLoading ? "" : "Send" }}
      </button>
    </data>
  </form>
</template>
<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import { nanoid } from "nanoid";
import MarkdownRender from "./MarkdownRender.vue";
import ChartHistory from "./ChartHistory.vue";
import ChartSetting from "./ChartSetting.vue";
import type { ChartCompletion, Message } from "./types.ts";

const props = defineProps<{
  completionId?: string;
}>();

const model = window.localStorage.getItem("model") || "gpt-4o";

const key = ref<string | null>(null);
const prompt = ref<string>("");
const chartHistoryPanel = ref<HTMLDetailsElement>();
const chartCompletion = ref<ChartCompletion>({
  id: nanoid(),
  messages: [
    {
      role: "system",
      model,
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

function setCompletion(completionId: string | undefined) {
  if (!completionId) {
    chartCompletion.value = {
      id: nanoid(),
      messages: [
        {
          role: "system",
          model,
          content: "You are a helpful assistant.",
        },
      ],
    };
    chartHistoryPanel.value?.removeAttribute("open");
    return;
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

async function sendPrompt() {
  key.value = window.localStorage.getItem("key");
  if (!key.value) {
    return;
  }
  isLoading.value = true;
  chartCompletion.value.messages.push({
    role: "user",
    model,
    content: prompt.value,
  });

  axios
    .post(
      "https://api.gptapi.us/v1/chat/completions",
      {
        model,
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
        model: response.data.model,
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

  // TODO:Fetch API
  //   fetch("https://api.gptapi.us/v1/chat/completions", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${key.value}`,
  //       "Content-Type": "application/json",
  //       responseType: "stream",
  //     },
  //     body: JSON.stringify({
  //       model: "gpt-4o",
  //       messages: chartCompletion.value.messages,
  //       stream: true,
  //     }),
  //   }).then(async (response) => {
  //     const reader = response.body!.getReader();
  //     const textDecoder = new TextDecoder();
  //     let result = true;
  //     const responseMsg: Message = {
  //       role: "assistant",
  //       content: "",
  //     };
  //     chartCompletion.value.messages.push(responseMsg);

  //     while (result) {
  //       const { done, value } = await reader.read();

  //       if (done) {
  //         console.log("Stream ended");
  //         result = false;
  //         break;
  //       }

  //       const chunkText = textDecoder.decode(value);
  //       // console.log("chunkText", chunkText);
  //       chunkText.split("data: ").forEach((line) => {
  //         if (line.trim() === "[DONE]") {
  //           result = false;
  //         } else if (line) {
  //           console.log(line);
  //           const chunkResult = JSON.parse(line);
  //           // console.log("content:", chunkResult.choices[0].delta.content);
  //           const chunkContent = chunkResult.choices[0].delta.content;
  //           if (chunkContent) {
  //             responseMsg.content += chunkContent;
  //           }
  //         }
  //       });

  //       // console.log("content:", chunkResult.choices[0].delta.content);
  //     }
  //     prompt.value = "";
  //     isLoading.value = false;
  //   });
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
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.chart-container {
  margin-top: 10px;
  margin-bottom: 100px;
  overflow-y: auto;
}

.chart-history-panel {
  flex: 1;
  margin-top: 10px;
}

.chart-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-group {
  width: 80%;
}
@media screen and (max-width: 768px) {
  .form-group {
    width: 90%;
  }
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
.assistant-message-header {
  display: flex;
  align-items: center;
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
.assistant-model {
  font-size: 14px;
  font-weight: 300;
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

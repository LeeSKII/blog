<template>
  <div class="chat-header">
    <details
      ref="chatHistoryPanel"
      class="border border-gray-300 rounded-md w-full p-3"
    >
      <summary class="cursor-pointer md:mb-3">ChatHistory</summary>
      <ChatHistory :key="chatCompletion.id" @setCompletion="setCompletion" />
    </details>
    <ChatSetting />
  </div>

  <div class="chat-container">
    <div v-for="message in chatCompletion.messages" :key="message.content">
      <article
        class="border border-gray-300 rounded-md p-2 my-2"
        v-if="message.role === 'user'"
      >
        <div class="user-message-header">
          <span class="user-avatar">User</span>
        </div>
        <div>
          <p>{{ message.content }}</p>
        </div>
      </article>
      <article
        class="prose dark:prose-invert border border-gray-300 rounded-md p-2 my-2 max-w-none"
        v-if="message.role === 'assistant'"
      >
        <div class="assistant-message-header">
          <span class="assistant-avatar">AI</span>
          <span class="assistant-model">{{ message.model }}</span>
        </div>
        <MarkdownRender :content="message.content" />
      </article>
    </div>
  </div>
  <form class="chat-form" @submit.prevent="sendPrompt">
    <input
      class="w-full max-w-7xl p-2 border-2 border-gray-300 rounded-md dark:bg-zinc-900 dark:text-white"
      type="text"
      required
      :disabled="isLoading"
      v-model="prompt"
    />
    <button
      class="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-md dark:bg-zinc-700"
      type="submit"
      :disabled="isLoading"
    >
      {{ isLoading ? "Loading..." : "Send" }}
    </button>
  </form>
</template>
<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import { nanoid } from "nanoid";
import MarkdownRender from "./MarkdownRender.vue";
import ChatHistory from "./ChatHistory.vue";
import ChatSetting from "./ChatSetting.vue";
import type { ChatCompletion, Message } from "./types.ts";
import useModel from "@/hooks/vue/useModel.ts";

const props = defineProps<{
  completionId?: string;
}>();

const model = useModel();

const key = ref<string | null>(null);
const prompt = ref<string>("");
const chatHistoryPanel = ref<HTMLDetailsElement>();
const chatCompletion = ref<ChatCompletion>({
  id: nanoid(),
  messages: [
    {
      role: "system",
      model: model.value,
      content: "You are a helpful assistant.",
    },
  ],
});

const isLoading = ref(false);

const historyC = window.localStorage.getItem("history");
if (historyC) {
  const history = JSON.parse(historyC) as ChatCompletion[];
  if (history.findIndex((c) => c.id === props.completionId) !== -1) {
    chatCompletion.value = history.find(
      (c) => c.id === props.completionId
    ) as ChatCompletion;
  }
}

function setCompletion(completionId: string | undefined) {
  if (!completionId) {
    chatCompletion.value = {
      id: nanoid(),
      messages: [
        {
          role: "system",
          model: model.value,
          content: "You are a helpful assistant.",
        },
      ],
    };
    chatHistoryPanel.value?.removeAttribute("open");
    return;
  }
  const history = window.localStorage.getItem("history");
  if (history) {
    const parsedHistory = JSON.parse(history) as ChatCompletion[];
    if (parsedHistory) {
      const completion = parsedHistory.find(
        (c) => c.id === completionId
      ) as ChatCompletion;
      if (completion) {
        chatCompletion.value = completion;
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
  chatCompletion.value.messages.push({
    role: "user",
    model: model.value,
    content: prompt.value,
  });

  axios
    .post(
      "https://api.gptapi.us/v1/chat/completions",
      {
        model: model.value,
        messages: chatCompletion.value.messages.map((message) => {
          return { role: message.role, content: message.content };
        }),
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
      chatCompletion.value.messages.push(responseMsg);
      prompt.value = "";
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error("Error sending prompt", error.message);
        chatCompletion.value.messages.pop();
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
  //       messages: chatCompletion.value.messages,
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
  //     chatCompletion.value.messages.push(responseMsg);

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
  chatCompletion,
  (completion) => {
    window.localStorage.setItem(
      "messages",
      JSON.stringify(chatCompletion.value.messages)
    );

    if (completion.messages.length <= 1) {
      return;
    }

    // Store the completion in local storage

    const history = window.localStorage.getItem("history");
    if (history) {
      const parsedHistory = JSON.parse(history) as ChatCompletion[];
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
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.chat-container {
  margin-top: 10px;
  margin-bottom: 50px;
  overflow-y: auto;
}

.chat-form {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 5px;
  align-items: center;
}

.form-group {
  width: 80%;
}

@media screen and (max-width: 768px) {
  .form-group {
    width: 90%;
  }
  .chat-form {
    gap: 0;
    padding: 0 5px;
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

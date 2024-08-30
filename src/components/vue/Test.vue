<template>
  <TabsComponent :tabs="tabs">
    <template v-slot="{ tab, isActive }">
      <div v-show="isActive">
        <div v-if="tab.type === 'text'">
          <h3>{{ tab.title }}</h3>
          <p>{{ tab.content }}</p>
        </div>
        <div v-else-if="tab.type === 'list'">
          <h3>{{ tab.title }}</h3>
          <ul>
            <li v-for="item in tab.items" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div v-else-if="tab.type === 'image'">
          <h3>{{ tab.title }}</h3>
          <img :src="tab.imageUrl" :alt="tab.title" />
        </div>
      </div>
    </template>
  </TabsComponent>
</template>

<script setup>
import { ref } from "vue";
import TabsComponent from "./TabsComponent.vue";

const tabs = ref([
  { title: "文本标签", type: "text", content: "这是一些文本内容。" },
  { title: "列表标签", type: "list", items: ["项目1", "项目2", "项目3"] },
  {
    title: "图片标签",
    type: "image",
    imageUrl: "https://example.com/image.jpg",
  },
]);
</script>

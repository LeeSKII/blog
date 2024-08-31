<template>
  <div class="tabs">
    <div class="tab-list" ref="tabList">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-button', { 'is-active': activeTab === index }]"
        @click="setActiveTab(index)"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="tab-content" ref="tabContent">
      <Transition
        name="fade"
        mode="out-in"
        @before-leave="beforeLeave"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
      >
        <div :key="activeTab" class="tab-pane">
          <slot
            :tab="tabs[activeTab]"
            :index="activeTab"
            :isActive="true"
          ></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((tab) => typeof tab.title === "string");
    },
  },
});

const activeTab = ref(0);
const tabContent = ref(null);
let prevHeight = 0;

const setActiveTab = (index) => {
  activeTab.value = index;
};

const beforeLeave = (el) => {
  prevHeight = el.offsetHeight;
  el.style.height = `${prevHeight}px`;
};

const enter = (el) => {
  el.style.height = "auto";
  const endHeight = el.offsetHeight;
  el.style.height = `${prevHeight}px`;
  el.offsetHeight; // force reflow
  el.style.height = `${endHeight}px`;
};

const afterEnter = (el) => {
  el.style.height = "auto";
};

const leave = (el) => {
  el.style.height = `${prevHeight}px`;
};
</script>

<style scoped>
.tabs {
  font-family: "Roboto", Arial, sans-serif;
  background-color: #ffffff;
}

.tab-list {
  display: flex;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.tab-button {
  flex: 1 1 auto;
  padding: 12px 20px;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  min-width: 100px;
  margin: 4px;
  border-radius: 6px;
  box-shadow:
    2px 2px 5px rgba(0, 0, 0, 0.05),
    -2px -2px 5px rgba(255, 255, 255, 0.8);
}

.tab-button:hover {
  background-color: #ebebeb;
}

.tab-button.is-active {
  color: #222;
  background-color: #ffffff;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.1),
    -4px -4px 8px rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

.tab-content {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  margin-top: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tab-pane {
  padding: 20px;
  transition:
    height 0.3s ease,
    opacity 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    height 0.3s ease;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Dark mode styles */
.dark .tabs {
  background-color: #1a1a1a;
}

.dark .tab-list {
  background-color: #1a1a1a;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.dark .tab-button {
  background-color: #2a2a2a;
  color: #bbb;
  box-shadow:
    2px 2px 5px rgba(0, 0, 0, 0.2),
    -2px -2px 5px rgba(255, 255, 255, 0.1);
}

.dark .tab-button:hover {
  background-color: #3a3a3a;
}

.dark .tab-button.is-active {
  color: #fff;
  background-color: #1a1a1a;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.2),
    -4px -4px 8px rgba(255, 255, 255, 0.1);
}

.dark .tab-content {
  background-color: #1a1a1a;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>

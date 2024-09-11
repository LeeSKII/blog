<template>
  <svg
    t="1725100333952"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="1501"
    width="24"
    height="24"
    @click="openModal"
  >
    <path
      d="M619.562667 963.669333a42.666667 42.666667 0 0 1-40.661334-29.653333 85.333333 85.333333 0 0 0-162.56 0 42.666667 42.666667 0 0 1-52.821333 27.904 470.058667 470.058667 0 0 1-204.117333-124.458667 42.666667 42.666667 0 0 1-1.834667-57.088 85.333333 85.333333 0 0 0 20.053333-54.997333 86.869333 86.869333 0 0 0-93.866666-84.906667 42.666667 42.666667 0 0 1-45.824-34.133333 471.850667 471.850667 0 0 1 11.946666-235.306667 42.666667 42.666667 0 0 1 40.704-29.866666 85.802667 85.802667 0 0 0 87.082667-85.333334 84.48 84.48 0 0 0-8.746667-37.674666 42.666667 42.666667 0 0 1 9.216-50.090667A470.528 470.528 0 0 1 372.138667 59.733333a42.666667 42.666667 0 0 1 49.408 21.717334 85.333333 85.333333 0 0 0 152.149333 0A42.666667 42.666667 0 0 1 622.933333 59.733333a470.528 470.528 0 0 1 194.048 108.586667 42.666667 42.666667 0 0 1 9.216 50.090667 84.48 84.48 0 0 0-8.746666 37.674666 85.333333 85.333333 0 0 0 85.333333 85.333334 44.928 44.928 0 0 1 42.666667 29.866666 471.68 471.68 0 0 1 11.946666 235.264 42.922667 42.922667 0 0 1-45.824 34.133334 86.784 86.784 0 0 0-93.866666 84.906666 85.333333 85.333333 0 0 0 20.053333 54.997334 42.666667 42.666667 0 0 1-1.834667 57.088 469.802667 469.802667 0 0 1-204.117333 124.458666 41.557333 41.557333 0 0 1-12.245333 1.536zM497.621333 789.333333a170.154667 170.154667 0 0 1 143.957334 78.805334 386.133333 386.133333 0 0 0 108.544-66.816A170.666667 170.666667 0 0 1 878.933333 556.373333a394.325333 394.325333 0 0 0 2.517334-44.373333 384.469333 384.469333 0 0 0-10.24-88.490667 170.666667 170.666667 0 0 1-133.504-211.072 386.816 386.816 0 0 0-108.501334-61.226666 170.666667 170.666667 0 0 1-263.509333 0 386.816 386.816 0 0 0-108.501333 61.226666 170.965333 170.965333 0 0 1-133.589334 211.328 387.541333 387.541333 0 0 0-7.594666 132.608 170.666667 170.666667 0 0 1 128.938666 244.949334 385.749333 385.749333 0 0 0 108.586667 66.816 170.026667 170.026667 0 0 1 144.085333-78.805334z"
      fill="#333333"
      p-id="1502"
    ></path>
    <path
      d="M497.621333 704a192 192 0 1 1 192-192 192 192 0 0 1-192 192z m0-298.666667a106.666667 106.666667 0 1 0 106.666667 106.666667 106.666667 106.666667 0 0 0-106.666667-106.666667z"
      fill="#333333"
      p-id="1503"
    ></path>
  </svg>
  <Modal
    :is-open="isModalOpen"
    @close="closeModal"
    :is-show-actions="isShowActions"
  >
    <div>
      <h4>Chat Setting</h4>
      <StoreApiKey />
      <OpenaiModels />
      <div class="form-grid">
        <ToolTip
          content="Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim."
        >
          <div>Frequency Penalty:</div>
        </ToolTip>

        <input
          type="number"
          name="frequency_penalty"
          placeholder="0"
          aria-label="Number"
        />
        <ToolTip
          content="How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs."
        >
          <div>n:</div>
        </ToolTip>

        <input type="number" name="n" placeholder="1" aria-label="Number" />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "./Modal.vue";
import OpenaiModels from "./OpenaiModels.vue";
import ToolTip from "./ToolTip.vue";
import StoreApiKey from "./StoreApiKey.vue";

import { ref } from "vue";

const isModalOpen = ref(false);
const isShowActions = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
.icon {
  display: inline-block;
  cursor: pointer;
}
.dark .icon path {
  fill: #fff;
}
input {
  margin-bottom: 0;
}
.form-grid {
  display: grid;
  grid-template-columns: auto 1fr; /* 改变这里 */
  gap: 1rem;
  align-items: center; /* 垂直居中对齐 */
  margin-top: 10px;
}
.form-grid > div {
  max-width: 100px; /* 设置标签的最大宽度，可以根据需要调整 */
  /* white-space: nowrap; /* 防止标签文本换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.form-grid > input {
  width: 100%; /* 输入框占满剩余空间 */
}
</style>

<template>
  <teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <slot></slot>
        <div class="modal-actions">
          <button @click="closeModal">确认</button>
          <button class="contrast" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const emits = defineEmits(["close"]);
const { isOpen } = defineProps<{
  isOpen: boolean;
}>();

const closeModal = () => {
  emits("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 80vw;
  max-height: 80vh;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.dark .modal-content {
  background-color: #222;
  color: white;
}
</style>

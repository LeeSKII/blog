<template>
  <div
    class="tooltip-trigger"
    ref="triggerRef"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
    tabindex="0"
  >
    <slot></slot>
  </div>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="isVisible"
        class="tooltip"
        ref="tooltipRef"
        :style="tooltipStyle"
      >
        {{ content }}
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { debounce } from "lodash"; // 或者实现一个简单的debounce函数

export default {
  name: "Tooltip",
  props: {
    content: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      default: "top",
      validator: (value) => ["top", "bottom", "left", "right"].includes(value),
    },
  },
  setup(props) {
    const isVisible = ref(false);
    const triggerRef = ref(null);
    const tooltipRef = ref(null);
    const tooltipStyle = ref({});

    const showTooltip = () => {
      isVisible.value = true;
      nextTick(updatePosition);
    };

    const hideTooltip = () => {
      isVisible.value = false;
    };

    const updatePosition = () => {
      if (!triggerRef.value || !tooltipRef.value) return;

      const triggerRect = triggerRef.value.getBoundingClientRect();
      const tooltipRect = tooltipRef.value.getBoundingClientRect();

      let top, left;

      switch (props.position) {
        case "bottom":
          top = triggerRect.bottom;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "left":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width;
          break;
        case "right":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right;
          break;
        default: // "top"
          top = triggerRect.top - tooltipRect.height;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      }

      tooltipStyle.value = {
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
      };
    };

    const handleScroll = debounce(() => {
      if (isVisible.value) {
        updatePosition();
      }
    }, 100);

    onMounted(() => {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", handleScroll, true);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", handleScroll, true);
    });

    return {
      isVisible,
      triggerRef,
      tooltipRef,
      tooltipStyle,
      showTooltip,
      hideTooltip,
    };
  },
};
</script>

<style scoped>
.tooltip-trigger {
  display: inline-block;
}

.tooltip {
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 9999;
  max-width: 200px; /* max width of the tooltip */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

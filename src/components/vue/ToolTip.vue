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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { debounce } from "lodash";

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

    const measureContent = () => {
      const tempElement = document.createElement("div");
      tempElement.style.visibility = "hidden";
      tempElement.style.position = "absolute";
      tempElement.style.padding = "5px 10px";
      tempElement.style.maxWidth = "200px";
      tempElement.style.whiteSpace = "normal";
      tempElement.style.wordWrap = "break-word";
      tempElement.style.fontSize = "14px";
      tempElement.innerHTML = props.content;
      document.body.appendChild(tempElement);

      const contentWidth = tempElement.offsetWidth;
      const contentHeight = tempElement.offsetHeight;

      document.body.removeChild(tempElement);

      return {
        width: contentWidth,
        height: contentHeight,
      };
    };

    const calculatePosition = (triggerRect, contentSize) => {
      let top, left;

      switch (props.position) {
        case "bottom":
          top = triggerRect.bottom + window.scrollY;
          left =
            triggerRect.left +
            (triggerRect.width - contentSize.width) / 2 +
            window.scrollX;
          break;
        case "left":
          top =
            triggerRect.top +
            (triggerRect.height - contentSize.height) / 2 +
            window.scrollY;
          left = triggerRect.left - contentSize.width + window.scrollX;
          break;
        case "right":
          top =
            triggerRect.top +
            (triggerRect.height - contentSize.height) / 2 +
            window.scrollY;
          left = triggerRect.right + window.scrollX;
          break;
        default: // "top"
          top = triggerRect.top - contentSize.height + window.scrollY;
          left =
            triggerRect.left +
            (triggerRect.width - contentSize.width) / 2 +
            window.scrollX;
      }

      return { top, left };
    };

    const updatePosition = () => {
      if (!triggerRef.value) return;

      const triggerRect = triggerRef.value.getBoundingClientRect();
      const contentSize = measureContent();
      const position = calculatePosition(triggerRect, contentSize);

      tooltipStyle.value = {
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${contentSize.width}px`,
        maxWidth: "200px",
      };
    };

    const showTooltip = () => {
      updatePosition();
      isVisible.value = true;
    };

    const hideTooltip = () => {
      isVisible.value = false;
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
  max-width: 200px;
  word-wrap: break-word;
  white-space: normal;
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

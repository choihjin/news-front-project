<script setup>
import { computed, useAttrs, defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  type: { type: String, default: "button" },
  size: { type: String, default: "md" },
  isActive: { type: Boolean, default: false },
  to: { type: String, default: null },
  class: { type: [String, Array, Object], default: "" },
});
const type = computed(() => props.type || "button");
const size = computed(() => props.size || "md");
const isActive = computed(() => props.isActive || false);

const router = useRouter();

const buttonSizeClass = computed(() => size.value);
const buttonTypeClass = computed(() => type.value);

const attrs = useAttrs();

function handleClick() {
  if (props.to) {
    router.push(props.to);
  }
}
</script>

<template>
  <button
    :class="[
      'toggle-button',
      buttonSizeClass,
      buttonTypeClass,
      { active: isActive },
      props.class,  
    ]"
    v-bind="attrs"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.toggle-button {
  white-space: nowrap;
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  color: var(--c-text);
  text-align: center;
  cursor: pointer;

  &.tag {
    background: #e8eef3 !important;
    color: #2271b1 !important;
    border: 1.2px solid #c2c9d6 !important;
    font-weight: 600;
    font-size: 15px !important;
    border-radius: 999px !important;
    padding: 6px 16px !important;
    margin: 0 2px 2px 0;
    box-shadow: 0 1px 2px rgba(0,60,120,0.04);
    cursor: default;
  }

  &.active {
    background-color: #000;
    color: #fff;

    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }

  &:hover {
    background-color: rgba(236, 236, 236, 0.5);
  }

  &.sm {
    padding: 4px 10px;
    font-size: 12px;
  }

  &.md {
    padding: 8px 12px;
    font-size: 14px;
  }

  &:disabled {
    pointer-events: none;
  }
}
</style>

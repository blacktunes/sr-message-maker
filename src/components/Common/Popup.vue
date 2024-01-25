<template>
  <Transition name="fade">
    <template v-if="props.show">
      <div
        v-show="props.index !== -1"
        :style="{ zIndex: 10 + index }"
      >
        <slot></slot>
      </div>
    </template>
    <template v-else>
      <div
        v-if="props.index !== -1"
        :style="{ zIndex: 10 + index }"
      >
        <slot></slot>
      </div>
    </template>
  </Transition>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    index: number
    baseIndex?: number
    show?: boolean
  }>(),
  {
    baseIndex: 10
  }
)
</script>

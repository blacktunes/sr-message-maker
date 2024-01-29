<template>
  <div class="slider">
    <div
      class="track"
      @touchstart.stop.prevent="onTouchstart"
      @mousedown.stop.prevent="onMousedown"
      ref="track"
    >
      <div
        class="bar"
        :style="{ width: `${percentage * 100}%` }"
      ></div>
      <div
        class="thumb"
        :style="{ left: `${percentage * 100}%` }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
  }>(),
  {
    min: 0,
    max: 100,
    step: 1
  }
)

const data = defineModel<number>({ default: 0 })

const percentage = ref(((Math.min(Math.max(data.value, props.min), props.max)) - props.min) / (props.max - props.min))
const track = ref<HTMLElement | null>(null)

const onTouchstart = (e: TouchEvent) => {
  if (e.touches.length > 1) return

  document.addEventListener('touchmove', onMove)
  document.addEventListener(
    'touchend',
    () => {
      document.removeEventListener('touchmove', onMove)
    },
    { once: true }
  )
  updatePercentage(e.touches[0].clientX)
}

const onMousedown = (e: MouseEvent) => {
  document.addEventListener('mousemove', onMove)
  document.addEventListener(
    'mouseup',
    () => {
      document.removeEventListener('mousemove', onMove)
    },
    { once: true }
  )
  updatePercentage(e.clientX)
}

const onMove = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    updatePercentage(e.clientX)
  }
  if (e instanceof TouchEvent) {
    if (e.touches.length > 1) return

    updatePercentage(e.touches[0].clientX)
  }
}

const updatePercentage = (mouseX: number) => {
  if (track.value) {
    const rect = track.value.getBoundingClientRect()
    let value = 0

    value = Math.min(Math.max((mouseX - rect.x) / rect.width, 0), 1)

    percentage.value = Math.floor(value * 100) / 100
    data.value = parseFloat(
      (
        Math.round((percentage.value * (props.max - props.min) + props.min) / props.step) *
        props.step
      ).toPrecision(12)
    )
  }
}
</script>

<style lang="stylus" scoped>
$bar-height = 12px

.slider
  display flex
  align-items center
  justify-content center
  -webkit-user-drag none
  user-drag none

  .track
    flex 1
    box-sizing border-box
    position relative
    height $bar-height
    background-color #bcc0c3
    cursor pointer

    .bar
      position absolute
      top 0
      left 0
      width 0
      height 100%
      background-color #f19839
      pointer-events none

    .thumb
      box-sizing border-box
      position absolute
      top 0
      left 0
      width 45px
      height 45px
      background #fff
      border $bar-height * 0.7 solid #f19839
      border-radius 50%
      transform 'translate(-50%, calc(-50% + %s / 2))' % $bar-height
      cursor pointer
</style>

<template>
  <div class="preview">
    <div class="circle">
      <div class="circle-1"></div>
      <div class="circle-2"></div>
      <div class="circle-3"></div>
      <div class="circle-4"></div>
      <div class="circle-5"></div>
      <div class="circle-6"></div>
      <div class="point-1"></div>
      <div class="point-2"></div>
      <div class="point-3"></div>
      <div class="line"></div>
      <img
        @click.stop="onClick ? emit('click') : undefined"
        :style="{ cursor: onClick ? 'pointer' : undefined }"
        :class="{ img_circle: circle }"
        :title="title"
        :src="img"
        alt=""
      />
      <div class="name">{{ name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    img: string
    name: string
    width?: string
    circle?: boolean
    color?: string
    bgColor?: string
    fontSize?: string
    onClick?: () => void
    title?: string
  }>(),
  {
    width: '300px',
    color: '#6a6a6a',
    bgColor: 'linear-gradient(#d5d5d5 10%, #b8b8b8)',
    fontSize: '35px'
  }
)

const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<style lang="stylus" scoped>
$border-color = #b9babf

.preview
  display flex
  flex-direction column
  align-items center
  justify-content center
  width v-bind(width)
  height 100%
  padding 0 60px 0 150px
  user-select none

  .circle
    // 倒影
    // -webkit-box-reflect below 5px linear-gradient(transparent, rgba(0, 0, 0, 0.1))
    position relative
    display flex
    justify-content center
    align-items center
    width v-bind(width)
    height v-bind(width)
    background v-bind(bgColor)
    border-radius 50%

    img
      width 80%

    .circle-1, .circle-2, .circle-3
      position absolute
      left 50%
      bottom -5px
      transform translate(-50%)
      border-radius 50%

    .circle-1
      width 117%
      height 117%
      border 3px solid $border-color

    .circle-2
      width 109%
      height 109%
      border 2px dotted $border-color

    .circle-3
      width 165%
      height 165%
      border 2px solid $border-color
      opacity 0.5

    .circle-4, .circle-5, .circle-6
      position absolute
      left 50%
      top -50%
      transform translate(-50%, -50%)
      border-radius 50%

    .circle-4
      width 100%
      height 100%
      border 2px dotted $border-color
      opacity 0.3

    .circle-5
      width 81%
      height 81%
      border 2px solid $border-color
      opacity 0.4

    .circle-6
      width 65%
      height 65%
      border 2px solid $border-color
      opacity 0.4

    .point-1, .point-2, .point-3
      position absolute
      width 14px
      height 14px
      border-radius 50%
      transform translate(-50%, -50%)
      background $border-color
      opacity 0.3

    .point-1
      top -17%
      left 50%

    .point-2
      top -40%
      left 50%

    .point-3
      top -15%
      right -30%

    .line
      position absolute
      left 50%
      top -50%
      transform translate(-50%, -50%)
      height 100%
      width 2px
      background $border-color
      opacity 0.3

    .name
      position absolute
      bottom -65px
      font-size v-bind(fontSize)
      font-weight bold
      color v-bind(color)
      white-space nowrap
      text-overflow ellipsis

.img_circle
  border-radius 50%
  clip-path var(--avatar-image-clip-path-bilibiliwiki-only)
</style>

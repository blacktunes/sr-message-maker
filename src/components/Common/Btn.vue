<template>
  <div
    class="button"
    :class="{ disable }"
  >
    <div
      class="icon"
      v-if="type"
    >
      <Icon
        :name="type"
        width="35"
        height="35"
      />
    </div>
    <span>
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import Icon from './Icon.vue'

defineProps<{
  name: string
  type?: 'check' | 'wrong'
  disable?: boolean
}>()
</script>

<style lang="stylus" scoped>
.disable
  background transparent !important
  border 3px solid #afafaf !important
  color #afafaf !important
  cursor auto !important

  &:before
    display none

.button
  box-sizing border-box
  position relative
  display flex
  justify-content center
  align-items center
  background rgba(255, 255, 255, 0.85)
  height 95px
  padding 10px 120px
  margin 0 40px
  border-radius 50px
  font-size 40px
  color #161616
  user-select none
  cursor pointer
  border 5px solid #e0e0e0

  span
    margin-bottom 5px

  &:before
    content ''
    position absolute
    box-sizing border-box
    top 50%
    left 50%
    width 98%
    height 90%
    border-radius 50px
    border 5px solid rgba(180, 180, 180, 0.5)
    transform translate(-50%, -50%)
    pointer-events none

  &:hover
    background #ffffff

  &:active
    background rgba(255, 255, 255, 0.8)

  .icon
    display flex
    justify-content center
    align-items center
    width 45px
    height 45px
    margin-right 20px
    border-radius 50%
    background #0c0b07
    border 5px solid #b4a177

    :deep(path)
      fill #d2c2a0
</style>

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
  border 3px solid #afafaf !important
  background transparent !important
  color #afafaf !important
  cursor auto !important

  &:before
    display none

.button
  position relative
  display flex
  justify-content center
  align-items center
  box-sizing border-box
  margin 0 40px
  padding 10px 120px
  height 95px
  border 5px solid #e0e0e0
  border-radius 50px
  background rgba(255, 255, 255, 0.85)
  color #161616
  font-size 40px
  cursor pointer
  user-select none

  span
    margin-bottom 5px

  &:before
    position absolute
    top 50%
    left 50%
    box-sizing border-box
    width 98%
    height 90%
    border 5px solid rgba(180, 180, 180, 0.5)
    border-radius 50px
    content ''
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
    margin-right 20px
    width 45px
    height 45px
    border 5px solid #b4a177
    border-radius 50%
    background #0c0b07

    :deep(path)
      fill #d2c2a0
</style>

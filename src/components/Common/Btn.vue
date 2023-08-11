<template>
  <div class="button">
    {{ name }}
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  name: string
}>()
</script>

<style lang="stylus" scoped>
.button
  box-sizing border-box
  position relative
  display flex
  align-content center
  background #e0e0e0
  height 100px
  padding 10px 120px
  border-radius 50px
  font-size 46px
  color #161616
  user-select none
  cursor pointer
  border 5px solid #e0e0e0

  &:before
    content ''
    position absolute
    box-sizing border-box
    top 50%
    left 50%
    width 98%
    height 90%
    border-radius 40px
    border 5px solid rgba(180, 180, 180, 0.5)
    transform translate(-50%, -50%)
    pointer-events none

  &:hover
    background #ffffff

  &:active
    background rgba(255, 255, 255, 0.8)
</style>

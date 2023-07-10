<template>
  <div
    class="character"
    :class="{ 'custom-user': custom, 'glod-border': level === 5 }"
    :title="name"
  >
    <div class="card">
      <div class="avatar">
        <img :src="avatar" :alt="name" draggable="false" />
      </div>
      <div class="name">{{ name }}</div>
    </div>
    <div class="info">{{ info || "" }}</div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  custom?: boolean
  name: string
  info?: string
  avatar: string
  level?: 5
}>()
</script>

<style lang="stylus" scoped>
.glod-border
  height 635px
  background linear-gradient(to bottom, #373737, #7b715b)
  border-bottom 12px solid #ffce6f

.custom-user
  .card
    overflow hidden
    height 635px
    background linear-gradient(to bottom, #373737, #615a6d)
    border-top-right-radius 50px
    border-bottom 12px solid #c3c3c3

    .avatar
      overflow hidden
      margin auto
      margin-top 65px
      width 340px
      height 340px

      img
        width 100%
        height 100%
        border-radius 50%
        object-fit contain
        background #fff

  .name
    color #555

.character
  position relative
  margin 10px
  cursor pointer

  .card
    position relative

    .avatar
      img
        width 100%

  .name, .info
    width 100%
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    text-align center

  .name
    position absolute
    bottom 80px
    color rgba(255, 255, 255, 0.85)
    font-weight bold
    font-size 40px
    text-align center

  .info
    font-size 30px
    color var(--info-color)
    text-align center
</style>

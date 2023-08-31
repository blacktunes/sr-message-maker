<template>
  <div
    class="character"
    :class="{ 'custom-user': custom }"
    :title="name"
  >
    <div
      class="card"
      :class="{ 'gold-border': level === 5 }"
    >
      <div class="avatar">
        <img
          :src="avatar"
          :alt="name"
          draggable="false"
        />
      </div>
      <div class="name">{{ name }}</div>
    </div>
    <div
      class="info"
      :title="info"
    >
      {{ info || '' }}
    </div>
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
.gold-border
  background linear-gradient(to bottom, #373737, #7b715b) !important
  border-bottom 12px solid #ffce6f !important

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
        width 100% !important
        height 100% !important
        border-radius 50%
        object-fit contain
        background rgba(255, 255, 255, 0.1)
        clip-path var(--avatar-image-clip-path-bilibiliwiki-only)
        user-select none

  .name
    color #555

.character
  position relative
  margin 10px
  cursor pointer
  height 700px

  .card
    position relative

    .avatar
      img
        width 100%
        height calc(700px - 50px)
        user-select none

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

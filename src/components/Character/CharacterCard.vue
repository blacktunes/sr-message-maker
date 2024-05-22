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
          :src="avatar || defaultAvatar"
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
import defaultAvatar from '@/assets/images/avatar/私聊.webp'

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
  border-bottom 14px solid #ffd070 !important
  background linear-gradient(to bottom, #373737, #7b715b) !important

.custom-user
  .card
    overflow hidden
    margin-bottom 10px
    height 635px !important
    border-bottom 14px solid #c3c3c3
    border-top-right-radius 50px
    background linear-gradient(to bottom, #373737, #615a6d)

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
        background var(--avatar-background)
        pointer-events none
        user-select none
        object-fit contain
        clip-path var(--avatar-image-clip-path-bilibiliwiki-only)

  .name
    bottom 65px !important

.character
  position relative
  margin 10px
  height 700px
  cursor pointer

  &:hover
    .card
      filter brightness(1.1)

  .card
    position relative
    height 650px

    .avatar
      img
        width 100%
        height 700px - 50px
        pointer-events none
        user-select none

  .name
  .info
    overflow hidden
    width 100%
    text-align center
    text-overflow ellipsis
    white-space nowrap

  .name
    position absolute
    bottom 80px
    color rgba(255, 255, 255, 0.85)
    text-align center
    font-weight bold
    font-size 40px

  .info
    margin-bottom 10px
    color var(--info-color)
    text-align center
    font-size 30px
</style>

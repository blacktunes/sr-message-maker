<template>
  <Main
    :viewport="{
      width: 3200,
      bottom: 100
    }"
    :popup="popupManager"
  >
    <Header />
    <Index />
    <User />
    <Link />
    <Preview />
  </Main>
</template>

<script lang="ts" setup>
import { Main } from 'star-rail-vue'
import { popupManager } from './assets/scripts/popup'
import Header from './components/Header.vue'
import Index from './components/Index.vue'
import Link from './components/Link.vue'
import Preview from './components/Preview.vue'
import User from './components/User.vue'
</script>

<style lang="stylus" scoped>
:deep(#home)
  &:before
    position absolute
    top 0px
    right 0px
    bottom 0px
    left 0px
    z-index -1
    background url('@/assets/images/方块背景.webp')
    content ''
    opacity 0.15

  &:after
    position absolute
    z-index -2
    width 100%
    height 100%
    background url('https://patchwiki.biligame.com/images/sr/8/8e/2ywvn145o3txkmqwhhtt884nb5mjfh2.jpg'), rgba(0, 0, 0, 0.6)
    filter blur(30px)
    background-position center
    background-size cover
    content ''
    opacity 0.8
</style>

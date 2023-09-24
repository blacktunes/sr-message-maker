<template>
  <transition name="fade">
    <Window
      class="window"
      style="z-index: 90"
      v-show="popup.avatar"
      title="更换头像"
    >
      <div class="select">
        <div
          class="avatar"
          v-for="(item, key) in character.avatar"
          :key="key"
          :class="{ highlight: index === key }"
          @click="index = key"
        >
          <img
            :src="item.avatar"
            alt=""
          />
        </div>
      </div>
      <template #left>
        <div class="preview">
          <div class="circle">
            <div class="circle-1"></div>
            <div class="circle-2"></div>
            <div class="circle-3"></div>
            <img
              :src="imgUrl"
              alt=""
            />
            <div class="name">{{ name }}</div>
          </div>
        </div>
      </template>
      <template #footer>
        <Btn
          class="btn"
          name="取消"
          type="wrong"
          @click="popup.avatar = false"
        />
        <Btn
          class="btn"
          name="确认"
          type="check"
          :disable="index === setting.bubbles"
          @click="onBtnClick"
        />
      </template>
    </Window>
  </transition>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue'
import { setAvatar, setting } from '@/store/setting'
import { popup } from '@/store/popup'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import { character } from '@/store/character'
import { getAssets } from '@/assets/scripts/preload'
import borderUrl from '@/assets/images/avatar/边框.webp'
import iconUrl from '@/assets/images/avatar/图标.webp'

const index = ref<string | number>(0)

watch(
  () => popup.avatar,
  () => {
    if (popup.avatar) {
      if (
        (typeof setting.avatar === 'string' && !character.avatar[setting.avatar]) ||
        (typeof setting.avatar === 'number' && !character.customAvatar[setting.avatar])
      ) {
        setAvatar()
      }
      index.value = setting.avatar
    }
  },
  {
    immediate: true
  }
)

const imgUrl = computed(() => {
  if (typeof index.value === 'string') {
    return character.avatar[index.value].avatar
  }
  if (typeof index.value === 'number') {
    return character.customAvatar[index.value]
  }
  return ''
})

const name = computed(() => {
  if (typeof index.value === 'string') {
    return index.value
  }
  return ''
})

const onBtnClick = () => {
  if (setting.avatar === index.value) return
  popup.avatar = false
  setAvatar(index.value)
}

const border = computed(() => `url('${getAssets(borderUrl).value}`)
const icon = computed(() => `url('${getAssets(iconUrl).value}`)
</script>

<style lang="stylus" scoped>
.window
  :deep(.item)
    margin 10px 80px !important
    max-height unset !important

.preview
  display flex
  flex-direction column
  align-items center
  justify-content center
  width 300px
  height 100%
  padding 0 80px 0 150px
  user-select none

  .circle
    position relative
    display flex
    justify-content center
    align-items center
    width 350px
    height 350px
    background linear-gradient(to top, #c3b7a9, transparent)
    border-radius 50%

    img
      width 75%
      object-fit contain
      border-radius 50%
      clip-path var(--avatar-image-clip-path-bilibiliwiki-only)
      user-select none
      pointer-events none

    .circle-1, .circle-2, .circle-3
      position absolute
      left 50%
      bottom -5px
      transform translate(-50%)
      border-radius 50%

    .circle-1
      width 115%
      height 115%
      border 2px solid #b9babf

    .circle-2
      width 108%
      height 108%
      border 2px dotted #b9babf

    .circle-3
      width 200%
      height 200%
      border 2px dotted #b9babf
      opacity 0.5

    .name
      position absolute
      bottom -60px
      font-size 35px
      font-weight bold
      margin-top 10px
      color #6a6a6a

.select
  display flex
  flex-wrap wrap
  justify-content flex-start
  overflow-x hidden
  height 530px
  width 1200px
  padding-right 10px
  user-select none

  .avatar
    position relative
    box-sizing border-box
    width 190px
    height 190px
    border-radius 50%
    margin 50px 30px 10px 10px
    background #c3b7a9
    cursor pointer

    &:hover
      background #d7d7d7

    img
      width 100%
      height 100%
      object-fit contain
      border-radius 50%
      clip-path var(--avatar-image-clip-path-bilibiliwiki-only)
      user-select none
      pointer-events none

.highlight
  cursor auto !important

  &:after
    content ''
    position absolute
    left 50%
    bottom 50%
    height 120%
    width 120%
    border-radius 50%
    transform translate(-50%, 50%)
    background v-bind(border)
    background-size 100%
    animation highlight-rotate 30s linear infinite

  &:before
    content ''
    position absolute
    left 50%
    top -60px
    height 30%
    width 25%
    transform translate(-50%, 50%)
    background v-bind(icon)
    background-size 100%
    background-repeat no-repeat
    animation highlight-icon 0.5s linear alternate infinite

.btn
  width 650px

@keyframes highlight-rotate
  from
    transform translate(-50%, 50%) rotate(0deg)

  to
    transform translate(-50%, 50%) rotate(-360deg)

@keyframes highlight-icon
  from
    top -70px

  to
    top -75px
</style>

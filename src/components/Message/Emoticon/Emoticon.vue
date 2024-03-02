<template>
  <transition name="emoticon">
    <div
      class="emoticon"
      v-show="emoticonData.show"
      @click.stop=""
    >
      <div class="title">{{ emoticon[emoticonPage]?.title }}</div>
      <transition
        name="fade-in"
        appear
      >
        <div
          class="emoticon-list"
          :key="emoticonPage"
          ref="listDom"
        >
          <div
            class="item"
            v-for="(item, key) in emoticon[emoticonPage]?.list"
            :key="`emoticon-${key}`"
            @click="handleEmoticonClick(item)"
          >
            <div class="img">
              <img
                :src="item.url"
                :alt="item.title"
              />
            </div>
            <div class="text">
              {{ item.title }}
            </div>
          </div>
        </div>
      </transition>
      <div
        class="group"
        @wheel.prevent.stop="onWheel"
        ref="group"
      >
        <div
          class="group-item"
          v-for="(group, key) in emoticon"
          :key="`group-${key}`"
          :class="{ highlight: key === emoticonPage }"
          @click="changePage(key)"
        >
          <div class="img">
            <img
              :src="group.list[0].url"
              :alt="group.list[0].title"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { emoticon } from '@/assets/data/emoticon'
import { nextTick, ref } from 'vue'
import { emoticonData } from './'

const listDom = ref<HTMLElement | null>(null)
const emoticonPage = ref(0)

const changePage = (page: number) => {
  emoticonPage.value = page
  nextTick(() => {
    if (listDom.value) {
      listDom.value.scrollTop = 0
    }
  })
}

const group = ref<HTMLElement | null>(null)

const onWheel = (e: WheelEvent) => {
  if (group.value) {
    group.value.scrollLeft += e.deltaY
  }
}

const emit = defineEmits<{
  (event: 'emoticon', url: string, name: string): void
}>()

const handleEmoticonClick = (item: Emoticon) => {
  emit('emoticon', item.url, item.title)
}
</script>

<style lang="stylus" scoped>
.emoticon
  z-index 10
  display flex
  flex-direction column
  position absolute
  right 0
  bottom 120px
  width 1400px
  height 950px
  background rgba(239, 239, 239, 0.97)
  padding 30px 40px 60px 50px
  border-radius 5px
  $shadow-width = 20px
  $arrow-height = 30px
  $arrow-width = (50px / 2)
  $arrow-right = 170px
  box-shadow 0 0 $shadow-width 0px rgba(0, 0, 0, 0.15)
  clip-path s('polygon(-%s -%s, calc(100% + %s) -%s, calc(100% + %s) calc(100% - %s), calc(100% - %s) calc(100% - %s), calc(100% - %s) 100%, calc(100% - %s) calc(100% - %s), -%s calc(100% - %s))', $shadow-width, $shadow-width, $shadow-width, $shadow-width, $shadow-width, $arrow-height, $arrow-right + $arrow-width, $arrow-height, $arrow-right + $arrow-width * 2, $arrow-right + $arrow-width * 3, $arrow-height, $shadow-width, $arrow-height)
  user-select none

  .title
    font-size 48px
    margin-bottom 15px

  .emoticon-list
    flex 1
    display flex
    flex-wrap wrap
    align-content flex-start
    overflow-y auto
    overflow-y overlay
    overflow-x hidden
    scrollbar-gutter stable
    mask-image linear-gradient(to bottom, transparent, #000 20px, #000, #000 calc(100% - 50px), transparent), linear-gradient(to left, black, transparent 10px)
    mask-size 100% 100%
    mask-position 0 0, 100% 0
    mask-repeat no-repeat, no-repeat

    &::-webkit-scrollbar-track
      margin 15px 0

    .item
      display flex
      flex-direction column
      box-sizing border-box
      border 5px solid #c5c5c5
      background #d9d9d9
      width 261px
      margin 0 20px 30px 0
      cursor pointer

      &:nth-child(5n)
        margin-right 0

      .img
        overflow hidden
        box-sizing border-box
        width 261px
        height 245px
        padding 5px
        display flex
        align-items center
        justify-content center

        img
          margin 10px
          width calc(100% - 20px)

    .text
      background #ececec
      padding 5px
      font-size 32px
      color #545454
      font-weight bold
      text-align center
      overflow hidden
      white-space nowrap
      text-overflow ellipsis

  .group
    position relative
    display flex
    overflow-y hidden
    overflow-x auto
    scrollbar-width none
    padding-top 20px

    &::-webkit-scrollbar
      height 0

    .group-item
      z-index 5
      box-sizing border-box
      position relative
      display flex
      justify-content center
      align-items center
      width 200px
      height 100%
      flex-shrink 0
      border-bottom 8px solid #dadada
      cursor pointer

      &:hover
        .img
          opacity 1

      .img
        display flex
        align-items center
        justify-content center
        width 100px
        opacity 0.5

        img
          width 75px

.highlight
  .img
    opacity 1 !important

  &:before
    content ''
    z-index -1
    position absolute
    left 50%
    bottom 50%
    width 140px
    height 50px
    background #121212
    opacity 0.4
    animation open-1 0.9s forwards
    transform translate(-50%, 50%)
    transform-origin center

  &:after
    content ''
    position absolute
    left 0
    bottom -8px
    width 100%
    height 7px
    background #121212
    animation open-2 0.6s forwards

.emoticon-enter-active, .emoticon-leave-active
  transition all 0.2s

.emoticon-enter-from
  opacity 0
  transform translateY(20%)

.emoticon-leave-to
  opacity 0

@keyframes open-1
  0%
    transform translate(-50%, 50%) scaleX(0)

  50%
    transform translate(-50%, 50%) scaleX(1)

  100%
    opacity 0

@keyframes open-2
  0%
    background #fdd073
    transform scaleX(0)

  75%
    background #fdd073

  95%
    transform scaleX(1)

  100%
    background #121212
</style>

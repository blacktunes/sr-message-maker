<template>
  <transition name="emoticon">
    <div
      class="emoticon"
      v-show="input.emoticon"
      @click.stop=""
    >
      <div class="title">{{ emoticon[input.emoticon_page]?.title }}</div>
      <transition
        name="fade-in"
        appear
      >
        <div
          class="emoticon-list"
          :key="input.emoticon_page"
          ref="listDom"
        >
          <div
            class="item"
            v-for="(item, key) in emoticon[input.emoticon_page]?.list"
            :key="`emoticon-${key}`"
            @click="handelEmoticonClick(item)"
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
        @wheel="onWheel"
        ref="group"
      >
        <div
          class="group-item"
          v-for="(group, key) in emoticon"
          :key="`group-${key}`"
          :class="{ highlight: key === input.emoticon_page }"
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
import { input } from '@/store/input'
import { nextTick, ref, watch } from 'vue'

const listDom = ref<HTMLElement | null>(null)

const changePage = (page: number) => {
  input.emoticon_page = page
  nextTick(() => {
    if (listDom.value) {
      listDom.value.scrollTop = 0
    }
  })
}

const group = ref<HTMLElement | null>(null)

const onWheel = (e: WheelEvent) => {
  if (listDom.value) {
    listDom.value.scrollTop = 0
  }
  if (group.value) {
    group.value.scrollLeft += e.deltaY
  }
}

watch(
  () => input.emoticon,
  () => {
    if (!input.emoticon) {
      input.index = undefined
    }
  }
)

const emit = defineEmits<{
  (event: 'emoticon', url: string, name: string): void
}>()

const handelEmoticonClick = (item: Emoticon) => {
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
    scrollbar-width none

    &::-webkit-scrollbar-track
      margin 0

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
    box-shadow 0px -20px 25px 20px rgba(255, 255, 255, 0.95)
    background #fff

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

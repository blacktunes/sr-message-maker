<template>
  <transition name="emoticon">
    <div
      class="emoticon"
      v-show="input.emoticon"
      @click.stop=""
    >
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
            v-for="(item, key) in emoticon[input.emoticon_page]"
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
              :src="group[0].url"
              :alt="group[0].title"
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
  display flex
  flex-direction column
  position absolute
  right -10px
  bottom 120px
  width 1400px
  height 900px
  background rgba(255, 255, 255, 0.95)
  padding 30px 60px 60px 60px
  border-radius 5px
  box-shadow 0 0 20px 0px rgba(0, 0, 0, 0.15)
  user-select none
  clip-path polygon(-1% -1%, 101% -1%, 101% calc(100% - 40px), calc(100% - 165px) calc(100% - 40px), calc(100% - 200px) 100%, calc(100% - 235px) calc(100% - 40px), -1% calc(100% - 40px))

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

    &::-webkit-scrollbar
      width 10px

    &::-webkit-scrollbar-track
      margin 0

    .item
      display flex
      flex-direction column
      box-sizing border-box
      border 5px solid #c6c5c5
      background #d8d8d8
      width calc(20% - 20px)
      height 320px
      margin 0 20px 30px 0
      cursor pointer

      .img
        flex 1
        display flex
        align-items center
        justify-content center

        img
          margin 10px
          width calc(100% - 20px)

    .text
      background #ebebeb
      padding 5px
      font-size 32px
      color #666
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

    &::-webkit-scrollbar
      height 0

    .group-item
      box-sizing border-box
      position relative
      display flex
      justify-content center
      align-items center
      width 16%
      height 100%
      flex-shrink 0
      border-bottom 8px solid #dadada
      cursor pointer

      &:hover
        .img
          opacity 1

      .img
        width 100px
        opacity 0.5

        img
          width 100%

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
    height 8px
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

  70%
    background #fdd073

  90%
    transform scaleX(1)

  100%
    background #121212
</style>

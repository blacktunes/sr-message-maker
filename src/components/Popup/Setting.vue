<template>
  <transition name="fade">
    <Window
      v-if="popup.setting"
      title="更换对话框"
      :no-close="true"
      @close="popup.setting = false"
    >
      <div class="select">
        <div
          class="item"
          v-for="(item, key) in bubbles"
          :key="key"
          :class="{ highlight: index === key }"
          @click="index = key"
        >
          <img
            :src="item.img"
            :alt="item.name"
          />
        </div>
      </div>
      <template #left>
        <div class="preview">
          <div class="circle">
            <img
              :src="bubbles[index].preview"
              alt=""
            />
          </div>
          <div class="name">{{ bubbles[index].name }}</div>
        </div>
      </template>
      <template #footer>
        <Btn
          class="btn"
          name="取消"
          @click="popup.setting = false"
        />
        <Btn
          class="btn"
          name="确认"
          :disable="index === setting.bubbles"
          @click="onBtnClick"
        />
      </template>
    </Window>
  </transition>
</template>

<script lang="ts" setup>
import { popup } from '@/store/popup'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import bubbles_0 from '@/assets/images/bubbles/0.png'
import bubbles_0_preview from '@/assets/images/bubbles/0_preview.png'
import bubbles_1 from '@/assets/images/bubbles/1.png'
import bubbles_1_preview from '@/assets/images/bubbles/1_preview.png'
import { watch, ref } from 'vue'
import { setting } from '@/store/setting'

const index = ref(0)

watch(
  () => popup.setting,
  () => {
    if (!popup.setting) {
      index.value = setting.bubbles
    }
  }
)

const bubbles = [
  {
    name: '语言的艺术',
    img: bubbles_0,
    preview: bubbles_0_preview
  },
  {
    name: '兔子在哪里？',
    img: bubbles_1,
    preview: bubbles_1_preview
  }
]

const onBtnClick = () => {
  popup.setting = false
  setting.bubbles = index.value
}
</script>

<style lang="stylus" scoped>
.preview
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding 130px 120px
  user-select none

  .circle
    display flex
    justify-content center
    align-items center
    width 300px
    height 300px
    background #b9babf
    border-radius 50%

    img
      width 80%

  .name
    font-size 35px
    font-weight bold
    margin-top 10px
    color #6a6a6a

.select
  display flex
  flex-wrap wrap
  justify-content flex-start
  overflow-x hidden
  height 400px
  width 1200px
  padding-right 10px
  user-select none

  .item
    overflow hidden
    position relative
    box-sizing border-box
    width 30%
    height 200px
    margin 0 3% 3% 0
    background #c5c6ca
    border 4px solid #a7a8aa
    cursor pointer

    &:hover
      background #d7d7d7

    img
      width 100%

.highlight
  border 4px solid #14120d !important
  cursor auto !important

  &:after
    content '使用中'
    position absolute
    left 0
    bottom 0
    display flex
    justify-content center
    align-items center
    background #e7c57e
    height 38px
    width 100%
    font-size 28px

  &:hover
    background #c5c6ca !important

.btn
  width 600px
</style>

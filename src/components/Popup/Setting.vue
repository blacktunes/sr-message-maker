<template>
  <Window
    style="z-index: 90"
    :show="popup.setting"
    title="更换对话框"
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
    <template #outside>
      <div class="other-setting">
        <div
          class="setting-btn"
          title="更新记录"
          @click.stop="popup.log = true"
        >
          <Icon
            name="log"
            width="50"
            height="50"
          />
        </div>
        <div
          class="setting-btn"
          title="字体设置"
          @click.stop="popup.font = true"
        >
          <Icon
            name="font"
            width="60"
            height="60"
          />
        </div>
        <div
          class="setting-btn"
          title="数据管理"
          @click.stop="popup.data = true"
        >
          <Icon name="data" />
        </div>
      </div>
    </template>
    <template #left>
      <div class="preview">
        <div class="circle">
          <div class="circle-1"></div>
          <div class="circle-2"></div>
          <div class="circle-3"></div>
          <img
            :src="bubbles[index].preview"
            alt=""
          />
          <div class="name">{{ bubbles[index].name }}</div>
        </div>
      </div>
    </template>
    <template #footer>
      <Btn
        class="btn"
        name="取消"
        type="wrong"
        @click="popup.setting = false"
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
</template>

<script lang="ts" setup>
import { watch, ref, reactive } from 'vue'
import { setting } from '@/store/setting'
import { popup } from '@/store/popup'
import { getAssets } from '@/assets/scripts/preload'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import Icon from '@/components/Common/Icon.vue'
import bubbles_0 from '@/assets/images/bubbles/0.webp'
import bubbles_0_preview from '@/assets/images/bubbles/0_preview.webp'
import bubbles_1 from '@/assets/images/bubbles/1.webp'
import bubbles_1_preview from '@/assets/images/bubbles/1_preview.webp'

const index = ref(0)

watch(
  () => popup.setting,
  () => {
    if (popup.setting) {
      index.value = setting.bubbles
    }
  }
)

const bubbles = reactive([
  {
    name: '语言的艺术',
    img: getAssets(bubbles_0),
    preview: getAssets(bubbles_0_preview)
  },
  {
    name: '兔子在哪里？',
    img: getAssets(bubbles_1),
    preview: getAssets(bubbles_1_preview)
  }
])

const onBtnClick = () => {
  if (setting.bubbles === index.value) return
  popup.setting = false
  setting.bubbles = index.value
  localStorage.setItem('sr-message-bubbles', JSON.stringify(setting.bubbles))
}
</script>

<style lang="stylus" scoped>
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
    width 300px
    height 300px
    background #b9babf
    border-radius 50%

    img
      width 80%

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

.other-setting
  .setting-btn
    box-sizing border-box
    width 90px
    height 90px
    display flex
    justify-content center
    align-items center
    background rgba(255, 255, 255, 0.8)
    border-radius 50%
    border 5px solid #767479
    margin-bottom 30px
    cursor pointer

    :deep(path)
      fill #767479

    &:hover
      background #ffffff

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
  width 650px
</style>

<template>
  <div class="mission">
    <transition
      :name="setting.transition ? 'fade-in' : undefined"
      appear
    >
      <div
        class="bg"
        :style="{
          backgroundImage: backgroundUrl,
          width: preview
            ? 'calc(100% - var(--message-item-avatar-margin) * 2 + 40px)'
            : 'calc(100% - var(--message-item-avatar-width) * 2 - 60px)'
        }"
      >
        <div
          v-if="!preview"
          @click.stop="handelTypeClick(mission.type)"
          class="icon"
          title="修改任务类型"
        ></div>
        <div
          class="tip"
          @click.stop="preview ? undefined : handeStateClick(mission.state)"
          title="修改任状态"
        >
          {{ missionState }}
        </div>
        <div
          v-if="preview"
          class="text"
        >
          {{ text }}
        </div>
        <input
          v-else
          class="text"
          :value="text"
          @input="emit('update', ($event.target as HTMLInputElement).value)"
          @blur="updateText(($event.target as HTMLInputElement).value)"
          @keydown.enter.prevent.stop="blur"
          @keydown.escape.prevent.stop="blur"
        />
        <div
          class="state"
          @click.stop="preview ? undefined : handeStateClick(mission.state)"
          title="修改任状态"
        >
          <Icon
            v-if="mission.state === 1"
            :class="[`mission-${mission.type ?? 0}`]"
            name="success"
          />
          <Icon
            v-else-if="mission.state === 2"
            :class="[`mission-${mission.type ?? 0}`]"
            name="fail"
          />
          <Icon
            v-else
            name="arrow"
          />
        </div>
        <div
          v-if="!preview"
          @click="emit('delete')"
          class="del"
        >
          <Icon
            name="delete"
            width="35"
            height="35"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { setting } from '@/store/setting'
import Icon from '../Common/Icon.vue'
import image_0 from '@/assets/images/mission/同行任务.webp'
import image_1 from '@/assets/images/mission/冒险任务.webp'
import image_2 from '@/assets/images/mission/开拓任务.webp'
import image_3 from '@/assets/images/mission/日常任务.webp'
import image_4 from '@/assets/images/mission/开拓续闻.webp'
import { getAssets } from '@/assets/scripts/preload'

const props = defineProps<{
  text: string
  mission: Mission
  preview?: boolean
}>()

const emit = defineEmits<{
  (event: 'state', data: Mission): void
  (event: 'update', text: string): void
  (event: 'delete'): void
}>()

const missionState = computed(() => {
  if (props.mission?.state === 2) {
    return '任务失败'
  }
  if (props.mission?.state === 1) {
    return '任务已完成'
  }
  return '已接取任务'
})

const backgroundUrl = computed(() => {
  if (props.mission?.type === 1) return `url(${getAssets(image_1).value})`
  if (props.mission?.type === 2) return `url(${getAssets(image_2).value})`
  if (props.mission?.type === 3) return `url(${getAssets(image_3).value})`
  if (props.mission?.type === 4) return `url(${getAssets(image_4).value})`
  return `url(${getAssets(image_0).value})`
})

const handelTypeClick = (type: number) => {
  type += 1
  if (type > 4) type = 0

  const data: Mission = {
    type: type as 0,
    state: props.mission?.state ?? 0
  }
  emit('state', data)
}

const handeStateClick = (state: number) => {
  const data: Mission = {
    type: props.mission?.type ?? 0,
    state: state === 0 ? 1 : state === 1 ? 2 : 0
  }
  emit('state', data)
}

const updateText = (text: string) => {
  if (text.length < 1) emit('update', DEFAULT_TEXT)
}

const blur = (e: KeyboardEvent) => {
  ;(e.target as HTMLInputElement).blur()
}
</script>

<style lang="stylus" scoped>
@import './Message.styl'

.mission
  display flex
  justify-content center
  align-items center
  margin 80px 0
  padding 20px 0
  item()

  .bg
    position relative
    height 180px
    background-repeat no-repeat
    background-position top left
    background-size cover
    border-top-right-radius 50px

    .icon
      position absolute
      top 0
      left 35px
      width 120px
      height 175px
      user-select none
      cursor pointer

    .tip
      position absolute
      top 10px
      left 180px
      color #fff
      font-size 30px
      height 45px
      line-height 45px
      user-select none
      cursor pointer

    .text
      position absolute
      top 55px
      left 180px
      color #000
      font-size 45px
      line-height 100px
      height 100px
      width 80%
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      background transparent
      border none

    .state
      display flex
      justify-content center
      align-items center
      position absolute
      right 0
      bottom 15px
      width 120px
      height 120px
      user-select none
      cursor pointer

    .del
      display flex
      align-items center
      justify-content center
      position absolute
      right -100px
      top 50%
      width 60px
      height 60px
      transform translateY(-50%)
      opacity 0
      cursor pointer

      :deep(path)
        fill var(--message-item-name-color)

      &:hover
        opacity 1

.mission-0
  color #b886ed

.mission-1
  color #54a9be

.mission-2
  color #f4b334

.mission-3
  color #b6d671

.mission-4
  color #e68321
</style>

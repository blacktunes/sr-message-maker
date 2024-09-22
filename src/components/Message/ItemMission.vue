<template>
  <div class="mission">
    <transition
      :name="!state.drag ? 'fade-in' : undefined"
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
          @click="handleTypeClick(mission.type)"
          class="icon"
          title="修改任务类型"
        ></div>
        <div
          class="tip"
          @click="preview ? undefined : handeStateClick(mission.state)"
          title="修改任务状态"
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
          @keydown="onKeydown"
        />
        <div
          class="state"
          @click="preview ? undefined : handeStateClick(mission.state)"
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
import image_1 from '@/assets/images/mission/冒险任务.webp'
import image_0 from '@/assets/images/mission/同行任务.webp'
import image_2 from '@/assets/images/mission/开拓任务.webp'
import image_4 from '@/assets/images/mission/开拓续闻.webp'
import image_3 from '@/assets/images/mission/日常任务.webp'
import { state } from '@/store/setting'
import Icon from '../Common/Icon.vue'
import { onKeydown } from './Message'

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
  if (props.mission?.type === 1) return `url(${image_1})`
  if (props.mission?.type === 2) return `url(${image_2})`
  if (props.mission?.type === 3) return `url(${image_3})`
  if (props.mission?.type === 4) return `url(${image_4})`
  return `url(${image_0})`
})

const handleTypeClick = (type: number) => {
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
</script>

<style lang="stylus" scoped>
@import './Message.styl'

.mission
  display flex
  justify-content center
  align-items center
  padding 50px 0
  item()

  .bg
    position relative
    height 180px
    border-top-right-radius 50px
    background-position top left
    background-size cover
    background-repeat no-repeat

    .icon
      position absolute
      top 0
      left 35px
      width 120px
      height 175px
      cursor pointer
      user-select none

    .tip
      position absolute
      top 10px
      left 180px
      height 45px
      color #fff
      font-size 30px
      line-height 45px
      cursor pointer
      user-select none

    .text
      position absolute
      top 55px
      left 180px
      overflow hidden
      width 80%
      height 100px
      border none
      background transparent
      color #000
      text-overflow ellipsis
      white-space nowrap
      font-size 45px
      line-height 100px

    .state
      position absolute
      right 0
      bottom 15px
      display flex
      justify-content center
      align-items center
      width 120px
      height 120px
      cursor pointer
      user-select none

    .del
      position absolute
      top 50%
      right -100px
      display flex
      justify-content center
      align-items center
      width 60px
      height 60px
      opacity 0
      cursor pointer
      transform translateY(-50%)

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

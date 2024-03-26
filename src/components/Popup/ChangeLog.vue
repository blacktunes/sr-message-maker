<template>
  <Popup :index="props.index">
    <window
      title="更新记录"
      width="40%"
      height="90%"
      @close="close"
    >
      <div
        class="item"
        :class="{
          highlight: index === 0
        }"
        v-for="(item, index) in log"
        :key="`time-${index}`"
      >
        <div class="time">{{ item.time }}</div>
        <ul>
          <li
            class="text"
            v-for="(text, key) in item.text"
            :key="`text-${index}-${key}`"
          >
            {{ text.text }}
            <template v-if="text.author">
              <a
                target="_blank"
                :href="text.url"
              >
                @{{ text.author }}
              </a>
            </template>
            <template v-if="text.info">
              <template v-if="Array.isArray(text.info)">
                <div
                  v-for="(info, infoKey) in text.info"
                  :key="infoKey"
                  class="info"
                >
                  {{ info }}
                </div>
              </template>
              <template v-else>
                <div class="info">{{ text.info }}</div>
              </template>
            </template>
          </li>
        </ul>
      </div>
    </window>
  </Popup>
</template>

<script lang="ts" setup>
import Popup from '@/components/Common/Popup.vue'
import Window from '@/components/Common/Window.vue'
import log from '@/assets/data/log'

const props = defineProps<{
  name: string
  index: number
}>()

const emits = defineEmits<{
  (event: 'close', name: string): void
}>()

const close = () => {
  emits('close', props.name)
}
</script>

<style lang="stylus" scoped>
ul
  margin 5px auto

.item
  margin 20px 20px 20px 0
  padding 10px 20px 20px

  .time
    font-weight bold
    font-size 50px

  .text
    margin-top 5px
    font-size 36px

    a
      color #1F2328
      text-decoration none
      font-weight bold

      &:hover
        text-decoration underline

    .info
      color #666
      font-size 32px

.highlight
  border-radius 5px
  background #ccc
</style>

<template>
  <ItemOption
    v-if="item.option"
    :text="item.text"
    :highlight="item.option[0]"
    @update="updateText"
    @delete="emit('delete')"
    @select="emit('option')"
  />
  <ItemMission
    v-else-if="item.mission"
    :text="item.text"
    :mission="item.mission"
    :preview="preview"
    @update="updateText"
    @delete="emit('delete')"
    @state="updateMissionState"
  />
  <ItemNotice
    v-else-if="item.notice"
    :text="item.text"
    :preview="preview"
    @update="updateText"
    @delete="emit('delete')"
  />
  <ItemMessage
    v-else
    :item="item"
    :preview="preview"
    @update="updateText"
    @delete="emit('delete')"
    @avatar="emit('avatar')"
    @image="emit('image')"
  />
</template>

<script lang="ts" setup>
import ItemOption from './ItemOption.vue'
import ItemMission from './ItemMission.vue'
import ItemNotice from './ItemNotice.vue'
import ItemMessage from './ItemMessage.vue'

defineProps<{
  item: Message
  preview?: boolean
}>()

const emit = defineEmits<{
  (event: 'text', data: string): void
  (event: 'delete'): void
  (event: 'option'): void
  (event: 'mission', data: Mission): void
  (event: 'avatar'): void
  (event: 'image'): void
}>()

const updateText = (text: string) => {
  emit('text', text)
}

const updateMissionState = (data: Mission) => {
  emit('mission', data)
}
</script>

<template>
  <ItemOption
    v-if="item.option"
    :text="item.text"
    :highlight="item.option[0]"
    @update="emit('text', $event)"
    @delete="emit('delete')"
    @select="emit('option')"
  />
  <ItemMission
    v-else-if="item.mission"
    :text="item.text"
    :mission="item.mission"
    :preview="preview"
    @update="emit('text', $event)"
    @delete="emit('delete')"
    @state="emit('mission', $event)"
  />
  <ItemNotice
    v-else-if="item.notice"
    :text="item.text"
    :preview="preview"
    @update="emit('text', $event)"
    @delete="emit('delete')"
  />
  <ItemMessage
    v-else
    :item="item"
    :preview="preview"
    @update="emit('text', $event)"
    @delete="emit('delete')"
    @avatar="emit('avatar')"
    @image="emit('image', $event)"
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
  (event: 'image', emoticon: boolean): void
}>()
</script>

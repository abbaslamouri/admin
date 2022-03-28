<script setup>
const props = defineProps({
  mediaSortField: {
    type: String,
  },
  mediaSortOrder: {
    type: String,
  },
})

const emit = defineEmits(['toggleMediaSort'])

const sort = reactive({
  field: props.mediaSortField,
  order: props.mediaSortOrder,
})

const sortByOptions = [
  { key: 'name', name: 'Filename' },
  { key: 'size', name: 'File size' },
  { key: 'dateCreated', name: 'Date Created' },
]

watch(
  () => sort,
  (sortVal) => {
    emit('toggleMediaSort', sortVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="flex-row gap-2 text-sm">
    <div class="min-w-16">
      <FormsBaseSelect :options="sortByOptions" v-model="sort.field" label="Sort by" />
    </div>
    <div class="flex-row items-center gap-05" @click="toggleSort">
      <span>Sort Order</span>
      <button class="btn" @click="sort.order == '-' ? (sort.order = ``) : (sort.order = `-`)">
        <IconsSouth class="w-2 h-2 fill-sky-600" v-if="sort.order == '-'" />
        <IconsNorth class="w-2 h-2 fill-sky-600" v-else />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

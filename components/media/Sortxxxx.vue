<script setup>
const props = defineProps({
  sortField: {
    type: String,
  },
  sortOrder: {
    type: String,
  },
  sortOptions: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggleSort'])

const sort = reactive({
  field: props.sortField,
  order: props.sortOrder,
})

// const sortOptions = [
//   { key: 'name', name: 'Filename' },
//   { key: 'size', name: 'File size' },
//   { key: 'dateCreated', name: 'Date Created' },
// ]

watch(
  () => sort,
  (sortVal) => {
    emit('toggleSort', sortVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="flex-row gap-1 text-xs">
    <div class="min-w-16">
      <FormsBaseSelect :options="sortOptions" v-model="sort.field" label="Sort by" />
    </div>
    <div class="flex-row items-center gap-05">
      <span>Sort Order</span>
      <button class="btn" @click="sort.order == '-' ? (sort.order = ``) : (sort.order = `-`)">
        <IconsSouth class="w-2 h-2 fill-sky-600" v-if="sort.order == '-'" />
        <IconsNorth class="w-2 h-2 fill-sky-600" v-else />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

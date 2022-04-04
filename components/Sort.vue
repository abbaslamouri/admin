<script setup>
const props = defineProps({
  sort: {
    type: Object,
  },
  sortOptions: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggleSort'])

const currentSort = reactive({
  field: props.sort.field,
  order: props.sort.order,
})

watch(
  () => currentSort,
  (sortVal) => {
    emit('toggleSort', sortVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="flex-row gap-1 text-xs">
    <div class="min-w-16">
      <FormsBaseSelect :options="sortOptions" v-model="currentSort.field" label="Sort by" />
    </div>
    <div class="flex-row items-center gap-05">
      <span>Sort Order</span>
      <button class="btn" @click="currentSort.order == '-' ? (currentSort.order = ``) : (currentSort.order = `-`)">
        <IconsSouth class="w-2 h-2 fill-sky-600" v-if="currentSort.order == '-'" />
        <IconsNorth class="w-2 h-2 fill-sky-600" v-else />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

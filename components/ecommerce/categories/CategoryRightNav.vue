<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
  },
})
const emit = defineEmits(['saveCategory', 'updateParent'])

const parentId = ref(props.category.parent ? props.category.parent._id : '')

const parentCategoryOptions = computed(() => {
  return props.categories
    .filter((c) => c._id != props.category._id && (!c.parent || (c.parent && c.parent._id != props.category._id)))
    .map((el) => {
      return { key: el._id, name: el.name }
    })
})

const updateParent = () => {
  emit('updateParent', parentId.value)
}

watch(
  () => parentId.value,
  (currentVal) => {
    updateParent()
  }
  // { deep: true }
)
</script>

<template>
  <div class="flex-col gap-2">
    <div class="p-2 br-5 shadow-md">
      <button class="btn btn__checkout w-full py-1 flex-row justify-center" @click.prevent="$emit('saveCategory')">
        Save Changes
      </button>
    </div>
    <section class="bg-white p-2 br-5 shadow-md">
      <div class="flex-col gap-3">
        <p v-if="categories.length == 0">Please add another category first</p>
        <FormsBaseSelect
          v-else
          v-model="parentId"
          label="Parent Category"
          :options="parentCategoryOptions"
          nullOption="Select Category"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup>
const props = defineProps({
  product: {
    type: Object,
  },
})

const emit = defineEmits(['updateDetails'])

const details = reactive({
  excerpt: props.product.excerpt,
  description: props.product.description,
  intensity: props.product.intensity,
  roastiness: props.product.roastiness,
})

watch(
  () => details,
  (currentVal) => {
    emit('updateDetails', currentVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="details">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">details</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <FormsBaseTextarea v-model="details.excerpt" label="Excerpt" placeholder="Excerpt" rows="2" />
      <FormsBaseTextarea v-model="details.description" label="Description" placeholder="Description" rows="4" />
      <div class="flex-row gap-2">
        <div>
          <FormsBaseInput type="number" label="Intensity" placeholder="Intensity" v-model="details.intensity" />
        </div>
        <div class="flex-1">
          <FormsBaseInput label="Roastiness" placeholder="Roastiness" v-model="details.roastiness" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>

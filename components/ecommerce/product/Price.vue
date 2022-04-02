<script setup>
const props = defineProps({
  product: {
    type: Object,
  },
})

const emit = defineEmits(['updatePrice'])

const priceSalePrice = reactive({
  price: props.product.price,
  salePrice: props.product.salePrice,
})

watch(
  () => priceSalePrice,
  (currentVal) => {
    emit('updatePrice', currentVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="price">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Price</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div><FormsBaseInput label="Price" required currency v-model="priceSalePrice.price" /></div>
      <div><FormsBaseInput label="Sale Price" currency v-model="priceSalePrice.salePrice" /></div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>

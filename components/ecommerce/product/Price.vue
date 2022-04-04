<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="price">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Price</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div><FormsBaseInput label="Price" required currency v-model="product.price" /></div>
      <div><FormsBaseInput label="Sale Price" currency v-model="product.salePrice" /></div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>

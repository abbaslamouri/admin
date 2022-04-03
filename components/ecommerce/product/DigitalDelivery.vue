<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="digital-delivery">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Digital Delivery</div>
      <div><FormsBaseToggle v-model="product.downloadable" label="Enable" /></div>
    </div>
    <div class="flex-col gap-2">
      <div class="conten" v-if="product.downloadable">file upload dropzone goes here</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.digital-delivery {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>

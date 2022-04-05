<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="misc">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Misc.</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div>
        <FormsBaseInput
          type="text"
          label="Thank You Page"
          placeholder="Thank You Page"
          v-model="product.thankYouPage"
        />
      </div>
      <div class="flex-1">
        <FormsBaseInput label="Sort Order" placeholder="Sort Order" v-model="product.sortOrder" />
      </div>
    </div>
  </section>

  
</template>

<style lang="scss" scoped></style>

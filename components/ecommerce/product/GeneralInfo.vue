<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">General</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <FormsBaseInput label="Name" placeholder="Name" :required="true" v-model="product.name" />
      <FormsBaseSelect
        nullOption="Select Product Type"
        label="Product Type"
        :options="[
          { key: 'variable', name: 'Variable' },
          { key: 'simple', name: 'Simple' },
        ]"
        v-model="product.productType"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>

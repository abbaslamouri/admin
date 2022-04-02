<script setup>
const props = defineProps({
  product: {
    type: Object,
  },
})

const emit = defineEmits(['updateGeneralInfo'])

const generalInfo = reactive({
  name: props.product.name,
  productType: props.product.productType,
})

watch(
  () => generalInfo,
  (currentVal) => {
    emit('updateGeneralInfo', currentVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">General</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <FormsBaseInput label="Name" placeholder="Name" :required="true" v-model="generalInfo.name" />
      <FormsBaseSelect
        nullOption="Select Product Type"
        label="Product Type"
        :options="[
          { key: 'variable', name: 'Variable' },
          { key: 'simple', name: 'Simple' },
        ]"
        v-model="generalInfo.productType"
      />
      <!-- <FormsBaseInput label="SKU" placeholder="SKU" v-model="generalInfo.sku" />
      <div class="flex-row gap2 items-center">
        <div class="flex-row gap1">
          <FormsBaseInput
            label="Available Stock"
            placeholder="Available Stock"
            v-model="generalInfo.stockQty"
            :readonly="!generalInfo.manageInventory"
          />
        </div>
        <FormsBaseToggle v-model="generalInfo.manageInventory" label="Manage Inventory" />
      </div> -->
    </div>
  </section>
</template>

<style lang="scss" scoped></style>

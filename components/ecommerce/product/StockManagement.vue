<script setup>
const props = defineProps({
  product: {
    type: Object,
  },
})

const emit = defineEmits(['updateStock'])

const stock = reactive({
  sku: props.product.sku,
  manageInventory: props.product.manageInventory,
  stockQty: props.product.stockQty,
})

watch(
  () => stock,
  (currentVal) => {
    emit('updateStock', currentVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Stock</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <FormsBaseInput label="SKU" placeholder="SKU" v-model="stock.sku" />

      <div class="flex-row gap-2 items-center">
        <div class="flex-1">
          <FormsBaseToggle v-model="stock.manageInventory" label="Manage Inventory" />
        </div>
        <div class="flex-row gap-1">
          <FormsBaseInput
            label="Available Stock"
            placeholder="Available Stock"
            v-model="stock.stockQty"
            :readonly="!stock.manageInventory"
          />
        </div>
      </div>
      <FormsBaseSelect
        label="Allow Backorders"
        :options="[
          { key: 'allow', name: 'Allow' },
          { key: 'disallow', name: 'Do not allow' },
          { key: 'notify', name: 'Allow, but notify customer' },
        ]"
        v-model="product.allowBackorders"
      />
      <FormsBaseInput
        label="Low Stock Threshold"
        placeholder="Low stock Threshold"
        :required="true"
        v-model="product.lowStockThreshold"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>

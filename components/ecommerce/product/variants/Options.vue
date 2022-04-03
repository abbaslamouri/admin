<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
})

const { product } = useStore()

const getTermValue = (attributeId) => {
  const term = product.value.variants[props.index].attrTerms.find((t) => t && t.parent && t.parent._id == attributeId)
  return term ? term._id : null
}

const setAttributeTerm = async (termId, i) => {
  const term = product.value.attributes[i].terms.find((t) => t._id == termId)
  const k = product.value.variants[props.index].attrTerms.findIndex(
    (t) => t && t.parent && t.parent._id == product.value.attributes[i].attribute._id
  )
  if (k !== -1) {
    product.value.variants[props.index].attrTerms[k] = term
  } else {
    product.value.variants[props.index].attrTerms[i] = term
  }
}
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="details">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Variant Options</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div class="flex-row gap-2">
        <div class="flex-1" v-for="(attribute, i) in product.attributes" :key="attribute.attribute._id">
          <FormsBaseSelect
            :options="
              attribute.terms.map((t) => {
                return { key: t._id, name: t.name }
              })
            "
            :label="attribute.attribute.name"
            :nullOption="`Select ${attribute.attribute.name}`"
            @update:modelValue="setAttributeTerm($event, i)"
          />
        </div>
      </div>
      <div class="enabled">
        <FormsBaseToggle v-model="product.variants[index].enabled" label="Enabled" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>

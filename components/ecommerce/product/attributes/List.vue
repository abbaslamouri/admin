<script setup>
defineProps({
  allAttributes: {
    type: Array,
  },
})
const emit = defineEmits(['deleteAttribute', 'deleteTerm', 'deleteAllTerms'])

const { product } = useStore()

const showActionKeys = ref([])

const resetActions = () => {
  for (const prop in product.value.attributes) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}

const deleteAttribute = (attributeIndex) => {
  resetActions()
  emit('deleteAttribute', attributeIndex)
}
</script>

<template>
  <table class="text-xs shadow-md">
    <thead>
      <tr class="bg-slate-200 border border-b-stone-400 bg-stone-300">
        <th>ID</th>
        <th class="">Attribute</th>
        <th>Enable</th>
        <th>Variation</th>
        <th>Default Term</th>
        <th>Terms</th>
        <th class="text-right minw12">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border border-b-stone-400" v-for="(attribute, index) in product.attributes" :key="`attribute-${index}`">
        <td>
          <div class="bg-slate-200 p-1 br-3 ">{{ index + 1 }}</div>
        </td>
        <td>
          <EcommerceProductAttributesAttribute :attributeIndex="index" :allAttributes="allAttributes" />
        </td>
        <td class="">
          <FormsBaseToggle
            v-model="product.attributes[index].enabled"
            v-if="Object.keys(product.attributes[index].attribute).length"
          />
        </td>
        <td class="">
          <FormsBaseToggle
            v-model="product.attributes[index].variation"
            v-if="Object.keys(product.attributes[index].attribute).length && product.attributes[index].enabled"
          />
        </td>
        <td>
          <EcommerceProductAttributesDefaultTerm :attributeIndex="index" :allAttributes="allAttributes" />
        </td>
        <td>
          <EcommerceProductAttributesTerms
            :attributeIndex="index"
            :allAttributes="allAttributes"
            @deleteTerm="$emit('deleteTerm', $event)"
            @deleteAllTerms="$emit('deleteAllTerms', $event)"
          />
        </td>
        <td>
          <EcommerceActions
            :showAction="showActionKeys[index]"
            :showEdit="false"
            @moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
            @deleteAction="deleteAttribute(index)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped></style>

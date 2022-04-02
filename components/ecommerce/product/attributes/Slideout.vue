<script setup>
const props = defineProps({
  // product: {
  //   type: Object,
  // },
})
const emit = defineEmits(['saveAttributes', 'closeSlideout', 'updateAttributes'])
const { $fetchAll } = useNuxtApp()

const { product } = useStore()
// const { errorMsg, alert } = useFactory()
const { errorMsg, alert } = useAppState()
// const product.value.attributes([...props.product.attributes])

const attributeToDelteIndex = ref(null)
const attributeIndex = ref(null)
const termToDeleteId = ref(null)
const termsToDeleteAttrId = ref(null)

const { docs: allAttributes } = await $fetchAll('attributes', { fields: 'name,slug' })
// const { docs: allAttributeTerms } = await $fetchAll('attributeterms')
// const { data, pending, error } = await useFetch(`${config.API_URL}/attributeterms`, {})
// console.log(allAttributes)

// const allAttributes = (await $fetch(`/api/v1/attributes`, { fields: 'name, slug' })).docs
// const allAttributeTerms = (await $fetch(`/api/v1/attributeterms`, { fields: 'name, slug, parent' })).docs

// console.log(currentProduct)

const current = JSON.stringify(product.value.attributes)

const removeVariantByTermId = (termId) => {
  // let j = 0
  // while (j < store.variants.length) {
  //   const k = store.variants[j].attrTerms.findIndex((t) => t._id == termId)
  //   const countBefore = store.variants[j].attrTerms.length
  //   if (k !== -1) store.variants[j].attrTerms.splice(k, 1)
  //   const countAfter = store.variants[j].attrTerms.length
  //   if (countBefore != countAfter) store.variants[j].discard = true
  //   j++
  // }
  // store.variants = store.variants.filter((el) => !el.discard)
}

const insertEmptyAttribute = (attribute = {}, defaultTerm = {}, terms = []) => {
  if (product.value.attributes.length == allAttributes.length)
    return (errorMsg.value = 'You have used up all available attributes')
  console.log('here')
  product.value.attributes.push({
    attribute,
    terms,
    defaultTerm,
    enabled: true,
    variation: true,
  })
}

const addAllAttributes = () => {
  for (const prop in allAttributes) {
    const attribute = allAttributes[prop]
    const terms = allAttributes[prop].attributeterms
    const defaultTerm = allAttributes[prop].attributeterms[0]
    insertEmptyAttribute(attribute, defaultTerm, terms)
  }
}

const updateAttribute = (payload) => {
  const { attribute, newAttributeId } = payload
  console.log(payload)
  const index = product.value.attributes.findIndex((a) => a.attribute._id == newAttributeId)
  if (index !== -1) {
    product.value.attributes[index].attribute = attribute
    product.value.attributes[index].terms = []
    ;(product.value.attributes[index].defaultTerm = attribute), attributeterms[0]
    // emit('updateAttributes', product.value.attributes)
  }
}

const closeSlideout = () => {
  if (current !== JSON.stringify(product.value.attributes)) {
    showAlert(
      'You have unsaved changes',
      'Please save your changes before closing this window or click cancel to exit without saving.',
      'closeSlideout',
      false
    )
  } else {
    emit('closeSlideout')
  }
}

const showDeleteAllAttributesAlert = () => {
  showAlert(
    'Are you sure you want to delete all attributes',
    'You also have to delete all product variants associated with this attribute.',
    'deleteAllAttributes',
    true
  )
}

const saveAttributes = async () => {
  if (current == JSON.stringify(product.value.attributes)) return emit('closeSlideout')

  const newAttributes = []
  for (const prop in product.value.attributes) {
    if (!product.value.attributes[prop].attribute._id)
      return (errorMsg.value = `Please select a value for attribute ${prop * 1 + 1} `)
    if (!product.value.attributes[prop].terms.length)
      return (errorMsg.value = `Attributes must contain at least one term.  Please select a value for attribute ${
        prop * 1 + 1
      }`)

    newAttributes.push(product.value.attributes[prop])
  }
  product.value.attributes = newAttributes
  emit('saveAttributes')
  emit('closeSlideout')
}

const cancelAttributesUpdate = () => {
  product.value.attributes = JSON.parse(current)
  emit('closeSlideout')
}

const deleteAllAttributes = () => {
  product.value.attributes = []
  alert.value.show = false
  alert.value.action = ''
}

const showDeleteAttributeAlert = (attributeIndex) => {
  attributeToDelteIndex.value = attributeIndex
  showAlert(
    'Are you sure you want to delete this attribute?',
    'You also have to delete all product variants associated with this attribute.',
    'deleteAttribute',
    true
  )
}

const deleteAttribute = () => {
  product.value.attributes.splice(attributeToDelteIndex.value, 1)
  alert.value.show = false
  alert.value.action = ''
}

const handleAddTerm = (payload) => {
  const { attributeId, termId } = payload
  const index = product.value.attributes.findIndex((a) => a.attribute._id == attributeId)
  if (index !== -1) {
    const term = allAttributeTerms.find((t) => t._id == termId)
    if (term) {
      if (!product.value.attributes[index].terms.length) {
        product.value.attributes[index].terms = [term]
      } else {
        const i = product.value.attributes[index].terms.findIndex((t) => t._id == termId)
        if (i == -1) product.value.attributes[index].terms.push(term)
      }
    }
  }
}

const handleAddAllTerms = (attributeId) => {
  const index = product.value.attributes.findIndex((a) => a.attribute._id == attributeId)
  if (index !== -1) product.value.attributes[index].terms = allAttributeTerms.filter((t) => t.parent._id == attributeId)
}

const showdeleteTermAlert = (payload) => {
  console.log(payload)
  termToDeleteId.value = payload.termId
  attributeIndex.value = payload.attributeIndex
  showAlert(
    'Are you sure you want to delete this attribute term?',
    'You also have to delete all product variants associated with this attribute.',
    'deleteTerm',
    true
  )
}

const deleteTerm = async () => {
  const index = product.value.attributes[attributeIndex.value].terms.findIndex((t) => t._id == termToDeleteId.value)
  if (index !== -1) product.value.attributes[attributeIndex.value].terms.splice(index, 1)
  alert.value.show = false
  alert.value.action = ''
  attributeIndex.value = ''
  termToDeleteId.value = null

  // for (const prop in product.value.attributes) {
  //   const i = product.value.attributes[prop].terms.findIndex((t) => t._id == termToDeleteId.value)
  //   if (i !== -1) product.value.attributes[prop].terms.splice(i, 1)
  // }
  for (const prop in product.value.variants) {
    const term = product.value.variants[prop].attrTerms.find((t) => t._id == termToDeleteId.value)
    if (term) product.value.variants[prop].toDelete = true
  }
  product.value.variants = product.value.variants.filter((v) => !v.toDelete)
  // termToDeleteId.value = null
  // alert.value.show = false
  // alert.value.action = ''
}

const showDeleteAllTermsAlert = (payload) => {
  console.log(payload.attributeIndex)
  attributeIndex.value = payload.attributeIndex
  showAlert(
    'Are you sure you want to remove all terms associated with this attribute?',
    'You also have to delete all product variants associated with this attribute.',
    'deleteAllTerms',
    true
  )
}

const deleteAllTerms = () => {
  console.log(attributeIndex.value)
  product.value.attributes[attributeIndex.value].terms = []
  attributeIndex.value = ''
  alert.value.show = false
  alert.value.action = ''
}

const showAlert = (heading, paragraph, action, showCancelBtn) => {
  alert.value.heading = heading
  alert.value.paragraph = paragraph
  alert.value.action = action
  alert.value.showCancelBtn = showCancelBtn
  alert.value.show = true
}

watch(
  () => alert.value.show,
  (currentVal) => {
    if (currentVal === 'ok' && alert.value.action === 'closeSlideout') alert.value = false
    if (currentVal === 'ok' && alert.value.action === 'deleteAttribute') deleteAttribute()
    if (currentVal === 'ok' && alert.value.action === 'AllAttributes') deleteAllAttributes()
    if (currentVal === 'ok' && alert.value.action === 'deleteTerm') deleteTerm()
    if (currentVal === 'ok' && alert.value.action === 'deleteAllTerms') deleteAllTerms()
  }
  // { deep: true }
)
</script>

<!-- <template> -->
<!-- <Slideout class="attributes" @closeSlideout="closeSlideout">
    <template v-slot:header>
      <h3>Edit Attributes</h3>
    </template> -->
<template>
  <!-- <Slideout>
    <template v-slot:header>
      <h3>Edit Attributes</h3>
    </template>
  </Slideout> -->
  <div class="">
    <div class="fixed inset-0 w-100vw h-100vh z-9 bg-slate-400 opacity-90"></div>
    <div class="fixed top-0 right-0 h-100vh z-99 max-w-100">
      <div class="h-100vh flex-col justify-between gap-2 bg-slate-200">
        <div>
          <h3 class="bg-slate-300 p-1 flex-row">Edit Attributes</h3>
          <button><IconsClose /></button>
        </div>
        <div class="flex-1 border-red">
          <div class="flex-row items-center justify-between bg-slate-200 p-2">
            <h2>Attributes</h2>
            <div class="flex-row gap2">
              <button class="btn btn__primary py-05 px-2 text-xs" @click="insertEmptyAttribute()">Add Attribute</button>
              <button class="btn btn__primary py-05 px-2 text-xs" @click="addAllAttributes">Add All Attributes</button>
              <button class="btn btn__secondary py-05 px-2 text-xs" @click="showDeleteAllAttributesAlert">
                deleted All Attributes
              </button>
            </div>
          </div>
          <div>
            <EcommerceProductAttributesEmptyMsg v-if="!product.attributes.length" :allAttributes="allAttributes" />
            <EcommerceProductAttributesList
              v-else
              :allAttributes="allAttributes"
              @deleteAttribute="showDeleteAttributeAlert"
              @addTerm="handleAddTerm"
              @addAllTerms="handleAddAllTerms"
              @deleteTerm="showdeleteTermAlert"
              @deleteAllTerms="showDeleteAllTermsAlert"
              @updateAttribute="updateAttribute"
            />
          </div>
        </div>
        <div class="flex-row items-center justify-end gap2">
          <button class="btn btn_secondary py05 px3" @click.prevent="cancelAttributesUpdate">Cancel</button>
          <button
            class="btn btn__primary py05 px3"
            :class="{ disabled: current == JSON.stringify(product.attributes) }"
            @click.prevent="saveAttributes"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- <template v-slot:footer>
      <div class="flex-row items-center justify-end gap2">
        <button class="btn btn_secondary py05 px3" @click.prevent="cancelAttributesUpdate">Cancel</button>
        <button
          class="btn btn__primary py05 px3"
          :class="{ disabled: current == JSON.stringify(product.attributes) }"
          @click.prevent="saveAttributes"
        >
          Save Changes
        </button>
      </div>
    </template>
  </Slideout> -->
<!-- </template> -->

<style lang="scss" scoped></style>

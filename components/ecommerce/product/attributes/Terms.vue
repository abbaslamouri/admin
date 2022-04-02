<script setup>
const props = defineProps({
  attributeIndex: {
    type: Number,
  },
  allAttributes: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['deleteTerm', 'deleteAllTerms'])

const { product } = useStore()
const { alert } = useAppState()

const termSelectId = ref('')
const termToDeleteId = ref('')

const handleAddTerm = () => {
  const index = product.value.attributes[props.attributeIndex].terms.findIndex((t) => t._id == termSelectId.value)
  if (index === -1)
    product.value.attributes[props.attributeIndex].terms.push(
      product.value.attributes[props.attributeIndex].attribute.attributeterms.find((t) => t._id == termSelectId.value)
    )
}

const deleteTerm = (termId) => {
  emit('deleteTerm', { attributeIndex: props.attributeIndex, termId })
}

const deleteAllTerms = () => {
  emit('deleteAllTerms', { attributeIndex: props.attributeIndex })
}

// const showDeleteAllTermsAlert = () => {
//   showAlert(
//     'Are you sure you want to remove All attribute terms ?',
//     'You will have to manually delete any product variants containing this term.',
//     'deleteAllTerms',
//     true
//   )
// }

// const deleteAllTerms = () => {
//   console.log(props.attributeIndex)
//   product.value.attributes[props.attributeIndex].terms = []
//   alert.value.show = false
//   alert.value.action = ''
// }

// const showDeleteTermAlert = (termId) => {
//   termToDeleteId.value = termId
//   showAlert(
//     'Are you sure you want to remove this attribute term ?',
//     'You will have to manually delete any product variants containing this term.',
//     'deleteTerm',
//     true
//   )
// }

const deleteTermold = () => {
  const index = product.value.attributes[props.attributeIndex].terms.findIndex((t) => t._id == termToDeleteId.value)
  if (index !== -1) product.value.attributes[props.attributeIndex].terms.splice(index, 1)
  alert.value.show = false
  alert.value.action = ''
  termToDeleteId.value = null
}

// const showAlert = (heading, paragraph, action, showCancelBtn) => {
//   alert.value.heading = heading
//   alert.value.paragraph = paragraph
//   alert.value.action = action
//   alert.value.showCancelBtn = showCancelBtn
//   alert.value.show = true
// }

// watch(
//   () => alert.value.show,
//   (currentVal) => {
//     if (currentVal === 'ok' && alert.value.action === 'deleteTerm') deleteTerm()
//     if (currentVal === 'ok' && alert.value.action === 'deleteAllTerms') deleteAllTerms()
//   }
//   // { deep: true }
// )
</script>

<template>
  <div>
    <div
      v-if="Object.keys(product.attributes[attributeIndex].attribute).length"
      class="terms flex-row gap1 border border-slate-300 p1 br3 text-xs"
    >
      <div class="term-actions flex-col justify-center gap05">
        <button
          class="text-xs border bg-slate-400 text-slate-50 px1 py02 br3 cursor-pointer"
          @click.prevent="
            product.attributes[attributeIndex].terms = [...product.attributes[attributeIndex].attribute.attributeterms]
          "
          v-if="
            product.attributes[attributeIndex].terms.length !=
            product.attributes[attributeIndex].attribute.attributeterms.length
          "
        >
          Select All
        </button>

        <button
          class="text-xs minw12 border bg-slate-400 text-slate-50 px1 py02 br3 cursor-pointer"
          @click.prevent="deleteAllTerms"
          v-if="product.attributes[attributeIndex].terms.length"
        >
          Select None
        </button>

        <div
          class="border border-slate-400 py02 px05 br3"
          v-if="
            product.attributes[attributeIndex].terms.length !=
            product.attributes[attributeIndex].attribute.attributeterms.length
          "
        >
          <select v-model="termSelectId" @change="handleAddTerm" class="w-full text-xs">
            <option value="">Add term</option>
            <option
              v-for="term in product.attributes[attributeIndex].attribute.attributeterms"
              :key="term._id"
              :value="term._id"
              :disabled="product.attributes[attributeIndex].terms.find((t) => t._id == term._id)"
            >
              {{ term.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="border border-slate-300 minw12 br3 py05">
        <div class="list flex-row items-center gap05 wrap p1" v-if="product.attributes[attributeIndex].terms.length">
          <div
            v-if="product.attributes[attributeIndex].terms.length"
            class="shadow-md flex-row items-cdenter gap05 bg-slate-500 text-slate-50 py02 px05 br3"
            v-for="term in product.attributes[attributeIndex].terms"
            :key="term._id"
          >
            <span>{{ term.name }}</span>
            <span class="cursor-pointer" @click="deleteTerm(term._id)">
              <IconsClose class="w1 h1 fill-slate-50" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

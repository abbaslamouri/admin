<script setup>
import slugify from 'slugify'

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  showAction: {
    type: Boolean,
  },
})

const emit = defineEmits(['setActions', 'attributeUpdated', 'deleteAttribute', 'deleteTerm'])
const config = useRuntimeConfig()
const { message, errorMsg, alert } = useAppState()
const newTerm = ref(null)
const termInputRef = ref(null)
const newAttribute = reactive({
  ...props.attribute,
})

const addAttribute = async () => {
  console.log(newAttribute)
  errorMsg.value = ''
  message.value = ''
  try {
    const { data, pending, error } = await useFetch(`${config.API_URL}/attributes`, {
      method: 'POST',
      body: newAttribute,
    })
    if (error.value) throw error.value
    emit('attributeUpdated', data.value.doc)
  } catch (err) {
    console.log('ERRRRR', err)
    errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
  }
}

const addAttributeTerm = async () => {
  errorMsg.value = ''
  message.value = ''
  try {
    if (!props.attribute._id) return (errorMsg.value = 'Attribute is required')
    const termSlug = slugify(newTerm.value, { lower: true })
    if (props.attribute.attributeterms.find((t) => t.slug === termSlug))
      return (errorMsg.value = 'Terms must be unique for each attribute')
    const { data, pending, error } = await useFetch(`${config.API_URL}/attributeterms`, {
      method: 'POST',
      body: { name: newTerm.value, slug: termSlug, parent: props.attribute._id },
    })
    console.log('DATA', data.value)
    if (error.value) throw error.value
    newTerm.value = ''
    emit('attributeUpdated')
    console.log(data.value.doc)
  } catch (err) {
    console.log('ERRRRRRRR', err)
    errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
  }

}
</script>

<template>
  <tr class="admin-attribute row">
    <td>{{ newAttribute.sortOrder }}</td>
    <td class="max-w-10">
      <div class="base-input">
        <input type="text" required v-model="newAttribute.name" @keyup.enter="addAttribute" />
      </div>
    </td>
    <td>
      <div class="attribute-terms flex-row wrap items-center gap-05" @click="termInputFocus" v-show="attribute._id">
        <div
          class="flex-row gap-05 border border-slate-300 br-3 text-sm items-center py-02 px-05 text-slate-50 bg-slate-500"
          v-for="(term, j) in attribute.attributeterms"
          :key="term"
        >
          <span>{{ term.name }}</span>
          <button class="btn btn__secondary">
            <IconsClose class="w-1 h-1 fill-slate-50" @click="$emit('deleteTerm', term._id)" />
          </button>
        </div>
        <div class="form-group" @click="checkIfAttribute">
          <input
            class="py-02 px-1"
            ref="termInputRef"
            type="text"
            v-model="newTerm"
            placeholder="Attribute Term"
            :disabled="newAttribute.name == ''"
            @keyup.enter="addAttributeTerm"
            @focus="termInputRef.closest('.attribute-terms').classList.add('selected')"
          />
        </div>
      </div>
    </td>
    <td class="minw12">
      <EcommerceActions
        :showAction="showAction"
        @moreHoriz="$emit('setActions', { index: index, action: !showAction })"
        @deleteAction="$emit('deleteAttribute', attribute._id)"
        @cancel="$emit('setActions', { index: index, action: false })"
      />
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

td {
  border-bottom: 1px solid $stone-300;
  padding: 2rem;
}
</style>

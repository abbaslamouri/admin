<script setup>
// const prodState = inject('prodState')

defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  nullOption: {
    type: String,
    defualt: 'Select Option',
  },
  hint: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const errorMsg = ref('')
const uuid = useUniqueId().getId()
const selectRef = ref('inputRef')
const showDropdown = ref(false)

if (process.client) {
  document.addEventListener('click', (event) => {
    if (!event.target.closest(`.base-select-${uuid}`)) showDropdown.value = false
  })
}

const handleChange = (event) => {
  console.log(event.target.value)
}

const handleMousedown = (event) => {
  showDropdown.value = true
}

const handleSelect = (event) => {
  console.log('BS', event.target.getAttribute('data-selectedOption'))
  emit('update:modelValue', event.target.getAttribute('data-selectedOption'))
  showDropdown.value = false
}
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label :class="`base-select base-select-${uuid}`" v-if="label" :for="`base-select-${uuid}`" @change="handleChange">
    <div class="label text-xs px-1">{{ label }}</div>

    <select
      ref="selectRef"
      :value="modelValue"
      :class="`base-select-${uuid}`"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="typeof $attrs.readonly != undefined ? true : null"
      :aria-required="typeof $attrs.required != undefined ? true : null"
      @mousedown.prevent="handleMousedown"
    >
      <option value="">{{ nullOption }}</option>
      <option
        v-for="option in options"
        :key="option.key"
        :value="option.key"
        :selected="modelValue === option.key"
        :disabled="option.disabled || option.disabledIf"
      >
        {{ option.name }}
      </option>
    </select>
    <ul v-show="showDropdown" @click.stop="handleSelect">
      <li v-for="option in options" :key="option.key" :disabled="option.disabled" :data-selectedOption="option.key">
        {{ option.name }}
      </li>
    </ul>
  </label>
</template>

<style lang="scss" scoped></style>

<template>
  <button @click="handleError">Clear errors</button>

  {{ error.message }}
</template>

<script setup>
const props = defineProps({
  error: Object,
})

const handleError = () => clearError({ redirect: '/' })

console.log('ERROR PAGE', props.error)
</script>

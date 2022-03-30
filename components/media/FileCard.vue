<script setup>
defineProps({
  file: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    class="card relative cursor-pointer flex-col items-center justify-center h-16 w-16 p-2"
    @mouseenter="$event.target.classList.add('hovered')"
    @mouseleave="$event.target.classList.remove('hovered')"
  >
    <img v-if="file.mimetype && file.mimetype.includes('image')" class="w-full h-full contain" :src="`${file.path}`" />
    <IconsPdf v-else-if="file.mimetype && file.mimetype.includes('pdf')" class="w-full h-full" />
    <div class="tooltip absolute top--05 left-50-per p-1 br-3 text-xs">{{ file.name }}</div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.card {
  .tooltip {
    transform: translate(-50%, -100%);
    background-color: $slate-600;
    display: grid;
    grid-template-columns: minmax(max-content, 40rem);
    color: white;
    opacity: 0;
    visibility: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: $slate-600 transparent transparent transparent;
    }
  }

  &.hovered {
    background-color: $slate-500;

    img {
      opacity: 0.5;
    }

    .tooltip {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>

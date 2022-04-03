<script setup>
defineProps({
  outerBoxWidth: {
    type: Number,
    default: 75,
  },
  outerBoxHeight: {
    type: Number,
    default: 40,
  },
  showOkBtn: {
    type: Boolean,
    default: true,
  },
  showCancelBtn: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['cancel', 'ok'])
</script>

<template>
  <div class="text-sm">
    <div class="bg-slate-900 fixed w-100vw h-100vh inset-0 z-99 opacity-80"></div>
    <div class="w-100vw h-100vh z-999 fixed inset-0 flex-row items-center justify-center" @click.self="$emit('cancel')">
      <div
        class="fixed flex-col gap-2 items-center justify-center p-2 bg-stone-200 br-5 shadow-md oveflow-auto"
        :style="{ width: `${outerBoxWidth}%`, 'min-height': `${outerBoxHeight}%` }"
      >
        <header><IconsError class="w-10 h-10 fill-yellow-500" /></header>
        <main class="flex-col items-center gap-2 p-2">
          <slot></slot>
        </main>
        <footer class="flex-row items-center gap-1">
          <button class="btn btn__secondary px-2 py-1" @click.prevent="$emit('cancel')" v-if="showCancelBtn">
            Cancel
          </button>
          <button class="btn btn__primary px-2 py-1" @click.prevent="$emit('ok')" v-if="showOkBtn">OK</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

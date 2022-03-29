<script setup>
defineProps({
  folders: {
    type: Array,
  },
  selectedFolder: {
    type: Object,
  },
})
defineEmits(['folderSelected'])
</script>

<template>
  <div class="flex-row gap-2 wrap" v-if="folders.length">
    <button
      class="btn btn__folder text-xs"
      :class="{ selected: !selectedFolder || !selectedFolder._id }"
      @click="$emit('folderSelected', {})"
    >
      <IconsFolder />
      <span>All</span>
    </button>
    <button
      class="btn btn__folder text-xs"
      v-for="folder in folders"
      :key="folder._id"
      :class="{ selected: selectedFolder && selectedFolder._id === folder._id }"
      @click="$emit('folderSelected', folder)"
    >
      <IconsFolder />
      <span>{{ folder.name }}</span>
    </button>
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/scss/variables';

.btn {
  &.selected {
    background-color: $slate-400;
    color: $slate-50;

    svg {
      fill: $slate-50;
    }
  }
}
</style>

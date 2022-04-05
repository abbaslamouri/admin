<script setup>
defineProps({
  folders: {
    type: Array,
  },
  selectedMedia: {
    type: Array,
  },
  selectedFolder: {
    type: Object,
  },
  sort: {
    type: Object,
  },
  // mediaSortOrder: {
  //   type: String,
  // },
  sortOptions: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits([
  'fileUploadBtnClicked',
  'toggleSort',
  'moveMediaToFolder',
  'deleteMedia',
  'searchKeywordSelected',
  'deleteMediaBtnClicked',
])

// const keyword = ref(null)
const moveToFolderId = ref('')
const showMediaMoveAlert = ref(false)
// const showMediaDeleteAlert = ref(false)

const handleMoveMedia = async () => {
  showMediaMoveAlert.value = false
  emit('moveMediaToFolder', moveToFolderId.value)
  moveToFolderId.value = ''
}
</script>

<template>
  <div class="bg-white shadow-md">
    <div class="flex-row items-center justify-between gap-2 px-1 py-2 border-b-stone-300 text-xs">
      <button class="btn btn__new-media gap-1 min-w-16" @click="$emit('fileUploadBtnClicked')">
        <IconsUpload />
        <span>Upload Files</span>
      </button>
      <div class="">
        <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="$emit('toggleSort', $event)" />
      </div>
      <div class="flex-row items-center gap-2 min-w-60">
        <div class="min-w-20" v-if="selectedMedia.length">
          <FormsBaseSelect
            v-model="moveToFolderId"
            label="Move Selected To Folder"
            :options="
              folders
                .filter((f) => f._id != selectedFolder._id)
                .map((f) => {
                  return { key: f._id, name: f.name }
                })
            "
            nullOption="Select Folder"
            @update:modelValue="handleMoveMedia"
          />
        </div>
        <button class="btn" v-if="selectedMedia.length" @click="$emit('deleteMediaBtnClicked')">
          <IconsDeleteFill class="fill-red-600" />
        </button>
      </div>
    </div>
    <div class="px-2 py-1">
      <Search @searchKeywordSelected="$emit('searchKeywordSelected', $event)" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

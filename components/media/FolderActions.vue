<script setup>
import slugify from 'slugify'
const config = useRuntimeConfig()

const props = defineProps({
  media: {
    type: Array,
  },
  sortOptions: {
    type: Array,
    required: true,
  },
  sort: {
    type: Object,
  },
  selectedFolder: {
    type: Object,
  },
})

const emit = defineEmits(['folderSaved', 'toggleSort', 'deleteFolder'])

const { message, errorMsg, alert } = useAppState()
const showForm = ref(false)
// const folderToDelete = ref(null)
const newFolder = ref({})

const editFolder = () => {
  newFolder.value.name = props.selectedFolder.name
  newFolder.value._id = props.selectedFolder._id
  showForm.value = true
}

const cancelEditFolder = () => {
  newFolder.value = {}
  showForm.value = false
}

const saveNewFolder = async () => {
  errorMsg.value = null
  message.value = null
  try {
    newFolder.value.slug = slugify(newFolder.value.name, { lower: true })
    if (newFolder.value._id) {
      const { data, pending, error } = await useFetch(`${config.API_URL}/media/folders/${newFolder.value._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: newFolder.value,
      })
      if (error.value) throw error.value
      console.log(data.value)
      emit('folderSaved', data.value.doc)
    } else {
      const { data, pending, error } = await useFetch(`${config.API_URL}/media/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newFolder.value,
      })
      if (error.value) throw error.value
      console.log(data.value)
      emit('folderSaved', data.value.doc)
    }
    showForm.value = false
    newFolder.value = {}
  } catch (err) {
    errorMsg.value = err.data.message
  }
}
</script>

<template>
  <div class="flex-row items-center justify-between">
    <div class="flex-row items-center gap-2">
      <button class="btn btn__new-media gap-1 text-xs" @click="showForm = true">
        <IconsFolderPlus />
        <span> New Folder </span>
      </button>
      <transition name="folder-form">
        <form class="flex-row items-center gap-2" v-if="showForm" @submit.prevent="saveNewFolder">
          <FormsBaseInput type="text" label="Folder" placeholder="Folder" v-model="newFolder.name" />
          <div class="flex-row gap-1">
            <button class="btn btn__primary py-05 px-1" type="submit">OK</button>
            <button class="btn btn__secondary py-05 px-1" @click.prevent="cancelEditFolder">Cancel</button>
          </div>
        </form>
      </transition>
    </div>
    <div class="text-sm flex-row gap-3">
      <div class="flex-row items-center">
        <!-- <span>Sort Order</span> -->
        <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="$emit('toggleSort', $event)" />
        <!-- <button class="btn">
          <IconsSouth class="w-2 h-2 fill-sky-600" v-if="folderSortOrder == '-'" />
          <IconsNorth class="w-2 h-2 fill-sky-600" v-else />
        </button> -->
      </div>
      <div class="flex-row items-center gap-1" v-if="selectedFolder._id">
        <button class="btn" @click="editFolder">
          <IconsEditFill class="fill-green-800" />
        </button>
        <button class="btn" @click="$emit('deleteFolder')">
          <IconsDeleteFill class="fill-red-600" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

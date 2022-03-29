<script setup>
const config = useRuntimeConfig()
const { message, errorMsg, alert, showModal } = useAppState()
const selectedMedia = ref([])
const media = ref([])
const mediaTotalCount = ref(0)
const folders = ref([])
const selectedFolder = ref({})
const page = ref(1)
const perPage = ref(4)
const folderSortField = ref('name')
const folderSortOrder = ref('')
const mediaSortField = ref('name')
const mediaSortOrder = ref('-')
const keyword = ref('')
const showDropZone = ref(false)
const ulploadItems = ref([])

const pages = computed(() =>
  mediaTotalCount.value % perPage.value
    ? parseInt(mediaTotalCount.value / perPage.value) + 1
    : parseInt(mediaTotalCount.value / perPage.value)
)

const overallFileUploadProgress = computed(() => {
  let sum = 0
  for (const prop in ulploadItems.value) {
    sum = sum + ulploadItems.value[prop].progress
  }
  return ulploadItems.value.length ? sum / ulploadItems.value.length : 0
})

const fetchFolders = async () => {
  errorMsg.value = null
  message.value = null
  try {
    const { data, pending, error } = await useFetch(`${config.BASE_URL}/${config.API_BASE}/media/folders`, {
      params: {
        fields: 'name, slug, path',
        sort: `${folderSortOrder.value}${folderSortField.value}`,
      },
    })
    if (error.value) throw error.value
    console.log(data.value)
    folders.value = data.value.docs
  } catch (err) {
    console.log(err.data)
    // errorMsg.value = err.data.message
  }
}

const fetchMedia = async () => {
  errorMsg.value = null
  message.value = null
  try {
    const { data, pending, error } = await useFetch(`${config.BASE_URL}/${config.API_BASE}/media/`, {
      params: {
        fields: 'name, slug, folder, path, url, mimetype',
        page: page.value,
        limit: perPage.value,
        sort: `${mediaSortOrder.value}${mediaSortField.value}`,
        keyword: keyword.value,
        folder: selectedFolder.value._id,
      },
    })
    if (error.value) throw error.value
    console.log(data.value)
    media.value = data.value.docs
    mediaTotalCount.value = data.value.totalCount
  } catch (err) {
    console.log(err)
    // errorMsg.value = err.data.message
  }
}

await fetchFolders()
await fetchMedia()

// const { data, pending, error } = await useFetch(`${config.BASE_URL}/${config.API_BASE}/media/`, {
//   params: {
//     fields: 'name, slug, path',
//     sort: `${folderSortOrder.value}${folderSortField.value}`,
//   },
// })
// if (error.value) errorMsg.value = error.value.data.message
// else folders.value = data.value.docs

// const fetchMedia = async () => {
//   errorMsg = null
//   try {
//     let params = {}
//     if (Object.values(selectedFolder.value).length) {
//       params = { ...mediaParams.value, folder: selectedFolder.value._id }
//     } else {
//       params = { ...mediaParams.value }
//     }
//     const response = await $fetch('/api/v1/media', { params })
//     media.value = response.docs
//     mediaCount.value = response.count
//   } catch (error) {
//     errorMsg = error.data
//   }
// }

// // Fetch folders
// try {
//   errorMsg = null
//   folders.value = await $fetch('/api/v1/folders', { params: folderParams.value })
// } catch (error) {
//   errorMsg = error.data
// }

// //Fetch media
// await fetchMedia()

// Handles upload button click
const handleFileUploadBtnClicked = () => {
  if (!selectedFolder.value._id) errorMsg.value = 'Please selecet a folder'
  else showDropZone.value = !showDropZone.value
}

// Handles meia upload
const handleUplodItemsSelected = async (files) => {
  showModal.value = true
  showDropZone.value = false
  errorMsg.value = ''
  message.value = ''
  ulploadItems.value = []

  for (const prop in Array.from(files)) {
    ulploadItems.value[prop] = {}
    ulploadItems.value[prop].name = files[prop].name
    ulploadItems.value[prop].mimetype = files[prop].type
    ulploadItems.value[prop].size = files[prop].size
    ulploadItems.value[prop].status = 'uploading'
    ulploadItems.value[prop].progress = 0
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${config.BASE_URL}/${config.API_BASE}/media`, true)
    xhr.responseType = 'json'
    // xhr.setRequestHeader('Content-Type', 'application/json')

    const formData = new FormData()
    formData.append('file', files[prop], files[prop].name)
    formData.append('folder', selectedFolder.value._id)

    xhr.onerror = (error) => {
      // console.log(error)
      errorMsg.value += `${error.message}<br>`
    }

    xhr.upload.onprogress = (event) => {
      if (ulploadItems.value[prop].status === 'cancelled' || ulploadItems.value[prop].status === 'failed') {
        xhr.abort()
      } else {
        ulploadItems.value[prop].progress = (100 * event.loaded) / event.total
      }
    }
    xhr.onload = () => {
      console.log(xhr.response)

      if (xhr.response.status === 'fail') {
        // errorMsg.value += `${xhr.response.message}<br>`
        if (xhr.response.errorCode == 'not-unique') ulploadItems.value[prop].status = 'duplicate'
        else ulploadItems.value[prop].status = 'failed'
        // ulploadItems.value[prop].progress = 100
        // uploadErrorMessage.value = uploadErrorMessage.value + xhr.response.message
        xhr.abort()
      } else {
        ulploadItems.value[prop].status = 'complete'
        // ulploadItems.value[prop].progress = 100
        // message.value = 'Upload Completed'
      }
    }

    xhr.send(formData)
  }
  // if (uploadErrorMessage.value) errorMsg.value = uploadErrorMessage.value
}

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchMedia()
}

const handleSelectFolder = async (folder) => {
  selectedFolder.value = folder
  page.value = 1
  await fetchMedia()
}

//save folder
const handleFolderSaved = async (folder) => {
  const index = folders.value.findIndex((f) => f._id == folder._id)
  if (index !== -1) folders.value.splice(index, 1, folder)
  else folders.value.push(folder)
}

// Delete folder
const handleFolderDeleted = async () => {
  const index = folders.value.findIndex((f) => f._id == selectedFolder.value._id)
  if (index !== -1) folders.value.splice(index, 1)
  selectedFolder.value = {}
  // await fetchMedia()
}

// Toggle folder sort
const toggleFolderSortOrder = async () => {
  folderSortOrder.value = folderSortOrder.value == '-' ? `` : `-`
  await fetchFolders()
}

// Toggle media sort
const toggleMediaSort = async (event) => {
  mediaSortField.value = event.field
  mediaSortOrder.value = event.order
  await fetchMedia()
}

// Add file to selected media
const addToSelectedMedia = (file) => {
  const index = media.value.findIndex((m) => m._id == file._id)
  if (index !== -1 && !selectedMedia.value.find((m) => m._id == file._id)) selectedMedia.value.push(file)
}

// Remove file from selected media
const removeFromSelectedMedia = (file) => {
  const index = selectedMedia.value.findIndex((m) => m._id == file._id)
  if (index !== -1) selectedMedia.value.splice(index, 1)
}

// // Delete media
const deleteMedia = async () => {
  errorMsg.value = ''
  message.value = ''
  console.log(selectedMedia.value)
  await Promise.all(
    selectedMedia.value.map(async (item) => {
      const { data, pending, error } = await useFetch(`${config.BASE_URL}/${config.API_BASE}/media/${item._id}`, {
        method: 'DELETE',
      })
      if (error.value) console.log(error.value.data)
      if (error.value) errorMsg.value += `${error.value.data.message}<br>`
      else message.value += `${item.name} deleted.<br>`
    })
  )
  selectedMedia.value = []
  alert.value.show = false
  await fetchMedia()
}

// // Move media to a different folder
const handleMoveMediaToFolder = async (event) => {
  //   errorMsg = null
  //   const index = folders.value.findIndex((f) => f._id == event)
  //   if (index != -1) {
  //     await Promise.all(
  //       selectedMedia.value.map(async (item) => {
  //         try {
  //           const response = await $fetch(`/api/v1/media`, {
  //             method: 'PATCH',
  //             params: { id: item._id },
  //             body: { folder: event },
  //           })
  //           // console.log(response)
  //         } catch (err) {
  //           // console.error('MyERROR', err)
  //           errorMsg = err.data
  //         }
  //       })
  //     )
  //     selectedFolder.value = folders.value.find((f) => f._id == event)
  //     await fetchMedia()
  //     selectedMedia.value = []
  //   }
}

const showMediaDeleteAlert = async () => {
  // folderToDelete.value = props.selectedFolder
  showAlert('Are you sure you want to delete these files?', '', 'deleteMedia', true)
}

const handleSearch = async (event) => {
  page.value = 1
  keyword.value = event
  // await fetchMedia()
}

// const setSelectedMedia = () => {
//   galleryMedia.value = selectedMedia.value
//   showMediaSelector.value = false
// }

const handleCloseUploadModal = async () => {
  await fetchMedia()
  showModal.value = false
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
    if (currentVal === 'ok' && alert.value.action === 'deleteMedia') deleteMedia()
  }
)
</script>

<template>
  <div class="media-uploader">
    <div class="top shadow-md">
      <h3 class="title">Media</h3>
      <div class="folders flex-col gap-2 p-2 border-b-stone-300">
        <div class="folder__actions">
          <MediaFolderActions
            :selectedFolder="selectedFolder"
            :media="media"
            :folderSortOrder="folderSortOrder"
            @folderSelected="selectedFolder = $event"
            @folderSaved="handleFolderSaved"
            @folderDeleted="handleFolderDeleted"
            @toggleFolderSortOrder="toggleFolderSortOrder"
          />
        </div>
        <div class="forlder__list">
          <MediaFolderList
            v-if="folders.length"
            :folders="folders"
            :selectedFolder="selectedFolder"
            @folderSelected="handleSelectFolder"
          />
        </div>
      </div>
      <div class="file-actions">
        <MediaFileActions
          :folders="folders"
          :selectedMedia="selectedMedia"
          :selectedFolder="selectedFolder"
          :mediaSortField="mediaSortField"
          :mediaSortOrder="mediaSortOrder"
          @toggleMediaSort="toggleMediaSort"
          @fileUploadBtnClicked="handleFileUploadBtnClicked"
          @moveMediaToFolder="handleMoveMediaToFolder"
          @deleteMediaBtnClicked="showMediaDeleteAlert"
          @searchKeywordSelected="handleSearch"
        />
        <transition name="dropZone">
          <MediaDropZone
            v-show="showDropZone"
            :selectedFolder="selectedFolder"
            @fileUploadBtnClicked="handleFileUploadBtnClicked"
            @uploadItemsSelected="handleUplodItemsSelected"
          />
        </transition>
      </div>
    </div>
    <div class="bottom shadow-md">
      <MediaFileList
        :media="media"
        :selectedMedia="selectedMedia"
        :selectedFolder="selectedFolder"
        @addToSelectedMedia="addToSelectedMedia"
        @removeFromSelectedMedia="removeFromSelectedMedia"
      />
      <div class="pagination">
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
      </div>
    </div>
    <div v-if="showModal">
      <Modal @closeModal="showModal = false">
        <template #header>
          <h3 class="modal-header">File Upload Progress</h3>
          <div>{{ Math.round(overallFileUploadProgress) }}%</div>
        </template>
        <template #default>
          <div class="modal-content">
            <div class="flex-row justify-between items-center" v-for="(file, index) in ulploadItems" :key="file.name">
              <div>
                <span>{{ file.name }}</span
                ><span>({{ file.status }})</span>
              </div>
              <div class="flex-row gap-2 items-center">
                <span> {{ Math.round(file.progress) }}% </span>
                <IconsProgressRing :progress="file.progress" />
              </div>
              <button
                class="btn btn__primary px-1 py-05"
                v-if="file.progress < 100"
                @click="ulploadItems[index].status = 'cancelled'"
              >
                Cancel
              </button>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="modal-footer flex-row justify-end px-3 py-1">
            <button
              class="btn btn__primary px-2 py-05"
              v-if="overallFileUploadProgress == 100"
              @click="handleCloseUploadModal"
            >
              Close
            </button>
          </div>
        </template>
      </Modal>
    </div>
    <!-- <div class="actions" v-if="route.name !== 'admin-media'">
      <button class="btn btn-secondary cancel" @click="$emit('mediaSelectCancel')">Cancel</button>
      <button class="btn btn-primary" @click="setSelectedMedia">Select</button>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.media-uploader {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .top {
    .title {
      background-color: $slate-300;
      padding: 1rem;
      text-align: center;
    }

    .folders {
      // display: flex;
      // flex-direction: column;
      // gap: 1rem;
      // border-bottom: 1px solid $slate-400;
      // padding: 2rem;

      .folder-actions {
        display: flex;
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    background-color: $slate-50;
    flex: 1;
    overflow-y: auto;
    padding: 0 0 2rem 0;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0 4rem;
    // border: 5px solid teal;
    background-color: $slate-50;
    padding: 1rem 3rem;
    background-color: $slate-300;

    .btn {
      font-size: 1.2rem;
      padding: 1rem 2rem;

      &.cancel {
        border: none;
      }
    }
  }
}
</style>

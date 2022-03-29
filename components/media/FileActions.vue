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
		mediaSortField: {
			type: String,
		},
		mediaSortOrder: {
			type: String,
		},
	})
	const emit = defineEmits([
		'fileUploadBtnClicked',
		'toggleMediaSort',
		'moveMediaToFolder',
		'deleteMedia',
		'searchKeywordSelected',
		'deleteMediaBtnClicked',
	])

	const keyword = ref(null)
	const moveToFolderId = ref('')
	const showMediaMoveAlert = ref(false)
	const showMediaDeleteAlert = ref(false)

	const handleMoveMedia = async () => {
		showMediaMoveAlert.value = false
		emit('moveMediaToFolder', moveToFolderId.value)
		moveToFolderId.value = ''
	}

	const handleDeleteMedia = async () => {
		showMediaDeleteAlert.value = false
		emit('deleteMedia')
	}

	const handleCancelMoveMedia = async () => {
		showMediaMoveAlert.value = false
		moveToFolderId.value = ''
	}

	const clearKeyword = async () => {
		emit('searchKeywordSelected', '')
		keyword.value = ''
		// showMediaMoveAlert.value = false
		// moveToFolderId.value = ''
	}
</script>

<template>
	<div class="file-actions flex-row items-center justify-between px-1 py-2 border-b-stone-300">
		<button class="btn btn__new-media gap-1 min-w-9" @click="$emit('fileUploadBtnClicked')">
			<IconsUpload />
			<span>Upload Files</span>
		</button>
		<div class="search-sort flex-row gap-2 items-center">
			<div class="min-w-20">
				<Search @searchKeywordSelected="$emit('searchKeywordSelected', $event)" />
			</div>
			<div class="sort">
				<MediaSort
					:mediaSortField="mediaSortField"
					:mediaSortOrder="mediaSortOrder"
					@toggleMediaSort="$emit('toggleMediaSort', $event)"
				/>
			</div>
		</div>
		<div class="flex-row items-center gap-2">
			<div class="">
				<div class="" v-if="selectedMedia.length">
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

					<!-- <select v-model="moveToFolderId" @change="showMediaMoveAlert = true">
            <option value="">Select Folder</option>
            <option
              v-for="option in folders.filter((f) => f._id != selectedFolder._id)"
              :key="option._id"
              :value="option._id"
            >
              {{ option.name }}
            </option>
          </select> -->
					<!-- <label>Move To Folder</label> -->
				</div>
			</div>
			<button class="btn" v-if="selectedMedia.length" @click="$emit('deleteMediaBtnClicked')">
				<IconsDeleteFill class="fill-red-600" />
			</button>
		</div>
		<!-- <Alert v-if="showMediaMoveAlert" @ok="handleMoveMedia" @cancel="handleCancelMoveMedia">
      <h3>
        `Are you sure you want to move these files to folder
        <span>{{ folders.find((f) => f._id === moveToFolderId).name }}</span> ?`
      </h3>
    </Alert> -->
		<!-- <Alert v-if="showMediaDeleteAlert" @ok="handleDeleteMedia" @cancel="showMediaDeleteAlert = false">
      <h3>Are you sure you want to delete these files?</h3>
      <p>Your will not be able to recover these files.</p>
    </Alert> -->
	</div>
</template>

<style lang="scss" scoped></style>

<script setup>
	useMeta({
		title: 'Attributes | YRL',
	})
	definePageMeta({
		layout: 'admin',
	})

	// const { fetchAll } = useFactory()
	const config = useRuntimeConfig()
	const { errorMsg, message } = useAppState()

	const showActionKeys = ref([])
	const attributes = ref([])
	const attributeTerms = ref([])
	// const count = ref(null) // item count taking into account params
	const totalCount = ref(null) // Total item count in the database
	const keyword = ref(null)
	const page = ref(1)
	const perPage = ref(10)
	const sortField = ref('createdAt')
	const sortOrder = ref('')
	const sort = reactive({
		field: 'sortOrder',
		order: '',
	})

	const fields = '-updatedAt'
	const sortOptions = [
		{ key: 'sortOrder', name: 'Order' },
		{ key: 'name', name: 'name' },
		{ key: 'createAt', name: 'Date Created' },
	]

	const params = computed(() => {
		const params = {
			// fields,
			page: page.value,
			limit: perPage.value,
			sort: `${sort.order}${sort.field}`,
			keyword: keyword.value ? keyword.value : null,
		}
		if (!keyword.value) delete params.keyword
		return params
	})

	const pages = computed(() =>
		totalCount.value % perPage.value
			? parseInt(totalCount.value / perPage.value) + 1
			: parseInt(totalCount.value / perPage.value)
	)

	const fetchAll = async () => {
		errorMsg.value = null
		message.value = null
		try {
			const { data, pending, error } = await useFetch(`${config.API_URL}/attributes/`, {
				params: params.value,
			})
			if (error.value) throw error.value
			console.log('DATA', data.value)
			attributes.value = data.value.docs
			totalCount.value = data.value.totalCount
		} catch (err) {
			console.log(err)
		}
	}

	// // Attributes query params
	// const attributeParams = computed(() => {
	//   return {
	//     fields: 'name, slug',
	//     page: page.value,
	//     limit: perPage.value,
	//     sort: `${sortOrder.value}${sortField.value}`,
	//     keyword: keyword.value,
	//   }
	// })

	// const fetchAll = async () => {
	//   response = await fetchAll('attributes', attributeParams.value)
	//   if (response.ok && response.ok == false) {
	//     errorMsg.value = response.errorMsg
	//     attributes.value = []
	//   } else {
	//     attributes.value = response.docs
	//     count.value = response.count
	//     totalCount.value = response.totalCount
	//     response = await fetchAll('attributeterms', {
	//       fields: 'name, slug, parent',
	//     })
	//     if (response.ok && response.ok == false) {
	//       errorMsg.value = response.errorMsg
	//       attributeTerms.value = []
	//     } else {
	//       attributeTerms.value = response.docs
	//     }
	//   }
	// }
	// await fetchAll()

	const resetActions = () => {
		for (const prop in attributes.value) {
			showActionKeys.value[prop] = false
		}
	}

	const setActions = (payload) => {
		resetActions()
		showActionKeys.value[payload.index] = payload.action
	}

	const handleSearch = async (searchKeyword) => {
		keyword.value = searchKeyword
		page.value = 1
		await fetchAll()
	}

	const toggleSort = async (event) => {
		sort.field = event.field
		sort.order = event.order
		await fetchAll()
	}

	// Set current page
	const setPage = async (currentPage) => {
		page.value = currentPage
		await fetchAll()
	}

	await fetchAll()
</script>

<template>
	<div class="h-full flex-col items-center gap-2 p-3">
		<div class="flex-row items-center justify-between w-full max-w-130">
			<h3>Attributes</h3>
			<button
				class="btn btn__primary btn__pill px-2 py-02 flex-row gap1"
				@click="attributes.push({ name: '', terms: [] })"
			>
				<IconsPlus class="w-2 h-2" />
				Add New
			</button>
		</div>
		<div class="flex-1 max-w-130 w-full flex-col gap3">
			<div class="flex-col gap-2 br5" v-if="totalCount">
				<div class="flex-row items-center gap-3 bg-white p-2 shadow-md br-3">
					<Search class="flex-1" @searchKeywordSelected="handleSearch" />
					<Sort :sortOptions="sortOptions" @toggleSort="toggleSort" />
				</div>
				<table class="shadow-md border border-slate-300">
					<thead class="bg-slate-300">
						<tr>
							<th>Attribute Name</th>
							<th>Attribute Terms</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<EcommerceAttributesCard
							v-for="(attribute, index) in attributes"
							:key="attribute._id"
							:attribute="attribute"
							:index="index"
							:showAction="showActionKeys[index]"
							@setActions="setActions"
							@attributeUpdated="fetchAll"
						/>
					</tbody>
				</table>
			</div>
			<EcommerceAttributesEmptyMsg v-else />
		</div>
		<div class="w-full max-width-130">
			<Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>

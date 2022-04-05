<script setup>
useMeta({
  title: 'Categories | YRL',
})
definePageMeta({
  layout: 'admin',
})

const config = useRuntimeConfig()
const { $fetchAll, $deleteDoc } = useNuxtApp()

const { errorMsg, message, alert } = useAppState()
const categories = ref([])
const categoryToDeleteId = ref(null)
const totalCount = ref(null) // Total item count in the database
const keyword = ref(null)
const page = ref(1)
const perPage = ref(10)
const sort = reactive({
  field: 'createdAt',
  order: '-',
})
const fields = '-updatedAt'
const sortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'name' },
  { key: 'createdAt', name: 'Date Created' },
]

const params = computed(() => {
  const params = {
    fields,
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
  const response = await $fetchAll('categories', params.value)
  categories.value = response.docs
  totalCount.value = response.totalCount
}

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAll()
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

const showDeleteCategoryAlert = (categoryId) => {
  categoryToDeleteId.value = categoryId
  showAlert('Are you sure you want to delete this category?', '', 'deleteCategory', true)
}

const deleteCategory = async () => {
  const response = await $deleteDoc('categories', categoryToDeleteId.value)
  if (!response) message.value = 'We were unable to delete this product'
  categoryToDeleteId.value = null
  alert.value.show = false
  alert.value.action = ''
  await fetchAll()
  message.value = `Category deleted succesfully`
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
    if (currentVal === 'ok' && alert.value.action === 'deleteCategory') deleteCategory()
  }
)

await fetchAll()
</script>

<template>
  <div class="h-full flex-col items-center gap-2 p-3">
    <header class="flex-row items-center justify-between w-full max-width-130">
      <h3 class="title">Categories</h3>
      <NuxtLink :to="{ name: 'ecommerce-categories-slug', params: { slug: ' ' } }">
        <button class="btn btn__primary btn__pill px-2 py-05 text-xs gap-1">
          <IconsPlus class="w-2 h-2 fill-slate-50" /><span>Add</span>
        </button>
      </NuxtLink>
    </header>
    <main class="flex-1 max-width-130 w-full flex-col gap-3">
      <div class="flex-col gap-3 flex-col br-5">
        <div class="flex-row items-center gap-3 border-b-slate-300 p-2" v-if="totalCount">
          <Search class="flex-1" @searchKeywordSelected="handleSearch" />
          <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="toggleSort" />
        </div>
        <EcommerceCategoriesList
          :categories="categories"
          :totalCount="totalCount"
          @deleteCategory="showDeleteCategoryAlert"
        />
      </div>
    </main>
    <footer class="w-full max-width-130">
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
    </footer>
  </div>
</template>

<style lang="scss" scoped></style>

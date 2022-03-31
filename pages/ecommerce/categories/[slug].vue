<script setup>
import slugify from 'slugify'

useMeta({
  title: 'Category | YRL',
})
definePageMeta({
  layout: 'admin',
})

// const { category } = useStore()
const config = useRuntimeConfig()

const { errorMsg, message, galleryMedia, mediaReference, showMediaSelector } = useAppState()
const route = useRoute()
const router = useRouter()
console.log('ROUTER', router.getRoutes())

const categories = ref([])
const category = ref({ name: 'AAAAAAA', order: '0', parent: {}, gallery: [] })
const galleryIntro = ref('This image gallery contains all images associated with this category.')
const slug = route.params.slug === ' ' ? null : route.params.slug

const fetchAll = async () => {
  errorMsg.value = ''
  message.value = ''
  try {
    const { data, pending, error } = await useFetch(`${config.API_URL}/categories/`)
    if (error.value) throw error.value
    console.log('DATA', data.value)
    categories.value = data.value.docs
    if (slug) category.value = categories.value.find((c) => c.slug === slug)
    console.log(category.value)
  } catch (err) {
    console.log(err)
  }
}

const updateDetails = (details) => {
  category.value = { ...category.value, ...details }
}

const updateParent = (parentId) => {
  console.log(
    'PPPPP',
    categories.value.find((c) => c._id == parentId)
  )
  category.value.parent = categories.value.find((c) => c._id == parentId)
}

// Set category gallery
const setImageGallery = async (media) => {
  console.log('mediap', media)
  for (const prop in media) {
    const index = category.value.gallery.findIndex((el) => el._id == media[prop]._id)
    if (index === -1 && media[prop].mimetype.includes('image')) {
      category.value.gallery.push(media[prop])
    }
  }
}

const saveCategory = async () => {
  errorMsg.value = ''
  message.value = ''
  if (!category.value.name) return (errorMsg.value = 'Category name is required')
  category.value.slug = slugify(category.value.name, { lower: true })
  if (!category.value.permalink) category.value.permalink = slugify(category.value.name, { lower: true })

  try {
    if (category.value._id) {
      const { data, pending, error } = await useFetch(`${config.API_URL}/categories/${category.value._id}`, {
        method: 'PATCH',
        body: category.value,
      })
    } else {
      const { data, pending, error } = await useFetch(`${config.API_URL}/categories/`, {
        method: 'POST',
        body: category.value,
      })
    }
    if (error.value) throw error.value
    console.log('DATA', data.value)
  } catch (err) {
    console.log(err)
  }
  // router.push({ name: 'ecommerce-categories' })
  message.value = 'Category saved succesfully'
}

const handleNewMediaSelectBtnClicked = () => {
  mediaReference.value = 'categoryMedia'
  showMediaSelector.value = true
}

// const selectMediaGallery = async (media) => {
// 	if (!category.value.gallery) category.value.gallery = []
// 	for (const prop in media) {
// 		const index = category.value.gallery.findIndex((el) => el._id === media[prop]._id)
// 		if (index === -1) {
// 			category.value.gallery.push(media[prop])
// 		}
// 	}
// }

watch(
  () => galleryMedia.value,
  (currentVal) => {
    console.log(currentVal)
    if (mediaReference.value === 'categoryMedia') setImageGallery(currentVal)
    // store.showMediaSelector = false
    // store.galleryMedia = []
  },
  { deep: true }
)

// watch(
//   () => category.value.selectedMedia,
//   (currentVal) => {
//     console.log(currentVal)
//     if (state.value.referenceMedia === 'categoryMedia') selectMediaGallery(currentVal)
//   },
//   { deep: true }
// )

await fetchAll()
</script>

<template>
  <div class="h-full flex-col items-center gap-2 p-3">
    {{ category }}
    <header class="flex-col gap-2 w-full max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'ecommerce-categories' }"> <IconsArrowWest />Categories </NuxtLink>
      </div>
      <h3 class="header">Edit Category</h3>
    </header>
    <main class="main flex-1 max-width-130 w-full">
      <div class="center-col flex-col gap-2">
        <EcommerceCategoriesDetails :category="category" @updateDetails="updateDetails" />
        <section class="admin-image-gallery shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
          <div class="flex-row items-center justify-between text-sm mb1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Image Gallery</div>
            <div></div>
          </div>
          <div class="flex-col flex-col items-center gap-2">
            <div class="intro flex-row items-center gap1 bg-slate-200 py-1 px-2 br-3 text-sm" v-if="galleryIntro">
              <IconsInfo class="w-3 h-3 fill-sky-600" />
              <p>{{ galleryIntro }}</p>
            </div>
            <EcommerceImageGallery
              :gallery="category.gallery"
              :galleryIntro="galleryIntro"
              galleryType="product"
              @removeGalleryImage="category.gallery.splice($event, 1)"
              @setGalleryImage="category.gallery[$event.index] = $event.value"
            />
            <div class="image-select-actions">
              <button class="btn btn__image-select" @click.prevent="handleNewMediaSelectBtnClicked">
                <IconsImage />
                <span> Select New Images </span>
              </button>
            </div>
            <p class="text-sm">PNG, JPG, and GIF Accepted</p>
          </div>
        </section>
      </div>
      <div class="right-col">
        <EcommerceCategoriesCategoryRightNav
          :category="category"
          :categories="categories"
          @updateParent="updateParent"
          @saveCategory="saveCategory"
        />
        <div class="go-to-top">
          <a href="#product-go-back" class="btn">Go To Top</a>
        </div>
      </div>
    </main>
    <footer class="w-full max-width-130">Footer</footer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

main {
  display: grid;
  grid-template-columns: 1fr 30rem;
  gap: 2rem;
  align-items: flex-start;

  .center-col {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .right-col {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}
</style>

<script setup>
useMeta({
  title: 'Product | YRL',
})
definePageMeta({
  layout: 'admin',
})

const { product } = useStore()
const { errorMsg, message, showMediaSelector, mediaReference, galleryMedia } = useAppState()

const route = useRoute()
const router = useRouter()
const { $fetchBySlug, $saveDoc, $deleteDocs } = useNuxtApp()
const showAttributesSlideout = ref(false)
const showVariantsSlideout = ref(false)
let response = null
const galleryIntro = ref('This image gallery contains all images associated with this product including its variants.')
let slug = route.params.slug === ' ' ? null : route.params.slug

response = await $fetchBySlug('products', slug)
if (Object.values(response).length) product.value = response
else product.value = { productType: 'simple', gallery: [], attributes: [], variants: [], categories: [] }
console.log(product.value)

const saveProduct = async () => {
  console.log(product.value)
  if (!product.value.name) return (errorMsg.value = 'Product name is required')
  const id = product.value._id ? product.value._id : null
  const newProduct = await $saveDoc('products', product.value, id)
  if (!newProduct) return
  slug = newProduct.slug
  message.value = 'product saved succesfully'
  response = await $deleteDocs('variants', { docs: product.value.variants })
  if (!response) return
  if (product.value.variants.length) response = await $saveDoc('variants', product.value.variants)
  router.push({ name: 'ecommerce-products-slug', params: { slug } })
  message.value = 'product saved succesfully'
  // response = await $fetchBySlug('products', slug)
  // if (response) product.value = response
}

const handleNewMediaSelectBtnClicked = () => {
  mediaReference.value = 'productMedia'
  showMediaSelector.value = true
}

// Set category gallery
const setImageGallery = async (media) => {
  console.log('mediap', media)
  console.log(product.value)
  for (const prop in media) {
    const index = product.value.gallery.findIndex((el) => el._id == media[prop]._id)
    if (index === -1) {
      product.value.gallery.push(media[prop])
    }
  }
  console.log(product.value.gallery)
}

watch(
  () => galleryMedia.value,
  (currentVal) => {
    console.log(currentVal)
    if (mediaReference.value === 'productMedia') setImageGallery(currentVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="hfull flex-col items-center gap-2 p-3">
    <header class="flex-col gap-2 w-full max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'ecommerce-products' }">
          <IconsArrowWest /><span>Products</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Product</h3>
    </header>
    <main class="main flex-1 max-width-130 w-full">
      <div class="left-sidebar shadow-md">
        <EcommerceProductLeftSidebar :product="product" />
      </div>
      <div class="flex-col gap-2">
        {{ product }}

        <EcommerceProductGeneralInfo
          :product="product"
          @updateGeneralInfo="product.value = { ...product.value, ...$event }"
        />
        <EcommerceProductPrice :product="product" @updatePrice="product.value = { ...product.value, ...$event }" />
        <EcommerceProductStockManagement
          :product="product"
          @updateStock="product.value = { ...product.value, ...$event }"
        />
        <section class="admin-image-gallery shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
          <div class="flex-row items-center justify-between text-sm mb-1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Image Gallery</div>
            <div></div>
          </div>
          <div class="flex-col flex-col items-center gap-2">
            <div class="intro flex-row items-center gap-1 bg-slate-200 py-1 px-2 br3 text-sm" v-if="galleryIntro">
              <IconsInfo class="w-3 h-3 fill-sky-600" />
              <p>{{ galleryIntro }}</p>
            </div>
            <EcommerceImageGallery
              :gallery="product.gallery"
              :galleryIntro="galleryIntro"
              galleryType="product"
              @removeGalleryImage="product.gallery.splice($event, 1)"
              @setGalleryImage="product.gallery[$event.index] = $event.value"
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

        <EcommerceProductAttributesContent
          v-if="product._id && product.productType === 'variable'"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
        />
        <EcommerceProductAttributesSlideout
          v-if="showAttributesSlideout"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
          @saveAttributes="saveProduct"
        />

        <EcommerceProductVariantsContent
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          v-if="product._id && product.productType === 'variable' && product.attributes.length"
        />
        <EcommerceProductVariantsSlideout
          v-if="showVariantsSlideout"
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          @saveVariants="saveProduct"
        />
        <EcommerceProductDetails :product="product" @updateDetails="product.value = { ...product.value, ...$event }" />

        <EcommerceProductShippingOptions :product="product" />
        <EcommerceProductDigitalDelivery :product="product" />
        <EcommerceProductExtraFields :product="product" />
        <EcommerceProductSeo :product="product" />
        <EcommerceProductMisc :product="product" />
      </div>
      <div class="right-sidebar">
        <EcommerceProductRightSidebar @productStatusUpdated="product.status = $event" @saveProduct="saveProduct" />
      </div>
    </main>
    <div class="w-full flex-row justify-end px-4">
      <a href="#product-go-back" class="btn btn__secondary px-2 py-1">Go To Top</a>
    </div>
    <footer class="w-full max-width-130 bg-slate-300 px-2 py-1 br-5 flex-row justify-center text-2xl">Footer</footer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.main {
  display: grid;
  grid-template-columns: 18rem 1fr 25rem;
  gap: 2rem;
  align-items: flex-start;

  .left-sidebar {
    position: sticky;
    top: 10rem;
    background-color: white;
    border: 1px solid $slate-100;
    border-radius: 3px;
    padding: 2rem 0.5rem;
  }

  .right-sidebar {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}
</style>

<script setup>
import slugify from 'slugify'

useMeta({
  title: 'Product | YRL',
})
definePageMeta({
  layout: 'admin',
  // middleware: ['saved-product'],
})

// const { product, variants } = useStore()
// const { galleryMedia, mediaReference, fetchBySlug, fetchAll, saveDoc, saveDocs, deleteMany } = useAppState()
const { errorMsg, message, showMediaSelector } = useAppState()

const route = useRoute()
const router = useRouter()
const { $fetchBySlug, $saveDoc } = useNuxtApp()
const product = ref({})

// const fields = '-updatedAt'
// const showAttributesSlideout = ref(false)
// const showVariantsSlideout = ref(false)
let response = null
const galleryIntro = ref('This image gallery contains all images associated with this product including its variants.')
const slug = route.params.slug === ' ' ? null : route.params.slug
// const params = computed(() => {
//   return {
//     fields,
//     slug,
//   }
// })
product.value = await $fetchBySlug('products', product.value)

// response = await fetchBySlug('products', slug)
// if (response && response.ok === false) errorMsg.value = response.error
// if (response) product.value = response
// variants.value = product.value._id
//   ? (
//       await fetchAll('variants', {
//         fields: 'product, attrattributeTerms, gallery',
//         product: product.value._id,
//       })
//     ).docs
//   : []

const updateGeneralInfo = (generalInfo) => {
  product.value = { ...product.value, ...generalInfo }
}

const updatePrice = (priceSalePrice) => {
  product.value = { ...product.value, ...priceSalePrice }
}

// // Set category gallery
// const setImageGallery = async (media) => {
//   console.log('mediap', media)
//   console.log(product.value)
//   for (const prop in media) {
//     const index = product.value.gallery.findIndex((el) => el._id == media[prop]._id)
//     if (index === -1) {
//       product.value.gallery.push(media[prop])
//     }
//   }
//   console.log(product.value.gallery)
// }

const saveProduct = async () => {
  if (!product.value.name) return (errorMsg.value = 'Product name is required')
  // product.value.slug = slugify(product.value.name, { lower: true })
  // if (!product.value.permalink) product.value.permalink = slugify(product.value.name, { lower: true })
  product.value = await $saveDoc('products', product.value)
  // console.log('SAVE', response)
  // if (!response) return
  // product.value = response
  // console.log('Product', product.value)
  // response = await deleteMany('variants', { product: product.value._id })
  // if (!response) return

  // if (!variants.value.length) {
  //   router.push({ name: 'admin-ecommerce-products-slug', params: { slug: product.value.slug } })
  //   return (message.value = 'product saved succesfully')
  // }
  // console.log('Variants', variants.value)
  // response = await saveDocs('variants', variants.value)
  // if (!response) return
  // router.push({ name: 'admin-ecommerce-products-slug', params: { slug: product.value.slug } })
  // message.value = 'product and variants saved succesfully'
  // showAttributesSlideout.value = false
  // router.push({ name: 'admin-ecommerce-products-slug', params: { slug: product.value.slug } })
}
// provide('saveProduct', saveProduct)

// const handleNewMediaSelectBtnClicked = () => {
//   mediaReference.value = 'productMedia'
//   showMediaSelector.value = true
// }

// const updateStoreGallery = (gallery) => {
//   console.log(gallery)
//   product.value.gallery = gallery
// }

// watch(
//   () => galleryMedia.value,
//   (currentVal) => {
//     console.log(currentVal)
//     if (mediaReference.value === 'productMedia') setImageGallery(currentVal)
//     // store.showMediaSelector = false
//     // store.galleryMedia = []
//   },
//   { deep: true }
// )

// provide('saveProduct', saveProduct)
</script>

<template>
  <div class="hfull flex-col items-center gap-2 p-3">
    {{ product }}
    <header class="flex-col gap-2 w-full max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'ecommerce-products' }">
          <IconsArrowWest /><span>Products</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Product</h3>
    </header>
    <!-- {{ product }} -->
    <main class="main flex-1 max-width-130 w-full">
      <div class="left-sidebar shadow-md">
        <EcommerceProductLeftSidebar :product="product" />
      </div>

      <div class="flex-col gap-2">
        <EcommerceProductGeneralInfo :product="product" @updateGeneralInfo="updateGeneralInfo" />
        <EcommerceProductPrice :product="product" @updatePrice="updatePrice" />
        <!-- <EcommerceAdminProductStockManagement /> -->
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
            <!-- <EcommerceAdminImageGallery
              :gallery="product.gallery"
              :galleryIntro="galleryIntro"
              galleryType="product"
              @removeGalleryImage="product.gallery.splice($event, 1)"
              @setGalleryImage="product.gallery[$event.index] = $event.value"
            /> -->
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
          @showAttributesSlideout="showAttributesSlideout = $event"
        />
        <!-- <EcommerceAdminProductsAttributesSlideout
          v-if="showAttributesSlideout"
          @closeSlideout="showAttributesSlideout = false"
          @saveAttributes="saveProduct"
        /> -->

        <!-- <EcommerceAdminProductsVariantsContent
          @showVariantsSlideout="showVariantsSlideout = $event"
          v-if="product._id && product.productType === 'variable' && product.attributes.length"
        /> -->
        <!-- <EcommerceAdminProductsVariantsSlideout
          v-if="showVariantsSlideout"
          @closeSlideout="showVariantsSlideout = false"
          @saveVariants="saveProduct"
        /> -->
        <!-- <EcommerceAdminProductDetails /> -->

        <!-- <EcommerceAdminProductShippingOptions :product="product" /> -->
        <!-- <EcommerceAdminProductDigitalDelivery :product="product" /> -->
        <!-- <EcommerceAdminProductExtraFields :product="product" /> -->
        <!-- <EcommerceAdminProductSeo :product="product" /> -->
        <!-- <EcommerceAdminProductMisc :product="product" /> -->
      </div>
      <div class="right-sidebar">
        <EcommerceProductRightSidebar @productStatusUpdated="product.status = $event" @saveProduct="saveProduct" />
      </div>

      <div class="product-details">
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

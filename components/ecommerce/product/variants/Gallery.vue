<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
})

const { product } = useStore()
const { galleryMedia, mediaReference, showMediaSelector } = useAppState()

const showProductGallery = ref(false)
const galleryIntro = ref('This image gallery contains all images associated with this product variant.')

const updateVariantMedia = async (event) => {
  console.log('media', event)
  showMediaSelector.value = false
  for (const prop in event) {
    const i = product.value.variants[props.index].gallery.findIndex((m) => m._id === event[prop]._id)
    if (i === -1) product.value.variants[props.index].gallery.push(event[prop])
  }
}

const handleNewMediaSelectBtnClicked = () => {
  mediaReference.value = 'variantMedia'
  showMediaSelector.value = true
}

watch(
  () => galleryMedia.value,
  (currentVal) => {
    console.log(currentVal)
    if (mediaReference.value === 'variantMedia') updateVariantMedia(currentVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Image Gallery</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div class="items-self-center flex-col items-center gap-2 max-w-60">
        <div class="intro flex-row items-center gap-1 bg-slate-200 py-1 px-2 br-3 text-sm" v-if="galleryIntro">
          <IconsInfo class="w-3 h-3 fill-sky-600" />
          <p>{{ galleryIntro }}</p>
        </div>
        <EcommerceImageGallery
          v-if="!showProductGallery"
          :gallery="product.variants[index].gallery"
          :galleryIntro="galleryIntro"
          galleryType="variant"
          @removeGalleryImage="product.variants[index].gallery.splice($event, 1)"
          @setGalleryImage="product.variants[index].gallery[$event.index] = $event.value"
        />
        <EcommerceProductVariantsSelectExisting
          v-else
          :index="index"
          @productGalleryEventEmitted="showProductGallery = $event"
        />
        <div class="flex-row gap-2">
          <button class="btn btn__image-select" @click.prevent="handleNewMediaSelectBtnClicked">
            <IconsImage />
            <span> Select New Images </span>
          </button>
          <button class="btn btn__image-select" @click.prevent="showProductGallery = true">
            <IconsImage />
            <span> Select From Product Images </span>
          </button>
        </div>
        <p class="text-sm">PNG, JPG, and GIF Accepted</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>

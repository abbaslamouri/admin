<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="seo">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Seo</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <FormsBaseInput label="Custom Permalink" placeholder="Custom Permalink" v-model="product.permalink" />
      <FormsBaseInput label="SEO Title" placeholder="SEO Title" v-model="product.seoTitle" />
      <FormsBaseInput label="SEO Description" placeholder="SEO Description" v-model="product.seoDescription" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.seo {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem 4rem;

  .content {
    display: flex;
    flex-direction: column;
    gap: 3rem;

    .sku-inventory {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;

      .sku {
        flex: 1;
      }

      .inventory {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 1.3rem;

        .available {
          display: flex;
          align-items: center;
          gap: 1rem;

          .title {
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>

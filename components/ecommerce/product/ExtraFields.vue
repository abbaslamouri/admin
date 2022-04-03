<script setup>
const { product } = useStore()
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="extra-fields">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Extra Fields</div>
      <div>
        <button class="btn btn-heading" @click="product.extraFields.push({ name: '', isRequired: false })">
          <IconsPlus class="fill-slate-50 w-2 h-2" />
          <span>Add</span>
        </button>
      </div>
    </div>
    <div class="flex-col gap-2">
      <p>Collect custom information from your customer.</p>
      <div class="fields">
        <div class="field" v-for="(field, k) in product.extraFields" :key="`extra-field-${k}`">
          <div class="name">
            <FormsBaseInput label="Extra Field" placeholder="Extra Field" v-model="product.extraFields[k].name" />
          </div>
          <div class="is-required">
            <FormsBaseToggle v-model="product.extraFields[k].isRequired" label="Required" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.extra-fields {
  background-color: white;
  border-radius: 5px;
  padding: 2rem 2rem 4rem;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .title {
      font-size: 80%;
    }

    .fields {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      .field {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;

        .name {
          flex: 1;
        }
      }
    }
  }
}
</style>

<script setup>
const showEcommreceSubMenu = ref(false)
</script>

<template>
  <ul class="text-sm">
    <li class="border-b-slate-500">
      <div class="admin-nav-link">
        <NuxtLink class="flex-row items-center gap-1 w-full py-1 px-1 mt--1 uppercase" :to="{ name: 'index' }">
          <iconsHome class="w-2 h-2 fill-slate-50" />
          <p class="text-slate-50">Dashboard</p>
        </NuxtLink>
      </div>
    </li>
    <li class="border-b-slate-500">
      <div class="admin-nav-link">
        <NuxtLink class="flex-row items-center gap-1 w-full py-1 px-1 mt--1 uppercase" :to="{ name: 'media' }">
          <iconsFolder class="w-2 h-2 fill-slate-50" />
          <p class="text-slate-50">Media</p>
        </NuxtLink>
      </div>
    </li>
    <li class="parent border-b-slate-500" @click="showEcommreceSubMenu = !showEcommreceSubMenu">
      <div class="admin-nav-link flex-row items-center justify-between">
        <div>
          <NuxtLink class="flex-row items-center gap-1 w-full py-1 px-1 mt--1 uppercase" :to="{ name: 'index' }">
            <IconsCart class="w-2 h-2 fill-slate-50" />
            <p class="text-slate-50">Ecommerce</p>
          </NuxtLink>
        </div>
        <div>
          <transition name="draopdown">
            <IconsChevronUp v-if="showEcommreceSubMenu" class="w-2 h-2 fill-slate-50" />
            <IconsChevronDown v-else class="w-2 h-2 fill-slate-50" />
          </transition>
        </div>
      </div>
      <transition name="dropdown" appear>
        <ul class="text-xs" v-if="showEcommreceSubMenu">
          <li class="border-t-slate-500">
            <div class="admin-nav-link">
              <NuxtLink class="flex-row items-center gap-1 py-1 px-1 uppercase ml-1" :to="{ name: 'index' }">
                <IconsShoppingBag class="w-2 h-2 fill-slate-50" />
                <p class="text-slate-50">Products</p>
              </NuxtLink>
            </div>
          </li>
        </ul>
      </transition>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

li {
  margin-top: -1px;
  cursor: pointer;

  .admin-nav-link {
    &:hover {
      background-color: $slate-700;
    }
  }

  &:last-of-type {
    margin-top: 0;
  }
}
</style>

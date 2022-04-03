<script setup>
const { user, token, isAuthenticated } = useAuth()
const { errorMsg, message } = useAppState()
const showProfileDropdown = ref(false)
const config = useRuntimeConfig()

const signout = async () => {
  showProfileDropdown.value = false
  const { data, pending, error } = await useFetch(`${config.API_URL}/auth/signout`)
  const auth = useCookie('auth', { expires: new Date(Date.now() + 1000), path: '/' })
  auth.value = ''
  user.value = ''
  token.value = ''
  isAuthenticated.value = false
  if (process.client) localStorage.removeItem('cart')
  message.value = 'You are logged out'
}
</script>

<template>
  <div class="profile-dropdown relative">
    <div
      class="header flex-row items-center gap-1 text-xs border border-slate-50 py-05 px-1 cursor-pointer br-3 relative z-99"
      v-bind:class="{ selected: showProfileDropdown }"
    >
      <IconsPersonFill class="fill-slate-50" />
      <h3 class="font-light uppercase" @click="showProfileDropdown = !showProfileDropdown">Welcome {{ user.name }}</h3>
    </div>
    <div
      v-if="showProfileDropdown"
      class="menu absolute flex-col gap-2 p-2 bg-slate-50 z-99 text-slate-800 w-full text-xs"
    >
      <h3 class="">My Accoun</h3>
      <ul>
        <li v-if="user.role === 'admin'">
          <NuxtLink :to="{ name: `index` }">Admin</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: `index` }">Order History</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: `index` }">Account Information?</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: `index` }">Addresses?</NuxtLink>
        </li>
      </ul>
      <button class="btn btn__secondary py-05 px-1" @click="signout">Sign out</button>
    </div>
    <div class="overlay" v-if="showProfileDropdown" @click="showProfileDropdown = !showProfileDropdown"></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.header {
  &:hover,
  &.selected {
    background-color: white;
    color: $slate-800;
    border-radius: 3px 3px 0 0;

    svg {
      fill: $slate-800;
    }
  }
}

li {
  padding: 0.5rem 0;
  border-top: 1px solid $slate-400;
  text-transform: capitalize;

  &:last-child {
    border-bottom: 1px solid $slate-400;
  }
}
</style>

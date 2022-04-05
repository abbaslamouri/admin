<script setup>
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

// const { user, token, isAuthenticated, finishSignup } = useAuth()
const { errorMsg, message } = useAppState()

const formUser = reactive({
  email: 'abbaslamouri@yrlus.com',
  password: 'adrar0714',
})

const completeSignup = async () => {
  errorMsg.value = null
  message.value = null
  const { data, pending, error } = await useFetch(
    `${config.BASE_URL}/${config.API_BASE}/auth/completeSignup/7285c2d4f4dde42734506e6021a77b2c09f26c8d6e54a71bc672791f7db2a428`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: formUser,
    }
  )
  if (error.value) errorMsg.value = error.value.data.message
  else message.value = data.value.message

  // const auth = useCookie('auth')
  auth.value = data.value.auth

  console.log(error.value ? error.value.data : '')
  console.log(auth.value)
  // errorMsg.value = null
  // message.value = null
  // const response = await finishSignup(formUser, route.query.token)
  // if (response.ok === false) return (errorMsg.value = response.errorMsg)
  // message.value = 'Registration successfull.  You are now logged in.'
  // user.value = response.user
  // token.value = response.token
  // isAuthenticated.value = true
  // router.push({ name: 'index' })
}

const getNewToken = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthForm.value = false
}
</script>

height: 100vh; background-color: #111; display: flex; justify-content: center; align-items: flex-start; padding-top:
5rem;

<template>
  <main class="h-100vh bg-slate-900 flex-row justify-center items-start pt-10">
    <form class="bg-slate-50 p-4 br-3 flex-col gap-2" @submit.prevent="completeSignup">
      <h2>Complete Registration</h2>
      <div class="bg-red-100 p-2 br-3 text-xs flex-col gap-2" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
        <button class="btn btn__primary py-05 px-2 text-xs" @click.prevent="getNewToken">
          <p>Click Here to get a new token</p>
        </button>
      </div>
      <FormsBaseInput type="email" label="Email" placeholder="Email" v-model="formUser.email" :required="true" />
      <FormsBaseInput
        type="password"
        label="Password"
        placeholder="Password"
        v-model="formUser.password"
        :required="true"
        minlength="8"
      />
      <button class="btn btn__primary py-05 px-2 items-self-end">Sign Up<IconsChevronRight /></button>
    </form>
  </main>
</template>

<style lang="scss" scoped></style>

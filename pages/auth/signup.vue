<script setup>
useMeta({
  title: 'Signup | YRL',
})

// const { signup } = useAuth()
const config = useRuntimeConfig()
const { message, errorMsg } = useAppState()
const user = reactive({
  name: 'Abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  // password: 'arar0714',
})

const register = async () => {
  errorMsg.value = null
  message.value = null
  const { data, pending, error } = await useFetch(`${config.BASE_URL}/${config.API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: user,
  })
  if (error.value) errorMsg.value = error.value.data.message
  else message.value = data.value.message

  console.log(error.value ? error.value.data : '')
  console.log(data.value)
  // const response = await signup(user)
  // console.log(response)
  // if (response.ok !== false)
  //   return (message.value = 'Please follow the link in your email to complete the registration')
  // errorMsg.value = response.errorMsg
  // if (errorMsg.value.includes('Email must be unique.'))
  //   errorMsg.value += '\nPlease click the link below to reset your password.'
}
</script>

<template>
  <div class="h-100vh bg-slate-900 flex-row justify-center items-start pt-10">
    <form class="bg-slate-50 p-4 br-3 flex-col gap-2" @submit.prevent="register">
      <h2>Signup</h2>
      <div class="bg-red-100 p-2 br3 text-xs flex-col gap2" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
        <NuxtLink class="link items-self-end" :to="{ name: 'auth-forgot-password' }">
          <span>Reset Password</span>
          <IconsChevronRight />
        </NuxtLink>
      </div>
      <p class="text-sm">Please fill the form below. Fields marked with * are required.</p>
      <FormsBaseInput v-model="user.name" label="Name" placeholder="name" />
      <FormsBaseInput type="email" v-model="user.email" label="Email" placeholder="Email" />
      <p class="text-xs">
        By clicking on “continue” I have read and agree with Nespresso Privacy Notice & Terms of Service.
      </p>
      <button class="btn btn__primary py-05 px-1 items-self-end">Continue<IconsChevronRight /></button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>

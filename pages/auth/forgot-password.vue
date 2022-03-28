<script setup>
	// const { forgotPassword } = useAuth()
	const config = useRuntimeConfig()

	const { message, errorMsg } = useAppState()

	const email = ref('lamouri@genvac.com')

	const handleForgotPassword = async () => {
		errorMsg.value = null
		message.value = null
		try {
			const { data, pending, error } = await useFetch(`${config.API_URL}/auth/forgotPassword`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: { email: email.value },
			})
			if (error.value) throw error.value
			console.log(data.value)
			const response = await $fetch('/api/v1/email', {
				method: 'POST',
				body: {
					user: data.value.user,
					url: `${config.BASE_URL}/auth/${data.value.resetToken}`,
				},
			})
			console.log(response)
		} catch (err) {
			console.log(err)
			// errorMsg.value = err.data.message
		}

		// try {
		// 	const response = await $fetch('/api/v1/auth/forgot-password', {
		// 		method: 'POST',
		// 		body: { email },
		// 	})
		// 	return response
		// } catch (error) {
		// 	return { ok: false, errorMsg: error.data }
		// }

		// errorMsg.value = null
		// message.value = null
		// const response = await forgotPassword(email.value)
		// console.log(response)
		// if (response.ok !== false)
		// 	return (message.value = 'Please check your email for instructions to reset your password.')
		// errorMsg.value = response.errorMsg

		// appMessage.snackbar.show = false
		// await auth.forgotPassword({ email: email.value })
		// if (auth.message) {
		// appMessage.setSnackbar(true, auth.message, 'Success')
		// router.push({ name: 'index' })
		// }
		// if (auth.errorMsg) appMessage.setSnackbar(true, auth.errorMsg, 'Error')
	}
</script>

<template>
	<div class="h-100vh bg-slate-900 flex-row justify-center items-start pt10">
		<form class="bg-slate-50 p-4 br-3 flex-col gap-2" @submit.prevent="handleForgotPassword">
			<h2>Forgot you password?</h2>
			<FormsBaseInput
				type="email"
				label="Email Address"
				placeholder="Email Address"
				v-model="email"
				:required="true"
				minlength="8"
				maxlength="25"
			/>
			<p class="text-xs">
				We will send you an email with a link to assist you with resetting your password. Check your spam folder for an
				email from: identification@nespresso.com.
			</p>
			<p class="text-sm">If you have questions, please call customer service at 1-800-555-5555.</p>

			<button class="btn btn__primary py-05 px-1 items-self-end">Reset Password<IconsChevronRight /></button>
		</form>
	</div>
</template>

<style lang="scss" scoped></style>

import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
	css: ['@/assets/scss/main.scss'],

	// modules: [
	//   '@nuxt/image',
	// ],
	// buildModules: ['@nuxt/image'],

	image: {
		domains: ['https://localhost:5000/uploads/'],
		// Options
	},

	publicRuntimeConfig: {
		BASE_URL: process.env.BASE_URL,
		API_BASE: process.env.API_BASE,
		API_URL: process.env.API_URL,
	},

	// privateRuntimeConfig: {
	//   DB_URL: process.env.DB_URL,
	//   COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE,
	//   BASE_URL: process.env.BASE_URL,
	//   NODE_ENV: process.env.NODE_ENV,
	// },
})

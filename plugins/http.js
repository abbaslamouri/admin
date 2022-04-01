export default defineNuxtPlugin((nuxtApp) => {
  const { errorMsg, message } = useAppState()
  const config = useRuntimeConfig()

  const http = async (resource, params = {}, method = 'GET', id = null, body = {}) => {
    errorMsg.value = null
    message.value = null
    let response = null
    let data = null
    let error = null
    console.log('ID', method)

    try {
      //Get
      if (method === 'GET') {
        response = await useFetch(`${config.API_URL}/${resource}`, {
          params,
        })
        data = response.data.value
        error = response.error.value
        if (error) throw error
        if (data.status === 'fail') {
          console.log('DATAT', data.message)
          if (process.client) errorMsg.value = data.message
          return { docs: [], totalCount: 0 }
        }
        return data
      }

      //DELETE
      if (method === 'DELETE') {
        console.log('ID')
        response = await useFetch(`${config.API_URL}/${resource}/${id}`, {
          method: 'DELETE',
        })
        data = response.data.value
        error = response.error.value
        if (error) throw error
        if (data.status === 'fail') {
          console.log('DATAT', data.message)
          if (process.client) errorMsg.value = data.message
          return { docs: [], totalCount: 0 }
        }
        // return data
      }
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
        if (method === 'GET') return { docs: [], totalCount: 0 }
      }
    }
  }

  const fetchBySlug = async (resource, slug) => {
    errorMsg.value = null
    message.value = null
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/${resource}`, {
        slug,
      })
      if (error.value) throw error.value
      if (data.value.status === 'fail') {
        console.log('DATAT', data.value.message)
        if (process.client) errorMsg.value = data.value.message
        return {}
      }
      return data.value.docs.length ? data.value.docs[0] : {}
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return {}
    }
  }

  const saveDoc = async (resource, doc, id) => {
    errorMsg.value = null
    message.value = null
    let response = null
    try {
      if (doc._id) {
        response = await useFetch(`${config.API_URL}/${resource}/${id}`, {
          method: 'PATCH',
          body: doc,
          headers: { Authorization: `Bearer ${useCookie('auth').value.token}` },
        })
      } else {
        response = await useFetch(`${config.API_URL}/${resource}`, {
          method: 'POST',
          body: doc,
          headers: { Authorization: `Bearer ${useCookie('auth').value.token}` },
        })
      }
      console.log(response.data.value)
      if (response.error.value) throw response.error.value
      if (response.data.value.status === 'fail') {
        console.log('DATAT', response.data.value.message)
        if (process.client) errorMsg.value = response.data.value.message
        return {}
      }
      return response.data.value.doc ? response.data.value.doc : {}
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return {}
    }
  }

  return {
    provide: {
      fetchBySlug: (resource, slug) => fetchBySlug(resource, slug),
      saveDoc: (resource, doc, id) => saveDoc(resource, doc, id),
      myFetch: (resource, params, method, id, body) => http(resource, params, method, id, body),
    },
  }
})

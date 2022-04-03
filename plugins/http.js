export default defineNuxtPlugin((nuxtApp) => {
  const { errorMsg, message } = useAppState()
  const config = useRuntimeConfig()

  const fetchAll = async (resource, params) => {
    errorMsg.value = null
    message.value = null
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/${resource}`, {
        params,
      })
      if (error.value) throw error.value
      if (data.value.status === 'fail') {
        console.log('DATAT', data.value.message)
        if (process.client) errorMsg.value = data.value.message
        return { docs: [], totalCount: 0 }
      }
      return data.value
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
        return { docs: [], totalCount: 0 }
      }
    }
  }

  const fetchBySlug = async (resource, slug) => {
    errorMsg.value = null
    message.value = null
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/${resource}`, {
        params: { slug },
      })
      if (error.value) throw error.value
      if (data.value.status === 'fail') {
        console.log('DATAT', data.value.message)
        if (process.client) errorMsg.value = data.value.message
        return {}
      }
      console.log('FETCH BY SLUG', data.value)
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
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      if (doc._id) {
        response = await useFetch(`${config.API_URL}/${resource}/${id}`, {
          method: 'PATCH',
          body: doc,
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        response = await useFetch(`${config.API_URL}/${resource}`, {
          method: 'POST',
          body: doc,
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      console.log(response.data.value)
      if (response.error.value) throw response.error.value
      if (response.data.value.status === 'fail') {
        console.log('DATAT', response.data.value.message)
        if (process.client) errorMsg.value = response.data.value.message
        return null
      }
      return response.data.value.doc ? response.data.value.doc : {}
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return null
    }
  }

  const deleteDocs = async (resource, docs) => {
    errorMsg.value = null
    message.value = null
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/${resource}/deleteMany`, {
        method: 'DELETE',
        body: docs,
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log('DELETE DOCS', data.value)
      if (error.value) throw error.value
      if (data.value.status === 'fail') {
        console.log('DATAT', data.value.message)
        if (process.client) errorMsg.value = data.value.message
        return null
      }
      return data.value.doc ? data.value.doc : {}
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return null
    }
  }

  return {
    provide: {
      fetchBySlug: (resource, slug) => fetchBySlug(resource, slug),
      saveDoc: (resource, doc, id) => saveDoc(resource, doc, id),
      fetchAll: (resource, params) => fetchAll(resource, params),
      deleteDocs: (resource, docs) => deleteDocs(resource, docs),
    },
  }
})

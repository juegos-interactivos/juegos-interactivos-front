import axios from 'axios'

const authConfig = token => ({
  headers: { Authorization: `Bearer ${token}` }
})

const apiErrorMessage = error => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.error) {
    return error.response.data.error
  }

  return error.message
}

export const state = () => ({
  items: [],
  current: null,
  loading: false,
  error: null
})

export const getters = {
  list: state => state.items,
  byId: (state, getters) => id => getters.list.find(user => Number(user.id) === Number(id))
}

export const mutations = {
  SET_ITEMS(state, users) {
    state.items = users
  },
  SET_CURRENT(state, user) {
    state.current = user
  },
  UPSERT_USER(state, user) {
    const index = state.items.findIndex(item => Number(item.id) === Number(user.id))

    if (index === -1) {
      state.items.push(user)
      return
    }

    state.items.splice(index, 1, user)
  },
  REMOVE_USER(state, userId) {
    state.items = state.items.filter(user => Number(user.id) !== Number(userId))
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchAll({ commit, rootState }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      let response = null
      response = await axios.get(`${baseUrl}/users`, authConfig(rootState.auth?.token))
      commit('SET_ITEMS', response.data.data)
      return response
    } catch (error) {
      commit('SET_ERROR', apiErrorMessage(error))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOne({ commit, rootState }, userId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      let response = null
      response = await axios.get(`${baseUrl}/users/${userId}`, authConfig(rootState.auth?.token))
      commit('SET_CURRENT', response.data.data)
      return response
    } catch (error) {
      commit('SET_ERROR', apiErrorMessage(error))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async update({ commit, rootState }, user) {
    let response = null
    response = await axios.post(`${baseUrl}/users/${user.id}`, user, authConfig(rootState.auth?.token))
    commit('UPSERT_USER', response.data.data)
    return response
  },

  async destroy({ commit, rootState }, userId) {
    let response = null
    response = await axios.delete(`${baseUrl}/users/${userId}`, authConfig(rootState.auth?.token))
    commit('REMOVE_USER', userId)
    return response
  }
}
const baseUrl = process.env.API_BASE_URL

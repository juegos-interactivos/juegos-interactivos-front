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
  active: (state, getters) => getters.list.filter(game => game.isActive),
  byId: (state, getters) => id => getters.list.find(game => Number(game.id) === Number(id))
}

export const mutations = {
  SET_ITEMS(state, games) {
    state.items = games
  },
  SET_CURRENT(state, game) {
    state.current = game
  },
  UPSERT_GAME(state, game) {
    const index = state.items.findIndex(item => Number(item.id) === Number(game.id))

    if (index === -1) {
      state.items.push(game)
      return
    }

    state.items.splice(index, 1, game)
  },
  REMOVE_GAME(state, gameId) {
    state.items = state.items.filter(game => Number(game.id) !== Number(gameId))
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchAll({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      let response = null
      response = await axios.get(`${baseUrl}/games`)
      commit('SET_ITEMS', response.data.data)
      return response
    } catch (error) {
      commit('SET_ERROR', apiErrorMessage(error))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOne({ commit }, gameId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      let response = null
      response = await axios.get(`${baseUrl}/games/${gameId}`)
      commit('SET_CURRENT', response.data.data)
      return response
    } catch (error) {
      commit('SET_ERROR', apiErrorMessage(error))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async update({ commit, rootState }, game) {
    let response = null
    response = await axios.post(`${baseUrl}/games/${game.id}`, game, authConfig(rootState.auth?.token))
    commit('UPSERT_GAME', response.data.data)
    return response
  },

  async toggle({ commit, rootState }, gameId) {
    let response = null
    response = await axios.post(`${baseUrl}/games/${gameId}/toggle`, {}, authConfig(rootState.auth?.token))
    commit('UPSERT_GAME', response.data.data)
    return response
  },

  async destroy({ commit, rootState }, gameId) {
    let response = null
    response = await axios.delete(`${baseUrl}/games/${gameId}`, authConfig(rootState.auth?.token))
    commit('REMOVE_GAME', gameId)
    return response
  }
}
const baseUrl = process.env.API_BASE_URL

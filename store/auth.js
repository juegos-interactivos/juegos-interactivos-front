import axios from 'axios'

const baseUrl = process.env.API_BASE_URL
const baseUrlAuth = `${baseUrl}/auth`

const authConfig = token => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
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

const saveSession = ({ user, token }) => {
  if (!process.client) {
    return
  }

  window.localStorage.setItem('auth_token', token)
  window.localStorage.setItem('auth_user', JSON.stringify(user))
}

const clearSession = () => {
  if (!process.client) {
    return
  }

  window.localStorage.removeItem('auth_token')
  window.localStorage.removeItem('auth_user')
}

export const state = () => ({
  user: null,
  token: null,
  loading: false,
  error: null
})

export const getters = {
  isAuthenticated: state => Boolean(state.token),
  isAdmin: state => Boolean(state.user?.isAdmin)
}

export const mutations = {
  SET_AUTH(state, { user, token }) {
    state.user = user
    state.token = token
  },
  SET_USER(state, user) {
    state.user = user
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    state.error = null
  }
}

export const actions = {
  init({ commit }) {
    if (!process.client) {
      return
    }

    const token = window.localStorage.getItem('auth_token')
    const savedUser = window.localStorage.getItem('auth_user')
    let user = null

    if (savedUser) {
      user = JSON.parse(savedUser)
    }

    if (token) {
      commit('SET_AUTH', { user, token })
    }
  },

  async register({ commit }, form) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      let response = null
      response = await axios.post(`${baseUrlAuth}/register`, form)
      commit('SET_AUTH', response.data)
      saveSession(response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', apiErrorMessage(error))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      let response = null
      response = await axios.post(`${baseUrlAuth}/login`, credentials)
      commit('SET_AUTH', response.data)
      saveSession(response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', apiErrorMessage(error))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async me({ commit, state }) {
    if (!state.token) {
      return null
    }

    let response = null
    response = await axios.get(`${baseUrlAuth}/me`, authConfig(state.token))
    commit('SET_USER', response.data.user)
    saveSession({ user: response.data.user, token: state.token })
    return response
  },

  async logout({ commit, state }) {
    if (state.token) {
      await axios.post(`${baseUrlAuth}/logout`, {}, authConfig(state.token)).catch(() => null)
    }

    commit('CLEAR_AUTH')
    clearSession()
  }
}

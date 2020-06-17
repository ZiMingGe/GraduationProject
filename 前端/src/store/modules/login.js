import { adminUserlogin } from '@/api/user.js'

const login = {
  state: {
    token: sessionStorage.getItem('token')
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    Login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        adminUserlogin(user)
          .then(response => {
            // console.log(response)
            let resData = response.data
            let token = resData.data.token
            if (resData.code === 200 && token) {
              commit('SET_TOKEN', token)
              sessionStorage.setItem('token', token)
              resolve(resData)
            } else {
              reject(resData)
              // resolve(resData)
            }
          })
          .catch(response => {
            reject(response)
          })
      })
    }
  },
  getters: {
    token: state => state.token
  }
}

export default login

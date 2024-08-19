import { login, SMSlogin, wxLogin, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getIsLogin, removeIsLogin, setIsLogin } from '../../utils/auth'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    isLogin: getIsLogin(),
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ISLOGIN:(state,islogin) =>{
      state.isLogin = islogin
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          commit('SET_ISLOGIN',true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    SMSLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        SMSlogin(userInfo).then(res => {
          setToken(res.token)
          setIsLogin(true)
          commit('SET_TOKEN', res.token)
          commit('SET_ISLOGIN',true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    wxLogin({ commit }, state) {
      return new Promise((resolve, reject) => {
       wxLogin(state).then(res => {
        if(res.message === "用户已登录"){
          setToken(res.token)
          setIsLogin(true)
          commit('SET_TOKEN', res.token)
          commit('SET_ISLOGIN',true)
        }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_ID', user.userId)
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_ISLOGIN',false)
          removeToken()
          removeIsLogin()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

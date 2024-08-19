import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token,{ expires: 1})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getIsLogin() {
  console.log(Cookies.get("isLogin"));
  return Cookies.get("isLogin")
}

export function setIsLogin(isLogin) {
  return Cookies.set("isLogin", isLogin, { expires: 1 })
}

export function removeIsLogin() {
  return Cookies.remove("isLogin")
}
import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}

export const getDefaultRouters = () => {
  return request({
    url: '/getDefaultRouters',
    method: 'get'
  })
}
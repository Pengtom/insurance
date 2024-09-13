import request from '@/utils/request'

const prefix = "/system/orders"

export function pay(data) {
    return request({
        url: prefix + '/pay',
        method: 'post',
        data
    })
}

export function getUserOrder() {
    return request({
        url: prefix + '/getUserOrder',
        method: 'get'
    })
}

export function polling(uuid) {
    return request({
        url: prefix + `/polling/${uuid}`,
        method: 'get'
    })
}
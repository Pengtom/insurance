import request from '@/utils/request'

const prefix = "/system/orders"

export function getUserOrder() {
    return request({
        url: prefix + '/getUserOrder',
        method: 'get'
    })
}
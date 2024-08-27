import request from '@/utils/request'

const prefix = '/system/orders'

export function pay(data) {
    return request({
        url: prefix + '/pay',
        method: 'post',
        data
    })
}
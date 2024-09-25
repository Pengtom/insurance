import request from '@/utils/request'

const prefix = '/system/images'

export function list(type) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params: {
            type
        }
    })
}
import request from '@/utils/request'

export function test(content) {
    return request({
        url: '/gpt',
        method: 'post',
        data: content,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}
import request from '@/utils/request'
//算力使用记录

const prefix = "/system/usage"

export function getComputingPowerTotal() {
    return request({
        url: prefix + '/deductCompute',
        method: 'post',
    })
}

export function queryUsage() {
    return request({
        url: prefix + '/queryusage',
        method:'get'
    })
}
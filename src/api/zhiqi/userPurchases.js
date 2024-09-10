import request from '@/utils/request'
//用户购买记录

const prefix = "/system/purchases"

export function getComputingPowerTotal(){
    return  request({
        url: prefix + '/getComputingPowerTotal',
        method: 'get',
    })
}
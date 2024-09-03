import request from '@/utils/request'

const prefix = '/system/packages'

export function queryYearPackages(packageName) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params:{
            packageName
        }
    })
}

export function queryPackageById(packageId) {
    return request({
        url: prefix + `/${packageId}`,
        method: 'get',
    })
}
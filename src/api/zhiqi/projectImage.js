import request from '@/utils/request'

const prefix = '/system/image'

export function queryImagesByProjectId(projectId) {
    return request({
        url: prefix + `/queryImages/${projectId}`,
        method: 'get'
    })
}

export function queryImagesById(projectId, imageId) {
    return request({
        url: prefix + `/queryImage/${projectId}/${imageId}`,
        method: 'get'
    })
}

export function awaitQueue(projectId) {
    return request({
        url: prefix + `/awaitQueue/${projectId}`,
        method: 'get'
    })
}
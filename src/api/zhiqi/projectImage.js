import request from '@/utils/request'

const prefix = '/system/image'

export function queryImagesByProjectId(projectId,type) {
    return request({
        url: prefix + `/queryImages/${projectId}?${type}`,
        method: 'get'
    })
}
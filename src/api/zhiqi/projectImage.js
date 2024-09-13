import request from '@/utils/request'

const prefix = '/system/image'

export function queryImagesByProjectId(projectId) {
    return request({
        url: prefix + `/queryImages/${projectId}`,
        method: 'get'
    })
}
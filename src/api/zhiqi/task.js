import request from '@/utils/request'

const prefix = "/system/project"

export function save(data) {
    return request({
        url: prefix,
        method: 'post',
        data
    })
}

export function queryListTask(data) {
    return request({
        url: prefix + "/list",
        method: 'get',
        params: data
    })
}

export function deleteTaskById(id) {
    return request({
        url: `${prefix}/${id}`,
        method: 'delete'
    })
}

export function upload(data){
    return request({
        url:prefix+"/upload",
        method: 'post',
        data,
        headers: {
            "Content-Type": "multipart/form-data" 
          },
    })
}

export function update(data){
    return request({
        url: prefix,
        method:"put",
        data
    })
}
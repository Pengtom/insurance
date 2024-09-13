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

export function getOne(id) {
    return request({
        url: `${prefix}/getProject/${id}`,
        method: 'get'
    })
}


export function deleteTaskById(id,type) {
    return request({
        url: `${prefix}/${id}/${type}`,
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

export function getParam(id){
    return request({
        url:prefix+'/getParam',
        method:'get',
        params:{
            id
        }
    })
}
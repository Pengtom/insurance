import request from '@/utils/request'

export function img2img(data){
    return request({
        url:'/users/sd/Img2img',
        method:'post',
        data
    })
}
export function handleTaskCompleted(){
    return request({
        url:'/users/sd/Img2img',
        method:'post',
        data
    })
}
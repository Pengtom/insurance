import request from '@/utils/request'

const prefix = "/system/model"

export function queryListModel(sort,paramClass){
    return request({
        url: prefix + "/class",
        method: 'get',
        params:{
            sort,
            paramClass
        }
    })
}
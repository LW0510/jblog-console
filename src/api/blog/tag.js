import request from '@/utils/request'

// 查询标签列表
export function listTag(query) {
  return request({
    url: '/tags/list',
    method: 'get',
    params: query
  })
}

// 查询标签详细
export function getTag(id) {
  return request({
    url: '/tags/',
    method: 'get'
  })
}

// id查询标签
export function getTagById(id) {
  return request({
    url: '/tags/getTagById',
    method: 'get',
    params:{id}
  })
}

// 新增标签
export function addTag(data) {
  return request({
    url: '/tags/save',
    method: 'post',
    params: data
  })
}

// 修改标签
export function updateTag(data) {
  return request({
    url: '/tags/update',
    method: 'post',
    params: data
  })
}

// 删除标签
export function delTag(id) {
  return request({
    url: '/tags/delete',
    method: 'post',
    params:{
      id
    }
  })
}

// 导出标签
export function exportTag(query) {
  return request({
    url: '/tags/export',
    method: 'get',
    params: query
  })
}
import request from '@/utils/request'

// 查询文章类别列表
export function listCategory(query) {
  return request({
    url: '/category/list',
    method: 'get',
    params: query
  })
}

// 查询文章类别详细
export function getCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'get'
  })
}

// 新增文章类别
export function addCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data: data
  })
}

// 修改文章类别
export function updateCategory(data) {
  return request({
    url: '/category',
    method: 'put',
    data: data
  })
}

// 删除文章类别
export function delCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'delete'
  })
}

// 导出文章类别
export function exportCategory(query) {
  return request({
    url: '/category/export',
    method: 'get',
    params: query
  })
}
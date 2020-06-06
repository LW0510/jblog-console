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
    url: '/category/detail/info',
    method: 'get',
    params:{
      id
    }
  })
}

// 新增文章类别
export function addCategory(data) {
  return request({
    url: '/category/save',
    method: 'post',
    params: data
  })
}

// 修改文章类别
export function updateCategory(data) {
  return request({
    url: '/category/update',
    method: 'post',
    params: data
  })
}

// 删除文章类别
export function delCategory(id) {
  return request({
    url: '/category/delete',
    method: 'post',
    params:{
      id
    }
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


// id查询文章类别
export function getCategoryById(id) {
  return request({
    url: '/category/getCategory',
    method: 'get',
    params:{
      id
    }
  })
}
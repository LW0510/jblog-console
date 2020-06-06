import request from '@/utils/request'
import Qs from 'qs'

// 查询文章列表
export function listArticle(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}


// 查询文章详细
export function getArticle(id) {
  return request({
    url: '/article/getArticle',
    method: 'get',
    params:{
      id
    }
  })
}

// 新增文章
export function addArticle(data) {
  return request({
    url: '/article',
    method: 'post',
    data: data
  })
}

// 审核文章
export function auditArticle(data) {
  return request({
    url: '/article/auditArticle',
    method: 'post',
    params: data
  })
}

// 删除文章
export function delArticle(id) {
  return request({
    url: '/article/' + id,
    method: 'delete'
  })
}

// 导出文章
export function exportArticle(query) {
  return request({
    url: '/article/export',
    method: 'get',
    params: query
  })
}

export function count() {
  return request({
    url: '/article/count',
    method: 'get',
  })
}
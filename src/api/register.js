import request from '@/utils/request'

// 用户注册
export function register(username, password){
    const data = {
      username,
      password
    }
    return request({
      url: '/register',
      method: 'post',
      params: data
    })
}


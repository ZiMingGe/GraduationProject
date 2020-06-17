import axios from './axios'
import QS from 'qs'

// 登录接口
export const adminUserlogin = user => {
  let name = user.name
  let password = user.password
  return axios({
    url: '/api/user/login',
    method: 'POST',
    data: QS.stringify({ name, password }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 获取用户信息接口
export const adminUserInfoGet = () => {
  return axios.get('/api/user/getall')
}
// 添加新用户接口
export const addUserByAdmin = param => {
  return axios.post('/api/user/registe', param)
}
// 删除用户接口
export const deleteUserById = ids => {
  return axios.post('/api/user/delete', ids)
}
// 编辑用户信息
export const editUser = info => {
  return axios.post('/api/user/edit', info)
}

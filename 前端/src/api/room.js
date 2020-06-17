import axios from './axios'

// 添加房间
export const addRooom = param => {
  return axios.post('/api/room/add', param)
}
// 获取所有房间信息
export const getRomminfo = page => {
  return axios({
    url: '/api/room/getall',
    method: 'GET',
    params: {
      pageSize: page.pageSize,
      currentPage: page.currentPage
    }
  })
}
// 编辑价格信息和房型信息
export const editRoom = info => {
  return axios.post('/api/room/edit', info)
}
// 根据_id删除房间
export const deleteRoomById = id => {
  return axios.post('/api/room/delete', id)
}
// 获取房间号、房间状态和房型信息组成列表
export const getRoomList = () => {
  return axios.get('/api/room/getList')
}

export const search = room => {
  return axios.post('/api/room/search', room)
}

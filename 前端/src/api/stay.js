import axios from './axios'

// 获取房间和顾客信息
export const getInfo = page => {
  return axios({
    url: '/api/stay/getInfo',
    method: 'GET',
    params: {
      pageSize: page.pageSize,
      currentPage: page.currentPage
    }
  })
}
// 获取分类信息
export const getByroomtype = () => {
  return axios.get('/api/stay/getByroomType')
}
// 登记入住
export const checkIn = param => {
  return axios.post('/api/stay/checkin', param)
}
// 登记入住
export const checkOut = info => {
  return axios.post('/api/stay/checkout', info)
}
// 更新超时房型信息
export const updateStatus = data => {
  return axios.post('/api/stay/update', data)
}
// 获取空房列表
export const getList = () => {
  return axios.get('/api//stay/getRoomList')
}
// 换房接口
export const changeRoom = data => {
  return axios.post('/api/stay/changeRoom', data)
}
export const singleChange = data => {
  return axios.post('/api/stay/singleChange', data)
}
// 通过状态筛选信息
export const getInfoByStatus = status => {
  return axios({
    url: ' /api/stay/getInfoByStatus',
    method: 'GET',
    params: {
      status: status.roomStatus
    }
  })
}
// 获取房间价格和房型图片信息
export const getInfoByRoom = room => {
  return axios({
    url: ' /api/stay/getInfoByRoom',
    method: 'GET',
    params: {
      roomId: room.roomId,
      roomType: room.roomType
    }
  })
}

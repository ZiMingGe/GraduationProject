import axios from './axios'

// 获取房型信息
export const getList = () => {
  return axios({
    url: '/api/roomType/getList',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

// 编辑房型信息
export const editRoomType = from => {
  return axios.post('/api/roomType/editType', from)
}

// 上传多图片图片
export const uploadImage = images => {
  return axios({
    url: '/api/roomType/upload',
    method: 'POST',
    data: images,
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    }
  })
}
// 上传一张图片
export const uploadSingleImage = image => {
  return axios({
    url: '/api/roomType/singleUpload',
    method: 'POST',
    data: image,
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    }
  })
}
// 新增房型
export const addNewType = type => {
  return axios.post('/api/roomType/addNew', type)
}
// 获取房型名称列表
export const getNameList = () => {
  return axios.get('/api/roomType/getNameList')
}
// 删除房型信息
export const deleteType = type => {
  return axios.post('/api/roomType/deleteType', type)
}
// 删除图片
export const deleteImage = info => {
  return axios.post('/api/roomType/deleteImage', info)
}

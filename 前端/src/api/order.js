import axios from './axios'

export const getList = page => {
  return axios({
    url: '/api/order/getList',
    method: 'GET',
    params: {
      pageSize: page.pageSize,
      currentPage: page.currentPage
    }
  })
}

export const getTradNoByRoom = room => {
  return axios({
    url: '/api/order/getTradNoByRoom',
    method: 'GET',
    params: {
      roomId: room.roomId
    }
  })
}
// 通过订单号获取消费信息
export const getConsumptionByNo = trad => {
  return axios({
    url: '/api/order/getConsumptionByNo',
    method: 'GET',
    params: {
      outTradNo: trad.outTradNo
    }
  })
}
// 添加消费
export const addConsumption = detail => {
  return axios.post('/api/order/addConsumption', detail)
}
// 续住
export const continueLive = con => {
  return axios.post('/api/order/continuedResidence', con)
}
// 查询
export const searchOrder = info => {
  return axios.post('/api/order/searchOrder', info)
}

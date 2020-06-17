import axios from 'axios'
import { Loading, Message } from 'element-ui'
import router from '../router/index.js'
let loading

function startLoading () {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading () {
  loading.close()
}

// 请求拦截
axios.interceptors.request.use(
  config => {
    startLoading()
    // 设置请求头

    let token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  response => {
    endLoading()
    return response
  },
  error => {
    Message.error(error.response.data)
    endLoading()

    // 获取状态码
    const { status } = error.response

    if (status === 401) {
      Message.error({
        message: '身份已过期,请重新登录',
        onClose: function () {
          // 清除token
          sessionStorage.removeItem('token')
          // 路由重定向
          router.replace('/')
        }
      })
    }

    return Promise.reject(error)
  }
)

export default axios

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/admin/Index',
    name: 'admin',
    meta: {
      requireAuth: false, // 判断是否登录
      title: '后台管理'
    },
    component: () => import('@/views/adminIndex.vue'),

    children: [
      {
        path: '/admin/index',
        name: 'adminIndex',
        component: () => import('@/components/admin/Index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/admin/liveRecord',
        name: 'roomtypeManerage',
        component: () => import('@/components/admin/liveRecord.vue'),
        meta: { title: '客户信息管理' }
      },
      {
        path: '/admin/roomManerage',
        name: 'roomManerage',
        component: () => import('@/components/admin/roomManerage'),
        meta: { title: '房间信息管理' }
      },
      {
        path: '/admin/UserManerage',
        name: 'userManerage',
        component: () => import('@/components/admin/userInfo'),
        meta: { title: '用户信息管理' },
        children: [
          {
            path: '/admin/UserManerage/Index',
            name: 'userManerageIndex',
            component: () => import('@/components/admin/user/Index'),
            meta: { title: '首页' }
          },
          {
            path: '/admin/UserManerage/addNewUser',
            name: 'addNewUser',
            component: () => import('@/components/admin/user/addNewuser'),
            meta: { title: '添加新用户' }
          }
        ]
      },
      {
        path: '/admin/checkIn',
        name: 'checkIn',
        component: () => import('@/components/admin/liveInfo/checkIn'),
        meta: { title: '登记入住' }
      },
      {
        path: '/admin/checkOut',
        name: 'checkOut',
        component: () => import('@/components/admin/liveInfo/checkOut'),
        meta: { title: '退房管理' }
      },
      {
        path: '/admin/roomType',
        name: 'roomType',
        component: () => import('@/components/admin/RoomType'),
        meta: {
          title: '房型信息管理'
        }
      },
      {
        path: '/admin/roomType/edit',
        name: 'roomTypeEdit',
        component: () => import('@/components/admin/roomType/RoomTypeEdit'),
        meta: {
          title: '编辑房型'
        }
      },
      {
        path: '/admin/OrderManerage',
        name: 'OrderMangerage',
        component: () => import('@/components/admin/OrderManerage'),
        meta: {
          title: '订单管理'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

// 登录之后才能跳转到其他页面
router.beforeEach((to, from, next) => {
  const loginStatus = sessionStorage.token
  if (to.path === '/') {
    next()
  } else {
    loginStatus ? next() : next('/')
  }
})
export default router

<template>
  <div>
    <h4 class="nav-title">美居住宿管理系统</h4>
    <el-menu
      default-active="this.$router.path"
      @open="handleOpen"
      @close="handleClose"
      background-color="transparent"
      text-color="#c7c7c7"
      active-text-color="#4598f0"
      router
    >
      <el-menu-item index="/admin/index">
        <i class="el-icon-menu"></i>
        <span slot="title">动态房图</span>
      </el-menu-item>
      <el-menu-item index="/admin/checkIn">
        <i class="el-icon-plus"></i>
        <span slot="title">入住管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/checkOut">
        <i class="el-icon-error"></i>
        <span slot="title">退换房管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/roomManerage" v-if="operate">
        <i class="el-icon-s-home"></i>
        <span slot="title">房间管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/roomType" v-if="operate">
        <i class="el-icon-school"></i>
        <span slot="title">房型管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/OrderManerage">
        <i class="el-icon-document"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/UserManerage/Index" v-if="operate">
        <i class="el-icon-user"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  data () {
    return {
      userRole: '',
      operate: ''
    }
  },
  methods: {
    getInfoBytoken () {
      let token = sessionStorage.getItem('token')
      const decode = jwtDecode(token)
      this.userRole = decode.role
      if (this.userRole === '普通用户') {
        this.operate = false
      } else {
        this.operate = true
      }
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    goTo (path) {
      this.$router.push(path)
    }
  },
  created () {
    this.getInfoBytoken()
  }
}
</script>

<style>
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: #17202c !important;
}
.nav-title {
  height: 60px;
  position: relative;
  margin: 0;
  line-height: 60px;
  color: #fff;
  font-family: "宋体";
}
</style>

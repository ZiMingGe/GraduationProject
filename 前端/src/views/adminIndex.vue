<template>
  <el-container>
    <el-aside width="230px">
      <NavBar></NavBar>
    </el-aside>
    <el-container>
      <el-header>
        <BreadCrumb></BreadCrumb>
        <div class="system-title">
          <div class="user-notice">
            <el-dropdown>
              <div>
                <i class="el-icon-user-solid" style="font-size:20px"></i>
                <span class="user-info">{{ userName }}</span>
                <i class="el-icon-arrow-down"></i>
              </div>
              <el-dropdown-menu slot="dropdown" placement="bottom-start">
                <el-dropdown-item>
                  <span @click="logOut()">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavBar from '@/components/navBar/adminNavbar'
import jwtDecode from 'jwt-decode'
import BreadCrumb from '@/components/navBar/breadCrumb'
// import Index from '@/components/admin/Index'
export default {
  components: {
    NavBar,
    BreadCrumb

  },
  data () {
    return {
      userName: '',
      userRole: ''
    }
  },
  methods: {
    getInfoBytoken () {
      let token = sessionStorage.getItem('token')
      const decode = jwtDecode(token)
      this.userName = decode.name
      this.userRole = decode.role
      // console.log(decode)
    },
    logOut () {
      sessionStorage.removeItem('token')
      this.$router.replace('/')
    }
  },
  created () {
    this.getInfoBytoken()
  }
}
</script>

<style lang="less">
.el-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  line-height: 60px;
}
.user-notice {
  float: right;
  height: 60px;
  margin-right: 25px;
  padding-left: 16px;
  padding-right: 16px;
}
.system-title {
  width: 60%;
  height: 100%;
  float: right;
}
.user-notice:focus,
.user-notice:hover {
  background-color: #ecf5ff;
  color: #66b1ff !important;
}
.user-notice:focus,
.user-notice:hover .user-info {
  color: #66b1ff !important;
}

.el-main {
  color: #333;
  text-align: center;
  height: 100%;
  background-color: #faf9f9;
}
.el-aside {
  height: 100%;
  background-color: #38485c;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.el-aside .el-menu {
  border: none;
  text-align: center;
}
.el-aside .el-menu .el-menu-item {
  width: 100% !important;
  padding-left: 0px !important;
  padding-right: 18px;
}
</style>

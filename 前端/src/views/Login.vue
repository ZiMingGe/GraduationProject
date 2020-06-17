<template>
  <div class="login-container">
    <el-form
      status-icon
      class="login-form"
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-position="left"
      @keydown.enter.native="adminUserlogin"
    >
      <div class="title-container">
        <h3 class="title">登录系统</h3>
      </div>
      <el-form-item prop="userName">
        <span class="input-icon">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input type="text" autocomplete="off" v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <span class="input-icon">
          <i class="el-icon-lock"></i>
        </span>
        <el-input
          type="password"
          autocomplete="off"
          v-model="loginForm.passWord"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="login-button" @click="adminUserlogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import { adminUserlogin } from '@/api/user.js'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        userName: '',
        passWord: ''
      },
      rules: {
        userName: [{ validator: validateUser, tigger: 'blur' }],
        passWord: [{ validator: validatePass, tigger: 'blur' }]
      }
    }
  },
  methods: {
    adminUserlogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let user = {}
          user.name = this.loginForm.userName
          user.password = this.loginForm.passWord
          this.$store
            .dispatch('Login', user)
            .then(res => {
              if (res) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.$router.push('/admin/index')
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            }).catch(res => {
              // console.log(res)
              this.$message({
                message: res.msg,
                type: 'error'
              })
            })
          /*  adminUserlogin(user).then(res => {
             console.log(res)
             if (res.data.code === 200) {
               this.$message({
                 message: '登录成功',
                 type: 'success'
               })
               localStorage.setItem('token', res.data.data.token)
               // console.log(res.data.data.token)
               this.$router.push('/admin/index')
             } else {
               this.$message({
                 message: res.data.msg,
                 type: 'error'
               })
             }
           }) */
        }
      })
    }
  }
}
</script>

<style>
.login-container .el-input {
  display: inline-block;
  height: 47px;
  width: 90%;
}
.login-container .el-input input {
  background: transparent;
  border: 0px;
  -webkit-appearance: none;
  border-radius: 0px;
  padding: 12px 5px 12px 15px;
  color: #fff;
  height: 47px;
  caret-color: #fff;
}
.login-container .el-input input :-webkit-autofill {
  box-shadow: 0 0 0px 1000px #283443 inset !important;
  -webkit-text-fill-color: #fff !important;
}
.login-container .el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
}
.login-container {
  height: 100%;
  width: 100%;
  background-color: #283443;
  overflow: hidden;
}
.login-container .login-form {
  position: relative;
  width: 400px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}

.title-container {
  position: relative;
}
.title-container .title {
  font-size: 26px;
  color: #fff;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: bold;
}
.input-icon {
  width: 35px;
  height: 35px;
  font-size: 20px;
  color: rgb(160, 160, 160);
  vertical-align: middle;
  text-align: center;
}
.login-button {
  width: 100%;
  font-size: 18px;
  font-family: "宋体";
  font-weight: 700;
}
</style>

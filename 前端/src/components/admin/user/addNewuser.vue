<template>
  <div>
    <el-container>
      <el-card class="add-from-card">
        <el-row>
          <el-col :span="5">
            <goBack></goBack>
          </el-col>
          <el-col :span="14">
            <h4>添加新用户</h4>
          </el-col>
          <el-col :span="5"></el-col>
        </el-row>
        <el-form
          :model="addForm"
          status-icon
          :rules="regiestRule"
          ref="addForm"
          label-width="80px"
          class="regist-from"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input type="text" v-model="addForm.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户权限" prop="role">
            <el-select placeholder="请选择用户角色" v-model="addForm.role">
              <el-option label="普通用户" value="普通用户">普通用户</el-option>
              <el-option label="管理员" value="管理员" v-if="role">管理员</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-input type="password" v-model="addForm.passWord" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPass">
            <el-input type="password" v-model="addForm.confirmPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addUser()">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-container>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import { addUserByAdmin } from '@/api/user.js'
import goBack from '@/components/navBar/goBack'
export default {
  components: {
    goBack
  },
  data () {
    var validateuseName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateconfirmPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('确认密码不能为空'))
      } else if (value !== this.addForm.passWord) {
        return callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    var validateRole = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户角色不能为空'))
      } else {
        callback()
      }
    }
    return {
      role: false,
      addForm: {
        userName: '',
        role: '',
        passWord: '',
        confirmPass: ''
      },
      regiestRule: {
        userName: [{ validator: validateuseName, tigger: 'blur', required: true },
          { pattern: /^[a-zA-Z0-9]{4,16}$/, message: '用户名至少4-16个字符，可以为大写，小写字母和数字' }],
        passWord: [
          { validator: validatePassword, tigger: 'blur', required: true },
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/, message: '密码至少6-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符' }
        ],
        confirmPass: [{ validator: validateconfirmPass, tigger: 'blur', required: true }],
        role: [{ validator: validateRole, required: true }]
      }
    }
  },
  methods: {
    addUser () {
      this.$refs.addForm.validate(valid => {
        let newUer = {}
        newUer.name = this.addForm.userName
        newUer.password = this.addForm.passWord
        newUer.role = this.addForm.role
        addUserByAdmin(newUer).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.$refs.addForm.resetFields()
            this.$router.replace('/admin/UserManerage/Index')
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(() => { })
      })
    },
    getInfoBytoken () {
      let token = sessionStorage.getItem('token')
      const decode = jwtDecode(token)
      let userRole = decode.role
      if (userRole !== '超级管理员') {
        this.role = false
      } else {
        this.role = true
      }
      // console.log(decode)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    this.getInfoBytoken()
  }
}
</script>

<style>
.add-from-card {
  width: 50%;
  height: 100%;
  margin: 0 auto;
}
.regist-from {
  width: 90%;
  margin: 18px auto;
}
.regist-from .el-form-item {
  width: 60%;
  margin: 14px auto;
  margin-left: 25%;
  padding: 10px;
}
.regist-from .el-form-item .el-form-item__content {
  width: 60%;
  margin: 0 auto;
  margin-left: 0px;
}
.regist-from .el-form-item__error {
  text-align: left;
}
.regist-from .el-form-item .el-select {
  left: -7%;
}
</style>

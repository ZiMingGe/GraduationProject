<template>
  <div>
    <div>
      <div class="add-users">
        <el-button type="primary" @click="addNewUser()">添加新用户</el-button>
      </div>
      <div class="content-table">
        <el-table
          :data="userData"
          border
          style="width: 98%;margin:0 auto"
          :cell-style="centered"
          :header-cell-style="centered"
        >
          <el-table-column label="用户名">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户角色">
            <template slot-scope="scope">
              <el-tag size="medium" :type="role">
                {{
                scope.row.role
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建日期">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                v-if="edit"
              >修改用户角色</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                v-if="scope.row.deletable"
              >删除该用户</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="修改用户信息" :visible.sync="userDialogVisible" width="30%">
        <el-form ref="userInfo" v-model="userFrom" style="width:70%;margin:0 auto">
          <el-form-item label="用户名" prop="userName">{{userFrom.name}}</el-form-item>
          <el-form-item label="用户权限" prop="role">
            <el-select placeholder="请选择用户角色" v-model="userFrom.role">
              <el-option label="普通用户" value="普通用户">普通用户</el-option>
              <el-option label="管理员" value="管理员">管理员</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="editRole">提交</el-button>
            <el-button size="small" @click="userDialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import { adminUserInfoGet, deleteUserById, editUser } from '@/api/user.js'
import { formatDate } from '@/utli/Date.js'
export default {
  data () {
    return {
      edit: false,
      userData: [],
      role: '',
      formLabelWidth: '100px',
      centered: { textAlign: 'center' },
      userDialogVisible: false,
      userFrom: {}
    }
  },
  methods: {
    addNewUser () {
      this.$router.push('/admin/UserManerage/addNewUser')
    },
    handleDelete (index, row) {
      // console.log(row)
      let ids = { id: row._id }
      this.$confirm('此操作将永久删除该用户的所有信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteUserById(ids).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.getUserInfo()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => { })
      // console.log(index, row)
    },
    handleEdit (index, row) {
      // console.log(row)
      this.userDialogVisible = true
      this.userFrom = row
    },
    editRole () {
      this.$confirm('此操作将永久修改用户角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        editUser(this.userFrom).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.userDialogVisible = false
            this.getUserInfo()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => { })
    },
    async getUserInfo () {
      let res = await adminUserInfoGet()
      // console.log(res)
      this.userData = res.data.data
      let token = sessionStorage.getItem('token')
      let decode = jwtDecode(token)
      let userRole = decode.role
      // console.log(userRole)
      this.userData.map(item => {
        // console.log(item.role)
        let createDate = new Date(item.date)
        item.createDate = formatDate(createDate, 'yyyy-MM-dd hh:mm:ss')
        if (item.role === userRole && item.role !== '超级管理员') {
          item.deletable = false
        } else {
          item.deletable = true
        }
      })
    },
    getRoleBytoken () {
      let token = sessionStorage.getItem('token')
      let decode = jwtDecode(token)
      let userRole = decode.role
      // console.log(userRole)
      if (userRole !== '超级管理员') {
        this.edit = false
      } else {
        this.edit = true
      }
      // console.log(decode)
    }
  },

  created () {
    this.getUserInfo()
    this.getRoleBytoken()
  }
}
</script>

<style>
.add-users {
  width: 10%;
  margin: 18px;
  margin-left: -10px;
}
</style>

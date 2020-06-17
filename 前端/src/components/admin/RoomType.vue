<template>
  <div>
    <el-button
      icon="el-icon-plus"
      type="primary"
      class="add-type-button"
      @click="newTypeVisible=true"
    >新建房型</el-button>
    <el-table :data="roomTypelist" border style="width: 98%;margin:0 auto;">
      <el-table-column prop="name" label="房型名称"></el-table-column>
      <el-table-column prop="allowNum" label="可住人数"></el-table-column>
      <el-table-column label="房型图片">
        <template slot-scope="scope">
          <el-col v-for="(val,index) in scope.row.imageList" :span="4" :key="index">
            <el-image :src="val.url" lazy style="width:100%;height:32px"></el-image>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column prop="configure" label="配置"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新建房型-->
    <el-dialog title="新建房型" :visible.sync="newTypeVisible" center width="25%">
      <el-form
        :model="newTypeForm"
        style="width:90%;margin:0 auto"
        ref="newTypeForm"
        :rules="rules"
      >
        <el-form-item label="房型名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="newTypeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可入住人数" :label-width="formLabelWidth" prop="allwoNum">
          <el-input-number v-model="newTypeForm.allowNum" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addNewType, deleteType } from '@/api/roomType.js'
export default {
  data () {
    return {
      roomTypelist: [],
      newTypeVisible: false,
      newTypeForm: {},
      formLabelWidth: '100px',
      rules: {
        name: { required: true, message: '房型名称不能为空', tigger: 'blur' },
        allowNum: { required: true, tigger: 'blur', message: '请设置可入住人数' }
      }
    }
  },
  methods: {
    handleClick (row) {
      console.log(row)
      this.$router.replace({ path: '/admin/roomType/edit', query: { row } })
    },
    async getList () {
      let res = await getList()
      // console.log(res)
      this.roomTypelist = res.data.data
    },
    handleDelete (row) {
      this.$confirm(`此操作将永久删除${row.name}房间的所有信息, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let type = { _id: row._id, name: row.name }
        deleteType(type).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      })
    },
    addType () {
      this.$refs.newTypeForm.validate(valid => {
        if (valid) {
          let type = {}
          type.name = this.newTypeForm.name
          type.allowNum = this.newTypeForm.allowNum
          addNewType(type).then(res => {
            console.log(res)
            if (res.data.code === 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.newTypeVisible = false
              this.$refs.newTypeForm.resetFields()
              this.getList()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          }).catch(res => {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          })
        }
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style>
.add-type-button {
  display: block;
  margin: 16px 0 18px 15px;
}
</style>

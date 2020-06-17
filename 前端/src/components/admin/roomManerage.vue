<template>
  <div>
    <el-button
      icon="el-icon-plus"
      type="primary"
      class="add-button"
      @click="dialogFormVisible = true"
    >添加房间</el-button>
    <roomTable ref="roomTable"></roomTable>
    <!--弹窗添加房间信息-->
    <el-dialog title="添加房间" :visible.sync="dialogFormVisible" center width="25%">
      <el-form :model="roomForm" style="width:90%;margin:0 auto" ref="roomForm" :rules="rules">
        <el-form-item label="客房号" :label-width="formLabelWidth" prop="roomId" class="room-id">
          <el-input v-model="roomForm.roomId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房型" :label-width="formLabelWidth" prop="roomType" class="room-type">
          <el-select v-model="roomForm.roomType" placeholder="请选择房型">
            <el-option v-for="(val,index) in listData" :label="val" :value="val" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRooom()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRooom } from '@/api/room.js'
import roomTable from '@/components/admin/room/roomTable'
import { getNameList } from '@/api/roomType.js'
export default {
  components: {
    roomTable
  },
  data () {
    var validateId = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入客房号'))
      } else {
        callback()
      }
    }
    return {
      listData: [],
      roomForm: {
        roomId: '',
        roomType: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '70px',
      rules: {
        roomId: { validator: validateId, trigger: 'blur', required: true },
        roomType: { required: true, trigger: 'blur', message: '房型不能为空' }
      }
    }
  },
  methods: {
    addRooom () {
      this.$refs.roomForm.validate(valid => {
        if (valid) {
          let room = {}
          room.roomId = this.roomForm.roomId
          room.roomType = this.roomForm.roomType
          addRooom(room).then(res => {
            // console.log(res)
            if (res.data.code === 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.dialogFormVisible = false
              this.$refs.roomForm.resetFields()
              this.$refs.roomTable.getRoomInfo()
              // this.$router.go(0)
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
    },
    async getList () {
      let res = await getNameList()
      // console.log(res)
      this.listData = res.data.data.data
      // console.log(this.listData)
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style>
.add-button {
  margin-bottom: 16px;
  float: left;
  margin-left: 16px;
}
.room-id {
  width: 60%;
  margin: auto;
  margin-bottom: 18px;
}
.room-type {
  width: 60%;
  margin: auto;
}
</style>

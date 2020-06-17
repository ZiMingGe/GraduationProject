<template>
  <el-dialog title="续住房间" :visible.sync="continueVisible" center style="width:45%;margin:0 auto;">
    <el-form :model="continueFrom" ref="continueFrom" label-width="110px">
      <el-form-item label="续住日期">
        <el-date-picker
          v-model="continueFrom.continueTime"
          type="datetime"
          placeholder="选择日期时间"
          :picker-options="pickerOptions"
          default-time="12:30:00"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="continueVisible = false">取 消</el-button>
      <el-button type="primary" @click="continueLive">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { continueLive } from '@/api/order.js'
export default {
  data () {
    return {
      continueVisible: false,
      leaveTime: new Date(),
      continueFrom: {
        outTradNo: '',
        continueTime: '',
        roomId: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    continueLive () {
      this.$confirm(`此操作将会让客人继续入住房间, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        continueLive(this.continueFrom).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.$router.go(0)
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>

<style>
</style>

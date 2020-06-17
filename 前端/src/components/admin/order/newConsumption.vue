<template>
  <div>
    <el-dialog title="新增消费" :visible.sync="newVisible" width="35%" center>
      <el-form
        :model="consumption.detail"
        label-width="80px"
        ref="consumption"
        :rules="conRule"
        class="consumption-from"
      >
        <el-form-item label="订单号" prop="outTradNo">
          <el-select v-model="consumption.outTradNo">
            <el-option v-for="(item,index) in outTradNo" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消费项目" prop="conName">
          <el-input
            type="text"
            v-model="consumption.detail.conName"
            autocomplete="off"
            placeholder="请输入消费项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="消费金额" prop="amounts">
          <el-input-number
            v-model="consumption.detail.amounts"
            controls-position="right"
            :min="0"
            style="float:left"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="消费时间" prop="conTime">
          <el-date-picker
            v-model="consumption.detail.conTime"
            type="datetime"
            placeholder="请选择消费日期"
            style="float:left"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="newVisible= false">取 消</el-button>
        <el-button type="primary" @click="addConsumption">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addConsumption } from '@/api/order.js'
export default {
  data () {
    var validateTradNo = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择订单号'))
      } else {
        callback()
      }
    }
    var validateConName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入消费项目名称'))
      } else {
        callback()
      }
    }
    var validateAmounts = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入消费金额'))
      } else if (value <= 0) {
        return callback(new Error('消费金额不能为0'))
      } else {
        callback()
      }
    }
    var validateDate = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择对应的时间'))
      } else {
        callback()
      }
    }
    return {
      newVisible: false,
      outTradNo: [],
      consumption: {
        outTradNo: '',
        detail: {
          conName: '',
          amounts: '',
          conTime: ''
        }
      },
      startTime: '',
      endTime: '',
      conRule: {
        outTradNo: { validator: validateTradNo, required: true, trigger: 'change' },
        conName: { validator: validateConName, required: true, trigger: 'blur' },
        amounts: { validator: validateAmounts, required: true, trigger: 'blur' },
        conTime: { validator: validateDate, type: 'date', required: true, trigger: 'change' }
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 禁用以前的日期，今天不禁用
        }
      }
    }
  },
  methods: {
    addConsumption () {
      console.log(this.consumption)
      this.$refs.consumption.validate(valid => {
        if (valid) {
          addConsumption(this.consumption).then(res => {
            console.log(res)
            if (res.data.code === 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.newVisible = false
              this.$router.go(0)
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    changeNo (val) {
      this.consumption.outTradNo = val
    }
  },
  watch: {
    newVisible: function (val) {
      if (val === false) {
        this.$refs.consumption.resetFields()
      }
    }
  }

}
</script>

<style>
.consumption-from {
  width: 70%;
  margin: 0 auto;
}
</style>

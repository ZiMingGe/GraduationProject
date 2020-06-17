<template>
  <div>
    <el-container style="width:100%">
      <el-card class="check-in-card">
        <h4 class="checkIn-title">登记入住</h4>
        <el-form
          :model="customerForm"
          status-icon
          :rules="customerRule"
          ref="customerForm"
          label-width="80px"
          class="check-in-form"
        >
          <el-form-item label="姓名" prop="name" class="inline-info">
            <el-input
              type="text"
              v-model="customerForm.name"
              autocomplete="off"
              placeholder="请输入顾客姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="IDNum" class="inline-info">
            <el-input
              type="text"
              v-model="customerForm.IDNum"
              autocomplete="off"
              placeholder="请输入顾客身份证号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="telNum" class="inline-info">
            <el-input
              type="text"
              v-model="customerForm.telNum"
              autocomplete="off"
              placeholder="请输入顾客手机号"
            ></el-input>
          </el-form-item>
          <el-button type="tetx" icon="el-icon-plus" style="border:none" @click=" addItem ()"></el-button>
          <div v-for="(item,index) in customerForm.newItem" :key="index">
            <el-form-item
              label="姓名"
              :prop="'newItem.'+index+'.name'"
              class="inline-info"
              :rules=" [{ tigger: 'blur', required: true,message:'姓名不能为空' }]"
            >
              <el-input type="text" v-model="item.name" autocomplete="off" placeholder="请输入顾客姓名"></el-input>
            </el-form-item>
            <el-form-item
              label="身份证号"
              :prop="'newItem.'+index+'.IDNum'"
              class="inline-info"
              :rules="[
          {  tigger: 'blur', required: true,message:'身份证号码不能为空' },
          { pattern: /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/, message: '身份证号格式错误' }
        ]"
            >
              <el-input
                type="text"
                v-model="item.IDNum"
                autocomplete="off"
                placeholder="请输入顾客身份证号码"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="手机号"
              :prop="'newItem.'+index+'.telNum'"
              class="inline-info"
              :rules="[
          {  tigger: 'blur', required: true , message: '手机号码不能为空'},
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号格式不正确' }
        ]"
            >
              <el-input type="text" v-model="item.telNum" autocomplete="off" placeholder="请输入顾客手机号"></el-input>
            </el-form-item>
            <el-button
              type="tetx"
              icon="el-icon-delete"
              style="border:none"
              @click="deleteItem (item, index)"
            ></el-button>
          </div>
          <el-form-item label="房间号" prop="roomId" class="block-info">
            <el-select placeholder="请选择房间号" v-model="customerForm.roomId">
              <el-option
                v-for="item in roomSelect"
                :value="item.roomId"
                :label="item.roomId"
                :key="item.roomId"
                :disabled="item.select"
              >
                <span class="roomId-select">{{item.roomId}}</span>
                <span class="rooomType-said">{{item.roomType}}</span>
                <span style="float:right">
                  <el-tag :type="item.status" class="roomStatus-select">{{item.roomStatus}}</el-tag>
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期" required class="block-info">
            <el-col :span="14">
              <el-form-item prop="arriveTime">
                <el-date-picker
                  v-model="customerForm.arriveTime"
                  type="datetime"
                  placeholder="请选择入住时间"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <span>-</span>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="leaveTime">
                <el-date-picker
                  v-model="customerForm.leaveTime"
                  type="datetime"
                  placeholder="请选择退房时间"
                  :picker-options="pickerOptions"
                  default-time="12:30:00"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="备注" prop="remark" class="block-info">
            <el-input type="textarea" v-model="customerForm.remark" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="checkIn()" :disabled="success">登记</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-container>
  </div>
</template>

<script>
import { getRoomList } from '@/api/room.js'
import { checkIn } from '@/api/stay.js'
export default {
  data () {
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'))
      } else {
        callback()
      }
    }
    var validateIDcardNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('身份证号不能为空'))
      } else {
        callback()
      }
    }
    var validatetelNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        callback()
      }
    }
    var validatetelroomId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('房间号不能为空'))
      } else {
        this.roomSelect.map(item => {
          if (item.roomId === value) {
            if (item.roomStatus !== '空房') {
              this.success = true
              return callback(new Error('该房间不能入住'))
            } else {
              this.success = false
              callback()
            }
          } else {
            callback()
          }
        })
        callback()
      }
    }
    var validateTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('时间不能为空'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 禁用以前的日期，今天不禁用
        }
      },
      customerForm: {
        roomId: '',
        name: '',
        IDNum: '',
        telNum: '',
        newItem: [],
        remark: '',
        arriveTime: '',
        leaveTime: ''
      },
      roomSelect: [],
      success: false,
      customerRule: {
        name: [{ validator: validateName, tigger: 'blur', required: true }],
        IDNum: [
          { validator: validateIDcardNum, tigger: 'blur', required: true },
          { pattern: /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/, message: '身份证号格式错误' }
        ],
        telNum: [
          { validator: validatetelNum, tigger: 'blur', required: true },
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号格式不正确' }
        ],
        roomId: [
          { required: true, validator: validatetelroomId, tigger: 'change' }
        ],
        arriveTime: [{ required: true, tigger: 'change', validator: validateTime }],
        leaveTime: [{ required: true, tigger: 'change', validator: validateTime }]
      }
    }
  },
  methods: {
    async getList () {
      let res = await getRoomList()
      // console.log(res)
      this.roomSelect = res.data.data
      this.roomSelect.map(item => {
        if (item.roomStatus === '空房') {
          item.status = 'success'
          item.select = false
        } else if (item.roomStatus === '入住中') {
          item.status = 'danger'
          item.select = true
        } else {
          item.status = 'warning'
          item.select = true
        }
      })
    },
    async checkIn () {
      this.$refs.customerForm.validate(valid => {
        let customer = this.customerForm
        // this.success = false
        checkIn(customer).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            // this.getList()
            this.$router.replace('/admin/checkOut')
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(() => { })
      })
    },
    addItem () {
      this.customerForm.newItem.push({
        name: '',
        IDNum: '',
        telNum: ''
      })
    },
    deleteItem (item, index) {
      this.customerForm.newItem.splice(index, 1)
    }
  },
  created () {
    this.getList()
  },
  watch: {

  }
}
</script>

<style>
.checkIn-title {
  margin-bottom: 26px;
}
.check-in-card {
  width: 90%;
  margin: 0 auto;
}
.check-in-form {
  width: 100%;
  margin: 0 auto;
}
.inline-info {
  width: 30%;
  display: inline-block;
}
.block-info {
  width: 32%;
  margin-left: 3%;
}
.check-in-form .el-form-item .el-select {
  width: 65%;
  left: -18%;
}
.check-in-form .el-form-item .el-textarea {
  min-height: 70px;
}
.check-in-form .el-form-item .el-textarea .el-textarea__inner {
  height: 70px;
}
.roomId-select {
  float: left;
  font-weight: bold;
  color: rgb(156, 156, 156);
}
.rooomType-said {
  clear: both;
  margin-left: 30px;
  font-weight: bold;
  font-size: 15px;
  font-family: "黑体";
}
.roomStatus-select.el-tag {
  border-radius: 30px;
}
</style>

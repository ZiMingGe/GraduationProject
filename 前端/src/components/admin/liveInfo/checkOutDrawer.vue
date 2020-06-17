<template>
  <div>
    <el-drawer
      :visible.sync="settleVisible"
      :title="roomData.roomId"
      class="checkOut-drawer"
      size="40%"
    >
      <el-divider class="drawer-divider"></el-divider>
      <el-row class="order-info-title">
        <el-col :span="12" class="row-info">
          <span class="room-explain">订单号:</span>
          <span class="room-info" v-for="(val,index) in orderInfo" :key="index">{{val.outTradNo}};</span>
        </el-col>
        <el-col :span="12" class="row-info">
          <span class="room-explain">房型:</span>
          <span class="room-info">{{roomData.roomType}}</span>
        </el-col>
        <el-col :span="12" class="row-info">
          <span class="room-explain">订单状态:</span>
          <span class="room-info" v-for="(val,index) in orderInfo" :key="index">{{val.Status}};</span>
        </el-col>
        <el-col :span="12" class="row-info">
          <span class="room-explain">房价:</span>
          <span
            class="room-info"
          >{{priceInfo.Price}}元/{{priceInfo.timeAmount}}{{priceInfo.timeUnit}}</span>
        </el-col>
        <el-col :span="12" class="row-info">
          <span class="room-explain">入住时间:</span>
          <span class="room-info">{{roomData.liveTime}}</span>
        </el-col>
        <el-col :span="12" class="row-info">
          <span class="room-explain">退房时间:</span>
          <span class="room-info">{{roomData.outTime}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row class="drawer-info-title">客户信息:</el-row>
      <el-table :data="roomData.Customer" style="width: 95%;margin:10px auto;" border>
        <el-table-column label="姓名" prop="name" width="80px"></el-table-column>
        <el-table-column label="手机号" prop="telNum" width="120px"></el-table-column>
        <el-table-column label="身份证号" prop="IDNum"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
      </el-table>
      <el-divider></el-divider>
      <el-row class="drawer-info-title">消费明细:</el-row>
      <el-form>
        <el-table :data="consumption" style="width: 95%;margin:10px auto;" border>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row.detail" style="width: 100%;margin:0 auto;" border>
                <el-table-column label="消费项目" prop="conName"></el-table-column>
                <el-table-column label="消费金额" prop="amounts"></el-table-column>
                <el-table-column label="消费时间" prop="conTime" :formatter="formatDate"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="订单号" prop="outTradNo"></el-table-column>
          <el-table-column label="消费金额" prop="totalSum"></el-table-column>
        </el-table>
      </el-form>
      <el-row class="consumption-total">总消费:{{consumption.totalSum}}</el-row>
      <el-divider></el-divider>
      <div class="check-button-group">
        <el-row :gutter="8" class="button-row">
          <el-col :span="16">
            <el-checkbox v-model="checked" style="margin-left:20px;" size="medium">房间已经进行检查</el-checkbox>
          </el-col>
          <el-col :span="4">
            <el-button style="width:100%" type="primary" @click="addNew">新增消费</el-button>
          </el-col>
          <el-col :span="4">
            <el-button
              :type="sumButtonType"
              style="width:100%"
              :disabled="sumAble"
              @click="sumUp"
            >结账退房</el-button>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <NewConsumption ref="newConsumption"></NewConsumption>
  </div>
</template>

<script>
import { checkOut } from '@/api/stay.js'
import { formatDate } from '@/utli/Date.js'
import NewConsumption from '@/components/admin/order/newConsumption'
export default {
  components: {
    NewConsumption
  },
  data () {
    return {
      settleVisible: false,
      roomData: {},
      priceInfo: {},
      orderInfo: {},
      consumption: [],
      checked: false,
      sumAble: true,
      sumButtonType: 'info'
    }
  },
  methods: {
    sumUp () {
      this.$confirm(`是否对${this.roomData.roomId}房间的顾客进行结账操作, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let info = {
          room_id: this.roomData._id,
          outTradNo: this.orderInfo.outTradNo,
          customer_id: [],
          roomId: this.roomData.roomId,
          tradeAmount: this.consumption.totalSum
        }
        this.roomData.Customer.map(id => {
          info.customer_id.push(id._id)
        })
        console.log(info)
        checkOut(info).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.$router.replace('/admin/OrderManerage')
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      })
    },
    addNew () {
      let outTradNo = []
      this.orderInfo.map(item => {
        outTradNo.push(item.outTradNo)
      })
      this.$refs.newConsumption.newVisible = true
      this.$refs.newConsumption.outTradNo = outTradNo
      this.$refs.newConsumption.startTime = this.roomData.arriveTime
      this.$refs.newConsumption.endTime = this.roomData.leaveTime
    },
    formatDate (row, column) {
      let data = row[column.property]
      let date = new Date(data)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  watch: {
    checked: function (val) {
      if (val === false) {
        this.sumAble = true
        this.sumButtonType = 'info'
      } else {
        this.sumAble = false
        this.sumButtonType = 'primary'
      }
    }
  }
}
</script>

<style>
.checkOut-drawer {
  text-align: left;
}
.checkOut-drawer .el-drawer__header {
  font-weight: bold;
  font-size: 20px;
  padding-bottom: 0px;
  margin-bottom: 0px;
  color: #4e4e4e;
}
.order-info-title {
  width: 95%;
  margin: 0 auto;
}
.checkOut-drawer .room-explain {
  color: #808080;
  font-size: 14px;
  text-align: right;
}
.checkOut-drawer .room-info {
  font-size: 13px;
}
.checkOut-drawer .row-info {
  margin-top: 10px;
  text-align: left;
}
.checkOut-drawer .drawer-info-title {
  width: 95%;
  margin: 0 auto;
  font-weight: bold;
  font-size: 14px;
}
.drawer-divider {
  margin-top: 16px;
  margin-bottom: 16px;
}
.consumption-total {
  width: 94%;
  margin: 0 auto;
  color: #808080;
  font-size: 13px;
  margin-top: 16px;
}

.check-button-group .button-row {
  width: 95%;
  margin: 0 auto;
}
</style>

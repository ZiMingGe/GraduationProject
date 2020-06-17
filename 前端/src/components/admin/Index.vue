<template>
  <div>
    <div>
      <el-card>
        <el-row style="border-bottom: #e4e7ed 0.5px dashed;">
          <el-col :span="16">
            <h3 class="atrial-chart">动态房图</h3>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="10">
              <el-col :span="3" v-for="(item,index) in statusInfo" :key="index">
                <el-button
                  :style="item.style"
                  @click="getByStatus(item,index)"
                  class="buttonStyle"
                  circle
                  size="mini"
                >{{item.val}}</el-button>
              </el-col>
              <el-col :span="9"></el-col>
            </el-row>
          </el-col>
        </el-row>
        <p v-if="datalength" class="no-data">暂无数据</p>
        <el-row class="room-chart" v-for="(item,index) in dataArr" :key="index" :gutter="8">
          <h5 class="room-type-name">{{item.roomType}}</h5>
          <el-col :span="3" v-for="(val, index) in item.List" :key="index">
            <el-card
              :body-style="val.background"
              class="room-chart-card"
              @click.native="ShowInfo(val,index)"
            >
              <h3 class="room-chart-id">{{val.roomId}}</h3>
              <p>
                <span
                  class="customer-name"
                  v-for="(name,index) in val.customer"
                  :key="index"
                >{{name}}</span>
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <Drawer ref="drawer"></Drawer>
    </div>
  </div>
</template>

<script>
import { getByroomtype, updateStatus, getInfoByStatus, getInfoByRoom } from '@/api/stay.js'
import Drawer from '@/components/admin/index/drawer'
export default {
  components: {
    Drawer
  },
  data () {
    return {
      dataArr: [],
      statusInfo: [
        { style: 'backgroundColor: #409eff;', val: '全部' },
        { style: 'backgroundColor: #5abe88;', val: '空房' },
        { style: 'backgroundColor:#F06765', val: '入住中' },
        { style: 'backgroundColor:#E6A23C', val: '打扫中' },
        { style: 'backgroundColor:#b9c3ca', val: '故障' },
        { style: 'backgroundColor:#b60707', val: '超时' }
      ],
      datalength: false,
      infoVisible: false
    }
  },
  methods: {
    async getInfo () {
      let res = await getByroomtype()
      console.log(res)
      this.dataArr = res.data.data
      this.dataArr.map(item => {
        item.List.map(val => {
          if (val.roomStatus === '空房') {
            val.background = { backgroundColor: '#5abe88' }
          } else if (val.roomStatus === '入住中') {
            val.background = { backgroundColor: '#F06765' }
          } else if (val.roomStatus === '打扫中') {
            val.background = { backgroundColor: '#E6A23C' }
          } else if (val.roomStatus === '故障') {
            val.background = { backgroundColor: '#b9c3ca' }
          } else {
            val.background = { backgroundColor: '#b60707' }
          }
          let leave = new Date(val.leaveTime)
          let nowDate = new Date()
          let now = nowDate.getTime()
          let time = leave.getTime()
          let diff = now - time
          item.diffHour = Math.floor(diff / 1000 / 60 / 60)
          if (item.diffHour > 1 && item.roomStatus === '入住中') {
            updateStatus(item).then(res => {
              console.log(res)
            })
          }
        })
      })
    },
    getByStatus (item, index) {
      if (index === 0) {
        this.getInfo()
        this.datalength = false
      } else {
        let status = { roomStatus: item.val }
        getInfoByStatus(status).then(res => {
          // console.log(res)
          if (res) {
            this.dataArr = res.data.data
            if (this.dataArr.length === 0) {
              this.datalength = true
            } else {
              this.datalength = false
              this.dataArr.map(val => {
                val.List.map(i => {
                  if (i.roomStatus === item.val) {
                    i.background = item.style
                  }
                })
              })
            }
          }
        })
      }
    },
    async ShowInfo (val, index) {
      this.$refs.drawer.visible = true
      this.$refs.drawer.roomData = val
      let room = { roomId: val.roomId, roomType: val.roomType }
      let res = await getInfoByRoom(room)
      console.log(res)
      this.$refs.drawer.imgList = res.data.res.data.imageList
      this.$refs.drawer.price = res.data.res.data.Price
      this.$refs.drawer.customer = res.data.res.data.customerInfo
      // this.$refs.drawer.getImgAndPrice()
      // console.log(val)
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>

<style>
.atrial-chart {
  text-align: left;
  margin: 0;
  padding-bottom: 10px;
}
.color-info {
  width: 15px;
  height: 15px;
  border-radius: 20px;
  margin-right: 0;
  display: inline-block;
  position: relative;
  top: 3px;
}
.color-font {
  font-size: 10px;
  display: inline-block;
  margin-left: 5px;
}
.room-chart {
  margin-top: 16px;
}
.room-type-name {
  text-align: left;
  margin: 18px 5px 16px 6px;
}
.room-chart-id {
  display: block;
  width: 20%;
  color: #ebebeb;
  margin: 0;
}
.room-chart-card .el-card__body {
  height: 57px;
}
.customer-name {
  width: 100px;
  height: 15px;
  font-size: 10px;
  margin-top: 25px;
  margin-left: 10px;
  color: #ebebeb;
  text-align: left;
}
.buttonStyle {
  width: 100%;
  font-size: 5px;
  color: #ebebeb;
  padding: 15px;
}
.no-data {
  line-height: 60px;
  width: 50%;
  color: #909399;
  margin: 15px auto;
  font-size: 13px;
}
</style>

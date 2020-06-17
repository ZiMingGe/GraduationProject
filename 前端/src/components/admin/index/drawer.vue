<template>
  <div>
    <el-drawer :visible.sync="visible" :title="roomData.roomId" class="index-drawer">
      <div>
        <el-row :gutter="10">
          <el-col :span="5">
            <span class="info-title">房间信息</span>
          </el-col>
        </el-row>
        <el-row style="width:90%;margin:0 auto;">
          <el-col :span="12" class="row-info">
            <span class="room-explain">房型:</span>
            <span class="room-info">{{roomData.roomType}}</span>
          </el-col>
          <el-col :span="12" class="row-info">
            <span class="room-explain">房间状态:</span>
            <span class="room-info">{{roomData.roomStatus}}</span>
          </el-col>
          <el-col :span="12" class="row-info">
            <span class="room-explain">入住时间:</span>
            <span class="room-info">{{roomData.arriveTime}}</span>
          </el-col>
          <el-col :span="12" class="row-info">
            <span class="room-explain">退房时间:</span>
            <span class="room-info">{{roomData.leaveTime}}</span>
          </el-col>
          <el-col :span="12" class="row-info">
            <span class="room-explain">房间价格:</span>
            <span class="room-info">{{price.Price}}元/{{price.timeAmount}}{{price.timeUnit}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="5">
            <span class="info-title">房间图片</span>
          </el-col>
        </el-row>
        <el-carousel trigger="click" height="250px" class="typeImg-list">
          <el-carousel-item v-for="(item,index) in imgList" :key="index">
            <el-image :src="item.url"></el-image>
          </el-carousel-item>
        </el-carousel>
        <el-row :gutter="10">
          <el-col :span="5">
            <span class="info-title">客户信息</span>
          </el-col>
        </el-row>
        <el-table :data="customer" style="width: 95%;margin:10px auto;" border>
          <el-table-column label="姓名" prop="name" width="80px"></el-table-column>
          <el-table-column label="电话" prop="telNum" width="120px"></el-table-column>
          <el-table-column label="身份证号" prop="IDNum"></el-table-column>
          <el-table-column label="其他" prop="remark"></el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// import { getInfoByRoom } from '@/api/stay.js'
export default {
  data () {
    return {
      visible: false,
      roomData: {},
      room: {
        roomId: '',
        roomType: ''
      },
      imgList: [],
      price: '',
      customer: []
    }
  },
  methods: {

  }
}
</script>

<style>
.index-drawer .el-drawer__header {
  font-weight: bold;
  color: black;
  font-size: 20px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 3px;
  margin-bottom: 0px;
}
.info-title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 12px;
}
.room-explain {
  color: #808080;
  font-size: 15px;
  text-align: right;
}
.typeImg-list {
  width: 90%;
  margin: 15px auto;
}
.room-info {
  font-size: 10px;
}
.row-info {
  margin-top: 10px;
}
</style>

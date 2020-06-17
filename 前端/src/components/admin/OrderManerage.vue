<template>
  <div>
    <el-card class="order-manger">
      <el-form
        ref="searchFrom"
        :model="searchForm"
        class="room-search"
        label-width="70px"
        :inline="true"
      >
        <el-form-item label="房间号" prop="roomId">
          <el-select v-model="searchForm.roomId" placeholder="请选择房间号">
            <el-option value label="全部"></el-option>
            <el-option
              v-for="(value,index) in roomList"
              :value="value.roomId"
              :label="value.roomId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop="Status">
          <el-select v-model="searchForm.Status" placeholder="请选择订单状态">
            <el-option value label="全部"></el-option>
            <el-option v-for="(value,index) in Status" :value="value" :label="value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchOrder">搜索</el-button>
          <el-button @click="resetFrom">返回</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="orderData"
        border
        :cell-style="cellStyle"
        :default-sort="{prop:'Status',order: 'descending'}"
      >
        <el-table-column label="订单号">
          <template slot-scope="scope">
            <el-button type="text">{{scope.row.outTradNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="roomId"></el-table-column>
        <el-table-column label="入住人">
          <template slot-scope="scope">
            <span v-for="(name,index) in scope.row.name" :key="index">
              {{name}}
              <span v-if="scope.row.num">,</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="入住时间" prop="liveTime"></el-table-column>
        <el-table-column label="退房时间" prop="outTime"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="交易金额" prop="tradAmount"></el-table-column>
        <el-table-column label="订单状态" prop="Status" width="120px" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="medium"
              type="text"
              v-if="scope.row.operate"
              @click="continueLive(scope.$index, scope.row)"
            >修改退房时间</el-button>
            <el-button size="medium" type="text" @click="handleEdit(scope.$index, scope.row)">订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, total"
        :current-page="pagination.currentPage"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @next-click="changePage"
        @prev-click="changePage "
        @current-change="changePage"
        style="margin-top:16px"
        hide-on-single-page
      ></el-pagination>
      <ContinueLive ref="continue"></ContinueLive>
    </el-card>
  </div>
</template>

<script>
import { getRoomList } from '@/api/room.js'
import { getList, searchOrder } from '@/api/order.js'
import { formatDate } from '@/utli/Date.js'
import ContinueLive from '@/components/admin/liveInfo/continueLive'
export default {
  components: {
    ContinueLive
  },
  data () {
    return {
      roomList: [],
      Status: ['进行中', '已完成', '已失效'],
      searchForm: {
        roomId: '',
        Status: ''
      },
      orderData: [],
      pagination: {
        currentPage: 1,
        total: 15,
        pageSize: 10
      },
      searchData: {
        outTradNo: '',
        roomId: ''

      }
    }
  },
  methods: {
    async getRoomList () {
      let res = await getRoomList()
      // console.log(res)
      this.roomList = res.data.data
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      // console.log(row)
      if (column.label === '订单状态' && row.Status === '已完成') {
        return 'color:#5abe88'
      } else if (column.label === '订单状态' && row.Status === '进行中') {
        return 'color:#16b8eb'
      }
    },
    async getList () {
      let page = {
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      let res = await getList(page)
      // console.log(res)
      this.orderData = res.data.data.result
      this.pagination.total = res.data.data.total
      this.orderData.map(item => {
        if (item.name.length !== 1) {
          item.num = true
        } else {
          item.num = false
        }
        if (item.arriveTime !== null && item.leaveTime !== null) {
          let arrive = new Date(item.arriveTime)
          item.liveTime = formatDate(arrive, 'yyyy-MM-dd hh:mm:ss')
          let leave = new Date(item.leaveTime)
          item.outTime = formatDate(leave, 'yyyy-MM-dd hh:mm:ss')
        }
        if (item.Status !== '已完成' && item.Status !== '已失效') {
          item.operate = true
        } else {
          item.operate = false
        }
      })
    },
    handleEdit (index, row) {
      console.log(row)
    },
    async changePage (currentPage, pageSize) {
      pageSize = this.pagination.pageSize
      let page = { currentPage, pageSize }
      let res = await getList(page)
      // console.log(res)
      this.orderData = res.data.data.result
      this.pagination.total = res.data.data.total
      this.orderData.map(item => {
        if (item.name.length !== 1) {
          item.num = true
        } else {
          item.num = false
        }
        if (item.arriveTime !== null && item.leaveTime !== null) {
          let arrive = new Date(item.arriveTime)
          item.liveTime = formatDate(arrive, 'yyyy-MM-dd hh:mm:ss')
          let leave = new Date(item.leaveTime)
          item.outTime = formatDate(leave, 'yyyy-MM-dd hh:mm:ss')
        }
        if (item.Status !== '已完成' && item.Status !== '已失效') {
          item.operate = true
        } else {
          item.operate = false
        }
      })
    },
    async searchOrder () {
      console.log(this.searchForm)
      let page = {
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      let order = {}
      for (let key in this.searchForm) {
        if (this.searchForm[key] !== '') {
          order[key] = this.searchForm[key]
        }
      }
      page.order = order
      let res = await searchOrder(page)
      console.log(res)
      this.orderData = res.data.data.result
      this.pagination.total = res.data.data.total
      this.orderData.map(item => {
        if (item.name.length !== 1) {
          item.num = true
        } else {
          item.num = false
        }
        if (item.arriveTime !== null && item.leaveTime !== null) {
          let arrive = new Date(item.arriveTime)
          item.liveTime = formatDate(arrive, 'yyyy-MM-dd hh:mm:ss')
          let leave = new Date(item.leaveTime)
          item.outTime = formatDate(leave, 'yyyy-MM-dd hh:mm:ss')
        }
        if (item.Status !== '已完成' && item.Status !== '已失效') {
          item.operate = true
        } else {
          item.operate = false
        }
      })
    },
    continueLive (index, row) {
      this.$refs.continue.continueVisible = true
      this.$refs.continue.continueFrom.outTradNo = row.outTradNo
      this.$refs.continue.continueFrom.roomId = row.roomId
      this.$refs.continue.leaveTime = new Date(row.leaveTime)
      console.log(row)
      console.log(this.$refs.continue.continueFrom)
      console.log(new Date(row.leaveTime))
    },
    resetFrom () {
      this.$refs.searchFrom.resetFields()
      this.getList()
    }
  },
  created () {
    this.getList()
    this.getRoomList()
  }
}
</script>

<style>
.order-manger .room-search {
  clear: both;
  width: 90%;
  margin-top: 8px;
  padding-top: 10px;
}
</style>

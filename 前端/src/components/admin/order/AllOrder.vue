<template>
  <div>
    <el-table :data="orderData" border :cell-style="cellStyle">
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
      <el-table-column label="订单状态" prop="Status" width="100px"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="medium" type="text" v-if="scope.row.operate">一键续住</el-button>
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
  </div>
</template>

<script>
import { getList } from '@/api/order.js'
import { formatDate } from '@/utli/Date.js'
export default {
  data() {
    return {
      orderData: [],
      pagination: {
        currentPage: 1,
        total: 15,
        pageSize: 10
      }
    }
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log(row)
      if (column.label === '订单状态' && row.Status === '已完成') {
        return 'color:#5abe88'
      } else if (column.label === '订单状态' && row.Status === '进行中') {
        return 'color:#16b8eb'
      }
    },
    async getList() {
      let page = {
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      let res = await getList(page)
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
        if (item.Status !== '已完成') {
          item.operate = true
        } else {
          item.operate = false
        }
      })
    },
    handleEdit(index, row) {
      console.log(row)
    },
    async changePage(currentPage, pageSize) {
      pageSize = this.pagination.pageSize
      let page = { currentPage, pageSize }
      let res = await getList(page)
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
        if (item.Status !== '已完成') {
          item.operate = true
        } else {
          item.operate = false
        }
      })
    }

  },
  created() {
    this.getList()
  }
}
</script>

<style>
</style>

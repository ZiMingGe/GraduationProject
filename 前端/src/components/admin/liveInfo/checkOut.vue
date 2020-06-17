<template>
  <div style="width:100%">
    <el-form class="search-thing">
      <el-form-item prop="roomId">
        <el-input type="text" autocomplete="off" v-model="searchForm.roomId" placeholder="请输入房间号"></el-input>
      </el-form-item>
      <el-form-item style="width:100px">
        <el-button type="primary" size="mini" style="height:32px">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 97%;margin:0 auto;"
      :default-sort="{prop:'roomId',order: 'ascending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.Customer" style="width: 100%;margin:0 auto;" border>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="电话" prop="telNum"></el-table-column>
            <el-table-column label="身份证号" prop="IDNum"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="操作" width="120px" v-if="scope.row.one">
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="primary"
                  @click="singleChange(scope.$index, scope.row)"
                >换房</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="房间号" prop="roomId" sortable></el-table-column>
      <el-table-column label="房价">
        <template
          slot-scope="scope"
        >{{scope.row.priceInfo[0].Price}}元/{{scope.row.priceInfo[0].timeAmount}}{{scope.row.priceInfo[0].timeUnit}}</template>
      </el-table-column>
      <el-table-column label="入住人数" prop="customerNum"></el-table-column>
      <el-table-column label="入住时间" prop="liveTime"></el-table-column>
      <el-table-column label="退房时间" prop="outTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="medium"
            :type="scope.row.buttonType"
            @click="handleEdit(scope.$index, scope.row)"
            :disabled="scope.row.num"
          >退房</el-button>
          <el-button
            size="medium"
            :type="scope.row.buttonType"
            @click="handleChange(scope.$index, scope.row)"
            :disabled="scope.row.num"
          >一键换房</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, total"
      :current-page="pagination.currentPage"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :page-count="5"
      @next-click="changePage"
      @prev-click="changePage "
      @current-change="changePage"
      style="margin-top:16px"
      hide-on-single-page
    ></el-pagination>
    <!-- 换房操作 -->
    <el-dialog title="换房" :visible.sync="changeVisible" center style="width:50%;margin:0 auto;">
      <el-form :model="changeFrom" ref="changeFrom" class="change-form">
        <el-form-item label="原房号:" :label-width="formLabelWidth">
          <span>{{changeFrom.oldId}}</span>
        </el-form-item>
        <el-form-item label="原房型:" :label-width="formLabelWidth" v-if="single">
          <span>{{changeFrom.roomType}}</span>
        </el-form-item>
        <el-form-item label="新房号:" :label-width="formLabelWidth">
          <el-select v-model="changeFrom.newId" placeholder="请选择新房的房号">
            <el-option
              v-for="(val,index) in listData"
              :label="val.roomId"
              :value="val.roomId"
              :key="index"
            >
              <span style="float: left">{{val.roomId }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ val.roomType }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span
        style="width:60%;display:block;color:red;font-size:6px;margin-left:20%"
      >换房须知：如果将客户换到有人的房间需要选择退房时间相同的房间</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRoom" v-if="single">确 定</el-button>
        <el-button type="success" @click="singleRoom" v-if="all">确 定</el-button>
      </div>
    </el-dialog>
    <CheckOutDrawer ref="checkOutDrawer"></CheckOutDrawer>
  </div>
</template>

<script>
import { getInfo, updateStatus, getList, changeRoom, singleChange } from '@/api/stay.js'
import { getTradNoByRoom, getConsumptionByNo } from '@/api/order.js'
import { formatDate } from '@/utli/Date.js'
import CheckOutDrawer from '@/components/admin/liveInfo/checkOutDrawer'
export default {
  components: {
    CheckOutDrawer
  },
  data () {
    return {
      single: true,
      all: true,
      tableData: [],
      centered: { textAlign: 'center' },
      searchForm: {
        roomId: '',
        name: '',
        IDNum: '',
        tel: ''
      },
      pagination: {
        total: 15,
        pageSize: 10,
        currentPage: 1
      },
      changeVisible: false,
      changeFrom: {
        oldId: '',
        newId: '',
        roomType: '',
        customer: []
      },
      formLabelWidth: '100px',
      listData: []
    }
  },
  methods: {
    async getInfo () {
      let pageSize = this.pagination.pageSize
      let currentPage = this.pagination.currentPage
      let page = { pageSize, currentPage }
      let res = await getInfo(page)
      // console.log(res)
      this.tableData = res.data.data.result
      this.pagination.total = res.data.data.total
      this.tableData.map(item => {
        if (item.customerNum <= 0) {
          item.num = true
          item.buttonType = 'info'
        } else {
          item.num = false
          item.buttonType = 'primary'
          if (item.customerNum > 1) {
            item.one = true
          } else {
            item.one = false
          }
        }
        if (item.arriveTime !== null && item.leaveTime !== null) {
          let arrive = new Date(item.arriveTime)
          item.liveTime = formatDate(arrive, 'yyyy-MM-dd hh:mm:ss')
          let leave = new Date(item.leaveTime)
          item.outTime = formatDate(leave, 'yyyy-MM-dd hh:mm:ss')
          let refeshTime = 1000 * 30
          let wacth1 = window.setInterval(() => {
            let watch2 = setTimeout(() => {
              let nowDate = new Date()
              let now = nowDate.getTime()
              let time = leave.getTime()
              let diff = now - time
              item.diffHour = Math.floor(diff / 1000 / 60 / 60)
              if (item.diffHour > 1 && item.roomStatus === '入住中') {
                updateStatus(item).then(res => {
                  console.log(res)
                  if (res.data.code === 200) {
                    window.clearInterval(wacth1)
                    window.clearTimeout(watch2)
                  }
                })
              } else {
                window.clearTimeout(watch2)
              }
            }, 0)
          }, refeshTime)
        }
      })
      // console.log(this.tableData)
    },
    async handleEdit (index, row) {
      // console.log(row)
      this.$refs.checkOutDrawer.settleVisible = true
      this.$refs.checkOutDrawer.roomData = row
      this.$refs.checkOutDrawer.priceInfo = row.priceInfo[0]
      let res = await getTradNoByRoom(row)
      this.$refs.checkOutDrawer.orderInfo = res.data.data.orderInfo
      let order = res.data.data.orderInfo
      let Consumption = []
      order.map(val => {
        getConsumptionByNo(val).then(res => {
          Consumption.push(res.data.data.consumption)
        })
      })
      console.log(Consumption)
      this.$refs.checkOutDrawer.consumption = Consumption
    },
    handleChange (row, index) {
      this.single = true
      this.all = false
      this.changeVisible = true
      console.log(index)
      this.changeFrom.oldId = index.roomId
      this.changeFrom.roomType = index.roomType
      this.changeFrom.customer = index.Customer
      getList().then(res => {
        let List = res.data.res.data
        List.map(item => {
          if (this.listData.length === 0) {
            this.listData.push(item)
          } else {
            this.listData.some(val => {
              if (item.roomId !== index.roomId) {
                this.listData.push(item)
                return true
              }
            })
          }
        })
      })
    },
    singleChange (index, row) {
      this.changeVisible = true
      this.single = false
      this.all = true
      console.log(row)
      let customer = []
      customer.push(row)
      this.changeFrom.oldId = row.roomId
      this.changeFrom.customer = customer
      console.log(this.changeFrom)
      getList().then(res => {
        let List = res.data.res.data
        List.map(item => {
          if (this.listData.length === 0) {
            this.listData.push(item)
          } else {
            this.listData.some(val => {
              if (item.roomId !== row.roomId) {
                this.listData.push(item)
                return true
              }
            })
          }
        })
      })
    },
    changeRoom () {
      console.log(this.changeFrom)
      this.$confirm(`是否对${this.changeFrom.oldId}房间的所有顾客换到${this.changeFrom.newId}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        changeRoom(this.changeFrom).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.changeVisible = false
            this.getInfo()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(() => {

        })
      })
    },
    singleRoom () {
      this.$confirm(`是否对${this.changeFrom.oldId}房间的${this.changeFrom.customer[0].name}换到${this.changeFrom.newId}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        singleChange(this.changeFrom).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.changeVisible = false
            this.getInfo()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(() => {

        })
      })
    },
    async changePage (currentPage, pageSize) {
      pageSize = this.pagination.pageSize
      let page = { currentPage, pageSize }
      let res = await getInfo(page)
      // console.log(res)
      this.tableData = res.data.data.result
      this.pagination.total = res.data.data.total
      this.tableData.map(item => {
        if (item.customerNum === 0) {
          item.num = true
          item.buttonType = 'info'
        } else {
          item.num = false
          item.buttonType = 'primary'
        }
        if (item.arriveTime !== null && item.leaveTime !== null) {
          let arrive = new Date(item.arriveTime)
          item.liveTime = formatDate(arrive, 'yyyy-MM-dd hh:mm:ss')
          let leave = new Date(item.leaveTime)
          item.outTime = formatDate(leave, 'yyyy-MM-dd hh:mm:ss')
        }
      })
    }
  },
  created () {
    this.getInfo()
  },
  mounted () {
    // this.getList()
  }
}
</script>

<style>
.search-thing {
  width: 40%;
  margin: 0 auto;
}
.search-thing .el-form-item {
  width: 40%;
  height: 50px;
  display: inline-block;
  margin-top: 15px;
}
.search-thing .el-form-item .el-input input {
  height: 30px;
}
.change-form {
  width: 80%;
  margin: 0 auto;
}
</style>

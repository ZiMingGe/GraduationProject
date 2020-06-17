<template>
  <div class="content-table">
    <el-form
      :model="searchForm"
      class="room-search"
      label-width="80px"
      :inline="true"
      ref="searchInfo"
      :rules="searchRule"
    >
      <el-form-item label="房型名称" prop="roomType">
        <el-select v-model="searchForm.roomType" placeholder="请选择房型">
          <el-option value label="全部"></el-option>
          <el-option v-for="(value,index) in listData" :value="value" :label="value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房间状态" prop="roomStatus">
        <el-select v-model="searchForm.roomStatus" placeholder="请选择房间状态">
          <el-option value label="全部"></el-option>
          <el-option v-for="(value,index) in roomStatus" :value="value" :label="value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="价格范围" class="block-info">
        <el-col :span="11">
          <el-form-item prop="minPrice">
            <el-input v-model="searchForm.Price.minPrice" placeholder="请输入起始价格"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span>~</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="maxPrice">
            <el-input v-model="searchForm.Price.maxPrice" placeholder="请输入最终价格"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchInfo">搜索</el-button>
        <el-button @click="resetForm">返回</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="roomData"
      border
      style="width: 98%;margin:0 auto"
      :cell-style="centered"
      :header-cell-style="centered"
    >
      <el-table-column label="客房号" width="100px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px">
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.status">
            {{
            scope.row.roomStatus
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="房型" width="130px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roomType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="120px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.Price }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="价格设置日期">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格截止日期">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.end }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            :disabled="scope.row.living"
          >设置房间信息</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            :disabled="scope.row.living"
          >删除房间</el-button>
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
    <!--更改房间信息-->
    <el-dialog title="编辑房间信息" :visible.sync="dialogFormVisible" center width="27%">
      <el-form :model="editInfo" style="width:90%;margin:0 auto" ref="editInfo" :rules="rules">
        <el-form-item label="客房号" :label-width="formLabelWidth" prop="roomId">
          <span>{{ editInfo.roomId }}</span>
        </el-form-item>
        <el-form-item label="房型" :label-width="formLabelWidth" prop="roomType">
          <el-select v-model="editInfo.roomType" placeholder="请选择房型">
            <el-option v-for="(val,index) in listData" :label="val" :value="val" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="Price">
          <el-input v-model="editInfo.Price" class="room-price"></el-input>
          <span style="margin-left:15px; font-size:15px;">元</span>
        </el-form-item>
        <el-form-item
          label="时间"
          :label-width="formLabelWidth"
          prop="timeAmount"
          class="time-amount"
        >
          <el-input-number
            v-model="editInfo.timeAmount"
            controls-position="right"
            :min="1"
            :max="10"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="timeUnit" class="time-unit">
          {{
          editInfo.timeUnit
          }}
        </el-form-item>
        <el-form-item prop="startTime" label="开始时间" :label-width="formLabelWidth">
          <el-date-picker v-model="editInfo.startTime" type="date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endingTime" label="结束时间" :label-width="formLabelWidth">
          <el-date-picker v-model="editInfo.endingTime" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="房间状态" :label-width="formLabelWidth" prop="roomStatus">
          <el-select v-model="editInfo.roomStatus" placeholder="请选择状态">
            <el-option label="空房" value="空房"></el-option>
            <el-option label="打扫中" value="打扫中"></el-option>
            <el-option label="故障" value="故障"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoom()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRomminfo, editRoom, deleteRoomById, search } from '@/api/room.js'
import { getNameList } from '@/api/roomType.js'
import { formatDate } from '@/utli/Date.js'
export default {
  data () {
    var validateRoomType = (rule, value, callback) => {
      if (value !== '钟点房' && value !== '月租房') {
        this.editInfo.timeUnit = '天'
        callback()
      } else {
        if (value === '月租房') {
          this.editInfo.timeUnit = '月'
          callback()
        } else {
          this.editInfo.timeUnit = '小时'
          callback()
        }
      }
    }
    var validatePrice = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入价格'))
      } else {
        callback()
      }
    }
    var validateStart = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入开始时间'))
      } else {
        callback()
      }
    }
    var validateEnd = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入结束时间'))
      } else {
        callback()
      }
    }
    var validateTimeAmount = (rule, value, callback) => {
      if (value === '') {
        value = 1
        return callback(new Error('请输入价格的时间单位'))
      } else {
        callback()
      }
    }
    var validateMaxPrice = (rule, value, callback) => {
      if (value < this.searchForm.Price.minPrice) {
        return callback(new Error('不能小于起始价格'))
      } else {
        callback()
      }
    }
    return {
      roomStatus: ['空房', '入住中', '故障', '打扫中', '超时'],
      searchForm: {
        roomStatus: '',
        roomType: ''
        /* Price: {
          minPrice: '',
          maxPrice: ''
        } */
      },
      listData: [],
      pagination: {
        total: 15,
        pageSize: 10,
        currentPage: 1
      },
      roomData: [],
      status: '',
      editInfo: {},
      dialogFormVisible: false,
      formLabelWidth: '100px',
      rules: {
        roomType: {
          validator: validateRoomType,
          tigger: 'blur',
          required: true
        },
        Price: { validator: validatePrice, tigger: 'blur', required: true },
        startTime: { validator: validateStart, tigger: 'blur', required: true },
        endingTime: { validator: validateEnd, tigger: 'blur', required: true },
        timeAmount: {
          validator: validateTimeAmount,
          tigger: 'blur',
          required: true
        }
      },
      searchRule: {
        maxPrice: { validator: validateMaxPrice, trigger: 'blur' }
      },
      centered: { textAlign: 'center' }
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(row)
      this.dialogFormVisible = true
      let {
        roomId,
        roomType,
        roomStatus,
        Price,
        priceid,
        roomid,
        startTime,
        endingTime,
        timeUnit,
        timeAmount
      } = row
      let playload = {
        roomId,
        roomType,
        roomStatus,
        Price,
        priceid,
        roomid,
        startTime,
        endingTime,
        timeUnit,
        timeAmount
      }
      this.editInfo = playload
      if (this.editInfo.roomType.search('钟点')) {
        this.editInfo.timeUnit = '天'
      } else {
        this.editInfo.timeUnit = '小时'
      }
      //
    },
    handleDelete (index, row) {
      let ids = { roomid: row.roomid, priceid: row.priceid }
      this.$confirm(`此操作将永久删除${row.roomId}房间的所有信息, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteRoomById(ids).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.getRoomInfo()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      })
      // console.log(index, row)
    },
    async getRoomInfo () {
      let pageSize = this.pagination.pageSize
      let currentPage = this.pagination.currentPage
      let page = { pageSize, currentPage }
      let res = await getRomminfo(page)
      // console.log(res)
      this.roomData = res.data.data.result
      this.pagination.total = res.data.data.total
      this.roomData.map(item => {
        let startTime = new Date(item.startTime)
        let endingTime = new Date(item.endingTime)
        item.start = formatDate(startTime, 'yyyy-MM-dd ')
        item.end = formatDate(endingTime, 'yyyy-MM-dd ')
        if (item.roomStatus === '入住中') {
          item.status = 'danger'
          item.living = true
        } else if (item.roomStatus === '空房') {
          item.status = 'success'
          item.living = false
        } else if (item.roomStatus === '打扫中') {
          item.status = 'warning'
          item.living = false
        } else if (item.roomStatus === '故障') {
          item.status = 'info'
          item.living = false
        } else {
          item.status = 'danger'
          item.living = true
        }
      })
    },
    editRoom () {
      this.$refs.editInfo.validate(valid => {
        if (valid) {
          editRoom(this.editInfo)
            .then(res => {
              // console.log(res)
              if (res.data.code === 200) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.changePage()
                // this.$router.go(0)
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
            .catch(res => {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            })
        }
      })
    },
    async changePage (currentPage, pageSize) {
      pageSize = this.pagination.pageSize
      let page = { currentPage, pageSize }
      let res = await getRomminfo(page)
      this.roomData = res.data.data.result
      this.pagination.total = res.data.data.total
      this.roomData.map(item => {
        let startTime = new Date(item.startTime)
        let endingTime = new Date(item.endingTime)
        item.start = formatDate(startTime, 'yyyy-MM-dd hh:mm:ss')
        item.end = formatDate(endingTime, 'yyyy-MM-dd hh:mm:ss')
        if (item.roomStatus === '入住中') {
          item.status = 'danger'
          item.living = true
        } else if (item.roomStatus === '空房') {
          item.status = 'success'
          item.living = false
        } else if (item.roomStatus === '打扫中') {
          item.status = 'warning'
          item.living = false
        } else if (item.roomStatus === '故障') {
          item.status = 'info'
          item.living = false
        } else {
          item.status = 'danger'
          item.living = true
        }
      })
    },
    async getList () {
      let res = await getNameList()
      // console.log(res)
      this.listData = res.data.data.data
      // console.log(this.listData)
    },
    resetForm () {
      // console.log(this.$refs['searchInfo'])
      this.$refs.searchInfo.resetFields()
      this.getRoomInfo()
    },
    searchInfo () {
      let pageSize = this.pagination.pageSize
      let currentPage = this.pagination.currentPage
      let room = {}
      for (let kes in this.searchForm) {
        if (this.searchForm[kes] !== '') {
          room[kes] = this.searchForm[kes]
        }
      }
      /* let price = {}
      for (let key in this.searchForm.Price) {
        if (this.searchForm.Price[key] !== '') {
          price[key] = this.searchForm.Price[key]
        }
      }
      console.log(price) */
      let page = { pageSize, currentPage, room }
      console.log(page)
      this.$refs.searchInfo.validate(valid => {
        if (valid) {
          search(page).then(res => {
            this.roomData = res.data.data.result
            this.pagination.total = res.data.data.total
            this.roomData.map(item => {
              let startTime = new Date(item.startTime)
              let endingTime = new Date(item.endingTime)
              item.start = formatDate(startTime, 'yyyy-MM-dd ')
              item.end = formatDate(endingTime, 'yyyy-MM-dd ')
              if (item.roomStatus === '入住中') {
                item.status = 'danger'
                item.living = true
              } else if (item.roomStatus === '空房') {
                item.status = 'success'
                item.living = false
              } else if (item.roomStatus === '打扫中') {
                item.status = 'warning'
                item.living = false
              } else if (item.roomStatus === '故障') {
                item.status = 'info'
                item.living = false
              } else {
                item.status = 'danger'
                item.living = true
              }
            })
          })
        }
      })
    }
  },
  created () {
    this.getRoomInfo()
  },
  mounted () {
    this.getList()
  },
  watch: {
    dialogFormVisible: function (val) {
      if (val === false) {
        this.$refs.editInfo.resetFields()
      }
    }
  }
}
</script>

<style>
.time-amount {
  width: 45%;
  margin: 0;
  display: inline-block;
}
.time-unit {
  width: 10%;
  display: inline-block;
  margin-left: 24%;
}
.room-price {
  width: 40%;
}
.centered {
  text-align: center;
}
.room-search {
  clear: both;
  width: 50%;
  margin-top: 8px;
  padding-top: 10px;
}
.block-info {
  width: 38%;
}
</style>

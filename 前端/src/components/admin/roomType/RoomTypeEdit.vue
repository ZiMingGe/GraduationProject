<template>
  <div>
    <el-card class="form-card">
      <h3>编辑房型</h3>
      <el-form :model="typeForm" ref="typeForm" label-width="100px" class="room-type-from">
        <el-form-item label="房型名称:" prop="name">
          <span style="float:left">{{typeForm.name}}</span>
        </el-form-item>
        <el-form-item label="可住人数" prop="allowNum">
          <el-input-number v-model="typeForm.allowNum" :min="0.5" :max="12" style="float:left"></el-input-number>
        </el-form-item>
        <el-form-item label="配置:" prop="configure">
          <el-checkbox-group v-model="typeForm.configure" style="float:left">
            <el-checkbox
              v-for="(item,index) in configureList"
              :label="item.label"
              :name="item.name"
              :key="index"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="上传图片：">
          <el-upload
            action="#"
            ref="roomType"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :auto-upload="false"
            class="roomType-upload"
            :before-upload="handleBeforeUpload"
            :before-remove="beforeRemove"
            :limit="6"
            :file-list="typeForm.imageList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFrom">提交信息</el-button>
          <el-button @click="goBack">返回上一级</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { editRoomType, uploadImage, uploadSingleImage, deleteImage } from '@/api/roomType.js'
export default {
  data () {
    return {
      fileList: [],
      configureList: [
        { label: '空调', name: '空调' }, { label: 'WIFI', name: 'WIFI' }, { label: '热水器', name: '热水器' }, { label: '早餐', name: '早餐' }, { label: '大床', name: '大床' }, { label: '小床', name: '小床' }],
      dataForm: {},
      typeForm: {},
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      imageList: []
    }
  },
  methods: {
    getInfo () {
      this.typeForm = this.$route.query.row
    },
    submitFrom () {
      this.$refs.typeForm.validate(val => {
        if (val) {
          console.log(this.typeForm)
          editRoomType(this.typeForm).then(res => {
            console.log(res)
            if (res.data.code === 200) {
              this.handleUpload()
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.$router.replace('/admin/roomType')
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
    handleUpload (file) {
      let imageArray = this.$refs.roomType.uploadFiles
      let readyUpload = []
      console.log(imageArray)
      let images = new FormData()
      imageArray.map(item => {
        if (item.status === 'ready') {
          readyUpload.push(item)
          images.append('image', item.raw)
        }
      })
      images.append('name', this.typeForm.name)
      images.append('_id', this.typeForm._id)
      if (readyUpload.length > 1) {
        uploadImage(images).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message({ type: 'success', message: res.data.msg })
          } else {
            this.$message({ type: 'danger', message: res.data.msg })
          }
        }).catch(() => { })
      } else if (readyUpload.length > 0) {
        uploadSingleImage(images).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.$message({ type: 'success', message: res.data.msg })
          } else {
            this.$message({ type: 'danger', message: res.data.msg })
          }
        }).catch(error => {
          console.log(error)
          this.$message({
            type: 'danger',
            message: error
          })
        })
      }
    },
    handleBeforeUpload (file) {
      if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$message.error('只能上传png,jpg,gif,jpeg格式的图片')
      }
      let size = file.size / 1024 / 1024 / 10
      if (size > 10) {
        this.$message.error('图片大小必须小于10M')
      }
    },
    goBack () {
      this.$router.replace('/admin/roomType')
    },
    beforeRemove (file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm(`此操作将永久删除该图片的所有信息, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.handleRemove(file)
        }).catch((reject) => {
          reject(false)
        })
      }
    },
    handleRemove (file, fileList) {
      let info = { url: file.url, name: this.typeForm.name, imgName: file.name }
      deleteImage(info).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
          // this.getInfo()
          return true
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  },
  created () {
    this.getInfo()
  }
}
</script>

<style>
.room-type-from {
  width: 80%;
  margin: 0 auto;
}
.form-card {
  width: 60%;
  margin: 0 auto;
}
.roomType-upload {
  float: left;
}
</style>

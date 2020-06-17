<template>
  <el-button icon="el-icon-back" type="text" class="go-back" @click="goBack()"></el-button>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
.go-back {
  font-size: 26px;
  float: left;
}
</style>

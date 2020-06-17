<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb-container">
      <el-breadcrumb-item v-for="item in routeArray" :key="item.path">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routeArray: []
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name.trim().toLocaleLowerCase() !== 'admin'.toLocaleLowerCase()) {
        matched = [].concat(matched)
      }
      this.routeArray = matched
    }
  }
}
</script>

<style>
.breadcrumb-container {
  width: 40%;
  height: 60px;
  margin: 0;
  line-height: 60px;
  float: left;
  font-weight: bold;
  font-size: 16px;
  font-family: "华文中宋";
}
</style>

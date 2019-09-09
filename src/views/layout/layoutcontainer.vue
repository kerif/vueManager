<template>
  <el-container class="layout-contaniner">
    <layout-aside></layout-aside>
    <el-container direction="vertical">
      <layout-header></layout-header>
      <div class="layout-nav">
        <div class="back-box">
          <span class="el-icon-back back-icon"></span>
          <span class="back-text">返回</span>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in pagePath.split(',')" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-main>
        <router-view></router-view>
      </el-main>
      <layout-footer></layout-footer>
    </el-container>
  </el-container>
</template>
<script>
import LayoutAside from './layoutaside'
import LayoutHeader from './layoutheader'
import LayoutFooter from './layoutfooter'
export default {
  components: {
    LayoutAside,
    LayoutHeader,
    LayoutFooter
  },
  computed: {
    pagePath () {
      console.log(this.$store.state.pagePath)
      return this.$store.state.pagePath
    }
  }
}
</script>
<style lang="scss">
.layout-contaniner {
  .layout-nav {
    height: 40px;
    padding: 0 20px;
    border: {
      top: 1px solid #E8E9EB;
      bottom: 1px solid #E8E9EB;
    }
    .breadcrumb {
      line-height: 40px;
    }
    .back-box {
      float: right;
      color: #3540A5;
      font-size: 14px;
      line-height: 40px;
      cursor: pointer;
      // &:hover {
      //   .back-text {
      //     display: inline-block;
      //   }
      //   transition: all 3s ease-in;
      // }
    }
    .back-icon {
      font-size: 18px;
      border: 1px solid #ECEDF0;
      border-radius: 50%;
      display: inline-block;
      padding: 5px;
      margin-top: 5px;
      margin-right: 5px;
    }
    // .back-text {
    //   display: none;
    // }
  }
}
</style>

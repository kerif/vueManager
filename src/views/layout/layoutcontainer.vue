<template>
  <el-container class="layout-contaniner">
    <layout-aside></layout-aside>
    <el-container direction="vertical" :class="['layout', isCollapse ? 'is-collapse' : '']">
      <layout-header></layout-header>
      <div  :class="[isCollapse && 'isCollapses']" class="layout-nav">
        <div class="back-box" @click="$router.go(-1)">
          <span class="el-icon-back back-icon"></span>
          <span class="back-text">返回</span>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in pagePath.split(',')" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-main :class="[isCollapse && 'isCollapses']">
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
      return `${this.$route.meta.group}/${this.$route.meta.name}`
    },
    isCollapse () {
      return this.$store.state.isCollapse
    }
  }
}
</script>
<style lang="scss">
.layout-contaniner {
  .el-main {
    left: 230px;
    width: calc(100vw - 230px);
    transition: all 0.3s ease-in;
    position: relative;
    top: 60px;
    padding-bottom: 60px;
  }
  .isCollapses {
    left: 0 !important;
    width: 100vw !important;
  }
  .layout-nav {
    height: 60px;
    padding: 0 20px;
    width: calc(100vw - 230px);
    box-sizing: border-box;
    position: relative;
    top: 60px;
    left: 230px;
    transition: all 0.3s ease-in;
    border: {
      top: 1px solid #e8e9eb;
      bottom: 1px solid #e8e9eb;
    }
    .breadcrumb {
      line-height: 60px;
    }
    .back-box {
      float: right;
      color: #3540a5;
      font-size: 14px;
      line-height: 60px;
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
      border: 1px solid #ecedf0;
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
  .isCollapse {
    width: 0 !important;
  }
}
</style>

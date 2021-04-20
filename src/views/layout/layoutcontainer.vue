<template>
  <el-container class="layout-contaniner">
    <layout-aside></layout-aside>
    <el-container direction="vertical" :class="['layout', isCollapse ? 'is-collapse' : '']">
      <layout-header></layout-header>
      <el-main :class="[isCollapse && 'isCollapses']">
        <transition :css="false">
          <keep-alive :include="cachedViews">
            <router-view :key="key"></router-view>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import LayoutAside from './layoutaside'
import LayoutHeader from './layoutheader'
export default {
  name: 'layoutContainer',
  components: {
    LayoutAside,
    LayoutHeader
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    isCollapse () {
      return this.$store.state.isCollapse
    },
    key () {
      return this.$route.path
    }
  }
}
</script>
<style lang="scss">
.layout-contaniner {
  .el-main {
    padding: 0;
    width: calc(100vw - 180px);
    height: calc(100vh - 140px);
    transition: all 0.2s ease-in;
    position: relative;
  }
  .el-main > div {
    background-color: #F5F5F5;
    padding: 20px;
  }
  .isCollapses {
    left: 0px !important;
    width: calc(100vw - 60px) !important;
  }
  .layout-nav {
    padding: 15px 20px;
    width: calc(100vw - 180px);
    box-sizing: border-box;
    position: relative;
    transition: all 0.2s ease-in;
    border: {
      top: 1px solid #e8e9eb;
      bottom: 1px solid #e8e9eb;
    }
    .breadcrumb {
      line-height: 60px;
    }
  }
  .isCollapse {
    width: 60px !important;
  }
}
</style>

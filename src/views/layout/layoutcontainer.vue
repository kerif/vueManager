<template>
  <el-container class="layout-contaniner">
    <layout-aside></layout-aside>
    <el-container direction="vertical" :class="['layout', isCollapse ? 'is-collapse' : '']">
      <layout-header></layout-header>
      <div  :class="[isCollapse && 'isCollapses']" class="layout-nav">
        <tags-view />
      </div>
      <el-main :class="[isCollapse && 'isCollapses']">
        <router-view></router-view>
      </el-main>
      <!-- <layout-footer></layout-footer> -->
    </el-container>
  </el-container>
</template>
<script>
import LayoutAside from './layoutaside'
import LayoutHeader from './layoutheader'
import TagsView from './components/tagsview'
// import LayoutFooter from './layoutfooter'
export default {
  components: {
    LayoutAside,
    LayoutHeader,
    TagsView
    // LayoutFooter
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    }
  }
}
</script>
<style lang="scss">
.layout-contaniner {
  .el-main {
    left: 180px;
    padding: 0;
    width: calc(100vw - 180px);
    // height: calc(100vh - 170px);
    height: calc(100vh - 120px);
    transition: all 0.3s ease-in;
    position: relative;
    top: 60px;
    // padding-bottom: 60px;
  }
  .el-main > div {
    background-color: #F5F5F5;
    padding: 20px;
    // min-height: calc(100vh - 170px);
    min-height: calc(100vh - 120px);
  }
  .isCollapses {
    left: 0 !important;
    width: 100vw !important;
  }
  .layout-nav {
    padding: 10px 20px;
    width: calc(100vw - 180px);
    box-sizing: border-box;
    position: relative;
    top: 60px;
    left: 180px;
    transition: all 0.3s ease-in;
    border: {
      top: 1px solid #e8e9eb;
      bottom: 1px solid #e8e9eb;
    }
    .breadcrumb {
      line-height: 60px;
    }
  }
  .isCollapse {
    width: 0 !important;
  }
}
</style>

<template>
  <el-container class="layout-contaniner">
    <el-header>
      <layout-aside></layout-aside>
    </el-header>
    <el-container>
      <el-aside :class="[isCollapse ? 'isCollapse' : 'aside']" v-if="menuId!=1">
        <layout-menu></layout-menu>
      </el-aside>
      <el-main>
        <el-container direction="vertical" :class="['layout', isCollapse ? 'is-collapse' : menuId==1?'homepanel':'']">
          <el-main :class="[isCollapse && 'isCollapses']">
            <layout-header></layout-header>
            <div class="middle">
              <transition :css="false">
                <keep-alive :include="cachedViews">
                  <router-view :key="key"></router-view>
                </keep-alive>
              </transition>
            </div>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import LayoutAside from './layoutaside'
import LayoutHeader from './layoutheader'
import layoutMenu from './layoutmenu'
export default {
  name: 'layoutContainer',
  components: {
    LayoutAside,
    LayoutHeader,
    layoutMenu
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    menuId() {
      if (this.$store.state.menuTitleId === 1) {
        this.$store.commit('switchCollapse', false)
        this.$router.push({
          name: 'panel'
        })
      }
      return this.$store.state.menuTitleId
    },
    isCollapse() {
      return this.$store.state.isCollapse
    },
    key() {
      return this.$route.path
    }
  }
}
</script>
<style lang="scss">
.layout-contaniner {
  .middle {
    height: calc(100vh - 160px) !important;
    overflow-x: hidden;
  }
  .aside {
    width: 180px !important;
    height: calc(100vh - 60px);
    position: relative;
    top: 0;
    z-index: 99;
    background-color: #fff;
    display: flex;
    overflow-x: hidden;
  }
  .el-header {
    padding: 0px;
  }
  .homepanel {
    width: calc(100vw) !important;
  }
  .is-collapse {
    width: calc(100vw - 180px);
  }
  .el-main {
    padding: 0;
    height: calc(100vh - 60px);
    transition: all 0.2s ease-in;
    position: relative;
  }
  .el-main > div {
    background-color: #f5f5f5;
    padding:0px 20px 0px 20px;
  }
  .isCollapses {
    left: 0px !important;
    width: calc(100vw - 60px) !important;
  }
  .layout-nav {
    padding: 5px 20px;
    width: calc(100vw - 20px);
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
    overflow-y: hidden;
  }
}
</style>

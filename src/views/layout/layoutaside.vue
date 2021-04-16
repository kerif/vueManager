<template>
  <el-aside class="layout-aside" :class="[isCollapse ? 'isCollapse' : '']">
    <div v-if="!isCollapse"  class="aside-top">
      <span class="app-name">{{$t('集运')}}</span>
      <span>{{$t('管理系统')}}</span>
    </div>
    <div v-else class="unTop">
      <img src="../../assets/top.png">
    </div>
    <el-menu
      :default-active="$route.meta.level === 3 ? $route.meta.parent : $route.path"
      background-color="#171B42"
      text-color="#fff"
      :router="true"
      :collapse="isCollapse"
      active-text-color="#7E8BFF"
      :unique-opened="true"
      class="route-menu"
      @select="onMenuSelect">
      <el-submenu v-for="(route, index) in formatRouterMap" :key="route.name"
        :index="index + ''">
        <template slot="title">
          <i :class="['iconfont', 'icon-title', route.icon]"></i>
          <span>{{ $t(route.name) }}</span>
        </template>
        <el-menu-item-group v-for="(childRoute, childIndex) in route.children" :key="childIndex">
          <el-menu-item :index="childRoute.path"
            :key="childRoute.name" v-if="childRoute.level === 2" class="route-item"
            @click="onRoute(route)">{{ $t(childRoute.name) }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  computed: {
    fileterAfterRouterMap () {
      return this.$store.state.fileterAfterRouterMap[0] ? this.$store.state.fileterAfterRouterMap[0].children : []
    },
    formatRouterMap () {
      console.log()
      let formatRouterMap = {}
      this.fileterAfterRouterMap && this.fileterAfterRouterMap.forEach((item, index) => {
        item.children.forEach(ele => {
          if (formatRouterMap[ele.meta.group]) {
            formatRouterMap[ele.meta.group].children.push({ name: ele.meta.name, path: ele.path, level: ele.meta.level })
          } else {
            formatRouterMap[ele.meta.group] = { children: [{ name: ele.meta.name, path: ele.path, level: ele.meta.level }], name: ele.meta.group, level: 1, icon: item.icon }
          }
        })
      })
      return formatRouterMap
    },
    isCollapse () {
      return this.$store.state.isCollapse
    }
  },
  methods: {
    onMenuSelect (index, indexPath) {
      // console.log('index', index)
      // console.log('indexPath', indexPath)
    },
    onRoute (route) {
      // console.log('route', route)
      // console.log('$route', this.$route)
    }
  }
}
</script>
<style lang="scss">
.layout-aside {
  width: 180px !important;
  height: 100vh;
  position: relative;
  top: 0;
  z-index: 99;
  background-color: #171B42;
  // transition: all 0.2s ease-in;
  overflow-x: hidden;
  .aside-top {
    width: 180px;
    height: 60px;
    line-height: 60px;
    background-color: #3540A5;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
  .unTop {
    background-color: #3540A5;
    text-align: center;
    img {
      height: 60px;
      width: 61px;
      padding-top: 5px;
    }
  }
  .app-name {
    font-size: 35px;
    font-weight: bold;
    margin-right: 5px;
  }
  .route-menu {
    // width: 180px;
    border: none;
    margin-top: 50px;
  }
  .route-item {
    padding-left: 60px !important;
  }
  .el-menu-item-group__title {
    padding: 0;
  }
  .isCollapse {
    width: 50px !important;
  }
  .el-submenu__title {
    padding-left: 20px !important;
  }
  .icon-title {
    font-size: 18px;
    margin-right: 22px;
    color: #fff;
  }
  .el-submenu.is-active {
    .el-submenu__title {
      background-color: #3540A5 !important;
    }
  }
}
.el-menu-item-group__title {
  padding: 0;
}
</style>

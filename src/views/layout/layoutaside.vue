<template>
  <el-aside class="layout-aside">
    <div class="aside-top">
      <span class="app-name">TKK</span>
      <span>管理员</span>
    </div>
    <el-menu
      :default-active="$route.path"
      background-color="#171B42"
      text-color="#7E8BFF"
      :router="true"
      active-text-color="#fff"
      :unique-opened="true"
      class="route-menu"
      @select="onMenuSelect">
      <el-submenu v-for="(route, index) in formatRouterMap" :key="route.name"
        :index="index + ''">
        <template slot="title">
          <span>{{ route.name }}</span>
        </template>
        <el-menu-item-group v-for="(childRoute, childIndex) in route.children" :key="childIndex">
          <el-menu-item :index="childRoute.path"
            :key="childRoute.name" v-if="childRoute.level === 2" class="route-item"
            @click="onRoute(route)">{{ childRoute.name }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>
<script>
import { routes } from '@/router'
export default {
  computed: {
    routers () {
      return routes
    },
    formatRouterMap () {
      let formatRouterMap = {}
      routes[0].children.forEach((item, index) => {
        item.children.forEach(ele => {
          if (formatRouterMap[ele.meta.group]) {
            formatRouterMap[ele.meta.group].children.push({ name: ele.meta.name, path: ele.path, level: ele.meta.level })
          } else {
            formatRouterMap[ele.meta.group] = { children: [{ name: ele.meta.name, path: ele.path, level: ele.meta.level }], name: ele.meta.group, level: 1 }
          }
        })
      })
      return formatRouterMap
    }
  },
  methods: {
    onMenuSelect (index, indexPath) {
      console.log('index', index)
      console.log('indexPath', indexPath)
    },
    onRoute (route) {
      console.log('route', route)
      console.log('$route', this.$route)
    }
  }
}
</script>
<style lang="scss">
.layout-aside {
  width: 230px;
  min-height: 100vh;
  background-color: #171B42;
  .aside-top {
    height: 60px;
    line-height: 60px;
    background-color: #3540A5;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
  .app-name {
    font-size: 35px;
    font-weight: bold;
    margin-right: 5px;
  }
  .route-menu {
    border: none;
  }
  .route-item {
    padding-left: 80px !important;
  }
}
</style>

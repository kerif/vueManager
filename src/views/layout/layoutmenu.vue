<template>
  <div :class="$store.state.languageCode=='en'?'layoutmenu':''">
    <div class="navigation-text">
      <div :class="[isCollapse ? 'titles' : 'menu-title']">{{ $t($store.state.menuTitle) }}</div>
      <div @click="switchLeft" class="transfer-left">
        <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']" style="font-size: 24px"></i>
      </div>
    </div>
    <div class="menus">
      <el-menu :default-active="$route.meta.level === 3 ? $route.meta.parent : $route.path" text-color="#17233D" :router="true" :collapse="isCollapse" active-text-color="#7E8BFF" :unique-opened="true" class="route-menu" @select="onMenuSelect">
        <el-submenu v-for="(route, index) in formatRouterMap" :key="route.name" :index="index + ''">
          <template slot="title">
            <!-- <i :class="['iconfont', 'icon-title', route.icon]"></i> -->
            <img :src="require(`@/assets/${route.icon}.png`)" style="width: 18px;height: 18px;margin-right: 22px;" />
            <span class="menu-title">{{ $t(route.name) }}</span>
          </template>
          <el-menu-item-group v-for="(childRoute, childIndex) in route.children" :key="childIndex">
            <el-menu-item :index="childRoute.path" :key="childRoute.name" v-if="childRoute.level === 2" class="route-item" @click="onRoute(route)">
              {{ $t(childRoute.name) }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    switchLeft() {
      this.$store.commit('switchCollapse', !this.$store.state.isCollapse)
    },
    onMenuSelect() {
      // console.log('index', index)
      // console.log('indexPath', indexPath)
    },
    onRoute() {
      // console.log('route', route)
      // console.log('$route', this.$route)
    },
  },
  computed: {
    isCollapse() {
      return this.$store.state.isCollapse
    },
    menuId() {
      console.log(this.$store.state.languageCode);
      return this.$store.state.menuTitleId
    },
    fileterAfterRouterMap() {
      return this.$store.state.fileterAfterRouterMap[0]
        ? this.$store.state.fileterAfterRouterMap[0].children
        : []
    },
    showMeun() {
      let lists = []
      if (this.menuId == 2) {
        lists = ['marketing', 'content', 'website', 'customer', 'vip', 'staff', 'basics']
      } else if (this.menuId == 3) {
        lists = ['order', 'station', 'pick']
      } else if (this.menuId == 4) {
        lists = ['finance', 'consumption']
      } else if (this.menuId == 5) {
        lists = ['overview']
      } else if (this.menuId == 6) {
        lists = ['config', 'language']
      }
      return lists
    },
    formatRouterMap() {
      let formatRouterMap = {}
      let formatRouterList = []
      formatRouterList = this.fileterAfterRouterMap.filter(item => this.showMeun.includes(item.path))
      this.fileterAfterRouterMap &&
        formatRouterList.forEach(item => {
          item.children.forEach(ele => {
            if (formatRouterMap[ele.meta.group]) {
              formatRouterMap[ele.meta.group].children.push({
                name: ele.meta.name,
                path: ele.path,
                level: ele.meta.level
              })
            } else {
              formatRouterMap[ele.meta.group] = {
                children: [{ name: ele.meta.name, path: ele.path, level: ele.meta.level }],
                name: ele.meta.group,
                level: 1,
                icon: item.icon
              }
            }
          })
        })
      return formatRouterMap
    },
  }
}
</script>
<style lang="scss">
.layoutmenu {
  overflow-y: hidden;
}
.menu-title {
  font-size: 16px;
}
.layout-aside {
  .el-button.is-round {
    padding: 12px 8px;
  }
  .button {
    background-color: #3540a5;
    border: #3540a5;
    color: #fff;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  width: 100% !important;
  // height: 100vh;
  height: 60px;
  position: relative;
  top: 0;
  z-index: 99;
  background-color: #3540a5;
  display: flex;
  transition: all 0.2s ease-in;
  overflow-x: hidden;
  .menu {
    height: 100%;
    width: 50%;
  }
}
.titles {
  display: none;
}
.menus {
  width: 180px;
}
.navigation-text {
  display: flex;
  margin-top: 25px;
  padding: 0 15px;
  justify-content: space-between;
  .menu-title {
    font-size: 18px;
    color: #17233d;
    font-weight: 500;
  }
}
.aside-top {
  width: 280px;
  height: 60px;
  line-height: 60px;
  background-color: #3540a5;
  color: #fff;
  font-size: 18px;
  text-align: center;
}
.unTop {
  background-color: #3540a5;
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
  margin-top: 20px;
}
.route-item {
  padding-left: 60px !important;
}
.dot {
  display: inline-block;
  background: red !important;
  width: 6px !important;
  height: 6px !important;
  border-radius: 50%;
}
.menu-right {
  width: 40%;
  line-height: 60px;
  color: #fff;
  .el-dropdown-link {
    height: 60px;
    font-size: 15px;
    color: #fff;
  }
  .name-sty {
    width: 70px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
}
.el-menu-item-group__title {
  padding: 0;
}
.isCollapse {
  width: 50px !important;
  overflow-x: hidden;
}
.el-submenu__title {
  padding-left: 20px !important;
}
.icon-title {
  font-size: 18px;
  margin-right: 22px;
  color: #fff;
}
// .el-submenu.is-active {
//   .el-submenu__title {
//     background-color: #3540a5 !important;
//   }
// }
.el-menu-item-group__title {
  padding: 0;
}
</style>
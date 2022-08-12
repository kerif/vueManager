<template>
<el-menu default-active="1-4-1" class="el-menu-vertical-demo"  background-color ="#545c64" text-color ="#fff" active-text-color = "#ffd04b" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <h3>{{isCollapse?"后台":"通用后台管理系统"}}</h3>
     <el-menu-item  @click ="clickMenu(item)" v-for="item in noChiledren" :index="item.path" :key="item.path">
    <i :class="'el-icon-' + item.icon"></i>
    <span slot="title">{{item.label}}</span>
  </el-menu-item>
  <el-submenu  v-for="item in hasChildren" :index ="item.path" :key = "item.path">
      <template solt="title">
        <!-- <i :class ="'el-icon-' + item.icon"></i>  -->
        <span slot = "title"><i :class ="'el-icon-' + item.icon"></i>{{item.label}}</span>
      </template>
      <el-menu-item-group v-for ="(subItem,subIndex) in item.children" :key = "subItem.path">
         <el-menu-item @click ="clickMenu(subItem)" :index="subIndex">{{subItem.label}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
</el-menu>
</template>

<style lang = "less" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    height: 110vh;
  }
  //左侧菜单栏样式
  .el-menu {
      border:none;
      height: 100vh;
      h3 {
        color:white;
        text-align: center;
        line-height: 48px;
      }
  }
</style>

<script>
  export default {
    data() {
      return {
        //isCollapse: false,
        menu:[
          {
             path :'/',
             name :'home',
             label :'首页',
             icon :'s-home',
             url :'Home/Home'

          },
          {
              path:'/mall',
              name :'mall',
              label :'商品管理',
              icon :'video-play',
              url: 'MallManage/MallManage'
          },
          {
              path:'/user',
              name :'user',
              label :'会员管理',
              icon :'user',
              url: 'UserManage/UserManage'
          },
          {
            label :'讨论与改进',
            icon :'location',
            children:[
              {
              path:'/page1',
              name :'page1',
              label :'会员动态管理',
              icon :'setting',
              url: 'Other/PageOne'
              },
              {
                path:'/page2',
              name :'page2',
              label :'会员意见反馈',
              icon :'setting',
              url: 'Other/PageTwo'
              }
            ]
          }
        ]
      }
    
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      clickMenu(item)
      {
            this.$router.push({
              name: item.name
            })
            //console.log(item.name);

            this.$store.commit('setMenu',item)
      }
    },
    computed: {
      noChiledren()
      {
        return this.menu.filter(item=>!item.children); //filter函数过滤
      },
      hasChildren()
      {
        return this.menu.filter(item=>item.children);
      },
      isCollapse()
      {
        return this.$store.state.tab.isCollapse 
      }
    }
  }
</script>
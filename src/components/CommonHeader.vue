<template>
<header style = "background-color:#333">
<div  class = "l-content">
    <el-button @click = "changeCollapse" plain icon = "el-icon-menu" size = "mini" ></el-button>
    <!-- <h3 style = "color:#f8f8ff;font-size: 15.5px;">首页</h3> -->
  <el-breadcrumb separator-class = "el-icon-arrow-right">
      <el-breadcrumb-item  v-for="item in tags" :key="item.path" :to="{ path:item.path }">{{ item.label }}</el-breadcrumb-item>
  </el-breadcrumb>
</div>
    <div class = "r-content">
    <el-dropdown trigger = "click" size = "mini">
        <span>
        <img class = "user" :src="userImg">
        </span>
       <el-dropdown-menu slot="dropdown">
         <el-dropdown-item>首页</el-dropdown-item>
         <el-dropdown-item>个人信息</el-dropdown-item>
       </el-dropdown-menu>
    </el-dropdown>
</div>
</header>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: "CommonHeader",
     data() {
        return {
            userImg: require("../assets/images/kotori.png")
        }
     },
     methods :{

        changeCollapse(){
          this.$store.commit('collapseMenu')
        }
     },
     computed: {  //双向数据绑定，好处:及时更新
         ...mapState({
          tags:state => state.tab.tabArr 
         })
     }
     
   }
   //console.log(tags)
</script>
<style lang = "less" scoped>

header {
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items:center;
}
.l-content {
    display: flex;
    align-items: center;
      .el-button{
        margin-right: 30px;

    };
}
.r-content {
    justify-content: center;
    align-items: center;
    margin-right: 30px;
     .user {
       width: 40px;
     height:40px;
     border-radius: 50%;
     };
}
.el-breadcrumb ::v-deep .el-breadcrumb__inner { //vue深度选择器 _inner表示组件内部
        color: #d9bb95!important;
}
</style>
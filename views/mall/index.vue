<template>
 <div style = "margin: 0; padding: 0;">
    <el-container>
      <el-aside style = "width: 200px; height: 100vh; background-color: #7e8b92;">
        <!-- 分类 -->
        <el-menu
        class = "classOfGoods"
        default-active = "1">
          <el-submenu index = "1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品分类</span>
            </template>
            <el-menu-item>科技数码</el-menu-item>
            <el-menu-item>食品</el-menu-item>
            <el-menu-item>服饰</el-menu-item>
            <el-menu-item>科技数码</el-menu-item>
            <el-menu-item>食品</el-menu-item>
            <el-menu-item>服饰</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style = "background-color: #FA842B; display: flex; align-items: center; justify-content: end;">
          <div class = "searchGoods" style = "display: flex; justify-content: end; align-items: center;">
            <el-input v-model = "searchData" placeholder="输入商品名/商家名" style = "width: 250px; display: flex;"></el-input>
            <el-button type = "primary" 
            style = "margin-left: 10px;"
            @click = "showResult">搜索</el-button>  
          </div>
        </el-header>
        <el-main style = "background-color: #ccc"></el-main>
      </el-container>
    </el-container>
 </div>
</template>

<style>
 /*样式  */
</style>
<script>
export default {
  name:'myMall',
  data()
  {
    return{
      searchData: '',
    }
  },

  methods: {
    showResult() {
      console.log("内容" + this.searchData + "axios请求模拟数据并返回到页面上");
    }
  }
}
</script>
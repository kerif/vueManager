<!--新的员工组列页面-->
<template>
  <el-container>
    <el-header>
      <div class="header-container">
        <button id="add-actor">+添加角色</button>
      </div>
    </el-header>
    <el-container>
      <el-main style="height:735px !important;">
        <el-tabs tab-position="left" style="height: 200px;">
          <el-tab-pane v-for="item in staff_group_list" :key="item" :label ="item.name_cn">{{item.name_cn + '的内容'}}</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      staff_group_list: [],
      tableLoading: false,
      normal: 1,
      dataPermission: {},
      show: false,
      hide_phone: 0
    }
  },

  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.$request
        .getVipGroup({
          keyword: '',
          page: 1,
          size: 10
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.staff_group_list = res.data
            console.log('list的数据', res.data)
          }
        })
    },
  }
  
}
</script>
<style lang="scss" scoped>
.el-header {
  height: 50px !important;
}
.header-container {
  background-color: white;
  display: flex;
  align-items: center;
  height: 50px;
  border: 1px solid rgba(230, 230, 230, 0.5);
  box-shadow: 0px 0px 1px rgb(200, 200, 200);

  #add-actor {
    background-color: white;
    border: none;
    cursor: pointer;
    margin-left: 80px;
    font-weight: bold;
    font-size: 16px;
  }
}
.el-card {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

// 修改侧边Tab的样式
::v-deep .el-tabs__active-bar {
background-color:transparent !important;
}
::v-deep .el-tabs__nav-scroll {
  overflow: visible;
}
::v-deep .el-tabs__nav-prev  {
  z-index: -1000000;
}
::v-deep .el-tabs__nav-next {
  z-index: -1000000;
}
::v-deep .el-tabs__item{
  background-color: white;
  border: 0.5px solid rgba(230, 230, 230, 0.5);
  height: 50px;
  width: 200px;
  display: flex !important;
  flex-direction: row !important;
  justify-content: center !important;
}

::v-deep .el-tabs {
  height: 100% !important;
} 
</style>
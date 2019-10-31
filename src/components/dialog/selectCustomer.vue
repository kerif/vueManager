<template>
  <el-dialog :visible.sync="show" :title="id === 1 ? '选择客户组' : '选择客户'" class="dialog-container">
    <div class="searchUser">
      <el-input placeholder="请输入关键字" v-model="keyword" @keyup.enter.native="getList">
        <template slot="append">搜索</template>
      </el-input>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="selection">
      </el-table-column>
      <!-- 客户组名 -->
      <el-table-column
        prop="id"
        label="客户组名">
      </el-table-column>
      <!-- 人数 -->
        <el-table-column
        prop="name"
        label="人数">
      </el-table-column>
      <!-- 创建时间 -->
        <el-table-column
        prop="last_login_at"
        label="创建时间">
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      keyword: '',
      id: ''
    }
  },
  methods: {
    getList () {
      // this.$request.getUserMembers(this.id).then(res => {
      //   if (res.ret) {
      //     this.tableData = res.data
      //     console.log(this.tableData, 'tableData')
      //   }
      // })
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.searchUser {
  width: 40%;
  float: right;
  margin: 10px 0;
}
</style>

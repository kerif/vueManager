<template>
  <el-dialog :visible.sync="show" title="选择客户" class="dialog-container">
    <div class="searchUser">
      <el-input placeholder="请输入内容" v-model="input">
        <template slot="append">搜索</template>
      </el-input>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="selection">
      </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        prop="id"
        label="客户ID">
      </el-table-column>
      <!-- 客户昵称 -->
        <el-table-column
        prop="name"
        label="客户昵称">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="last_login_at"
        label="最后登录时间">
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      input: ''
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

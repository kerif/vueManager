<template>
  <div class="line-list-container">
    <div class="add-btn-box"><add-btn router="lineadd">添加路线</add-btn></div>
    <el-table stripe border class="data-list" :data="lineList"
    v-loading="tableLoading">
      <el-table-column type="expand">
        <div>{{remark}}</div>
      </el-table-column>
      <el-table-column label="线路名称" prop="cn_name"></el-table-column>
      <el-table-column label="支持国家" prop="countries.cn_name"></el-table-column>
      <el-table-column label="参考时效" prop="expire"></el-table-column>
      <el-table-column label="首重" prop="first_weight"></el-table-column>
      <el-table-column label="首费" prop="first_money"></el-table-column>
      <el-table-column label="续重" prop="next_weight"></el-table-column>
      <el-table-column label="续费" prop="next_money"></el-table-column>
      <el-table-column label="最大重量" prop="max_weight"></el-table-column>
      <el-table-column label="最小重量" prop="min_weight"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editLine(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import AddBtn from '@/components/addBtn'
export default {
  data () {
    return {
      lineList: [],
      tableLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getLines().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.lineList = res.data
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 修改线路
    editLine (id) {
      this.$router.push({ name: 'lineedit',
        params: {
          state: 'edit',
          id: id
        } }
      )
    }
  },
  components: {
    AddBtn
  }
}
</script>
<style lang="scss">
.line-list-container {
  .add-btn-box {
    overflow: hidden;
  }
}
</style>

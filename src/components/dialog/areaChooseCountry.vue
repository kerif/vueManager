<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('选择国家/地区')"
    class="choose-area-dialog"
    width="1100px"
  >
    <el-row>
      <el-col :span="22">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="多个关键词请用半角逗号分开"
          v-model="keyword"
        >
        </el-input
      ></el-col>
      <el-col :span="2" style="text-align: right">
        <el-button type="primary" plain @click="loadList">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" tooltip-effect="dark" height="450px">
      <el-table-column width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleChoose(scope.row)">选择</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="国家/地区"> </el-table-column>
      <el-table-column prop="code" label="代码"> </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dataList: [],
      selected: [],
      keyword: '',
      multiple: true
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    handleSelectionChange(val) {
      this.selected = val
    },
    loadList() {
      this.$request.getCountriesList({ keyword: this.keyword }).then(res => {
        this.dataList = res.data
      })
    },
    handleChoose(row) {
      const resut = { id: row.id, name: row.name }
      this.success(resut)
      this.show = false
    }
  }
}
</script>
<style lang="scss" scope>
.choose-area-dialog {
}
</style>

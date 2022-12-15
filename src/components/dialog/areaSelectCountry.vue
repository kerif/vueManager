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
    <el-table
      :data="dataList"
      style="width: 100%"
      tooltip-effect="dark"
      height="450px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" v-if="multiple"> </el-table-column>
      <el-table-column width="100" v-else>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleChoose(scope.row)">选择</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="国家/地区"> </el-table-column>
      <el-table-column prop="code" label="代码"> </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer" v-if="multiple">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dataList: [],
      selected: [],
      multiple: true,
      keyword: ''
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
    },
    onConfirm() {
      if (!this.selected.length) {
        return this.$message.error(this.$t('请选择'))
      }
      const resut = []
      for (let index = 0; index < this.selected.length; index++) {
        const element = this.selected[index]
        resut.push({
          id: element.id,
          name: element.name
        })
      }
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

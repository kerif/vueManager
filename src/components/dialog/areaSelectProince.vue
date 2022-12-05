<template>
  <el-dialog
    :visible.sync="show"
    @open="loadList"
    :title="$t('选择省/州')"
    class="choose-area-dialog"
  >
    <el-row>
      <el-col :span="22">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="多个关键词请用半角逗号分开"
          v-model="textarea"
        >
        </el-input
      ></el-col>
      <el-col :span="2" style="text-align: right">
        <el-button type="primary" plain>搜索</el-button>
      </el-col>
    </el-row>
    <h2>{{ caption }}</h2>
    <el-table
      :data="dataList"
      style="width: 100%"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="name" label="省/州"> </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
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
      pId: 0,
      caption: ''
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selected = val
    },
    loadList() {
      this.$request.getCountriesSecondList({ country_id: this.pId }).then(res => {
        this.dataList = res.data
      })
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

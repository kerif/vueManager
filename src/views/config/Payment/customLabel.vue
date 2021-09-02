<template>
  <div class="label-container">
    <el-form>
      <el-form-item>
        <div style="text-align: right">
          <el-button class="btn-light-red">{{ $t('添加属性') }}</el-button>
        </div>
        <el-table v-loading="tableLoading" class="data-list positions-type" border stripe>
          <el-table-column width="100px" align="center">
            <template>
              <i class="el-icon-sort icon-fonts"></i>
            </template>
          </el-table-column>
          <el-table-column :label="$t('属性名称')" prop="name"></el-table-column>
          <el-table-column align="center">
            <template>
              <span></span>
              <span class="el-icon-plus icon-sty"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" width="200">
            <template>
              <el-button class="btn-dark-green">{{ $t('编辑') }}</el-button>
              <el-button class="btn-light-red">{{ $t('删除') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="sort-sty">
          *{{ $t('拖拽行可以进行排序') }}
          <el-button class="btn-deep-purple save-sort">{{ $t('保存排序结果') }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false
    }
  },
  created() {
    this.getLineLabel()
  },
  methods: {
    getLineLabel() {
      this.$request.lineLabel().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss"></style>

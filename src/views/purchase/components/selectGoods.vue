<template>
  <el-dialog
    :visible.sync="showSelectGoods"
    :title="$t('选择商品清单')"
    :before-close="close"
    @close="clear"
  >
    <el-table
      ref="multipleTable"
      :data="goodsData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="checkNum"> </el-table-column>
      <el-table-column :label="$t('物品中文名称')" prop="cn_name" width="120"> </el-table-column>
      <el-table-column prop="brand" :label="$t('品牌')" width="120"> </el-table-column>
      <el-table-column prop="remain" :label="$t('剩余明细数量')"> </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="close">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确认') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      selection: []
    }
  },
  props: {
    showSelectGoods: {
      type: Boolean,
      default: false
    },
    goodsData: {
      type: Array
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val
    },
    close() {
      this.$emit('passVal', false)
    },
    checkNum(row) {
      if (row.remain === 0 || row.remain < 0) {
        return 0
      } else {
        return 1
      }
    },
    confirm() {
      this.$emit('passVal', false)
      this.$emit('getVal', JSON.parse(JSON.stringify(this.selection)))
    },
    clear() {
      this.selection = []
      this.$refs.multipleTable.clearSelection()
    }
  }
}
</script>

<style>
.el-dialog__header {
  background-color: #0e102a;
}
.el-dialog__title {
  font-size: 14px;
  color: #fff;
}
.el-dialog__close {
  color: #fff;
}
</style>

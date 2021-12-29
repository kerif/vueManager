<template>
  <el-dialog
    :visible.sync="showExplain"
    :title="$t('异常说明')"
    :before-close="close"
    class="abnormalLog-container"
    @close="clear"
  >
    <el-table :data="operatorData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 操作 -->
      <el-table-column
        :label="$t('操作')"
        prop="log"
        :show-overflow-tooltip="true"
        width="400"
      ></el-table-column>
      <!-- 时间 -->
      <el-table-column :label="$t('时间')" prop="created_at"></el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="close">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('去处理') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      operatorData: [],
      localization: {}
    }
  },
  props: {
    showExplain: {
      type: Boolean,
      default: false
    },
    logId: {
      type: [Number, String],
      required: true
    }
  },
  created() {},
  methods: {
    close() {
      this.$emit('getLog', false)
    },
    getList() {
      this.$request.getOperate(this.logId).then(res => {
        if (res.ret) {
          this.operatorData = res.data.logs
          this.localization = res.localization
        }
      })
    },
    init() {
      this.getList()
    },
    confirm() {
      this.$request.exceptDescription(this.logId).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.$emit('getLog', false)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {}
  }
}
</script>

<style lang="scss">
.abnormalLog-container {
  font-size: 14px;
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
  .text {
    width: 80%;
  }
}
</style>

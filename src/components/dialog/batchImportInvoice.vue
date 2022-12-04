<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('批量导入发货单')"
    class="batch-import-invoice"
    @close="clear"
  >
    <el-form label-width="160px">
      <el-form-item :label="$t('第一步: 下载模板')">
        <el-button size="small" type="primary" plain @click="dowmLoadTmp">{{
          $t('下载模板')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('第二步: 上传模板')">
        <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          :on-remove="onFileRemove"
          :file-list="fileList"
          :http-request="uploadTmp"
        >
          <el-button size="small" type="primary" plain>{{ $t('点击上传') }}</el-button>
        </el-upload>
      </el-form-item>
      <div>{{ $t('*提交前请核实订单状态，不是待发货状态订单无法加入发货单') }}</div>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      template: '',
      url: '',
      files: null,
      data: null
    }
  },
  methods: {
    dowmLoadTmp() {
      this.$request.downLoadInvoiceTmp().then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.url = res.data.url
          window.open(res.data.url)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    uploadTmp(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onUpload(file) {
      this.data = file
      this.files = new FormData()
      this.files.append(`files[${0}][file]`, file)
      return this.$request.uploadFiles(this.files)
    },
    // 文件删除
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    confirm() {
      const params = new FormData()
      params.append('template', this.data)
      this.$request.importInvoiceTmp(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    clear() {
      this.fileList = []
    }
  }
}
</script>

<style lang="scss">
.batch-import-invoice {
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
  .el-form-item__label {
    text-align: left;
  }
}
</style>

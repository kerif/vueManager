<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('批量分配员工')"
    class="dialog-batchAllocate"
    @close="clear"
  >
    <el-row :gutter="20">
      <el-col :span="4">
        <div style="height: 200px">
          <el-steps direction="vertical" :active="2">
            <el-step :title="$t('步骤 1')"></el-step>
            <el-step :title="$t('步骤 2')"></el-step>
          </el-steps>
        </div>
      </el-col>
      <el-col :span="20">
        <div>
          <el-form label-position="top">
            <el-form-item :label="$t('下载模版')" class="uploadTmp">
              <el-row :gutter="20">
                <el-col :span="20">
                  <el-button size="small" @click="downTemplate">{{ $t('客户模板') }}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="$t('上传模版')">
              <el-row>
                <el-col :span="20">
                  <el-upload
                    class="upload-demo"
                    action=""
                    :limit="1"
                    :on-remove="onFileRemove"
                    :file-list="fileList"
                    :on-exceed="handleExceed"
                    :before-upload="beforeUploadExcel"
                    :before-remove="beforeRemove"
                    :http-request="uploadExcel"
                  >
                    <el-button size="small" type="primary">{{ $t('点击上传') }}</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" style="text-align: right">
            <el-button type="primary" @click="submit" size="small">{{ $t('保存') }}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      url: '',
      param: ''
    }
  },
  created() {},
  methods: {
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    handleExceed() {
      return this.$message.warning(this.$t('当前限制上传1个文件'))
    },
    beforeUploadExcel() {},
    beforeRemove(file, fileList) {
      console.log(fileList)
      return this.$confirm(this.$t(`确定移除 ${file.name}？`))
    },
    onUpload(file) {
      console.log(file)
      // 通过FormData对象上传文件
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      // this.param = new FormData()
      // this.param.append(`file`, file)
      return this.$request.uploadFiles(params)
    },
    uploadExcel(item) {
      let file = item.file
      console.log(file)
      this.onUpload(file).then(res => {
        if (res.ret) {
          console.log(res.data)
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
    downTemplate() {
      this.$request.customerTmp().then(res => {
        if (res.ret) {
          this.url = res.data.url
          window.open(this.url)
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
    submit(file) {
      // let file = this.param
      // console.log(file)
      this.$request.batchAllocate(file).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
          this.success()
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
.dialog-batchAllocate {
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
  .uploadTmp {
    height: 150px;
    margin-top: -10px;
  }
}
</style>

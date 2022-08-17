<template>
  <el-dialog :visible.sync="show" :title="$t('批量导入')" @close="clear">
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
            <el-form-item :label="$t('下载模版')">
              <el-button @click="downloadUserTag" size="small">{{ $t('标签模板') }}</el-button>
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
                    :before-remove="beforeRemove"
                    :http-request="uploadExcel"
                  >
                    <el-button size="small" type="primary">{{ $t('点击上传') }}</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="footer-btn">
            <el-button
              type="primary"
              :loading="$store.state.btnLoading"
              @click="submit"
              size="small"
              >{{ $t('保存') }}</el-button
            >
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
      param: null
    }
  },
  methods: {
    init() {},
    downloadUserTag() {
      this.$request.dowmLoadUserTagTmp().then(res => {
        if (res.ret) {
          window.open(res.data.url)
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
    // 文件删除
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    handleExceed() {
      return this.$message.warning(this.$t('当前限制上传1个文件'))
    },
    beforeRemove(file, fileList) {
      console.log(fileList)
      return this.$confirm(this.$t(`确定移除 ${file.name}？`))
    },
    onUpload(file) {
      console.log(file)
      // 通过FormData对象上传文件
      this.params = new FormData()
      this.params.append(`files[${0}][file]`, file)
      this.param = new FormData()
      this.param.append(`file`, file)
      return this.$request.uploadFiles(this.params)
    },
    uploadExcel(item) {
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
    submit() {
      let file = this.param
      this.$request.uploadUserTagTmp(file).then(res => {
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
.footer-btn {
  text-align: right;
}
</style>

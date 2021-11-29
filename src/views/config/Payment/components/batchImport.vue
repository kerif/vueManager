<template>
  <el-dialog
    :visible.sync="showImport"
    :title="$t('批量导入')"
    :before-close="close"
    class="dialog-batchImport"
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
            <el-form-item :label="$t('下载模版')" style="height: 150px; margin-top: -10px">
              <span class="import-sty">{{
                $t('下载对应模版，如实填写批量下单表后，请以Excel形式保存，点击第二步上传')
              }}</span
              ><br />
              <el-row :gutter="20">
                <el-col :span="20">
                  <div
                    v-for="item in tmpData"
                    :key="item.id"
                    style="display: inline-block; margin: 0 5px 0 0"
                  >
                    <el-button @click="uploadList(item.id)" size="small">{{ item.name }}</el-button>
                  </div>
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
          <div slot="footer">
            <el-button type="primary" @click="submit" size="small">{{ $t('保存') }}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { downloadStreamFile } from '@/utils/index'

export default {
  data() {
    return {
      tmpData: [],
      fileList: [],
      type: '',
      params: ''
    }
  },
  props: {
    showImport: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.getTmpTypeList().then(res => {
        if (res.ret) {
          console.log(res.data)
          this.tmpData = res.data
        }
      })
    },
    close() {
      this.$emit('passVal', false)
    },
    uploadList(id) {
      let param = {
        responseType: 'blob',
        params: {
          type: id
        }
      }
      this.$request.getImportTemplate(param).then(res => {
        downloadStreamFile(res, 'sheet', 'xlsx')
      })
    },
    // 文件删除
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
      // 通过FormData对象上传文件
      this.params = new FormData()
      this.params.append(`file`, file)
      return this.$request.uploadFiles(this.params)
    },
    uploadExcel(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.tips,
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
      this.$request.batchImport(this.params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.tips,
            type: 'success'
          })
          this.$emit('passVal', false)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    clear() {}
  }
}
</script>

<style lang="scss">
.dialog-batchImport {
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
}
</style>

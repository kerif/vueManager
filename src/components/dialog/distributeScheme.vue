<template>
  <el-dialog
    :visible.sync="show"
    :title="mode === 1 ? $t('导入采购清单') : $t('导入分货方案')"
    @close="clear"
  >
    <el-form>
      <el-form-item :label="$t('第一步: 下载模板')">
        <el-button size="small" class="save-btn" @click="downloadTmp">{{ $t('模板') }}</el-button>
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
          <el-button type="primary" size="small" class="save-btn">{{ $t('点击上传') }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { downloadStreamFile } from '@/utils/index'
export default {
  data() {
    return {
      fileList: [],
      mode: '',
      goodsList: [],
      goodsData: [],
      id: ''
    }
  },
  methods: {
    init() {},
    downloadTmp() {
      if (this.mode === 1) {
        this.$request
          .importGoodTmp()
          .then(res => {
            downloadStreamFile(res, '采购清单')
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$request
          .importPickOrderTmp()
          .then(res => {
            downloadStreamFile(res, '分货方案')
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    onUpload(file) {
      this.params = new FormData()
      this.params.append(`files[${0}][file]`, file)
      this.param = new FormData()
      this.param.append(`file`, file)
      return this.$request.uploadFiles(this.params)
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
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    confirm() {
      let file = this.param
      if (this.mode === 1) {
        this.$request.batchImportGood(file).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.show = false
            this.goodsData = res.data
            console.log(this.goodsData)
            this.success(this.goodsData)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        let id = this.id ? this.id : 0
        this.$request.uploadPickOrder(id, file).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.show = false
            this.goodsList = res.data
            this.success(this.goodsList)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    clear() {
      this.fileList = []
    }
  }
}
</script>

<style></style>

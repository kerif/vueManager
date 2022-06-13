<template>
  <el-dialog :visible.sync="show" :title="$t('导入分货方案')" @close="clear">
    <el-form>
      <el-form-item :label="$t('第一步: 下载模板')">
        <el-button>{{ $t('模板') }}</el-button>
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
          <el-button>{{ $t('点击上传') }}</el-button>
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
export default {
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    uploadTmp() {},
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    confirm() {},
    clear() {}
  }
}
</script>

<style></style>

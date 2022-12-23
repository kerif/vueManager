<template>
  <el-dialog :visible.sync="show" :title="$t('导入')" class="abnormalLog-container">
    <div class="template">
      <div>
        <span class="step">1</span>
        {{$t('您可以先导出现有的数据模板')}}
        <div class="button">
          <el-button :loading="$store.state.btnLoading" @click="downloadTemplate">{{$t('导出')}}</el-button>
        </div>
        <span class="step">2</span>
        {{$t('将修改的好模板按原有格式导入')}}
        <div class="button">
          <el-upload class="upload-demo" action="" :http-request="uploadRsaFile" :on-error="onError" :show-file-list="false" name="file">
            <el-button :loading="$store.state.btnLoading">{{$t('选择文件')}}</el-button>
          </el-upload>
        </div>
        <span class="step">3</span>
        {{$t('系统将为更新修改的内容进行批量更新替换')}}
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    onError() {
      this.$message.error(this.$t('上传失败'))
    },
    // 
    uploadRsaFile(file) {
      this.onUpload(file.file).then(res => {
        if (1==res.ret) {
            this.$message.success(res.msg)
            this.show = false
            this.success()
        }else{
            this.$message.error(res.msg)
          return
        }
      })
    },
    onUpload(file) {
      let params = new FormData()
      params.append(`file`, file)
      return this.$request.guideInto(params)
    },
    downloadTemplate() {
      this.$request.derive().then(res=>{
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          window.open(res.data)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.template {
  width: 80%;
  margin: auto;
  .step {
    width: 20px;
    height: 20px;
    display: inline-block;
    border: 1px solid rgb(13, 13, 13);
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    margin-right: 20px;
  }
  .button {
    margin: 20px 50px;
  }
}
</style>
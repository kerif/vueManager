<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('配置')"
    class="dialog-config"
    width="50%"
    @close="clear"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      label-position="top"
    >
      <!-- 小程序ID -->
      <el-form-item :label="$t('小程序ID')" prop="app_id">
        <el-input :placeholder="$t('请输入小程序ID')" v-model="ruleForm.app_id"></el-input>
      </el-form-item>
      <el-form-item :label="$t('公众号ID')" prop="oa_app_id">
        <el-input :placeholder="$t('请输入公众号ID')" v-model="ruleForm.oa_app_id"></el-input>
      </el-form-item>
      <el-form-item :label="$t('商户号ID')">
        <el-input :placeholder="$t('请输入商户号ID')" v-model="ruleForm.mch_id"></el-input>
      </el-form-item>
      <el-form-item :label="$t('商户KEY')">
        <el-input :placeholder="$t('请输入商户KEY')" v-model="ruleForm.key"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('通信安全公钥证书')">
        <el-input
          :placeholder="$t('请输入通信安全公钥证书')"
          v-model="ruleForm.cert_path"
        ></el-input>
        <el-upload
          class="upload-demo"
          action=""
          :on-preview="handlePreview"
          :http-request="uploadRsaFile"
        >
          <el-button size="small" class="btn-main chooseBtn">{{ $t('选择') }}</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('通信安全私钥证书')">
        <el-input
          :placeholder="$t('请输入通信安全私钥证书')"
          v-model="ruleForm.key_path"
        ></el-input>
        <el-upload
          class="upload-demo"
          action=""
          :on-preview="handlePreview"
          :http-request="uploadKeyFile"
        >
          <el-button size="small" class="btn-main chooseBtn">{{ $t('选择') }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <p class="noticeAddress">{{ $t('支付通知地址:') }} {{ ruleForm.notify_url }}</p>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      fileList: [],
      ruleForm: {
        app_id: '',
        oa_app_id: '',
        mch_id: '',
        key: '',
        cert_path: '',
        key_path: '',
        notify_url: ''
      },
      country: [],
      rules: {
        // country_id: [
        //   { required: true, message: '请输入目的地', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    getList() {
      this.$request.getWechat().then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        }
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { ...this.ruleForm }
          for (const key in params) {
            // eslint-disable-next-line no-prototype-builtins
            if (params.hasOwnProperty(key)) {
              if (!params[key]) delete params[key]
            }
          }
          this.$request.updateWechat(params).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    clear() {
      this.ruleForm.country_id = ''
      this.ruleForm.remark = ''
    },
    // 上传商户 key_path 文件
    uploadKeyFile(file) {
      this.onUpload(file.file).then(res => {
        if (res.ret) {
          this.ruleForm.key_path = res.data[0].path
        }
      })
    },
    // 上传安全公钥文件
    uploadRsaFile(file) {
      this.onUpload(file.file).then(res => {
        if (res.ret) {
          this.ruleForm.cert_path = res.data[0].path
        }
      })
    },
    onUpload(file) {
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      return this.$request.uploadCerts(params)
    },
    init() {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-config {
  .el-dialog__body {
    padding: 30px 50px;
  }
  .el-form-item__label {
    width: 150px;
  }
  .el-input {
    width: 70%;
  }
  .el-textarea__inner {
    width: 70%;
  }
  .noticeAddress {
    width: 70%;
  }
  .chooseBtn {
    position: absolute;
    left: calc(70% - 60px);
    // right: 238px;
    top: 5px;
  }
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

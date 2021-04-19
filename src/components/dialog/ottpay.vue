<template>
  <el-dialog :visible.sync="show" :title="$t('配置')" class="dialog-alipay" width="50%"
  @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 员工组中文名 -->
        <el-form-item :label="$t('商户号')">
            <el-input :placeholder="$t('请输入商户号')" v-model="ruleForm.merchant_id"></el-input>
        </el-form-item>
        <el-form-item :label="$t('操作员号')">
            <el-input :placeholder="$t('请输入操作员号')" v-model="ruleForm.operator_id"></el-input>
        </el-form-item>
        <el-form-item :label="$t('签名密钥')">
            <el-input :placeholder="$t('请输入签名密钥')" v-model="ruleForm.sign_key"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('支付宝公钥证书')">
            <el-input :placeholder="$t('请输入支付宝公钥证书')" v-model="ruleForm.ali_public_key"></el-input>
            <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :http-request="uploadRsaFile"
                >
                <el-button size="small" class="btn-main chooseBtn">{{$t('选择')}}</el-button>
            </el-upload>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('支付宝私钥证书')">
            <el-input :placeholder="$t('请输入支付宝私钥证书')" v-model="ruleForm.private_key"></el-input>
            <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :http-request="uploadKeyFile">
                <el-button size="small" class="btn-main chooseBtn">{{$t('选择')}}</el-button>
            </el-upload>
        </el-form-item> -->
    </el-form>
    <!-- <p class="noticeAddress">{{$t('支付通知地址:')}}  {{ruleForm.alipay_root_cert}}</p> -->
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      fileList: [],
      ruleForm: {
        merchant_id: '',
        operator_id: '',
        sign_key: ''
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
    getList () {
      this.$request.getOttPay().then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        }
      })
    },
    confirm () {
      let params = { ...this.ruleForm }
      // for (const key in params) {
      //   if (params.hasOwnProperty(key)) {
      //     if (!params[key]) delete params[key]
      //   }
      // }
      this.$request.updateOttPay(params).then(res => {
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
        this.show = false
      })
    },
    handlePreview (file) {
      console.log(file)
    },
    clear () {
      this.ruleForm.country_id = ''
      this.ruleForm.remark = ''
    },
    // 上传商户 key_path 文件
    uploadKeyFile (file) {
      this.onUpload(file.file).then(res => {
        if (res.ret) {
          this.ruleForm.private_key = res.data[0].path
        }
      })
    },
    // 上传安全公钥文件
    uploadRsaFile (file) {
      this.onUpload(file.file).then(res => {
        if (res.ret) {
          this.ruleForm.ali_public_key = res.data[0].path
        }
      })
    },
    onUpload (file) {
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      return this.$request.uploadCerts(params)
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-alipay {
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
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
}
</style>

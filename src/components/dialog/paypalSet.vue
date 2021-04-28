<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('配置')"
    class="dialog-paypal"
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
      <el-form-item :label="$t('沙盒模式')">
        <el-select v-model="ruleForm.sandbox" :placeholder="$t('请选择')" clearable>
          <el-option
            v-for="item in positionData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Client ID" prop="client_id">
        <el-input :placeholder="$t('请输入Client ID')" v-model="ruleForm.client_id"></el-input>
      </el-form-item>
      <el-form-item label="Secret">
        <el-input :placeholder="$t('请输入Secret')" v-model="ruleForm.secret"></el-input>
      </el-form-item>
      <el-form-item :label="$t('账号')">
        <el-input :placeholder="$t('请输入账号')" v-model="ruleForm.account"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('通信安全私钥证书')">
            <el-input :placeholder="$t('请输入通信安全私钥证书')" v-model="ruleForm.key_path"></el-input>
            <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :http-request="uploadKeyFile">
                <el-button size="small" class="btn-main chooseBtn">{{$t('选择')}}</el-button>
            </el-upload>
        </el-form-item> -->
    </el-form>
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
        sandbox: 0,
        client_id: '',
        secret: '',
        account: ''
      },
      positionData: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
        }
      ],
      rules: {
        // country_id: [
        //   { required: true, message: '请输入目的地', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    getList() {
      this.$request.getPaypal().then(res => {
        if (res.ret) {
          this.ruleForm.sandbox = res.data.sandbox
          this.ruleForm.client_id = res.data.client_id
          this.ruleForm.secret = res.data.secret
          this.ruleForm.account = res.data.account
        }
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { ...this.ruleForm }
          this.$request.updatePaypal(params).then(res => {
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
        } else {
          return false
        }
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    clear() {
      this.ruleForm.client_id = ''
      this.ruleForm.secret = ''
      this.ruleForm.sandbox = ''
      this.ruleForm.account = ''
    },
    // 上传商户 key_path 文件
    // uploadKeyFile (file) {
    //   this.onUpload(file.file).then(res => {
    //     if (res.ret) {
    //       this.ruleForm.key_path = res.data[0].path
    //     }
    //   })
    // },
    // onUpload (file) {
    //   let params = new FormData()
    //   params.append(`files[${0}][file]`, file)
    //   return this.$request.uploadCerts(params)
    // },
    init() {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-paypal {
  .el-dialog__body {
    padding: 30px 50px;
  }
  .el-form-item__label {
    width: 150px;
  }
  .el-input {
    // width: 70%;
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
  .banner-sty {
    width: 45% !important;
    margin-left: 50px;
  }
}
</style>

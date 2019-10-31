<template>
  <el-dialog :visible.sync="show" title="配置" class="dialog-config" width="50%"
  @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 员工组中文名 -->
        <el-form-item label="小程序ID" prop="country_id">
            <el-input placeholder="请输入小程序ID"></el-input>
        </el-form-item>
        <el-form-item label="商户号ID">
            <el-input placeholder="请输入商户号ID"></el-input>
        </el-form-item>
        <el-form-item label="商户KEY">
            <el-input placeholder="请输入商户KEY">
            </el-input>
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :file-list="fileList">
                <el-button size="small" class="btn-main chooseBtn">选择</el-button>
            </el-upload>
            <!-- <el-button class="btn-main chooseBtn">选择</el-button> -->
        </el-form-item>
        <el-form-item label="通信安全公钥证书">
            <el-input placeholder="请输入通信安全公钥证书"></el-input>
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :file-list="fileList">
                <el-button size="small" class="btn-main chooseBtn">选择</el-button>
            </el-upload>
        </el-form-item>
        <el-form-item label="通信安全私钥证书">
            <el-input placeholder="请输入通信安全私钥证书"></el-input>
        </el-form-item>
    </el-form>
    <p>支付通知地址: https://www.nle@bv.cn</p>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      fileList: [],
      ruleForm: {
        country_id: '',
        remark: ''
      },
      country: [],
      rules: {
        // country_id: [
        //   { required: true, message: '请输入目的国', trigger: 'blur' }
        // ]
      }
    }
  },
  created () {
    this.getCountry()
  },
  methods: {
    getCountry () {
      this.$request.getCountry().then(res => {
        this.country = res.data
      })
    },
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.saveShip(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '成功',
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
    handlePreview (file) {
      console.log(file)
    },
    clear () {
      this.ruleForm.country_id = ''
      this.ruleForm.remark = ''
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
    width: 60%;
  }
  .chooseBtn {
    position: absolute;
    left: calc(60% - 60px);
    // right: 238px;
    top: 5px;
  }
}
</style>

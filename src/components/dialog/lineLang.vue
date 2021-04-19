<template>
  <el-dialog :visible.sync="show" :title="line.name + $t('的翻译内容')" class="dialog-line-lang" @close="clear">
    <div class="lang-sty">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{$t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息')}}
        </p>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <!-- 线路名称 -->
        <el-form-item :label="$t('线路名称')" prop="name">
          <el-input v-model="ruleForm.name"
          :placeholder="$t('请输入')"></el-input>
          </el-form-item>
        <!-- 参考时效 -->
          <el-form-item :label="$t('参考时效')" prop="reference_time">
          <el-input v-model="ruleForm.reference_time"
          :placeholder="$t('请输入')"></el-input>
          </el-form-item>
        <!-- 备注 -->
          <el-form-item :label="$t('备注')" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4}"
          :placeholder="$t('请输入')"></el-input>
          </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('ruleForm')">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        reference_time: '',
        remark: '',
        language: ''
      },
      state: '',
      rules: {
        name: [
          { required: true, message: this.$t('请输入线路名称'), trigger: 'blur' }
        ],
        reference_time: [
          { required: true, message: this.$t('请输入参考时效'), trigger: 'blur' }
        ],
        remark: [
          { required: true, message: this.$t('请输入备注'), trigger: 'blur' }
        ]
      },
      line: {
        id: '',
        name: ''
      },
      lang: {
        name: '',
        language_code: ''
      },
      transCode: ''
    }
  },
  methods: {
    getLang () {
      this.$request.lineLang(this.line.id, {
        lang: this.ruleForm.language
      }).then(res => {
        this.ruleForm.name = res.data.name
        this.ruleForm.remark = res.data.remark
        this.ruleForm.reference_time = res.data.reference_time
        console.log(this.ruleForm, 'this.ruleForm')
      })
    },
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.updateLineLang(this.line.id, this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$message('操作成功'),
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
    clear () {
      this.ruleForm.name = ''
      this.ruleForm.reference_time = ''
      this.ruleForm.remark = ''
    },
    cancelDialog (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init () {
      this.line = this.line
      this.lang = this.lang
      this.ruleForm.language = this.lang.language_code
      this.transCode = this.transCode
      console.log(this.line, 'line')
      console.log(this.lang, 'lang')
      console.log(this.transCode, 'this.transCode')
      console.log(this.ruleForm.language, 'this.ruleForm.language')
      if (this.transCode === 1) {
        this.getLang()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-line-lang {
  .el-input {
    width: 40% !important;
    margin-left: 50px;
  }
  .el-textarea {
    width: 40% !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 250px !important;
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
  .lang-sty {
    line-height: 40px;
    color: #e6a344;
    margin-left: 80px;
    width: 66%;
    p {
      background-color: #fdf6ed;
    }
  }
  .icon-info {
    color: #e6a344;
    font-size: 18px;
    margin-left: 15px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
</style>

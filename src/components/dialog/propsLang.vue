<template>
  <el-dialog :visible.sync="show" :title="$t('物品属性的翻译内容')" class="dialog-pc-lang" @close="clear">
    <div class="lang-sty">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{$t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息')}}
        </p>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <!-- 物品属性 -->
        <el-form-item :label="item.cn_name" v-for="item in dynamicTags" :key="item.id">
        <el-input v-model="item.name"
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
        language: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('请输入'), trigger: 'blur' }
        ]
      },
      lang: {
        name: '',
        language_code: ''
      },
      transCode: '',
      dynamicTags: []
    }
  },
  methods: {
    getProps () {
      this.$request.propsLang({
        lang: this.ruleForm.language
      }).then(res => {
        // this.ruleForm.name = res.data.name
        const props = {}
        res.data.forEach(item => {
          props[item.id] = item.name
        })
        console.log('props', props)
        this.dynamicTags.forEach(item => {
          item.name = props[item.id]
        })
        console.log(this.ruleForm, 'this.ruleForm')
      })
    },
    confirm (formName) {
      const props = this.dynamicTags.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
      this.$request.updatePropsLang({
        language: this.ruleForm.language,
        props
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
    clear () {
      this.ruleForm.website_name = ''
      this.ruleForm.name = ''
      this.$refs['ruleForm'].resetFields()
      this.$refs['ruleForm'].clearValidate()
    },
    cancelDialog (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.$refs[ruleForm].clearValidate()
      this.show = false
    },
    init () {
      console.log(this.lang, 'lang')
      this.lang = this.lang
      this.ruleForm.language = this.lang.language_code
      this.getProps()
      this.dynamicTags = this.dynamicTags
      console.log(this.dynamicTags, 'dynamicTags')
    }
  }
}
</script>
<style lang="scss">
.dialog-pc-lang {
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

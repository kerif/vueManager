<template>
  <el-dialog :visible.sync="show" :title="$t('配置')" class="dialog-add-express" width="50%" @close="clear">
    <div style="margin-bottom: 20px;">
      <el-radio-group v-model="radio">
        <el-radio-button label="1">{{ $t('基础配置') }}</el-radio-button>
        <el-radio-button label="2">{{ $t('到件先知') }}</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="radio==1">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" label-position="left">
        <el-form-item :label="$t('快递公司名称')" prop="name">
          <el-input v-model="ruleForm.name" :placeholder="$t('请输入快递公司名称')"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('快递公司代码')" prop="num">
          <el-input v-model="ruleForm.num" :placeholder="$t('请输入快递公司代码')"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('排序索引')" prop="index">
          <el-input v-model.number="ruleForm.index" :placeholder="$t('请输入排序索引')"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('启用状态')">
          <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0" :active-text="$t('开')" :inactive-text="$t('关')">
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('到件先知')">
          <el-switch v-model="ruleForm.auto_status" :active-value="1" :inactive-value="0" :active-text="$t('开')" :inactive-text="$t('关')">
          </el-switch>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-form :model="form" ref="Form" label-width="150px" class="demo-ruleForm" label-position="left">
        <div class="message">
          <h4 style="color: #D36361;">{{$t('到件先知即提前获取没有预报信息')}},{{$t('直接通过快递过来的包裹信息')}}</h4>
          <el-form-item :label="$t('快递公司登录账号')">
            <el-input v-model="form.username"> </el-input>
          </el-form-item>
          <el-form-item :label="$t('快递公司登录密码')">
            <el-input show-password v-model="form.password"> </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <!-- <el-button plain v-if="radio==2" @click="test()">{{ $t('测试') }}</el-button> -->
      <el-button type="primary" @click="confirm()">{{ $t('保存') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      radio: '1',
      form: {
        username: '',
        password: ''
      },
      ruleForm: {
        name: '',
        num: '',
        status: 1,
        auto_status: 1,
        index: null
      },
      rules: {
        name: [{ required: true, message: this.$t('请输入快递公司名称'), trigger: 'blur' }],
        num: [{ required: true, message: this.$t('请输入快递公司代码'), trigger: 'blur' }],
        index: [{ required: true, message: this.$t('请输入排序索引'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    test() {
      this.$request.updateConfig(this.id, { ...this.form }).then(res => {
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
    },
    clear() {
      if (this.radio == 1) {
        this.$refs.ruleForm.resetFields();
      }
      this.radio = 1
      this.form.username = ''
      this.form.password = ''
    },
    details() {
      this.$request.ForecastCompaniesDetails(this.id).then(res => {
        if (res.ret) {
          Object.keys(this.ruleForm).forEach(item => {
            this.ruleForm[item] = res.data[item]
          })
          Object.keys(this.form).forEach(item => {
            this.form[item] = res.data.config == null ? '' : res.data.config[item]
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm() {
      if (this.radio == 1) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$request.updateForecastCompanies(this.id, { ...this.ruleForm }).then(res => {
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
      } else {
        this.test()
      }
    },
    init() {
      this.details()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-add-express {
  .configuration {
    display: flex;
    justify-content: space-between;
  }
}
</style>
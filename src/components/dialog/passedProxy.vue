<template>
  <el-dialog :visible.sync="show" :title="$t('审核')" class="dialog-Passed" @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <!-- 联系人 -->
      <el-form-item :label="$t('联系人')">
        <span class="right-padding">{{ name }}</span>
      </el-form-item>
      <!-- 联系电话 -->
      <el-form-item :label="$t('联系电话')">
        <span class="right-padding">{{ phone }}</span>
      </el-form-item>
      <!-- 联系邮箱 -->
      <el-form-item :label="$t('联系邮箱')">
        <span class="right-padding">{{ email }}</span>
      </el-form-item>
      <el-form-item :label="$t('佣金模版')">
        <el-select style="margin-left: 50px" v-model="ruleForm.template_id" placeholder="请选择">
          <el-option
            v-for="item in templateData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 佣金比例 -->
      <el-form-item :label="$t('佣金比例%')" prop="commission" v-if="ruleForm.template_id == 0">
        <el-input
          class="input-sty"
          v-model="ruleForm.commission"
          :placeholder="$t('请输入佣金比例')"
        ></el-input>
      </el-form-item>
      <!-- 用户组描述 -->
      <el-form-item :label="$t('备注')">
        <el-input
          class="input-sty"
          type="textarea"
          v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('ruleForm')">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        commission: '',
        remark: '',
        template_id: ''
      },
      email: '',
      phone: '',
      name: '',
      templateData: [],
      rules: {
        commission: [{ required: true, message: this.$t('请输入佣金比例'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取佣金模版数据
    getTemplate() {
      this.$request.agentTemplate().then(res => {
        if (res.ret) {
          this.templateData = res.data
          this.templateData.unshift({ id: 0, name: '自定义' })
          console.log(this.templateData, 'templateData')
        }
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.agentApproved(this.id, this.ruleForm).then(res => {
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
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.template_id = ''
      this.ruleForm.commission = ''
      this.ruleForm.remark = ''
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init() {
      this.getTemplate()
    }
  }
}
</script>
<style lang="scss">
.dialog-Passed {
  .input-sty {
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
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
  .right-padding {
    padding-left: 50px;
  }
}
</style>

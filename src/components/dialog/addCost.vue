<template>
  <el-dialog :visible.sync="show" :title="$t('新增费用')" class="dialog-addCost" @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <!-- 费用名称 -->
      <el-form-item :label="$t('费用名称')" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('请输入费用名称')"></el-input>
      </el-form-item>
      <!-- 员工组英文名
          <el-form-item label="员工组英文名" prop="name_en">
          <el-input v-model="ruleForm.name_en"
          placeholder="请输入员工组英文名"></el-input>
          </el-form-item> -->
      <!-- 用户组描述 -->
      <!-- <el-form-item label="用户组描述">
          <el-input type="textarea" v-model="ruleForm.description"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入用户组描述"></el-input>
          </el-form-item> -->
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
        name: ''
      },
      staff: '',
      id: '',
      rules: {
        name: [{ required: true, message: this.$t('请输入费用名称'), trigger: 'blur' }],
        name_en: [{ required: true, message: this.$t('请输入员工组英文名'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    getList() {
      this.$request.addLinesCost(this.ruleForm).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        } else {
          this.$notify({
            message: res.msg,
            type: 'error',
            title: this.$t('操作失败')
          })
        }
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.addLinesCost(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.show = false
              this.success({ name: this.ruleForm.name })
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
      this.ruleForm.name = ''
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init() {
      if (this.id) {
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-addCost {
  .el-input {
    width: 40%;
    margin-left: 50px;
  }
  .el-textarea {
    width: 40%;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 300px !important;
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

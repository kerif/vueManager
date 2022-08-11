<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('新增') : $t('编辑')"
    class="dialog-addStaff"
    @close="clear"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <!-- 增值服务名称 -->
      <el-form-item :label="$t('增值服务名称')" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('请输入增值服务名称')"></el-input>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item :label="$t('价格')" prop="price">
        <el-input v-model="ruleForm.price" :placeholder="$t('请输入价格')"></el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')">
        <el-input
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
        name: '',
        price: '',
        remark: ''
      },
      state: '',
      id: '',
      rules: {
        name: [{ required: true, message: this.$t('请输入增值服务名称'), trigger: 'blur' }],
        price: [{ required: true, message: this.$t('请输入价格'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取单条的信息
    getList() {
      if (this.name === 'editService') {
        console.log('我是获取订单')
        this.getService()
      } else {
        console.log('我是获取包裹增值')
        this.getPaVal()
      }
    },
    // 订单 获取增值编辑数据
    getService() {
      this.$request.getService(this.id).then(res => {
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
    // 包裹 获取增值编辑数据
    getPaVal() {
      this.$request.getPaVal(this.id).then(res => {
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
    // 订单编辑状态下保存
    UpdateService() {
      this.$request.updateService(this.id, this.ruleForm).then(res => {
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
      })
    },
    // 添加订单增值服务
    addService() {
      this.$request.addValue(this.ruleForm).then(res => {
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
      })
    },
    // 添加包裹增值服务
    addParcel() {
      this.$request.addParcel(this.ruleForm).then(res => {
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
      })
    },
    // 包裹增值服务编辑后保存
    UpdateParcel() {
      this.$request.updateParcel(this.id, this.ruleForm).then(res => {
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
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.name === 'addService') {
            this.addService()
          } else if (this.name === 'editService') {
            this.UpdateService()
          } else if (this.name === 'addParcel') {
            this.addParcel()
          } else if (this.name === 'editParcel') {
            this.UpdateParcel()
          }
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.price = ''
      this.ruleForm.remark = ''
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init() {
      if (this.state === 'edit') {
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-addStaff {
  .el-input {
    width: 40%;
  }
  .el-textarea {
    width: 40%;
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

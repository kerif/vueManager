<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? '新增': '编辑'" class="dialog-addStaff"
   @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <!-- 增值服务名称 -->
        <el-form-item label="增值服务名称" prop="name">
          <el-input v-model="ruleForm.name"
          placeholder="请输入增值服务名称"></el-input>
          </el-form-item>
        <!-- 价格 -->
          <el-form-item label="价格" prop="price">
          <el-input v-model="ruleForm.price"
          placeholder="请输入价格"></el-input>
          </el-form-item>
        <!-- 备注 -->
          <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入备注"></el-input>
          </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('ruleForm')">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        price: '',
        remark: ''
      },
      state: '',
      id: '',
      rules: {
        name: [
          { required: true, message: '请输入增值服务名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取单条的信息
    getList () {
      if (this.name === 'editService') {
        console.log('我是获取订单')
        this.getService()
      } else {
        console.log('我是获取包裹增值')
        this.getPaVal()
      }
    },
    // 订单 获取增值编辑数据
    getService () {
      this.$request.getService(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        } else {
          this.$notify({
            message: res.msg,
            type: 'error',
            title: '操作失败'
          })
        }
      })
    },
    // 包裹 获取增值编辑数据
    getPaVal () {
      this.$request.getPaVal(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        } else {
          this.$notify({
            message: res.msg,
            type: 'error',
            title: '操作失败'
          })
        }
      })
    },
    // 订单编辑状态下保存
    UpdateService () {
      console.log('我是编辑', this.id)
      this.$request.updateService(this.id, this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
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
    // 添加订单增值服务
    addService () {
      console.log('我是添加', this.id)
      this.$request.addValue(this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
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
    // 添加包裹增值服务
    addParcel () {
      console.log('我是添加', this.id)
      this.$request.addParcel(this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
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
    // 包裹增值服务编辑后保存
    UpdateParcel () {
      console.log('我是编辑', this.id)
      this.$request.updateParcel(this.id, this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
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
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
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
    clear () {
      this.ruleForm.name = ''
      this.ruleForm.price = ''
      this.ruleForm.remark = ''
    },
    cancelDialog (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init () {
      console.log(this.name, 'name')
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
    // margin-left: 50px;
  }
  .el-textarea {
    width: 40%;
    // margin-left: 50px;
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

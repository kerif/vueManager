<template>
  <div class="add-voucher-container">
  <el-form label-position="top" class="voucher-form" :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="名称" prop="receiver_name">
          <el-input placeholder="请输入名称" v-model="ruleForm.receiver_name"></el-input>
    </el-form-item>
    <el-form-item label="金额" prop="phone">
          <el-input placeholder="请输入金额" v-model="ruleForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="最低消费" prop="postcode">
          <el-input placeholder="请输入最低消费" v-model="ruleForm.postcode"></el-input>
    </el-form-item>
    <el-form-item label="生效时间" prop="time">
           <el-date-picker
            v-model="ruleForm.time"
            type="date"
            placeholder="请输入生效时间">
            </el-date-picker>
    </el-form-item>
    <el-form-item label="失效时间" prop="address">
           <el-date-picker
            v-model="ruleForm.address"
            type="date"
            placeholder="请输入失效时间">
            </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="save-btn" @click="submit('ruleForm')"
      :loading="$store.state.btnLoading">保存</el-button>
      </el-form-item>
  </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        receiver_name: '',
        phone: '',
        postcode: '',
        address: '',
        time: ''
      },
      rules: {
        receiver_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        postcode: [
          { required: true, message: '请输入最低消费', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入失效时间', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入生效时间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
    //   this.$request.getBill().then(res => {
    //     this.ruleForm = res.data
    //   })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.saveWareHouse(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: res.msg
              })
              this.getList()
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
    }
  }
}
</script>
<style lang="scss">
.add-voucher-container {
  .voucher-form {
    padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .el-input {
    width: 40%;
  }
}
</style>

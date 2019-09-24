<template>
  <div class="warehouse-container">
  <el-form label-position="top" class="warehouse-form" :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="收件人姓名" prop="receiver_name">
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="ruleForm.receiver_name"></el-input>
          </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="联系电话" prop="phone">
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="ruleForm.phone"></el-input>
          </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="邮编" prop="postcode">
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="ruleForm.postcode"></el-input>
          </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容" type="textarea" :row="2" v-model="ruleForm.address"></el-input>
          </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="save-btn" @click="submit('ruleForm')">保存</el-button>
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
        address: ''
      },
      rules: {
        receiver_name: [
          { required: true, message: '请输入收件人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        postcode: [
          { required: true, message: '请输入邮编', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$request.getBill().then(res => {
        this.ruleForm = res.data
      })
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
.warehouse-container {
  .warehouse-form {
    padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
}
</style>

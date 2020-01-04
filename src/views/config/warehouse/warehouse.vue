<template>
  <div class="warehouse-container">
    <div class="tips-box">
      <span class="tips-title">温馨提示: </span>
      <span class="tips-content">当前页面配置的地址为用户发往仓库的真实收件地址，请填写有效准确的信息，请不要填写座机</span>
    </div>
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
            <el-input placeholder="请输入内容" type="textarea" :row="3" v-model="ruleForm.address"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="温馨提示（主要提醒客户需要注意的事项，在客户端仓库地址页面显示）" prop="tips">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入温馨提示" type="textarea" :row="4" v-model="ruleForm.tips"></el-input>
            </el-col>
        </el-row>
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
        tips: ''
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
        ],
        tips: [
          { required: true, message: '请输入温馨提示', trigger: 'blur' }
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
  background-color: #fff !important;
  .tips-box {
    padding: 20px;
    line-height: 30px;
    background-color: #f0f0f0;
    margin: 20px 20px 50px 0;
    display: inline-block;
    border-radius: 5px;
  }
  .tips-title {
    font-weight: bold;
  }
  .tips-content {
    font-size: 14px;
  }
  .warehouse-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
}
</style>

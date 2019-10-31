<template>
  <div class="new-user-container">
  <el-form label-position="top" class="voucher-form" :model="ruleForm" :rules="rules" ref="ruleForm">
    <!-- 新用户送券 -->
    <el-form-item label="新用户送券">
            <el-radio-group v-model="ruleForm.receiver_name">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
    </el-form-item>
    <!-- 邀请新人送券 -->
    <el-form-item label="邀请新人送券">
        <el-radio-group v-model="ruleForm.phone">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
    </el-form-item>
    <!-- 被邀请人送券 -->
    <el-form-item label="被邀请人送券">
            <el-radio-group v-model="ruleForm.phone">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
    </el-form-item>
    <!-- 名称 -->
    <el-form-item label="名称" prop="postcode">
          <el-input placeholder="请输入名称" v-model="ruleForm.postcode"></el-input>
    </el-form-item>
    <!-- 金额 -->
    <el-form-item label="金额" prop="postcode">
          <el-input placeholder="请输入金额" v-model="ruleForm.postcode"></el-input>
    </el-form-item>
    <!-- 最低消费 -->
      <el-form-item label="最低消费" prop="postcode">
          <el-input placeholder="请输入最低消费" v-model="ruleForm.postcode"></el-input>
    </el-form-item>
    <!-- 有效时长 -->
    <el-form-item label="有效时长" prop="postcode">
          <el-input placeholder="请输入有效时长" v-model="ruleForm.postcode">
            <template slot="append">天</template>
          </el-input>
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
.new-user-container {
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

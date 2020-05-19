<template>
  <div class="new-user-container">
  <el-form label-position="top" class="voucher-form" :model="ruleForm" :rules="rules" ref="ruleForm">
    <!-- 新用户送券 -->
    <el-form-item :label="$t('新用户送券')">
      <el-radio-group v-model="ruleForm.new_cus_send">
        <el-radio :label="1">{{$t('开启')}}</el-radio>
        <el-radio :label="0">{{$t('关闭')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 邀请新人送券 -->
    <el-form-item :label="$t('邀请新人送券')">
      <el-radio-group v-model="ruleForm.invitor_send">
        <el-radio :label="1">{{$t('开启')}}</el-radio>
        <el-radio :label="0">{{$t('关闭')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 被邀请人送券 -->
    <el-form-item :label="$t('被邀请人送券')">
      <el-radio-group v-model="ruleForm.invited_send">
        <el-radio :label="1">{{$t('开启')}}</el-radio>
        <el-radio :label="0">{{$t('关闭')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 名称 -->
    <el-form-item :label="$t('名称')" prop="name">
      <el-input :placeholder="$t('请输入名称')" v-model="ruleForm.name"></el-input>
    </el-form-item>
    <!-- 金额 -->
    <el-form-item :label="$t('金额')" prop="amount">
      <el-input :placeholder="$t('请输入金额')" v-model="ruleForm.amount"></el-input>
    </el-form-item>
    <!-- 最低消费 -->
    <el-form-item :label="$t('最低消费')" prop="threshold">
        <el-input :placeholder="$t('请输入最低消费')" v-model="ruleForm.threshold"></el-input>
    </el-form-item>
    <!-- 有效时长 -->
    <el-form-item :label="$t('有效时长')" prop="day">
      <el-input :placeholder="$t('请输入有效时长')" v-model="ruleForm.day">
        <template slot="append">{{$t('天')}}</template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="save-btn" @click="submit('ruleForm')"
      :loading="$store.state.btnLoading">{{$t('保存')}}</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        new_cus_send: '',
        invitor_send: '',
        invited_send: '',
        name: '',
        amount: '',
        threshold: '',
        day: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('请输入名称'), trigger: 'blur' }
        ],
        amount: [
          { required: true, message: this.$t('请输入金额'), trigger: 'blur' }
        ],
        threshold: [
          { required: true, message: this.$t('请输入最低消费'), trigger: 'blur' }
        ],
        day: [
          { required: true, message: this.$t('请输入有效时长'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$request.getCoupons().then(res => {
        this.ruleForm = res.data
      })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.editCoupons(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
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
  background-color: #fff !important;
  padding: 20px;
  .voucher-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .el-input {
    width: 40%;
  }
}
</style>

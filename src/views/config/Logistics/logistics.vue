<template>
  <div class="logistics-container">
    <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <el-form-item label="Appkey" prop="app_key">
        <el-input v-model="logisticsData.app_key" placeholder="请输入Appkey"></el-input>
      </el-form-item>
      <el-form-item label="AppSecret" prop="app_secret">
        <el-input v-model="logisticsData.app_secret" placeholder="请输入AppSecret"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button class="save-btn" @click="confirm('ruleForm')">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      logisticsData: {
        app_key: '',
        app_secret: ''
      },
      rules: {
        app_key: [
          { required: true, message: '请输入Appkey', trigger: 'change' }
        ],
        app_secret: [
          { required: true, message: '请输入AppSecret', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$request.getLogistics().then(res => {
        if (res.ret && res.data) {
          this.logisticsData = res.data
        } else {
          return false
        }
      })
    },
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.editLogistics(this.logisticsData).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: res.msg
              })
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
.logistics-container {
  width: 30%;
  .save-btn {
    color: #fff;
    background-color: #3540A5;
  }
}
</style>

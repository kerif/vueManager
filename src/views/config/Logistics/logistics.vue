<template>
  <div class="logistics-container">
    <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <el-form-item label="Appkey" prop="Appkey">
        <el-input v-model="logisticsData.Appkey" placeholder="请输入Appkey"></el-input>
      </el-form-item>
      <el-form-item label="AppSecret" prop="AppSecret">
        <el-input v-model="logisticsData.AppSecret" placeholder="请输入AppSecret"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button class="save-btn">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      logisticsData: {
        Appkey: '',
        AppSecret: ''
      },
      rules: {
        Appkey: [
          { required: true, message: '请输入Appkey', trigger: 'change' }
        ],
        AppSecret: [
          { required: true, message: '请输入AppSecret', trigger: 'change' }
        ]
      }
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

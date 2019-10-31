<template>
  <div class="applet-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="handleClick">
      <!-- 开发配置 -->
      <el-tab-pane label="开发配置" name="1"></el-tab-pane>
      <!-- 消息模版 -->
      <el-tab-pane label="消息模版" name="2"></el-tab-pane>
    </el-tabs>
    <el-row v-if="activeName === '1'">
      <el-col :span="12">
        <div class="left-development">
        <h4>开发者id</h4>
        <el-form :model="appletForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
          <el-form-item label="AppId(小程序ID)" prop="appId">
            <el-input placeholder="请输入AppId" v-model="appletForm.appId"></el-input>
          </el-form-item>
          <el-form-item label="AppSecret(小程序密钥)" prop="appSer">
            <el-input placeholder="请输入AppSecret" v-model="appletForm.appSer"></el-input>
          </el-form-item>
          <el-form-item label="小程序token">
            <el-input placeholder="请输入小程序token" v-model="appletForm.token"></el-input>
          </el-form-item>
          <el-form-item label="aes_key">
            <el-input placeholder="请输入aes_key" v-model="appletForm.aes"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="savaBtn" @click="saveDev('ruleForm')">保存</el-button>
        </div>
      </el-col>
       <el-col :span="12">
         <div class="right-server">
           <h4>服务器域名</h4>
            <el-table class="data-list" border stripe
               :data="severData"
              v-loading="tableLoading">
              <el-table-column label="服务器配置"></el-table-column>
              <el-table-column label="域名"></el-table-column>
            </el-table>
            <h4>业务域名</h4>
            <el-table class="data-list" border stripe
               :data="businessData"
              v-loading="tableLoading">
              <el-table-column label="配置信息"></el-table-column>
              <el-table-column label="信息"></el-table-column>
            </el-table>
         </div>
       </el-col>
    </el-row>
    <div v-else>
      <el-table :data="messageData" v-loading="tableLoading" class="data-list" border stripe>
        <el-table-column label="id"></el-table-column>
        <el-table-column label="模版类型"></el-table-column>
        <el-table-column label="模版标示"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="btn-blue" @click="edit(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: '',
      appletForm: {
        appId: '',
        appSer: '',
        token: '',
        aes: ''
      },
      tableLoading: false,
      severData: [],
      businessData: [],
      messageData: [],
      rules: {
        appId: [
          { required: true, message: '请输入AppId', trigger: 'change' }
        ],
        appSer: [
          { required: true, message: '请输入AppSecret', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.activeName = '1'
  },
  methods: {
    handleClick () {
      if (this.activeName === '1') {
        // this.getList()
      } else if (this.activeName === '2') {
        // this.getPick()
      }
    }
  }
}
</script>

<style lang="scss">
.applet-container {
   .tabLength {
    width: 200px !important;
  }
  .savaBtn {
    background-color: #3540A5;
    color: #fff;
    width: 100px;
  }
  .el-input__inner {
    width: 60%;
  }
}
</style>

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
          <el-form-item label="AppId(小程序ID)" prop="app_id">
            <el-input placeholder="请输入AppId" v-model="appletForm.app_id"></el-input>
          </el-form-item>
          <el-form-item label="AppSecret(小程序密钥)" prop="secret">
            <el-input placeholder="请输入AppSecret" v-model="appletForm.secret"></el-input>
          </el-form-item>
          <el-form-item label="小程序token">
            <el-input placeholder="请输入小程序token" v-model="appletForm.token"></el-input>
          </el-form-item>
          <el-form-item label="aes_key">
            <el-input placeholder="请输入aes_key" v-model="appletForm.aes_key"></el-input>
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
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="模版类型" prop="type"></el-table-column>
        <el-table-column label="模版标示" prop="template_id"></el-table-column>
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
        app_id: '',
        secret: '',
        token: '',
        aes_key: ''
      },
      tableLoading: false,
      severData: [],
      businessData: [],
      messageData: [],
      rules: {
        app_id: [
          { required: true, message: '请输入AppId', trigger: 'change' }
        ],
        secret: [
          { required: true, message: '请输入AppSecret', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.activeName = '1'
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getMini().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.appletForm = res.data
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getPick () {
      this.tableLoading = true
      this.$request.getTemplate().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.messageData = res.data
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    saveDev (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.updateMini(this.appletForm).then(res => {
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
    },
    handleClick () {
      if (this.activeName === '1') {
        this.getList()
      } else if (this.activeName === '2') {
        this.getPick()
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

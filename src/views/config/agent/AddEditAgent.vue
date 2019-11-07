<template>
  <div class="agent-add-container">
    <el-row class="client_detail">
      <!-- 基础信息 -->
      <el-form ref="params" :model="user" label-width="140px" label-position="left" :rules="rules">
         <el-col :lg="12" class="baseInfo">
          <!-- 用户名 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="代理用户" prop="user_id">
                <el-input v-model="user.user_id" placeholder="请输入代理用户"></el-input>
              </el-form-item>
            </el-col>
              <el-button class="choose" @click="chooseUser">选择</el-button>
          </el-row>
          <!-- 密码 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="联系人" prop="contact_name">
                <el-input v-model="user.contact_name" placeholder="请输入联系人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 邮箱 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="邮箱" prop="contact_email">
                <el-input v-model="user.contact_email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工组 -->
           <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="备注" prop="remark" class="employ">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="user.remark">
              </el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      <el-col :lg="12" class="baseInfo">
          <!-- 姓名 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="代理名称" prop="agent_name">
                <el-input v-model="user.agent_name" placeholder="请输入代理名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 联系电话 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="联系电话" prop="contact_phone"
               v-if="!this.$route.params.id">
                <el-input v-model="user.contact_phone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 佣金分成 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="佣金分成" prop="commission">
                <el-input v-model="user.commission" placeholder="请输入佣金分成">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      </el-form>
    </el-row>
    <div class="btn_box">
      <el-button type="primary" @click="update('params')" :loading="$store.state.btnLoading">
        保存
        </el-button>
      </div>
  </div>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      btn_loading: false,
      rules: { // 必填项校验
        user_id: [
          { required: true, message: '请输入代理用户', trigger: 'change' }
        ],
        agent_name: [
          { required: true, message: '请输入代理名称', trigger: 'change' }
        ],
        contact_name: [
          { required: true, message: '请输入联系人', trigger: 'change' }
        ],
        contact_email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        contact_phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        commission: [
          { required: true, message: '请输入佣金分成', trigger: 'change' }
        ]
      },
      user: {
        user_id: '',
        agent_name: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        group_id: '',
        commission: '',
        remark: ''
      }
    }
  },
  created () {
    if (this.$route.query.id) {
      // 编辑用户
      this.getInfo()
    }
  },
  name: 'AgentAddContainer',
  methods: {
    // 获取数据
    getInfo () {
      // this.$request.EditVip(this.$route.query.id).then(res => {
      //   if (res.ret) {
      //     this.user = res.data
      //   }
      // })
    },
    // 选择
    chooseUser () {
      dialog({ type: 'chooseUser' }, (data) => {
        console.log('data', data)
        this.user.user_id = data.id
        this.user.agent_name = data.name
      })
    },
    // 保存
    update (formName) {
      if (this.$route.params.id) { // 如果是编辑状态
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$request.updateVip(this.$route.params.id, this.user).then((res) => {
              if (res.ret) {
                this.$notify({
                  title: '成功操作',
                  message: res.msg,
                  type: 'success'
                })
              }
              this.$router.push({ name: 'agent' })
            })
          } else {
            return false
          }
        })
      } else { // 添加员工
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$request.addAgents(this.user).then((res) => {
              if (res.ret) {
                this.$notify({
                  title: '操作成功',
                  message: res.tips,
                  type: 'success'
                })
                this.$router.push({ name: 'agent' })
              } else {
                this.$notify({
                  title: '操作失败',
                  message: res.msg,
                  type: 'warning'
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
}
</script>
<style lang="scss">
@import '../../../styles/commonality.scss';
  .agent-add-container {
    min-height: 67vh;
    background-color: $white;
    padding: 1em 3em;
    .title_box{
      text-align: right;
      line-height: 2.5em;
    }
    hr{
      width: 100%;
      border: none;
      margin: 2em 0;
    }
    .phoneTips{
      color:red;
      display: inline-block;
      vertical-align: middle;
      margin-top: .8em;
    }
    .el-icon-circle-check{
      display: inline-block;
      margin-top: .8em;
      color: $green;
    }
    .client_detail{
      .Info{
        padding: 1em 1.5em;
      }
    }
    .btn_box{
        margin-left: 135px;
        width: 33%;
        padding: 1.5em 0;
        margin-top: 1.5em;
        .el-button--primary {
          width:72%;
        }
    }
    .employ {
      .el-select {
        width: 100% !important;
      }
    }
    .choose {
      border-radius: 5px;
      color: #fff;
      background-color: #3540A5;
      border-color: #3540A5;
    }
  }
</style>

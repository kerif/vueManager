<template>
  <div class="agent-add-container">
    <el-row class="client_detail">
      <!-- 基础信息 -->
      <el-form ref="params" :model="user" label-width="140px" label-position="left" :rules="rules">
         <el-col :lg="12" class="baseInfo">
          <!-- 用户名 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="代理用户" prop="username">
                <el-input v-model="user.username" placeholder="请输入代理用户"></el-input>
              </el-form-item>
            </el-col>
              <el-button class="choose" @click="chooseUser">选择</el-button>
          </el-row>
          <!-- 密码 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="联系人" prop="password">
                <el-input v-model="user.password"  type="password" placeholder="请输入联系人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 邮箱 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工组 -->
           <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="备注" prop="group_id" class="employ">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="user.group_id">
              </el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      <el-col :lg="12" class="baseInfo">
          <!-- 姓名 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="代理名称" prop="name">
                <el-input v-model="user.name" placeholder="请输入代理名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 确认密码 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="联系电话" prop="tel"
               v-if="!this.$route.params.id">
                <el-input v-model="user.tel" type="password" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 联系电话 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="佣金分成">
                <el-input v-model="user.tel" placeholder="请输入佣金分成">
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
      employeeGroup: [],
      rules: { // 必填项校验
        username: [
          { required: true, message: '请输入代理用户', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入代理名称', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 32, message: '长度在 8 到 20 个字符', trigger: 'change' }
        ],
        tel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请输入员工组', trigger: 'change' }
        ]
      },
      user: {
        username: '',
        name: '',
        email: '',
        tel: '',
        group_id: '',
        password: '',
        confirm_password: ''
      }
    }
  },
  created () {
    if (this.$route.params.id) {
      // 编辑用户
      this.getInfo()
      this.getVipGroup() // 员工组列表
    } else {
      this.getVipGroup() // 员工组列表
    }
  },
  watch: {
  },
  name: 'staffAddContainer',
  methods: {
    // 获取数据
    getInfo () {
      // this.$request.EditVip(this.$route.params.id).then(res => {
      //   if (res.ret) {
      //     this.user = res.data
      //     console.log(res.data)
      //     this.user.group_id = res.data.admin_group.id
      //   }
      // })
    },
    // 获取员工组数据
    getVipGroup () {
      this.$request.getVips().then(res => {
        this.employeeGroup = res.data
      })
    },
    // 选择
    chooseUser () {
      dialog({ type: 'chooseUser' })
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
              this.$router.push({ name: 'stafflist' })
            })
          } else {
            return false
          }
        })
      } else { // 添加员工
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$request.saveVip(this.user).then((res) => {
              if (res.ret) {
                this.$notify({
                  title: '操作成功',
                  message: res.tips,
                  type: 'success'
                })
                this.$router.push({ name: 'stafflist' })
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

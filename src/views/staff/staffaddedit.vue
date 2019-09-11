<template>
  <div class="staff-add-container">
    <el-row class="client_detail">
      <!-- 基础信息 -->
      <el-form ref="params" :model="user" label-width="140px" label-position="left" :rules="rules">
         <el-col :lg="12" class="baseInfo">
          <!-- 用户名 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="用户名" prop="name">
                <el-input v-model="user.name" placeholder="请输入用户名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 密码 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="密码" prop="password">
                <el-input v-model="user.full_name" placeholder="请输入密码"></el-input>
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
              <el-form-item label="员工组" prop="group" class="employ">
                <!-- <el-input v-model="user.group" type="password"></el-input> -->
                <!-- <template slot-scope="scope"> -->
                <el-select v-model="user.group" placeholder="请选择员工组" clearable>
                <el-option
                  v-for="item in employeeGroup"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
                </el-select>
              <!-- </template> -->
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      <el-col :lg="12" class="baseInfo">
          <!-- 姓名 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="姓名" prop="full_name">
                <el-input v-model="user.full_name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 确认密码 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="确认密码" prop="password_confirmation"
               v-if="!this.$route.params.id">
                <el-input v-model="user.password_confirmation" type="password" placeholder="请再次输入密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 联系电话 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="user.tel" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      </el-form>
    </el-row>
    <div class="btn_box">
      <el-button type="primary" @click="update('params')" :loading="btn_loading">
        保存
        </el-button>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      btn_loading: false,
      employeeGroup: [{
        value: 1,
        label: 'bababa'
      }, {
        value: 2,
        label: 'lalala'
      }],
      rules: { // 必填项校验
        full_name: [
          { required: true, message: '请输入姓名', trigger: 'change' }
          ],
        name: [
          { required: true, message: '请输入名字', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '', trigger: ['blur', 'change'] }
        ],
        tel: [
          { required: true, message: '请输入电话号码', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        password_confirmation: [
          { required: true, message: '请再次输入密码', trigger: 'change' }
        ],
        group: [
          { required: true, message: '请输入员工组', trigger: 'change' }
        ]
      },
      user: {}
    }
  },
  created () {
    if (this.$route.params.id) {
      // 编辑用户
      this.getInfo()
    }
  },
  watch: {
  },
  name: 'staffAddContainer',
  methods: {
    // 获取数据
    getInfo () {
      this.$http.get(`user/${this.$route.params.id}`).then(res => {
        if (res.ret) {
          this.user = res.data
        }
      })
    },
    // 保存
    update (formName) {
      if (this.$route.params.id) { // 如果是编辑状态
       this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.put(`user/${this.$route.params.id}`,{
            name: this.user.name,
            full_name: this.user.full_name,
            email: this.user.email,
            note: this.user.note,
            phone: this.user.phone,
            id: this.$route.params.id
          }).then((res) => {
              if (res.ret) {
              this.$notify({
                title: '成功操作',
                message: res.msg,
                type: 'success'
              })
            }
            this.$router.push({name: 'userList'})
          })
        } else {
          return false
        }
       })
      } else { // 添加员工
        this.$refs[formName].validate((valid) => {
        if (valid) {
            this.$http.post(`user`,{
              name: this.user.name,
              full_name: this.user.full_name,
              email: this.user.email,
              note: this.user.note,
              phone: this.user.phone,
              password: this.user.password,
              password_confirmation: this.user.password_confirmation
          }).then((res) => {
             this.$notify({
              title: '操作成功',
              message: res.tips,
              type: 'success'
            })
            this.$router.push({name: 'userList'})
          })
        }else{
          return false
        }
        })
      }
    }
  }
}
</script>
<style lang="scss">
@import '../../styles/commonality.scss';
  .staff-add-container {
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
        h3{
          font-size: 16px;
        }
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
  }
</style>

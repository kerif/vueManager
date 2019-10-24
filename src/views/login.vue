<template>
  <div class="login-container">
    <div class="login-header">
      <span class="app-name">TKK</span>
      <span>管理员</span>
    </div>
    <!-- 登陆页面 -->
    <div class="login-main" v-show="welcome == 1">
      <div class="info-box">
        <p class="info-title">欢迎登录</p>
        <el-form>
          <el-form-item>
            <el-input prefix-icon="el-icon-user" placeholder="请输入账户" v-model="userInfo.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-unlock" v-model="userInfo.password" @keyup.native.enter="onLogin"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox class="login-checkbox" v-model="keep"></el-checkbox>
            <span class="info-text">此设备上保留登录信息</span>
            <div class="forget">
              <span @click="changeWelcome(2)">忘记密码</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" @click="onLogin" :loading="$store.state.btnLoading">登录</el-button>
          </el-form-item>
          <div class="register">
            <p @click="changeWelcome(3)">注册账户</p>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 忘记密码 -->
    <div class="login-main" v-show="welcome == 2">
      <div class="info-box">
        <div class="step-box">
          <span :class="['step-item', { 'select': forgetStep <= 3 }]">验证身份</span>
          <span :class="['step-item', { 'select': forgetStep >= 2 }]">重置登录密码</span>
          <span :class="{ 'select': forgetStep === 3 }">完成</span>
        </div>
        <!-- 忘记密码第一步：验证身份 -->
        <el-form v-show="forgetStep === 1">
          <el-form-item prop="email">
            <el-input prefix-icon="el-icon-user" placeholder="请输入您的邮箱" v-model="userInfo.email">
            <template slot="append">获取验证码</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" placeholder="请输入验证码" prefix-icon="el-icon-unlock" v-model="userInfo.password" @keyup.native.enter="onLogin"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" @click="onForgetStep" :loading="$store.state.btnLoading">下一步</el-button>
          </el-form-item>
          <div class="register">
            <p @click="changeWelcome(1)">返回登录</p>
          </div>
        </el-form>
        <!-- 忘记密码第二步：重置登录密码 -->
        <el-form v-show="forgetStep === 2">
          <el-form-item>
            <el-input placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请确认您的密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" @click="onForgetStep" :loading="$store.state.btnLoading">下一步</el-button>
          </el-form-item>
        </el-form>
        <!-- 忘记密码第三步：重置登录密码完成 -->
        <div class="register-email" v-show="forgetStep === 3">
          <div class="happy-img">
            <img src="../assets/happy.png">
          </div>
            <p class="account-btn">修改密码成功！</p>
            <div class="register">
              <p @click="changeWelcome(1)">去登录</p>
            </div>
        </div>
      </div>
    </div>
    <!-- 注册账号 -->
    <div class="login-main" v-show="welcome == 3">
      <div class="info-box">
        <p class="info-title">注册</p>
        <el-form :model="userInfo" :rules="rules" ref="passwordForm">
          <el-form-item>
            <el-input prefix-icon="el-icon-user" placeholder="请输入邮箱" v-model="userInfo.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" placeholder="请输入6-16位密码，区分大小写" prefix-icon="el-icon-unlock" v-model="userInfo.new_password"></el-input>
          </el-form-item>
            <el-form-item>
            <el-input type="password" placeholder="确认密码" prefix-icon="el-icon-unlock" v-model="userInfo.new_confirm_password"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input placeholder="请输入11位手机号码" v-model="userInfo.phone">
              <template slot="prepend">+86</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入验证码">
              <template slot="append">获取验证码</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" @click="registerAccount('passwordForm')" :loading="$store.state.btnLoading">注册</el-button>
          </el-form-item>
          <div class="register">
            <p @click="changeWelcome(1)">使用已有账户登录</p>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 注册成功 -->
    <div class="login-main" v-show="welcome == 4">
      <div class="register-email">
        <div class="happy-img">
          <img src="../assets/happy.png">
        </div>
          <p class="account-btn">您的账户：<span>1234@qq.com</span>注册成功</p>
          <p class="account-btn">激活邮件已发送到您到邮件中，邮件有效期为24小时，请及时登录邮箱，点击邮件中的链接激活账户。</p>
          <div class="checkEmail">
            <el-button class="login-btn register-btn" :loading="$store.state.btnLoading">
              查看邮箱
            </el-button>
          </div>
          <div class="register">
            <p @click="changeWelcome(1)">返回登录</p>
          </div>
      </div>
    </div>
    <div class="login-footer">© (2019) NLETECH</div>
    <!-- 身份验证弹窗 -->
    <el-dialog
      title="身份验证"
      :visible.sync="centerDialogVisible"
      width="35%"
      center>
      <div class="id-img">
        <img src="../assets/happy.png">
        <i class="el-icon-refresh id-icon"></i>
      </div>
      <el-input v-model="userInfo.code" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userInfo.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      keep: false,
      centerDialogVisible: false,
      userInfo: {
        username: '',
        password: '',
        phone: '',
        code: '',
        new_password: '',
        new_confirm_password: ''
      },
      welcome: 1,
      forgetStep: 1,
      rules: {
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在6到32个字符', trigger: 'change' }
        ],
        new_confirm_password: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          { min: 6, max: 32, message: '长度在6到32个字符', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.userInfo.username = localStorage.getItem('USERNAME') || ''
    this.userInfo.password = localStorage.getItem('PASSWORD') || ''
    if (this.userInfo.username && this.userInfo.password) this.keep = true
  },
  methods: {
    // 登录
    onLogin () {
      if (!this.userInfo.username.trim()) {
        return this.$message.info('请输入用户名')
      } else if (!this.userInfo.password.trim()) {
        return this.$message.info('请输入密码')
      }
      if (this.keep) {
        localStorage.setItem('USERNAME', this.userInfo.username.trim())
        localStorage.setItem('PASSWORD', this.userInfo.password.trim())
      } else {
        localStorage.removeItem('USERNAME')
        localStorage.removeItem('PASSWORD')
      }
      this.centerDialogVisible = true
      // this.$request.login(this.userInfo).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       title: '操作成功',
      //       message: res.msg,
      //       type: 'success'
      //     })
      //     this.$store.commit('saveToken', `${res.data.token_type} ${res.data.access_token}`)
      //     this.$store.commit('saveName', res.data.username)
      //     this.$router.push('/')
      //   }
      // }).catch((err) => {
      //   this.$message.error(err.msg)
      // })
    },
    changeWelcome (val) {
      if (val === 2) this.forgetStep = 1
      this.welcome = val
    },
    registerAccount (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.changePassword(this.params).then(res => {
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
    },
    onForgetStep () {
      this.forgetStep++
    }
  }
}
</script>
<style lang="scss">
.login-container {
  height: 100%;
  height: 100vh;
  background-color: #3540A5;
  position: relative;
  overflow: hidden;
  .login-header {
    color: #fff;
    font-size: 18px;
    padding: 10px 15px;
    font-weight: bold;
    border-bottom: 1px solid #4A55B7;
  }
  .app-name {
    font-size: 35px;
  }
  .login-main {
    background-color: #fff;
    border-radius: 4px;
    width: 600px;
    // height: 430px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .info-box {
    width: 50%;
    margin: 30px auto;
  }
  .info-title {
    font-size: 18px;
    margin: 40px 0;
  }
  .login-footer {
    color: #3540A5;
    text-align: center;
    padding: 10px 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 14px;
    background-color: #fff;
  }
  .login-checkbox {
    margin-right: 5px;
  }
  .info-text {
    font-size: 12px;
  }
  .login-btn {
    width: 100%;
    height: 40px;
    color: #fff;
    border-color: #35B85A;
    background-color: #35B85A;
  }
  .forget {
    float: right;
    cursor: pointer;
    color: #3540A5;
  }
  .register {
    text-align: center;
    padding-top: 25px;
    color:#35B85A;
    cursor: pointer;
  }
  .el-input-group__append {
    cursor: pointer;
    border-color: #3540A5 !important;
    color: #3540A5 !important;
  }
  .happy-img {
    margin: 40px 0;
    text-align: center;
  }
  .register-email {
    width: 65%;
    margin: 30px auto;
  }
  .checkEmail {
    width: 50%;
  }
  .register-btn {
    margin-left: 90px !important;
  }
  .account-btn {
    text-align: center;
  }
  .el-input-group--append .el-input__inner {
    border-right: 1px solid #3540A5 !important;
  }
  .id-img {
    text-align: center;
    img {
      width: 100px;
    }
    .id-icon {
      position: relative;
      bottom: 20px;
      cursor: pointer;
      font-size: 40px;
      left: 10px;
    }
  }
  .el-dialog--center .el-dialog__body {
    text-align: center;
    .el-input {
      width: 30%;
    }
  }
  .step-box {
    color: #A2A2A2;
    font-size: 18px;
    margin-bottom: 30px;
    .select {
      color: #35B85A;
      &::after {
        background-color: #35B85A;
      }
    }
  }
  .step-item::after {
    content: '';
    display: inline-block;
    width: 30px;
    margin: 0 5px;
    height: 2px;
    background-color: #A2A2A2;
    position: relative;
    bottom: 4px;
  }
}
</style>

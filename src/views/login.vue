<template>
  <div class="login-container">
    <div class="login-header">
      <div>
        <img
          v-if="!this.hostname.includes('haiouoms') && !this.hostname.includes('localhost')"
          class="img-sty img-logo"
          :src="$baseUrl.IMAGE_URL + customData.login_logo"
          alt=""
        />
        <img
          v-else-if="
            this.hostname.includes('haiouoms') ||
            this.hostname.includes('localhost') ||
            !customData.login_logo
          "
          src="../assets/logo-top.png"
          class="img-sty"
        />
      </div>
      <div>
        <span v-if="!this.hostname.includes('haiouoms') && !this.hostname.includes('localhost')">{{
          customData.login_title
        }}</span>
        <span
          v-else-if="
            this.hostname.includes('haiouoms') ||
            this.hostname.includes('localhost') ||
            !customData.login_title
          "
          >{{ $t('海鸥集运管理系统') }}</span
        >
      </div>
    </div>
    <div class="main">
      <!-- 登陆页面 -->
      <div class="login-main" v-show="welcome === 1">
        <div class="main-container">
          <div v-if="!this.hostname.includes('haiouoms') && !this.hostname.includes('localhost')">
            <img
              :src="$baseUrl.IMAGE_URL + customData.login_image"
              style="width: 500px; height: 450px"
              alt=""
            />
          </div>
          <div
            v-else-if="
              this.hostname.includes('haiouoms') ||
              this.hostname.includes('localhost') ||
              !customData.login_image
            "
            class="login-logo"
          ></div>
          <div class="info-box">
            <div class="info-title">
              <!--              <span class="welcome-sty"-->
              <!--                ><strong>{{ $t('欢迎使用') }}</strong></span-->
              <!--              >-->
              <!--              <div class="go-sty">-->
              <!--                &lt;!&ndash;                <span @click="changeWelcome(3)" v-if="$route.query.register">{{&ndash;&gt;-->
              <!--                &lt;!&ndash;                  $t('去注册')&ndash;&gt;-->
              <!--                &lt;!&ndash;                }}</span>&ndash;&gt;-->
              <!--                <span @click="changeWelcome(3)">{{ $t('去注册') }}</span>-->
              <!--              </div>-->
              <el-tabs v-model="activeType" @tab-click="changeType">
                <el-tab-pane label="登录" name="1"></el-tab-pane>
                <el-tab-pane label="注册" name="2"></el-tab-pane>
              </el-tabs>
            </div>
            <el-form>
              <el-form-item>
                <el-input
                  :placeholder="$t('请输入邮箱')"
                  v-model.trim="userInfo.username"
                  class="login-input"
                >
                  <div slot="prefix" style="display: flex; align-items: center; height: 100%">
                    <i class="el-icon-user" style="font-size: 20px"></i>
                  </div>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  type="password"
                  :placeholder="$t('请输入密码')"
                  class="login-input"
                  v-model.trim="userInfo.password"
                  @keyup.native.enter="onLogin"
                  :show-password="true"
                >
                  <div slot="prefix" style="display: flex; align-items: center; height: 100%">
                    <i class="el-icon-unlock" style="font-size: 20px; padding-right: 8px"></i>
                  </div>
                </el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 0">
                <el-col :span="12">
                  <el-input
                    type="text"
                    :placeholder="$t('请输入验证码')"
                    v-model="userInfo.captcha"
                    @keyup.native.enter="onLogin"
                    class="login-input"
                  >
                    <div slot="prefix" style="display: flex; align-items: center; height: 100%">
                      <i class="el-icon-unlock" style="font-size: 20px"></i>
                    </div>
                  </el-input>
                </el-col>
                <el-col :span="11" :offset="1">
                  <img
                    style="height: 50px; width: 100%"
                    :src="captha"
                    @click="getCaptcha"
                    class="captha-sty"
                  />
                </el-col>
              </el-form-item>

              <div class="operate-line">
                <el-checkbox class="login-checkbox" v-model="keep"></el-checkbox>
                <span>{{ $t('保持登录') }}</span>
                <div class="forget">
                  <span @click="changeWelcome(2)">{{ $t('忘记密码') }}</span>
                </div>
              </div>
              <el-form-item>
                <el-button
                  size="medium"
                  :loading="$store.state.btnLoading"
                  class="login-btn"
                  @click="onLogin"
                  >{{ $t('登录') }}</el-button
                >
                <!--                <div class="forget-sty">-->
                <!--                  <span @click="changeWelcome(2)">{{ $t('忘记密码') }}</span>-->
                <!--                </div>-->
              </el-form-item>
              <!-- <div class="register">
              <p @click="changeWelcome(3)">{{$t('注册账户')}}</p>
            </div> -->
            </el-form>
          </div>
        </div>
      </div>
      <!-- 忘记密码 -->
      <div class="forget-main" v-show="welcome === 2">
        <div class="main-container">
          <!--          <div v-if="!this.hostname.includes('haiouoms') && !this.hostname.includes('localhost')">-->
          <!--            <img-->
          <!--              :src="$baseUrl.IMAGE_URL + customData.login_image"-->
          <!--              style="width: 500px; height: 450px"-->
          <!--              alt=""-->
          <!--            />-->
          <!--          </div>-->
          <!--          <div-->
          <!--            v-else-if="-->
          <!--              this.hostname.includes('haiouoms') ||-->
          <!--              this.hostname.includes('localhost') ||-->
          <!--              !customData.login_image-->
          <!--            "-->
          <!--            class="login-logo"-->
          <!--          ></div>-->
          <div class="forget-title" v-show="forgetStep !== 3">
            <div>
              {{ $t('找回密码') }}
            </div>
            <div class="go-login">
              {{ $t('记起密码') }}？<span @click="changeWelcome(1)">{{ $t('登录') }}</span>
            </div>
          </div>
          <div class="info-box">
            <div class="step-box">
              <span :class="['step-item', { select: forgetStep <= 3 }]">{{ $t('验证身份') }}</span>
              <span :class="['step-item', { select: forgetStep >= 2 }]">{{
                $t('重置登录密码')
              }}</span>
              <span :class="{ select: forgetStep === 3 }">{{ $t('完成') }}</span>
            </div>
            <!-- 忘记密码第一步：验证身份 -->
            <el-form v-show="forgetStep === 1" :model="forget" :rules="rules" ref="forgetForm">
              <el-form-item prop="phone">
                <el-input
                  :placeholder="$t('请输入您的手机号')"
                  v-model="forget.phone"
                  class="login-input"
                >
                  <div slot="prefix" style="display: flex; align-items: center; height: 100%">
                    <i class="el-icon-user" style="font-size: 20px"></i>
                  </div>
                  <span v-show="showPsd" slot="append" @click="onResetCode">{{
                    $t('获取验证码')
                  }}</span>
                  <span v-show="!showPsd" slot="append"
                    >{{ $t('倒计时') }}{{ count }}{{ $t('秒') }}</span
                  >
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  type="text"
                  :placeholder="$t('请输入验证码')"
                  v-model="forget.code"
                  class="login-input"
                >
                  <div slot="prefix" style="display: flex; align-items: center; height: 100%">
                    <i class="el-icon-unlock" style="font-size: 20px"></i>
                  </div>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn"
                  @click="onForgetStep('forgetForm')"
                  :loading="$store.state.btnLoading"
                  >{{ $t('下一步') }}</el-button
                >
              </el-form-item>
              <!--              <div class="register">-->
              <!--                <p @click="changeWelcome(1)">{{ $t('返回登录') }}</p>-->
              <!--              </div>-->
            </el-form>
            <!-- 忘记密码第二步：重置登录密码 -->
            <el-form v-show="forgetStep === 2" :model="forget" :rules="rules" ref="resetForm">
              <el-form-item prop="new_password">
                <el-input
                  :placeholder="$t('请输入新密码')"
                  v-model="forget.new_password"
                  type="password"
                  class="login-input"
                ></el-input>
              </el-form-item>
              <el-form-item prop="confirm_new_password">
                <el-input
                  :placeholder="$t('请确认您的密码')"
                  type="password"
                  class="login-input"
                  v-model="forget.confirm_new_password"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn"
                  @click="onResetStep('resetForm')"
                  :loading="$store.state.btnLoading"
                  >{{ $t('下一步') }}</el-button
                >
              </el-form-item>
            </el-form>
            <!-- 忘记密码第三步：重置登录密码完成 -->
            <div class="register-email" v-show="forgetStep === 3">
              <div class="happy-img">
                <img src="../assets/happy.png" />
              </div>
              <p class="account-btn">{{ $t('修改密码成功') }}</p>
              <div class="register">
                <p @click="changeWelcome(1)">{{ $t('去登录') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 注册账号 -->
      <div class="register-main" v-show="welcome === 3">
        <div class="main-container">
          <!--          <div v-if="!this.hostname.includes('haiouoms') && !this.hostname.includes('localhost')">-->
          <!--            <img-->
          <!--              :src="$baseUrl.IMAGE_URL + customData.login_image"-->
          <!--              style="width: 500px; height: 450px"-->
          <!--              alt=""-->
          <!--            />-->
          <!--          </div>-->
          <!--          <div-->
          <!--            v-else-if="-->
          <!--              this.hostname.includes('haiouoms') ||-->
          <!--              this.hostname.includes('localhost') ||-->
          <!--              !customData.login_image-->
          <!--            "-->
          <!--            class="login-logo"-->
          <!--          ></div>-->

          <div class="info-box">
            <!-- <p class="info-title">{{$t('注册')}}</p> -->
            <div class="info-title">
              <!--              <span class="welcome-sty"-->
              <!--                ><strong>{{ $t('注册') }}</strong></span-->
              <!--              >-->
              <!--              <div class="go-sty">-->
              <!--                <span @click="changeWelcome(1)">{{ $t('去登录') }}</span>-->
              <!--              </div>-->
              <el-tabs v-model="activeType" @tab-click="changeType">
                <el-tab-pane :label="$t('登录')" name="1"></el-tab-pane>
                <el-tab-pane :label="$t('注册')" name="2"></el-tab-pane>
              </el-tabs>
            </div>
            <div class='tip-red'>当前页面注册的是新的集运公司账号</div>
            <el-form :model="reAccount" :rules="rules" ref="registerForm">
              <el-form-item prop="email">
                <el-input
                  :placeholder="$t('请输入邮箱')"
                  v-model="reAccount.email"
                  class="login-input"
                >
                  <div slot="prefix" style="display: flex; align-items: center; height: 100%">
                    <i class="el-icon-user" style="font-size: 20px"></i>
                  </div>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  :placeholder="$t('请输入820位密码区分大小写')"
                  class="login-input"
                  v-model="reAccount.password"
                >
                  <div slot="prefix" style="display: flex; align-items: center; height: 100%">
                    <i class="el-icon-unlock" style="font-size: 20px"></i>
                  </div>
                </el-input>
              </el-form-item>
              <el-form-item prop="confirm_password">
                <el-input
                  type="password"
                  :placeholder="$t('确认密码')"
                  class="login-input"
                  v-model="reAccount.confirm_password"
                >
                  <div slot="prefix" style="display: flex; align-items: center; height: 100%">
                    <i class="el-icon-unlock" style="font-size: 20px"></i>
                  </div>
                </el-input>
              </el-form-item>
              <el-form-item prop="phone">
                <el-input
                  :placeholder="$t('请输入11位手机号码')"
                  class="login-input"
                  v-model="reAccount.phone"
                >
                  <template slot="prepend">+86</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  :placeholder="$t('请输入验证码')"
                  class="login-input"
                  v-model="reAccount.code"
                >
                  <span v-show="show" slot="append" @click="onRegisterCode">{{
                    $t('获取验证码')
                  }}</span>
                  <span v-show="!show" slot="append"
                    >{{ $t('倒计时') }}{{ count }}{{ $t('秒') }}</span
                  >
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn"
                  @click="registerAccount('registerForm')"
                  :loading="$store.state.btnLoading"
                  >{{ $t('注册') }}</el-button
                >
              </el-form-item>
              <!-- <div class="register">
            <p @click="changeWelcome(1)">{{$t('使用已有账户登录')}}</p>
          </div> -->
            </el-form>
          </div>
        </div>
      </div>
      <!-- 注册成功 -->
      <div class="login-main" v-show="welcome == 4">
        <div class="register-email">
          <div class="happy-img">
            <img src="../assets/happy.png" />
          </div>
          <!-- <p class="account-btn">您的账户：<span>{{ reAccount.email }}</span>注册成功</p>
          <p class="account-btn">激活邮件已发送到您到邮件中，邮件有效期为24小时，请及时登录邮箱，点击邮件中的链接激活账户。</p> -->
          <!-- <div class="checkEmail">
            <el-button class="login-btn register-btn" :loading="$store.state.btnLoading">
              查看邮箱
            </el-button>
          </div> -->
          <div class="register">
            <p @click="changeWelcome(1)">{{ $t('返回登录') }}</p>
          </div>
        </div>
      </div>
      <div class="login-footer">
        <div class="qrcode-list">
<!--          <div slot="reference" class='code-icon' @click='uploadDesktop'>-->
<!--            <i class="iconfont icon-diannaofuben desktop-sty"></i>-->
<!--          </div>-->
          <el-popover placement="top" trigger="hover">
            <div slot="reference" class='code-icon'>
              <i class="iconfont icon-anzhuo anzhuo-sty"></i>
            </div>
            <div>
              <img style="width: 150px; height: 150px" src="../assets/android.png" />
            </div>
          </el-popover>
          <el-popover placement="top" trigger="hover">
            <div slot="reference" class='code-icon'>
              <i class="iconfont icon-pingguo ios-sty"></i>
            </div>
            <img style="width: 150px; height: 150px" src="../assets/ios.png" />
          </el-popover>
        </div>
        <div class="language-sty">
          <p>
            <span :class="{ active: languageCode === 'zhCN' }" @click="languageCut('zhCN')"
              >简体中文</span
            >
            |
            <span :class="{ active: languageCode === 'zhTW' }" @click="languageCut('zhTW')"
              >繁体中文</span
            >
            |
            <span :class="{ active: languageCode === 'en' }" @click="languageCut('en')"
              >English</span
            >
          </p>
        </div>
        <!-- © ({{ year }}) haiouoms.com
        <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $t('湘ICP备17000173号-5') }}</a> -->
      </div>
    </div>
    <!-- 身份验证弹窗 -->
    <!-- <el-dialog
      :title="$t('身份验证')"
      :visible.sync="centerDialogVisible"
      width="35%"
      @close="dialogClear"
      center>
      <div class="id-img">
        <img :src="captha">
        <i class="el-icon-refresh id-icon" @click="getCaptcha"></i>
      </div>
      <el-input v-model="userInfo.captcha" @keyup.native.enter="submit" :placeholder="$t('请输入验证码')"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">{{$t('确 定')}}</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import JSEncrypt from 'jsencrypt'
import store from '@/store'
export default {
  name: 'login',
  data() {
    // 注册
    var validateRegister = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请再次输入密码')))
      } else if (value !== this.reAccount.password) {
        callback(new Error(this.$t('两次输入密码不一致!')))
      } else {
        callback()
      }
    }
    // 重置
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请再次输入密码')))
      } else if (value !== this.forget.new_password) {
        callback(new Error(this.$t('两次输入密码不一致!')))
      } else {
        callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('手机号不能为空')))
      } else {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error(this.$t('请输入正确的手机号')))
        }
      }
    }
    return {
      showPsd: true,
      show: true,
      count: '',
      timer: null,
      keep: false,
      centerDialogVisible: false,
      captha: '',
      customData: {},
      userInfo: {
        username: '',
        password: '',
        key: '',
        captcha: ''
      },
      forget: {
        phone: '',
        code: '',
        new_password: '',
        confirm_new_password: ''
      },
      reAccount: {
        email: '',
        password: '',
        confirm_password: '',
        phone: '',
        code: ''
      },
      Authentication: {
        code: ''
      },
      welcome: 1,
      forgetStep: 1,
      groupBuy: '',
      hostname: '',
      rules: {
        email: [
          { required: true, message: this.$t('请输入邮箱地址'), trigger: 'blur' },
          { type: 'email', message: this.$t('请输入正确的邮箱地址'), trigger: ['blur', 'change'] }
        ],
        code: [{ required: true, message: this.$t('请输入验证码'), trigger: 'change' }],
        phone: [{ validator: checkPhone, trigger: 'change' }],
        password: [
          { required: true, message: this.$t('请输入新密码'), trigger: 'blur' },
          { min: 8, max: 20, message: this.$t('长度在8到20个字符'), trigger: 'change' }
        ],
        confirm_password: [
          { required: true, validator: validateRegister, trigger: 'blur' },
          { min: 8, max: 20, message: this.$t('长度在8到20个字符'), trigger: 'change' }
        ],
        new_password: [
          { required: true, message: this.$t('请输入新密码'), trigger: 'blur' },
          { min: 8, max: 20, message: this.$t('长度在8到20个字符'), trigger: 'change' }
        ],
        confirm_new_password: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          { min: 8, max: 20, message: this.$t('长度在8到20个字符'), trigger: 'change' }
        ]
      },
      activeType: '1'
    }
  },
  computed: {
    languageCode() {
      return this.$store.state.languageCode
    },
    year: function () {
      return new Date().getFullYear()
    }
  },
  mounted() {
    this.userInfo.username = localStorage.getItem('USERNAME') || ''
    this.userInfo.password = localStorage.getItem('PASSWORD') || ''
    if (this.userInfo.username && this.userInfo.password) this.keep = true
  },
  created() {
    this.getCaptcha() // 获取图型验证码
    if (location.hostname) {
      this.getInit()
    }
  },
  methods: {
    uploadDesktop() {
      let url = 'http://update.tongxiao.tech/jiyun_v3/update.html'
      window.open(url)
    },
    //切换登录注册
    changeType() {
      if (this.activeType === '1') {
        this.changeWelcome(1)
      } else {
        this.changeWelcome(3)
      }
    },
    getInit() {
      this.hostname = location.hostname
      this.$request.initConfig({ domain: location.hostname }).then(res => {
        this.customData = res.data
        this.$store.commit('saveSiderBarImage', res.data.sidebar_image)
      })
    },
    languageCut(locale) {
      this.$store.commit('saveLanguageCode', { locale, reload: false })
    },
    // 获取是否显示拼团配置
    getMe() {
      this.$request.getMe().then(res => {
        if (res.ret) {
          this.groupBuy = Number(res.data.group_buying_config)
        }
      })
    },
    // 登录
    onLogin() {
      let params = {
        ...this.userInfo
      }
      // 加密
      params.password = this.excrypt(this.userInfo.password)
      if (!this.userInfo.username.trim()) {
        return this.$message.info(this.$t('请输入邮箱或手机号'))
      } else if (!this.userInfo.password.trim()) {
        return this.$message.info(this.$t('请输入密码'))
      } else if (!this.userInfo.captcha.trim()) {
        return this.$message.info(this.$t('请输入验证码'))
      }
      if (this.keep) {
        localStorage.setItem('USERNAME', this.userInfo.username.trim())
        localStorage.setItem('PASSWORD', this.userInfo.password.trim())
        this.$request
          .login(params)
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              // this.getMe()
              this.$request.getMe().then(res => {
                if (res.ret) {
                  this.groupBuy = Number(res.data.group_buying_config)
                  this.$store.commit('saveMe', this.groupBuy)
                  console.log(typeof this.groupBuy, 'this.groupBuy')
                }
              })
              this.$store.commit('saveToken', `${res.data.token_type} ${res.data.access_token}`)
              this.$store.commit('saveName', res.data.email)
              this.$store.commit('savePermissionStatus', false)
              console.log('我在登录这里改了啊', this.$store.state.isPermissionFilter)
              this.centerDialogVisible = false
              this.$router.push('/')
            } else {
              this.$message.error(res.msg)
              this.getCaptcha()
            }
          })
          .catch(err => {
            this.$message.error(err.msg)
          })
      } else {
        localStorage.removeItem('USERNAME')
        localStorage.removeItem('PASSWORD')
        this.$request
          .login(params)
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              // this.getMe()
              this.$request.getMe().then(res => {
                if (res.ret) {
                  this.groupBuy = Number(res.data.group_buying_config)
                  this.$store.commit('saveMe', this.groupBuy)
                  console.log(this.groupBuy, 'this.groupBuy')
                }
              })
              this.$store.commit('saveToken', `${res.data.token_type} ${res.data.access_token}`)
              this.$store.commit('saveName', res.data.email)
              this.$store.commit('savePermissionStatus', false)

              this.centerDialogVisible = false
              this.$router.push('/')
            } else {
              this.$message.error(res.msg)
              this.getCaptcha()
            }
          })
          .catch(err => {
            this.$message.error(err.msg)
          })
      }
      // this.getCaptcha()
    },
    // 获取图片验证码
    getCaptcha() {
      this.$request.getCaptcha().then(res => {
        if (res.ret) {
          this.userInfo.key = res.data.captcha.key
          this.captha = res.data.captcha.img
          if (!this.centerDialogVisible) this.centerDialogVisible = true
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    submit() {
      if (this.userInfo.code === '') {
        this.$message.error(this.$t('请输入验证码'))
      } else {
        this.$request
          .login(this.userInfo)
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              // this.getMe()
              this.$request.getMe().then(res => {
                if (res.ret) {
                  this.groupBuy = Number(res.data.group_buying_config)
                  this.$store.commit('saveMe', this.groupBuy)
                  console.log(this.groupBuy, 'this.groupBuy')
                }
              })
              this.$store.commit('saveToken', `${res.data.token_type} ${res.data.access_token}`)
              this.$store.commit('saveName', res.data.email)
              this.centerDialogVisible = false
              this.$router.push('/')
            } else {
              this.$message.error(res.msg)
              this.getCaptcha()
            }
          })
          .catch(err => {
            this.$message.error(err.msg)
          })
      }
    },
    changeWelcome(val) {
      if (val === 2) this.forgetStep = 1
      this.welcome = val
      this.$refs['forgetForm'].resetFields()
      this.$refs['forgetForm'].clearValidate()
      this.$refs['registerForm'].resetFields()
      this.$refs['registerForm'].clearValidate()
      // if (this.welcome === 1 || this.welcome === 3) {
      //   this.forget.phone = ''
      //   this.forget.code = ''
      //   this.reAccount.email = ''
      //   this.reAccount.password = ''
      //   this.reAccount.confirm_password = ''
      //   this.reAccount.phone = ''
      //   this.reAccount.code = ''
      // } else if (this.welcome === 2) {
      //   this.reAccount.email = ''
      //   this.reAccount.password = ''
      //   this.reAccount.confirm_password = ''
      //   this.reAccount.phone = ''
      //   this.reAccount.code = ''
      // }
    },
    // 注册账号
    registerAccount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.register(this.reAccount).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.welcome = 4
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
    onResetStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.resetPassword(this.forget).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.forgetStep++
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    onForgetStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.forgetStep++
        }
      })
    },
    // 获取注册验证码
    onRegisterCode() {
      if (!this.reAccount.phone) {
        return this.$message.error(this.$t('请先输入手机号'))
      }
      this.$request.getRegisterCode(this.reAccount.phone).then(res => {
        if (res.ret) {
          this.$message.success(res.msg)
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.show = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.show = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 清除身份验证弹窗
    dialogClear() {
      this.userInfo.captcha = ''
    },
    // 获取重置密码验证码
    onResetCode() {
      if (!this.forget.phone) {
        return this.$message.error(this.$t('请先输入手机号'))
      }
      this.$request.getResetCode(this.forget.phone).then(res => {
        if (res.ret) {
          this.$message.success(res.msg)
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.showPsd = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.showPsd = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    excrypt(data) {
      const publicKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwfxIAFQxipEEKJMc4RhD
    LJQ7WxMGWLpinEEbJbMoXfSqlDjhxfVx5//itbwWmIKM1A8n0MTerudTvjdDmG9k
    37+EDS/dcYmxZ7KCqEp4teBsRmg8v9EgnblgkEVpwTA7M5zgldMFJnearrBx2IwL
    hWqK3IKADSiLcvrO25crz89bkPq2jgmi2QOsKEIATOErrkyFTxRVYqw8/UB0q5Za
    /KWAE9xTgU7+oteoRnI7ZdXlJZ1ENyMPN+DAT4WZoR+nWmKCVPFNgwdN2b3D8Rum
    6L1bQcOMbK2wS9Ooc1uu6+AfT8/HTODNmMnBf4/LBWpwjOLUhz1YLaeNnYqgpUzS
    HwIDAQAB
    -----END PUBLIC KEY-----`
      const encryptor = new JSEncrypt()
      encryptor.setPublicKey(publicKey)
      return encryptor.encrypt(data)
    }
  }
}
</script>
<style lang="scss">
.login-container {
  height: 100%;
  height: 100vh;
  // background-color: #3540A5;
  // background: url("../assets/logo-img.png") no-repeat center;
  // background-size: cover;
  // position: relative;
  overflow: hidden;
  .login-header {
    text-align: center;
    color: #3540a5;
    // padding-top: 10px;
    font-size: 18px;
    padding: 10px;
    font-weight: bold;
    // border-bottom: 1px solid #4A55B7;
    background-color: none;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 8%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
  .app-name {
    font-size: 35px;
  }
  .login-main {
    background-color: #fff;
    border-radius: 4px;
    width: 1000px;
    height: 555px;
    position: absolute;
    border-radius: 10px;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.2);
    .operate-line {
      margin-bottom: 40px;
    }
  }
  .register-main {
    background-color: #fff;
    border-radius: 4px;
    width: 500px;
    height: 555px;
    position: absolute;
    border-radius: 10px;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.2);
    .info-box {
      width: 90%;
      .info-title{
        margin: 0;
      }
      .tip-red{
        color: red;
        margin-bottom: 16px;
        font-size: 14px;
      }
    }
  }
  .forget-main {
    background-color: #fff;
    border-radius: 4px;
    width: 500px;
    height: 555px;
    position: absolute;
    border-radius: 10px;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.2);
    .forget-title {
      width: 90%;
      position: absolute;
      right: 5%;
      padding-top: 16px;
      font-size: 24px;
      font-weight: 500;
      .go-login {
        font-size: 14px;
        font-weight: normal;
        span {
          color: #3641a3;
          cursor: pointer;
        }
      }
    }
    .info-box {
      width: 90%;
    }
  }
  .info-box {
    display: inline-block;
    position: absolute;
    transform: translateY(-50%);
    resize: both;
    top: 50%;
    right: 5%;
    width: 42%;
    // margin: 30px auto;
    .info-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .login-input {
      input {
        height: 50px;
        font-size: 16px;
        padding-left: 35px;
        background-color: #f7f8f9;
        //border: none;
        border-color: #f7f8f9;
      }
      .el-input-group__prepend {
        border-right: 1px solid #dcdfe6;
      }
      .el-input-group__append {
        border-left: 1px solid #dcdfe6;
      }
      .el-input__suffix {
        display: flex;
        align-items: center;
      }
    }
    .el-checkbox__inner {
      width: 15px;
      height: 15px;
    }
    .step-box {
      font-size: 22px;
      display: flex;
      justify-content: center;
    }
    .register-email {
      font-size: 20px;
    }
  }
  .info-title {
    // font-size: 18px;
    margin: 16px 0;
    overflow: hidden;
    // margin-bottom: 40px;
    .el-tabs__item {
      font-size: 28px;
      padding: 0 10px !important;
    }
    .el-tabs__active-bar {
      height: 3px !important;
    }
    .el-tabs__nav {
      padding-bottom: 8px;
    }
    .el-tabs__nav-wrap::after {
      background-color: #ffffff !important;
    }
  }
  .go-sty {
    display: inline-block;
    float: right;
    font-size: 15px;
    cursor: pointer;
    // text-align: right;
  }
  .welcome-sty {
    display: inline-block;
    font-size: 28px;
    font-weight: 900;
  }
  .login-footer {
    color: #3540a5;
    text-align: center;
    //padding: 10px 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 14px;
    background-color: #efefef;
    // background-color: #fff;
    a {
      text-decoration: none;
    }
    .qrcode-list {
      display: flex;
      justify-content: center;
      width: 100%;
      gap: 10px;
      .code-img {
        width: 50px;
        height: 50px;
      }
      .code-icon{
        width: 30px;
        height: 30px;
        border: 1px solid #7a818f;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont{
          color: #7a818f;
        }
      }
      .code-icon:hover .iconfont{
        color: #3641a3;
      }
      .code-icon:hover {
        border-color: #3641a3;
      }
    }
  }
  .login-checkbox {
    margin-right: 5px;
  }

  .login-btn {
    width: 100%;
    height: 50px;
    color: #fff;
    border-color: #3641a3;
    background-color: #3641a3;
    border-radius: 5px;
  }
  .forget {
    float: right;
    cursor: pointer;
    color: #3540a5;
  }
  .register {
    text-align: center;
    // padding-top: 25px;
    color: #3641a3;
    cursor: pointer;
  }
  .el-input-group__append {
    cursor: pointer;
    // border-color: #3540A5 !important;
    // color: #3540A5 !important;
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
    // border-right: 1px solid #3540A5 !important;
  }
  .id-img {
    text-align: center;
    img {
      width: 100px;
    }
    .id-icon {
      cursor: pointer;
      font-size: 40px;
      margin-left: 10px;
    }
  }
  .el-dialog--center .el-dialog__body {
    text-align: center;
    .el-input {
      width: 40%;
      margin-top: 10px;
    }
  }
  .step-box {
    color: #a2a2a2;
    font-size: 18px;
    margin-bottom: 30px;
    .select {
      color: #3641a3;
      &::after {
        background-color: #3641a3;
      }
    }
  }
  .step-item::after {
    content: '';
    display: inline-block;
    width: 30px;
    margin: 0 5px;
    height: 2px;
    background-color: #a2a2a2;
    position: relative;
    bottom: 4px;
  }
  .img-sty {
    vertical-align: middle;
    padding-right: 5px;
  }
  .img-logo {
    width: 46px;
    height: 46px;
  }
  .main {
    background-color: #efefef !important;
    min-height: calc(100vh - 60px);
  }
  .main-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .login-logo {
    width: 50%;
    height: 100%;
    background: url('../assets/v4-log.png') no-repeat;
    border-radius: 10px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .forget-sty {
    text-align: center;
    // color: #000000;
    cursor: pointer;
  }
  .captha-sty {
    cursor: pointer;
  }
  .language-sty {
    //margin-top: 20px;
    // color: black;
    p:first-child {
      padding: 0em 0 1em;
      span {
        cursor: pointer;
        // cursor: not-allowed;
      }
      .active {
        color: #9e9e9e;
        cursor: default;
      }
    }
    p:last-child {
      // padding-bottom: 30px;
      img {
        margin-left: 10px;
        transform: translateY(30%);
      }
    }
  }
}
</style>

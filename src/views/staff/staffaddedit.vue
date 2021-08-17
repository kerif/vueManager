<template>
  <div class="staff-add-container">
    <el-form
      ref="params"
      :model="user"
      label-width="100px"
      label-position="left"
      :rules="rules"
      style="max-width: 350px"
    >
      <h4>{{ $t('登录信息') }}</h4>
      <!-- 用户名 -->
      <el-form-item :label="$t('用户名')" prop="username">
        <el-input
          v-model="user.username"
          :placeholder="$t('请输入用户名')"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item :label="this.$t('密码')" prop="password" v-if="!this.$route.params.id">
        <el-input
          v-model="user.password"
          type="password"
          :placeholder="$t('请输入密码')"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <!-- 确认密码 -->
      <el-form-item :label="$t('确认密码')" prop="confirm_password" v-if="!this.$route.params.id">
        <el-input
          v-model="user.confirm_password"
          type="password"
          :placeholder="$t('请再次输入密码')"
        ></el-input>
      </el-form-item>
      <!-- 所属员工组 -->
      <el-form-item :label="$t('员工组')" prop="group_id" class="employ">
        <el-select v-model="user.group_id" :placeholder="$t('请选择员工组')" clearable>
          <el-option
            v-for="item in employeeGroup"
            :key="item.id"
            :label="item.name_cn"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <h4>{{ $t('基本资料') }}</h4>
      <!-- 姓名 -->
      <el-form-item :label="$t('姓名')" prop="name">
        <el-input v-model="user.name" :placeholder="$t('请输入姓名')"></el-input>
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item :label="$t('手机号')" prop="phone">
        <el-input v-model="user.phone" :placeholder="$t('请输入联系电话')"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item :label="$t('邮箱')" prop="email">
        <el-input v-model="user.email" :placeholder="$t('请输入邮箱')"></el-input>
      </el-form-item>
      <h4>{{ $t('企业微信') }}</h4>
      <!-- 微信号 -->
      <el-form-item :label="$t('微信号')">
        <el-input v-model="user.we_chat" :placeholder="$t('请输入微信号')"></el-input>
      </el-form-item>
      <!-- 微信昵称 -->
      <el-form-item :label="$t('微信昵称')">
        <el-input v-model="user.we_chat_name" :placeholder="$t('请输入微信昵称')"></el-input>
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item :label="$t('手机号')">
        <el-input v-model="user.we_chat_phone" :placeholder="$t('请输入手机号')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="update('params')" :loading="$store.state.btnLoading">
          {{ $t('保存') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      btn_loading: false,
      employeeGroup: [],
      rules: {
        // 必填项校验
        username: [{ required: true, message: this.$t('请输入用户名'), trigger: 'change' }],
        name: [{ required: true, message: this.$t('请输入姓名'), trigger: 'change' }],
        email: [
          { required: true, message: this.$t('请输入邮箱'), trigger: 'blur' },
          { type: 'email', message: this.$t('请输入正确的邮箱地址'), trigger: ['blur', 'change'] }
        ],
        phone: [{ required: true, message: this.$t('请输入电话号码'), trigger: 'change' }],
        password: [
          { required: true, message: this.$t('请输入密码'), trigger: 'blur' },
          { min: 8, max: 32, message: this.$t('长度在 8 到 20 个字符'), trigger: 'blur' }
        ],
        confirm_password: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          { min: 8, max: 20, message: this.$t('长度在 8 到 20 个字符'), trigger: 'blur' }
        ],
        group_id: [{ required: true, message: this.$t('请输入员工组'), trigger: 'change' }]
      },
      user: {
        username: '',
        name: '',
        email: '',
        phone: '',
        group_id: '',
        password: '',
        confirm_password: '',
        we_chat: '',
        we_chat_name: '',
        we_chat_phone: ''
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      // 编辑用户
      this.getInfo()
      this.getVipGroup() // 员工组列表
    } else {
      this.getVipGroup() // 员工组列表
    }
  },
  name: 'staffAddContainer',
  methods: {
    // 获取数据
    getInfo() {
      this.$request.EditVip(this.$route.params.id).then(res => {
        if (res.ret) {
          this.user = res.data
          this.$set(this.user, 'group_id', res.data.admin_group.id)
        }
      })
    },
    // 获取员工组数据
    getVipGroup() {
      this.$request.getVips().then(res => {
        this.employeeGroup = res.data
      })
    },
    // 保存
    update(formName) {
      if (this.$route.params.id) {
        // 如果是编辑状态
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$request.editAdmins(this.$route.params.id, this.user).then(res => {
              if (res.ret) {
                this.$notify({
                  title: this.$t('成功操作'),
                  message: res.msg,
                  type: 'success'
                })
                this.$router.go(-1)
              } else {
                this.$notify({
                  title: this.$t('操作失败'),
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            return false
          }
        })
      } else {
        // 添加员工
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$request.saveVip(this.user).then(res => {
              if (res.ret) {
                this.$notify({
                  title: this.$t('操作成功'),
                  message: res.tips,
                  type: 'success'
                })
                this.$router.push({ name: 'stafflist' })
              } else {
                this.$notify({
                  title: this.$t('操作失败'),
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
@import '../../styles/commonality.scss';
.staff-add-container {
  min-height: 67vh;
  padding: 1em 3em !important;
  background-color: #fff !important;
  .title_box {
    text-align: right;
    line-height: 2.5em;
  }
  hr {
    width: 100%;
    border: none;
    margin: 2em 0;
  }
  .phoneTips {
    color: red;
    display: inline-block;
    vertical-align: middle;
    margin-top: 0.8em;
  }
  .client_detail {
    .Info {
      padding: 1em 1.5em;
    }
  }
  .btn_box {
    margin-left: 135px;
    width: 33%;
    padding: 1.5em 0;
    margin-top: 1.5em;
    .el-button--primary {
      width: 72%;
    }
  }
  .employ {
    .el-select {
      width: 100% !important;
    }
  }
}
</style>

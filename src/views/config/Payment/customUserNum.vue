<template>
  <div>
    <el-form :mode="ruleForm" label-width="150px">
      <el-form-item :label="$t('编号前缀固定两位')">
        <el-input v-model="ruleForm.prefix" class="input-box" @input="onInput"></el-input>
        <span style="margin-left: 5px">{{ $t('可以为空') }}</span>
      </el-form-item>
      <el-form-item :label="$t('编号类型')">
        <el-radio-group v-model="ruleForm.type">
          <el-radio :label="1">{{ $t('纯数字') }}</el-radio>
          <el-radio :label="2">{{ $t('纯字母') }}</el-radio>
          <el-radio :label="3">{{ $t('汉字随机') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('编号长度位数')">
        <el-input v-model="ruleForm.length" class="input-box"></el-input>
      </el-form-item>
      <el-form-item :label="$t('超始数字')" v-if="ruleForm.type === 1">
        <el-input v-model="ruleForm.start" class="input-box" @blur="onBlurNum"></el-input>
      </el-form-item>
      <el-form-item :label="$t('跳过含4编号')">
        <el-switch
          v-model="ruleForm.jump_four"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('是否启用规则')">
        <el-switch
          v-model="ruleForm.enabled"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="ruleForm.regenerate"
          ><span class="switch-text">{{
            $t('重置老用户编号, 勾上后老用户会重新生成一个新编号,慎重勾选')
          }}</span></el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="ruleForm.know">
          <span class="switch-text">{{
            $t('我知晓开启这个功能后,会改变客户编号,影响仓库收件地址编号,打印面单的相关信息变动')
          }}</span>
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="save-btn" type="primary" @click="onSave">{{ $t('保存') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        prefix: '',
        length: '',
        type: 1,
        start: '',
        jump_four: 0,
        enabled: 0,
        regenerate: false,
        know: false
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      this.$request.getUserNumConfig().then(res => {
        if (res.ret) {
          for (let key in this.ruleForm) {
            if (Object.hasOwnProperty.call(this.ruleForm, key)) {
              this.ruleForm[key] = res.data[key]
            }
          }
        }
      })
    },
    onBlurNum() {
      let reg = /[^0-9.]/g
      if (reg.test(this.ruleForm.start)) {
        this.ruleForm.start = ''
        return this.$message.error(this.$t('只能输入数字'))
      }
    },
    onInput(val) {
      if (val.length > 2) {
        this.ruleForm.prefix = val.slice(0, 2)
      }
    },
    onSave() {
      if (!this.ruleForm.know) {
        return this.$message.error(this.$t('用户须知不能为空'))
      }
      let params = {
        ...this.ruleForm,
        regenerate: !this.ruleForm.regenerate ? 0 : 1,
        know: Number(this.ruleForm.know)
      }
      this.$request.updateUserConfig(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.$request.initUserId().then(res=>{
            this.$store.commit('saveUid', res.data.user_uid)
            console.log(this.$store.state.uid, '@@@uid')
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style>
.input-box {
  width: 15%;
}
.switch-text {
  color: red;
}
</style>

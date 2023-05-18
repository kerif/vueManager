<template>
  <el-dialog
    :visible.sync="show"
    :title="brand == 'phone' ? $t('修改登录手机号') : $t('修改登录邮箱')"
    width="30%"
    @close="clear"
  >
    <el-form :model="ruleForm" label-width="100px">
      <el-form-item :label="$t('系统ID')">
        <div>{{ row.id }}</div>
      </el-form-item>
      <el-form-item :label="$t('客户编号')" v-if="$store.state.uid === 1">
        <div v-if="$store.state.uid === 1">{{ row.uid }}</div>
      </el-form-item>
      <div v-if="brand == 'phone'">
        <el-form-item :label="$t('原手机号')">
          <div>-</div>
        </el-form-item>
        <el-form-item :label="$t('新手机号')" class="required-item">
          <div>
            <el-select
              class="select-ipt"
              v-model="ruleForm.timezone"
              :placeholder="$t('请选择区号')"
            >
              <el-option
                v-for="item in timezoneData"
                :key="item.id"
                :label="item.timezone"
                :value="item.timezone"
              ></el-option>
            </el-select>
            <el-input
              v-model="ruleForm.phone"
              :placeholder="$t('请输入新手机号')"
              class="ipt"
            ></el-input>
          </div>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item :label="$t('原邮箱')">
          <div>-</div>
        </el-form-item>
        <el-form-item :label="$t('新邮箱')" class="required-item">
          <el-input
            v-model="ruleForm.email"
            :placeholder="$t('请输入新邮箱')"
            class="ipt"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onSubmit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      row: {},
      brand: '',
      timezoneData: [],
      ruleForm: {
        timezone: '',
        email: '',
        phone: ''
      }
    }
  },
  methods: {
    init() {
      if (this.brand == 'phone') {
        this.getTimezone()
      }
    },
    getTimezone() {
      this.$request.getCountry().then(res => {
        this.timezoneData = res.data
      })
    },
    onSubmit() {
      let params = {}
      if (this.brand == 'phone') {
        if (!this.ruleForm.timezone) {
          return this.$message.error(this.$t('请选择区号'))
        } else if (!this.ruleForm.phone) {
          return this.$message.error(this.$t('请输入新号码'))
        }
        const { timezone, phone } = this.ruleForm
        params = {
          timezone,
          phone
        }
      } else {
        if (!this.ruleForm.email) {
          return this.$message.error(this.$t('请输入新邮箱'))
        }
        const { email } = this.ruleForm
        params = {
          email
        }
      }
      this.$request.editLoginPhone(this.row.id, params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.ruleForm.email = ''
      this.ruleForm.timezone = ''
      this.ruleForm.phone = ''
    }
  }
}
</script>

<style>
.ipt {
  width: 60%;
}
.select-ipt {
  width: 30%;
  margin-right: 10px;
}
.required-item > .el-form-item__label::before {
  content: '*';
  font-size: 16px;
  color: red;
  margin-right: 5px;
}
</style>

<template>
  <div class="ordinary-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('抵现券')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('抵重券')" name="1"></el-tab-pane>
    </el-tabs>
    <el-form
      :model="ruleForm"
      label-width="200px"
      label-position="left"
      :rules="rules"
      ref="ruleForm"
      key="ruleFormKey"
      v-if="activeName === '0'"
    >
      <el-form-item :label="$t('种类')">
        <span v-if="$route.params.type === 5"
          >{{ $t('关注公众号领券') }} - {{ $t('抵现券') }}
        </span>
        <span v-if="$route.params.type === 6">{{ $t('生日券') }} - {{ $t('抵现券') }} </span>
        <span v-if="$route.params.type === 7">{{ $t('普通券') }} - {{ $t('抵现券') }} </span>
        <span v-if="$route.params.type === 8">{{ $t('用户抢券') }} - {{ $t('抵现券') }} </span>
      </el-form-item>
      <el-form-item :label="$t('券名称')" prop="name">
        <el-input
          class="input-sty"
          v-model="ruleForm.name"
          :placeholder="$t('请输入券名称')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('金额')" prop="amount">
        <el-input
          class="input-sty"
          v-model="ruleForm.amount"
          :placeholder="$t('请输入金额')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费金额')" prop="threshold">
        <el-input
          class="input-sty"
          v-model="ruleForm.threshold"
          :placeholder="$t('请输入最低消费金额')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('生效时间')"
        prop="effected_at"
        v-if="$route.params.type === 7 || $route.params.type === 8"
      >
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="ruleForm.effected_at"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :picker-options="pickerOptions"
          :placeholder="$t('请输入生效时间')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('失效时间')"
        prop="expired_at"
        v-if="$route.params.type === 7 || $route.params.type === 8"
      >
        <el-date-picker
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="ruleForm.expired_at"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="$t('请输入失效时间')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$route.params.type === 5 ? $t('有效期') : $t('有效时长')"
        v-if="$route.params.type === 5 || $route.params.type === 6"
        prop="days"
      >
        <el-input
          :placeholder="$t('请输入有效期')"
          class="input-sty"
          v-model="ruleForm.days"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('使用范围')" prop="scope">
        <el-radio-group v-model="ruleForm.scope">
          <el-radio :label="0">{{ $t('全部') }}</el-radio>
          <el-radio :label="1">{{ $t('按路线') }}</el-radio>
        </el-radio-group>
        <div v-if="ruleForm.scope === 1" class="choose-box">
          <div>
            <el-button class="btn-deep-blue" @click="chooseLine">{{ $t('选择路线') }}</el-button>
          </div>
          <div class="display-line" v-if="this.lineName.length">
            <p v-for="item in lineName" :key="item.id">
              {{ item.name }}
            </p>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('抢券时间')" v-if="$route.params.type === 8">
        <el-date-picker
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="timeList"
          type="datetimerange"
          :start-placeholder="$t('抢券开始时间')"
          :end-placeholder="$t('抢券结束时间')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('单人限领数量')"
        prop="share_each_count"
        v-if="$route.params.type === 8"
      >
        <el-input
          class="input-sty"
          :placeholder="$t('请输入单人限领数量')"
          v-model="ruleForm.share_each_count"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('放券总数')"
        prop="share_total_count"
        v-if="$route.params.type === 8"
      >
        <el-input
          class="input-sty"
          :placeholder="$t('请输入放券总数')"
          v-model="ruleForm.share_total_count"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('后台投放不计入总数')" v-if="$route.params.type === 8">
        <el-radio-group v-model="ruleForm.ignore_launch_count">
          <el-radio :label="1">{{ $t('是') }}</el-radio>
          <el-radio :label="0">{{ $t('否') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="submit('ruleForm')"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
    <el-form
      v-else
      :model="form"
      label-width="200px"
      label-position="left"
      :rules="rule"
      key="formKey"
      ref="form"
    >
      <el-form-item :label="$t('种类')">
        <span v-if="$route.params.type === 5"
          >{{ $t('关注公众号领券') }} - {{ $t('抵重券') }}
        </span>
        <span v-if="$route.params.type === 6">{{ $t('生日券') }} - {{ $t('抵重券') }} </span>
        <span v-if="$route.params.type === 7">{{ $t('普通券') }} - {{ $t('抵重券') }} </span>
        <span v-if="$route.params.type === 8">{{ $t('用户抢券') }} - {{ $t('抵重券') }} </span>
      </el-form-item>
      <el-form-item :label="$t('券名称')" prop="name">
        <el-input
          class="input-sty"
          v-model="form.name"
          :placeholder="$t('请输入券名称')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('可抵重量')"
        prop="weight"
        v-if="$route.params.type === 6 || $route.params.type === 7 || $route.params.type === 8"
      >
        <el-input
          class="input-sty"
          v-model="form.weight"
          :placeholder="$t('请输入可抵重量')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('重量')" prop="weight" v-if="$route.params.type === 5">
        <el-input
          class="input-sty"
          v-model="form.weight"
          :placeholder="$t('请输入重量')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费重量')" prop="min_weight">
        <el-input
          class="input-sty"
          v-model="form.min_weight"
          :placeholder="$t('请输入最低消费重量')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('生效时间')"
        prop="effected_at"
        v-if="$route.params.type === 7 || $route.params.type === 8"
      >
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.effected_at"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :picker-options="pickerOptions"
          :placeholder="$t('请输入生效时间')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('失效时间')"
        prop="expired_at"
        v-if="$route.params.type === 7 || $route.params.type === 8"
      >
        <el-date-picker
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.expired_at"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="$t('请输入失效时间')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$route.params.type === 5 ? $t('有效期') : $t('有效时长')"
        v-if="$route.params.type === 5 || $route.params.type === 6"
        prop="days"
      >
        <el-input
          :placeholder="$t('请输入有效期')"
          class="input-sty"
          v-model="form.days"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('使用范围')" prop="scope">
        <el-radio-group v-model="form.scope">
          <el-radio :label="0">{{ $t('全部') }}</el-radio>
          <el-radio :label="1">{{ $t('按路线') }}</el-radio>
        </el-radio-group>
        <div v-if="form.scope === 1" class="choose-box">
          <div>
            <el-button class="btn-deep-blue" @click="chooseLine">{{ $t('选择路线') }}</el-button>
          </div>
          <div class="display-line" v-if="this.lineName.length">
            <p v-for="item in lineName" :key="item.id">
              {{ item.name }}
            </p>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('抢券时间')" v-if="$route.params.type === 8">
        <el-date-picker
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="timeData"
          type="datetimerange"
          :start-placeholder="$t('抢券开始时间')"
          :end-placeholder="$t('抢券结束时间')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('单人限领数量')"
        prop="share_each_count"
        v-if="$route.params.type === 8"
      >
        <el-input
          class="input-sty"
          :placeholder="$t('请输入单人限领数量')"
          v-model="form.share_each_count"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('放券总数')"
        prop="share_total_count"
        v-if="$route.params.type === 8"
      >
        <el-input
          class="input-sty"
          :placeholder="$t('请输入放券总数')"
          v-model="form.share_total_count"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('后台投放不计入总数')" v-if="$route.params.type === 8">
        <el-radio-group v-model="form.ignore_launch_count">
          <el-radio :label="1">{{ $t('是') }}</el-radio>
          <el-radio :label="0">{{ $t('否') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="submit('form')"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      activeName: '0',
      lineName: [],
      ruleForm: {
        coupon_type: '',
        name: '',
        amount: '',
        threshold: '',
        days: '',
        scope: 0,
        express_line_ids: [],
        effected_at: '',
        expired_at: '',
        share_each_count: '',
        share_total_count: '',
        ignore_launch_count: 0
      },
      form: {
        coupon_type: '',
        name: '',
        threshold: '',
        days: '',
        weight: '',
        min_weight: '',
        scope: 0,
        express_line_ids: [],
        effected_at: '',
        expired_at: '',
        share_each_count: '',
        share_total_count: '',
        ignore_launch_count: 0
      },
      timeList: [],
      timeData: [],
      rules: {
        name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }],
        amount: [{ required: true, message: this.$t('请输入金额'), trigger: 'blur' }],
        threshold: [{ required: true, message: this.$t('请输入最低消费金额'), trigger: 'blur' }],
        days: [{ required: true, message: this.$t('请输入有效期'), trigger: 'blur' }],
        expired_at: [{ required: true, message: this.$t('请输入失效时间'), trigger: 'blur' }],
        effected_at: [{ required: true, message: this.$t('请输入生效时间'), trigger: 'blur' }],
        scope: [{ required: true, message: this.$t('请选择使用范围'), trigger: 'blur' }],
        share_each_count: [
          { required: true, message: this.$t('请输入单人限领数量'), trigger: 'blur' }
        ],
        share_total_count: [{ required: true, message: this.$t('请输入放券总数'), trigger: 'blur' }]
      },
      rule: {
        name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }],
        threshold: [{ required: true, message: this.$t('请输入最低消费金额'), trigger: 'blur' }],
        days: [{ required: true, message: this.$t('请输入有效期'), trigger: 'blur' }],
        expired_at: [{ required: true, message: this.$t('请输入失效时间'), trigger: 'blur' }],
        effected_at: [{ required: true, message: this.$t('请输入生效时间'), trigger: 'blur' }],
        scope: [{ required: true, message: this.$t('请选择使用范围'), trigger: 'blur' }],
        weight: [{ required: true, message: this.$t('请输入重量'), trigger: 'blur' }],
        min_weight: [{ required: true, message: this.$t('请输入最低消费重量'), trigger: 'blur' }],
        share_each_count: [
          { required: true, message: this.$t('请输入单人限领数量'), trigger: 'blur' }
        ],
        share_total_count: [{ required: true, message: this.$t('请输入放券总数'), trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    chooseLine() {
      dialog({ type: 'lineChoose' }, data => {
        this.lineName = data
        this.ruleForm.express_line_ids = data.map(item => item.id)
      })
    },
    handleClick(tab) {
      console.log(tab, 'tab')
    },
    submit(formName) {
      console.log(formName, 'formName')
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {}
          if (this.activeName === '0') {
            params = {
              ...this.ruleForm,
              share_begin_at: this.timeList[0],
              share_end_at: this.timeList[1]
            }
            params.coupon_type = 1
          } else {
            params = {
              ...this.form,
              share_begin_at: this.timeData[0],
              share_end_at: this.timeData[1]
            }
            params.coupon_type = 2
          }

          this.$request.addNew(this.$route.params.type, params).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.$router.push({ name: 'voucher', params: { type: this.$route.params.type } })
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
    }
  }
}
</script>

<style lang="scss">
.ordinary-container {
  background-color: #fff !important;
  .input-sty {
    width: 30%;
  }
  .save-btn {
    min-width: 100px;
  }
  .choose-box {
    display: flex;
    .display-line {
      width: 245px;
      padding: 6px;
      margin-left: 20px;
      background-color: #f3f3f3;
    }
  }
}
</style>

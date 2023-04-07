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
        <span v-if="type === 1">{{ $t('新用户送券') }} - {{ $t('抵现券') }}</span>
        <span v-if="type === 2">{{ $t('邀请新人送券') }} - {{ $t('抵现券') }}</span>
        <span v-if="type === 3">{{ $t('被邀请人送券') }} - {{ $t('抵现券') }}</span>
        <!-- <span v-if="$route.params.type === 4">{{ $t('下单返券') }} - {{ $t('抵现券') }}</span> -->
        <span v-if="type === 5">{{ $t('关注公众号领券') }} - {{ $t('抵现券') }} </span>
        <span v-if="type === 6">{{ $t('生日券') }} - {{ $t('抵现券') }} </span>
        <span v-if="type === 7">{{ $t('普通券') }} - {{ $t('抵现券') }} </span>
        <span v-if="type === 8">{{ $t('用户抢券') }} - {{ $t('抵现券') }} </span>
      </el-form-item>
      <el-form-item :label="$t('券名称')" prop="name">
        <el-input
          class="input-sty"
          v-model="ruleForm.name"
          :placeholder="$t('请输入券名称')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('金额')" prop="amount" v-if="type !== 4">
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
      <el-form-item :label="$t('生效时间')" prop="effected_at" v-if="type === 7 || type === 8">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="ruleForm.effected_at"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :picker-options="pickerOptions"
          :placeholder="$t('请输入生效时间')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('失效时间')" prop="expired_at" v-if="type === 7 || type === 8">
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
      <!-- <el-form-item :label="$t('有效时长')" prop="days" v-if="$route.params.type === 4">
        <el-input class="input-sty" :placeholder="$t('请输入有效时长')" v-model="ruleForm.days">
          <template slot="append">{{ $t('天') }}</template>
        </el-input>
      </el-form-item> -->
      <el-form-item
        :label="type === 5 ? $t('有效期') : $t('有效时长')"
        v-if="type === 2 || type === 3 || type === 5 || type === 6"
        prop="days"
      >
        <el-input
          :placeholder="$t('请输入有效期例如78而不是20200101')"
          class="input-sty"
          v-model="ruleForm.days"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('有效期')" prop="radio" v-if="type === 1">
        <el-radio-group v-model="ruleForm.radio">
          <div style="margin: 0 0 10px 0">
            <el-radio :label="1">{{ $t('到账后有效天数') }}</el-radio>
            <el-input v-model="ruleForm.days" style="width: 340px"></el-input>
          </div>
          <div>
            <el-radio :label="2">{{ $t('具体日期范围') }}</el-radio>
            <el-date-picker
              v-model="ruleForm.begin_at"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('请选择开始日期')"
            >
            </el-date-picker>
            &nbsp;&nbsp;<span style="display: inline-block; width: 10px">-</span>&nbsp;&nbsp;
            <el-date-picker
              v-model="ruleForm.end_at"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('请选择结束日期')"
            >
            </el-date-picker>
          </div>
        </el-radio-group>
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
      <!-- <div class="coupons" v-if="$route.params.type === 4">
        <p>{{ $t('送券条件') }}：</p>
      </div> -->
      <!-- <el-form-item :label="$t('仅首次下单返券')" v-if="$route.params.type === 4">
        <el-radio-group v-model="ruleForm.times">
          <el-radio :label="1">{{ $t('开启') }}</el-radio>
          <el-radio :label="0">{{ $t('关闭') }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item
        :label="$t('下单支付最小满足金额') + this.localization.currency_unit"
        prop="order_amount"
        v-if="$route.params.type === 4"
      >
        <el-input
          class="less-sty"
          :placeholder="$t('请输入最低消费')"
          v-model="ruleForm.order_amount"
        ></el-input>
      </el-form-item> -->
      <!-- <el-form-item :label="$t('券金额方式')" v-if="$route.params.type === 4">
        <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item
        v-if="this.ruleForm.type === 1 && $route.params.type === 4"
        :label="$t('固定金额') + this.localization.currency_unit"
        prop="amount"
      >
        <el-input class="less-sty" :placeholder="$t('请输入')" v-model="ruleForm.amount"></el-input>
      </el-form-item> -->
      <!-- <el-form-item v-else :label="$t('成交支付金额比例')" prop="amount">
        <el-input class="less-sty" :placeholder="$t('请输入')" v-model="ruleForm.amount"></el-input>
        <span>&nbsp;&nbsp;&nbsp;%</span>
      </el-form-item> -->
      <!-- <el-form-item
        v-if="this.ruleForm.type === 2 && $route.params.type === 4"
        :label="$t('券最大上限金额') + this.localization.currency_unit"
        prop="max_coupon_amount"
      >
        <el-input
          class="less-sty"
          :placeholder="$t('请输入')"
          v-model="ruleForm.max_coupon_amount"
        ></el-input>
      </el-form-item> -->
      <el-form-item :label="$t('获券条件')" prop="trigger_condition" v-if="type === 2">
        <el-radio-group v-model="ruleForm.trigger_condition">
          <el-radio :label="1">{{ $t('新用户支付一笔订单') }}</el-radio>
          <el-radio :label="2">{{ $t('用户注册登陆') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('抢券时间')" v-if="type === 8">
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
      <el-form-item :label="$t('单人限领数量')" prop="share_each_count" v-if="type === 8">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入单人限领数量')"
          v-model="ruleForm.share_each_count"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('放券总数')" prop="share_total_count" v-if="type === 8">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入放券总数')"
          v-model="ruleForm.share_total_count"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('后台投放不计入总数')" v-if="type === 8">
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
        <span v-if="type === 1">{{ $t('新用户送券') }} - {{ $t('抵重券') }}</span>
        <span v-if="type === 2">{{ $t('邀请新人送券') }} - {{ $t('抵重券') }}</span>
        <span v-if="type === 3">{{ $t('被邀请人送券') }} - {{ $t('抵重券') }}</span>
        <!-- <span v-if="this.$route.params.type === 4">{{ $t('下单返券') }} - {{ $t('抵重券') }}</span> -->
        <span v-if="type === 5">{{ $t('关注公众号领券') }} - {{ $t('抵重券') }} </span>
        <span v-if="type === 6">{{ $t('生日券') }} - {{ $t('抵重券') }} </span>
        <span v-if="type === 7">{{ $t('普通券') }} - {{ $t('抵重券') }} </span>
        <span v-if="type === 8">{{ $t('用户抢券') }} - {{ $t('抵重券') }} </span>
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
        v-if="type === 1 || type === 2 || type === 3 || type === 6 || type === 7 || type === 8"
      >
        <el-input
          class="input-sty"
          v-model="form.weight"
          :placeholder="$t('请输入可抵重量')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('重量')" prop="weight" v-if="type === 5">
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
      <el-form-item :label="$t('生效时间')" prop="effected_at" v-if="type === 7 || type === 8">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.effected_at"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :picker-options="pickerOptions"
          :placeholder="$t('请输入生效时间')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('失效时间')" prop="expired_at" v-if="type === 7 || type === 8">
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
        :label="type === 5 ? $t('有效期') : $t('有效时长')"
        v-if="type === 2 || type === 3 || type === 5 || type === 6"
        prop="days"
      >
        <el-input
          :placeholder="$t('请输入有效期例如78而不是20200101')"
          class="input-sty"
          v-model="form.days"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('有效期')" prop="radio" v-if="type === 1">
        <el-radio-group v-model="form.radio">
          <div style="margin: 0 0 10px 0">
            <el-radio :label="1">{{ $t('到账后有效天数') }}</el-radio>
            <el-input v-model="form.days" style="width: 340px"></el-input>
          </div>
          <div>
            <el-radio :label="2">{{ $t('具体日期范围') }}</el-radio>
            <el-date-picker
              v-model="form.begin_at"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('请选择开始日期')"
            >
            </el-date-picker>
            &nbsp;&nbsp;<span style="display: inline-block; width: 10px">-</span>&nbsp;&nbsp;
            <el-date-picker
              v-model="form.end_at"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('请选择结束日期')"
            >
            </el-date-picker>
          </div>
        </el-radio-group>
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
      <el-form-item :label="$t('获券条件')" prop="trigger_condition" v-if="type === 2">
        <el-radio-group v-model="form.trigger_condition">
          <el-radio :label="1">{{ $t('新用户支付一笔订单') }}</el-radio>
          <el-radio :label="2">{{ $t('用户注册登陆') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('抢券时间')" v-if="type === 8">
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
      <el-form-item :label="$t('单人限领数量')" prop="share_each_count" v-if="type === 8">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入单人限领数量')"
          v-model="form.share_each_count"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('放券总数')" prop="share_total_count" v-if="type === 8">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入放券总数')"
          v-model="form.share_total_count"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('后台投放不计入总数')" v-if="type === 8">
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
        ignore_launch_count: 0,
        radio: 1,
        begin_at: '',
        end_at: '',
        trigger_condition: 1
        // times: 1,
        // order_amount: '',
        // type: 1,
        // max_coupon_amount: ''
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
        ignore_launch_count: 0,
        radio: 1,
        begin_at: '',
        end_at: '',
        trigger_condition: 1
      },
      timeList: [],
      timeData: [],
      localization: {},
      languageData: [],
      type: '',
      options: [
        {
          id: 1,
          name: this.$t('按固定金额')
        },
        {
          id: 2,
          name: this.$t('按订单金额比例')
        }
      ],
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
        share_total_count: [
          { required: true, message: this.$t('请输入放券总数'), trigger: 'blur' }
        ],
        radio: [{ required: true, message: this.$t('请选择'), trigger: 'change' }],
        trigger_condition: [
          { required: true, message: this.$t('请选择获券条件'), trigger: 'blur' }
        ],
        order_amount: [
          { required: true, message: this.$t('请输入下单支付最小满足金额'), trigger: 'blur' }
        ],
        max_coupon_amount: [
          { required: true, message: this.$t('请输入券最大上限金额'), trigger: 'blur' }
        ]
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
        share_total_count: [
          { required: true, message: this.$t('请输入放券总数'), trigger: 'blur' }
        ],
        radio: [{ required: true, message: this.$t('请选择'), trigger: 'change' }],
        trigger_condition: [{ required: true, message: this.$t('请选择获券条件'), trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created() {
    if (this.$route.query.type) {
      this.type = JSON.parse(this.$route.query.type)
    }
    this.getLanguageList()
  },
  methods: {
    chooseLine() {
      dialog({ type: 'lineChoose' }, data => {
        this.lineName = data
        this.ruleForm.express_line_ids = data.map(item => item.id)
        this.form.express_line_ids = data.map(item => item.id)
      })
    },
    handleClick(tab) {
      console.log(tab, 'tab')
    },
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
          this.localization = res.localization
        }
      })
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

          this.$request.addNew(this.type, params).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.$router.push({ name: 'new', params: { type: this.type } })
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
  padding: 15px 20px;
  .input-sty {
    width: 30%;
  }
  .save-btn {
    min-width: 100px;
  }
  .less-sty {
    width: 30%;
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
  .coupons {
    margin-top: 60px;
  }
}
</style>

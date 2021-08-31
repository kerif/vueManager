<template>
  <div class="rebate-container">
    <el-form
      label-width="200px"
      label-position="left"
      class="voucher-form"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item :label="$t('种类')">
        <span v-if="$route.params.type === 1">{{ $t('新用户送券') }}</span>
        <span v-if="$route.params.type === 2">{{ $t('邀请新人送券') }}</span>
        <span v-if="$route.params.type === 3">{{ $t('被邀请人送券') }}</span>
        <span v-if="$route.params.type === 4">{{ $t('下单返券') }}</span>
      </el-form-item>
      <!-- 新用户送券 -->
      <!-- <el-form-item :label="$t('支付成功送券')">
      <el-radio-group v-model="ruleForm.status">
        <el-radio :label="1">{{$t('开启')}}</el-radio>
        <el-radio :label="0">{{$t('关闭')}}</el-radio>
      </el-radio-group>
    </el-form-item> -->
      <!-- 券名称 -->
      <el-form-item :label="$t('券名称')" prop="name">
        <el-input
          :disabled="statusEdit"
          class="input-sty"
          :placeholder="$t('请输入名称')"
          v-model="ruleForm.name"
        ></el-input>
        <!-- <el-button class="btn-deep-purple others-btn" v-for="item in formatLangData" :key="item.id" @click="onProps(ruleForm.name, item)">{{item.name}}</el-button> -->
      </el-form-item>
      <!-- 最低消费 -->
      <el-form-item :label="$t('最低消费')" prop="threshold">
        <el-input
          :disabled="statusEdit"
          class="input-sty"
          :placeholder="$t('请输入最低消费')"
          v-model="ruleForm.threshold"
        ></el-input>
      </el-form-item>
      <!-- 有效时长 -->
      <el-form-item :label="$t('有效时长')" prop="days">
        <el-input
          :disabled="statusEdit"
          class="input-sty"
          :placeholder="$t('请输入有效时长')"
          v-model="ruleForm.days"
        >
          <template slot="append">{{ $t('天') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('使用范围')" prop="scope">
        <el-radio-group v-model="ruleForm.scope">
          <el-radio :label="0" :disabled="statusEdit">{{ $t('全部') }}</el-radio>
          <el-radio :label="1" :disabled="statusEdit">{{ $t('按路线') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('获券条件')"
        prop="trigger_condition"
        v-if="$route.params.type === 2"
      >
        <el-radio-group v-model="ruleForm.trigger_condition">
          <el-radio :label="1" :disabled="statusEdit">{{ $t('新用户支付一笔订单') }}</el-radio>
          <el-radio :label="2" :disabled="statusEdit">{{ $t('用户注册登陆') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="this.ruleForm.scope === 1" class="choose-btn">
        <el-button v-if="!statusEdit" class="btn-deep-blue" @click="chooseLine">{{
          $t('选择路线')
        }}</el-button>
        <div class="display-line" v-if="this.lineName.length">
          <p v-for="item in lineName" :key="item.id">
            {{ item.name }}
          </p>
        </div>
      </div>
      <div class="coupons">
        <p>{{ $t('送券条件') }}：</p>
      </div>
      <!-- 仅首次下单返券 -->
      <el-form-item :label="$t('仅首次下单返券')" v-if="$route.params.type === 4">
        <el-radio-group v-model="ruleForm.times">
          <el-radio :label="1" :disabled="statusEdit">{{ $t('开启') }}</el-radio>
          <el-radio :label="0" :disabled="statusEdit">{{ $t('关闭') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 下单支付最小满足金额 -->
      <el-form-item
        :label="$t('下单支付最小满足金额') + this.localization.currency_unit"
        prop="order_amount"
      >
        <el-input
          class="less-sty"
          :disabled="statusEdit"
          :placeholder="$t('请输入最低消费')"
          v-model="ruleForm.order_amount"
        ></el-input>
      </el-form-item>
      <!-- 券金额方式 -->
      <el-form-item :label="$t('券金额方式')">
        <el-select v-model="ruleForm.type" placeholder="请选择" :disabled="statusEdit">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 固定金额 -->
      <el-form-item
        v-if="this.ruleForm.type === 1"
        :label="$t('固定金额') + this.localization.currency_unit"
        prop="amount"
      >
        <el-input
          :disabled="statusEdit"
          class="less-sty"
          :placeholder="$t('请输入')"
          v-model="ruleForm.amount"
        ></el-input>
      </el-form-item>
      <!-- 成交支付金额 -->
      <el-form-item v-else :label="$t('成交支付金额比例')" prop="amount">
        <el-input
          :disabled="statusEdit"
          class="less-sty"
          :placeholder="$t('请输入')"
          v-model="ruleForm.amount"
        ></el-input>
        <span>&nbsp;&nbsp;&nbsp;%</span>
      </el-form-item>
      <!-- 券最大上限金额 -->
      <el-form-item
        v-if="this.ruleForm.type === 2"
        :label="$t('券最大上限金额') + this.localization.currency_unit"
        prop="max_coupon_amount"
      >
        <el-input
          :disabled="statusEdit"
          class="less-sty"
          :placeholder="$t('请输入')"
          v-model="ruleForm.max_coupon_amount"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          v-if="!statusEdit"
          class="save-btn"
          @click="submit('ruleForm')"
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
      ruleForm: {
        status: '',
        times: 1,
        invited_send: '',
        name: '',
        threshold: '',
        days: '',
        begin_at: '',
        amount: '',
        max_coupon_amount: '',
        type: 1,
        scope: 0,
        trigger_condition: 1,
        express_line_ids: []
      },
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
      languageData: [],
      rules: {
        name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }],
        amount: [{ required: true, message: this.$t('请输入金额'), trigger: 'blur' }],
        threshold: [{ required: true, message: this.$t('请输入最低消费'), trigger: 'blur' }],
        days: [{ required: true, message: this.$t('请输入有效时长'), trigger: 'blur' }],
        max_coupon_amount: [
          { required: true, message: this.$t('请输入券最大上限金额'), trigger: 'blur' }
        ],
        order_amount: [
          { required: true, message: this.$t('请输入下单支付最小满足金额'), trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      lineName: [], // 保存获取到的路线
      localization: {},
      statusEdit: false
    }
  },
  created() {
    this.getLanguageList()
    if (this.$route.query.id) {
      this.statusEdit = true
      this.getList()
    }
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList() {
      this.$request.getRebateDetails(this.$route.query.id).then(res => {
        this.ruleForm = res.data
        this.ruleForm.trigger_condition = res.data.trigger_condition
          ? res.data.trigger_condition
          : 1
      })
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.addNew(this.$route.params.type, this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.$router.push({ name: 'rebates', params: { type: this.$route.params.type } })
              // this.getList()
              // this.$router.push({ name: 'managementNew', params: { type: this.$route.params.type } })
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
    chooseLine() {
      dialog({ type: 'lineChoose' }, data => {
        // console.log(data, '我是路线data')
        this.lineName = data
        this.ruleForm.express_line_ids = data.map(item => item.id)
      })
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
    // 基础配置 修改语言
    onProps(line, lang) {
      console.log(line, lang)
      this.serviceCode = line['trans_' + lang.language_code]
      dialog({ type: 'rebateLang', line: line, lang: lang, transCode: this.serviceCode }, () => {
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss">
.rebate-container {
  background-color: #fff !important;
  padding: 20px;
  .voucher-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .input-sty {
    width: 40%;
  }
  .coupons {
    margin-top: 60px;
  }
  .less-sty {
    width: 30%;
  }
  .others-btn {
    margin-left: 15px;
  }
  .choose-btn {
    margin-bottom: 20px;
    // margin-left: 80px;
    margin-left: 290px;
    .el-button {
      vertical-align: top;
    }
  }
  .display-line {
    display: inline-block;
    padding: 5px;
    width: 245px;
    margin-left: 15px;
    background-color: #ccc;
    p {
      margin: 0;
    }
  }
}
</style>

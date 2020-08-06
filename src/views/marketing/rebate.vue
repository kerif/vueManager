<template>
  <div class="rebate-container">
  <el-form label-width="200px" label-position="left" class="voucher-form" :model="ruleForm" :rules="rules" ref="ruleForm">
    <!-- 新用户送券 -->
    <el-form-item :label="$t('支付成功送券')">
      <el-radio-group v-model="ruleForm.status">
        <el-radio :label="1">{{$t('开启')}}</el-radio>
        <el-radio :label="0">{{$t('关闭')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 券名称 -->
    <el-form-item :label="$t('券名称')" prop="name">
      <el-input class="input-sty" :placeholder="$t('请输入名称')" v-model="ruleForm.name"></el-input>
      <el-button class="btn-deep-purple others-btn" v-for="item in formatLangData" :key="item.id" @click="onProps(ruleForm.name, item)">{{item.name}}</el-button>
    </el-form-item>
    <!-- 最低消费 -->
    <el-form-item :label="$t('最低消费')" prop="threshold">
        <el-input class="input-sty" :placeholder="$t('请输入最低消费')" v-model="ruleForm.threshold"></el-input>
    </el-form-item>
    <!-- 有效时长 -->
    <el-form-item :label="$t('有效时长')" prop="days">
      <el-input class="input-sty" :placeholder="$t('请输入有效时长')" v-model="ruleForm.days">
        <template slot="append">{{$t('天')}}</template>
      </el-input>
    </el-form-item>
    <div class="coupons">
      <p>{{$t('送券条件')}}：</p>
    </div>
    <!-- 下单支付最小满足金额 -->
    <el-form-item :label="$t('下单支付最小满足金额') + this.localization.currency_unit" prop="order_amount">
        <el-input class="less-sty" :placeholder="$t('请输入最低消费')" v-model="ruleForm.order_amount"></el-input>
    </el-form-item>
    <!-- 券金额方式 -->
    <el-form-item :label="$t('券金额方式')">
      <el-select v-model="ruleForm.type" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 固定金额 -->
    <el-form-item v-if="this.ruleForm.type === 1" :label="$t('固定金额') + this.localization.currency_unit" prop="amount">
      <el-input class="less-sty" :placeholder="$t('请输入')" v-model="ruleForm.amount"></el-input>
    </el-form-item>
    <!-- 成交支付金额 -->
    <el-form-item v-else :label="$t('成交支付金额比例')" prop="amount">
        <el-input class="less-sty" :placeholder="$t('请输入')" v-model="ruleForm.amount"></el-input>
        <span>&nbsp;&nbsp;&nbsp;%</span>
    </el-form-item>
    <!-- 券最大上限金额 -->
    <el-form-item v-if="this.ruleForm.type === 2" :label="$t('券最大上限金额') + this.localization.currency_unit" prop="max_coupon_amount">
        <el-input class="less-sty" :placeholder="$t('请输入')" v-model="ruleForm.max_coupon_amount"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="save-btn" @click="submit('ruleForm')"
      :loading="$store.state.btnLoading">{{$t('保存')}}</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      ruleForm: {
        status: '',
        invited_send: '',
        name: '',
        threshold: '',
        days: '',
        amount: '',
        max_coupon_amount: '',
        type: 1
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
        name: [
          { required: true, message: this.$t('请输入名称'), trigger: 'blur' }
        ],
        amount: [
          { required: true, message: this.$t('请输入金额'), trigger: 'blur' }
        ],
        threshold: [
          { required: true, message: this.$t('请输入最低消费'), trigger: 'blur' }
        ],
        days: [
          { required: true, message: this.$t('请输入有效时长'), trigger: 'blur' }
        ],
        max_coupon_amount: [
          { required: true, message: this.$t('请输入券最大上限金额'), trigger: 'blur' }
        ],
        order_amount: [
          { required: true, message: this.$t('请输入下单支付最小满足金额'), trigger: 'blur' }
        ]
      },
      localization: {}
    }
  },
  created () {
    this.getList()
    this.getLanguageList()
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList () {
      this.$request.rebateList().then(res => {
        this.ruleForm = res.data
        this.ruleForm.type = res.data.type
        this.localization = res.localization
      })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.updateRebate(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getList()
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
    // 获取全部语言
    getLanguageList () {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 基础配置 修改语言
    onProps (line, lang) {
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
}
</style>

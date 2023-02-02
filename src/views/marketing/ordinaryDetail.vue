<template>
  <div class="ordinary-detail">
    <el-form
      label-width="200px"
      label-position="left"
      class="voucher-form"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item :label="$t('种类')">
        <span v-if="$route.params.type === 5"
          >{{ $t('关注公众号领券') }} - {{ coupon_type === 1 ? $t('抵现券') : $t('抵重券') }}
        </span>
        <span v-if="$route.params.type === 6"
          >{{ $t('生日券') }} - {{ coupon_type === 1 ? $t('抵现券') : $t('抵重券') }}
        </span>
      </el-form-item>
      <el-form-item :label="$t('券名称')" prop="name">
        <el-input
          class="input-sty"
          :disabled="statusEdit"
          v-model="ruleForm.name"
          :placeholder="$t('请输入券名称')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('金额')" prop="amount" v-if="coupon_type === 1">
        <el-input
          class="input-sty"
          :disabled="statusEdit"
          v-model="ruleForm.amount"
          :placeholder="$t('请输入金额')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费金额')" prop="threshold" v-if="coupon_type === 1">
        <el-input
          class="input-sty"
          :disabled="statusEdit"
          v-model="ruleForm.threshold"
          :placeholder="$t('请输入最低消费金额')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('可抵重量')" prop="weight" v-if="coupon_type === 2">
        <el-input
          class="input-sty"
          :disabled="statusEdit"
          v-model="ruleForm.weight"
          :placeholder="$t('请输入可抵重量')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费重量')" prop="min_weight" v-if="coupon_type === 2">
        <el-input
          class="input-sty"
          :disabled="statusEdit"
          v-model="ruleForm.min_weight"
          :placeholder="$t('请输入最低消费重量')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$route.params.type === 5 ? $t('有效期') : $t('有效时长')" prop="days">
        <el-input
          :placeholder="$t('请输入有效期')"
          class="input-sty"
          :disabled="statusEdit"
          v-model="ruleForm.days"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('使用范围')" prop="scope">
        <el-radio-group v-model="ruleForm.scope">
          <el-radio :label="0" :disabled="statusEdit">{{ $t('全部') }}</el-radio>
          <el-radio :label="1" :disabled="statusEdit">{{ $t('按路线') }}</el-radio>
        </el-radio-group>
        <!-- <div v-if="ruleForm.scope === 1" class="choose-box">
          <div>
            <el-button class="btn-deep-blue" @click="chooseLine">{{ $t('选择路线') }}</el-button>
          </div>
          <div class="display-line" v-if="this.lineName.length">
            <p v-for="item in lineName" :key="item.id">
              {{ item.name }}
            </p>
          </div>
        </div> -->
        <div v-if="this.ruleForm.scope === 1" class="choose-btn">
          <div class="display-line" v-if="this.lineData.length">
            <p v-for="item in lineData" :key="item.id">
              {{ item.name }}
            </p>
          </div>
        </div>
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
        name: '',
        amount: '',
        threshold: '',
        days: '',
        scope: 0,
        express_line_ids: [],
        weight: '',
        min_weight: ''
      },
      coupon_type: '',
      statusEdit: false,
      lineName: [],
      lineData: [],
      rules: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.statusEdit = true
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getRebateDetails(this.$route.query.id).then(res => {
        this.ruleForm = res.data
        this.coupon_type = res.data.coupon_type
        this.lineData = res.data.express_lines
        // this.ruleForm.trigger_condition = res.data.trigger_condition
        //   ? res.data.trigger_condition
        //   : 1
      })
    },
    chooseLine() {
      dialog({ type: 'lineChoose' }, data => {
        this.lineName = data
        this.ruleForm.express_line_ids = data.map(item => item.id)
      })
    }
  }
}
</script>

<style lang="scss">
.ordinary-detail {
  background-color: #fff !important;
  .choose-btn {
    margin-bottom: 20px;
    margin-left: 60px;
    .el-button {
      vertical-align: top;
    }
  }
  .display-line {
    display: inline-block;
    padding: 5px 10px;
    width: 245px;
    background-color: #ccc;
    p {
      margin: 5px;
    }
  }
}
</style>

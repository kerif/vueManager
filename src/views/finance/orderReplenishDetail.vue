<template>
  <div>
    <div class="receiverMSg">
      <h4>{{ $t('客户信息') }}</h4>
      <el-row class="container-center" :gutter="20">
        <el-col :span="11">
          <span class="leftWidth">{{ $t('客户ID') }}</span>
          <span>{{ form.user && form.user.id }}</span>
        </el-col>
        <el-col :span="8" :offset="1">
          <span class="leftWidth">{{ $t('客户昵称') }}</span>
          <span>{{ form.user && form.user.name }}</span>
        </el-col>
      </el-row>
      <el-row class="container-center" :gutter="20">
        <el-col :span="11">
          <span class="leftWidth">{{ $t('流水号') }}</span>
          <span>{{ form.sn }}</span>
        </el-col>
        <el-col :span="8" :offset="1">
          <span class="leftWidth">{{ $t('提交时间') }}</span>
          <span>{{ form.created_at }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="pay-message receiverMSg">
      <h4>{{ $t('支付信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{ $t('支付方式') }}</p>
          <span>{{ form.payment_type_name }}</span
          ><br />
          <p class="transfer-right">{{ $t('费用类型') }}</p>
          <span>{{ form.type_name }}</span>
          <br />
          <p class="transfer-right">{{ $t('应付金额') + this.localization.currency_unit }}</p>
          <span>{{ form.amount }}</span
          ><br />
          <p class="transfer-right">{{ $t('支付金额') + this.localization.currency_unit }}</p>
          <span>{{ form.pay_amount }}</span>
          <br />
          <p class="transfer-right">{{ $t('关联单号') }}</p>
          <span>{{ form.order_sn }}</span
          ><br />
          <p class="transfer-right">{{ $t('外部交易号') }}</p>
          <span>{{ form.outer_sn }}</span
          ><br />
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.remark }}</span
          ><br />
        </el-col>
      </el-row>
    </div>
    <div>
      <el-button size="small" type="danger" @click="review('reject')">{{
        $t('审核拒绝')
      }}</el-button>
      <el-button size="small" type="primary" @click="review('pass')">{{
        $t('审核通过')
      }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      form: {},
      localization: {},
      currencyUnit: ''
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.replenishDetail(this.$route.params.id).then(res => {
        this.form = res.data
        this.localization = res.localization
        this.currencyUnit = res.localization.currency_unit
      })
    },
    review(status) {
      dialog({
        type: 'replenishMsg',
        id: this.$route.params.id,
        state: status,
        currencyUnit: this.currencyUnit
      })
    }
  }
}
</script>

<style lang="scss">
.receiverMSg {
  padding: 10px;
  background-color: #fff !important;
  margin-bottom: 20px;
}
.container-center {
  margin-bottom: 20px;
}
.transfer-right {
  display: inline-block;
  width: 120px;
}
.leftWidth {
  display: inline-block;
  width: 120px;
}
</style>

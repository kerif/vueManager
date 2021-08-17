<template>
  <div class="growth-finance-details">
    <div class="content">
      <h4>
        {{ $t('客户信息') }}
        <div class="status" v-if="growthDetails.status === 0">{{ $t('待审核') }}</div>
        <div class="status pass" v-if="growthDetails.status === 1">{{ $t('审核通过') }}</div>
        <div class="status" v-if="growthDetails.status === 2">{{ $t('审核拒绝') }}</div>
      </h4>
      <div class="user">
        <div>{{ $t('客户ID') }}：{{ growthDetails.user_id }}</div>
        <div>{{ $t('流水号') }}：{{ growthDetails.serial_no }}</div>
        <div>{{ $t('提交时间') }}：{{ growthDetails.created_at }}</div>
      </div>
    </div>
    <div class="content">
      <h4>{{ $t('支付信息') }}</h4>
      <div class="user">
        <div>{{ $t('支付方式') }}：{{ growthDetails.payment_type_name }}</div>
        <div>{{ $t('转账账号') }}：{{ growthDetails.transfer_account }}</div>
        <div>
          {{ $t('转账金额') }}：{{ localization.currency_unit }} {{ growthDetails.tran_amount }}
        </div>
        <div>{{ $t('关联单号') }}：{{ growthDetails.order_number }}</div>
        <div>{{ $t('客服备注') }}：{{ growthDetails.customer_remark }}</div>
        <div>
          {{ $t('客服图片') }}：
          <img
            class="image"
            :src="$baseUrl.IMAGE_URL + growthDetails.images"
            @click="checkImg(growthDetails.images)"
          />
        </div>
        <div>{{ $t('创建时间') }}：{{ growthDetails.created_at }}</div>
      </div>
    </div>
    <div class="content">
      <h4>{{ $t('审核通过信息') }}</h4>
      <div class="user">
        <div>{{ $t('审核人员') }}：{{ growthDetails.operator }}</div>
        <div>{{ $t('备注') }}：{{ growthDetails.remark }}</div>
        <div>
          {{ $t('图片') }}：
          <img
            class="image"
            :src="$baseUrl.IMAGE_URL + growthDetails.customer_images"
            @click="checkImg(growthDetails.customer_images)"
          />
        </div>
      </div>
    </div>
    <div v-if="growthDetails.status === 0">
      <el-button size="small" type="primary" @click="updateStatus('pass')">{{
        $t('审核通过')
      }}</el-button>
      <el-button size="small" type="danger" @click="updateStatus('reject')">{{
        $t('审核拒绝')
      }}</el-button>
    </div>
    <!-- 查看图片 -->
    <el-dialog :visible.sync="imgDialog">
      <div style="text-align: center">
        <img :src="imgUrl" style="max-width: 100%" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      growthDetails: {},
      localization: {},
      currencyUnit: '',
      imgDialog: false,
      imgUrl: ''
    }
  },
  created() {
    this.getGrowthFinanceDetails()
  },
  methods: {
    checkImg(url) {
      this.imgDialog = true
      this.imgUrl = this.$baseUrl.IMAGE_URL + url
    },
    getGrowthFinanceDetails() {
      this.$request.getGrowthFinanceDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.growthDetails = res.data
          this.localization = res.localization
          this.currencyUnit = res.localization.currency_unit
        }
      })
    },
    async updateStatus(status) {
      dialog(
        {
          type: 'growthFinance',
          id: this.$route.params.id,
          state: status,
          tranAmount: this.growthDetails.tran_amount,
          currencyUnit: this.currencyUnit
        },
        () => {
          this.getGrowthFinanceDetails()
        }
      )
      // let res = {}
      // if (status === 'pass') {
      //   res = await this.$request.approvedGrowthValue(this.$route.params.id)
      // } else {
      //   res = await this.$request.refusedGrowthValue(this.$route.params.id)
      // }
      // if (res.ret) {
      //   this.$notify({
      //     title: this.$t('操作成功'),
      //     message: res.msg,
      //     type: 'success'
      //   })
      //   this.$router.go(-1)
      // } else {
      //   this.$notify({
      //     title: this.$t('操作失败'),
      //     message: res.msg,
      //     type: 'warning'
      //   })
      // }
    }
  }
}
</script>
<style scoped lang="scss">
.growth-finance-details {
  h4 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .image {
    max-width: 100px;
    cursor: pointer;
    text-align: center;
  }
  .status {
    color: red;
    font-weight: bold;
  }
  .pass {
    color: #3540a5 !important;
  }
  .content {
    margin-bottom: 20px;
    padding: 0 20px 20px 20px;
    overflow: hidden;
    background-color: #fff;
  }
  .user {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr;
  }
}
</style>

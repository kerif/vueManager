<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('分货详细')"
    class="distribution-dialog"
    style="width: 100%"
    @close="clear"
  >
    <div class="distribution">
      <div class="distribution-left">
        <div>
          <div class="box-item">
            <div class="num">#1</div>
            <div>{{ $t('装箱清单') }}</div>
          </div>
          <div
            class="box-wrap"
            style="border: 2px solid #eee; border-radius: 5px"
            v-for="item in packageData"
            :key="item.id"
          >
            <div>{{ item.name }}</div>
            <div style="margin-top: 15px">x{{ item.qty }}</div>
          </div>
        </div>
      </div>
      <div class="distribution-right">
        <div class="info-item">
          <div class="font">{{ $t('打包单号') }}</div>
          <div>{{ row.order_sn }}</div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('客户ID') }}</div>
          <div>{{ row.user_id }}</div>
        </div>
        <div style="margin-bottom: 20px">
          <div class="font">{{ $t('收货地址') }}</div>
          <div class="border-item">
            <span>{{ row.address && row.address.receiver_name }}</span
            >&nbsp;
            <span>{{ row.address && row.address.timezone }}</span>
            <span v-if="row.address && row.address.timezone">-</span>
            <span>{{ row.address && row.address.phone }}</span
            >&nbsp; <span>{{ row.address && row.address.country_name }}</span
            >&nbsp; <span>{{ row.address && row.address.postcode }}</span
            >&nbsp; <span>{{ row.address && row.address.city }}</span
            >&nbsp; <span>{{ row.address && row.address.street }}</span
            >&nbsp;
            <span>{{ row.address && row.address.door_no }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('下单渠道') }}</div>
          <div>{{ row.express_line && row.express_line.name }}</div>
        </div>
        <div>
          <div>
            <div class="font">{{ $t('增值服务') }}</div>
            <div class="border-item"></div>
          </div>
        </div>
        <div>
          <div style="font-weight: bold">{{ $t('付款方式') }}</div>
          <div class="border-item">
            <span class="payment-sty" v-if="row.payment_mode === 2">{{ $t('货到付款') }}</span>
            <span v-else>{{ $t('预付') }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      row: {},
      servicesData: [],
      packageData: []
    }
  },
  methods: {
    init() {
      if (this.row.id) {
        this.getGoodsDetail()
      }
      this.getService()
    },
    getService() {
      this.$request.servicesPackage().then(res => {
        if (res.ret) {
          this.servicesData = res.data
        }
      })
    },
    getGoodsDetail() {
      this.$request.packageDetails(this.row.id).then(res => {
        this.packageData = res.data
      })
    },
    clear() {}
  }
}
</script>

<style lang="scss">
.distribution-dialog {
  .font {
    font-weight: bold;
  }
  .border-item {
    width: 420px;
    border: 2px solid #eee;
    padding: 10px;
    margin: 10px 0 0 60px;
    border-radius: 6px;
  }
  .distribution {
    display: flex;
    .distribution-left {
      width: 240px;
      padding: 0 10px;
      .box-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        .num {
          font-weight: bold;
          font-size: 24px;
        }
      }
      .box-wrap {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 10px;
      }
    }
    .distribution-right {
      width: 500px;
      padding: 10px;
      border-left: 2px solid #eee;
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    }
  }
}
</style>

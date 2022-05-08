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
        <div class="box">
          <div class="box-top">
            <div style="font-weight: bold">#1</div>
            <div style="font-weight: bold">{{ $t('装箱清单') }}</div>
          </div>
          <div class="box-top">
            <div style="font-weight: bold">{{ $t('商品名称') }}</div>
            <div>{{ row.qty }}</div>
          </div>
        </div>
      </div>
      <div class="distribution-right">
        <div class="info-item">
          <div style="font-weight: bold">{{ $t('打包单号') }}</div>
          <div>{{ row.order_sn }}</div>
        </div>
        <div class="info-item">
          <div style="font-weight: bold">{{ $t('客户ID') }}</div>
          <div>{{ row.user_id }}</div>
        </div>
        <div>
          <div style="font-weight: bold">{{ $t('收货地址') }}</div>
          <div style="border: 1px solid #eee; padding: 10px; margin: 10px; border-radius: 6px">
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
          <div style="font-weight: bold">{{ $t('下单渠道') }}</div>
          <div>{{ row.express_line && row.express_line.name }}</div>
        </div>
        <div class="info-item">
          <div>
            <div style="font-weight: bold">{{ $t('增值服务') }}</div>
            <div style="border: 1px solid #eee; padding: 10px; margin: 10px; border-radius: 6px">
              <div class="box">
                <div class="box-top">
                  <div>{{ $t('增值服务') }}</div>
                  <div>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <div style="font-weight: bold">{{ $t('付款方式') }}</div>
          <br />
          <div style="border: 1px solid #eee; padding: 10px; margin: 10px; border-radius: 6px">
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
      servicesData: []
    }
  },
  methods: {
    getService() {
      this.$request.servicesPackage().then(res => {
        if (res.ret) {
          this.servicesData = res.data
        }
      })
    },
    clear() {}
  }
}
</script>

<style lang="scss">
.distribution-dialog {
  .distribution {
    display: flex;
    .distribution-left {
      .box {
        width: 200px;
        padding: 10px;
        border: 1px solid #eee;
        border-radius: 5px;
        margin-right: 10px;
        .box-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }
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

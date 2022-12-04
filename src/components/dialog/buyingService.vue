<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'sms' ? $t('购买短信服务') : $t('购买物流查询服务')"
    class="buying-container"
    @close="clear"
  >
    <p v-if="state === 'sms'">{{ $t('选择中国大陆短信套餐') }}：</p>
    <p v-else>{{ $t('51Tracking查询套餐') }}：</p>
    <div>
      <el-row>
        <el-col
          :span="5"
          class="set-meal"
          v-for="item in chinaData"
          :key="item.id"
          @click.native="chooseService(item)"
          :offset="1"
          :class="station.id === item.id ? 'selected' : ''"
        >
          <el-badge :value="item.price > 0 ? `RMB${item.price / item.count}/次` : ''" class="item">
            <span>{{ item.name }}</span
            ><br />
            <span>RMB{{ item.price }}/{{ item.count }}{{ $t('次') }}</span>
          </el-badge>
          <i class="el-icon-check icon-check" v-show="station.id === item.id"></i>
        </el-col>
      </el-row>
    </div>
    <div class="count-sty">
      {{ $t('购买数量') }}
      <el-input-number
        class="add-counts"
        v-model="onceNum"
        @change="handleChange('china')"
        :min="1"
        :max="100"
      ></el-input-number>
      <span>{{ $t('套餐金额') }}：RMB{{ packageAmount }}</span>
    </div>
    <div class="line"></div>
    <p v-if="state === 'sms'">{{ $t('选择国际短信套餐') }}：</p>
    <p v-else>{{ $t('快递100查询套餐') }}：</p>
    <div>
      <el-row>
        <el-col
          :span="5"
          class="set-meal"
          v-for="item in internationalData"
          :key="item.id"
          :offset="1"
          :class="secondData.id === item.id ? 'selected' : ''"
          @click.native="secondService(item)"
        >
          <el-badge :value="item.price > 0 ? `RMB${item.price / item.count}/次` : ''" class="item">
            <span>{{ item.name }}</span
            ><br />
            <span>RMB{{ item.price }}/{{ item.count }}{{ $t('次') }}</span>
          </el-badge>
          <i class="el-icon-check icon-check" v-show="secondData.id === item.id"></i>
        </el-col>
      </el-row>
    </div>
    <div style="color: red" v-if="state === 'sms'">
      {{ $t('注:国际短信发送以服务商实际扣除次数为准，不同国家间计费存在差额') }}
    </div>
    <div style="color: red" v-else>
      {{ $t('注:国际物流查询以服务商实际扣除次数为准，不同国家间计费存在差额') }}
    </div>
    <div class="count-sty">
      {{ $t('购买数量') }}
      <el-input-number
        class="add-counts"
        v-model="secondNum"
        @change="handleChange('international')"
        :min="1"
        :max="100"
      ></el-input-number>
      <span>{{ $t('套餐金额') }}：RMB{{ secondAmount }}</span>
    </div>
    <div class="line"></div>
    <div class="bottom-main" v-if="packageAmount > 0 || secondAmount > 0">
      <div class="payment-sty">
        <span>{{ $t('应付金额') }}：</span>
        <span class="fee-sty">RMB{{ packageAmount + secondAmount }}</span>
      </div>
      <div>
        <el-button class="btn-light-green" @click="getPay('wechat')">{{
          $t('微信支付')
        }}</el-button>
        <el-button class="btn-light-green" @click="getPay('alipay')">{{
          $t('支付宝支付')
        }}</el-button>
      </div>
    </div>
    <div>
      <img :src="qrCode" class="qr-code" />
    </div>
    <div slot="footer" v-if="qrCode">
      <!-- <el-button @click="show = false">{{$t('取消')}}</el-button> -->
      <el-button type="primary" @click="confirmPay">{{ $t('我已支付') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      num: '',
      state: '',
      chinaData: [],
      internationalData: [],
      localization: {},
      onceNum: '',
      secondNum: '',
      station: {},
      secondData: {},
      packageAmount: '',
      secondAmount: '',
      qrCode: ''
    }
  },
  methods: {
    // 获取数据
    getService() {
      let type = this.state === 'sms' ? 'sms' : 'tracking'
      this.$request.serviceType(type).then(res => {
        if (res.ret) {
          this.chinaData = type === 'sms' ? res.data.china : res.data['51tracking']
          this.chinaData.unshift({ id: 0, name: '无需', price: 0, count: 0 })
          console.log(this.chinaData, 'this.chinaData')
          this.internationalData = type === 'sms' ? res.data.international : res.data.kd100
          this.internationalData.unshift({ id: 0, name: '无需', price: 0, count: 0 })
          this.localization = res.localization
        }
      })
    },
    // 选中中国大陆短信套餐
    chooseService(item) {
      this.onceNum = 1
      this.station = item
      this.packageAmount = item.price
    },
    // 选中国际短信套装
    secondService(item) {
      this.secondNum = 1
      this.secondData = item
      this.secondAmount = item.price
    },
    // 我已支付
    confirmPay() {
      this.show = false
      this.success()
    },
    // 切换套餐
    handleChange(value) {
      if (value === 'china') {
        this.packageAmount =
          this.onceNum > 1 ? this.station.price * this.onceNum : this.station.price
      } else {
        this.secondAmount =
          this.secondNum > 1 ? this.secondData.price * this.secondNum : this.secondData.price
      }
    },
    // 获取支付二维码
    getPay(status) {
      let domestic = [
        { id: this.station.id, qty: this.station.id ? this.onceNum : '' },
        {
          id: this.secondData.id,
          qty: this.secondData.id ? this.secondNum : ''
        }
      ]
      // let foreign = [{ id: this.secondData.id, qty: this.secondNum }]
      console.log(domestic, 'arrOne')
      this.$request
        .productsImg(this.state, {
          payment_method: status,
          products: domestic
        })
        .then(res => {
          if (res.ret) {
            this.qrCode = res.data.qr_code
            console.log(res.data, 'data')
          }
        })
    },
    clear() {
      this.chinaData = []
      this.internationalData = []
      this.station = {}
      this.secondData = {}
      this.packageAmount = ''
      this.secondAmount = ''
      this.qrCode = ''
      this.onceNum = ''
      this.secondNum = ''
    },
    init() {
      this.getService()
    }
  }
}
</script>
<style lang="scss" scope>
.buying-container {
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
  .created-btn {
    margin-left: 5px;
  }
  .content-long {
    .el-scrollbar {
      width: 200px !important;
    }
  }
  .set-meal {
    cursor: pointer;
    background-color: #e8eef4;
    padding: 10px;
    margin-bottom: 10px;
  }
  .count-sty {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .line {
    border-top: 1px dashed #ccc;
  }
  .add-counts {
    margin-left: 10px;
    margin-right: 30px;
  }
  .bottom-main {
    margin-top: 20px;
    padding-left: 10px;
    .payment-sty {
      font-size: 16px;
      margin-bottom: 15px;
    }
    .fee-sty {
      font-size: 22px;
      color: red;
    }
  }
  .selected {
    color: #b05529;
    border-color: #b05529;
    position: relative;
  }
  .icon-check {
    color: #b05529;
    position: absolute;
    font-size: 28px;
    bottom: 0;
    right: -10px;
  }
  .qr-code {
    width: 200px;
  }
}
.el-select-dropdown__item.hover {
  width: auto;
}
.el-select-dropdown__item {
  width: 180px;
  white-space: nowrap; /*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis;
}
</style>

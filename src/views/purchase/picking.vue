<template>
  <div class="picking-container">
    <div class="content-box">
      <el-row>
        <el-col :span="14">
          <div class="row-item">
            <el-input
              v-model="sn"
              :placeholder="$t('请输入或扫码拣货单号,按Enter键结束')"
              class="ipt"
              @keyup.native.enter="onOrderSn"
            />
          </div>
          <div class="row-item">
            <el-input
              :placeholder="$t('请输入或扫码条码')"
              class="ipt"
              v-model="barcode"
              ref="barcode"
              @keyup.native.enter="onSku"
            />
            <el-button type="primary" size="small" class="confirm-btn" @click="onSku">{{
              $t('确认')
            }}</el-button>
          </div>
          <div class="font-bold scan-tips">{{ $t('请扫描拣货单号及条码') }}</div>
        </el-col>
        <el-col :span="10">
          <div class="right-item">{{ $t('拣货单号') }}：{{ sn }}</div>
          <div class="flex-item right-item num-list">
            <span>
              <span>{{ $t('已扫描') }}：</span>
              <span class="font-bold num">{{ scanNum }}</span>
            </span>
            <span>
              <span>{{ $t('未扫描') }}：</span>
              <span class="font-bold num">{{ waitScanNum }}</span>
            </span>
            <span>
              <span>{{ $t('箱号') }}：</span>
              <span class="font-bold num">{{ orderList.length }}</span>
            </span>
          </div>
          <div>
            <div class="flex-item color-item">
              <div class="color-tip color-green"></div>
              <div>{{ $t('绿色为出库数量下单数量') }}</div>
            </div>
            <div class="flex-item color-item">
              <div class="color-tip color-orange"></div>
              <div>{{ $t('黄色为出库数量下单数量') }}</div>
            </div>
            <div class="flex-item color-item">
              <div class="color-tip"></div>
              <div>{{ $t('白色为出库数量下单数量') }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="order-list">
        <div class="order-item flex-item" v-for="(item, index) in orderList" :key="index">
          <div class="index">
            <div>{{ $t('订单号') }}：{{ item.sn }}</div>
            <div class="font-bold index-label">#{{ index + 1 }}</div>
          </div>
          <div class="order-content flex-1">
            <el-row :gutter="30">
              <el-row class="sku-row">
                <el-col :span="4" :offset="1">{{ $t('图片') }}</el-col>
                <el-col :span="4">{{ $t('商品ID') }}</el-col>
                <el-col :span="4">{{ $t('品名') }}</el-col>
                <el-col :span="4">{{ $t('条码') }}</el-col>
                <el-col :span="4" class="align-center">{{ $t('分货') }}</el-col>
                <el-col :span="3" class="align-center">{{ $t('拣货') }}</el-col>
              </el-row>
            </el-row>
            <el-row :gutter="30">
              <el-row class="sku-row" v-for="ele in item.goods" :key="ele.id">
                <el-col :span="4" :offset="1">
                  <span v-if="ele.p_goods">
                    <img
                      class="img"
                      :src="`${$baseUrl.IMAGE_URL}${ele.p_goods.image}`"
                      @click="onPic(ele.p_goods.image)"
                    />
                  </span>
                </el-col>
                <el-col :span="4">
                  <span class="sku-item">{{ item.sn }}</span>
                </el-col>
                <el-col :span="4">
                  <span class="sku-item">{{ ele.p_goods ? ele.p_goods.cn_name : '' }}</span>
                </el-col>
                <el-col :span="4">{{ ele.p_goods ? ele.p_goods.barcode : '' }}</el-col>
                <el-col :span="4" class="align-center font-bold num-item">{{
                  ele.quantity
                }}</el-col>
                <el-col :span="3" class="align-center"
                  ><el-input
                    class="out-num"
                    size="small"
                    type="number"
                    v-model="ele.picking_quantity"
                  ></el-input
                ></el-col>
              </el-row>
            </el-row>
          </div>
        </div>
      </div>
      <div class="align-right" v-if="orderList.length">
        <el-button @click="onSave(0)">{{ $t('保存') }}</el-button>
        <el-button
          class="save-btn"
          type="primary"
          @click="onSave(1)"
          :loading="$store.state.btnLoading"
          >{{ $t('拣货完成') }}</el-button
        >
      </div>
    </div>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      barcode: '',
      sn: '',
      orderId: '',
      orderList: [],
      imgVisible: false,
      imgSrc: ''
    }
  },
  created() {
    if (this.$route.query.sn) {
      this.sn = this.$route.query.sn
      this.onOrderSn()
    }
  },
  methods: {
    onOrderSn() {
      if (this.sn) {
        this.$request.purchasePickSearch(this.sn).then(res => {
          if (!res.data) {
            this.$message.error(this.$t('拣货单不存在'))
          }
          this.orderId = res.data ? res.data.id : ''
          this.orderList = res.data ? res.data.orders : []
        })
      }
    },
    onSku() {
      if (this.barcode) {
        this.$refs.barcode.select()
        this.orderList.forEach(item => {
          let flag = true
          item.goods.forEach(ele => {
            if (ele.p_goods) {
              if (
                ele.p_goods.barcode === this.barcode &&
                ele.picking_quantity < ele.quantity &&
                flag
              ) {
                ele.picking_quantity++
                flag = false
                // if ((ele.picking_quantity = ele.quantity)) return
              } else if (ele.picking_quantity > ele.quantity) {
                this.$message.error(this.$t('拣货数量不能大于分货数量'))
                ele.picking_quantity = ele.quantity
              }
            }
          })
        })
      }
    },
    onPic(url) {
      this.imgVisible = true
      this.imgSrc = this.$baseUrl.IMAGE_URL + url
    },
    onSave(type) {
      let params = {
        is_picking_finish: type,
        goods: []
      }
      this.orderList.forEach(item => {
        if (item.goods) {
          item.goods.forEach(ele => {
            params.goods.push({
              picking_quantity: ele.picking_quantity,
              picking_divide_order_id: ele.picking_divide_order_id,
              purchase_order_goods_id: ele.purchase_order_goods_id
            })
          })
          return params.goods
        }
      })
      this.$request.purchasePick(this.orderId, params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          if (type === 0) {
            this.$router.push({
              name: 'transshipmentBill',
              query: { activeName: '1' }
            })
          } else {
            this.$router.push({
              name: 'transshipmentBill',
              query: { activeName: '2' }
            })
          }
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  },
  computed: {
    scanNum() {
      let qty = 0
      this.orderList.forEach(item => {
        item.goods.forEach(ele => {
          qty += Number(ele.picking_quantity)
        })
      })
      return qty
    },
    waitScanNum() {
      let qty = 0
      this.orderList.forEach(item => {
        item.goods.forEach(ele => {
          qty += ele.quantity - ele.picking_quantity
        })
      })
      return qty
    }
  }
}
</script>
<style lang="scss">
.picking-container {
  font-size: 14px;
  background: #fff !important;
  min-height: calc(100vh - 150px);
  .content-box {
    padding: 20px;
  }
  .confirm-btn {
    margin-left: 10px;
    min-width: 100px;
  }
  .row-item {
    margin-bottom: 15px;
  }
  .save-btn {
    margin-top: 20px;
    min-width: 120px;
  }
  .ipt {
    width: 300px;
  }
  .scan-tips {
    color: #f00;
    margin-top: 30px;
    font-size: 20px;
  }
  .num-list {
    justify-content: space-between;
  }
  .num {
    font-size: 30px;
  }
  .flex-1 {
    flex: 1;
  }
  .font-bold {
    font-weight: 700;
  }
  .flex-item {
    display: flex;
    align-items: center;
  }
  .align-right {
    text-align: right;
  }
  .order-list {
    max-height: 500px;
    overflow: auto;
  }
  .right-item {
    margin-bottom: 30px;
  }
  .color-item {
    &:not(:first-child) {
      margin-top: 10px;
    }
  }
  .color-tip {
    width: 28px;
    height: 28px;
    border: 1px solid #333;
    box-sizing: border-box;
    border-radius: 50%;
    margin-right: 15px;
    &.color-green {
      background-color: #3da969;
    }
    &.color-orange {
      background-color: #ff9933;
    }
  }
  .order-item {
    border: 1px solid #efefef;
    margin-top: 20px;
    align-items: stretch;
  }
  .index {
    padding: 20px 20px;
    border-right: 1px solid #efefef;
    position: relative;
  }
  .index-label {
    font-size: 40px;
    margin-top: 20px;
    text-align: center;
  }
  .order-content {
    padding: 20px;
  }
  .order-num {
    margin-right: 50px;
  }
  .sku-row {
    margin-top: 15px;
  }
  .num-item {
    font-size: 26px;
    line-height: 32px;
  }
  .align-center {
    text-align: center;
  }
  .img {
    width: 20%;
    cursor: pointer;
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .out-num {
    font-size: 20px;
    .el-input__inner {
      text-align: center;
      font-weight: bold;
    }
    &.empty {
      .el-input__inner {
        color: #f00;
      }
    }
  }
  .sku-item {
    height: 30px;
    line-height: 30px;
    display: inline-block;
    padding: 0 25px;
    border: 1px solid #efefef;
    &.all {
      border-color: #efefef;
      background-color: #efefef;
      color: #fff;
    }
    &.wait {
      border-color: #ff9933;
      background-color: #ff9933;
    }
  }
}
</style>

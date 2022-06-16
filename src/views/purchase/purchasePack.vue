<template>
  <div class="pack-container">
    <div class="content-box">
      <div class="flex-item search-box">
        <el-input
          :placeholder="$t('请输入或扫入拣货单号')"
          class="search-ipt flex-1"
          v-model="pickingSN"
          @keyup.native.enter="getCloudDetail"
        ></el-input>
        <el-button type="primary" @click="getCloudDetail">{{ $t('查询') }}</el-button>
      </div>
      <div class="has-border order-box remark" v-if="pickingSN">
        <el-row :gutter="10">
          <el-col :span="5">
            <div class="font-bold">{{ name }}</div>
          </el-col>
          <el-col :span="19">
            <div>{{ remark }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="has-border">
        <el-row class="order-box" type="flex" v-show="orderList.length">
          <el-col :span="5">
            <div class="font-bold left-title">{{ $t('请选择订单号') }}</div>
            <div class="order-list">
              <div
                class="order-item flex-item cursor-pointer"
                v-for="item in orderList"
                :key="item.id"
                @click="onOrder(item)"
              >
                <span class="font-bold">#{{ item.sn }}</span>
                <span>{{ $t('已打包') }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="19" class="right-box">
            <div class="top-box">
              <div class="right-item has-border">
                <div class="font-bold right-tile">{{ $t('打包详细') }}</div>
                <div class="detail-box">
                  <el-row class="row-item">
                    <el-col :span="8">
                      <span>{{ $t('订单号') }}：</span>
                      <span class="font-bold"></span>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('收货点') }}：</span>
                      <span class="font-bold"></span>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('客户编号') }}：</span>
                      <span class="font-bold"></span>
                    </el-col>
                  </el-row>
                  <el-row class="row-item">
                    <el-col :span="8">
                      <span>{{ $t('渠道') }}：</span>
                      <el-select v-model="value"></el-select>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('订单属性') }}：</span>
                      <el-select v-model="prop">
                        <el-option
                          v-for="item in propList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="right-item has-border">
                <div class="weight-content">
                  <div class="flex-item title-list">
                    <div class="font-bold">{{ $t('装箱') }}</div>
                    <el-button type="primary" @click="onAddBox">{{ $t('添加箱子') }}</el-button>
                  </div>
                  <div class="weight-box">
                    <el-row :gutter="10">
                      <el-col :offset="1" :span="4">
                        <div>
                          <span class="red-text">*</span>
                          <span>{{ $t('重量') }}</span>
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div>{{ $t('尺寸') }}</div>
                      </el-col>
                    </el-row>
                    <el-row
                      :gutter="10"
                      class="weight-row"
                      v-for="(item, index) in boxList"
                      :key="index"
                    >
                      <el-col :span="1">
                        <div class="index-label font-bold">#{{ index + 1 }}</div>
                      </el-col>
                      <el-col :span="4">
                        <el-input
                          :placeholder="$t('重量')"
                          size="large"
                          class="weight-ipt"
                          v-model="item.weight"
                        />
                      </el-col>
                      <el-col :span="4">
                        <el-input
                          size="large"
                          :placeholder="$t('长')"
                          class="weight-ipt"
                          v-model="item.length"
                        />
                      </el-col>
                      <el-col :span="4">
                        <el-input
                          size="large"
                          :placeholder="$t('宽')"
                          class="weight-ipt"
                          v-model="item.width"
                        />
                      </el-col>
                      <el-col :span="4">
                        <el-input
                          size="large"
                          :placeholder="$t('高')"
                          class="weight-ipt"
                          v-model="item.height"
                        />
                      </el-col>
                      <el-col :span="3">
                        <div class="item-weight">
                          <span class="btn-red" v-if="index > 0" @click="onDelBox(index)">
                            {{ $t('移除') }}</span
                          >
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div
                    style="
                      padding: 20px;
                      margin-top: 10px;
                      border: 1px solid #000;
                      border-radius: 5px;
                    "
                  >
                    <el-row :gutter="10">
                      <el-col :span="3"><div>状态</div></el-col>
                      <el-col :span="3"><div>图片</div></el-col>
                      <el-col :span="4"><div>条码</div></el-col>
                      <el-col :span="3"><div>名称</div></el-col>
                      <el-col :span="3"><div>颜色</div></el-col>
                      <el-col :span="3"><div>总数</div></el-col>
                      <el-col :span="5"><div>已装箱</div></el-col>
                    </el-row>
                    <el-row
                      :gutter="10"
                      style="margin: 20px 0"
                      v-for="(item, index) in skuList"
                      :key="index"
                    >
                      <el-col :span="3"><div>未装箱</div></el-col>
                      <el-col :span="3"
                        ><span v-if="item.p_goods"
                          ><img :src="`${$baseUrl.IMAGE_URL}${item.p_goods.image}`" /> </span
                      ></el-col>
                      <el-col :span="4"
                        ><div>{{ item.p_goods ? item.p_goods.barcode : '' }}</div></el-col
                      >
                      <el-col :span="3"
                        ><div>{{ item.p_goods ? item.p_goods.cn_name : '' }}</div></el-col
                      >
                      <el-col :span="3"><div>蓝色</div></el-col>
                      <el-col :span="3"
                        ><div>{{ item.p_goods ? item.p_goods.quantity : '' }}</div></el-col
                      >
                      <el-col :span="5">
                        <div
                          style="display: flex; align-items: center"
                          v-for="(item, index) in packData"
                          :key="index"
                        >
                          <span>#{{ index + 1 }}</span>
                          <el-input
                            type="number"
                            v-model="item.pack_quantity"
                            style="margin: 3px 0 0 10px"
                          ></el-input></div
                      ></el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom-box flex-item">
              <div>
                <el-button>{{ $t('保存') }}</el-button>
                <el-button
                  type="primary"
                  class="calc-btn"
                  :loading="$store.state.btnLoading"
                  @click="onPack"
                  >{{ $t('打包完成') }}</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      pickingSN: '',
      orderList: [],
      name: '',
      remark: '',
      boxList: [],
      propList: [],
      prop: '',
      skuList: [],
      packData: []
    }
  },
  created() {
    this.getPropList()
    this.orderAddValues()
  },
  methods: {
    getCloudDetail() {
      if (!this.pickingSN) return
      this.tableLoading = true
      // this.$request
      //   .purchasePickSearch(this.pickingSN)
      //   .then(res => {
      //     if (res.data) {
      //       this.orderList = res.data.orders
      //       this.name = res.data.name
      //       this.remark = res.data.remark
      //       res.data.orders.forEach(item => {
      //         item.goods.forEach(ele => {
      //           this.skuList.push({
      //             p_goods: ele.p_goods,
      //             purchase_order_goods_id: ele.purchase_order_goods_id
      //           })
      //         })
      //       })
      //       console.log(this.skuList)
      //     } else {
      //       this.$message.error(this.$t('拣货单号不存在'))
      //     }
      //   })
      //   .finally(() => {
      //     this.tableLoading = false
      //   })
    },
    getPropList() {
      this.$request.getProps().then(res => {
        this.propList = res.data
      })
    },
    orderAddValues() {},
    getLines() {},
    getLineService() {},
    onSku() {},
    onAddBox() {
      console.log(this.boxList, 1111)
      this.boxList.push({ weight: '', length: '', height: '', width: '' })
      for (let i = 0; i <= this.boxList.length; i++) {
        this.packData.push({
          pack_quantity: ''
        })
      }
      console.log(this.boxList)
      console.log(this.packData)
    },
    onDelBox(index) {
      this.boxList.splice(index, 1)
      this.packData.splice(index, 1)
    },
    onOrder(item) {
      console.log(item)
    },
    getOrderDetail() {},
    onReviewType() {},
    onPack() {}
  },
  computed: {},
  components: {}
}
</script>
<style lang="scss">
.pack-container {
  font-size: 14px;
  .content-box {
    padding: 20px;
  }
  .search-box {
    padding: 20px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
  }
  .search-ipt {
    margin-right: 15px;
  }
  .title-list {
    justify-content: space-between;
  }
  .add-btn-container {
    line-height: 30px;
    height: 30px;
    padding: 0 40px;
  }
  .order-item {
    justify-content: space-between;
    margin-top: 26px;
    &.selected {
      color: blue;
    }
  }
  .order-list {
    padding: 0 30px 20px 30px;
  }
  .detail-box {
    padding: 20px;
  }
  .row-item {
    margin-bottom: 20px;
  }
  .remark {
    padding: 15px;
    margin-bottom: 10px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .red-text {
    color: #f00;
  }
  .primary-text {
    color: blue;
  }
  .img-goods {
    width: 80px;
  }
  .right-box {
    border-left: 1px solid #eff1f2;
  }
  .top-box {
    background-color: #fbfbfc;
    padding: 12px 15px;
  }
  .left-title {
    padding: 16px 18px;
    border-bottom: 1px solid #eff1f2;
  }
  .right-item {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .right-tile {
    line-height: 48px;
    border-bottom: 1px solid #e8e9eb;
    padding: 0 20px;
  }
  .weight-content {
    padding: 20px;
  }
  .weight-box {
    background-color: #f9f9f9;
    padding: 10px;
    margin: 20px 0;
  }
  .index-label {
    font-size: 24px;
    line-height: 40px;
  }
  .item-weight {
    line-height: 40px;
  }
  .weight-ipt {
    font-size: 20px;
    .el-input__inner {
      font-weight: bold;
    }
  }
  .weight-row {
    margin-top: 10px;
  }
  .total-content {
    padding: 40px;
  }
  .total-size {
    font-size: 20px;
  }
  .label {
    align-self: flex-start;
  }
  .value-label,
  .label {
    min-width: 70px;
    margin-right: 10px;
  }
  .label-tips {
    font-size: 14px;
  }
  .radio-item {
    margin-bottom: 20px;
  }
  .value-ipt {
    max-width: 180px;
    .el-input-group__prepend {
      background-color: #fff;
      font-weight: bold;
    }
  }
  .bottom-box {
    text-align: right;
    padding: 20px;
    border-top: 1px solid #eff1f2;
  }
  .total-value {
    font-size: 48px;
  }
  .calc-btn {
    min-width: 90px;
    margin: 0 20px;
  }
  .check {
    margin-right: 10px;
  }
  .scan-box {
    padding: 20px;
    border: 3px solid #eee;
    margin-bottom: 10px;
  }
  .num-box {
    font-size: 60px;
  }
  .scan-num {
    color: #fa808c;
  }
  .scan-tips {
    color: #ff4154;
    background-color: #ffeff1;
    line-height: 40px;
    margin-top: 15px;
  }
  .font-bold {
    font-weight: 700;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-item {
    display: flex;
    align-items: center;
  }
  .order-box {
    background: #fff;
  }
  .has-border {
    border: 1px solid #eff1f2;
  }
  .btn-red {
    cursor: pointer;
    color: red;
  }
}
</style>

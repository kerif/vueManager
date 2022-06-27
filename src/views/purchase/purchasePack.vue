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
        <el-button type="primary" size="small" @click="getCloudDetail">{{ $t('查询') }}</el-button>
      </div>
      <div class="has-border order-box programmes" v-if="pickingSN">
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
                :class="{ selected: item.id === ids }"
                v-for="(item, index) in orderList"
                :key="item.id"
                @click="onOrder(item, index)"
              >
                <span class="font-bold">#{{ item.sn }}</span>
                <span>{{ item.status === 2 ? $t('待打包') : $t('已打包') }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="19" class="right-box">
            <div class="top-box" v-if="order.length">
              <div class="right-item has-border">
                <div class="font-bold right-tile">{{ $t('打包详细') }}</div>
                <div class="detail-box" v-for="item in order" :key="item.id">
                  <el-row class="row-item">
                    <el-col :span="8">
                      <span>{{ $t('订单号') }}：</span>
                      <span class="font-bold">{{ item.sn }}</span>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('收货点') }}：</span>
                      <el-select v-model="station_id" @change="getChannel">
                        <el-option
                          v-for="item in pickList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('客户编号') }}：</span>
                      <el-autocomplete
                        :fetch-suggestions="queryCNSearch"
                        :placeholder="$t('请输入客户ID')"
                        v-model="user_id"
                      >
                      </el-autocomplete>
                    </el-col>
                  </el-row>
                  <el-row class="row-item">
                    <el-col :span="8">
                      <span>{{ $t('渠道') }}：</span>
                      <el-select v-model="express_line_id">
                        <el-option
                          v-for="item in lineData"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('订单属性') }}：</span>
                      <el-select v-model="prop_ids">
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
                    <el-button type="primary" size="small" @click="onAddBox">{{
                      $t('添加箱子')
                    }}</el-button>
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
                        <div>
                          <span class="red-text">*</span>
                          <span>{{ $t('尺寸') }}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row
                      :gutter="10"
                      class="weight-row"
                      v-for="(item, index) in box"
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
                      padding: 20px 0px;
                      margin-top: 10px;
                      border: 1px solid #eff1f2;
                      border-radius: 5px;
                      text-align: center;
                    "
                  >
                    <el-row :gutter="10">
                      <el-col :span="3"
                        ><div>{{ $t('状态') }}</div></el-col
                      >
                      <el-col :span="4"
                        ><div>{{ $t('图片') }}</div></el-col
                      >
                      <el-col :span="4"
                        ><div>{{ $t('条码') }}</div></el-col
                      >
                      <el-col :span="3"
                        ><div>{{ $t('名称') }}</div></el-col
                      >
                      <el-col :span="3"
                        ><div>{{ $t('颜色') }}</div></el-col
                      >
                      <el-col :span="4"
                        ><div>{{ $t('总数') }}</div></el-col
                      >
                      <el-col :span="3"
                        ><div>{{ $t('已装箱') }}</div></el-col
                      >
                    </el-row>
                    <el-row
                      :gutter="10"
                      style="margin: 20px 0"
                      v-for="(item, index) in skuList"
                      :key="index"
                    >
                      <el-col :span="3"
                        ><div>{{ item.packData | getStatus(item.quantity) }}</div></el-col
                      >
                      <el-col :span="4"
                        ><span
                          ><img
                            style="width: 20%; cursor: pointer"
                            :src="`${$baseUrl.IMAGE_URL}${item.image}`"
                          /> </span
                      ></el-col>
                      <el-col :span="4"
                        ><div>{{ item.barcode }}</div></el-col
                      >
                      <el-col :span="3"
                        ><div>{{ item.cn_name }}</div></el-col
                      >
                      <el-col :span="3"
                        ><div>{{ item.color }}</div></el-col
                      >
                      <el-col :span="4"
                        ><div class="num-item">
                          {{ item.quantity }}
                        </div></el-col
                      >
                      <el-col :span="3">
                        <div class="flex-item" v-for="(ele, index) in item.packData" :key="index">
                          <span>#{{ index + 1 }}</span>
                          <el-input
                            type="number"
                            size="small"
                            v-model="ele.pack_quantity"
                            style="margin: 3px 0 0 10px"
                          ></el-input></div
                      ></el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom-box">
              <div v-if="order.length && status !== 3">
                <el-button @click="onPack(0)" size="small">{{ $t('保存') }}</el-button>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="isBtns"
                  class="calc-btn"
                  :loading="$store.state.btnLoading"
                  @click="onPack(1)"
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
import { Message } from 'element-ui'
export default {
  data() {
    return {
      express_line_id: '',
      lineData: '',
      pickingSN: '',
      order: [],
      orderList: [],
      name: '',
      remark: '',
      box: [
        {
          weight: '',
          length: '',
          height: '',
          width: ''
        }
      ],
      propList: [],
      prop_ids: [],
      skuList: [
        {
          packData: [
            {
              pack_quantity: ''
            }
          ]
        }
      ],
      ids: '',
      statusName: '',
      stationId: '',
      boxedSum: '',
      orderData: [],
      pack: [],
      num: '',
      status: '',
      idx: '',
      pickList: [],
      station_id: '',
      user_id: '',
      customList: []
    }
  },
  created() {
    this.getPropList()
    this.getLineType()
    this.getPackagePick()
    if (this.$route.query.sn) {
      this.pickingSN = this.$route.query.sn
      this.getCloudDetail()
    }
  },
  filters: {
    getStatus(pack_quantity, quantity) {
      if (pack_quantity) {
        let num = pack_quantity.reduce(function (acr, pcc) {
          if (!pcc.pack_quantity) {
            return acr
          }
          return acr + Number(pcc.pack_quantity)
        }, 0)
        if (num === 0) {
          return '未装箱'
        } else if (num === quantity) {
          return '已装箱'
        } else if (num < quantity) {
          return '部分装箱'
        } else if (num > quantity) {
          Message.error('装箱数量大于总数')
          return '装箱数量大于总数'
        }
      }
    }
  },
  methods: {
    getCloudDetail() {
      if (!this.pickingSN) return
      this.tableLoading = true
      this.$request
        .purchasePickSearch(this.pickingSN)
        .then(res => {
          if (res.data) {
            this.orderList = res.data.orders
            this.name = res.data.name
            this.remark = res.data.remark
            this.statusName = res.data.status_name
            this.box = [
              {
                weight: '',
                length: '',
                height: '',
                width: ''
              }
            ]
            this.skuList.forEach(item => {
              item.packData = [
                {
                  pack_quantity: ''
                }
              ]
            })
            this.order = []
          } else {
            this.$message.error(this.$t('拣货单号不存在'))
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    getPropList() {
      this.$request.getProps().then(res => {
        this.propList = res.data
      })
    },
    onAddBox() {
      this.skuList.forEach(item => {
        item.packData = []
      })
      for (let i = 0; i <= this.box.length; i++) {
        this.skuList.forEach(item => {
          item.packData.push({
            pack_quantity: ''
          })
        })
      }
      this.box.push({ weight: '', length: '', height: '', width: '' })
    },
    onDelBox(index) {
      this.box.splice(index, 1)
      this.skuList.forEach(item => {
        item.packData.splice(index, 1)
      })
    },
    onOrder(item, index) {
      console.log(item, index)
      this.idx = index
      this.status = item.status
      this.order = this.orderList.filter(ele => ele.id === item.id)
      this.ids = this.order[0].id
      this.box = [
        {
          weight: '',
          length: '',
          height: '',
          width: ''
        }
      ]
      this.skuList = []
      this.order.forEach(item => {
        item.goods.forEach(ele => {
          delete ele.p_goods.quantity
          this.skuList.push({
            ...ele.p_goods,
            quantity: ele.picking_quantity,
            purchase_order_goods_id: ele.purchase_order_goods_id,
            packData: [{ pack_quantity: '' }]
          })
        })
      })
      this.stationId = item.station_id
      this.prop_ids = item.props.map(ele => ele.id)[0]
      this.station_id = this.stationId
      if (item.user) {
        this.user_id = item.user.id + '---' + item.user.name
      }
      if (item.status === 3) {
        this.express_line_id = this.orderList[index].express_line
          ? this.orderList[index].express_line.id
          : ''
        this.station_id = this.orderList[index].station_id
        if (this.orderList[index].user) {
          this.user_id = this.orderList[index].user.id + '---' + this.orderList[index].user.name
        }
        this.prop_ids = this.orderList[index].props.map(ele => ele.id)[0]
        this.box = []
        const boxData = this.orderList[index].boxes.map(item => {
          return {
            width: item.width,
            height: item.height,
            length: item.length,
            weight: item.weight
          }
        })
        this.box = boxData
        this.skuList = []
        const tempList = this.orderList[index].goods.map(ele => {
          return {
            ...ele.p_goods,
            quantity: ele.quantity,
            packData: []
          }
        })
        this.orderList[index].boxes.forEach(box => {
          box.goods.forEach(goods => {
            tempList.forEach(ele => {
              if (ele.id === goods.id) {
                ele.packData.push({
                  pack_quantity: goods.pivot.quantity
                })
              }
            })
          })
        })
        this.skuList = tempList
      }
    },
    getChannel() {
      this.$request.channelData(this.stationId).then(res => {
        this.express_line_id = res.data.map(item => item.id)[0]
      })
    },
    getLineType() {
      this.$request.lineType().then(res => {
        this.lineData = res.data
      })
    },
    getPackagePick() {
      this.$request.getPackagePick().then(res => {
        if (res.ret) {
          this.pickList = res.data
        }
      })
    },
    queryCNSearch(queryString, callback) {
      var list = [{}]
      let params = {
        keyword: this.user_id.toString()
      }
      this.$request.Automatic(params).then(res => {
        for (let i of res.data) {
          i.value = i.id + '---' + i.name
        }
        list = res.data
        callback && callback(list)
      })
    },
    onPack(type) {
      if (!this.express_line_id) {
        return this.$message.error(this.$t('请选择渠道'))
      } else if (!this.prop_ids) {
        return this.$message.error(this.$t('请选择属性'))
      } else if (!this.station_id) {
        return this.$message.error(this.$t('请选择收货点'))
      } else if (!this.user_id) {
        return this.$message.error(this.$t('请选择客户编号'))
      }
      let boxList = []
      this.box.forEach((item, index) => {
        const boxItem = { ...item, goods: [] }
        this.skuList.forEach(ele => {
          boxItem.goods.push({
            purchase_order_goods_id: ele.purchase_order_goods_id,
            pack_quantity: ele.packData[index].pack_quantity
          })
        })
        boxList.push(boxItem)
      })
      let params = {
        is_pack_finish: type,
        express_line_id: this.express_line_id,
        prop_ids: [this.prop_ids],
        station_id: this.station_id,
        user_id: this.user_id.substring(0, 6),
        box: boxList
      }
      this.$request.purchasePack(this.ids, params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          for (let i = 0; i < this.orderList.length; i++) {
            if (this.orderList[i].status === 2) {
              this.onOrder(this.orderList[i], i)
              this.getCloudDetail(this.orderList[i].sn)
            } else {
              this.$router.push({
                name: 'transshipmentBill'
              })
            }
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  },
  computed: {
    isBtns() {
      let isBtn = false
      this.skuList.forEach(item => {
        if (item.packData) {
          let num = item.packData.reduce(function (acr, pcc) {
            if (!pcc.pack_quantity) {
              return acr
            }
            return acr + Number(pcc.pack_quantity)
          }, 0)
          if (!num || num > item.quantity || num < item.quantity) {
            isBtn = true
          }
        } else {
          isBtn = true
        }
      })
      return isBtn
    }
  },
  components: {}
}
</script>
<style lang="scss">
.pack-container {
  font-size: 14px;
  .content-box {
    padding: 20px;
  }
  .el-row {
    display: flex;
    flex-wrap: wrap;
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
  .programmes {
    padding: 15px;
    margin-bottom: 10px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .align-center {
    text-align: center;
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
  .num-item {
    font-size: 26px;
    font-weight: bold;
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

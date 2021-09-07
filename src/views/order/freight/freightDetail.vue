<template>
  <div class="freight-detail-container small-size main-container">
    <div class="estimation-details" v-cloak>
      <h3 class="title">{{ expressData.name }}</h3>
      <div class="details">
        <div class="details-top">
          <img :src="$baseUrl.IMAGE_URL + expressData.icon.icon" alt="" />
          <ul>
            <li class="attribute">
              <span>{{ $t('线路类型') }}：</span>
              <div class="attribute-item" v-for="item in expressData.props" :key="item.id">
                {{ item.name }}
              </div>
            </li>
            <li>
              <span>{{ $t('计价方式') }}：</span>
              <span v-if="expressData.base_mode === 0">{{ $t('重量计费') }}-</span>
              <span v-else>{{ $t('体积计费') }}-</span>
              <span class="blut-text">
                <span v-if="expressData.mode === 1">{{ $t('首重续重模式') }}</span>
                <span v-if="expressData.mode === 2">{{ $t('阶梯价格模式') }}</span>
                <span v-if="expressData.mode === 4">{{ $t('多级续重模式') }}</span>
                <span v-if="expressData.mode === 5">{{ $t('多级首重续重模式') }}</span>
              </span>
            </li>
            <li>
              <span>{{ $t('运费') }}：</span>
              <span>{{ priceSymbol }}{{ expressData.expire_fee | formatPrice }}</span>
            </li>
            <li>
              <span>{{ $t('计费重量') }}：</span>
              <span>{{ expressData.count_weight | formatWeight }}{{ weightSymbol }}</span>
            </li>
            <li v-if="expressData.base_mode === 1">
              <span>{{ $t('体积重量') }}：</span>
              <span>{{ $t('长') }}*{{ $t('宽') }}*{{ $t('高') }}/{{ expressData.factor }}</span>
            </li>
          </ul>
          <div class="opcity-btn">
            <el-button class="region-btn" size="small" @click="regionDialog = true">{{
              $t('查看分区表')
            }}</el-button>
          </div>
        </div>
        <div class="details-center" v-cloak>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in regions"
              :key="item.id"
              :label="item.name"
              :name="item.name"
            >
              <div class="regions-info">
                <div>
                  <span class="regions-title">{{ $t('参考时效') }}：</span>
                  <span>{{ item.reference_time }}</span>
                </div>
                <div class="regions-title">
                  <div v-if="expressData.base === 0">
                    <span v-if="expressData.mode === 1"
                      >{{ $t('价格表') }}：{{
                        $t('根据阶梯拆分总体积，每一部分按对应价格计算，相加为总价')
                      }}</span
                    >
                    <span v-if="expressData.mode === 4">{{ $t('价格表') }}：</span>
                    <span v-if="expressData.mode === 2 || expressData.mode === 5"
                      >{{ $t('价格表') }}：{{
                        $t('总重量属于哪一个区间，即按照该区间价格计算总价')
                      }}</span
                    >
                  </div>
                  <div v-else>
                    <span v-if="expressData.mode === 1"
                      >{{ $t('价格表') }}：{{
                        $t('根据阶梯拆分总体积，每一部分按对应价格计算，相加为总价')
                      }}</span
                    >
                    <span v-else-if="expressData.mode === 2"
                      >{{ $t('价格表') }}：{{
                        $t('总体积属于哪一个区间，即按照该区间价格计算总价')
                      }}</span
                    >
                    <span v-else>{{ $t('价格表') }}：</span>
                  </div>
                </div>
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%; font-size: 13px"
                  :span-method="objectSpanMethod"
                >
                  <el-table-column
                    :label="$t('重量范围') + weightSymbol"
                    align="center"
                    prop="range"
                    v-if="expressData.base_mode === 0"
                  >
                  </el-table-column>
                  <el-table-column
                    :label="$t('体积范围(立方米)')"
                    align="center"
                    prop="range"
                    v-else
                  >
                  </el-table-column>
                  <el-table-column
                    :label="$t('价格类型')"
                    align="center"
                    prop="priceType"
                    v-if="expressData.mode !== 2"
                  >
                  </el-table-column>
                  <el-table-column
                    :label="$t('价格') + priceSymbol"
                    align="center"
                    prop="regionPrice"
                  >
                  </el-table-column>
                </el-table>
                <div>
                  <div class="regions-title">{{ $t('渠道增值服务') }}</div>
                  <span v-for="(ele, index) in item.services" :key="ele.id" class="services">
                    <div class="service-label">
                      <span>{{ index + 1 }}、</span>
                      <span>{{ ele.name }}</span>
                      <span>{{ ele.is_forced === 1 ? '(必选)' : '(可选)' }}</span>
                    </div>
                    <div>
                      <span v-if="ele.type === 1">{{ $t('实际运费') }}{{ ele.value / 100 }}%</span>
                      <span v-else-if="ele.type === 2"
                        >{{ priceSymbol }}{{ (ele.value / 100).toFixed(2) }}</span
                      >
                      <span v-else-if="ele.type === 3"
                        >{{ priceSymbol }}{{ (ele.value / 100).toFixed(2) }}/{{ $t('箱') }}</span
                      >
                      <span v-else-if="ele.type === 4"
                        >{{ priceSymbol }}{{ (ele.value / 100).toFixed(2) }}/{{ weightSymbol
                        }}{{ $t('（计费重）') }}</span
                      >
                      <span v-else-if="ele.type === 5"
                        >{{ priceSymbol }}{{ (ele.value / 100).toFixed(2) }}/{{ weightSymbol
                        }}{{ $t('（实重）') }}</span
                      >
                      <span v-else>{{ $t('申报价值') }}{{ ele.value / 100 }}%</span>
                    </div>
                  </span>
                </div>
                <div>
                  <div class="regions-title">{{ $t('渠道限制规则') }}</div>
                  <div v-for="(ele, index) in item.rules" :key="ele.id" class="rules">
                    <span>{{ index + 1 }}、</span>
                    <span v-for="(ele2, index2) in ele.conditions" :key="ele2.id">
                      (
                      {{ ele2.param_name }} {{ ele2.comparison }}
                      {{ ele2.value }}
                      )
                      <span v-if="ele.conditions.length === index2 + 1">{{ $t('时') }}，</span>
                      <span v-else>
                        <span v-if="ele.is_and === 1">{{ $t('且') }}</span>
                        <span v-else>{{ $t('或') }}</span>
                      </span>
                    </span>
                    <span>
                      <span>{{ $t('限定') }}</span>
                      <span v-if="ele.type === 1">【{{ $t('按订单收费') }}】</span>
                      <span v-else-if="ele.type === 2">【{{ $t('按箱收费') }}】</span>
                      <span v-else-if="ele.type === 3">【{{ $t('按单位计费重量收费') }}】</span>
                      <span v-else>【{{ $t('限制出仓') }}】</span>
                    </span>
                    <span>{{ priceSymbol }}{{ ele.value / 100 }}</span>
                    <span v-if="ele.min_charge && ele.max_charge">
                      (
                      {{ $t('最低收费') }}{{ priceSymbol }}{{ ele.min_charge / 100 }}，
                      {{ $t('最高收费') }}{{ priceSymbol }}{{ ele.max_charge / 100 }}
                      )
                    </span>
                    <span v-else-if="ele.min_charge">
                      (
                      {{ $t('最低收费') }}{{ priceSymbol }}{{ ele.min_charge / 100 }}
                      )
                    </span>
                    <span v-else-if="ele.max_charge">
                      (
                      {{ $t('最高收费') }}{{ priceSymbol }}{{ ele.max_charge / 100 }}
                      )
                    </span>
                  </div>
                </div>
                <div>
                  {{ $t('注') }}：{{ $t('以上规则') }}
                  【
                  <span>{{
                    expressData.rule_fee_mode ? '每个分区仅按最高项规则收取' : '同时收取'
                  }}</span>
                  】，
                  <span v-if="expressData.max_rule_fee"
                    >{{ $t('最高收费为') }}{{ priceSymbol
                    }}{{ expressData.max_rule_fee / 100 }}</span
                  >
                  <span v-else>{{ $t('无上限') }}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="details-bottom">
          <h4>{{ $t('渠道说明') }}</h4>
          <div class="route-details">{{ expressData.remark }}</div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="title + $t('分区表')"
      :visible.sync="regionDialog"
      width="50%"
      center
      class="area-dialog dialog-container"
      v-cloak
    >
      <div v-for="item in regions" :key="item.id">
        <h4>{{ item.name }}:</h4>
        <div class="area">{{ item.area.join('、') }}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatFilter } from '@/mixin'
export default {
  data() {
    return {
      priceSymbol: '',
      weightSymbol: '',
      expressData: {
        icon: {
          icon: ''
        }
      },
      regions: [],
      activeName: '',
      tableData: [],
      weightArr: [],
      weightPos: 0,
      title: '',
      regionDialog: false
    }
  },
  mixins: [formatFilter],
  created() {
    this.getLocalization()
  },
  methods: {
    //获取单位
    getLocalization() {
      this.$request.getLocalization().then(res => {
        if (res.ret) {
          this.priceSymbol = res.localization.currency_unit
          this.weightSymbol = res.localization.weight_unit
          this.getExpressDetail()
        }
      })
    },
    getExpressDetail() {
      this.expressData = JSON.parse(this.$route.query.region)
      this.regions = [this.expressData.region]
      this.regions = this.regions.map(item => {
        let area = []
        item.areas.forEach(ele => {
          area.push(
            `${ele.country}${ele.area ? '/' + ele.area : ''}${
              ele.sub_area ? '/' + ele.sub_area : ''
            }`
          )
        })
        return {
          ...item,
          area
        }
      })
      this.activeName = this.regions[0].name
      this.title = this.expressData.name
      this.handleClick()
    },
    handleClick(tab = 0) {
      this.tableData = this.regions[tab === 0 ? tab : tab.index].prices
      this.tableData.sort((pre, next) => {
        if (pre.start < next.start) {
          return -1
        }
        if (pre.start == next.start) {
          return 0
        }
        if (pre.start > next.start) {
          return 1
        }
      })
      // 阶梯价格的基价
      if (this.expressData.mode === 2) {
        this.tableData = this.tableData.map(item => {
          if (item.type === 8) {
            let base_price = item.price
            let start = item.start
            let end = item.end
            return {
              base_price,
              start,
              end
            }
          } else {
            return { ...item }
          }
        })
      }
      // 阶梯价格和首重续重去重
      if (this.expressData.mode === 1 || this.expressData.mode === 2) {
        let arr = []
        this.tableData.forEach(item => {
          let flag = -1
          arr.forEach((ele, index) => {
            if (ele.start === item.start && ele.end === item.end) {
              flag = index
            }
          })
          if (flag !== -1) {
            arr[flag] = { ...arr[flag], ...item }
          } else {
            arr.push(item)
          }
        })
        this.tableData = arr
      }
      this.tableData = this.tableData.map(item => {
        let range = ''
        if (this.expressData.mode === 4) {
          if (item.type === 0) {
            if (item.start === item.end) {
              range = item.start / 1000
            } else {
              range = `${item.start / 1000} ~ ${item.end / 1000}`
            }
          } else {
            range = `${item.start / 1000}~${this.expressData.max_weight / 1000}`
          }
        } else {
          if (item.start === item.end) {
            range = item.start / 1000
          } else {
            range = `${item.start / 1000} ~ ${item.end / 1000}`
          }
        }
        let weightSymbol = ''
        if (this.expressData.base_mode === 0) {
          weightSymbol = this.weightSymbol
        } else {
          weightSymbol = this.$t('立方米')
        }
        // 阶梯价格
        if (this.expressData.mode === 2) {
          let regionPrice = ''
          if (item.base_price && !item.price) {
            regionPrice = `${item.base_price / 100}`
          } else if (!item.base_price && item.price) {
            regionPrice = `${item.price / 100}/${weightSymbol}`
          } else {
            regionPrice = `${item.base_price / 100}+${item.price / 100}/${weightSymbol}`
          }
          return {
            range,
            regionPrice
          }
        }
        // 首重续重、多级续重
        else if (this.expressData.mode === 1 || this.expressData.mode === 4) {
          let regionPrice = `${item.price / 100}${
            item.unit_weight ? '/' + item.unit_weight / 1000 + weightSymbol : ''
          }`
          let priceType = item.type === 0 ? this.$t('首费') : this.$t('续费')
          return {
            range,
            priceType,
            regionPrice
          }
        }
        // 多级首重续重模式
        else if (this.expressData.mode === 5) {
          let regionPrice = `${item.price / 100}${
            item.unit_weight ? '/' + item.unit_weight / 1000 + weightSymbol : ''
          }`
          let priceType =
            item.type === 6
              ? `${this.$t('首费')}(${item.first_weight / 1000}${weightSymbol})`
              : this.$t('续费')
          return {
            range,
            priceType,
            regionPrice
          }
        }
      })
      this.weightInit()
    },
    weightInit() {
      this.weightArr = []
      this.weightPos = 0
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.weightArr.push(1)
          this.weightPos = 0
        } else {
          if (this.tableData[index].range == this.tableData[index - 1].range) {
            this.weightArr[this.weightPos] += 1
            this.weightArr.push(0)
          } else {
            this.weightArr.push(1)
            this.weightPos = index
          }
        }
      })
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.weightArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
.freight-detail-container {
  li {
    list-style: none;
  }
  .details {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid #d7d7d7;
    font-size: 14px;
    .details-top {
      display: grid;
      align-items: center;
      grid-template-columns: 100px 8fr 110px;
      gap: 20px;
      line-height: 35px;
      img {
        justify-self: center;
        width: 100%;
      }
      .attribute {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .attribute-item {
          display: flex;
          align-items: center;
          height: 25px;
          padding: 0 10px;
          margin: 0 5px 5px 0;
          color: #333e9e;
          border-radius: 7px;
          font-size: 12px;
          background-color: #d9ddff;
        }
      }
      .blut-text {
        color: #2b1cc4;
      }
      .opcity-btn {
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        .go-back {
          cursor: pointer;
        }
        .go-back:hover {
          color: #2b1cc4;
          text-decoration: underline;
        }
        .region-btn {
          color: #fff;
          background-color: #2b1cc4;
        }
      }
    }
    .details-center {
      .regions-info {
        padding: 20px;
        background-color: #f0f0f0;
        .regions-title {
          padding: 10px 0;
          font-weight: bold;
          font-size: 14px;
        }
        .services {
          display: grid;
          grid-template-columns: 180px 1fr;
          font-size: 13px;
          line-height: 30px;
        }
        .rules {
          line-height: 30px;
          font-size: 13px;
        }
      }
    }
    .route-details {
      font-size: 14px;
      line-height: 25px;
    }
  }
  .select-mode {
    display: flex;
    justify-content: flex-end;
    div {
      cursor: pointer;
      width: 110px;
      padding: 10px;
      margin-left: 10px;
      border: 1px solid #d7d7d7;
      text-align: center;
      background-color: #fff;
    }
  }
  .area-dialog {
    ::v-deep .el-dialog__body {
      padding-top: 0 !important;
    }
    .area {
      padding: 20px;
      line-height: 25px;
      border: 1px solid #d7dae2;
    }
  }
}
</style>

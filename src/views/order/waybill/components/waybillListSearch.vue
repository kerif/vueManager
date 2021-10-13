<template>
  <div class="waybill-list-search">
    <el-form class="search-form" :model="searchFieldData" ref="searchForm" size="mini">
      <el-row :gutter="20">
        <el-col :span="6" :xl="10">
          <!--订单号搜索-->
          <el-form-item prop="order_sn">
            <el-input
              v-model="searchFieldData.order_sn"
              :autosize="{ minRows: 5, maxRows: 10 }"
              type="textarea"
              :placeholder="$t('请输入订单号搜索，多个单号请用回车区分')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :xl="2">
          <!--第二列表开始-->
          <!--时间-->
          <el-form-item prop="date_type">
            <el-select
              v-model="searchFieldData.date_type"
              clearable
              :placeholder="$t('时间')"
              value-key="id"
            >
              <el-option
                v-for="item in timeOptions"
                :key="item.id"
                :value="item.value"
                :label="$t(item.name)"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!--价格区间-->
          <el-form-item prop="value_type">
            <el-select
              v-model="searchFieldData.value_type"
              clearable
              :placeholder="$t('价格区间')"
              value-key="id"
            >
              <el-option
                v-for="item in priceRangeOptions"
                :key="item.id"
                :value="item.value"
                :label="$t(item.name)"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!--线路名称-->
          <el-form-item prop="express_line_id">
            <el-select
              v-model="searchFieldData.express_line_id"
              clearable
              :placeholder="$t('线路名称')"
              value-key="id"
            >
              <el-option
                v-for="item in lineData"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :xl="4">
          <!--第三列开始-->
          <el-row>
            <el-col :span="24">
              <el-form-item prop="date">
                <el-date-picker
                  style="width: 100%"
                  v-model="searchFieldData.date"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :range-separator="$t('至')"
                  :start-placeholder="$t('开始日期')"
                  :end-placeholder="$t('结束日期')"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!--价格-->
          <el-row>
            <el-col :span="11">
              <el-form-item prop="value_begin">
                <el-input
                  class="number"
                  :placeholder="$t('请输入起始价格')"
                  v-model="searchFieldData.value_begin"
                  onkeypress="return( /[\d.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input
              ></el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center">-</el-col>
            <el-col :span="11"
              ><el-form-item prop="value_end">
                <el-input
                  class="number"
                  :placeholder="$t('请输入结束价格')"
                  v-model="searchFieldData.value_end"
                  onkeypress="return( /[\d.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>

          <!--支付方式 仓库-->
          <el-row>
            <el-col :span="11">
              <el-form-item prop="payment_type">
                <el-select
                  v-model="searchFieldData.payment_type"
                  clearable
                  :placeholder="$t('支付方式')"
                  value-key="id"
                >
                  <el-option
                    v-for="item in paymentData"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="warehouse_id">
                <el-select
                  v-model="searchFieldData.warehouse"
                  clearable
                  :placeholder="$t('请选择仓库')"
                  value-key="id"
                >
                  <el-option
                    v-for="item in wareHouseList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.warehouse_name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" :xl="3">
          <!--收货国家地区-->
          <el-form-item prop="countryArr">
            <el-cascader
              :placeholder="$t('收货国家/地区')"
              :show-all-levels="false"
              :props="countryProps"
              v-model="searchFieldData.countryArr"
              clearable
            ></el-cascader>
          </el-form-item>
          <!--支付方式-->
          <el-form-item prop="pay_delivery">
            <el-select
              v-model="searchFieldData.pay_delivery"
              clearable
              :placeholder="$t('支付状态')"
              value-key="id"
            >
              <el-option
                v-for="item in paymentStatusData"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" :xl="3">
          <!--收货方式-->
          <el-form-item prop="receive_type">
            <el-select
              v-model="searchFieldData.receive_type"
              clearable
              :placeholder="$t('收货方式')"
              value-key="id"
            >
              <el-option
                v-for="item in receiverOptions"
                :key="item.id"
                :value="item.value"
                :label="$t(item.name)"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!--所属代理 -->
          <el-form-item prop="agent">
            <el-select
              v-model="searchFieldData.agent"
              clearable
              :placeholder="$t('所属代理')"
              value-key="id"
            >
              <el-option
                v-for="item in agentData"
                :key="item.id"
                :value="String(item.user_id)"
                :label="item.agent_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div class="submit">
            <el-button type="primary" plain size="small" @click="submitForm">{{
              $t('搜索')
            }}</el-button>
            <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import request from '../../../../lib/request'
import { countryCallback } from '../../../../utils/index'
export default {
  name: 'waybillListSearch',
  props: {
    searchFieldData: {
      type: Object
    }
  },
  data() {
    return {
      timeList: [],
      pickerTime: [],
      timeOptions: [
        { value: 'created_at', name: '订单提交时间' },
        { value: 'packed_at', name: '打包称重时间' },
        { value: 'paid_at', name: '支付时间' },
        { value: 'shipped_at', name: '发货时间' },
        { value: 'signed_at', name: '签收时间' }
      ],
      priceRangeOptions: [
        { value: 'actual_payment_fee', name: '应付总费用' },
        { value: 'actual_pay', name: '实际支付' },
        { value: 'declare_value', name: '申报价值' }
      ],
      receiverOptions: [
        { value: 1, name: '自提' },
        { value: 2, name: '非自提' }
      ],
      paymentStatusData: [
        {
          id: 1,
          name: this.$t('全部货到付款')
        },
        {
          id: 2,
          name: this.$t('未支付')
        },
        {
          id: 3,
          name: this.$t('已支付')
        },
        {
          id: 11,
          name: this.$t('待审核')
        },
        {
          id: 12,
          name: this.$t('审核拒绝')
        }
      ],
      countryProps: {
        lazy: true,
        value: 'id',
        label: 'name',
        lazyLoad(node, resolve) {
          const { level } = node
          if (level === 0) {
            request.getCountriesList().then(res => {
              resolve(
                res.data.map(item => ({
                  name: item.name,
                  id: item.id,
                  leaf: item.areas_count > 0 ? '' : 'leaf'
                }))
              )
            })
          } else if (level === 1) {
            request
              .getCountriesSecondList({
                country_id: node.value
              })
              .then(res => {
                resolve(countryCallback(res.data))
              })
          } else {
            resolve()
          }
        }
      },
      agentData: [],
      paymentData: [],
      lineData: [],
      wareHouseList: []
    }
  },
  created() {
    this.getAgentData()
    this.getPaymentType()
    this.getLineType()
    this.initQuery()
    this.getSimpleList()
  },
  activated() {
    this.initQuery()
  },
  methods: {
    initQuery() {
      if (this.$route.query.agent) {
        this.searchFieldData.agent = this.$route.query.agent
      }
    },
    submitForm() {
      this.$emit('submit')
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
      this.searchFieldData.start = ''
      this.searchFieldData.end = ''
      this.searchFieldData.agent = ''
    },
    // 获得客户下拉列表
    getAgentData() {
      this.$request.getAgent().then(res => {
        this.agentData = res.data
      })
    },
    // 获取仓库列表
    getSimpleList() {
      this.$request.getSimpleList().then(res => {
        if (res.ret) {
          this.wareHouseList = res.data
        }
      })
    },
    // 获取支付方式列表
    getPaymentType() {
      this.$request.paymentType().then(res => {
        this.paymentData = res.data
        console.log(res.data)
      })
    },
    // 获取筛选线路列表
    getLineType() {
      this.$request.lineType().then(res => {
        this.lineData = res.data
        console.log(res.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.waybill-list-search {
  margin: 10px 0;
  .search-form {
    background-color: #fff;
    padding: 10px;
    .el-select,
    .el-cascader,
    .el-input,
    .el-date-editor {
      margin: 0 5px;
    }
    .el-form-item--mini.el-form-item {
      margin-bottom: 10px;
      height: 28px;
    }
    .el-select,
    .el-cascader {
      width: 100%;
    }
    ::v-deep .el-input {
      // width: 168px;
    }
  }
}
</style>

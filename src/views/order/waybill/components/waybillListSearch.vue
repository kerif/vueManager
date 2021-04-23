<template>
  <div class="waybill-list-search">
    <el-form
      class="search-form"
      :model="searchFieldData"
      ref="searchForm"
      size="mini"
      label-width="80px"
    >
      <div>
        <el-form-item :label="$t('时间')" prop="date_type">
          <el-select v-model="searchFieldData.date_type" clearable :placeholder="$t('请选择')">
            <el-option
              v-for="item in timeOptions"
              :key="item.id"
              :value="item.value"
              :label="item.name"
            >
            </el-option>
          </el-select>
          <el-form-item prop="date" style="margin: 0">
            <el-date-picker
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
        </el-form-item>
        <el-form-item :label="$t('价格区间')" prop="value_type">
          <el-select v-model="searchFieldData.value_type" clearable :placeholder="$t('请选择')">
            <el-option
              v-for="item in priceRangeOptions"
              :key="item.id"
              :value="item.value"
              :label="item.name"
            >
            </el-option>
          </el-select>
          <el-form-item prop="value_begin">
            <el-input
              class="number"
              :placeholder="$t('请输入起始价格')"
              v-model="searchFieldData.value_begin"
              onkeypress="return( /[\d.]/.test(String.fromCharCode(event.keyCode) ) )"
            ></el-input
          ></el-form-item>
          -
          <el-form-item prop="value_end">
            <el-input
              class="number"
              :placeholder="$t('请输入结束价格')"
              v-model="searchFieldData.value_end"
              onkeypress="return( /[\d.]/.test(String.fromCharCode(event.keyCode) ) )"
            ></el-input>
          </el-form-item>
        </el-form-item>
        <div style="display: flex">
          <el-form-item :label="$t('线路名称')" prop="express_line_id">
            <el-select
              v-model="searchFieldData.express_line_id"
              clearable
              :placeholder="$t('请选择')"
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
          <el-form-item :label="$t('支付方式')" prop="payment_type">
            <el-select v-model="searchFieldData.payment_type" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in paymentData"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div>
        <div style="display: flex">
          <el-form-item :label="$t('收货国家/地区')" prop="countryArr" label-width="140px">
            <el-cascader
              :show-all-levels="false"
              :props="countryProps"
              v-model="searchFieldData.countryArr"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('收货方式')" prop="receive_type">
            <el-select v-model="searchFieldData.receive_type" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in receiverOptions"
                :key="item.id"
                :value="item.value"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item :label="$t('支付状态')" prop="pay_delivery" label-width="140px">
            <el-select v-model="searchFieldData.pay_delivery" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in paymentStatusData"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('所属代理')" prop="agent">
            <el-select v-model="searchFieldData.agent" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in agentData"
                :key="item.id"
                :value="String(item.user_id)"
                :label="item.agent_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="submit">
          <el-button type="primary" size="small" @click="submitForm">{{ $t('搜索') }}</el-button>
          <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
        </div>
      </div>
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
        { value: 'shipped_at', name: '打包时间' },
        { value: 'signed_at', name: '签收时间' }
      ],
      priceRangeOptions: [
        { value: 'actual_payment_fee', name: '订单提交时间' },
        { value: 'actual_pay', name: '实际支付' },
        { value: 'declare_value', name: '申报价值' }
      ],
      receiverOptions: [
        { value: 1, name: '自提' },
        { value: 2, name: '非自提' }
      ],
      countryOption: [
        {
          value: 'usa',
          label: '美国'
        },
        {
          value: 'can',
          label: '加拿大'
        },
        {
          value: 'hk',
          label: '香港',
          children: [
            {
              value: 'jiulong',
              label: '九龙'
            },
            {
              value: 'xinjie',
              label: '新界'
            }
          ]
        }
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
      lineData: []
    }
  },
  created() {
    this.getAgentData()
    this.getPaymentType()
    this.getLineType()
    this.initQuery()
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
    // 获取支付方式列表
    getPaymentType() {
      this.$request.paymentType().then(res => {
        this.paymentData = res.data
      })
    },
    // 获取筛选线路列表
    getLineType() {
      this.$request.lineType().then(res => {
        this.lineData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.waybill-list-search {
  margin: 10px 0;
  .search-form {
    display: flex;
    .el-select,
    .el-cascader,
    .el-input,
    .el-date-editor {
      margin: 0 5px;
    }
    .number /deep/ .el-input__inner {
      text-align: center;
    }
    .el-form-item--mini.el-form-item {
      margin-bottom: 10px;
    }
    /deep/ .el-input {
      width: 168px;
    }
    /deep/ .el-form-item__content {
      display: flex;
    }
    .submit {
      float: right;
      padding-right: 5px;
    }
  }
}
</style>

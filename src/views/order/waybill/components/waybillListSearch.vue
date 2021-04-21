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
        <el-form-item label="时间" prop="time">
          <el-select v-model="searchFieldData.time" clearable :placeholder="$t('请选择')">
            <el-option
              v-for="item in timeList"
              :key="item.id"
              :value="item.user_id"
              :label="item.agent_name"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="pickerTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="价格区间" prop="time">
          <el-select v-model="searchFieldData.time" clearable :placeholder="$t('请选择')">
            <el-option
              v-for="item in timeList"
              :key="item.id"
              :value="item.user_id"
              :label="item.agent_name"
            >
            </el-option>
          </el-select>
          <el-input
            class="number"
            :placeholder="$t('请输入起始价格')"
            v-model="searchFieldData.start"
            onkeypress="return( /[\d.]/.test(String.fromCharCode(event.keyCode) ) )"
          ></el-input>
          -
          <el-input
            class="number"
            :placeholder="$t('请输入结束价格')"
            v-model="searchFieldData.end"
            onkeypress="return( /[\d.]/.test(String.fromCharCode(event.keyCode) ) )"
          ></el-input>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="线路名称" prop="express_line_id">
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
          <el-form-item label="支付方式" prop="payment_type">
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
          <el-form-item label="收货国家/地区" prop="country" label-width="140px">
            <el-cascader :options="countryOption"></el-cascader>
          </el-form-item>
          <el-form-item label="收货方式">
            <el-select v-model="searchFieldData.time" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in timeList"
                :key="item.id"
                :value="item.user_id"
                :label="item.agent_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item label="支付状态" prop="pay_delivery" label-width="140px">
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
          <el-form-item label="所属代理" prop="agent">
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
          <el-button type="primary" size="small" @click="submitForm">提交</el-button>
          <el-button size="small" @click="resetForm">重置</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
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
    /deep/ .el-input {
      max-width: 168px;
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

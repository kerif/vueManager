<template>
  <div class="invoiceData-container">
    <div class="header-range">
      <div class="header-status">
        <!-- 订单状态 -->
        <el-select
          v-model="page_params.status"
          class="head-mr"
          :placeholder="$t('订单状态')"
          size="small"
          clearable
        >
          <el-option v-for="item in statusData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- 时间 -->
        <el-date-picker
          size="small"
          class="selectTime head-mr"
          v-model="timeList"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('提交开始日期')"
          :end-placeholder="$t('提交结束日期')"
        >
        </el-date-picker>
        <!-- 搜索 -->
        <el-button size="small" class="searchBtn head-mr" @click="triggerVal">{{
          $t('搜索')
        }}</el-button>
      </div>
      <div class="header-search">
        <el-input
          placeholder="请输入内容"
          v-model="page_params.keyword"
          @keyup.enter.native="triggerVal"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="triggerVal"></i>
        </el-input>
      </div>
    </div>
    <!-- 表格 -->
    <div class="data-list">
      <el-table :data="allData" border style="width: 100%">
        <el-table-column type="index" :label="$t('#')" width="80"> </el-table-column>
        <el-table-column prop="order_sn" :label="$t('订单号')" width="160"> </el-table-column>
        <el-table-column prop="order_status" :label="$t('订单状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.order_status === 3">{{ $t('待发货') }}</span>
            <span v-if="scope.row.order_status === 4">{{ $t('已发货') }}</span>
            <span v-if="scope.row.order_status === 5">{{ $t('已签收') }}</span>
            <span v-if="scope.row.order_status === 19">{{ $t('已作废') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('客户ID')" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.user_id }}---{{ scope.row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('发票类型')" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('普通纸质发票') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoice_type" :label="$t('抬头类型')">
          <template slot-scope="scope">
            <span v-if="scope.row.invoice_type === 1">{{ $t('个人') }}</span>
            <span v-if="scope.row.invoice_type === 2">{{ $t('企业') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="money" :label="$t('发票金额')" width="160"> </el-table-column>
        <el-table-column prop="state" :label="$t('审核状态')" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1" class="col_red">{{ $t('待处理') }}</span>
            <span v-if="scope.row.state === 2" class="col_green">{{ $t('已开票') }}</span>
            <span v-if="scope.row.state === 3">{{ $t('已作废') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('申请时间')" width="160"> </el-table-column>
        <el-table-column prop="handler" :label="$t('处理人')" width="160"> </el-table-column>
        <el-table-column prop="updated_at" :label="$t('处理时间')" width="160"> </el-table-column>
        <el-table-column prop="invoices_number" :label="$t('发票号码')"> </el-table-column>
        <el-table-column :label="$t('操作')" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state === 1"
              type="success"
              plain
              size="mini"
              @click="editDetail(scope.row.id)"
              >{{ $t('处理') }}</el-button
            >
            <el-button
              v-if="scope.row.state === 2 || scope.row.state === 3"
              type="primary"
              plain
              size="mini"
              @click="editDetail(scope.row.id)"
              >{{ $t('详情') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    allData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      page_params: {
        status: '',
        begin_date: '',
        end_date: ''
      },
      timeList: [],
      statusData: [
        {
          id: 3,
          name: this.$t('待发货')
        },
        {
          id: 4,
          name: this.$t('已发货')
        },
        {
          id: 5,
          name: this.$t('已签收')
        },
        {
          id: 19,
          name: this.$t('已作废')
        }
      ],
      stateData: [
        {
          id: 1,
          name: this.$t('待处理')
        },
        {
          id: 2,
          name: this.$t('申请通过')
        },
        {
          id: 3,
          name: this.$t('作废发票')
        }
      ],
      type: '',
      status: ''
    }
  },
  created() {},
  methods: {
    // 详情
    editDetail(id) {
      this.$emit('transVal', id)
    },
    triggerVal() {
      console.log(this.timeList)
      if (!this.timeList) {
        this.timeList = []
      }
      this.page_params.begin_date = this.timeList[0]
      this.page_params.end_date = this.timeList[1]
      this.$emit('passval', this.page_params)
    }
  }
}
</script>

<style lang="scss" scoped>
.invoiceData-container {
  .header-range {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-status {
      .head-mr {
        margin-right: 10px;
      }
    }
    .header-search {
      width: 200px;
    }
  }
  .data-list {
    margin-top: 40px;
  }
  .selectTime {
    width: 260px !important;
  }
  .searchBtn {
    width: 120px;
  }
  .el-button {
    margin: 0px;
  }
  /deep/ .el-table tr th.is-leaf {
    border-bottom: 1px #ecedf0 solid;
    background-color: #fff;
  }
  /deep/ .el-table th > .cell {
    text-align: center;
  }
  /deep/ .el-table .cell {
    text-align: center;
  }
  .col_green {
    color: green;
  }
  .col_red {
    color: red;
  }
}
</style>

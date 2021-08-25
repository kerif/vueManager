<template>
  <div class="invoiceData-container">
    <el-row :gutter="10">
      <el-col :span="3">
        <!-- 订单状态 -->
        <el-select v-model="type" :placeholder="$t('订单状态')" size="small">
          <el-option :label="$t('订单状态')"> </el-option>
        </el-select>
      </el-col>
      <!-- 开票状态 -->
      <el-col :span="3">
        <el-select v-model="status" :placeholder="$t('开票状态')" size="small">
          <el-option> </el-option>
        </el-select>
      </el-col>
      <!-- 时间 -->
      <el-col :span="4">
        <el-date-picker
          size="small"
          class="selectTime"
          v-model="timeList"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('提交开始日期')"
          :end-placeholder="$t('提交结束日期')"
        >
        </el-date-picker>
      </el-col>
      <!-- 搜索 -->
      <el-col :span="3">
        <el-button size="small" class="searchBtn">{{ $t('搜索') }}</el-button>
      </el-col>
      <el-col :span="4" :offset="7">
        <search-group v-model="page_params.keyword" :placeholder="$t('请输入内容')"> </search-group>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <div class="data-list">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" :label="$t('#')" width="80"> </el-table-column>
        <el-table-column prop="name" :label="$t('订单号')" width="160"> </el-table-column>
        <el-table-column prop="data" :label="$t('订单状态')"> </el-table-column>
        <el-table-column prop="data" :label="$t('客户ID')" width="160"> </el-table-column>
        <el-table-column prop="name" :label="$t('发票类型')" width="160"> </el-table-column>
        <el-table-column prop="data" :label="$t('抬头类型')"> </el-table-column>
        <el-table-column prop="data" :label="$t('发票金额￥')" width="160"> </el-table-column>
        <el-table-column prop="name" :label="$t('审核状态')" width="160"> </el-table-column>
        <el-table-column prop="data" :label="$t('申请时间')"> </el-table-column>
        <el-table-column prop="data" :label="$t('处理人')" width="160"> </el-table-column>
        <el-table-column prop="name" :label="$t('处理时间')" width="160"> </el-table-column>
        <el-table-column prop="data" :label="$t('发票号码')"> </el-table-column>
        <el-table-column prop="data" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button type="success" plain size="mini" @click="editDetail(scope.row.id)">{{
              $t('处理')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      page_params: {
        keyword: ''
      },
      timeList: [],
      type: '',
      status: '',
      value: ''
    }
  },
  mixins: [pagination],
  components: {
    SearchGroup
  },
  methods: {
    editDetail(id) {
      this.$router.push({
        name: 'invoiceDetails',
        params: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.invoiceData-container {
  .data-list {
    margin-top: 40px;
  }
  .selectTime {
    width: 260px !important;
  }
  .searchBtn {
    width: 120px;
  }
  /deep/.el-button {
    margin: 0px;
  }
  /deep/.el-table tr th.is-leaf {
    border-bottom: 1px #ecedf0 solid;
    background-color: #fff;
  }
  /deep/.el-table th > .cell {
    text-align: center;
  }
  /deep/.el-table .cell {
    text-align: center;
  }
}
</style>

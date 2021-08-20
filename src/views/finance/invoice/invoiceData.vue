<template>
  <div class="invoiceData-container">
    <el-row :gutter="10">
      <el-col :span="3">
        <!-- 订单状态 -->
        <el-select v-model="type" :placeholder="$t('订单状态')" size="small">
          <el-option :label="$t('订单状态')" :value="$t('选项一')"> </el-option>
        </el-select>
      </el-col>
      <!-- 开票状态 -->
      <el-col :span="3">
        <el-select v-model="status" :placeholder="$t('开票状态')" size="small">
          <el-option> </el-option>
        </el-select>
      </el-col>
      <!-- 时间 -->
      <el-col :span="5">
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
        <el-button size="small" class="searchBtn">搜索</el-button>
      </el-col>
      <el-col :span="5" :offset="5">
        <search-group v-model="page_params.keyword" :placeholder="$t('请输入内容')"> </search-group>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <div class="data-list">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="80"> </el-table-column>
        <el-table-column prop="name" label="订单号" width="160"> </el-table-column>
        <el-table-column prop="data" label="订单状态"> </el-table-column>
        <el-table-column prop="data" label="客户ID" width="160"> </el-table-column>
        <el-table-column prop="name" label="发票类型" width="160"> </el-table-column>
        <el-table-column prop="data" label="抬头类型"> </el-table-column>
        <el-table-column prop="data" label="发票金额￥" width="160"> </el-table-column>
        <el-table-column prop="name" label="审核状态" width="160"> </el-table-column>
        <el-table-column prop="data" label="申请时间"> </el-table-column>
        <el-table-column prop="data" label="处理人" width="160"> </el-table-column>
        <el-table-column prop="name" label="处理时间" width="160"> </el-table-column>
        <el-table-column prop="data" label="发票号码"> </el-table-column>
        <el-table-column prop="data" label="操作">
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
      status: ''
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
}
</style>

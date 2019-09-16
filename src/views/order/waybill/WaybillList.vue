<template>
  <div class="way-list-container">
    <search-group placeholder="请输入关键字"></search-group>
      <el-tabs v-model="activeName" class="tabLength">
        <!-- 待处理 -->
        <el-tab-pane label="待处理" name="1"></el-tab-pane>
        <!-- 待支付 -->
        <el-tab-pane label="待支付" name="2"></el-tab-pane>
        <!-- 待发货 -->
        <el-tab-pane label="待发货" name="3"></el-tab-pane>
        <!-- 已发货 -->
        <el-tab-pane label="已发货" name="4"></el-tab-pane>
        <!-- 已签收 -->
        <el-tab-pane label="已签收" name="5"></el-tab-pane>
    </el-tabs>
<el-table class="data-list" border stripe
      :data="oderData">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="id"></el-table-column>
      <!-- 转运单号 -->
      <el-table-column label="转运单号" prop="name"></el-table-column>
      <!-- 物流单号 -->
      <el-table-column label="物流单号"></el-table-column>
      <!-- 线路名称 -->
      <el-table-column label="线路名称" prop="group"></el-table-column>
      <!-- 收货人 -->
      <el-table-column label="收货人"></el-table-column>
      <!-- 收货国家 -->
      <el-table-column label="收货国家"></el-table-column>
      <!-- 包裹数 -->
      <el-table-column label="包裹数"></el-table-column>
      <!-- 预计重量KG -->
      <el-table-column label="预计重量kg"></el-table-column>
      <!-- 详见产品图 -->
      <el-table-column label="详见产品图"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column label="提交时间"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template>
          <el-button class="btn-purple detailsBtn" @click="details">详情</el-button>
          <el-button class="btn-dark-green detailsBtn" @click="packed">打包</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small">删除</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      activeName: '',
      oderData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    packed () {
      this.$router.push({ name: 'billPacked' })
    },
    details () {
      this.$router.push({ name: 'billDetails' })
    }
  },
  created () {
    this.activeName = '1'
  }
}
</script>

<style lang="scss">
.way-list-container {
  .tabLength {
    width: 400px !important;
  }
  .detailsBtn {
    margin: 5px 3px !important;
  }
}
</style>

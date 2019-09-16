<template>
  <div class="order-list-container">
    <search-group placeholder="请输入关键字"></search-group>
      <el-tabs v-model="activeName" class="tabLength">
        <!-- 未入库 -->
        <el-tab-pane label="未入库" name="1"></el-tab-pane>
        <!-- 已入库 -->
        <el-tab-pane label="已入库" name="2"></el-tab-pane>
    </el-tabs>
<el-table class="data-list" border stripe
      :data="oderData">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="id"></el-table-column>
      <!-- 快递单号 -->
      <el-table-column label="快递单号" prop="name"></el-table-column>
      <!-- 物品名称 -->
      <el-table-column label="物品名称" prop="group"></el-table-column>
      <!-- 物品价值 -->
      <el-table-column label="物品价值"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性" prop="last_login"></el-table-column>
      <!-- 规格 -->
      <el-table-column label="规格(长宽高cm)" v-if="activeName == '2'" width="120px"></el-table-column>
      <!-- 称重时间 -->
      <el-table-column label="称重时间" v-if="activeName == '2'"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column label="提交时间"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" v-if="activeName == '1'">
        <template>
          <el-button class="btn-green" @click="storage">入库</el-button>
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
    storage () {
      this.$router.push({ name: 'storageContainer' })
    }
  },
  created () {
    this.activeName = '1'
  }
}
</script>

<style lang="scss">
.order-list-container {
  .tabLength {
    width: 200px !important;
  }
}
</style>

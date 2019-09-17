<template>
  <div class="picking-list-container">
    <search-group placeholder="请输入关键字"></search-group>
      <el-tabs v-model="activeName" class="tabLength">
        <!-- 入库日志 -->
        <el-tab-pane label="入库日志" name="1"></el-tab-pane>
        <!-- 拣货日志 -->
        <el-tab-pane label="拣货日志" name="2"></el-tab-pane>
    </el-tabs>
   <el-table class="data-list" border stripe
      :data="oderData">
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
      <!-- 操作人 -->
      <el-table-column label="操作人" prop="id"></el-table-column>
      <!-- 操作时间 -->
      <el-table-column label="操作时间" prop="name"></el-table-column>
      <!-- 快递单号 -->
      <el-table-column label="快递单号" prop="group" v-if="activeName == '1'"></el-table-column>
      <!-- 转运单号 -->
      <el-table-column label="转运单号" v-if="activeName == '2'"></el-table-column>
      <!-- 重量kg -->
      <el-table-column label="重量kg"></el-table-column>
      <!-- 长宽高cm -->
      <el-table-column label="长宽高cm" prop="last_login"></el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性" v-if="activeName == '1'"></el-table-column>
      <!-- 打包图片 -->
      <el-table-column label="打包图片" v-if="activeName == '2'"></el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small">删除</el-button>
        </div>
      </template> -->
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
.picking-list-container {
  .tabLength {
    width: 200px !important;
  }
}
</style>

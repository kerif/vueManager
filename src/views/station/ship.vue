<template>
  <div class="ship-container">
    <div><search-group></search-group></div>
    <div class="select-box">
      <search-select placeholder="状态"></search-select>
      <add-btn @click.native="updateInvoice">创建发货单</add-btn>
    </div>
    <el-table :data="tableShip" stripe border class="data-list">
      <!-- 发货单号 -->
      <el-table-column label="发货单号" prop="sn"></el-table-column>
      <!-- 创建时间 -->
      <el-table-column label="创建时间" prop="created_at"></el-table-column>
      <!-- 发出站点 -->
      <el-table-column label="发出站点" prop="source_station"></el-table-column>
      <!-- 目的国 -->
      <el-table-column label="目的国" prop="destination_country"></el-table-column>
      <!-- 状态 -->
      <el-table-column label="状态" prop="status"></el-table-column>
      <!-- 箱数 -->
      <el-table-column label="箱数" prop="box_count"></el-table-column>
      <!-- 体积 -->
      <el-table-column label="体积" prop="volume"></el-table-column>
      <!-- 价值 -->
      <el-table-column label="价值" prop="value"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性" prop="props.cn_name"></el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" prop="remark"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click.native="goInvoice(scope.row.id)">发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import { SearchSelect, SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      tableShip: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$request.getShip().then(res => {
        this.tableShip = res.data
      })
    },
    updateInvoice () {
      dialog({ type: 'invoice' }, () => {
        this.getList()
      })
    },
    goInvoice (id) {
      console.log(id, '发货')
      dialog({ type: 'invoice', id: id }, () => {
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss">
.ship-container {
  .select-box {
    overflow: hidden;
  }
}
</style>

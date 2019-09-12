<template>
  <div class="ship-container">
    <div><search-group></search-group></div>
    <div class="select-box">
      <search-select placeholder="状态"></search-select>
      <add-btn @click.native="updateInvoice">创建发货单</add-btn>
    </div>
    <el-table :data="tableShip" stripe border class="data-list">
      <!-- 发货单号 -->
      <el-table-column label="发货单号" prop="cn_name"></el-table-column>
      <!-- 创建时间 -->
      <el-table-column label="创建时间" prop="en_name"></el-table-column>
      <!-- 发出站点 -->
      <el-table-column label="发出站点" prop="name"></el-table-column>
      <!-- 目的国 -->
      <el-table-column label="目的国"></el-table-column>
      <!-- 状态 -->
      <el-table-column label="状态"></el-table-column>
      <!-- 箱数 -->
      <el-table-column label="箱数"></el-table-column>
      <!-- 体积 -->
      <el-table-column label="体积"></el-table-column>
      <!-- 价值 -->
      <el-table-column label="价值"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性"></el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template>
          <el-button class="btn-green"  @click.native="updateInvoice">发货</el-button>
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
      tableShip: [
        {
          id: 1,
          cn_name: 'lalaa',
          en_name: 'vanora',
          name: '11'
        }
      ]
    }
  },
  methods: {
    updateInvoice () {
      dialog({ type: 'invoice' })
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

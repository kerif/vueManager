<template>
  <div class="order-list-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch"></search-group>
      <el-tabs v-model="activeName" class="tabLength">
        <!-- 未入库 -->
        <el-tab-pane label="未入库" name="1"></el-tab-pane>
        <!-- 已入库 -->
        <el-tab-pane label="已入库" name="2"></el-tab-pane>
    </el-tabs>
      <el-table class="data-list" border stripe
      :data="oderData"
      v-loading="tableLoading">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="user_id"></el-table-column>
      <!-- 快递单号 -->
      <el-table-column label="快递单号" prop="express_num"></el-table-column>
      <!-- 物品名称 -->
      <el-table-column label="物品名称" prop="package_name"></el-table-column>
      <!-- 物品价值 -->
      <el-table-column label="物品价值" prop="package_value"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性">
        <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">
            {{item.cn_name}}
          </span>
        </template>
      </el-table-column>
      <!-- 规格 -->
      <el-table-column label="规格(长宽高cm)" prop="dimension" 
      v-show="activeName === '2'" width="120px"></el-table-column>
      <!-- 称重时间 -->
      <el-table-column label="称重时间" v-show="activeName === '2'"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column label="提交时间" prop="created_at">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" v-if="activeName === '1'">
        <template slot-scope="scope" v-if="activeName === '1'">
          <!-- 入库 -->
          <el-button class="btn-green" @click="storage(scope.row.id, scope.row.express_num)">入库</el-button>
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
      oderData: [],
      status: '',
      tableLoading: false
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getWarehouse({
        status: this.status,
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    storage (id, expressNum) {
      this.$router.push({ name: 'editStorage', params: { id: id, express_num: expressNum } })
    }
  },
  created () {
    this.activeName = '1'
    // this.getList()
  },
  watch: {
    // 监听tab组件参数
    activeName (newValue) {
      switch (newValue) {
        case '1': // 未入库
          this.status = 1
          break
        case '2': // 已入库
          this.page_params.page = 1
          this.status = 2
          break
      }
      this.getList()
    }
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

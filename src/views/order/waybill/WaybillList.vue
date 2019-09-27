<template>
  <div class="way-list-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch"></search-group>
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
      v-loading="tableLoading"
      :data="oderData" @selection-change="onSelectChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="user_id"></el-table-column>
      <!-- 转运单号 -->
      <el-table-column label="转运单号" prop="order_sn"></el-table-column>
      <!-- 物流单号 -->
      <el-table-column label="物流单号" v-if="activeName === '1' || activeName === '2' 
      || activeName === '4' || activeName === '5'" prop="logistics_sn"></el-table-column>
      <el-table-column label="物流单号" v-if="activeName === '3'">
        <template slot-scope="scope">
          <el-input type="text"></el-input>
        </template>
      </el-table-column>
      <!-- 线路名称 -->
      <el-table-column label="线路名称" prop="express_line.cn_name"></el-table-column>
      <!-- 收货人 -->
      <el-table-column label="收货人" prop="address.receiver_name"></el-table-column>
      <!-- 收货国家 -->
      <el-table-column label="收货国家" prop="address.country_name"></el-table-column>
      <!-- 包裹数 -->
      <el-table-column label="包裹数" prop="package_count"></el-table-column>
      <!-- 预计重量KG -->
      <el-table-column :label="activeName === '1' ? '预计重量kg' : '实际重量kg'" :prop="activeName === '1' ? 'except_weight' : 'except_weight'"></el-table-column>
      <!-- 详见产品图 -->
      <el-table-column :label="activeName === '1' ? '预计费用' : '实际费用'" :prop="activeName === '1' ? 'payment_fee' : 'actual_payment_fee'"></el-table-column>
      <el-table-column label="申报价值￥" prop="declare_value"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column label="提交时间" prop="updated_at"></el-table-column>
      <el-table-column label="拣货时间" prop="packed_at" v-show="activeName === '2'"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-purple detailsBtn" @click="details(scope.row.id)">详情</el-button>
          <el-button v-show="activeName === '1'" class="btn-dark-green detailsBtn" @click="packed(scope.row.id,scope.row.order_sn)">打包</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small">删除</el-button>
          <el-button size="small" v-if="activeName === '3'">加入发货单</el-button>
          <el-button size="small" v-if="activeName === '3'">添加物流单号</el-button>
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
  created () {
    this.activeName = '1'
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getOrder({
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
    // 打包
    packed (id, orderSN) {
      this.$router.push({ name: 'billPacked', params: { id: id, order_sn: orderSN } })
    },
    // 详情
    details (id) {
      this.$router.push({ name: 'billDetails', params: { id: id } })
    },
    onSelectChange (selection) {
      console.log('select', selection)
    }
  },
  watch: {
    // 监听tab组件参数
    activeName (newValue) {
      switch (newValue) {
        case '1': // 待处理
          this.status = 1
          break
        case '2': // 待支付
          this.page_params.page = 1
          this.status = 2
          break
        case '3': // 待发货
          this.page_params.page = 1
          this.status = 3
          break
        case '4': // 已发货
          this.page_params.page = 1
          this.status = 4
          break
        case '5': // 已签收
          this.page_params.page = 1
          this.status = 5
          break
      }
      this.getList()
    }
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

<template>
  <div class="recording-container">
      <el-table class="data-list" border stripe
      v-loading="tableLoading"
      :data="recordingData">
      <el-table-column type="index" width="55"></el-table-column>
      <!-- 券名称 -->
      <el-table-column label="券名称" prop="name"></el-table-column>
      <!-- 券码 -->
      <el-table-column label="券码" prop="type"></el-table-column>
      <!-- 金额 -->
      <el-table-column label="金额" prop="money">
      </el-table-column>
      <!-- 投放对象 -->
      <el-table-column label="投放对象" prop="status"></el-table-column>
      <!-- 使用时间 -->
      <el-table-column label="使用时间" prop="time"></el-table-column>
      <!-- 订单编码 -->
      <el-table-column label="订单编码" prop="count"></el-table-column>
      <!-- 订单金额 -->
      <el-table-column label="订单金额" prop="number"></el-table-column>
      <!-- 付款时间 -->
      <el-table-column label="付款时间" prop="number"></el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      recordingData: [{
        name: '张文婷',
        type: '现金抵用券',
        money: '22',
        status: '进行中',
        time: '11-11',
        count: '00',
        number: '11'
      }],
      tableLoading: false
    }
  },
  methods: {
    getList () {
      // this.tableLoading = true
      // this.recordingData = []
      // this.$request.getOrder({
      //   status: this.status,
      //   keyword: this.page_params.keyword,
      //   page: this.page_params.page,
      //   size: this.page_params.size
      // }).then(res => {
      //   this.tableLoading = false
      //   if (res.ret) {
      //     // 待发货列表的物流单号添加
      //     res.data.forEach(item => {
      //       item.disabled = true
      //       item.copySN = item.logistics_sn
      //     })
      //     this.recordingData = res.data
      //     this.page_params.page = res.meta.current_page
      //     this.page_params.total = res.meta.total
      //   } else {
      //     this.$notify({
      //       title: '操作失败',
      //       message: res.msg,
      //       type: 'warning'
      //     })
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
.recording-container {
  .tabLength {
    width: 400px !important;
  }
  .detailsBtn {
    margin: 3px 2px !important;
  }
  .noDate {
    text-align: center;
    color: #ccc;
  }
}
</style>

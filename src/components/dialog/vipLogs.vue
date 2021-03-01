<template>
  <el-dialog :visible.sync="show" :title="$t('操作日志')" class="dialog-logs-list"
  @close="clear">
    <h4>{{$t('操作日志')}}</h4>
    <el-table :data="operatorData"
      border
      style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" prop="log" :show-overflow-tooltip="true" width="400"></el-table-column>
      <!-- 时间 -->
      <el-table-column :label="$t('时间')" prop="created_at"></el-table-column>
      </el-table>
  </el-dialog>
</template>
<script>
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      operatorData: [],
      imgVisible: false,
      imgSrc: '',
      localization: {}
    }
  },
  // components: {
  //   NlePagination
  // },
  mixins: [pagination],
  methods: {
    getList () {
      this.$request.getVipLogs(this.id).then(res => {
        if (res.ret) {
          this.operatorData = res.data
          this.localization = res.localization
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        }
      })
    },
    init () {
      this.getList()
    },
    clear () {
      this.page_params.page = 1
      this.id = ''
    }
  }
}
</script>
<style lang="scss">
.dialog-logs-list {
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }
  .el-dialog__close {
    color: #FFF;
  }
 .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
}
</style>

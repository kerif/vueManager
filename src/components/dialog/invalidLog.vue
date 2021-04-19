<template>
  <el-dialog :visible.sync="show" :title="$t('弃件包裹日志')" class="dialog-invalid-log"
  @close="clear">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 原始状态 -->
      <el-table-column
        :label="$t('原始状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.origin_status === 1">{{$t('未入库')}}</span>
          <span v-if="scope.row.origin_status === 2">{{$t('已入库')}}</span>
          <span v-if="scope.row.origin_status === 3">{{$t('已集包')}}</span>
          <span v-if="scope.row.origin_status === 4">{{$t('已发货')}}</span>
          <span v-if="scope.row.origin_status === 5">{{$t('已收货')}}</span>
          <span v-if="scope.row.origin_status === 19">{{$t('弃件包裹')}}</span>
        </template>
      </el-table-column>
      <!-- 更新状态 -->
      <el-table-column
        :label="$t('更新状态')">
          <template slot-scope="scope">
          <span v-if="scope.row.new_status === 1">{{$t('未入库')}}</span>
          <span v-if="scope.row.new_status === 2">{{$t('已入库')}}</span>
          <span v-if="scope.row.new_status === 3">{{$t('已集包')}}</span>
          <span v-if="scope.row.new_status === 4">{{$t('已发货')}}</span>
          <span v-if="scope.row.new_status === 5">{{$t('已收货')}}</span>
          <span v-if="scope.row.new_status === 19">{{$t('弃件包裹')}}</span>
        </template>
      </el-table-column>
      <!-- 操作日志 -->
        <el-table-column
        prop="remark"
        :label="$t('操作日志')">
      </el-table-column>
    <!-- 最后登录时间
        <el-table-column
        prop="last_login_at"
        label="最后登录时间">
      </el-table-column>   -->
    </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div> -->
    <!-- <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div> -->
  </el-dialog>
</template>
<script>
// import NlePagination from '@/components/pagination'
// import { pagination } from '@/mixin'
export default {
  data () {
    return {
      tableData: []
    }
  },
  // components: {
  //   NlePagination
  // },
  // mixins: [pagination],
  methods: {
    getList () {
      this.$request.getInvalidLog(this.id).then(res => {
        if (res.ret) {
          this.tableData = res.data
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        }
      })
    },
    init () {
      this.getList()
    },
    clear () {
      // this.page_params.page = 1
    }
  }
}
</script>
<style lang="scss">
.dialog-invalid-log {
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
}
</style>

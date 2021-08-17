<template>
  <div class="data-container">
    <!-- 表格 -->
    <div class="data-list">
      <el-table border style="width: 100%" :data="allData">
        <el-table-column type="index" width="50" :label="$t('#')"> </el-table-column>
        <el-table-column prop="serial_no" :label="$t('流水号')" width="140"> </el-table-column>
        <el-table-column prop="status" :label="$t('审核状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="noAudit">{{ $t('待审核') }}</span>
            <span v-if="scope.row.status === 1" class="pass">{{ $t('审核通过') }}</span>
            <span v-if="scope.row.status === 2" class="refuse">{{ $t('审核拒绝') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.id" :label="$t('代理ID')" width="100"> </el-table-column>
        <el-table-column prop="user.name" :label="$t('代理昵称')" width="100"> </el-table-column>
        <el-table-column prop="type" :label="$t('提现方式')"> </el-table-column>
        <el-table-column prop="amount" :label="$t('提现金额￥')" width="100"> </el-table-column>
        <el-table-column prop="item_count" :label="$t('提现明细数')" width="100"> </el-table-column>
        <el-table-column prop="created_at" :label="$t('申请时间')" width="100"> </el-table-column>
        <el-table-column prop="operator" :label="$t('处理人')" width="100"> </el-table-column>
        <el-table-column prop="audit_at" :label="$t('处理时间')" width="100"> </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="success"
              plain
              size="mini"
              @click="editDetail(scope.row.id)"
              >{{ $t('审核') }}</el-button
            >
            <el-button
              v-if="scope.row.status === 1 || scope.row.status === 2"
              type="primary"
              plain
              size="mini"
              @click="editDetail(scope.row.id)"
              >{{ $t('详情') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {}
  },
  props: {
    allData: {}
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  created() {
    console.log(this.page_params, 'page_params')
  },
  methods: {
    getList() {
      console.log('getList')
    },
    editDetail(id) {
      this.$emit('subprice', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.data-container {
  .data-list {
    margin-top: 40px;
    /deep/.el-table tr th.is-leaf {
      border-bottom: 1px #ecedf0 solid;
      background-color: #fff;
    }
    /deep/.noAudit {
      color: red;
    }
    /deep/.pass {
      color: green;
    }
    /deep/.refuse {
      color: #e6a23c;
    }
    /deep/.el-table th > .cell {
      text-align: center;
    }
    /deep/.el-table .cell {
      text-align: center;
    }
  }
}
</style>

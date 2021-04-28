<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('认领记录')"
    class="claim-record"
    @close="clear"
    width="60%"
  >
    <div class="top">
      <div class="top-left">
        <el-button @click="unloadNoOwner">{{ $t('导出记录') }}</el-button>
      </div>
      <div class="searchUser">
        <el-input :placeholder="$t('请输入内容')" v-model="keyword" @keyup.enter.native="getList">
          <!-- <template slot="append">
            <span @click="getList" class="search-btn">搜索</span>
          </template> -->
          <el-button
            class="search-btn"
            slot="append"
            @click="getList"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
    </div>
    <el-table class="data-list" border stripe :data="claimData">
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('快递单号')" prop="express_num"></el-table-column>
      <el-table-column :label="$t('认领人')">
        <template slot-scope="scope">
          <span>{{ scope.row.user.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作时间')" prop="created_at"></el-table-column>
      <el-table-column :label="$t('操作人')" prop="operator"></el-table-column>
    </el-table>
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <!-- <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div> -->
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      claimData: [],
      keyword: '',
      user: {},
      urlExcel: ''
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .claimLogs({
          keyword: this.keyword,
          page: this.page_params.page,
          size: this.page_params.size
          // status: this.page_params.group
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.claimData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 导出清单
    unloadNoOwner() {
      this.$request
        .uploadOwner({
          keyword: this.keyword
        })
        .then(res => {
          if (res.ret) {
            this.urlExcel = res.data.url
            // window.location.href = this.urlExcel
            window.open(this.urlExcel)
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: this.$t('操作失败qq'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    clear() {
      this.keyword = ''
      this.page_params.page = 1
    },
    init() {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.claim-record {
  .top {
    overflow: hidden;
  }
  .top-left {
    float: left;
  }
  .searchUser {
    width: 40%;
    float: right;
    margin: 10px 0;
    .el-input-group__append,
    .el-input-group__prepend {
      background-color: #fff;
      border-color: #e8e9eb;
    }
    .search-group .search-btn {
      color: #3540a5 !important;
      border: none !important;
      background-color: #fff !important;
    }
    .el-input-group--append .el-input__inner {
      border-right: none !important;
      border-color: #e8e9eb;
    }
    .el-button {
      color: #3540a5 !important;
      background-color: #fff;
      border: none;
    }
  }
  .search-btn {
    cursor: pointer;
  }
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
}
</style>

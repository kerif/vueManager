<template>
  <div class="reservation--list">
    <el-row class="search-bar" :gutter="16">
      <el-col :span="6">
        <el-input v-model="page_params.keyword" :placeholder="$t('请输入内容')"></el-input>
      </el-col>
      <el-col :span="15">
        <el-button type="primary" @click="search">{{ $t('搜索') }}</el-button>
      </el-col>
      <el-col :span="3" class="export">
        <el-button type="primary" @click="goImport">{{ $t('导入清单') }}</el-button>
      </el-col>
    </el-row>
    <div class="content-tab">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="calc(100vh - 300px)"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column :label="$t('操作')" width="260">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="goDeatil(scope.row.id)">{{
              $t('查看')
            }}</el-button>
            <el-button
              type="danger"
              plain
              size="small"
              v-if="scope.row.used_number == 0"
              @click="deleteReservation(scope.row.id)"
              >{{ $t('刪除') }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="batch" :label="$t('批次号')" width="180"></el-table-column>
        <el-table-column prop="express.name" :label="$t('发货快递公司')"></el-table-column>
        <el-table-column prop="begin_number" :label="$t('开始单号')"></el-table-column>
        <el-table-column prop="end_number" :label="$t('结束单号')"></el-table-column>
        <el-table-column prop="total_numbers" :label="$t('生成数量')"></el-table-column>
        <el-table-column prop="is_available" :label="$t('可用数量')"></el-table-column>
        <el-table-column prop="used_number" :label="$t('使用单号')"></el-table-column>
        <el-table-column prop="invalid_number" :label="$t('作废单号')"></el-table-column>
        <el-table-column prop="created_at" :label="$t('创建时间')"></el-table-column>
      </el-table>
      <nle-pagination
        style="margin-top: 5px"
        :pageParams="page_params"
        :notNeedInitQuery="false"
      ></nle-pagination>
    </div>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'reservationNoList',
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      tableData: [],
      tableLoading: false
    }
  },
  mounted() {
    this.getList({})
  },
  methods: {
    getList(is = {}) {
      let params = {
        page: this.$route.query.page ? this.$route.query.page : this.page_params.page,
        size: this.$route.query.size ? this.$route.query.size : this.page_params.size,
        ...is
      }

      if (this.$route.query.keyword) {
        params['keyword'] = this.$route.query.keyword
      }

      this.$request.reservedNoList(params).then(res => {
        this.tableData = res.data
        this.page_params.total = res.meta.total
      })
    },
    search() {
      const params = {
        keyword: this.page_params.keyword
      }
      this.goSearch(params)
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    //点击导入清单
    goImport() {
      this.$router.push({
        name: 'reservationNoImport'
      })
    },
    //点击详情
    goDeatil(id) {
      this.$router.push({
        name: 'reservationNoDetail',
        query: {
          no_id: id
        }
      })
    },
    deleteReservation(id) {
      this.$confirm(this.$t('您真的要删除此预留单号吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.delReservedNo(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.reservation--list {
  padding: 16px;
  .search-bar {
    background-color: white;
    padding: 32px;
    margin: 0 !important;
    .export {
      text-align: right;
    }
  }
  .content-tab {
    margin-top: 8px;
  }
}
</style>

<template>
  <div class="box-reserved-num">
    <div class="search">
      <div class="search-item">
        <el-input
          v-model="keyword"
          class="search-ipt"
          :placeholder="$t('请输入批次号或单号进行查询')"
        ></el-input>
        <el-button type="primary" @click="onSearch">{{ $t('搜索') }}</el-button>
      </div>
      <div>
        <el-button type="primary" @click="onImport">{{ $t('导入') }}</el-button>
      </div>
    </div>
    <el-table :data="tabelData" border stripe height="calc(100vh - 280px)">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-main" @click="onDetail(scope.row.id)">{{ $t('查看') }}</el-button>
          <el-button class="btn-light-red" @click="onDelete(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="batch_no" :label="$t('批次号')"></el-table-column>
      <el-table-column prop="name" :label="$t('名称')"></el-table-column>
      <el-table-column prop="begin_box_no" :label="$t('开始单号')"></el-table-column>
      <el-table-column prop="end_box_no" :label="$t('结束单号')"></el-table-column>
      <el-table-column prop="count" :label="$t('生成数量')"></el-table-column>
      <el-table-column prop="enabled_count" :label="$t('可用数量')"></el-table-column>
      <el-table-column prop="used_count" :label="$t('使用数量')"></el-table-column>
      <el-table-column prop="invalid_count" :label="$t('作废数量')"></el-table-column>
      <el-table-column prop="created_at" :label="$t('创建时间')"></el-table-column>
    </el-table>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      keyword: '',
      tabelData: []
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request
        .reservedList({
          keyword: this.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tabelData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    onDelete(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.delReservedList(id).then(res => {
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
    },
    onDetail(id) {
      this.$router.push({
        name: 'boxReservedDetail',
        query: { id }
      })
    },
    onImport() {
      this.$router.push({
        name: 'boxReservedImport'
      })
    },
    onSearch() {
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.box-reserved-num {
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 98%;
    padding: 20px;
    background-color: #fff !important;
    margin-bottom: 20px;
    .search-item {
      width: 600px;
      .search-ipt {
        width: 80%;
      }
    }
  }
}
</style>

<template>
  <div class="group-config-container">
    <div class="rate-top">
      <div class="rate-left">{{ $t('公开拼团团长') }}：</div>
      <div class="searchGroup">
        <el-button class="rate-left middle-sty" @click="groupAdd">{{ $t('新增授权') }}</el-button>
        <search-group class="rate-left" v-model="page_params.keyword" @search="goSearch">
        </search-group>
      </div>
    </div>
    <el-table
      :data="configurationData"
      height="calc(100vh - 270px)"
      v-loading="tableLoading"
      ref="table"
      class="data-list"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="id" :label="$t('客户ID')">
        <template slot-scope="scope">
          <span v-if="$store.state.uid === 1">{{ scope.row.uid }}</span
          ><span v-if="$store.state.uid === 1">(</span>
          {{ scope.row.id }}
          <span v-if="$store.state.uid === 1">)</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('客户昵称')" prop="name"></el-table-column>
      <el-table-column :label="$t('客户组')">
        <template slot-scope="scope">
          <span>{{ scope.row.user_group.name_cn }}</span>
        </template>
      </el-table-column>
      <!-- 授权时间 -->
      <el-table-column :label="$t('授权时间')" prop="created_at"></el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column :label="$t('最后登录时间')" prop="last_login_at"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-light-red" @click="deleteGroup(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import { pagination } from '@/mixin'
import NlePagination from '@/components/pagination'
import dialog from '@/components/dialog'
import { SearchGroup } from '@/components/searchs'
export default {
  components: {
    NlePagination,
    SearchGroup
  },
  data() {
    return {
      tableLoading: false,
      configurationData: []
    }
  },
  mixins: [pagination],
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request
        .getLeader({
          page: this.page_params.page,
          size: this.page_params.size,
          keyword: this.page_params.keyword
        })
        .then(res => {
          if (res.ret) {
            this.configurationData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.localization = res.localization
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    groupAdd() {
      dialog({ type: 'groupAdd' }, () => {
        this.getList()
      })
    },
    // 拼团配置 删除
    deleteGroup(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteConfiguration(id).then(res => {
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
<style lang="scss" scoped>
.group-config-container {
  background-color: #fff;
  padding:15px 20px;
  .rate-top {
    overflow: hidden;
  }
  .rate-left {
    display: inline-block;
  }
  .searchGroup {
    margin-right: 10px;
    float: right;
  }
  .middle-sty {
    vertical-align: top;
  }
}
</style>

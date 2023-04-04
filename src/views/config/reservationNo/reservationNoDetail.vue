<template>
  <div class="reservation-detail">
    <div class="detail-top">
      <el-descriptions title="" class="top-content">
        <el-descriptions-item :label="$t('批次号')">{{ info.batch }}</el-descriptions-item>
        <el-descriptions-item :label="$t('发货快递公司')">{{
          info.express && info.express.name
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('创建时间')">{{ info.created_at }}</el-descriptions-item>
        <el-descriptions-item :label="$t('单号总量')">{{
          info.total_numbers
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('已使用')">{{ info.used_number }}</el-descriptions-item>
        <el-descriptions-item :label="$t('作废数量')">{{
          info.invalid_number
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('可用数量')">{{ info.is_available }}</el-descriptions-item>
        <el-descriptions-item :label="$t('备注')">{{ info.remark }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="detail-content">
      <el-row class="search-bar" :gutter="16">
        <el-col :span="6">
          <el-input v-model="page_params.keyword" :placeholder="$t('请输入内容')"></el-input>
        </el-col>
        <el-col :span="3" class="search-btn" :offset="15">
          <el-button type="primary" @click="search">{{ $t('搜索') }}</el-button>
        </el-col>
      </el-row>
      <el-row class="content-tab">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          height="calc(100vh - 420px)"
          :header-cell-style="{ background: '#f3f3f3' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="order_sn" :label="$t('预留单号')" :width="700"></el-table-column>
          <el-table-column :label="$t('使用时间')">
            <template slot-scope="scope">
              <span v-if="scope.row.is_used">{{ scope.row.updated_at }}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="order.order_sn" :label="$t('对应订单号')">
            <template slot-scope="scope">
              <span v-if="scope.row.order">{{ scope.row.order.order_sn }}</span>
              <span v-else></span>
            </template>
          </el-table-column>
        </el-table>
        <nle-pagination
          style="margin-top: 5px"
          :pageParams="page_params"
          :notNeedInitQuery="false"
        ></nle-pagination>
      </el-row>
      <el-button class="void-btn" @click="setInvalid">{{ $t('作废') }}</el-button>
    </div>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'reservationNoDetail',
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      info: {
        express: {
          name: ''
        }
      },
      page_params: {
        keyword: ''
      },
      tableData: [],
      id: 0,
      multipleSelection: []
    }
  },
  mounted() {},
  // watch: {
  //   $route(now, old) {
  //     // now: 变化之后的数据
  //     // old: 变化之前的数据
  //     console.log(now, old)
  //   }
  // },
  watch: {
    //监听路由地址的改变
    $route: {
      immediate: true,
      handler() {
        if (this.$route.query.no_id) {
          console.log(this.$route.query.no_id, 'this.$route.query.no_id')
          //需要监听的参数
          this.id = this.$route.query.no_id
          this.getDetail(this.$route.query.no_id, {})
          this.getList()
        }
      }
    }
  },
  methods: {
    getDetail(id, params) {
      this.$request.reservedNoDetail(id, params).then(res => {
        this.info = res.data
      })
    },
    getList(is = {}) {
      const params = {
        page: this.$route.query.page ? this.$route.query.page : this.page_params.page,
        size: this.$route.query.size ? this.$route.query.size : this.page_params.size,
        ...is
      }
      if (this.$route.query.keyword) {
        params['keyword'] = this.$route.query.keyword
      } else {
        this.page_params.keyword = ''
      }
      this.$request.reservedNoItemList(this.id, params).then(res => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    setInvalid() {
      if (this.multipleSelection.length === 0) {
        this.$notify({
          title: this.$t('操作失败'),
          message: this.$t('请选择要操作的行'),
          type: 'error'
        })
      }
      const ids = []
      this.multipleSelection.map(item => {
        ids.push(item.id)
      })
      this.$request.setInvalid({ ids: ids }).then(res => {
        if (res.ret == 1) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getList()
          this.getDetail(this.id, {})
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.reservation-detail {
  padding: 16px !important;
  display: flex;
  height: calc(100% - 34px);
  flex-direction: column;
  .detail-top {
    background-color: white;
    display: flex;
    justify-content: center;
    padding: 16px 16px 4px 16px;
    .top-content {
      font-size: 16px;
    }
  }
  .detail-content {
    flex: 1;
    background-color: white;
    margin-top: 8px;
    padding: 16px;
    position: relative;
    .search-bar {
      .search-btn {
        text-align: right;
      }
    }
    .content-tab {
      margin-top: 8px;
    }
    .void-btn {
      position: absolute;
      bottom: 16px;
      width: 100px;
    }
  }
  .el-table th.el-table__cell > .cell {
    background-color: #f3f3f3;
  }
}
</style>

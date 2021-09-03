<template>
  <div class="agency-list-container">
    <el-tabs v-model="activeName" @tab-click="onTabChange">
      <el-tab-pane :label="$t('全部')" name="-1">
        <auditData
          :allData="all"
          @subprice="fn"
          :totalSettlement="totalSettlement"
          @passval="onSearch"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('待审核')" name="0">
        <auditData
          :allData="all"
          @subprice="fn"
          :totalSettlement="totalSettlement"
          @passval="onSearch"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('已审核')" name="12">
        <auditData
          :allData="all"
          @subprice="fn"
          :totalSettlement="totalSettlement"
          @passval="onSearch"
        />
      </el-tab-pane>
    </el-tabs>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import auditData from './auditData.vue'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      activeName: '-1',
      all: [],
      resultData: [],
      passData: [],
      page_params: {},
      totalSettlement: 0
    }
  },
  mixins: [pagination],
  components: {
    auditData,
    NlePagination
  },
  created() {
    this.getList()
    this.getSettleAccounts()
  },
  methods: {
    getList(status, param_list) {
      this.$request
        .pendingReview({
          keyword: this.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          status: status !== '-1' ? status : '',
          ...param_list
        })
        .then(res => {
          if (res.ret) {
            this.all = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    editSettled(id) {
      this.$router.push({
        name: 'agencyCommission',
        params: {
          id: id
        }
      })
    },
    fn(id) {
      this.$router.push({
        name: 'viewDetails',
        params: {
          id: id
        }
      })
    },
    getSettleAccounts() {
      this.$request.settleAccounts().then(res => {
        if (res.ret) {
          this.totalSettlement = res.data
        }
      })
    },
    onTabChange(tab) {
      this.page_params.page = 1
      this.getList(tab.name)
    },
    onSearch(params) {
      this.page_params.page = 1
      this.getList(this.activeName, params)
    }
  }
}
</script>

<style lang="scss" scoped>
.agency-list-container {
  background-color: white;
  .headline {
    margin-top: 20px;
    .searchBtn {
      width: 120px;
    }
    .unsettled {
      width: 120px;
    }
  }
}
</style>

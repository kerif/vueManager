<template>
  <div class="agency-list-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部')" name="first">
        <auditData
          :allData="all"
          @subprice="fn"
          :totalSettlement="totalSettlement"
          @passval="getList"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('待审核')" name="second">
        <auditData :allData="resultData" @subprice="fn" :totalSettlement="totalSettlement" />
      </el-tab-pane>
      <el-tab-pane :label="$t('已审核')" name="third">
        <auditData :allData="passData" @subprice="fn" :totalSettlement="totalSettlement" />
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
      activeName: 'first',
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
    getList(param_list) {
      console.log(param_list, 'param_list')
      this.$request
        .pendingReview({
          page: this.page_params.page,
          size: this.page_params.size,
          ...param_list
        })
        .then(res => {
          console.log(res)
          console.log(param_list)
          if (res.ret) {
            this.all = res.data
            this.resultData = this.all.filter(item => item.status_name === '待审核')
            console.log(this.resultData)
            this.passData = this.all.filter(
              item => item.status_name === '审核通过' || item.status_name === '审核拒绝'
            )
            console.log(this.passData)
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    handleClick(tab, event) {
      console.log(tab, event)
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
      console.log(id)
      this.$router.push({
        name: 'viewDetails',
        params: {
          id: id
        }
      })
    },
    getSettleAccounts() {
      this.$request.settleAccounts().then(res => {
        console.log(res)
        if (res.ret) {
          this.totalSettlement = res.data
        }
      })
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

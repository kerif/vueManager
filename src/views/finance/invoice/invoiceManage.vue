<template>
  <div class="invoice-container">
    <el-tabs v-model="activeName" @tab-click="onTabChange">
      <el-tab-pane :label="`${$t('全部')} (${countData.whole || 0})`" name="0">
        <invoice-data :allData="all" @transVal="fn" @passval="onSearch"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('待处理')} (${countData.stay || 0})`" name="1">
        <invoice-data :allData="all" @transVal="fn" @passval="onSearch"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('已开票')} (${countData.complete || 0})`" name="2">
        <invoice-data :allData="all" @transVal="fn" @passval="onSearch"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('已作废')} (${countData.reopen || 0})`" name="3">
        <invoice-data :allData="all" @transVal="fn" @passval="onSearch"></invoice-data>
      </el-tab-pane>
    </el-tabs>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import invoiceData from './invoiceData.vue'
export default {
  name: 'invoiceManage',
  data() {
    return {
      activeName: '0',
      page_params: {
        keyword: '',
        state: ''
      },
      all: [],
      pendData: [],
      invoicedData: [],
      voidedData: [],
      countData: {
        whole: '',
        stay: '',
        complete: '',
        reopen: ''
      }
    }
  },
  components: {
    invoiceData,
    NlePagination
  },
  mixins: [pagination],
  created() {
    this.getList()
    this.getCounts()
  },
  activated() {
    this.getList()
  },
  methods: {
    getList(state, param_list) {
      this.$request
        .manageInvoice({
          page: this.page_params.page,
          size: this.page_params.size,
          keyword: this.keyword,
          state: this.page_params.state,
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
    fn(id) {
      this.$router.push({
        name: 'invoiceDetails',
        params: {
          id: id
        }
      })
    },
    getCounts() {
      this.$request.invoiceCount().then(res => {
        this.countData = res.data
      })
    },
    init() {
      console.log(this.countData.whole)
    },
    onTabChange(tab) {
      this.page_params.page = 1
      this.page_params.state = tab.name == 0 ? '' : tab.name
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
.invoice-container{
  padding: 10px 15px;
  background-color: #fff ;
}
</style>

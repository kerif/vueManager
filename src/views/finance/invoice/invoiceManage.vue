<template>
  <div class="invoice-container">
    <el-tabs v-model="activeName" @tab-click="onTabChange">
      <el-tab-pane :label="`${$t('全部')} (${this.countData.whole || 0})`" name="0">
        <invoice-data :allData="all" @transVal="fn" @passval="onSearch"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('待处理')} (${this.countData.stay || 0})`" name="1">
        <invoice-data :allData="all" @transVal="fn" @passval="onSearch"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('已开票')} (${this.countData.complete || 0})`" name="2">
        <invoice-data :allData="all" @transVal="fn" @passval="onSearch"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('已作废')} (${this.countData.reopen || 0})`" name="3">
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
        keyword: this.keyword,
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
  methods: {
    getList(state, param_list) {
      this.$request
        .manageInvoice({
          ...this.page_params,
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

<style></style>

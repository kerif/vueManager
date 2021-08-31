<template>
  <div class="invoice-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="`${$t('全部')} (${this.countData.whole || 0})`" name="first">
        <invoice-data :allData="all" @transVal="fn" @passval="getList"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('待处理')} (${this.countData.stay || 0})`" name="second">
        <invoice-data :allData="pendData" @transVal="fn" @passval="getList"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('已开票')} (${this.countData.complete || 0})`" name="third">
        <invoice-data :allData="invoicedData" @transVal="fn" @passval="getList"></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="`${$t('已作废')} (${this.countData.reopen || 0})`" name="fourth">
        <invoice-data :allData="voidedData" @transVal="fn" @passval="getList"></invoice-data>
      </el-tab-pane>
    </el-tabs>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import invoiceData from './invoiceData.vue'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'invoiceManage',
  data() {
    return {
      activeName: 'first',
      page_params: {},
      all: [],
      pendData: [],
      invoicedData: [],
      voidedData: [],
      countData: {
        whole: '',
        stay: '',
        complete: '',
        reopen: ''
      },
      stay: ''
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
    getList(param_list) {
      this.$request
        .manageInvoice({
          page: this.page_params.page,
          size: this.page_params.size,
          keyword: this.keyword,
          ...param_list
        })
        .then(res => {
          console.log(res)
          if (res.ret) {
            this.all = res.data
            this.pendData = this.all.filter(item => item.state === 1)
            console.log(this.pendData, '待处理')
            this.invoicedData = this.all.filter(item => item.state === 2)
            console.log(this.invoicedData, '已开票')
            this.voidedData = this.all.filter(item => item.state === 3)
            console.log(this.voidedData, '已作废')
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
        console.log(res)
        this.countData = res.data
      })
    },
    init() {
      console.log(this.countData.whole)
    }
  }
}
</script>

<style></style>

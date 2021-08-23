<template>
  <div class="invoice-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部')" name="first">
        <invoice-data></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="$t('待处理')" name="second">
        <invoice-data></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="$t('已开票')" name="third">
        <invoice-data></invoice-data>
      </el-tab-pane>
      <el-tab-pane :label="$t('已作废')" name="fourth">
        <invoice-data></invoice-data>
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
      page_params: {}
    }
  },
  components: {
    invoiceData,
    NlePagination
  },
  mixins: [pagination],
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style></style>

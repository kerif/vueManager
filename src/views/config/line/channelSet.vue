<template>
  <div class="channel-set-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <el-tab-pane :label="$t('基础信息')" name="1">
        <div class="main-sty">
          <basic-information></basic-information>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('计费设置')" name="2">
        <billng-settings></billng-settings>
      </el-tab-pane>
      <el-tab-pane :label="$t('分区')" name="3">
        <partition-settings></partition-settings>
      </el-tab-pane>
      <el-tab-pane :label="$t('价格表')" name="4">
        <price-list></price-list>
      </el-tab-pane>
      <el-tab-pane :label="$t('渠道增值服务')" name="5">
        <added-services></added-services>
      </el-tab-pane>
      <el-tab-pane :label="$t('渠道规则')" name="6"></el-tab-pane>
      <el-tab-pane :label="$t('面单对接')" name="7"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AddedServices from './addedServices.vue'
import BasicInformation from './basicInformation.vue'
import BillngSettings from './billingSettings.vue'
import PartitionSettings from './partition.vue'
import PriceList from './priceList.vue'
export default {
  components: {
    BasicInformation,
    BillngSettings,
    PartitionSettings,
    PriceList,
    AddedServices
  },
  data() {
    return {
      activeName: '1'
    }
  },
  created() {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    onTabChange() {
      // this.page_params.handleQueryChange('activeName', this.activeName)
    }
  }
}
</script>

<style lang="scss">
.channel-set-container {
  .main-sty {
    background-color: #fff;
  }
}
</style>

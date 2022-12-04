<template>
  <div class="channel-set-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange(activeName)">
      <el-tab-pane :label="$t('基础信息')" name="basic" :lazy="true">
        <div class="main-sty">
          <basic-information v-if="tabRefresh.basic"></basic-information>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('计费设置')"
        name="billng"
        v-if="this.$route.query.state === 'edit'"
        :lazy="true"
      >
        <billng-settings v-if="tabRefresh.billng"></billng-settings>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('分区')"
        name="partition"
        v-if="this.$route.query.state === 'edit'"
        :lazy="true"
      >
        <partition-settings v-if="tabRefresh.partition"></partition-settings>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('价格表')"
        name="price"
        v-if="this.$route.query.state === 'edit'"
        :lazy="true"
      >
        <price-list v-if="tabRefresh.price"></price-list>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('渠道增值服务')"
        name="added"
        v-if="this.$route.query.state === 'edit'"
        :lazy="true"
      >
        <added-services v-if="tabRefresh.added"></added-services>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('渠道规则')"
        name="rules"
        v-if="this.$route.query.state === 'edit'"
        :lazy="true"
      >
        <rules-channle v-if="tabRefresh.rules"></rules-channle>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('面单对接')"
        name="face"
        v-if="this.$route.query.state === 'edit'"
        :lazy="true"
      >
        <face-sheet />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { pagination } from '@/mixin'
import AddedServices from './addedServices.vue'
import BasicInformation from './basicInformation.vue'
import BillngSettings from './billingSettings.vue'
import RulesChannle from './rulesChannle.vue'
import PartitionSettings from './partition.vue'
import PriceList from './priceList.vue'
import FaceSheet from './faceSheet.vue'
export default {
  components: {
    BasicInformation,
    BillngSettings,
    PartitionSettings,
    RulesChannle,
    PriceList,
    AddedServices,
    FaceSheet
  },
  data() {
    return {
      activeName: 'basic',
      tabRefresh: {
        basic: true,
        billng: false,
        partition: false,
        price: false,
        added: false,
        rules: false,
        face: false
      }
    }
  },
  mixins: [pagination],
  created() {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
      this.switchTab(this.activeName)
    }
  },
  methods: {
    onTabChange(activeName) {
      this.activeName = activeName
      this.page_params.handleQueryChange('activeName', this.activeName)
      switch (this.activeName) {
        case 'basic':
          this.switchTab('basic')
          break
        case 'billng':
          this.switchTab('billng')
          break
        case 'partition':
          this.switchTab('partition')
          break
        case 'price':
          this.switchTab('price')
          break
        case 'added':
          this.switchTab('added')
          break
        case 'rules':
          this.switchTab('rules')
          break
        case 'face':
          this.switchTab('face')
          break
      }
    },
    switchTab(tab) {
      for (let key in this.tabRefresh) {
        if (key === tab) {
          this.tabRefresh[key] = true
        } else {
          this.tabRefresh[key] = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scope>
.channel-set-container {
  .main-sty {
    background-color: #fff;
  }
  // .el-select {
  //   width: 300px;
  // }
  .landing-container {
    background-color: #fff !important;
    padding: 20px;
  }
}
</style>

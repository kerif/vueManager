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
        name="7"
        v-if="this.$route.query.state === 'edit'"
        :lazy="true"
      >
        <div class="landing-container">
          <el-form ref="form" :model="landing" label-width="120px">
            <el-form-item :label="$t('落地配配置')">
              <el-select
                @change="changeChannel"
                v-model="landing.docking_type"
                filterable
                allow-create
                default-first-option
                :placeholder="$t('请选择')"
              >
                <el-option
                  v-for="item in dockingList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('渠道代码')">
              <el-select
                v-model="landing.channel_code"
                filterable
                allow-create
                default-first-option
                :placeholder="$t('请选择')"
              >
                <el-option
                  v-for="item in channelList"
                  :key="item.id"
                  :value="item.code"
                  :label="item.code + '----' + item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveDocking">{{ $t('保存') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AddedServices from './addedServices.vue'
import BasicInformation from './basicInformation.vue'
import BillngSettings from './billingSettings.vue'
import RulesChannle from './rulesChannle.vue'
import PartitionSettings from './partition.vue'
import PriceList from './priceList.vue'
export default {
  components: {
    BasicInformation,
    BillngSettings,
    PartitionSettings,
    RulesChannle,
    PriceList,
    AddedServices
  },
  data() {
    return {
      activeName: 'basic',
      landing: {
        docking_type: '',
        channel_code: ''
      },
      dockingList: [],
      channelList: [],
      tabRefresh: {
        basic: true,
        billng: false,
        partition: false,
        price: false,
        added: false,
        rules: false
      }
    }
  },
  created() {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    // 获取落地陪配置数据
    getDocking() {
      this.$request.dockingPick().then(res => {
        if (res.ret) {
          this.dockingList = res.data
        }
      })
    },
    // 获取渠道代码数据
    getChannel() {
      this.$request.channelCode(this.landing.docking_type).then(res => {
        if (res.ret) {
          this.channelList = res.data
        }
      })
    },
    changeChannel() {
      this.landing.channel_code = ''
      this.channelList = []
      this.getChannel()
    },
    dockData() {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        if (res.ret) {
          this.landing.docking_type = res.data.express_company_id
          this.getChannel()
          this.landing.channel_code = res.data.channel_code
        }
      })
    },
    // 更新落地配配置
    saveDocking() {
      this.$request.updateDocking(this.$route.params.id, { ...this.landing }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.dockData()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onTabChange(activeName) {
      this.activeName = activeName
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
      }
      if (this.activeName === '7') {
        this.getDocking()
        this.dockData()
      }
      // this.page_params.handleQueryChange('activeName', this.activeName)
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

<style lang="scss">
.channel-set-container {
  .main-sty {
    background-color: #fff;
  }
  .el-select {
    width: 300px;
  }
  ::v-deep .el-select-dropdown__item {
    width: 100% !important;
  }
  .landing-container {
    background-color: #fff !important;
    padding: 20px;
  }
}
</style>

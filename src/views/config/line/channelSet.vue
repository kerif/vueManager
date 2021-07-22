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
      <el-tab-pane :label="$t('价格表')" name="4"></el-tab-pane>
      <el-tab-pane :label="$t('渠道增值服务')" name="5"></el-tab-pane>
      <el-tab-pane :label="$t('渠道规则')" name="6"></el-tab-pane>
      <el-tab-pane :label="$t('面单对接')" name="7">
        <div class="landing-container">
          <el-form ref="form" :model="landing" label-width="120px">
            <el-form-item :label="$t('落地配配置')">
              <el-select
                v-model="landing.docking_type"
                clearable
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
import BasicInformation from './basicInformation.vue'
import BillngSettings from './billingSettings.vue'
import PartitionSettings from './partition.vue'
export default {
  components: {
    BasicInformation,
    BillngSettings,
    PartitionSettings
  },
  data() {
    return {
      activeName: '1',
      landing: {
        docking_type: ''
      },
      dockingList: []
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
    dockData() {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        if (res.ret) {
          this.landing.docking_type = res.data.express_company_id
        }
      })
    },
    // 更新落地配配置
    saveDocking() {
      this.$request
        .updateDocking(this.$route.params.id, {
          docking_type: this.landing.docking_type
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    onTabChange() {
      if (this.activeName === '7') {
        this.getDocking()
        this.dockData()
      }
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
  .landing-container {
    background-color: #fff !important;
    padding: 20px;
  }
}
</style>

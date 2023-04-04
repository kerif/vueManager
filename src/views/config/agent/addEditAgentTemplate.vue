<template>
  <div class="agent-template-config">
    <div class="flex">
      <span>{{ $t('模板名称') }}：</span>
      <el-input :placeholder="$t('请输入模板名称')" class="ipt" v-model="params.name"></el-input>
    </div>
    <div class="flex config-box">
      <div class="config-left">
        <div class="font-bold">1.{{ $t('层级设置') }}</div>
        <div class="left-tips">{{ $t('选择佣金层级后，请点击“生成佣金表”') }}</div>
        <div class="flex">
          <span>{{ $t('选择获取佣金层级') }}</span>
          <el-select class="select" v-model="params.level">
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="$t(item.name)"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" plain @click="intTabPanes">{{ $t('生成佣金表') }}</el-button>
        </div>
        <img :src="agentImg" class="img-agent" />
      </div>
      <div class="config-right">
        <div class="font-bold">2.{{ $t('佣金设置') }}</div>
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="item in settingTabs"
            :key="item.id"
            :label="$t(item.name)"
            :name="item.value"
          >
            <commission-config
              :localization="localization"
              :lineList="lineList"
              :config="params.configs[item.value - 1]"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="calc-box">
      <div class="font-bold">3.{{ $t('佣金试算') }}</div>
      <el-row :gutter="60">
        <el-col :span="13">
          <div class="flex ipt-box">
            <div class="left-ipt-box flex-1">
              <div class="flex">
                <div class="label">{{ $t('客户消费渠道') }}</div>
                <el-select
                  :placeholder="$t('请选择渠道')"
                  class="flex-1"
                  v-model="calc.express_line_id"
                  clearable
                >
                  <el-option
                    v-for="item in lineList"
                    :key="item.express_line_id"
                    :label="item.name"
                    :value="item.express_line_id"
                  ></el-option>
                </el-select>
              </div>
              <div class="flex bottom-left">
                <div class="label">{{ $t('订单计佣金额') }}</div>
                <el-input
                  type="number"
                  :placeholder="$t('输入试算金额')"
                  class="label"
                  v-model="calc.amount"
                ></el-input>
                <div class="label">{{ $t('计费重量') }}</div>
                <el-input
                  type="number"
                  :placeholder="$t('输入计费重量')"
                  v-model="calc.payment_weight"
                ></el-input>
              </div>
            </div>
            <el-button type="success" @click="onCounter">{{ $t('计算佣金') }}</el-button>
          </div>
        </el-col>
        <el-col :span="11">
          <el-table :data="resultList" v-show="resultList.length > 0" show-summary size="small">
            <el-table-column>
              <template slot-scope="scope">
                <span>{{ scope.row.level | levelAgentName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="`${$t('获得佣金')}${localization.currency_unit}`"
              prop="commission"
            ></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-button
      class="submit-btn"
      type="primary"
      :loading="$store.state.btnLoading"
      @click="onSave"
      >{{ $t('保存') }}</el-button
    >
  </div>
</template>
<script>
import CommissionConfig from './components/commissionConfig.vue'
export default {
  data() {
    return {
      levelList: [
        { name: '一级', value: 1 },
        { name: '二级', value: 2 },
        { name: '三级', value: 3 }
      ],
      activeName: '1',
      resultList: [],
      lineList: [],
      settingTabs: [],
      localization: {},
      calc: {
        express_line_id: '',
        amount: '',
        payment_weight: ''
      },
      params: {
        name: '',
        level: 1,
        configs: []
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getDetail()
    }
    this.getList()
  },
  methods: {
    // 模板详情
    getDetail() {
      this.$request.commissionSet(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.name = res.data.name
          this.params.level = res.data.configs.length
          Promise.all(res.data.configs.map(item => this.getConfigRules(item.level))).then(
            values => {
              values.forEach(ele => {
                const rules = {}
                ele.data.rules.map(rule => {
                  rules[rule.express_line_id] = {
                    type: rule.type || '',
                    value: rule.value
                  }
                })
                const params = {
                  level: ele.data.level,
                  type: ele.data.type,
                  mode: ele.data.mode,
                  value: ele.data.value,
                  first_order_value: ele.data.first_order_value,
                  rules
                }
                this.$set(this.params.configs, [ele.data.level - 1], params)
              })
              this.intTabPanes()
            }
          )
        }
      })
    },
    getConfigRules(level) {
      return this.$request.agentCommissionConfigs(this.$route.params.id, level)
    },
    // 渠道列表
    getList() {
      this.$request.commissionData().then(res => {
        if (res.ret) {
          this.lineList = res.data.map(item => {
            return {
              express_line_id: item.express_line_id,
              name: item.name
            }
          })
          this.localization = res.localization
          if (!this.$route.params.id) {
            this.intTabPanes()
          }
        }
      })
    },
    // 生成佣金表
    intTabPanes() {
      for (let i = 0; i < this.params.level; i++) {
        if (!this.params.configs[i]) {
          const rules = {}
          this.lineList.map(item => {
            rules[item.express_line_id] = {
              type: item.type || '',
              value: item.value
            }
          })
          const params = {
            level: i + 1,
            type: 1,
            mode: 2,
            value: '',
            rules: rules
          }
          this.params.configs.push(params)
        }
      }
      this.settingTabs = this.levelList.slice(0, this.params.level).map(item => {
        return {
          name: `${item.name}佣金`,
          value: `${item.value}`
        }
      })
    },
    // 获取佣金表
    getConfigs() {
      const configs = this.params.configs.slice(0, this.params.level).map(item => {
        const rules = []
        Object.keys(item.rules).forEach(key => {
          if (item.rules[key].type) {
            rules.push({
              express_line_id: key,
              type: item.rules[key].type,
              value: item.rules[key].value
            })
          }
        })
        return {
          ...item,
          rules
        }
      })
      return configs
    },
    // 保存
    onSave() {
      const method = this.$route.params.id ? 'commissionUpdate' : 'commissionAdd'
      this.$request[method](
        {
          ...this.params,
          configs: this.getConfigs()
        },
        this.$route.params.id
      ).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.$router.go(-1)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 佣金试算
    onCounter() {
      if (!this.calc.amount && !this.calc.payment_weight) {
        return this.$message.error(this.$t('订单计佣金额和计费重量至少填写一个'))
      }
      this.$request
        .agentCommissionCounter({
          ...this.calc,
          level: this.params.level,
          configs: this.getConfigs()
        })
        .then(res => {
          this.resultList = res.data
        })
    }
  },
  computed: {
    agentImg() {
      switch (this.params.level) {
        case 1:
          return require('../../../assets/agent01.png')
        case 2:
          return require('../../../assets/agent02.png')
        default:
          return require('../../../assets/agent03.png')
      }
    }
  },
  filters: {
    levelAgentName(level) {
      switch (level) {
        case 1:
          return '一级代理'
        case 2:
          return '二级代理'
        default:
          return '三级代理'
      }
    }
  },
  components: {
    CommissionConfig
  }
}
</script>
<style lang="scss">
.agent-template-config {
  font-size: 15px;
  .flex {
    display: flex;
    align-items: center;
  }
  .ipt {
    max-width: 350px;
  }
  .config-box {
    margin: 10px 0;
    align-items: stretch;
  }
  .config-left,
  .config-right,
  .calc-box {
    background-color: #fff;
    padding: 20px;
  }
  .config-left {
    flex: 2;
    margin-right: 10px;
  }
  .config-right {
    flex: 3;
  }
  .left-tips {
    display: inline-block;
    background-color: #ebf4e7;
    border-radius: 5px;
    padding: 8px;
    font-size: 14px;
    margin: 10px 0;
  }
  .select {
    margin: 0 10px;
  }
  .el-tabs__header {
    background-color: #f6f6f6;
    margin: 10px 0 0;
  }
  .el-tabs__active-bar {
    height: 4px;
  }
  .el-tabs__nav-wrap {
    padding-left: 20px;
    &::after {
      height: 3px;
      background-color: #fff;
    }
  }
  .img-agent {
    width: 100%;
    max-width: 420px;
    margin-top: 15px;
  }
  .submit-btn {
    margin-top: 20px;
    min-width: 120px;
  }
  .label {
    margin-right: 10px;
  }
  .flex-1 {
    flex: 1;
  }
  .left-ipt-box {
    margin-right: 25px;
    white-space: nowrap;
  }
  .bottom-left {
    margin-top: 15px;
  }
  .ipt-box {
    align-items: stretch;
  }
}
</style>

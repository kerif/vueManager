<template>
  <div class="channel-rules-container">
    <el-form ref="form" :model="form" class="form-sty">
      <el-form-item :label="$t('以下规则收费方式')">
        <el-radio :label="0" v-model="form.rule_fee_mode">{{ $t('同时收取') }}</el-radio>
        <el-radio :label="1" v-model="form.rule_fee_mode">{{
          $t('每个分区仅按最高项规则收取')
        }}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('所有规则最高收费')">
        <el-input
          v-model="form.max_rule_fee"
          class="input-sty"
          :placeholder="$t('请输入值（空值为不限制）')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveRules">{{ $t('保存') }}</el-button>
      </el-form-item>
    </el-form>
    <div class="add-sty">
      <el-button @click="addChannel" type="primary">{{ $t('新增') }}</el-button>
    </div>
    <div class="rules-main" v-for="(item, index) in channel" :key="index">
      <div class="rules-top">
        <div class="rules-left">
          <el-input v-model="item.name" v-if="item.state"></el-input>
          <h3 v-else>{{ item.name }}</h3>
        </div>
        <div class="rules-right">
          <el-button @click="editState(item)">{{ $t('修改') }}</el-button>
          <el-button @click="deleteChannel(index, channel, item.id)">{{ $t('删除') }}</el-button>
        </div>
      </div>
      <div class="line"></div>
      <el-form ref="form" label-width="100px">
        <el-form-item :label="$t('应用分区')">
          <el-select
            :disabled="!item.state"
            v-model="item.region_ids"
            multiple
            :placeholder="$t('请选择')"
            clearable
          >
            <el-option
              v-for="item in patitionData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('限定条件')">
          <el-select
            :disabled="!item.state"
            v-model="item.is_and"
            :placeholder="$t('请选择')"
            clearable
          >
            <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="table-sty">
          <div class="add-row" v-if="item.state">
            <el-button @click="addRow(item.conditions)" class="btn-deep-purple">{{
              $t('新增')
            }}</el-button>
          </div>
          <el-table :data="item.conditions" border>
            <el-table-column :label="$t('参数')">
              <template slot-scope="scope">
                <el-select
                  :disabled="!item.state"
                  v-model="scope.row.param"
                  :placeholder="$t('请选择')"
                  clearable
                >
                  <el-option
                    v-for="item in paramData"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('比较符')">
              <template slot-scope="scope">
                <el-select
                  :disabled="!item.state"
                  v-model="scope.row.comparison"
                  :placeholder="$t('请选择')"
                  clearable
                >
                  <el-option
                    v-for="item in conditionOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('值')">
              <template slot-scope="scope">
                <el-input :disabled="!item.state" v-model="scope.row.value"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')" v-if="item.state">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, item.conditions)"
                  class="btn-light-red"
                  >{{ $t('移除') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item :label="$t('限定方式')">
          <!-- <span>满足以下条件之一</span> -->
          <el-radio-group v-model="item.type" v-if="item.state">
            <el-radio :label="1">{{ $t('按订单收费') }}</el-radio>
            <el-radio :label="2">{{ $t('按箱收费') }}</el-radio>
            <el-radio :label="3">{{ $t('按单位计费重量收费') }}</el-radio>
            <el-radio :label="4">{{ $t('限制出仓') }}</el-radio>
          </el-radio-group>
          <div v-else>
            <span v-if="item.type === 1">{{ $t('按订单收费') }}</span>
            <span v-if="item.type === 2">{{ $t('按箱收费') }}</span>
            <span v-if="item.type === 3">{{ $t('按单位计费重量收费') }}</span>
            <span v-if="item.type === 4">{{ $t('限制出仓') }}</span>
          </div>
        </el-form-item>
        <div v-if="item.type === 4">
          <el-form-item :label="$t('限制出仓提示')">
            <el-input
              :disabled="!item.state"
              type="textarea"
              v-model="item.notice"
              class="tips-sty"
            ></el-input>
          </el-form-item>
          <el-form-item v-for="lang in stringData" :key="lang.id" :label="lang.name">
            <el-input
              :disabled="!lang.state"
              v-model="lang.value"
              type="textarea"
              class="tips-sty"
              :rows="2"
              :placeholder="$t('请输入内容')"
            ></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item :label="$t('收费方式')">
            <el-select
              :disabled="!item.state"
              v-model="item.charge_mode"
              :placeholder="$t('请选择')"
              clearable
            >
              <el-option
                v-for="item in charginData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input
              :disabled="!item.state"
              class="input-sty input-margin"
              v-model="item.value"
              :placeholder="$t('请输入固定值或百分比%')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('收费范围')">
            <el-input
              :disabled="!item.state"
              class="input-sty"
              v-model="item.min_charge"
              :placeholder="$t('请输入最低收费（空值为不设限制）')"
            ></el-input>
            <el-input
              :disabled="!item.state"
              class="input-sty input-margin"
              v-model="item.max_charge"
              :placeholder="$t('请输入最高收费（空值为不设限制）')"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="btn-sty">
        <el-button>{{ $t('取消') }}</el-button>
        <el-button @click="saveChannles(item)">{{ $t('保存') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        max_rule_fee: '',
        rule_fee_mode: 0
      },
      paramData: [],
      patitionData: [],
      conditionOptions: [
        {
          id: '>',
          name: this.$t('大于')
        },
        {
          id: '>=',
          name: this.$t('大于等于')
        },
        {
          id: '<',
          name: this.$t('小于')
        },
        {
          id: '<=',
          name: this.$t('小于等于')
        },
        {
          id: '=',
          name: this.$t('等于')
        }
      ],
      typeData: [
        {
          id: 0,
          name: this.$t('同时满足以下条件')
        },
        {
          id: 1,
          name: this.$t('满足以下条件之一')
        }
      ],
      charginData: [
        {
          id: 1,
          name: this.$t('固定金额')
        },
        {
          id: 2,
          name: this.$t('申报价值比例')
        },
        {
          id: 3,
          name: this.$t('运费价格比例（仅运费）')
        }
      ],
      stringData: [],
      channel: [
        {
          name: '',
          is_and: '',
          type: '',
          charge_mode: '',
          value: '',
          min_charge: '',
          max_charge: '',
          region_ids: '',
          notice: '',
          conditions: [
            {
              param: '',
              comparison: '',
              value: ''
            }
          ]
        }
      ]
    }
  },
  created() {
    this.getParams()
    this.getRegions()
    this.getBaseRules()
    this.getString()
    this.getPartition()
    this.getRulesData()
  },
  methods: {
    getRulesData() {
      this.$request.getNewRules(this.$route.params.id).then(res => {
        if (res.ret) {
          this.channel = res.data.map(item => {
            return {
              ...item,
              state: false
            }
          })
          console.log(this.channel, 'this.channel')
          this.stringData = this.stringData.map(item => {
            const value = res.data.notice_translations[item.language_code]
            return {
              ...item,
              state: false,
              value
            }
          })
        }
      })
    },
    // 获取分区数据
    getPartition() {
      this.$request.regionsAll(this.$route.params.id).then(res => {
        if (res.ret) {
          this.patitionData = res.data
        }
      })
    },
    // 获取规则数据
    getBaseRules() {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        if (res.ret) {
          this.form.max_rule_fee = res.data.max_rule_fee
          this.form.rule_fee_mode = res.data.rule_fee_mode
        }
      })
    },
    // 更新 规则数据
    saveRules() {
      this.$request
        .updateBaseRules(this.$route.params.id, {
          max_rule_fee: this.form.max_rule_fee,
          rule_fee_mode: this.form.rule_fee_mode
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getBaseRules()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 获取分区数据
    getRegions() {
      this.$request.regionsAll(this.$route.params.id).then(res => {
        if (res.ret) {
          this.regionsDatas = res.data
        }
      })
    },
    // 获取参数
    getParams() {
      this.$request.getConditions(this.$route.params.id).then(res => {
        if (res.ret) {
          this.paramData = res.data
        }
      })
    },
    // 获取全部支持语言
    getString() {
      this.$request.getString().then(res => {
        if (res.ret) {
          this.stringData = res.data.filter(item => item.language_code !== 'zh_CN')
        }
      })
    },
    // 新增
    addChannel() {
      this.channel.push({
        conditions: [],
        state: true
      })
    },
    editState(state) {
      state.state = true
    },
    deleteChannel(index, item, id) {
      console.log(id, 'id')
      if (id) {
        this.$request.deleteNewRules(this.$route.params.id, id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getRulesData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        item.splice(index, 1)
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // 新增行
    addRow(item) {
      console.log(item, 'item')
      item.push({
        param: '',
        comparison: '',
        value: ''
      })
    },
    saveChannles(item) {
      let translation = {}
      this.stringData.forEach(item => {
        translation[item.language_code] = item.value
      })
      console.log(item, 'item')
      if (item.id) {
        this.$request
          .updateNewRules(this.$route.params.id, item.id, {
            ...item,
            notice_translations: item.type === 4 ? translation : ''
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getRulesData()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
        this.$request
          .newRules(this.$route.params.id, {
            ...item,
            notice_translations: item.type === 4 ? translation : ''
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getRulesData()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      }
    }
  }
}
</script>
<style lang="scss">
.channel-rules-container {
  .input-sty {
    width: 19%;
  }
  .input-margin {
    margin-left: 10px;
  }
  .tips-sty {
    width: 50%;
  }
  .form-sty {
    background-color: #fff;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  .rules-main {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .rules-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
  }
  .add-sty {
    text-align: right;
    margin-bottom: 10px;
  }
  .line {
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 10px;
  }
  .table-sty {
    margin-left: 10%;
    width: 60%;
  }
  .add-row {
    margin-bottom: 10px;
    text-align: right;
  }
  .btn-sty {
    text-align: right;
  }
}
</style>

<template>
  <div class="line-list-container">
    <div class="add-btn-box">
      <el-row :gutter="10">
        <el-col :span="5">
          <el-select :placeholder="$t('线路名称')" multiple filterable
            collapse-tags v-model="query.lineName">
            <el-option v-for="(item, index) in lineNameColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select :placeholder="$t('支持仓库')" v-model="query.warehouses" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in warehousesColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select :placeholder="$t('是否启用')" v-model="query.enabled">
            <el-option v-for="item in enableList" :key="item.value"
              :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="11">
          <el-button type="success" @click="onHighSearch">{{ highSearch ? $t('取消高级搜索') : $t('高级搜索') }}</el-button>
          <el-button type="primary" @click="onSearch">{{$t('搜索')}}</el-button>
          <el-button type="primary" plain @click="onReset">{{$t('重置')}}</el-button>
          <add-btn router="lineadd">{{$t('添加路线')}}</add-btn>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top:15px" v-show="highSearch">
        <el-col :span="4">
          <el-select :placeholder="$t('支持国家/地区')" v-model="query.countries" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in countriesColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select :placeholder="$t('参考时效')" v-model="query.referenceTime" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in referenceTimeColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select :placeholder="$t('首重')" v-model="query.firstWeight" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in firstWeightColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select :placeholder="$t('首费')" v-model="query.firstMoney" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in firstMoneyColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select :placeholder="$t('续费')" v-model="query.nextWeight" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in nextWeightColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <el-table stripe border class="data-list" :data="lineList"
      v-loading="tableLoading">
      <el-table-column type="expand">
        <template slot-scope="scope">
          {{scope.row.remark || "无" }}
        </template>
      </el-table-column>
      <!-- 线路名称 -->
      <el-table-column :label="$t('线路名称')" prop="name"></el-table-column>
      <!-- 支持国家/地区 -->
      <el-table-column :label="$t('支持国家/地区')" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          <span v-for="item in scope.row.countries" :key="item.id">
            {{item.name}}
          </span>
        </template>
      </el-table-column>
      <!-- 支持仓库 -->
      <el-table-column :label="$t('支持仓库')">
        <template slot-scope="scope">
          <span v-for="item in scope.row.warehouses" :key="item.id">
            {{item.warehouse_name}}
          </span>
        </template>
      </el-table-column>
      <!-- 参考时效 -->
      <el-table-column :label="$t('参考时效')" prop="reference_time"></el-table-column>
      <!-- 首重 -->
      <el-table-column :label="$t('首重') + this.localization.weight_unit" prop="first_weight"></el-table-column>
      <!-- 首费 -->
      <el-table-column :label="$t('首费') + this.localization.currency_unit" prop="first_money"></el-table-column>
      <!-- 续重 -->
      <el-table-column :label="$t('续重') + this.localization.weight_unit" prop="next_weight"></el-table-column>
      <!-- 续费 -->
      <el-table-column :label="$t('续费') + this.localization.currency_unit" prop="next_money"></el-table-column>
      <!-- 最大重量 -->
      <el-table-column :label="$t('最大重量') + this.localization.weight_unit" prop="max_weight"></el-table-column>
      <!-- 最小重量 -->
      <el-table-column :label="$t('最小重量') + this.localization.weight_unit" prop="min_weight"></el-table-column>
      <!-- 是否启用 -->
      <el-table-column :label="$t('是否启用')" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onLang(scope.row, item)"></span>
          <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template slot-scope="scope">
          <el-button class="btn-green others-btn" @click="editLine(scope.row.id)">{{$t('修改')}}</el-button>
          <el-button class="btn-deep-purple others-btn" @click="goOthers(scope.row.id)">{{$t('附加费用')}}</el-button>
          <!-- <el-button class="btn-purple others-btn" @click="addFee(scope.row.id)">额外收录信息</el-button> -->
          <!-- 高级配置 -->
          <el-button class="btn-purple others-btn" @click="Advanced(scope.row.id)">{{$t('高级配置')}}</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <!-- 导出清单 -->
          <el-button class="btn-main others-btn" @click="unloadShip">{{$t('导出清单')}}</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <!-- 高级配置 -->
    <el-dialog
      class="add-company"
      :title="$t('高级设置')"
      :visible.sync="dialogVisible"
      width="45%">
      <el-form ref="form" :model="company" label-width="220px">
        <!-- <el-form-item :label="$t('是否自提线路')">
           <el-select v-model="company.company" clearable filterable
            allow-create default-first-option :placeholder="$t('请选择')">
              <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :value="item.code"
                  :label="item.name">
              </el-option>
            </el-select>
          </el-form-item> -->
        <el-form-item :label="$t('是否自提线路')">
            <el-switch
              v-model="company.is_delivery"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
          </el-form-item>
        <el-form-item :label="$t('默认自提点')">
           <el-select v-model="company.default_pickup_station_id" clearable filterable
            allow-create default-first-option :placeholder="$t('请选择')">
              <el-option
                  v-for="item in pickList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item :label="$t('打包自动生成货到付款订单')">
            <el-switch
              v-model="company.should_auto_delivery"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
          </el-form-item>
        </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="updateAuto">{{$t('确定')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import AddBtn from '@/components/addBtn'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  mixins: [pagination],
  components: {
    AddBtn,
    NlePagination
  },
  data () {
    return {
      lineList: [
        {
          enabled: true
        }
      ],
      localization: {},
      tableLoading: false,
      lineNameColumn: [], // 线路名称列表
      warehousesColumn: [], // 支持仓库列表
      referenceTimeColumn: [], // 参考时效列表
      countriesColumn: [], // 支持国家列表
      firstWeightColumn: [], // 首重列表
      firstMoneyColumn: [], // 首费列表
      nextWeightColumn: [], // 续重列表
      highSearch: false,
      query: {
        enabled: '', // 是否启用
        lineName: [], // 线路名称
        referenceTime: [], // 参考时效
        countries: [], // 支持国家
        warehouses: [], // 支持仓库
        firstWeight: [], // 首重
        firstMoney: [], // 首费
        nextWeight: [] // 续重
      },
      enableList: [
        { label: this.$t('是'), value: 1 },
        { label: this.$t('否'), value: 0 }
      ],
      languageData: [],
      transCode: '',
      dialogVisible: false,
      company: {
        should_auto_delivery: '',
        default_pickup_station_id: '',
        is_delivery: ''
      },
      pickList: [],
      advancedId: ''
    }
  },
  created () {
    this.getLanguageList() // 获取支持语言
    // this.getList()
    // 获取线路名称筛选列表
    this.getColumnList('name', 'lineNameColumn')
    // 获取支持仓库筛选列表
    this.getColumnList('warehouses.warehouse_name', 'warehousesColumn')
    // 获取参考时效筛选列表
    this.getColumnList('reference_time', 'referenceTimeColumn')
    // 获取支持国家筛选列表
    this.getColumnList('countries.name', 'countriesColumn')
    // 获取首重筛选列表
    this.getColumnList('first_weight', 'firstWeightColumn')
    // 获取首费筛选列表
    this.getColumnList('first_money', 'firstMoneyColumn')
    // 获取续重筛选列表
    this.getColumnList('next_weight', 'nextWeightColumn')
    let routeQuery = this.$route.query
    if (routeQuery.lineName) {
      this.query.lineName = decodeURIComponent(routeQuery.lineName).split(',')
    }
    if (routeQuery.enabled) {
      this.query.enabled = Number(routeQuery.enabled)
    }
    if (routeQuery.firstWeight) {
      this.query.firstWeight = routeQuery.firstWeight.split(',').map(item => Number(item))
    }
    if (routeQuery.firstMoney) {
      this.query.firstMoney = routeQuery.firstMoney.split(',').map(item => Number(item))
    }
    if (routeQuery.nextWeight) {
      this.query.nextWeight = routeQuery.nextWeight.split(',').map(item => Number(item))
    }
    if (routeQuery.referenceTime) {
      this.query.referenceTime = decodeURIComponent(routeQuery.referenceTime).split(',')
    }
    if (routeQuery.countries) {
      this.query.countries = decodeURIComponent(routeQuery.countries).split(',')
    }
    if (routeQuery.warehouses) {
      this.query.warehouses = decodeURIComponent(routeQuery.warehouses).split(',')
    }
    if (routeQuery.highSearch) {
      this.highSearch = !!Number(routeQuery.highSearch)
    }
    this.onSearch()
  },
  methods: {
    getList (query = '') {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
      }
      if (typeof this.query.enabled === 'number') {
        params.enabled = this.query.enabled
      }
      if (query) {
        params.queries = query
      }
      this.$request.getLines(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.lineList = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 修改线路
    editLine (id) {
      this.$router.push({ name: 'lineedit',
        params: {
          state: 'edit',
          id: id
        } }
      )
    },
    // 额外收录信息
    addFee (id) {
      dialog({ type: 'feeList', id: id })
    },
    // 获取高级配置
    getSorting () {
      this.$request.getExpressLine(this.advancedId).then(res => {
        if (res.ret) {
          this.company.is_delivery = res.data.is_delivery
          this.company.default_pickup_station_id = res.data.default_pickup_station_id
          this.company.should_auto_delivery = res.data.should_auto_delivery
        }
      })
    },
    // 获取自提点数据
    getPick () {
      this.$request.autoPick(this.advancedId).then(res => {
        if (res.ret) {
          this.pickList = res.data
        }
      })
    },
    // 高级配置
    Advanced (id) {
      this.advancedId = id
      this.dialogVisible = true
      this.getSorting()
      this.getPick()
    },
    // 导出清单
    unloadShip (id) {
      this.$request.importLines(id).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          // window.location.href = this.urlExcel
          window.open(this.urlExcel)
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    goOthers (id) {
      this.$router.push({
        name: 'othersCost',
        params: {
          id: id
        }
      })
    },
    // 更新 高级配置
    updateAuto () {
      this.$request.updateAutoPick(this.advancedId, {
        ...this.company
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.dialogVisible = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改转账支付的开关
    changeTransfer (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.resetLines(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取筛选条件某一列得列表
    getColumnList (column = '', param) {
      let arr = column.split('.')
      this.$request.getLineColumnList(column).then(res => {
        if (res.ret) {
          this[param] = res.data.map(item => item[arr[arr.length - 1]])
        }
      })
    },
    // 获取支持语言
    getLanguageList () {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 高级搜索
    onHighSearch () {
      if (this.highSearch) {
        // 取消高级搜索
        this.query.countries = []
        this.query.firstWeight = []
        this.query.firstMoney = []
        this.query.nextWeight = []
        this.query.warehouses = []
      }
      this.highSearch = !this.highSearch
    },
    // 重置筛选条件
    onReset () {
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          if (key === 'enabled') {
            this.query[key] = ''
          } else {
            this.query[key] = []
          }
        }
      }
      this.getList()
    },
    // 修改语言
    onLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'lineLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
      })
    },
    // 搜索
    onSearch () {
      this.page_params.page = 1
      let arr = []
      for (const key in this.query) {
        let value = this.query[key]
        if (this.query.hasOwnProperty(key) && key !== 'enabled' && value.length) {
          let param = ''
          switch (key) {
            case 'lineName':
              param = 'name'
              break
            case 'warehouses':
              param = 'warehouses.warehouse_name'
              break
            case 'referenceTime':
              param = 'reference_time'
              break
            case 'countries':
              param = 'countries.name'
              break
            case 'firstWeight':
              param = 'first_weight'
              break
            case 'firstMoney':
              param = 'first_money'
              break
            case 'nextWeight':
              param = 'next_weight'
              break
          }
          arr.push(this.getSearchValue(param, value))
        }
      }
      console.log(arr.join('|'))
      this.getList(arr.join('|'))
    },
    getSearchValue (key, value) {
      return `${key}:${value.join(',')};asc`
    }
  },
  watch: {
    'query.enabled': function (val) {
      this.handleQueryChange('enabled', val)
    },
    'query.firstWeight': function (val) {
      this.handleQueryChange('firstWeight', val.join(','))
    },
    'query.firstMoney': function (val) {
      this.handleQueryChange('firstMoney', val.join(','))
    },
    'query.nextWeight': function (val) {
      this.handleQueryChange('nextWeight', val.join(','))
    },
    'query.lineName': function (val) {
      this.handleQueryChange('lineName', encodeURIComponent(val.join(',')))
    },
    'query.referenceTime': function (val) {
      this.handleQueryChange('referenceTime', encodeURIComponent(val.join(',')))
    },
    'query.countries': function (val) {
      this.handleQueryChange('countries', encodeURIComponent(val.join(',')))
    },
    'query.warehouses': function (val) {
      this.handleQueryChange('warehouses', encodeURIComponent(val.join(',')))
    },
    highSearch (val) {
      this.handleQueryChange('highSearch', ~~val)
    }
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  }
}
</script>
<style lang="scss">
.line-list-container {
  .add-btn-box {
    overflow: hidden;
  }
  .others-btn {
    margin-bottom: 5px;
  }
  .icon-sty {
    cursor: pointer;
    // text-align: center;
    // padding-left: 40px;
    font-weight: 700;
    color: black;
  }
}
</style>

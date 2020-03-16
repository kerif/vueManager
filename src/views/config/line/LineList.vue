<template>
  <div class="line-list-container">
    <div class="add-btn-box">
      <el-row :gutter="10">
        <el-col :span="5">
          <el-select placeholder="线路名称" multiple filterable
            collapse-tags v-model="query.lineName">
            <el-option v-for="(item, index) in lineNameColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select placeholder="支持仓库" v-model="query.warehouses" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in warehousesColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select placeholder="是否启用" v-model="query.enabled">
            <el-option v-for="item in enableList" :key="item.value"
              :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="11">
          <el-button type="success" @click="onHighSearch">{{ highSearch ? '取消高级搜索' : '高级搜索' }}</el-button>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button type="primary" plain @click="onReset">重置</el-button>
          <add-btn router="lineadd">添加路线</add-btn>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top:15px" v-show="highSearch">
        <el-col :span="4">
          <el-select placeholder="支持国家/地区" v-model="query.countries" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in countriesColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select placeholder="参考时效" v-model="query.referenceTime" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in referenceTimeColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select placeholder="首重" v-model="query.firstWeight" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in firstWeightColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select placeholder="首费" v-model="query.firstMoney" multiple
            collapse-tags filterable>
            <el-option v-for="(item, index) in firstMoneyColumn" :key="index"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select placeholder="续费" v-model="query.nextWeight" multiple
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
      <el-table-column label="线路名称" prop="cn_name"></el-table-column>
      <el-table-column label="支持国家/地区">
        <template slot-scope="scope">
          <span v-for="item in scope.row.countries" :key="item.id">
            {{item.cn_name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="支持仓库">
        <template slot-scope="scope">
          <span v-for="item in scope.row.warehouses" :key="item.id">
            {{item.warehouse_name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="参考时效" prop="reference_time"></el-table-column>
      <el-table-column :label="'首重' + this.localization.weight_unit" prop="first_weight"></el-table-column>
      <el-table-column :label="'首费' + this.localization.currency_unit" prop="first_money"></el-table-column>
      <el-table-column :label="'续重' + this.localization.weight_unit" prop="next_weight"></el-table-column>
      <el-table-column :label="'续费' + this.localization.currency_unit" prop="next_money"></el-table-column>
      <el-table-column :label="'最大重量' + this.localization.weight_unit" prop="max_weight"></el-table-column>
      <el-table-column :label="'最小重量' + this.localization.weight_unit" prop="min_weight"></el-table-column>
      <el-table-column label="是否启用" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
            active-text="开"
            inactive-text="关"
            active-color="#13ce66"
            inactive-color="gray">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button class="btn-green others-btn" @click="editLine(scope.row.id)">修改</el-button>
          <el-button class="btn-deep-purple others-btn" @click="goOthers(scope.row.id)">附加费用</el-button>
          <!-- <el-button class="btn-purple others-btn" @click="addFee(scope.row.id)">额外收录信息</el-button> -->
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <!-- 导出清单 -->
          <el-button class="btn-main others-btn" @click="unloadShip">导出清单</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
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
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  },
  created () {
    // this.getList()
    // 获取线路名称筛选列表
    this.getColumnList('cn_name', 'lineNameColumn')
    // 获取支持仓库筛选列表
    this.getColumnList('warehouses.warehouse_name', 'warehousesColumn')
    // 获取参考时效筛选列表
    this.getColumnList('reference_time', 'referenceTimeColumn')
    // 获取支持国家筛选列表
    this.getColumnList('countries.cn_name', 'countriesColumn')
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
            title: '操作失败',
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
    // 导出清单
    unloadShip (id) {
      this.$request.importLines(id).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          // window.location.href = this.urlExcel
          window.open(this.urlExcel)
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
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
    // 修改转账支付的开关
    changeTransfer (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.resetLines(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
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
              param = 'cn_name'
              break
            case 'warehouses':
              param = 'warehouses.warehouse_name'
              break
            case 'referenceTime':
              param = 'reference_time'
              break
            case 'countries':
              param = 'countries.cn_name'
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
}
</style>

<template>
  <div>
    <div class="select-box">
      <add-btn @click.native="addService">{{ $t("添加订单增值服务") }}</add-btn>
    </div>
    <el-table
      :data="valueData"
      v-loading="tableLoading"
      class="data-list"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="name"
        :label="$t('增值服务名称')"
      ></el-table-column>
      <el-table-column
        prop="price"
        :label="'价格' + this.localization.currency_unit"
      ></el-table-column>
      <el-table-column prop="remark" :label="$t('备注')"></el-table-column>
      <el-table-column :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeService($event, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        :label="item.name"
        v-for="item in formatLangData"
        :key="item.id"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row['trans_' + item.language_code]"
            class="el-icon-check icon-sty"
            @click="onService(scope.row, item)"
          ></span>
          <span
            v-else
            class="el-icon-plus icon-sty"
            @click="onService(scope.row, item)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="140px">
        <template slot-scope="scope">
          <el-button
            class="btn-dark-green"
            @click="editService(scope.row.id)"
            >{{ $t("编辑") }}</el-button
          >
          <el-button
            class="btn-light-red"
            @click="deleteService(scope.row.id)"
            >{{ $t("删除") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
    <!-- 保险服务 -->
    <div class="select-box">
      <h4>{{ $t("保险服务") }}</h4>
      &nbsp;&nbsp;&nbsp;
      <!-- v-model="enabled" -->
      <el-switch
        v-model="insuranceEnabled"
        @change="changeInsurance($event)"
        :active-value="1"
        :inactive-value="0"
        :active-text="$t('开')"
        :inactive-text="$t('关')"
        active-color="#13ce66"
        inactive-color="gray"
      >
      </el-switch>
      <el-button
        @click="openLines('insurance')"
        v-if="insuranceEnabled === 1"
        class="openStyle"
        >{{ $t("开启线路") }}</el-button
      >
      <el-button class="add-insurance" @click="goInsurance('insurance')">{{
        $t("保险说明")
      }}</el-button>
    </div>
    <el-table
      :data="insuranceData"
      v-loading="tableLoading"
      class="data-list"
      v-if="insuranceEnabled === 1"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        :label="$t('商品价值') + this.localization.currency_unit"
        prop="divide_string"
      ></el-table-column>
      <el-table-column :label="$t('保价类型')">
        <template slot-scope="scope">
          <span v-if="scope.row.insurance_type === 1">{{ $t("比例") }}</span>
          <span v-if="scope.row.insurance_type === 2">{{
            $t("固定金额")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('保险金额')">
        <template slot-scope="scope">
          <span v-if="scope.row.insurance_type === 1">
            {{ scope.row.insurance_proportion }}%
          </span>
          <span v-if="scope.row.insurance_type === 2">
            {{ localization.currency_unit }}{{ scope.row.insurance_proportion }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('是否强制购买')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_force === 0">{{ $t("否") }}</span>
          <span v-if="scope.row.is_force === 1">{{ $t("是") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="140px">
        <template slot-scope="scope">
          <el-button
            class="btn-dark-green"
            @click="editInsurance(scope.row.id, scope.row.is_start)"
            >{{ $t("编辑") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 关税服务 -->
    <div class="select-box">
      <h4>{{ $t("关税服务") }}</h4>
      &nbsp;&nbsp;&nbsp;
      <!-- v-model="enabled" -->
      <el-switch
        v-model="tariffEnabled"
        @change="changeTariff($event)"
        :active-value="1"
        :inactive-value="0"
        :active-text="$t('开')"
        :inactive-text="$t('关')"
        active-color="#13ce66"
        inactive-color="gray"
      >
      </el-switch>
      <el-button
        @click="openLines('tariff')"
        v-if="tariffEnabled === 1"
        class="openStyle"
        >{{ $t("开启线路") }}</el-button
      >
      <div class="add-insurance">
        <el-button @click="addTariff">{{ $t("添加") }}</el-button>
        <el-button @click="goInsurance('tariff')">{{
          $t("关税说明")
        }}</el-button>
      </div>
    </div>
    <el-table
      :data="tariffData"
      v-loading="tableLoading"
      class="data-list"
      v-if="tariffEnabled === 1"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        :label="$t('商品价值') + this.localization.currency_unit"
      >
        <template slot-scope="scope">
          <span>>{{ scope.row.threshold }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('收费类型')">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">{{ $t("比例") }}</span>
          <span v-if="scope.row.type === 2">{{ $t("固定金额") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('关税金额')">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1"> {{ scope.row.amount }}% </span>
          <span v-if="scope.row.type === 2">
            {{ localization.currency_unit }}{{ scope.row.amount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('是否强制购买')">
        <template slot-scope="scope">
          <span v-if="scope.row.enforce === 0">{{ $t("否") }}</span>
          <span v-if="scope.row.enforce === 1">{{ $t("是") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="140px">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button class="btn-dark-green" @click="editTariff(scope.row.id)">{{
            $t("编辑")
          }}</el-button>
          <!-- 删除 -->
          <el-button
            class="btn-light-red"
            @click="deleteTariff(scope.row.id)"
            >{{ $t("删除") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      tableLoading: false,
      page_params: {
        type: ''
      },
      localization: {},
      languageData: [],
      valueData: [
        {
          enabled: true
        }
      ],
      insuranceEnabled: 0, // 保险服务
      insuranceData: [],
      tariffEnabled: 0, // 关税服务
      tariffData: [] // 关税数据
    }
  },
  created () {
    this.page_params.page = 1
    this.getValue()
    this.getInsurance()
    this.getTariffEnabled() // 获取关税服务开关
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList () {
      this.getValue()
      this.getInsurance()
      this.getTariffEnabled() // 获取关税服务开关
    },
    // 获取全部重量及货币配置
    confirmSetting () {
      this.$request.getLocalization().then(res => {
        this.weightList = res.data.weight
        this.currencyList = res.data.currency
        this.lengthList = res.data.length
      })
    },
    // 获取订单增值服务
    getValue () {
      this.tableLoading = true
      this.$request.getValue({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.valueData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.valueData, 'valueData')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取保险服务
    getInsurance () {
      this.tableLoading = true
      this.$request.getInsurance().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.insuranceEnabled = res.data.enabled
          this.insuranceData = res.data.data
        }
      })
    },
    // 获取关税服务
    getTariffData () {
      this.tableLoading = true
      this.$request.getTariff().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.tariffData = res.data
        }
      })
    },
    // 更改保险服务的开关
    changeInsurance (val) {
      console.log(val, 'val')
      this.$request.changeInsurance(val).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getInsurance()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 保险服务 开启线路
    openLines (val) {
      console.log(val, 'val')
      dialog({ type: 'openLine', state: val })
    },
    // 保险服务 保险说明
    goInsurance (val) {
      console.log(val, 'val')
      dialog({ type: 'explanationAdd', value: val }, () => {
        if (val === 'insurance') {
          this.getInsurance()
        } else if (val === 'tariff') {
          this.getTariffData()
        }
      })
    },
    // 编辑保险服务
    editInsurance (id, start) {
      dialog({ type: 'insuranceEdit', id: id, start: start }, () => {
        this.getInsurance()
      })
    },
    // 获取发货快递公司
    getExpress () {
      this.tableLoading = true
      this.$request.getExpressValue({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.expressData = res.data.map(item => ({ ...item, status: Boolean(item.status) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.valueData, 'valueData')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 订单 增加增值服务
    addService () {
      dialog({ type: 'addService', state: 'add', name: 'addService' }, () => {
        this.getList()
      })
    },
    // 订单 编辑增值服务
    editService (id) {
      dialog({ type: 'addService', state: 'edit', id: id, name: 'editService' }, () => {
        this.getList()
      })
    },
    // 订单 删除 增值服务
    deleteService (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteValue(id).then(res => {
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
      })
    },
    // 订单增值服务 开关启用状态
    changeService (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeValue(id, Number(event)).then(res => {
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
    // 订单增值服务 修改语言
    onService (line, lang) {
      console.log(line, lang)
      this.serviceCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'serviceLang', line: line, lang: lang, transCode: this.serviceCode, state: 'service' }, () => {
        this.getValue()
      })
    },
    // 关税服务 新增
    addTariff (id) {
      dialog({ type: 'tariffEditAdd', state: 'add', currencyUnit: this.localization.currency_unit }, () => {
        this.getTariffData()
      })
    },
    // 关税服务 编辑
    editTariff (id) {
      dialog({ type: 'tariffEditAdd', id: id, state: 'edit', currencyUnit: this.localization.currency_unit }, () => {
        this.getTariffData()
      })
    },
    // 关税服务 删除
    deleteTariff (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.tariffDelete(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getTariffData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 获取关税服务开关状态
    getTariffEnabled () {
      this.$request.tariffEnabled().then(res => {
        if (res.ret) {
          this.tariffEnabled = res.data.status
          if (this.tariffEnabled === 1) {
            this.getTariffData()
          }
        }
      })
    },
    // 更改关税服务的开关
    changeTariff (val) {
      console.log(val, 'val')
      this.$request.changeTariff(val).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getTariffData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}

</script>
<style scoped>
.openStyle {
  margin-left: 10px;
}
</style>

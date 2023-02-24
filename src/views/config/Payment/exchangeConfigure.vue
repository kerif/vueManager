<template>
  <div>
    <div class="rate-top">
      <div class="rate-left">
        1{{ currencyData.name }}=
        <el-input v-model="rate" class="input-sty" :placeholder="$t('请输入')"></el-input>
        <el-select v-model="currency_code" :placeholder="$t('请选择')">
          <el-option
            v-for="item in rateList"
            :key="item.id"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-top: 20px">
        <el-button class="btn-dark-green" @click="saveRate">{{ $t('保存') }}</el-button>
        <el-button class="btn-blue-green" @click="autoGet">{{ $t('自动获取') }}</el-button>
      </div>
    </div>
    <el-table :data="ratesData" v-loading="tableLoading" class="data-list" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('当前币种')" prop="currency_name"> </el-table-column>
      <el-table-column prop="rate" :label="$t('汇率')"></el-table-column>
      <el-table-column :label="$t('是否生效')">
        <template slot-scope="scope">
          <span v-if="scope.row.enabled === 1">{{ $t('是') }}</span>
          <span v-if="scope.row.enabled === 0">{{ $t('否') }}</span>
        </template>
      </el-table-column>
      <!-- 创建人 -->
      <el-table-column :label="$t('创建人')" prop="operator"></el-table-column>
      <!-- 创建时间 -->
      <el-table-column :label="$t('创建时间')" prop="created_at"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.enabled === 0"
            class="btn-dark-green"
            @click="changeRate(scope.row.id)"
            >{{ $t('生效') }}</el-button
          >
          <el-button v-else class="btn-dark-green" @click="changeUnRate(scope.row.id)">{{
            $t('取消生效')
          }}</el-button>
          <el-button class="btn-light-red" @click="deleteRate(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      rate: '',
      currencyData: {},
      ratesData: [],
      tableLoading: false,
      page_params: {
        type: ''
      },
      currency_code: '',
      rateList: []
    }
  },
  created() {
    this.getRate()
    this.getCurrency()
    this.getAllCurrency()
  },
  mounted() {
    this.getRate()
  },
  methods: {
    getList() {
      this.getRate()
      this.getCurrency()
    },
    // 获取当前结算货币
    getCurrency() {
      this.$request.getCurrency().then(res => {
        if (res.ret) {
          this.currencyData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取汇率配置
    getRate() {
      this.$request
        .getRates({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            res.data.forEach(item => {
              this.rateList.forEach(ele => {
                if (item.currency_code === ele.code) {
                  item.currency_name = ele.name
                }
              })
            })
            this.ratesData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.localization = res.localization
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 自动获取
    autoGet() {
      this.$request.autoGet().then(res => {
        if (res.ret) {
          this.rate = res.data.rate
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 新建汇率
    saveRate() {
      if (!this.currency_code) {
        return this.$message.error(this.$t('请选择货币单位'))
      }
      if (!this.rate) {
        return this.$message.error(this.$t('请输入汇率'))
      }
      this.$request
        .saveRate({
          rate: this.rate,
          currency_code: this.currency_code
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getRate()
            this.rate = ''
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 汇率 开启或关闭
    changeRate(id) {
      this.$request.closeRate(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getRate()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 汇率 删除
    deleteRate(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteRate(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getRate()
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
    getAllCurrency() {
      this.$request.getAllRate().then(res => {
        if (res.ret) {
          this.rateList = res.data
        }
      })
    },
    changeUnRate(id) {
      this.$request.startRate(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getRate()
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
<style scoped></style>

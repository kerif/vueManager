<template>
  <div class="settings-container">
    <el-form>
      <!-- 重量单位： -->
      <el-form-item :label="$t('重量单位：')">
        <el-select v-model="weightName" :placeholder="$t('请选择')">
          <el-option
            v-for="item in weightList"
            :key="item.id"
            :value="item.name"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 货币单位： -->
      <el-form-item :label="$t('货币单位：')">
        <el-select v-model="currencyName" :placeholder="$t('请选择')">
          <el-option
            v-for="item in currencyList"
            :key="item.id"
            :value="item.name"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 长度单位 -->
      <el-form-item :label="$t('长度单位：')">
        <el-select v-model="lengthName" :placeholder="$t('请选择')">
          <el-option
            v-for="(item, index) in lengthList"
            :key="index"
            :value="item.name"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('结算货币：')">
        <el-select v-model="currency" :placeholder="$t('请选择')">
          <el-option v-for="item in rateList" :key="item.id" :value="item.code" :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button :loading="$store.state.btnLoading" class="save-btn" @click="saveSetting">{{
        $t('保存')
      }}</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weightName: '',
      weightList: [],
      currencyName: '',
      currencyList: [],
      lengthName: '',
      lengthList: [],
      currency: '',
      rateList: []
    }
  },
  created() {
    this.confirmSetting()
    this.getAllCurrency()
    this.getSetting()
  },
  methods: {
    // 获取全部重量及货币配置
    confirmSetting() {
      this.$request.getLocalization().then(res => {
        this.weightList = res.data.weight
        this.currencyList = res.data.currency
        this.lengthList = res.data.length
      })
    },
    // 获取全部结算货币
    getAllCurrency() {
      this.$request.getAllRate().then(res => {
        if (res.ret) {
          this.rateList = res.data
        }
      })
    },
    // 获取当前选择的重量及货币配置
    getSetting() {
      this.$request.chooseLocalization().then(res => {
        if (res.ret) {
          this.currencyName = res.data.currency_name
          this.weightName = res.data.weight_name
          this.lengthName = res.data.length_name
          this.package_express_line = res.data.package_express_line
          this.currency = res.data.currency
        }
      })
    },
    // 保存当前选择的重量及货币配置
    saveSetting() {
      let weight = this.weightList.filter(item => item.name === this.weightName)
      let currency = this.currencyList.filter(item => item.name === this.currencyName)
      let length = this.lengthList.filter(item => item.name === this.lengthName)
      this.$request
        .confirmLocalization({
          weight_name: weight[0].name,
          weight_symbol: weight[0].symbol,
          currency_name: currency[0].name,
          currency_symbol: currency[0].symbol,
          length_name: length[0].name,
          length_symbol: length[0].symbol,
          currency: this.currency
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.activeName = '1'
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
.save-btn {
  color: #fff;
  background-color: #3540a5;
}
</style>

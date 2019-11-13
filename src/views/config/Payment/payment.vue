<template>
    <div class="payment-container">
      <el-tabs v-model="activeName" class="tabLength" @tab-click="handleClick">
        <!-- 支付配置 -->
        <el-tab-pane label="支付配置" name="1"></el-tab-pane>
        <!-- 物流跟踪配置 -->
        <el-tab-pane label="物流跟踪配置" name="2"></el-tab-pane>
        <!-- 重量及货币配置 -->
        <el-tab-pane label="重量及货币配置" name="3"></el-tab-pane>
      </el-tabs>
      <div v-if="activeName === '1'">
        <el-table  :data="paymentData" v-loading="tableLoading" class="data-list"
        border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="配置">
            <template slot-scope="scope">
              <el-button class="btn-green" @click="configuration(scope.row.id)">配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName === '2'" class="logistics-container">
        <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top">
          <el-form-item label="Appkey" prop="app_key">
            <el-input v-model="logisticsData.app_key" placeholder="请输入Appkey"></el-input>
          </el-form-item>
          <el-form-item label="AppSecret" prop="app_secret">
            <el-input v-model="logisticsData.app_secret" placeholder="请输入AppSecret"></el-input>
          </el-form-item>
        </el-form>
         <div>
          <el-button class="save-btn" @click="confirmLogistic('ruleForm')">保存</el-button>
         </div>
      </div>
      <div v-if="activeName === '3'" class="logistics-container">
        <el-form>
          <el-form-item label="重量单位：">
            <el-radio-group v-model="type_id">
              <el-radio :label="1">KG/千克</el-radio>
              <el-radio :label="2">IB/磅</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="货币单位：">
            <el-radio-group v-model="type_id">
              <el-radio :label="1">¥(人民币)</el-radio>
              <el-radio :label="2">$(加元/美金)</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div>
          <el-button class="save-btn" @click="confirmLogistic('ruleForm')">保存</el-button>
        </div>
      </div>
    </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      paymentData: [
        {
          type: '微信支付'
        }
      ],
      tableLoading: false,
      activeName: '',
      logisticsData: {
        app_key: '',
        app_secret: ''
      },
      type_id: '',
      rules: {
        app_key: [
          { required: true, message: '请输入Appkey', trigger: 'change' }
        ],
        app_secret: [
          { required: true, message: '请输入AppSecret', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.activeName = '1'
  },
  methods: {
    configuration (id) {
      dialog({ type: 'configuration', id: id
      }, () => {
        this.getList()
      })
    },
    getLogisticsData () {
      this.$request.getLogistics().then(res => {
        if (res.ret && res.data) {
          this.logisticsData = res.data
        } else {
          return false
        }
      })
    },
    confirmLogistic (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.editLogistics(this.logisticsData).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '成功',
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
        } else {
          return false
        }
      })
    },
    handleClick () {
      if (this.activeName === '2') {
        this.getLogisticsData()
      } else if (this.activeName === '3') {
        // this.getPick()
      }
    }
  }
}
</script>

<style lang="scss">
.tabLength {
  width: 350px !important;
}
.logistics-container {
  width: 30%;
  .save-btn {
    color: #fff;
    background-color: #3540A5;
  }
}
</style>

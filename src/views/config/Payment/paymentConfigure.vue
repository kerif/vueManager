<template>
  <div>
    <!-- 微信支付 -->
    <h4>{{ $t('在线支付') }}</h4>
    <el-table
      v-if="paymentData.length"
      :data="paymentData"
      v-loading="tableLoading"
      class="data-list"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('类型')" prop="name"></el-table-column>
      <el-table-column :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeOnline($event, scope.row.type)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('配置')">
        <template slot-scope="scope">
          <el-button
            v-if="
              scope.row.type === 1 ||
              scope.row.type === 2 ||
              scope.row.type === 4 ||
              scope.row.type === 5
            "
            class="btn-main"
            @click="configuration(scope.row.type, scope.row.name)"
            >{{ $t('配置') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 转账支付 -->
    <div class="select-box">
      <h4>{{ $t('转账支付') }}</h4>
      <add-btn @click.native="addTransfer">{{ $t('添加支付类型') }}</add-btn>
    </div>
    <el-table :data="transferData" v-loading="tableLoading" class="data-list" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('类型')" prop="name"></el-table-column>
      <el-table-column :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
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
            @click="onLang(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="140px">
        <template slot-scope="scope">
          <el-button class="btn-dark-green" @click="editTransfer(scope.row.id)">{{
            $t('编辑')
          }}</el-button>
          <el-button class="btn-light-red" @click="deleteTransfer(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 预设充值金额 -->
    <div class="select-box">
      <h4>{{ $t('预设充值金额') }}</h4>
      <add-btn @click.native="addRecharge">{{ $t('新增') }}</add-btn>
    </div>
    <el-table :data="rechargeAmount" v-loading="tableLoading" class="data-list" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('金额')" prop="amount"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-light-red" @click="deleteRecharge(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="rechargeDialog"
      width="30%"
      :title="$t('*预设充值金额')"
      @close="clear"
    >
      <el-input v-model="amount"></el-input>
      <div slot="footer">
        <el-button @click="rechargeDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitRecharge">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  components: { AddBtn },
  data() {
    return {
      languageData: [],
      tableLoading: false,
      rechargeDialog: false,
      paymentData: [
        {
          enabled: true
        }
      ],
      transferData: [
        {
          enabled: true
        }
      ],
      amount: '',
      rechargeAmount: []
    }
  },
  created() {
    this.getWechat()
    this.getPayment()
    this.getRecharge()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    //  支付配置 获取在线支付
    getWechat() {
      this.tableLoading = true
      this.$request.getPaymentOnline().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.paymentData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改在线支付的开关
    changeOnline(event, name) {
      console.log(name, 'name')
      this.$request.changePayment(Number(event), name).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getWechat()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 支付配置
    configuration(type) {
      if (type === 1) {
        dialog({ type: 'paypalSet' }, () => {
          this.getWechat()
        })
      } else if (type === 2) {
        dialog({ type: 'configuration' }, () => {
          this.getWechat()
        })
      } else if (type === 4) {
        dialog({ type: 'alipay' }, () => {
          this.getWechat()
        })
      } else if (type === 5) {
        dialog({ type: 'ottPay' }, () => {
          this.getWechat()
        })
      }
    },
    // 增加转账支付配置
    addTransfer() {
      dialog({ type: 'addTransfer', state: 'add' }, () => {
        this.getPayment()
      })
    },
    // 编辑转账支付配置
    editTransfer(id) {
      console.log(id, 'id')
      dialog({ type: 'addTransfer', state: 'edit', id: id }, () => {
        this.getPayment()
      })
    },
    // 删除单条转账支付
    deleteTransfer(id) {
      this.$confirm(this.$t('您真的要删除转账支付吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTransfer(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getPayment()
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
    // 获取转账支付
    getPayment() {
      this.tableLoading = true
      this.$request.getPayments().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transferData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    deleteRecharge(id) {
      this.$request.deleteRechargeAmount(id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getRecharge()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 修改转账支付的开关
    changeTransfer(event, enabled, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.closePayments(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getPayment()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 转账 修改语言
    onLang(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'payLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getPayment()
      })
    },
    // 新增 预设充值金额
    addRecharge() {
      this.rechargeDialog = true
    },
    submitRecharge() {
      if (!this.amount) {
        return this.$message.error(this.$t('请输入预设充值金额'))
      }
      this.$request.updateRechargeAmount(this.amount).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.rechargeDialog = false
          this.getRecharge()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取预设充值金额
    getRecharge() {
      this.tableLoading = true
      this.$request.getRechargeAmount().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.rechargeAmount = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.amount = ''
    }
  }
}
</script>
<style scoped></style>

<template>
  <div>
    <el-tabs v-model="activeName" class="tab-length" @tab-click="handleClick">
      <el-tab-pane :label="`${$t('全部')}(${statusList['0'] || 0})`" name="0"></el-tab-pane>
      <el-tab-pane :label="`${$t('待付款')}(${statusList['1'] || 0})`" name="1"></el-tab-pane>
      <el-tab-pane :label="`${$t('已付款')}(${statusList['10'] || 0})`" name="10"></el-tab-pane>
      <el-tab-pane :label="`${$t('作废')}(${statusList['99'] || 0})`" name="99"></el-tab-pane>
    </el-tabs>
    <div class="order-replenishment-search" v-show="hasFilterCondition">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item prop="state">
          <el-select
            v-model="formInline.state"
            clearable
            size="mini"
            :placeholder="$t('请选择付款状态')"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="pay">
          <el-select
            v-model="formInline.pay"
            clearable
            size="mini"
            :placeholder="$t('请选择付款方式')"
          >
            <el-option
              v-for="item in paymentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="timeList">
          <el-date-picker
            size="mini"
            class="timeStyle"
            v-model="formInline.timeList"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('提交开始日期')"
            :end-placeholder="$t('提交结束日期')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain size="small" @click="submitForm">{{
            $t('搜索')
          }}</el-button>
          <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex; margin-top: 10px">
      <div style="flex: 1">
        <el-button type="primary" size="small" @click="addSupplement">{{
          $t('创建补款单')
        }}</el-button>
        <el-button class="btn-main" @click="setSupplement">{{ $t('补款方式设置') }}</el-button>
      </div>
      <div class="headr-r" style="display: flex">
        <div class="searchGroup">
          <search-group
            :placeholder="$t('请输入关键字')"
            v-model="page_params.keyword"
            @search="goSearch"
          >
          </search-group>
        </div>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px">
      <el-table :data="replenishmentList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="sn" :label="$t('流水号')"></el-table-column>
        <el-table-column prop="status" :label="$t('状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" style="color: red">{{ $t('待支付') }}</span>
            <span v-else-if="scope.row.status === 1">{{ $t('待审核') }}</span>
            <span v-else-if="scope.row.status === 2">{{ $t('审核失败') }}</span>
            <span v-else-if="scope.row.status === 11">{{ $t('已支付') }}</span>
            <span v-else-if="scope.row.status === 12">{{ $t('审核完成') }}</span>
            <span v-else-if="scope.row.status === 99">{{ $t('已作废') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user" :label="$t('所属客户')">
          <template slot-scope="scope">
            <span>{{ scope.row.user.id }} -- {{ scope.row.user.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" :label="$t('关联订单号')"></el-table-column>
        <el-table-column prop="type_name" :label="$t('费用类型')"></el-table-column>
        <el-table-column prop="amount" :label="$t('应付金额')"></el-table-column>
        <el-table-column prop="confirm_amount" :label="$t('实付金额')"></el-table-column>
        <el-table-column prop="payment_type_name" :label="$t('支付方式')"></el-table-column>
        <el-table-column prop="created_at" :label="$t('创建时间')"></el-table-column>
        <el-table-column prop="updated_at" :label="$t('支付时间')"></el-table-column>
        <el-table-column :label="$t('操作')" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              class="btn-green"
              v-if="scope.row.status === 0"
              @click="
                editSupplement(
                  scope.row.id,
                  scope.row.order_sn,
                  scope.row.amount,
                  scope.row.confirm_amount,
                  scope.row.remark
                )
              "
              >{{ $t('修改') }}</el-button
            >
            <el-button
              class="btn-main"
              @click="onDetail(scope.row.id)"
              v-if="scope.row.status === 0 || scope.row.status === 12"
              >{{ $t('详情') }}</el-button
            >
            <el-button class="btn-deep-purple" v-if="scope.row.status === 1">{{
              $t('审核')
            }}</el-button>
            <el-button
              class="btn-light-red"
              v-if="scope.row.status === 0"
              @click="onInvalid(scope.row.id)"
              >{{ $t('作废') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="showConfig" :title="$t('补款方式设置')" @close="clear">
      <el-form label-position="top" :model="form">
        <el-form-item :label="$t('请选择可用收款方式')">
          <el-checkbox-group v-model="form.checkList">
            <el-checkbox v-for="item in paymentList" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showConfig = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import dialog from '@/components/dialog'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      activeName: '0',
      showConfig: false,
      hasFilterCondition: false,
      form: {
        checkList: []
      },
      formInline: {
        pay: '',
        state: '',
        timeList: []
      },
      state: '',
      status: '',
      pay: '',
      begin_date: '',
      end_date: '',
      options: [
        {
          id: 1,
          name: this.$t('待支付')
        },
        {
          id: 2,
          name: this.$t('待审核')
        },
        {
          id: 3,
          name: this.$t('审核失败')
        },
        {
          id: 4,
          name: this.$t('已支付')
        },
        {
          id: 5,
          name: this.$t('审核完成')
        },
        {
          id: 6,
          name: this.$t('已作废')
        }
      ],
      statusList: {},
      replenishmentList: [],
      paymentList: []
    }
  },
  components: {
    NlePagination,
    SearchGroup
  },
  mixins: [pagination],
  created() {
    this.getList()
    this.getPaymentType()
    this.getCounts()
  },
  methods: {
    handleClick(tab) {
      this.page_params.page = 1
      this.status = tab ? tab.name : tab
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.getList()
    },
    getList() {
      this.$request
        .replenishmentList({
          state: this.formInline.state,
          status: this.status,
          pay: this.formInline.pay,
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          begin_date: this.begin_date,
          end_date: this.end_date
        })
        .then(res => {
          if (res.ret) {
            this.replenishmentList = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    getCounts() {
      this.$request.getReplenishCount().then(res => {
        this.statusList = res.data
      })
    },
    getPaymentType() {
      this.$request.paymentData().then(res => {
        this.paymentList = res.data
        this.form.checkList = res.data.filter(item => item.selected === 1).map(item => item.id)
      })
    },
    editSupplement(id, order_sn, amount, confirm_amount, remark) {
      dialog({
        type: 'supplementSheet',
        id,
        order_sn,
        amount,
        confirm_amount,
        remark
      })
    },
    setSupplement() {
      this.showConfig = true
      this.getPaymentType()
    },
    onInvalid(id) {
      this.$request.invalidOrder(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onDetail(id) {
      this.$router.push({
        name: 'orderReplenishDetail',
        params: { id }
      })
    },
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
    },
    onStatus() {
      this.page_params.handleQueryChange('state', this.state)
      this.getList()
    },
    onPay() {
      this.page_params.handleQueryChange('pay', this.pay)
      this.getList()
    },
    submitForm() {
      this.onTime(this.formInline.timeList)
      this.onStatus()
      this.onPay()
    },
    resetForm() {
      this.formInline.pay = ''
      this.formInline.state = ''
      this.formInline.timeList = []
    },
    addSupplement() {
      dialog({
        type: 'supplementSheet'
      })
    },
    submit() {
      this.$request.updatePaymentType({ ids: this.form }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.showConfig = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {}
  }
}
</script>

<style lang="scss">
.order-replenishment-search {
  background: #fff;
  padding-left: 10px;
}
</style>

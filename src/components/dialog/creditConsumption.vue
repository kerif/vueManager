<template>
  <el-dialog
    :title="$t('积分抵扣消费')"
    :visible.sync="show"
    width="50%"
    class="credit dialog-container"
    @close="clearn"
  >
    <div class="item-label">
      <p>{{ $t('抵扣规则') + ':' }}</p>
      1{{ $t('积分') }} = $ <el-input style="width: 100px" v-model="formData.amount"></el-input>
      <div class="tips">{{ '*' + $t('抵扣金额默认计算至小数点后两位') }}（¥0.01）</div>
    </div>
    <div class="item-label">
      <p>{{ $t('可抵扣消费') + ':' }}</p>
      <el-checkbox-group v-model="checkedList">
        <el-checkbox v-for="item in feeList" :key="item.id" :label="item.id">{{
          item.name
        }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="item-label">
      <p>{{ $t('每张订单最高可用积分') + ':' }}</p>
      <el-input v-model="formData.max_point"></el-input>
      <div class="tips">{{ '*' + $t('为空则表示不限制') }}</div>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        amount: '',
        included_fee: [],
        max_point: ''
      },
      feeList: [],
      checkedList: []
    }
  },
  methods: {
    // 积分抵扣消费初始化信息
    getDecrease() {
      this.$request.getDecrease().then(res => {
        if (res.ret) {
          this.feeList = res.data.fee_list
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 积分抵扣消费详情
    getDecreaseDetails() {
      this.$request.getDecreaseDetails().then(res => {
        this.formData.amount = res.data.amount
        this.formData.max_point = res.data.max_point
        this.formData.included_fee = res.data.included_fee
        this.checkedList = res.data.included_fee.filter(item => +item.checked).map(item => item.id)
      })
    },
    submit() {
      const included_fee = this.formData.included_fee.map(item => {
        if (this.checkedList.includes(item.id)) {
          item.checked = 1
        } else {
          item.checked = 0
        }
        return {
          id: item.id,
          checked: item.checked
        }
      })
      this.$request
        .updateDecrease({
          ...this.formData,
          included_fee
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    clearn() {
      this.formData.amount = ''
      this.formData.max_point = ''
      this.formData.included_fee = []
      this.checkedList = []
    },
    init() {
      this.getDecrease()
      this.getDecreaseDetails()
    }
  }
}
</script>
<style scoped lang="scss">
.credit {
  .el-dialog__body {
    padding-top: 0 !important;
  }
  .item-label {
    padding: 10px 0;
  }
  .tips {
    padding-top: 10px;
    color: #ccc;
  }
}
</style>

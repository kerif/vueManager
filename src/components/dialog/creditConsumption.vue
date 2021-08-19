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
      1{{ $t('积分') }} = {{ localization.currency_unit }}
      <el-input style="width: 100px" v-model="formData.amount"></el-input>
      <div class="tips">{{ '*' + $t('抵扣金额默认计算至小数点后两位') }}（¥0.01）</div>
    </div>
    <div class="item-label">
      <p>{{ $t('可抵扣消费') + ':' }}</p>
      <el-checkbox-group v-model="checkedList" class="checked-list">
        <el-checkbox v-for="item in feeList" :key="item.id" :label="item.id">{{
          item.name
        }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="item-label">
      <p>{{ $t('每张订单抵扣限制') + ':' }}</p>
      <el-radio-group
        v-model="formData.decrease_type"
        class="deduction-limit"
        @change="switchRadio"
      >
        <el-radio :label="1">{{ $t('不限制') }}</el-radio>
        <el-radio :label="2">
          {{ $t('限制使用积分') }}
          <el-input
            v-model="numberValue"
            :disabled="formData.decrease_type !== 2"
            style="width: 200px; margin-left: 10px"
            :placeholder="$t('请输入限制积分数值')"
          ></el-input>
        </el-radio>
        <el-radio :label="3">
          {{ $t('限制抵扣运费比例') }}
          <el-input
            v-model="proportion"
            :disabled="formData.decrease_type !== 3"
            style="width: 200px; margin-left: 10px"
            :placeholder="$t('请输入限制抵扣比例')"
          ></el-input>
        </el-radio>
      </el-radio-group>
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
        decrease_type: 0,
        max_value: ''
      },
      numberValue: '',
      proportion: '',
      feeList: [],
      checkedList: [],
      localization: {}
    }
  },
  methods: {
    // 积分抵扣消费初始化信息
    getDecrease() {
      this.$request.getDecrease().then(res => {
        if (res.ret) {
          this.feeList = res.data.fee_list.map(item => {
            let checked = 0
            return {
              ...item,
              checked
            }
          })
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
        this.formData.decrease_type = res.data.decrease_type
        this.formData.included_fee = res.data.included_fee
        if (res.data.included_fee) {
          this.checkedList = res.data.included_fee
            .filter(item => +item.checked)
            .map(item => item.id)
        }
        if (res.data.decrease_type === 2) {
          this.numberValue = res.data.max_value
        } else if (res.data.decrease_type === 3) {
          this.proportion = res.data.max_value
        }
        this.localization = res.localization
      })
    },
    switchRadio() {
      this.numberValue = ''
      this.proportion = ''
    },
    submit() {
      let included_fee = this.feeList.map(item => {
        if (this.checkedList.includes(item.id)) {
          item.checked = 1
        }
        return {
          ...item
        }
      })
      if (this.formData.decrease_type === 2) {
        this.formData.max_value = this.numberValue
      } else if (this.formData.decrease_type === 3) {
        this.formData.max_value = this.proportion
      }
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
  .deduction-limit {
    display: flex;
    gap: 10px;
    flex-direction: column;
  }
  .checked-list {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(4, 1fr);
    padding: 10px 20px;
    border: 1px solid #ccc;
  }
  p {
    font-size: 15px;
    font-weight: bold;
  }
  p:first-child {
    margin-top: 0;
  }
  .tips {
    padding-top: 10px;
    font-size: 12px;
    color: #a1a1a1;
  }
}
</style>

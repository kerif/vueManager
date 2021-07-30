<template>
  <el-dialog
    :title="$t('消费转换成长值')"
    :visible.sync="show"
    width="40%"
    @close="clear"
    class="dialog-container"
  >
    <h5>{{ $t('转换规则') }}：</h5>
    <div class="content">
      <div>
        $ <el-input v-model="tableData.amount" class="number"></el-input> = 1 {{ $t('成长值') }}
      </div>
      <el-checkbox v-model="tableData.is_ceil">{{ $t('不足1成长值部分不累计') }}</el-checkbox>
    </div>
    <h5>{{ $t('计入成长值消费（以实际支付为准）') }}：</h5>
    <div class="content">
      <el-checkbox-group v-model="checkedList">
        <el-checkbox v-for="item in feeList" :label="item.id" :key="item.id">
          {{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
    <h5>{{ $t('触发时间') }}：</h5>
    <div class="content">
      {{ $t('订单为该状态时，成长值进入账户') }}
      <el-select :placeholder="$t('请选择')" v-model="tableData.trigger_type" style="width: 150px">
        <el-option
          v-for="item in triggerTypeList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
    </div>
    <h5>{{ $t('成长值有效期') }}：</h5>
    <div class="content">
      {{ $t('成长值到账之日起计算，有效期为') }}
      <el-select :placeholder="$t('请选择')" v-model="tableData.valid_time" style="width: 150px">
        <el-option
          v-for="item in validTimeList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        ></el-option
      ></el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onUpdateDetail">{{ $t('确定') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      tableData: {
        amount: '',
        is_ceil: false,
        included_fee: [],
        trigger_type: '',
        valid_time: ''
      },
      type: '',
      feeList: [],
      triggerTypeList: [],
      validTimeList: [],
      enabled: '',
      checkedList: []
    }
  },
  methods: {
    //消费积累成长值
    getGrowthValue() {
      this.$request.getGrowthValue().then(res => {
        if (res.ret) {
          this.feeList = res.data.fee_list
          this.triggerTypeList = res.data.trigger_type_list
          this.validTimeList = res.data.valid_time_list
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //消费积累成长值
    getGrowthValueDetails() {
      this.$request.getGrowthValueDetails().then(res => {
        if (res.ret) {
          this.tableData.amount = res.data.amount
          this.tableData.is_ceil = !!res.data.is_ceil
          this.tableData.included_fee = res.data.included_fee
          this.tableData.trigger_type = res.data.trigger_type
          this.tableData.valid_time = res.data.valid_time
          this.checkedList = res.data.included_fee.filter(item => item.checked).map(item => item.id)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //消费积累积分
    getPointIncrease() {
      this.$request.getPointIncrease().then(res => {
        if (res.ret) {
          this.feeList = res.data.fee_list
          this.triggerTypeList = res.data.trigger_type_list
          this.validTimeList = res.data.valid_time_list
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //消费积累积分
    getPointIncreaseDetails() {
      this.$request.getPointIncreaseDetails().then(res => {
        if (res.ret) {
          this.tableData.amount = res.data.amount
          this.tableData.is_ceil = !!res.data.is_ceil
          this.tableData.included_fee = res.data.included_fee
          this.tableData.trigger_type = res.data.trigger_type
          this.tableData.valid_time = res.data.valid_time
          this.checkedList = res.data.included_fee.filter(item => item.checked).map(item => item.id)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //消费积累成长值
    onUpdateDetail() {
      const included_fee = this.tableData.included_fee.map(item => {
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
        .updateGrowthDetails({
          ...this.tableData,
          is_ceil: ~~this.tableData.is_ceil,
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
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    init() {
      if (this.type === 'consumeGrowthValue') {
        this.getGrowthValue()
        this.getGrowthValueDetails()
      } else {
        this.getPointIncrease()
        this.getPointIncreaseDetails()
      }
    },
    clear() {
      this.tableData.amount = ''
      this.tableData.is_ceil = false
      this.tableData.included_fee = []
      this.tableData.trigger_type = ''
      this.tableData.valid_time = ''
      this.checkedList = []
    }
  }
}
</script>
<style scoped lang="scss">
.el-dialog__body {
  padding: 0 20px !important;
}
.content {
  padding: 0 20px;
  .number {
    width: 70px !important;
  }
  > div {
    margin-bottom: 20px;
  }
  .el-select {
    width: 100px;
  }
}
</style>

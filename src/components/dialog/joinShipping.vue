<template>
  <el-dialog :visible.sync="show" :title="$t('加入发货单')" class="dialog-join"
  size="small" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <!-- 加入发货单 -->
      <el-form-item :label="$t('*加入发货单')" prop="order_sn">
      <el-input type="textarea" v-model="ruleForm.order_sn"
      :autosize="{ minRows: 8, maxRows: 10}"
      :placeholder="$t('请输入订单号或转运快递单号，多个转运快递单号用英文分号分割。例：9894384934;23901920192')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        order_sn: ''
      },
      orderS: []
    }
  },
  methods: {
    confirm (formName) {
      if (this.ruleForm.order_sn === '') {
        return this.$message.error(this.$t('请输入转运快递单号'))
      } else {
        this.orderS = this.ruleForm.order_sn.split(';')
        this.$request.allOrderSn({
          order_sn: this.orderS,
          shipment_id: this.id
        }).then(res => {
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
          this.show = false
        })
      }
    },
    clear () {
      this.ruleForm.order_sn = ''
    },
    cancelDialog (ruleForm) {
      this.show = false
    },
    init () {
    }
  }
}
</script>
<style lang="scss">
.dialog-join {
  .el-textarea {
    width: 50% !important;
    // margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 250px !important;
  }
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }
  .el-dialog__close {
    color: #FFF;
  }
}
</style>

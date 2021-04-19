<template>
  <el-dialog :visible.sync="show" :title="$t('发送通知')" class="dialog-notify-order" @close="clear">
    <el-radio-group v-model="radio">
      <el-radio :label="3">{{$t('已发货通知')}}</el-radio>
      <el-radio :label="4">{{$t('待取件通知')}}</el-radio>
    </el-radio-group>
    <div slot="footer">
      <el-button @click="cancelDialog">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      radio: '',
      staff: '',
      ids: []
    }
  },
  methods: {
    confirm () {
      if (!this.radio) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request.sendingNotify({
        ids: this.ids,
        type: this.radio
        // type: this.activeName === '2' ? 2 : 3
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
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
    },
    clear () {
      this.radio = ''
      this.ids = []
    },
    cancelDialog () {
      this.show = false
    },
    init () {
      console.log(this.ids, 'id')
    }
  }
}
</script>
<style lang="scss">
.dialog-notify-order {
  .el-input {
    width: 40%;
    margin-left: 50px;
  }
  .el-textarea {
    width: 40%;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 300px !important;
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

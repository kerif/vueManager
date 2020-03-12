<template>
  <el-dialog :visible.sync="show" title="设为弃件包裹" class="dialog-discard"
  size="small" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <!-- 加入发货单 -->
      <el-form-item label="*问题原因" prop="invalid_reason">
      <el-input type="textarea" v-model="ruleForm.invalid_reason"
      :autosize="{ minRows: 8, maxRows: 10}"
      placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        invalid_reason: ''
      },
      deleteNum: []
    }
  },
  methods: {
    confirm () {
      if (this.ruleForm.invalid_reason === '') {
        return this.$message.error('请输入问题原因')
      } else {
        this.$request.deleteInvalid({
          ids: this.deleteNum,
          invalid_reason: this.ruleForm.invalid_reason
        }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
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
      this.ruleForm.invalid_reason = ''
    },
    cancelDialog (ruleForm) {
      this.show = false
    },
    init () {
      this.deleteNum = this.deleteNum
      console.log(this.deleteNum, 'deleteNum')
    }
  }
}
</script>
<style lang="scss">
.dialog-discard {
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

<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'sms' ? $t('短信API服务预警设置') : $t('物流查询服务预警设置')"
    class="alert-settings-container"
    @close="clear"
    width="30%"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
      <el-form-item :label="$t('预警设置')">
        <el-radio :label="1" v-model="ruleForm.radio">开启</el-radio>
        <el-radio :label="0" v-model="ruleForm.radio">关闭</el-radio><br />
        <span class="warning-sty" v-if="ruleForm.radio === 1">{{
          $t('低于预警次数将发送短信提醒')
        }}</span>
        <span class="warning-sty" v-else>{{ $t('不再发送短信提示') }}</span>
      </el-form-item>
      <el-form-item :label="$t('预警次数')">
        <el-input-number
          class="add-counts"
          v-model="num"
          @change="handleChange"
          :min="1"
          :max="100"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('预警号码')">
        <el-input class="input-sty"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirmShip">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      num: '',
      state: '',
      ruleForm: {
        radio: 1
      }
    }
  },
  methods: {
    // 确认创建发货单
    confirmShip(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.saveShip(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.innerVisible = false
              this.show = true
              // this.success()
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
    handleChange(value) {
      console.log(value)
    },
    clear() {},
    init() {}
  }
}
</script>
<style lang="scss" scope>
.alert-settings-container {
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
  .warning-sty {
    color: #ccc;
  }
  .input-sty {
    width: 60%;
  }
}
.el-select-dropdown__item.hover {
  width: auto;
}
.el-select-dropdown__item {
  width: 180px;
  white-space: nowrap; /*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis;
}
</style>

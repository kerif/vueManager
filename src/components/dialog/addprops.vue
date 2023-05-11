<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'edit' ? $t('编辑物品属性') : $t('添加物品属性')"
    class="props-dialog"
    width="35%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <el-form-item :label="$t('属性名称: ')">
        <el-input v-model="ruleForm.cn_name" @keyup.native.enter="confirm"></el-input>
      </el-form-item>
      <el-form-item :label="$t('字体颜色: ')">
        <div class="color-box">
          <el-color-picker v-model="ruleForm.font_color" show-alpha></el-color-picker>
        </div>
      </el-form-item>
      <el-form-item :label="$t('背景颜色: ')">
        <div class="color-box">
          <el-color-picker v-model="ruleForm.color" show-alpha></el-color-picker>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        cn_name: '',
        font_color: 'rgba(99, 111, 122,1)',
        color: 'rgba(0, 0, 0, 0)'
      },
      id: '',
      name: '',
      state: ''
    }
  },
  methods: {
    clear() {
      this.ruleForm.cn_name = ''
      this.id = ''
      this.name = ''
      this.state = ''
    },
    init() {
      if (this.id) {
        console.log(this.font_color, this.color)
        // if (this.font_color) {
        //   this.ruleForm.font_color = this.font_color
        //   console.log('有font_color')
        // }else{
        //   console.log(this.ruleForm.font_color)
        //   this.ruleForm.font_color = 'rgba(99, 111, 122,1)'
        //
        // }
        // if (this.color) {
        //   this.ruleForm.color = this.color
        //   console.log('有color')
        // }else{
        //   this.ruleForm.color = 'rgba(0, 0, 0, 0)'
        // }
        this.ruleForm.cn_name = this.name
        this.ruleForm.color = this.color ?this.color: 'rgba(0, 0, 0, 0)'
        this.ruleForm.font_color = this.font_color ?this.font_color: 'rgba(99, 111, 122,1)'
      }else{
        this.ruleForm.color = 'rgba(0, 0, 0, 0)'
        this.ruleForm.font_color = 'rgba(99, 111, 122,1)'
      }

    },
    confirm() {
      if (!this.ruleForm.cn_name) return this.$message.error(this.$t('请输入属性名称'))
      if (this.state === 'edit') {
        this.$request
          .updatePackageProps(this.id, {
            cn_name: this.ruleForm.cn_name,
            color: this.ruleForm.color,
            font_color: this.ruleForm.font_color
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
      } else {
        this.$request
          .addPackageProps({
            cn_name: this.ruleForm.cn_name,
            color: this.ruleForm.color,
            font_color: this.ruleForm.font_color
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
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.props-dialog {
  .el-input {
    width: 40%;
  }
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
  .color-box {
    display: flex;
    align-items: center;
  }
}
</style>

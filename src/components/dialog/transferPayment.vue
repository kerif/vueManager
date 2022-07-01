<template>
  <el-dialog
    :visible.sync="show"
    :title="title"
    class="dialog-add-setting"
    width="55%"
    @close="clear"
  >
    <div class="lang-sty" v-if="type === 'addPayLang'">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{ $t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息') }}
      </p>
    </div>
    <el-form :model="contentData">
      <el-form-item :label="$t('提示名称')">
        <el-input v-model="contentData.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('提示内容')">
        <el-input v-model="contentData.content"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button :loading="$store.state.btnLoading" type="primary" @click="confirm">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      type: '',
      payData: {},
      id: '',
      payId: '',
      line: '',
      lang: '',
      payCode: '',
      mode: '',
      status: '',
      contentData: {
        name: '',
        content: '',
        payment_settings_id: ''
      }
    }
  },
  methods: {
    confirm() {
      // let res = {}
      if (this.type === 'addPay') {
        // this.success(Object.assign({}, this.contentData))
        // this.show = false
        // return
        if (this.status === 'add') {
          this.success(JSON.parse(JSON.stringify(this.contentData)))
          this.show = false
        } else {
          this.contentData.payment_settings_id = this.id
          this.$request.addPay(this.contentData).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.success()
              this.show = false
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
        // res = await this.$request.addPay(this.contentData)
      } else if (this.type === 'editPay') {
        this.contentData.payment_settings_id = this.id
        this.$request.editPay(this.payId, this.contentData).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.success()
            this.show = false
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else if (this.type === 'addPayLang') {
        this.contentData.language = this.lang.language_code
        this.$request.editPayLang(this.line.id, this.contentData).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.success()
            this.show = false
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    getPayDetails() {
      this.$request.getPayDetails(this.line.id, { lang: this.lang.language_code }).then(res => {
        if (res.ret) {
          this.contentData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.contentData.name = ''
      this.contentData.content = ''
      this.contentData.payment_settings_id = ''
    },
    init() {
      if (this.type === 'editPay') {
        this.contentData = this.payData
      } else if (this.type === 'addPayLang' && this.mode === 'edit') {
        this.getPayDetails()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-add-setting {
  .lang-sty {
    line-height: 40px;
    color: #e6a344;
    margin-left: 80px;
    width: 66%;
    p {
      background-color: #fdf6ed;
    }
  }
}
</style>

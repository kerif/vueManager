<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? $t('新增字符串') : $t('编辑字符串')" class="dialog-string-addEdit" width="50%"
  @close="clear">
    <el-form :model="user" ref="user" class="demo-ruleForm"
    label-position="top">
    <!-- 字符串 -->
    <el-form-item :label="$t('字符串')" v-if="state === 'add'">
       <el-input v-model="user.key" class="input-sty"></el-input>
    </el-form-item>
    <el-form-item :label="$t('字符串')" v-if="state === 'edit'">
       <span>{{user.key}}</span>
    </el-form-item>
    <el-form-item :label="$t('分组')">
      <span v-if="user.source === 1">{{$t('网站')}}</span>
      <span v-if="user.source === 3">{{$t('H5/小程序')}}</span>
       <!-- <el-radio v-model="user.source" :label="1">{{$t('网站')}}</el-radio> -->
       <!-- <el-radio  v-model="user.source" :label="3">{{$t('H5/小程序')}}</el-radio> -->
    </el-form-item>
    <el-form-item v-for="item in stringData" :key="item.id" :label="item.name">
        <!-- <span></span> -->
        <el-input v-model="item.value" type="textarea" :rows="2" :placeholder="$t('请输入内容')"></el-input>
    </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      user: {
        key: '',
        source: '',
        translation: {}
      },
      expressData: [],
      stringData: [],
      localization: {},
      state: '',
      id: ''
    }
  },
  methods: {
    // 获取全部支持语言
    getString () {
      this.$request.getString().then(res => {
        if (res.ret) {
          this.stringData = res.data
          if (this.id) {
            this.getList()
          }
        }
      })
    },
    // 获取详细
    getList () {
      this.$request.detailsString(this.id).then(res => {
        if (res.ret) {
          this.user = res.data
          this.stringData = this.stringData.map(item => {
            const value = res.data.translation[item.language_code]
            console.log(value, 'value')
            return {
              ...item,
              value
            }
          })
          console.log(this.stringData, 'this.stringData')
        }
      })
    },
    confirm () {
      let translation = {}
      this.stringData.forEach(item => {
        translation[item.language_code] = item.value
      })
      console.log(translation, 'translation')
      if (this.state === 'add') {
        this.$request.addString({
          ...this.user,
          translation: translation
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
      } else if (this.state === 'edit') {
        this.$request.updateString(this.id, {
          ...this.user,
          translation: translation
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
      console.log(this.user, 'stringData')
    },
    clear () {
      this.user.key = ''
      this.user.source = ''
      this.stringData = []
      this.id = ''
      this.state = ''
    },
    init () {
      this.getString()
    }
  }
}
</script>
<style lang="scss">
.dialog-string-addEdit {
  .el-input {
    // width: 300px !important;
    margin-left: 50px;
  }
  .el-textarea {
    width: 350px !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 100px;
  }
  .el-form-item__error {
    margin-left: 100px !important;
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
  .input-sty {
    width: 350px !important;
  }
}
</style>

<template>
  <el-dialog
    :visible.sync="show"
    class="countryLang-dialog"
    :title="$t('编辑')"
    width="50%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="user" class="demo-ruleForm" label-position="top">
      <el-form-item :label="$t('*国家')">
        <el-select v-model="ruleForm.country_id" :placeholder="$t('请选择国家')" filterable>
          <el-option v-for="item in country" :key="item.id" :label="item.cn_name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for="item in stringData" :key="item.id" :label="item.name">
        <el-input
          v-model="item.value"
          type="textarea"
          :rows="2"
          :placeholder="$t('请输入内容')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        country_id: ''
      },
      country: [],
      stringData: [],
      id: ''
    }
  },
  methods: {
    init() {
      this.getString()
      this.getCountry()
    },
    getString() {
      this.$request.getString().then(res => {
        if (res.ret) {
          this.stringData = res.data.filter(item => item.language_code !== 'zh_CN')
          if (this.id) {
            this.getList()
          }
        }
      })
    },
    getCountry() {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
          this.country = res.data
        }
      })
    },
    getList() {
      this.$request.getCountryDetail(this.id).then(res => {
        this.ruleForm.country_id = res.data.id
        this.stringData = this.stringData.map(item => {
          const value = res.data.name_trans[item.language_code]
          return {
            ...item,
            value
          }
        })
      })
    },
    confirm() {
      if (!this.ruleForm.country_id) {
        return this.$message.error(this.$t('国家不能为空'))
      }
      let translation = {}
      this.stringData.forEach(item => {
        translation[item.language_code] = item.value
      })
      this.$request
        .updateCountryLang(this.id, {
          ...this.ruleForm,
          name_trans: translation
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
    clear() {
      this.ruleForm.country_id = ''
      this.country = []
    }
  }
}
</script>

<style lang="scss">
.countryLang-dialog {
  .el-form-item__label {
    width: 100px;
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
}
</style>

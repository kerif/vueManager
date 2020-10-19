<template>
  <el-dialog :visible.sync="show" :title="$t('新增国家/地区')" class="address-edit-dialog" @close="clear">
    <el-form label-width="80" :model="form">
      <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item :label="$t('国家/地区：')">
          <el-select
            v-model="form.countries"
            filterable
            class="country-select"
            :placeholder="$t('请选择国家/地区')">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item :label="$t('客户ID')">
          <span></span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item :label="$t('收件人')">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item :label="$t('城市')">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('街道')">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('门牌号')">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('邮编')">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('联系电话')">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('清关编码')">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('身份证号码')">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import countryList from '@/lib/country'
export default {
  data () {
    return {
      form: {
        name: ''
      },
      supplierId: '',
      options: []
    }
  },
  methods: {
    submit () {
      console.log(this.supplierId, 'this.supplierId')
      this.$request.saveCountries({
        country_id: this.supplierId
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
    },
    // 获取支持国家数据
    searchCountry () {
      this.$request.allCountry().then(res => {
        if (res.ret) {
          this.options = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear () {
      this.ruleForm.name = ''
    }
  }
}
</script>
<style lang="scss" scope>
.el-autocomplete-suggestion {
  z-index: 4000 !important;
}
.address-edit-dialog {
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

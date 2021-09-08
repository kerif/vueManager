<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('新增国家/地区')"
    class="set-country-dialog"
    @close="clear"
  >
    <div class="remark">
      {{
        $t(
          '注:添加国家后，请先在【仓库配置】中将该国家加入支持收货的仓库，否则配置渠道时无法通过【仓库】匹配到该国家'
        )
      }}
    </div>
    <el-form label-width="80" :model="ruleForm">
      <el-form-item :label="$t('国家/地区：')">
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          :placeholder="$t('请输入国家/地区（中）')"
          v-model="ruleForm.name"
        >
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import countryList from '@/lib/country'
export default {
  data() {
    return {
      ruleForm: {
        name: ''
      },
      supplierId: ''
    }
  },
  methods: {
    queryCNSearch(queryString, callback) {
      console.log(this.ruleForm.cn_name)
      var list = [{}]
      this.$request
        .AutoCountry({
          keyword: this.ruleForm.name
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.name
            // i.value = i.id + '---' + i.name
          }
          list = res.data
          callback(list)
        })
    },
    handleSelect(item) {
      this.supplierId = item.id
      console.log(this.supplierId, 'this.supplierId')
    },
    submit() {
      console.log(this.supplierId, 'this.supplierId')
      this.$request
        .saveCountries({
          country_id: this.supplierId
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
          this.show = false
        })
    },
    clear() {
      this.ruleForm.name = ''
    }
  }
}
</script>
<style lang="scss" scope>
.el-autocomplete-suggestion {
  z-index: 4000 !important;
}
.remark {
  color: red;
  margin-bottom: 10px;
}
.set-country-dialog {
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

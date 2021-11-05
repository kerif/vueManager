<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('新增国家地区')"
    class="add-country-dialog"
    @close="clear"
  >
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
      <!-- <el-form-item label="英文：">
        <el-autocomplete
          :fetch-suggestions="queryENSearch"
          placeholder="请输入国家英文名"
          v-model="ruleForm.en_name">
        </el-autocomplete>
      </el-form-item> -->
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
    // queryCNSearch (queryString, cb) {
    //   let list = this.CNList
    //   let result = queryString ? list.(this.createFilter(queryString)) : list
    //   cb(result)
    // },
    // queryENSearch (queryString, cb) {
    //   let list = this.ENList
    //   let result = queryString ? list.filter(this.createFilter(queryString)) : list
    //   cb(result)
    // },
    // createFilter (queryString) {
    //   return (item) => {
    //     return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
    //   }
    // },
    handleSelect(item) {
      // this.ruleForm.en_name = item.name
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
  },
  computed: {
    // CNList () {
    //   return countryList.map(item => {
    //     return { value: item.cn_name }
    //   })
    // },
    // ENList () {
    //   return countryList.map(item => {
    //     return { value: item.en_name }
    //   })
    // }
  }
}
</script>
<style lang="scss" scope>
.el-autocomplete-suggestion {
  z-index: 4000 !important;
}
.add-country-dialog {
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

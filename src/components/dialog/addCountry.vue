<template>
  <el-dialog :visible.sync="show" title="新增国家" class="dialog-container" @close="clear">
    <el-form label-width="80" :model="ruleForm">
      <el-form-item label="国家：">
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          placeholder="请输入国家中文名"
          v-model="ruleForm.cn_name">
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
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import countryList from '@/lib/country'
export default {
  data () {
    return {
      ruleForm: {
        cn_name: '',
        en_name: ''
      }
    }
  },
  methods: {
    queryCNSearch (queryString, cb) {
      let list = this.CNList
      let result = queryString ? list.filter(this.createFilter(queryString)) : list
      cb(result)
    },
    queryENSearch (queryString, cb) {
      let list = this.ENList
      let result = queryString ? list.filter(this.createFilter(queryString)) : list
      cb(result)
    },
    createFilter (queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect (item) {
      // this.ruleForm.en_name = item.name
      console.log(item)
    },
    submit () {
      this.ruleForm.en_name = this.ruleForm.cn_name
      this.$request.saveCountries(this.ruleForm).then(res => {
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
    },
    clear () {
      this.ruleForm.cn_name = ''
      this.ruleForm.en_name = ''
    }
  },
  computed: {
    CNList () {
      return countryList.map(item => {
        return { value: item.cn_name }
      })
    },
    ENList () {
      return countryList.map(item => {
        return { value: item.en_name }
      })
    }
  }
}
</script>
<style lang="scss">
.el-autocomplete-suggestion {
  z-index: 4000 !important;
}
</style>

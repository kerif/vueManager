<template>
  <el-dialog :visible.sync="show" title="新增国家" class="dialog-container">
    <el-form label-width="80">
      <el-form-item label="中文：">
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          :trigger-on-focus="false"
          placeholder="请输入国家中文名"
          v-model="cn_name">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="英文：">
        <el-autocomplete
          :fetch-suggestions="queryENSearch"
          :trigger-on-focus="false"
          placeholder="请输入国家英文名"
          v-model="en_name">
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import countryList from '@/lib/country'
export default {
  data () {
    return {
      cn_name: '',
      en_name: ''
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
      console.log(item)
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

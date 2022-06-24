<template>
  <div class="search-container">
    <el-form :inline="true" :model="searchData" size="small">
      <el-form-item>
        <el-input v-model="searchData.sn" :placeholder="$t('请输入分货号')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchData.timeList"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t('搜索') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onReset">{{ $t('重置') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    searchData: {
      type: Object
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit')
    },
    onReset() {
      this.searchData.sn = ''
      this.searchData.timeList = []
      this.searchData.logistics_sn = ''
    }
  }
}
</script>

<style lang="scss">
.search-container {
  padding: 10px;
  background: #fff !important;
}
</style>

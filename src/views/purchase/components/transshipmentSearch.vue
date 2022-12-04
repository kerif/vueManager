<template>
  <div class="search-container">
    <el-form :inline="true" :model="searchData" size="small">
      <el-form-item>
        <el-input v-model="searchData.sn" :placeholder="$t('请输入分货号')"></el-input>
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

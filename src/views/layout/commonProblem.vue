<template>
  <div>
    <el-select v-model="value" :placeholder="$t('请选择分类')">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-input v-model="keyword" :placeholder="$t('请输入关键词')"></el-input>
    <el-table :data="problemData" border style="width: 100%">
      <el-table-column prop="date" :label="$t('标题')" width="180"> </el-table-column>
      <el-table-column prop="name" :label="$t('tag')" width="180"> </el-table-column>
      <el-table-column prop="name" :label="$t('类型')" width="180"> </el-table-column>
      <el-table-column prop="address" :label="$t('创建时间')"> </el-table-column>
      <el-table-column prop="address" :label="$t('操作')">
        <template>
          <el-button>{{ $t('查看') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'commonProblem',
  data() {
    return {
      keyword: '',
      problemData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.problemList().then(res => {
        console.log(res)
      })
    },
    getCategoryList() {}
  }
}
</script>

<style></style>

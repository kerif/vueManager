<template>
  <div>
    <el-select v-model="category" :placeholder="$t('请选择分类')">
      <el-option v-for="item in categoryData" :key="item.id" :label="item.id" :value="item.name">
      </el-option>
    </el-select>
    <el-input v-model="keyword" @click="goSearch" :placeholder="$t('请输入关键词')"></el-input>
    <el-table :data="problemData" border style="width: 100%">
      <el-table-column prop="title" :label="$t('标题')" width="180"> </el-table-column>
      <el-table-column prop="tag" :label="$t('tag')" width="180"> </el-table-column>
      <el-table-column :label="$t('类型')" width="180">
        <template slot-scope="scope">
          <span v-for="item in scope.row.category" :key="item.id">{{ item.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" :label="$t('创建时间')"> </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)">{{ $t('查看') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'commonProblem',
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      keyword: '',
      category: '',
      problemData: []
    }
  },
  created() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    getList() {
      this.$request.problemList().then(res => {
        console.log(res)
        this.problemData = res.data
      })
    },
    getCategoryList() {
      this.$request.categoryList().then(res => {
        console.log(res, '1111')
        this.categoryData = res.data
      })
    },
    goSearch() {
      this.getList()
    }
  }
}
</script>

<style></style>

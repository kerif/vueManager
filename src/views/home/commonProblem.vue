<template>
  <div class="commonProblem-container">
    <el-select v-model="category" :placeholder="$t('请选择分类')">
      <el-option v-for="item in categoryData" :key="item.id" :label="item.name" :value="item.id">
        {{ item.name }}
      </el-option>
    </el-select>
    <div class="header-search">
      <el-input v-model="keyword" :placeholder="$t('请输入关键词')" @keyup.enter.native="goSearch">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="goSearch"></i>
      </el-input>
    </div>
    <el-table :data="problemData" border style="width: 100%; margin-top: 10px">
      <el-table-column prop="title" :label="$t('标题')" width="180"> </el-table-column>
      <el-table-column prop="tag" :label="$t('tag')" width="180"> </el-table-column>
      <el-table-column :label="$t('类型')" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.category.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" :label="$t('创建时间')"> </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)" size="mini">{{ $t('查看') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div v-html="content"></div>
    </el-dialog>
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
      dialogVisible: false,
      title: '',
      content: '',
      categoryData: [],
      localization: {},
      problemData: []
    }
  },
  created() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    getList() {
      let param = {
        keyword: this.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }
      this.$request.problemList(param).then(res => {
        console.log(res)
        this.problemData = res.data
        this.localization = res.localization
        this.page_params.page = res.meta.current_page
        this.page_params.total = res.meta.total
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
    },
    edit(id) {
      this.dialogVisible = true
      this.$request.problemDetail(id).then(res => {
        this.title = res.data.title
        this.content = res.data.content
      })
    }
  }
}
</script>

<style lang="scss">
.commonProblem-container {
  .header-search {
    float: right;
    width: 200px;
  }
  .el-table tr th.is-leaf {
    border-bottom: 1px #ecedf0 solid;
    background-color: #fff;
  }
  .el-table th > .cell {
    text-align: center;
  }
  .el-table .cell {
    text-align: center;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
}
</style>

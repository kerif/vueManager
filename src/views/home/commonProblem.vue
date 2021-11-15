<template>
  <div class="commonProblem-container">
    <el-select
      v-model="category"
      :placeholder="$t('请选择分类')"
      @change="changeVal"
      :clearable="true"
    >
      <el-option v-for="item in categoryData" :key="item.id" :label="item.name" :value="item.id">
        {{ item.name }}
      </el-option>
    </el-select>
    <!-- <search-select
        @search="changeVal"
        v-model="page_params.category"
        :placeholder="$t('请选择分类')"
        :selectArr="categoryData"
      ></search-select> -->
    <div class="header-search">
      <el-input v-model="keyword" :placeholder="$t('请输入关键词')" @keyup.enter.native="goSearch">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="goSearch"></i>
      </el-input>
    </div>
    <el-table
      :data="problemData"
      border
      ref="table"
      v-loading="tableLoading"
      class="top-side"
      style="width: 100%; height: calc(100vh - 275px); margin-top: 10px"
    >
      <el-table-column prop="title" :label="$t('标题')"> </el-table-column>
      <el-table-column prop="tag" :label="$t('tag')"> </el-table-column>
      <el-table-column :label="$t('类型')">
        <template slot-scope="scope">
          <span>{{ scope.row.category.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" :label="$t('创建时间')"> </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            @click="edit(scope.row.id)"
            size="mini"
            style="background: #3540a5; color: #fff"
            >{{ $t('查看') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div v-html="content" ref="html" class="content">{{ content }}</div>
    </el-dialog>
    <el-dialog :visible.sync="imgDialog">
      <div style="text-align: center">
        <img :src="imgUrl" style="max-width: 100%" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { SearchSelect } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'commonProblem',
  components: {
    NlePagination
    // SearchSelect
  },
  mixins: [pagination],
  data() {
    return {
      keyword: '',
      category: '',
      dialogVisible: false,
      title: '',
      content: '',
      disabled: false,
      tableLoading: false,
      page_params: {
        category: ''
      },
      categoryData: [],
      localization: {},
      problemData: [],
      imgDialog: false,
      imgUrl: ''
    }
  },
  created() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      let param = {
        keyword: this.keyword,
        page: this.page_params.page,
        size: this.page_params.size,
        category: this.category
      }
      this.$request
        .problemList(param)
        .then(res => {
          if (res.ret) {
            // console.log(res)
            this.problemData = res.data
            this.localization = res.localization
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    getCategoryList() {
      this.$request.categoryList().then(res => {
        this.categoryData = res.data
        // res.data.forEach(item => {
        //   this.categoryData.push({
        //     value: item.id,
        //     label: item.name
        //   })
        // })
      })
    },
    // checkImg($event) {
    //   this.imgDialog = true
    //   this.imgUrl = this.$baseUrl.IMAGE_URL + url
    // },
    goSearch() {
      this.getList()
    },
    edit(id) {
      this.dialogVisible = true
      this.$request.problemDetail(id).then(res => {
        this.title = res.data.title
        this.content = res.data.content
      })
    },
    changeVal() {
      this.page_params.handleQueryChange('category', this.category)
      this.getList()
    }
  },
  watch: {
    content: function () {
      const template = this.$refs.html
      this.$nextTick(() => {
        const img = template.querySelector('.content p img')
        const imgSrc = template.querySelector('.content p img').src
        console.log(imgSrc)
        img.onclick = () => {
          this.imgDialog = true
          this.imgUrl = imgSrc
        }
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
  /deep/.el_table .top-side {
    margin-top: 10px;
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
    height: 20px;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
}
</style>

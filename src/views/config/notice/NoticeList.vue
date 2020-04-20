<template>
  <div class="notice-list-container">
    <div class="clear-box"><add-btn router="noticeadd">添加</add-btn></div>
    <el-table class="data-list" stripe border :data="noticeList"
    @selection-change="selectionChange"
    v-loading="tableLoading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="类型" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">常见问题</span>
          <span v-if="scope.row.type === 2">其他问题</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="creator"></el-table-column>
      <!-- 创建时间 -->
      <el-table-column label="创建时间" prop="created_at"></el-table-column>
      <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onLang(scope.row, item)"></span>
          <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="noticeEdit(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import AddBtn from '@/components/addBtn'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  mixins: [pagination],
  components: {
    AddBtn,
    NlePagination
  },
  name: 'noticeList',
  data () {
    return {
      noticeList: [],
      tableLoading: false,
      deleteNum: [],
      languageData: [],
      transCode: ''
    }
  },
  created () {
    this.getList()
    this.getLanguageList() // 获取支持语言
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getNotice({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.noticeList = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    noticeEdit (id) {
      this.$router.push({
        name: 'noticeEdit',
        params: {
          id: id
        }
      })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除
    deleteData () {
      this.$confirm(`是否确认删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteNotice({
          DELETE: this.deleteNum
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    // 获取支持语言
    getLanguageList () {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 修改语言
    onLang (line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      this.$router.push({ name: 'noticeLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.transCode
        } })
    }
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  }
}
</script>

<style lang="scss">
.notice-list-container {
  .icon-sty {
    cursor: pointer;
    // padding-left: 20px;
    font-weight: 700;
    color: black;
  }
}
</style>

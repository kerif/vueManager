<template>
  <div class="single-page-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
    </div>
    <div class="select-box">
      <add-btn router="addSingle">{{$t('添加')}}</add-btn>
    </div>
    <el-table :data="rechargeList" stripe border class="data-list"
    v-loading="tableLoading" @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 标题 -->
      <el-table-column :label="$t('标题')" prop="title">
      </el-table-column>
      <!-- 栏目 -->
      <el-table-column :label="$t('栏目')" prop="section.name">
      </el-table-column>
      <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onLang(scope.row, item)"></span>
          <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <!-- 创建日期 -->
      <el-table-column :label="$t('创建日期')" prop="created_at"> </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
        </div>
      </template> -->
      <!-- 操作 -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-deep-purple optionBtn" @click="editSingle(scope.row.id)">{{$t('编辑')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-sty">
      <el-button size="small" class="btn-light-red" @click="deleteData">{{$t('删除')}}</el-button>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
// import dialog from '@/components/dialog'
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
export default {
  data () {
    return {
      rechargeList: [],
      localization: {},
      tableLoading: false,
      timeList: [],
      begin_date: '',
      end_date: '',
      type: '',
      section: '',
      deleteNum: [],
      languageData: [],
      statusList: [
        {
          id: 0,
          name: this.$t('待审核')
        },
        {
          id: 1,
          name: this.$t('审核通过')
        },
        {
          id: 2,
          name: this.$t('审核拒绝')
        }
      ]
    }
  },
  mixins: [pagination],
  name: 'rechargeList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  created () {
    this.getList()
    this.getLanguageList()
    if (this.$route.query.serial_number) {
      this.page_params.keyword = this.$route.query.serial_number
    }
    if (this.$route.query.times) {
      this.timeList = this.$route.query.times.split(' ')
      this.begin_date = this.timeList[0]
      this.end_date = this.timeList[1]
    }
  },
  methods: {
    // 获取支持语言
    getLanguageList () {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    getList () {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        section: this.section
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.singlePage(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.rechargeList = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 修改语言
    onLang (line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      this.$router.push({ name: 'pageLang',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.transCode
        } })
    },
    // 删除
    deleteData () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.deletePage({
          ids: this.deleteNum
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
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
    // 详情
    editSingle (id) {
      this.$router.push({ name: 'editSingle',
        params: {
          id: id
        } })
    },
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 状态筛选
    onShipStatus () {
      this.page_params.handleQueryChange('section', this.section)
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.single-page-container {
  .changeVou {
    margin-left: 20px;
  }
  .timeStyle {
    margin-right: 10px;
    width: 276px !important;
  }
  .chooseStatus {
    margin-left: 10px;
    width: 150px;
    display: inline-block;
  }
  .select-box {
    overflow: hidden;
  }
  .bottom-sty {
    margin-top: 20px;
    margin-bottom: 10px;
  }
}
</style>

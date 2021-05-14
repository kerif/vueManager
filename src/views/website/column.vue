<template>
  <div class="column-container">
    <div class="select-box">
      <add-btn router="addColumn">{{ $t('新增') }}</add-btn>
    </div>
    <el-table
      :data="columnList"
      stripe
      border
      class="data-list"
      @expand-change="onExpand"
      v-loading="tableLoading"
    >
      <!-- 二级分类列表 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.orders">
            <!-- 子栏目名称 -->
            <el-table-column :label="$t('子栏目名称')" prop="name"></el-table-column>
            <!-- 类型 -->
            <el-table-column :label="$t('类型')">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">{{ $t('单篇文章') }}</span>
                <span v-if="scope.row.type === 2">{{ $t('链接') }}</span>
                <span v-if="scope.row.type === 3">{{ $t('单页') }}</span>
                <span v-if="scope.row.type === 4">{{ $t('多篇文章') }}</span>
              </template>
            </el-table-column>
            <!-- 排序 -->
            <el-table-column :label="$t('排序')" prop="sort_index"> </el-table-column>
            <el-table-column
              :label="item.name"
              v-for="item in formatLangData"
              :key="item.id"
              align="center"
            >
              <template slot-scope="scope">
                <span
                  v-if="scope.row['trans_' + item.language_code]"
                  class="el-icon-check icon-sty"
                  @click="onLang(scope.row, item)"
                ></span>
                <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')" width="300">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button
                  class="btn-dark-green btn-margin"
                  @click="editSecondColumn(scope.row.id)"
                  >{{ $t('编辑') }}</el-button
                >
                <!-- 删除 -->
                <el-button @click="deleteData(scope.row.id)" class="btn-light-red">{{
                  $t('删除')
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- 一级分类列表 -->
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 栏目名称 -->
      <el-table-column :label="$t('栏目名称')" prop="name"></el-table-column>
      <!-- 类型 -->
      <el-table-column :label="$t('类型')">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">{{ $t('文章') }}</span>
          <span v-if="scope.row.type === 2">{{ $t('链接') }}</span>
          <span v-if="scope.row.type === 3">{{ $t('首页') }}</span>
        </template>
      </el-table-column>
      <!-- 排序 -->
      <el-table-column :label="$t('排序')" prop="sort_index"></el-table-column>
      <el-table-column
        :label="item.name"
        v-for="item in formatLangData"
        :key="item.id"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row['trans_' + item.language_code]"
            class="el-icon-check icon-sty"
            @click="onLang(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="300">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button
            class="btn-dark-green btn-margin"
            @click="editColumn(scope.row.id, scope.row.has_children)"
            >{{ $t('编辑') }}</el-button
          >
          <!-- 风险提示 -->
          <el-button class="btn-main" @click="addSecond(scope.row.id)">{{
            $t('新增子栏目')
          }}</el-button>
          <!-- 删除 -->
          <el-button class="btn-light-red btn-margin" @click="deleteData(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
// import Sortable from 'sortablejs'
import NlePagination from '@/components/pagination'
// import { SearchSelect } from '@/components/searchs'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  components: {
    AddBtn,
    NlePagination
    // SearchSelect
  },
  mixins: [pagination],
  data() {
    return {
      languageData: [],
      columnList: [],
      orders: {},
      tableLoading: false,
      localization: {},
      deleteNum: []
    }
  },
  created() {
    this.getLanguageList()
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getWebsites({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.columnList = res.data.map(item => {
              return {
                ...item,
                // enabled: Boolean(item.enabled),
                // risk_warning_enabled: Boolean(item.risk_warning_enabled),
                orders: []
              }
            })
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
    // 编辑
    editColumn(id, children) {
      if (children === 1) {
        // 当存在子栏目时
        this.$router.push({ name: 'editFirstWeb', params: { id: id } })
      } else {
        this.$router.push({
          name: 'editColumn',
          params: { id: id, children: children, state: 'first' }
        })
      }
    },
    // 新增子栏目
    addSecond(id) {
      this.$router.push({ name: 'addSecondColumn', params: { parent: id, state: 'second' } })
    },
    // 二级菜单编辑
    editSecondColumn(id) {
      this.$router.push({ name: 'editColumn', params: { id: id, state: 'second' } })
    },
    // 删除
    deleteData(id) {
      this.deleteNum = [id]
      console.log(this.deleteNum, 'this.deleteNum')
      this.$request
        .deleteWebsites({
          ids: this.deleteNum
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.getCounts()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 修改语言
    onLang(line, lang) {
      // this.categoriesCode = line['trans_' + lang.language_code]
      // this.$router.push({ name: 'categoriesLangAdd',
      //   params: {
      //     line: JSON.stringify(line),
      //     lang: JSON.stringify(lang),
      //     transCode: this.categoriesCode
      //   } })
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'columnLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
      })
    },
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 点开当前行，获取二级菜单数据
    onExpand(row) {
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (row.orders.length) return
      let id = row.id
      this.$request.getSecondWebsites(id).then(res => {
        if (res.ret) {
          row.orders = res.data.map(item => {
            return {
              ...item,
              enabled: Boolean(item.enabled),
              risk_warning_enabled: Boolean(item.risk_warning_enabled)
            }
          })
        }
      })
    }
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  }
}
</script>

<style lang="scss">
.column-container {
  .select-box {
    overflow: hidden;
    // h4 {
    //   display: inline-block;
    // }
  }
}
</style>

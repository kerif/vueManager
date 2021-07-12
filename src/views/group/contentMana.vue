<template>
  <div class="content-management-container">
    <div class="searchGroup">
      <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
    </div>
    <div class="clear"></div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        border
        stripe
        :data="addressList"
        ref="table"
        class="data-list"
        height="calc(100vh - 270px)"
      >
        <el-table-column type="index" :index="1"></el-table-column>
        <el-table-column :label="$t('提示信息')" prop="description"></el-table-column>
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
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-green" @click="editContent(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'vipaddress',
  data() {
    return {
      addressList: [],
      tableLoading: false,
      languageData: []
    }
  },
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  mounted() {
    this.getList()
    this.getLanguageList() // 获取支持语言
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getContent({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.addressList = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 修改资料
    editContent(id) {
      this.$router.push({ name: 'editContent', query: { id } })
    },
    // 获取支持语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 修改语言
    onLang(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      this.$router.push({
        name: 'editContent',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.transCode
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
.content-management-container {
  .searchGroup {
    width: 21.5%;
    float: right;
  }
  .clear {
    clear: both;
  }
  .tips-sty {
    background-color: #f2e2b8;
    line-height: 40px;
    font-size: 14px;
    padding-left: 10px;
    margin-top: 10px;
  }
  .icon-info {
    color: #e6a344;
    font-size: 18px;
    // margin-left: 15px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
</style>

<template>
  <div class="banner-container">
    <div style="display: flex; justify-content: flex-end">
      <div class="searchGroup">
        <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
      </div>
      <div class="select-box">
        <add-btn @click.native="addAdvertise">{{ $t('添加弹窗广告图') }}</add-btn>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        :data="advertiseData"
        stripe
        height="calc(100vh - 270px)"
        ref="table"
        border
        class="data-list"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <!-- 名称 -->
        <el-table-column :label="$t('名称')" prop="picture_name"></el-table-column>
        <!-- 位置 -->
        <el-table-column
          :label="$t('位置')"
          prop="position"
          :show-overflow-tooltip="true"
          width="200"
        ></el-table-column>
        <!-- 应用 -->
        <el-table-column :label="$t('应用')" prop="source">
          <template slot-scope="scope">
            <span v-if="scope.row.source === 1">{{ $t('小程序') }}</span>
            <span v-if="scope.row.source === 2">{{ $t('pc端') }}</span>
            <span v-if="scope.row.source === 3">{{ $t('h5端') }}</span>
            <span v-if="scope.row.source === 4">{{ $t('APP') }}</span>
          </template>
        </el-table-column>
        <!-- 类型 -->
        <el-table-column :label="$t('类型')" prop="type">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('轮播图') }}</span>
            <span v-if="scope.row.type === 2">{{ $t('横幅') }}</span>
            <span v-if="scope.row.type === 3">{{ $t('活动图') }}</span>
            <span v-if="scope.row.type === 4">{{ $t('弹窗广告') }}</span>
          </template>
        </el-table-column>
        <!-- 连接方式 -->
        <el-table-column :label="$t('连接方式')" prop="link_type">
          <template slot-scope="scope">
            <span v-if="scope.row.link_type === 1">{{ $t('应用内跳转') }}</span>
            <span v-if="scope.row.link_type === 2">{{ $t('外部url') }}</span>
            <span v-if="scope.row.link_type === 3">{{ $t('关联公众号文章') }}</span>
          </template>
        </el-table-column>
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
        <el-table-column :label="$t('操作')" width="260">
          <template slot-scope="scope">
            <!-- 修改仓库 -->
            <el-button class="btn-green" @click="editAdvertise(scope.row.id)">{{
              $t('修改')
            }}</el-button>
            <!-- 删除 -->
            <el-button class="btn-light-red" @click="deleteAdvertise(scope.row.id)">{{
              $t('删除')
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
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      tableLoading: false,
      advertiseData: [],
      languageData: [],
      deleteNum: []
    }
  },
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  created() {
    this.getList()
    this.getLanguageList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .advertiseList({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.advertiseData = res.data
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
    addAdvertise() {
      dialog({ type: 'advertiseList' }, () => {
        this.getList()
      })
    },
    editAdvertise(id) {
      dialog({ type: 'advertiseList', id: id }, () => {
        this.getList()
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
    },
    deleteAdvertise(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteAdvertise(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    onLang(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'advertiseLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss">
.banner-container {
  .select-box {
    margin-left: 10px;
    overflow: hidden;
  }
  .country-box {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .add-btn-container {
    margin-left: 10px;
  }
  .icon-sty {
    cursor: pointer;
    font-weight: 700;
    color: black;
  }
  .search-group {
    margin-bottom: 5px;
  }
}
</style>

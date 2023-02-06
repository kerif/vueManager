<template>
  <div class="arriavl">
    <div class="headerList">
      <div class="sort-sty">
        *{{ $t('拖拽行可以进行排序') }}
        <el-button @click="rowUpdate" class="btn-deep-purple save-sort">{{
          $t('保存排序结果')
        }}</el-button>
      </div>
      <div class="header-right">
        <div class="select-box">
          <add-btn @click.native="addClassify">{{ $t('添加') }}</add-btn>
        </div>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        stripe
        ref="table"
        height="calc(100vh - 270px)"
        class="data-list country"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column width="100px" align="center">
          <template>
            <i class="el-icon-sort icon-fonts"></i>
          </template>
        </el-table-column>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column :label="$t('启用状态')" prop="status" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="changeStatus(scope.row.id, scope.row.status)"
              :active-text="$t('开')"
              :inactive-text="$t('关')"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('快递公司')" prop="name" width="200"></el-table-column>
        <el-table-column :label="$t('快递公司代码')" prop="num" width="150"></el-table-column>
        <el-table-column :label="$t('登录账号')" prop="username" width="150">
          <template slot-scope="scope">
            <span> {{ scope.row.config == null ? '' : scope.row.config.username }}</span>
          </template>
        </el-table-column>
        <!-- 是否启用 -->
        <el-table-column :label="$t('到件先知状态')" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.auto_status"
              @change="changeTransfer(scope.row.id, scope.row.auto_status)"
              :active-text="$t('开')"
              :inactive-text="$t('关')"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
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
              @click="forecastLang(scope.row, item)"
            ></span>
            <span
              v-else
              class="el-icon-plus icon-sty"
              @click="forecastLang(scope.row, item)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button @click="configuration(scope.row.id)" class="btn-deep-purple save-sort">{{
              $t('配置')
            }}</el-button>
            <el-button @click="deleteLOwLevel(scope.row.id)" class="btn-light-red">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div>
  </div>
</template>
<script>
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
import Sortable from 'sortablejs'
import { pagination } from '@/mixin'
export default {
  components: {
    AddBtn,
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      tableData: [],
      tableLoading: false,
      deleteNum: [],
      countrySendData: [],
      languageData: []
    }
  },
  mounted() {
    this.page_params.page = 1
    this.getList()
    this.getLanguageList()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    // 修改语言
    forecastLang(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      dialog(
        {
          type: 'forecastLang',
          line: line,
          lang: lang,
          transCode: this.transCode,
          state: 'forecastLang'
        },
        () => {
          this.getList()
        }
      )
    },
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    changeTransfer(id, status) {
      this.$request.ForecastArrivalStatus(id, status).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    changeStatus(id, status) {
      this.$request.ForecastCompaniesListStatus(id, status).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
    },
    deleteLOwLevel(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.ForecastCompaniesDelete(id).then(res => {
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
    rowUpdate() {
      const ids = this.countrySendData.map(({ id, name }, index) => ({ id, index, name }))
      this.tableData = []
      this.$request.ForecastCompaniesSort(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getList() {
      this.$request
        .ForecastExpressList({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.countrySendData = [...res.data]
            this.$nextTick(() => {
              this.rowDrop()
              this.$refs.table.doLayout()
            })
          }
        })
    },
    configuration(id) {
      dialog({ type: 'expressConfigAend', state: 'add', id: id }, () => {
        this.getList()
      })
    },
    addClassify() {
      dialog({ type: 'expressConfig', state: 'add' }, () => {
        this.getList()
      })
    },
    // 拖拽
    rowDrop() {
      const tbody = document.querySelector('.country tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          const oldItem = this.countrySendData.splice(oldIndex, 1)[0]
          this.countrySendData.splice(newIndex, 0, oldItem)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.arriavl {
  .headerList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .searchGroup {
      width: 27.1%;
    }
    .header-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

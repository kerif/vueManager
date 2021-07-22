<template>
  <div class="partition-container">
    <!-- <div class="searchGroup">
      <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
    </div> -->
    <div class="bottom-sty">
      <div>
        <el-button size="small">{{ $t('导入') }}</el-button>
        <el-button size="small">{{ $t('导出') }}</el-button>
        <el-button size="small">{{ $t('选择模版') }}</el-button>
      </div>
      <div class="addUser">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        </div>
        <add-btn @click.native="addPartition">{{ $t('新增') }}</add-btn>
      </div>
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
        <el-table-column :label="$t('分区名称')" prop="name"></el-table-column>
        <el-table-column :label="$t('启用国家/地区')" prop="areas_count"></el-table-column>
        <el-table-column :label="$t('是否启用')" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
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
              @click="onLang(scope.row, item)"
            ></span>
            <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-green" @click="editPartition(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <el-button class="btn-light-red" @click="deletePart(scope.row.id)">{{
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
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
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
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  mounted() {
    if (this.$route.params.id) {
      this.getList()
    }
    this.getLanguageList() // 获取支持语言
  },
  created() {},
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getRegions(this.$route.params.id, {
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
    // 新增
    addPartition() {
      dialog({ type: 'partitionAddEdit', state: 'add' }, () => {
        this.getList()
      })
    },
    // 删除
    deletePart(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.regionsDelete(this.$route.params.id, id).then(res => {
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
    // 修改资料
    editPartition(id) {
      dialog({ type: 'partitionAddEdit', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    // 修改开关
    changeTransfer(event, enabled, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.regionsEnabled(this.$route.params.id, id, Number(event)).then(res => {
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
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog(
        {
          type: 'partitionLang',
          line: line,
          lang: lang,
          transCode: this.transCode,
          state: 'translate'
        },
        () => {
          this.getList()
        }
      )
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
.partition-container {
  .addUser > .add-btn-container {
    margin-left: 10px;
  }
  .import-list {
    display: inline-block;
    margin-left: 10px;
    // text-align: right;
  }
  .addUser {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    .searchGroup {
      // width: 29.42%;
      // float: left;
      margin-right: 10px;
    }
  }
  .bottom-sty {
    width: 100%;
    // margin-top: 20px;
    margin-bottom: 10px;
    float: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
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

<template>
  <div class="template-set-container">
    <!-- <div class="searchGroup">
      <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
    </div> -->
    <div class="top-title">{{ $t('预设分区表') }}</div>
    <div class="bottom-sty">
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
        :data="templateData"
        ref="table"
        class="data-list"
        height="calc(100vh - 270px)"
      >
        <el-table-column type="index" :index="1"></el-table-column>
        <el-table-column :label="$t('模版名称')" prop="name"></el-table-column>
        <el-table-column :label="$t('分区数量')" prop="regions_count"></el-table-column>
        <!-- <el-table-column
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
        </el-table-column> -->
        <el-table-column :label="$t('操作')" width="140">
          <template slot-scope="scope">
            <el-button
              class="btn-green edit-sty"
              @click="editPartition(scope.row.id, scope.row.name)"
              >{{ $t('编辑') }}</el-button
            >
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
    <el-dialog :title="$t('新增')" :visible.sync="dialogVisible" width="35%" @close="clearTmp">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item :label="$t('请输入模版名称')">
          <el-input v-model="form.name" :placeholder="$t('请输入')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmTmp">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
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
      templateData: [],
      tableLoading: false,
      languageData: [],
      dialogVisible: false,
      form: {
        name: ''
      }
    }
  },
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  mounted() {
    this.getList()
    this.getLanguageList() // 获取支持语言
  },
  created() {},
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .lineRegion({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.templateData = res.data
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
      this.dialogVisible = true
      // let status = this.$route.params.id ? 'channel' : 'partition'
      // dialog({ type: 'partitionAddEdit', state: 'add', status: status }, () => {
      //   this.getList()
      // })
    },
    // 删除
    deletePart(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTmp(id).then(res => {
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
    editPartition(id, name) {
      this.$router.push({ name: 'partition', query: { id, name } })
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
    },
    clearTmp() {
      this.form.templateId = ''
    },
    confirmTmp() {
      if (!this.form.name) {
        return this.$message.error(this.$t('名称不能为空'))
      }
      this.$request
        .newTmp({
          name: this.form.name
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
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
.template-set-container {
  .addUser > .add-btn-container {
    margin-left: 10px;
  }
  .top-title {
    color: red;
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
  .edit-sty {
    margin-right: 5px;
  }
}
</style>

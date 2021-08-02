<template>
  <div class="line-container">
    <div class="headerList">
      <el-button @click="goPartition">{{ $t('预设分区表') }}</el-button>
      <div class="header-right">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        </div>
        <div class="select-box">
          <add-btn @click.native="newLine">{{ $t('添加路线') }}</add-btn>
        </div>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        :data="vipGroupList"
        stripe
        border
        ref="table"
        height="calc(100vh - 270px)"
        class="data-list"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column :label="$t('路线')" prop="name"></el-table-column>
        <el-table-column :label="$t('渠道数量')" prop="express_lines_count"></el-table-column>
        <!-- 是否启用 -->
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
        <el-table-column :label="$t('操作')" width="260">
          <template slot-scope="scope">
            <el-button class="btn-green" @click="editChannel(scope.row.id)">{{
              $t('渠道')
            }}</el-button>
            <el-button class="btn-blue" @click="editLine(scope.row.id, scope.row.name, 'edit')">{{
              $t('编辑')
            }}</el-button>
            <el-button class="btn-deep-purple" @click="copyLine(scope.row.id, 'copy')">{{
              $t('复制')
            }}</el-button>
            <el-button class="btn-light-red" @click="deleteLine(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
        <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template> -->
      </el-table>
    </div>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
    <!-- 复制线路 -->
    <el-dialog
      :title="lineStatus === 'edit' ? $t('编辑路线') : $t('复制路线')"
      :visible.sync="copyDialog"
      width="45%"
      @close="clear"
    >
      <el-form ref="form" :model="copyData" label-width="100px">
        <el-form-item :label="lineStatus === 'edit' ? $t('*线路名称') : $t('*新线路名称')">
          <el-input v-model="copyData.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="copyDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmCopy">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
import { pagination } from '@/mixin'
export default {
  name: 'vipGroupList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data() {
    return {
      vipGroupList: [],
      tableLoading: false,
      deleteNum: [],
      languageData: [],
      transCode: '',
      copyId: '',
      copyData: {
        name: ''
      },
      copyDialog: false,
      lineStatus: ''
    }
  },
  created() {
    this.getList()
    this.getLanguageList() // 获取支持语言
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getLineGroup({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.vipGroupList = res.data
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })

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
    // 新增路线
    newLine() {
      dialog({ type: 'LingLang', state: 'new' }, () => {
        this.getList()
      })
    },
    goPartition() {
      this.$router.push({ name: 'partition' }, () => {
        this.getList()
      })
    },
    // 修改开关
    changeTransfer(event, enabled, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.lineGroupEnabled(id, Number(event)).then(res => {
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
    // 修改仓库
    editChannel(id) {
      this.$router.push({
        name: 'channelLine',
        params: {
          id: id
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
    // 复制线路
    copyLine(id, status) {
      this.copyId = id
      this.copyDialog = true
      this.lineStatus = status
    },
    // 编辑
    editLine(id, name, status) {
      this.copyId = id
      this.copyDialog = true
      this.copyData.name = name
      this.lineStatus = status
    },
    clear() {
      this.lineStatus = ''
      this.copyId = ''
      this.copyData.name = ''
    },
    // 确定复制
    confirmCopy() {
      if (!this.copyData.name) {
        return this.$message.error(this.$t('请输入新线路名称'))
      }
      if (this.lineStatus === 'edit') {
        this.$request
          .editLineGroup(this.copyId, {
            name: this.copyData.name
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.copyDialog = false
              this.getList()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
        this.$request
          .copyGroupLine(this.copyId, {
            name: this.copyData.name
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.copyDialog = false
              this.getList()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      }
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除
    deleteLine(id) {
      this.$confirm(this.$t('您真的要删除此路线？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteLineGroup(id).then(res => {
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
    // 修改语言
    onLang(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog(
        { type: 'LingLang', line: line, lang: lang, transCode: this.transCode, state: 'translate' },
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
.line-container {
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
  .select-box {
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
    // padding-left: 20px;
    font-weight: 700;
    color: black;
  }
  .icon-fonts {
    font-size: 28px;
  }
  .save-sort {
    // margin-left: 10px;
    line-height: 40px;
  }
}
</style>

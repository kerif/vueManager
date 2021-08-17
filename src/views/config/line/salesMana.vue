<template>
  <div class="sales-management-container">
    <div class="headerList">
      <div>
        <span style="font-weight: 900">{{ $t('清关编码') }}</span>
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            $t(
              ' 设置有销售价格时，客户计费价格为销售价。针对同一路线同一客户，销售价格表生效优先级按列表排序递减，即：排序越靠前的价格表优先级越高。'
            )
          "
          placement="top"
        >
          <span class="el-icon-question icon-info"></span>
        </el-tooltip>
      </div>
      <div class="header-right">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        </div>
        <div class="select-box">
          <add-btn @click.native="newSales">{{ $t('添加价格表') }}</add-btn>
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
        <el-table-column :label="$t('价格表名称')" prop="name" width="120"></el-table-column>
        <el-table-column :label="$t('适用对象')" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.scope === 0">{{ $t('所有用户') }}</span>
            <span v-if="scope.row.scope === 1">{{ $t('特定用户组') }}</span>
            <span v-if="scope.row.scope === 2">{{ $t('特定会员等级') }}</span>
            <span v-if="scope.row.scope === 3">{{ $t('特定用户') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('适用渠道')" width="250" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-for="item in scope.row.express_lines" :key="item.id">
              {{ item.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('生效时间')" prop="effect_at" width="160"></el-table-column>
        <el-table-column :label="$t('生效状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">{{ $t('未生效') }}</span>
            <span v-if="scope.row.status === 1">{{ $t('生效中') }}</span>
            <span v-if="scope.row.status === 2">{{ $t('已失效') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('失效时间')" prop="expire_at" width="160"></el-table-column>
        <el-table-column :label="$t('排序')" prop="index"></el-table-column>
        <!-- 是否启用 -->
        <el-table-column :label="$t('是否启用')" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="changeTransfer(scope.row.id, scope.row.enabled)"
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
        <el-table-column :label="$t('操作')" width="190">
          <template slot-scope="scope">
            <el-button class="btn-blue" @click="editSales(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <el-button class="btn-deep-purple" @click="copyLine(scope.row.id)">{{
              $t('复制')
            }}</el-button>
            <el-button class="btn-light-red" @click="deleteSales(scope.row.id)">{{
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
    <el-dialog :title="$t('复制价格表')" :visible.sync="copyDialog" width="45%" @close="clear">
      <el-form ref="form" :model="copyData" label-width="100px">
        <el-form-item :label="$t('*价格表名称')">
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
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getSales({
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
    newSales() {
      dialog({ type: 'salesAddEdit', state: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑
    editSales(id) {
      dialog({ type: 'salesAddEdit', state: 'edit', id: id }, () => {
        this.getList()
      })
      // this.copyId = id
      // this.copyDialog = true
      // this.copyData.name = name
    },
    goPartition() {
      this.$router.push({ name: 'partition' }, () => {
        this.getList()
      })
    },
    // 修改开关
    changeTransfer(id, enabled) {
      this.$request.updateStatus(id, enabled).then(res => {
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
    // 复制线路
    copyLine(id) {
      this.copyId = id
      this.copyDialog = true
    },
    clear() {
      this.copyId = ''
      this.copyData.name = ''
    },
    // 确定复制
    confirmCopy() {
      if (!this.copyData.name) {
        return this.$message.error(this.$t('请输入价格表名称'))
      }
      this.$request
        .copySalesLine(this.copyId, {
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
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除
    deleteSales(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteSales(id).then(res => {
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
.sales-management-container {
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
  .icon-info {
    color: #74b34f;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
</style>

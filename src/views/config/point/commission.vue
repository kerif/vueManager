<template>
  <div class="commission-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div>
    <div class="select-box">
      <add-btn @click.native="addCommission">{{$t('添加')}}</add-btn>
    </div>
    <el-table :data="rulesList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('名称')" prop="name"></el-table-column>
      <el-table-column :label="$t('计佣方式')">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">{{$t('固定金额')}}</span>
          <span v-if="scope.row.type === 2">{{$t('重量体积重')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('计佣金额')" prop="amount"></el-table-column>
      <el-table-column :label="$t('操作')" width="150px">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button class="btn-green" @click="editCommission(scope.row.id)">{{$t('编辑')}}</el-button>
          <!-- 删除 -->
          <el-button class="btn-light-red" @click="deleteSelf(scope.row.id)">{{$t('删除')}}</el-button>
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template> -->
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="lineDialog" width="40%" @close="clear"
    :title="$t('查看自提点支持线路')">
    <div class="self-sty">{{$t('自提点名称：')}}{{this.lineName}}</div>
    <div class="self-sty">{{$t('支持线路')}}</div>
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column
      type="index">
    </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('线路名称')">
      </el-table-column>
    </el-table>
      <!-- <div slot="footer">
      <el-button @click="lineDialog = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirmLines">{{$t('确定')}}</el-button>
    </div> -->
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
  name: 'rulesList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      rulesList: [],
      tableLoading: false,
      deleteNum: [],
      trackDialog: false,
      tableData: [],
      details: [],
      sn: '',
      trackId: '',
      linesId: '',
      lineName: '',
      status: 1,
      lineDialog: false,
      localization: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.pickRules({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.rulesList = res.data
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
    // 添加计佣方式
    addCommission () {
      dialog({ type: 'commissionAddEdit', state: 'add', weightUnit: this.localization.weight_unit, currencyUnit: this.localization.currency_unit }, () => {
        this.getList()
      })
    },
    // 编辑 计佣方式
    editCommission (id) {
      dialog({ type: 'commissionAddEdit', state: 'edit', id: id, weightUnit: this.localization.weight_unit, currencyUnit: this.localization.currency_unit }, () => {
        this.getList()
      })
    },
    // 查看支持线路
    checkLines (id, name) {
      this.linesId = id
      this.lineName = name
      this.lineDialog = true
      this.getLines()
    },
    getLines () {
      this.$request.getPointLines(this.linesId).then(res => {
        if (res.ret) {
          this.tableData = res.data
        }
      })
    },
    clear () {
      this.linesId = ''
      this.lineName = ''
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除单条转账支付
    deleteSelf (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deletePickRules(id).then(res => {
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
    // 新增行
    addRow () {
      console.log(this.details, 'this.details')
      this.details.push({
        created_at: '',
        content: ''
      })
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    getTrack () {
      this.$request.getTracking(this.trackId).then(res => {
        if (res.ret) {
          this.details = res.data
        }
      })
    },
    // 轨迹
    addTrack () {
      this.$request.updateTracking(this.trackId, {
        details: this.details
      }).then(res => {
        if (res.ret) {
          this.trackDialog = false
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.commission-container {
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
  .add-row {
    margin-bottom: 10px;
    text-align: right;
  }
  .check-sty {
    cursor: pointer;
  }
  .self-sty {
    margin-bottom: 20px;
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
  }
}
</style>

<template>
  <div class="since-container">
    <!-- <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div> -->
    <div class="select-box">
      <add-btn router="pointAdd">{{$t('添加')}}</add-btn>
    </div>
    <el-table :data="logisticsList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('自提点名称')" prop="name"></el-table-column>
      <el-table-column :label="$t('所属国家/地区')">
        <template slot-scope="scope">
          <span>{{scope.row.country.name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('详细地址')" prop="address"></el-table-column>
      <el-table-column :label="$t('联系电话')" prop="contact_info"></el-table-column>
      <el-table-column :label="$t('联系人')" prop="contactor"></el-table-column>
      <el-table-column :label="$t('支持线路')" prop="expressLines_count"></el-table-column>
      <el-table-column :label="$t('操作')" width="150px">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button class="btn-green" @click="editSelf(scope.row.id, scope.row.logistics_sn)">{{$t('编辑')}}</el-button>
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
  </div>
</template>
<script>
// import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
// import dialog from '@/components/dialog'
import { pagination } from '@/mixin'
export default {
  name: 'logisticsList',
  components: {
    // SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      logisticsList: [],
      tableLoading: false,
      deleteNum: [],
      trackDialog: false,
      details: [],
      sn: '',
      trackId: ''
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getSelf({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.logisticsList = res.data
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
    editSelf (id) {
      this.$router.push({ name: 'pointEdit',
        params: {
          id: id
        } }
      )
    },
    clear () {
      this.sn = ''
      this.trackId = ''
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
        this.$request.deleteSelf(id).then(res => {
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
.since-container {
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
}
</style>

<template>
  <div class="logistics-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
    </div>
    <div class="select-box">
      <add-btn router="importLogistics">{{ $t('导入数据') }}</add-btn>
    </div>
    <el-table
      :data="logisticsList"
      stripe
      border
      class="data-list"
      v-loading="tableLoading"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('快递单号')" prop="logistics_sn"></el-table-column>
      <el-table-column :label="$t('快递公司')" prop="logistics_company"> </el-table-column>
      <el-table-column :label="$t('轨迹数量')" prop="count"></el-table-column>
      <el-table-column :label="$t('操作人')" prop="operator"></el-table-column>
      <el-table-column :label="$t('最后操作时间')" prop="updated_at"></el-table-column>
      <el-table-column :label="$t('操作')" width="260">
        <template slot-scope="scope">
          <!-- 轨迹 -->
          <el-button
            class="btn-green"
            @click="editWarehouse(scope.row.id, scope.row.logistics_sn)"
            >{{ $t('轨迹') }}</el-button
          >
          <!-- 删除 -->
          <el-button class="btn-light-red" @click="deleteWarehouse(scope.row.id)">{{
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
    <el-dialog
      :visible.sync="trackDialog"
      :title="this.sn + $t('的物流轨迹')"
      class="add-company"
      width="55%"
      @close="clear"
    >
      <div class="add-row">
        <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
      </div>
      <el-table :data="details" style="width: 100%" border>
        <el-table-column :label="$t('创建日期')">
          <template slot-scope="scope">
            <el-date-picker
              format="yyyy-MM-dd"
              v-model="scope.row.created_at"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('选择日期')"
            >
            </el-date-picker>
            <!-- <el-input v-model="scope.row.start"></el-input> -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('内容')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.content"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, details)"
              class="btn-light-red"
              >{{ $t('移除') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="trackDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="addTrack">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
// import dialog from '@/components/dialog'
import { pagination } from '@/mixin'
export default {
  name: 'logisticsList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data() {
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
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getCustomLogistics({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
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
    // 轨迹
    editWarehouse(id, sn) {
      // this.$router.push({ name: 'warehouseEdit',
      //   params: {
      //     id: id
      //   } }
      // )
      this.trackDialog = true
      this.sn = sn
      this.trackId = id
      this.getTrack()
    },
    clear() {
      this.sn = ''
      this.trackId = ''
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除单条转账支付
    deleteWarehouse(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCustomLogistics(id).then(res => {
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
    addRow() {
      console.log(this.details, 'this.details')
      this.details.push({
        created_at: '',
        content: ''
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    getTrack() {
      this.$request.getTracking(this.trackId).then(res => {
        if (res.ret) {
          this.details = res.data
        }
      })
    },
    // 轨迹
    addTrack() {
      this.$request
        .updateTracking(this.trackId, {
          details: this.details
        })
        .then(res => {
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
.logistics-container {
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

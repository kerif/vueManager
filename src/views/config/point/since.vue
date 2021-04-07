<template>
  <div class="since-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
        <div class="chooseStatus">
          <el-select v-model="status" @change="changeStatus" clearable
          :placeholder="$t('请选择')">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </el-option>
          </el-select>
        </div>
      </search-group>
      </div>
    <div class="select-box">
      <add-btn router="commissionSet">{{$t('计佣方式配置')}}</add-btn>
      <add-btn router="pointAdd">{{$t('添加')}}</add-btn>
    </div>
    <div v-if="status === 1">
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
      <el-table-column :label="$t('支持线路')">
        <template slot-scope="scope">
          <div class="check-sty" @click="checkLines(scope.row.id, scope.row.name)">{{scope.row.expressLines_count}}</div>
        </template>
      </el-table-column>
      <!-- 支持货到付款 -->
      <el-table-column :label="$t('支持货到付款')" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_delivery"
            @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
            :active-text="$t('开')"
            :active-value="1"
            :inactive-value="0"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray">
          </el-switch>
        </template>
      </el-table-column>
      <!-- 计佣方式 -->
      <!-- <el-table-column :label="$t('计佣方式')" prop="contactor"></el-table-column> -->
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
    <div v-if="status === 2" class="second-sty">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
      </el-tree>
      <el-table :data="treesList" stripe border class="data-list"
      v-loading="tableLoading">
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column :label="$t('自提点名称')" prop="name"></el-table-column>
        <el-table-column :label="$t('详细地址')" prop="address"></el-table-column>
        <el-table-column :label="$t('联系电话')" prop="contact_info"></el-table-column>
        <el-table-column :label="$t('联系人')" prop="contactor"></el-table-column>
        <!-- <el-table-column :label="$t('支持线路')">
          <template slot-scope="scope">
            <div class="check-sty" @click="checkLines(scope.row.id, scope.row.name)">{{scope.row.expressLines_count}}</div>
          </template>
        </el-table-column> -->
        <!-- 计佣方式 -->
        <el-table-column :label="$t('操作')" width="150px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button class="btn-green" @click="editSelf(scope.row.id, scope.row.logistics_sn)">{{$t('编辑')}}</el-button>
            <!-- 删除 -->
            <el-button class="btn-light-red" @click="deleteSelf(scope.row.id)">{{$t('删除')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  data () {
    return {
      logisticsList: [],
      treesList: [],
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
      statusList: [
        {
          id: 1,
          name: this.$t('全部显示')
        },
        {
          id: 2,
          name: this.$t('按地区分类显示')
        }
      ],
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      }
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
    // 修改开关
    changeTransfer (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.resetSelf(id, Number(event)).then(res => {
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
    // 获取自提点树状数据
    getTree () {
      this.$request.treeIndex().then(res => {
        if (res.ret) {
          const secondeData = res.data
          this.treeData = secondeData.map(item => {
            console.log(item, 'secondeData')
            return {
              name: this.$t(item.cn_name),
              // value: item.id,
              ...item,
              // label: this.$t(item.cn_name),
              id: `${item.id}-1`,
              stations: item.stations,
              child: item.areas.map(item => ({
                name: this.$t(item.name),
                id: item.id,
                child: item.areas.map(item => ({
                  name: this.$t(item.name),
                  id: item.id,
                  stations: item.stations
                }))
              }
              ))
            }
          })
          // this.treesList = this.treeData.map(item => {
          //   return {
          //     stations: item.stations
          //   }
          // })
          console.log(this.treeData, 'treeData')
          console.log(this.treesList, 'treesList')
        }
      })
    },
    // 自提点状态选择
    changeStatus () {
      if (this.status === 2) {
        this.getTree()
      }
    },
    handleNodeClick (data) {
      console.log(data, 'data')
      this.treesList = data.stations
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
    // 编辑
    editSelf (id) {
      this.$router.push({ name: 'pointEdit',
        params: {
          id: id
        } }
      )
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
  .second-sty {
    margin-top: 20px;
  }
}
</style>

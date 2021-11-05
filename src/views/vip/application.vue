<template>
  <div class="application-list-container">
    <el-tabs v-model="activeName" class="tabLength">
      <!-- 待审核 -->
      <el-tab-pane :label="$t('待审核')" name="0"></el-tab-pane>
      <!-- 审核拒绝 -->
      <el-tab-pane :label="$t('审核拒绝')" name="2"></el-tab-pane>
    </el-tabs>
    <el-table
      v-if="oderData.length"
      class="data-list"
      border
      stripe
      :data="oderData"
      @selection-change="selectionChange"
      v-loading="tableLoading"
      ref="table"
      height="calc(100vh - 275px)"
    >
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')" prop="user_id"> </el-table-column>
      <!-- 客户昵称 -->
      <el-table-column :label="$t('客户昵称')">
        <template slot-scope="scope">
          {{ scope.row.info.name }}
        </template>
      </el-table-column>
      <!-- 邮箱 -->
      <el-table-column :label="$t('邮箱')">
        <template slot-scope="scope">
          {{ scope.row.info.email }}
        </template>
      </el-table-column>
      <!-- 电话 -->
      <el-table-column :label="$t('电话')">
        <template slot-scope="scope">
          {{ scope.row.info.phone }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('微信号')">
        <template slot-scope="scope">
          {{ scope.row.info.wechat_id }}
        </template>
      </el-table-column>
      <!-- 状态 -->
      <!-- 申请时间 -->
      <el-table-column :label="$t('申请时间')" prop="created_at"></el-table-column>
      <!-- 审核时间 -->
      <el-table-column :label="$t('审核时间')" v-if="activeName === '2'" prop="updated_at">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="200px" fixed="right">
        <template slot-scope="scope">
          <!-- 审核拒绝 -->
          <el-button
            class="btn-light-red operating-btn"
            v-if="activeName === '0'"
            @click="rejectProxy(scope.row.id)"
            >{{ $t('审核拒绝') }}</el-button
          >
          <!-- 审核通过 -->
          <el-button
            class="btn-main"
            v-if="activeName === '0'"
            @click="
              passedProxy(
                scope.row.id,
                scope.row.info.phone,
                scope.row.info.email,
                scope.row.info.name
              )
            "
            >{{ $t('审核通过') }}</el-button
          >
          <!-- 删除 -->
          <el-button
            size="small"
            @click="deleteProxy(scope.row.id)"
            v-if="activeName === '2'"
            class="btn-light-red"
            >{{ $t('删除') }}</el-button
          >
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template> -->
    </el-table>
    <div class="noDate" v-else>{{ $t('暂无数据') }}</div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
// import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    // SearchGroup,
    NlePagination
  },
  name: 'applicationList',
  mixins: [pagination],
  data() {
    return {
      activeName: '0',
      oderData: [],
      status: 0,
      tableLoading: false,
      agent_name: '',
      agentData: [],
      localization: {},
      storageList: [],
      timeList: [],
      in_storage_end_date: '',
      in_storage_begin_date: '',
      begin_date: '',
      end_date: ''
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        // warehouse: this.agent_name,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      if (this.activeName === '2') {
        // 提交时间
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
        // 称重时间
        this.in_storage_begin_date && (params.in_storage_begin_date = this.in_storage_begin_date)
        this.in_storage_end_date && (params.in_storage_end_date = this.in_storage_end_date)
      } else {
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
      }
      this.$request.getApplication(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
          this.localization = res.localization
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
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 审核通过
    passedProxy(id, phone, email, name) {
      dialog({ type: 'passedList', id: id, phone: phone, email: email, name: name }, () => {
        this.getList()
      })
    },
    // 审核拒绝
    rejectProxy(id) {
      this.$confirm(this.$t('您真的要审核拒绝吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.refusedApproved(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    // 删除
    deleteProxy(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.deleteApproved(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    // 删除
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要删除这个包裹吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request
          .deletePackages({
            DELETE: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    onAgentChange() {
      this.page_params.page = 1
      this.page_params.handleQueryChange('agent', this.agent_name)
      this.getList()
    },
    // 获取代理列表
    getAgentData() {
      this.$request.getSimpleList().then(res => {
        this.agentData = res.data
      })
    },
    // 提交时间
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 称重时间
    onStorage(val) {
      this.in_storage_begin_date = val ? val[0] : ''
      this.in_storage_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange(
        'times',
        `${this.in_storage_begin_date} ${this.in_storage_end_date}`
      )
      this.getList()
    },
    // 入库日志
    onLogs(expressNum) {
      this.$router.push({ name: 'pickingContainer', query: { keyword: expressNum } })
    }
  },
  created() {
    // this.getAgentData()
    this.getList()
  },
  watch: {
    // 监听tab组件参数
    activeName(newValue) {
      switch (newValue) {
        case '0': // 未入库
          this.page_params.page = 1
          this.status = 0
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '2': // 已入库
          this.page_params.page = 1
          this.status = 2
          this.timeList = []
          this.storageList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.getList()
          break
        case '3':
          this.page_params.page = 1
          this.timeList = []
          this.storageList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.getList()
      }
    }
  }
}
</script>

<style lang="scss">
.application-list-container {
  .tabLength {
    width: 200px !important;
    display: inline-block;
  }
  .agentRight {
    // display: inline-block;
    float: right;
  }
  .changeTime {
    display: inline-block;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .chooseOrder {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  .operating-btn {
    margin-bottom: 5px;
  }
  .dialogSty {
    margin-left: 30px;
  }
  .iframe {
    width: 100%;
    min-height: 300px;
    border-width: 0;
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
    .el-select {
      // width: 100%;
    }
  }
}
</style>

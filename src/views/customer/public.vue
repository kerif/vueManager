<template>
  <div class="public-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
        <el-date-picker
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          @change="onTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
       </el-date-picker>
      <!-- <el-select v-model="type" @change="onVocherTypeChange" clearable class="changeVou">
        <el-option
          v-for="item in voucherChange"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
       </el-select> -->
      </search-group>
      <div class="clear-box">
        <add-btn router="addPublic">新增公告</add-btn>
      </div>
    </div>
    <el-table :data="transactionList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 公告标题 -->
      <el-table-column label="公告标题" prop="title"></el-table-column>
      <!-- 发布人员 -->
      <el-table-column label="发布人员" prop="operator">
      </el-table-column>
      <!-- 发布时间 -->
      <el-table-column label="发布时间" prop="created_at"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-deep-purple" @click="details(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
export default {
  data () {
    return {
      transactionList: [],
      localization: {},
      tableLoading: false,
      timeList: [],
      begin_date: '',
      end_date: '',
      type: '',
      deleteNum: []
      // voucherChange: []
    }
  },
  mixins: [pagination],
  name: 'transactionList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  created () {
    this.getList()
    if (this.$route.query.serial_number) {
      this.page_params.keyword = this.$route.query.serial_number
    }
    if (this.$route.query.times) {
      this.timeList = this.$route.query.times.split(' ')
      this.begin_date = this.timeList[0]
      this.end_date = this.timeList[1]
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getAnnouncements(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transactionList = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 删除
    deleteData () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error('请选择')
      }
      this.$confirm(`是否确认删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.announcementsDelete({
          DELETE: this.deleteNum
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
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
    // 跳转到详情
    details (id) {
      this.$router.push({ name: 'editPublic', params: { id: id } })
    }
    // 选择不同类型优惠券
    // onVocherTypeChange () {
    //   this.page_params.handleQueryChange('type', this.type)
    //   this.getList()
    // },
    // 获取下拉框
    // getTypes () {
    //   this.$request.getPaymentType().then(res => {
    //     if (res.ret) {
    //       this.voucherChange = res.data
    //     } else {
    //       this.$notify({
    //         title: '操作失败',
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss">
.public-list-container {
  .changeVou {
    margin-left: 20px;
  }
  .timeStyle {
    margin-right: 10px;
    width: 276px !important;
  }
}
</style>

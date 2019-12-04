<template>
  <div class="voucher-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch"></search-group>
    <add-btn router="addVoucher">添加</add-btn>
      <div class="changeVou">
      <el-select v-model="type" @change="onVocherTypeChange" clearable>
        <el-option
          v-for="item in voucherChange"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
       </el-select>
      </div>
      <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
        <!-- 全部 -->
        <el-tab-pane label="全部" name="1"></el-tab-pane>
        <!-- 未开始 -->
        <el-tab-pane label="未开始" name="2"></el-tab-pane>
        <!-- 进行中 -->
        <el-tab-pane label="进行中" name="3"></el-tab-pane>
        <!-- 已失效 -->
        <el-tab-pane label="已失效" name="4"></el-tab-pane>
      <!-- v-if="oderData.length" -->
    </el-tabs>
      <el-table class="data-list" border stripe
      v-loading="tableLoading"
      :data="voucherData" @selection-change="onSelectChange">
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 优惠券名称 -->
      <el-table-column label="优惠券名称" prop="name"></el-table-column>
      <!-- 类型 -->
      <el-table-column label="类型" prop="type"></el-table-column>
      <!-- 金额 -->
      <el-table-column :label="'金额' + this.localization.currency_unit" prop="amount">
      </el-table-column>
      <!-- 状态 -->
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">未开始</span>
          <span v-if="scope.row.status === 2">进行中</span>
          <span v-if="scope.row.status === 3">已失效</span>
        </template>
      </el-table-column>
      <!-- 失效时间 -->
      <el-table-column label="失效时间" prop="expired_at"></el-table-column>
      <!-- 投放数量 -->
      <el-table-column label="投放数量" prop="total_count"></el-table-column>
      <!-- 使用数量 -->
      <el-table-column label="使用数量" prop="used_count"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <!-- 投放 -->
          <el-button class="btn-purple detailsBtn" v-if="scope.row.status === '' || scope.row.status === 1 || scope.row.status === 2" @click="serving(scope.row.id)">投放</el-button>
          <!-- 作废 -->
          <el-button class="btn-deep-blue detailsBtn" v-if="(activeName === '1' ||activeName === '2' || activeName === '3') &&scope.row.status !== 3"
          @click="obsolete(scope.row.id)">作废</el-button>
          <!-- 记录 -->
          <el-button size="small" class="btn-dark-green detailsBtn"
           @click="recoding(scope.row.id)">记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="noDate" v-else>暂无数据</div> -->
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="show" title="请选择" class="change-status-dialog dialog-container" width="35%" @close="clear">
        <div class="status-box">
            <el-radio-group v-model="ruleForm.status">
                <el-radio :label="1">客户组投放</el-radio>
                <el-radio :label="2">单个客户投放</el-radio>
            </el-radio-group>
        </div>
        <div slot="footer">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import AddBtn from '@/components/addBtn'
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  name: 'voucherList',
  data () {
    return {
      activeName: '1',
      voucherData: [],
      status: '',
      type: '1',
      voucherChange: [{
        id: '2',
        name: '新用户福利券'
      }, {
        id: '1',
        name: '抵用券'
      }, {
        id: '',
        name: '全部'
      }],
      show: false,
      selectIDs: [],
      servingId: '',
      localization: {},
      tableLoading: false,
      ruleForm: {
        status: []
      }
    }
  },
  created () {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
      this.status = Number(this.activeName) === 0 ? '' : Number(this.activeName) - 1
    }
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.voucherData = []
      this.$request.getCouponList({
        status: this.status,
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size,
        type: this.type
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          // 待发货列表的转运快递单号添加
          // res.data.forEach(item => {
          //   item.disabled = true
          //   item.copySN = item.logistics_sn
          // })
          this.voucherData = res.data
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
    // 记录
    recoding (id) {
      this.$router.push({ name: 'notes', query: { id: id } })
    },
    // 作废
    obsolete (id) {
      this.$confirm('确定要作废优惠券吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.disableCoupons(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    confirm () {
      console.log(this.ruleForm.status)
      if (!this.ruleForm.status) {
        return this.$message.info('请选择客户或客户组')
      }
      this.show = false
      if (this.ruleForm.status === 2) {
        dialog({ type: 'selectCus' }, (data) => {
          console.log(data, '我是客户data')
          this.$request.addLaunch(this.servingId, {
            user_id: [data.id]
          }).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: res.msg
              })
            } else {
              this.$notify({
                type: 'error',
                message: res.msg
              })
            }
          })
        })
      } else {
        dialog({ type: 'selectGroup' }, (data) => {
          console.log(data, '我是客户组data')
          this.$request.addLaunchGroup(this.servingId, {
            group_id: [data.id]
          }).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: res.msg
              })
            } else {
              this.$notify({
                type: 'error',
                message: res.msg
              })
            }
          })
        })
      }
    },
    clear () {
      this.ruleForm.status = []
    },
    // 投放第一步
    serving (id) {
      this.show = true
      this.servingId = id
    },
    onSelectChange (selection) {
      this.selectIDs = selection.map(item => item.id)
    },
    // 添加转运快递单号
    edit (row) {
      row.disabled = !row.disabled
    },
    // 取消
    cancel (row) {
      row.logistics_sn = row.copySN
      row.disabled = true
    },
    // 保存添加转运快递单号
    saveLogistics (row) {
      if (!row.logistics_sn) {
        return this.$message.info('请输入转运快递单号')
      }
      this.$request.updateLogistics([{
        id: row.id,
        sn: row.logistics_sn
      }]).then(res => {
        if (res.ret) {
          this.$notify({
            title: '保存成功',
            message: res.msg,
            type: 'success'
          })
          row.disabled = true
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // tab change
    onTabChange (tab) {
      switch (tab.name) {
        case '1': // 全部
          this.status = ''
          break
        case '2': // 未开始
          this.status = 1
          break
        case '3': // 进行中
          this.status = 2
          break
        case '4': // 已失效
          this.status = 3
          break
      }
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.getList()
    },
    // 选择不同类型优惠券
    onVocherTypeChange () {
      this.page_params.handleQueryChange('type', this.type)
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.voucher-container {
  .tabLength {
    width: 350px !important;
  }
  .detailsBtn {
    margin: 3px 2px !important;
  }
  .noDate {
    text-align: center;
    color: #ccc;
  }
  .changeVou {
    float: right;
    margin-right: 10px;
    .el-input {
      width: 98%;
    }
  }
}
</style>

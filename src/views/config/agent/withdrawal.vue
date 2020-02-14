<template>
  <div class="withdrawal-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      <div class="chooseStatus">
        <el-select v-model="status" @change="onShipStatus" clearable>
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
    <!-- <div class="select-box">
    </div> -->
    <el-table class="data-list" border stripe
      v-loading="tableLoading"
      :data="withdrawalList"
       @selection-change="selectionChange">
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="序号" type="index" :index="1" width="60"></el-table-column> -->
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="流水号" prop="serial_no">
      </el-table-column>
      <el-table-column label="代理ID">
        <template slot-scope="scope">
          <span>{{scope.row.user.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理昵称">
        <template slot-scope="scope">
          <span>{{scope.row.user.name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'提现金额' + this.localization.currency_unit" prop="amount"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="申请时间" prop="created_at"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-deep-purple optionBtn" @click="withdrawalDetail(scope.row.id)">详情</el-button>
          <el-button v-if="scope.row.status === '待审核'" class="btn-main optionBtn" @click="invite(scope.row.id)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  name: 'withdrawalList',
  data () {
    return {
      withdrawalList: [],
      deleteNum: [],
      status: '',
      statusList: [
        {
          id: 0,
          name: '待审核'
        },
        {
          id: 1,
          name: '审核通过'
        },
        {
          id: 2,
          name: '审核拒绝'
        }
      ],
      tableLoading: false,
      localization: {},
      page_params: {
        group: ''
      }
    }
  },
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  created () {
    if (this.$route.params.id) {
      // this.page_params.group = Number(this.$route.query.group)
      this.getList()
    }
  },
  methods: {
    getList () {
      console.log('page', JSON.stringify(this.page_params))
      this.tableLoading = true
      this.$request.agentsWithdraws(this.$route.params.id, {
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.status
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.withdrawalList = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          console.log('back', JSON.stringify(this.page_params))
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    withdrawalDetail (id) {
      this.$router.push({ name: 'wdDetail',
        params: {
          id: id
        } })
    },
    // 状态筛选
    onShipStatus () {
      this.page_params.handleQueryChange('status', this.status)
      this.getList()
    },
    // 修改客户组
    onUpdateGroup (id) {
      dialog({ type: 'vipgroup', id: id }, () => {
        this.getList()
      })
    },
    invite (id) {
      dialog({ type: 'inviteList',
        state: 'invite',
        id
      })
    },
    // 券包
    voucher (id) {
      dialog({ type: 'inviteList',
        state: 'voucher',
        id
      }, () => {
        this.getList()
      })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 选择客户组
    onGroupChange () {
      this.page_params.handleQueryChange('group', this.page_params.group)
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.withdrawal-list-container {
  .select-box {
    overflow: hidden
  }
  .el-icon-lock {
    color: red;
  }
  .optionBtn {
    margin: 3px;
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
  }
}
</style>

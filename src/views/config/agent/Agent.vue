<template>
  <div class="agent-list-container">
      <div>
      <search-group :placeholder="$t('请输入关键字')" v-model="page_params.keyword"  @search="goSearch">
      </search-group>
    </div>
    <div class="clear-box"><add-btn router="addAgent">{{$t('添加代理')}}</add-btn></div>
    <el-table class="data-list" border stripe :data="suggestList"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('代理名称')" prop="agent_name">
      </el-table-column>
      <el-table-column :label="$t('佣金分成%')" prop="commission">
      </el-table-column>
      <el-table-column :label="$t('代理二维码')" align="center">
        <template slot-scope="scope">
          <span style="cursor:pointer;"
            @click.stop="imgSrc=scope.row.qr_code, imgVisible=true">
              <img :src="scope.row.qr_code" style="width: 100px;">
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('创建时间')" prop="created_at">
      </el-table-column>
      <el-table-column :label="$t('下单/成交数')">
      <template slot-scope="scope">
        <span>{{scope.row.total_order}}/{{scope.row.deal_order}}</span>
      </template>
      </el-table-column>
      <el-table-column :label="$t('是否启用')" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button class="btn-green" @click="editAgent(scope.row.id)">{{$t('修改')}}</el-button>
          <!-- 成交记录 -->
          <!-- 设置佣金 -->
          <el-button class="btn-deep-purple" @click="setCommission(scope.row.id, scope.row.agent_name, scope.row.commission)">{{$t('设置佣金')}}</el-button>
          <!-- <el-button class="btn-blue" @click="record(scope.row.id)">{{$t('成交记录')}}</el-button> -->
           <el-badge :value="scope.row.settle_count > 0 ? scope.row.settle_count : ''" class="item record-sty">
            <el-button class="btn-blue" @click="record(scope.row.id)">{{$t('成交记录')}}</el-button>
          </el-badge>
          <!-- 提现申请 -->
          <el-badge :value="scope.row.apply_counts > 0 ? scope.row.apply_counts : ''" class="item">
            <el-button class="btn-deep-blue" @click="withdrawal(scope.row.user_id)">{{$t('提现申请')}}</el-button>
          </el-badge>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
      <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
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
  data () {
    return {
      suggestList: [
        {
          enabled: true
        }
      ], // 表格数据
      tableLoading: false,
      imgVisible: false,
      imgSrc: '',
      deleteNum: []
    }
  },
  name: 'agentList',
  mixins: [pagination],
  components: {
    NlePagination,
    SearchGroup,
    AddBtn
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getAgents({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.suggestList = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          // this.suggestList = res.data
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
    // 修改代理
    editAgent (id) {
      console.log(id, 'id')
      this.$router.push({
        name: 'editAgent',
        query: {
          id: id
        }
      })
    },
    // 提现申请
    withdrawal (id) {
      this.$router.push({ name: 'Withdrawal',
        params: {
          id: id
        } })
    },
    // 修改代理管理的开关
    changeTransfer (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.resetAgents(id, Number(event)).then(res => {
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
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 成交记录
    record (id) {
      this.$router.push({
        name: 'record',
        query: {
          id: id
        }
      })
    },
    // 删除
    deleteData () {
      // this.$request.deleteVip({
      //   DELETE: this.deleteNum
      // }).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       title: '操作成功',
      //       message: res.msg,
      //       type: 'success'
      //     })
      //     this.getList()
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      // })
    },
    onChangeStatus (id) {
      dialog({
        type: 'changestatus', id: id
      }, () => {
        this.getList()
      }
      )
    },
    // 设置佣金
    setCommission (id, agentName, commission) {
      dialog({ type: 'commission', id: id, agentName: agentName, commission: commission }, () => {
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss">
.img_box{
  text-align: center;
  .imgDialog{
    width: 50%;
  }
}
.el-button {
  margin: 3px;
}
.record-sty {
  margin-right: 8px;
}
</style>

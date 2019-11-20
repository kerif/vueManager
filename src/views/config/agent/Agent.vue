<template>
  <div class="agent-list-container">
      <div>
      <search-group placeholder="请输入关键字" v-model="page_params.keyword"  @search="goSearch">
      </search-group>
    </div>
    <div class="clear-box"><add-btn router="addAgent">添加代理</add-btn></div>
    <el-table class="data-list" border stripe :data="suggestList"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="代理名称" prop="agent_name">
      </el-table-column>
      <el-table-column label="佣金分成%" prop="commission">
      </el-table-column>
      <el-table-column label="代理二维码" align="center">
        <template slot-scope="scope">
          <span style="cursor:pointer;"
            @click.stop="imgSrc=scope.row.qr_code, imgVisible=true">
              <img :src="scope.row.qr_code" style="width: 100px;">
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at">
      </el-table-column>
      <el-table-column label="下单/成交数">
      <template slot-scope="scope">
        <span>{{scope.row.total_order}}/{{scope.row.deal_order}}</span>
      </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editAgent(scope.row.id)">修改</el-button>
          <el-button class="btn-blue" @click="record(scope.row.id)">成交记录</el-button>
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
      suggestList: [], // 表格数据
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
      console.log(this.page_params.keyword)
      this.tableLoading = true
      this.$request.getAgents({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.suggestList = res.data
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
</style>

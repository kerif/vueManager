<template>
  <el-dialog :visible.sync="show" :title="$t('添加包裹')" class="dialog-add-packages"
  @close="clear" width="70%">
    <div class="searchUser">
      <el-input :placeholder="$t('请输入关键字')" v-model="keyword" @keyup.enter.native="getList">
        <template slot="append">
          <span @click="getList" class="search-btn">{{$t('搜索')}}</span>
        </template>
      </el-input>
    </div>
    <el-table
      :data="tableData"
      border
      @selection-change="selectionChange"
      style="width: 100%">
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        :label="$t('客户ID')">
        <template slot-scope="scope">
          <span>{{scope.row.user_id}}-{{scope.row.user_name}}</span>
        </template>
      </el-table-column>
      <!-- 快递单号 -->
      <el-table-column
        prop="express_num"
        :label="$t('快递单号')">
      </el-table-column>
      <!-- 物品名称 -->
      <el-table-column
        prop="package_name"
        :label="$t('物品名称')">
      </el-table-column>
      <!-- 物品价值 -->
      <el-table-column
        prop="package_value"
        :label="$t('物品价值')">
      </el-table-column>
      <!-- 物品属性 -->
        <el-table-column
        :label="$t('物品属性')">
          <template slot-scope="scope">
            <span v-for="item in scope.row.props" :key="item.id">{{item.name}}&nbsp;</span>
          </template>
        </el-table-column>
    </el-table>
    <div class="pagination-box">
        <nle-pagination :pageParams="page_params"></nle-pagination>
     </div>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      tableData: [],
      keyword: '',
      chooseId: 0,
      lineNum: [],
      id: ''
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    getList () {
      this.$request.getAddable(this.id, {
        keyword: this.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
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
    selectionChange (selection) {
      this.lineNum = selection.map(item => (item.id))
      console.log(this.lineNum, 'this.lineNum')
    },
    confirm () {
      if (!this.lineNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      // this.success(this.lineNum)
      // this.show = false
      this.$request.updateAddable(this.id, {
        ids: this.lineNum
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.show = false
      })
    },
    clear () {
      this.page_params.page = 1
      this.keyword = ''
      this.lineNum = []
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-add-packages {
  .searchUser {
    width: 40%;
    float: right;
    margin: 10px 0;
  }
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
}
</style>

<template>
  <div class="staff-list-container list-main">
    <div>
    <search-group v-model="page_params.keyword"></search-group>
    </div>
    <div class="select-box">
    <search-select v-model="change_params.checked" :selectArr="refundState" placeholder="审核状态"></search-select>
      <add-btn router="staffadd">添加客户组</add-btn>
    </div>
      <el-table
        class="data-list"
        :data="staff_list"
        border
        @selection-change="selectionChange"
        @row-click="rowClick"
        v-loading='tableLoading'
        ref="table">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <!-- 用户名 -->
      <el-table-column
        prop="name"
        label="用户名">
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column
        prop="human_count"
        label="姓名">
      </el-table-column>
      <!-- 邮箱 -->
      <el-table-column
        prop="sort_index"
        label="邮箱">
      </el-table-column>
      <!-- 员工组 -->
      <el-table-column
        prop="created_at"
        label="员工组">
      </el-table-column>
      <!-- 电话 -->
      <el-table-column
        prop="created_at"
        label="电话">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="created_at"
        label="最后登录时间">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!-- 编辑 -->
        <el-button
          class="btn-blue"
          @click.stop="editInfo(scope.row.id)">编辑</el-button>
          <!-- 修改密码 -->
        <el-button
          class="btn-purple"
          @click.stop="memberDetail(scope.row.id)">
          修改密码
        </el-button>
      </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <!-- 禁止登录 -->
          <el-button size="small" class="btn-deep-blue">禁止登录</el-button>
          <!-- 删除 -->
          <el-button size="small" class="btn-light-red">删除</el-button>
        </div>
      </template>
    </el-table>
    <!-- <my-page-and-btn
      :pageParams="page_params"
      :lists="btn_list">
    </my-page-and-btn > -->
      <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
export default {
  mixins: [pagination],
  components: {
    SearchGroup,
    AddBtn,
    NlePagination
  },
  name: 'staffListContainer',
  data () {
    return {
      staff_list: [],
      deleteSelectionLoading: false,
      tableLoading: false,
      normal: 1,
      change_params: {
        checked: ''
      },
      refundState: [
        { value: '1', label: '未审核' },
        { value: '2', label: '已拒绝' }
      ]
    }
  },
  created () {
    // this.getShopAgent()
  },
  computed: {
    btn_list () {
      return [{
        name: '反选', // 反选
        method: this.antiSelection
      }, {
        name: this.normal === 1 ? '禁止登录' : '允许登录', // 禁止登录
        method: this.forbidLogin,
        disabled: this.void_disabled,
        loading: this.forbidLoginLoading
      }, {
        name: '删除', // 删除
        method: this.deleteSelection,
        disabled: this.void_disabled,
        loading: this.deleteSelectionLoading
      }]
    }
    // headers () {
    //   return {
    //     Authorization: this.$store.state.token.token
    //   }
    // }
  },
  methods: {
    getList () {
      // this.tableLoading = true
      // this.$http.get(`agent-group`, {
      //   params: {
      //     page: this.page_params.page,
      //     size: this.page_params.size,
      //     keyword: this.page_params.keyword,
      //  checked: this.change_params.checked || 0
      //   }
      // }).then(res => {
      //   this.tableLoading = false
      //   // this.show_agent_setting = !!res.data.show_agent_setting
      //   this.staff_list = res.data.data
      //   // this.getPermission(this.staff_list)
      //   this.page_params.total = res.data.total
      // }).catch(() => {
      //   this.tableLoading = false
      // })
    },
    // 编辑
    editInfo (id) {
      this.$router.push({
        name: 'VIPGroupInfoEdit',
        query: {
          id: id
        }
      })
    },
    // 删除
    deleteData () {
      this.formatData('id')
      this.deleteSelectionLoading = true
      this.$http.delete(`agent-group/${this.format_selection.join(',')}`).then(res => {
        if (res.ret) {
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
          this.deleteSelectionLoading = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(() => {
        this.deleteSelectionLoading = false
      })
    },
    addHumans () {
      this.$router.push({
        name: 'addHumans'
      })
    },
    // 禁止/允许登录
    forbidLogin () {
      this.formatData('id')
      this.forbidLoginLoading = true
      let type = (this.normal === 1) ? 0 : 1
      this.$http.post(`customer/normal`, {
        customer_id: this.format_selection.join(','),
        normal: type
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('success'),
            message: res.msg,
            type: 'success'
          })
          this.forbidLoginLoading = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          this.forbidLoginLoading = false
        }
      }).catch(() => {
        this.forbidLoginLoading = false
      })
    }
  },
  watch: {
    // 监听已选择的行
    selection (newValue) {
      if (newValue.length) {
        console.log(newValue)
        if (newValue.every(item => item.normal === 1)) {
          this.normal = 1
        } else {
          this.normal = 0
        }
        console.log(this.normal)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.staff-list-container {
  .el-button {
    margin-bottom: 8px;
  }
  .select-box {
    overflow: hidden;
  }
}
</style>

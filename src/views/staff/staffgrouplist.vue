<template>
  <div class="staff-group-container list-main">
    <div>
    <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
    </div>
    <div class="select-box">
      <add-btn @click.native="addStaff">添加员工组</add-btn>
    </div>
    <el-button @click="editStaff">编辑</el-button>
    <el-button @click="changePre">修改权限</el-button>
    <el-button @click="member">成员</el-button>
      <el-table
        class="data-list"
        :data="staff_group_list"
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
          <!-- 修改权限 -->
        <el-button
          class="btn-purple"
          @click.stop="memberDetail(scope.row.id)">
          修改权限
        </el-button>
        <!-- 成员 -->
        <el-button>成员</el-button>
      </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
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
import { SearchGroup } from '@/components/searchs/index'
import NlePagination from '@/components/pagination'
import { pagination, selection } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  mixins: [pagination, selection],
  components: {
    SearchGroup,
    AddBtn,
    NlePagination
  },
  name: 'staffGroupContainer',
  data () {
    return {
      staff_group_list: [],
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
      //   this.staff_group_list = res.data.data
      //   // this.getPermission(this.staff_group_list)
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
    // 添加员工组
    addStaff () {
      dialog({ type: 'addStaff' })
    },
    // 编辑
    editStaff () {
      dialog({ name: 'addStaff' })
    },
    // 成员
    member () {
      dialog({ type: 'staffGroup' })
    },
    // 修改权限
    changePre () {
      this.$router.push({ name: 'modifyPermissions' })
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
.staff-group-container {
  .el-button {
    margin-bottom: 8px;
  }
  .select-box {
    overflow: hidden;
  }
}
</style>

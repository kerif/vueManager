<template>
  <div class="staff-group-container list-main">
    <div>
    <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
    </div>
    <div class="select-box">
      <add-btn @click.native="addStaff">添加员工组</add-btn>
    </div>
      <el-table
        class="data-list"
        :data="staff_group_list"
        border
        @selection-change="selectionChange"
        v-loading='tableLoading'
        ref="table">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <!-- 员工组中文名 -->
      <el-table-column
        prop="name_cn"
        label="员工组中文名">
      </el-table-column>
      <!-- 员工组英文名 -->
      <el-table-column
        prop="name_en"
        label="员工组英文名">
      </el-table-column>
      <!-- 成员数量 -->
      <el-table-column
        prop="admin_count"
        label="成员数量">
      </el-table-column>
      <!-- 所属仓库 -->
      <el-table-column
        prop="warehouse_name"
        label="所属仓库">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作" width="290">
        <template slot-scope="scope">
          <!-- 编辑 -->
        <el-button class="btn-blue" @click.stop="editStaff(scope.row.id)">编辑</el-button>
          <!-- 修改权限 -->
        <el-button class="btn-purple" v-if="scope.row.permissions === 1"
          @click.stop="changePre(scope.row.id)">
          修改权限
        </el-button>
        <!-- 成员 -->
        <el-button @click.stop="member(scope.row.id)" class="btn-green">成员</el-button>
        <!-- 所属仓库 -->
        <el-button class="btn-deep-blue" v-if="scope.row.permissions === 1" @click="warehouseChange(scope.row.id)">所属仓库</el-button>
      </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <!-- 删除 -->
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template>
    </el-table>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
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
  name: 'staffGroupList',
  data () {
    return {
      staff_group_list: [],
      tableLoading: false,
      normal: 1
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getVipGroup({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.staff_group_list = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        }
      })
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
      dialog({ type: 'addStaff', staff: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑
    editStaff (id) {
      dialog({ type: 'addStaff', id: id, staff: 'edit' }, () => {
        this.getList()
      })
    },
    // 修改所属仓库
    warehouseChange (id) {
      dialog({ type: 'warehouseTo', id: id }, () => {
        this.getList()
      })
    },
    // 成员
    member (id) {
      dialog({ type: 'staffGroup', id: id })
    },
    // 修改权限
    changePre (id) {
      console.log(id, 'id')
      this.$router.push({ name: 'modifyPermissions',
        params: {
          id: id
        } })
    },
    // 删除
    deleteData () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error('请选择员工组')
      }
      this.$confirm(`是否确认删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.deleteGroup({
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
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
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

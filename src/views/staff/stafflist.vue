<template>
  <div class="staff-list-container list-main">
    <div class="select-box">
      <div class="bottom-sty">
        <!-- 禁止登录 -->
        <el-button class="btn-orangey-red" size="small" @click="forbidLogin(0)">{{
          $t('禁止登录')
        }}</el-button>
        <el-button class="btn-blue-green" size="small" @click="forbidLogin(1)">{{
          $t('允许登录')
        }}</el-button>
        <!-- 删除 -->
        <el-button class="btn-light-red" size="small" @click="deleteData">{{
          $t('删除')
        }}</el-button>
      </div>
      <div class="headerList">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
        </div>
        <search-select
          :placeholder="$t('请选择员工组')"
          :selectArr="clientGroupList"
          v-model="page_params.group"
          @search="onGroupChange"
        >
        </search-select>
        <add-btn router="staffadd">{{ $t('添加员工') }}</add-btn>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        class="data-list"
        :data="staff_list"
        border
        ref="table"
        @selection-change="selectionChange"
        v-loading="tableLoading"
        height="calc(100vh - 270px)"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 用户名 -->
        <el-table-column :label="$t('用户名')" width="245">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
            <i class="el-icon-lock" v-if="scope.row.forbid_login"></i>
          </template>
        </el-table-column>
        <!-- 姓名 -->
        <el-table-column prop="name" :label="$t('姓名')" width="200"> </el-table-column>
        <!-- 邮箱 -->
        <el-table-column prop="email" :label="$t('邮箱')"> </el-table-column>
        <!-- 员工组 -->
        <el-table-column prop="admin_group.name_cn" :label="$t('员工组')" width="120">
        </el-table-column>
        <!-- 电话 -->
        <el-table-column prop="phone" :label="$t('电话')" width="120"> </el-table-column>
        <!-- 最后登录时间 -->
        <el-table-column prop="last_login_at" :label="$t('最后登录时间')" width="155">
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" fixed="right" width="205">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button class="btn-main" @click.stop="editInfo(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <!-- 修改密码 -->
            <el-button class="btn-light-green" @click.stop="editPassword(scope.row.id)">
              {{ $t('修改密码') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div>
  </div>
</template>
<script>
import { SearchGroup, SearchSelect } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  mixins: [pagination],
  components: {
    SearchGroup,
    AddBtn,
    NlePagination,
    SearchSelect
  },
  name: 'staffList',
  data() {
    return {
      staff_list: [],
      deleteNum: [],
      deleteSelectionLoading: false,
      tableLoading: false,
      normal: 1,
      clientGroupList: [],
      page_params: {
        group: ''
      }
    }
  },
  created() {
    this.getCategory()
    if (this.$route.query.group) {
      this.page_params.group = Number(this.$route.query.group)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getStaff({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          group: this.page_params.group
        })
        .then(res => {
          if (res.ret) {
            this.staff_list = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    // 获取员工组
    getCategory() {
      this.$request.getVips().then(res => {
        res.data.forEach(item => {
          this.clientGroupList.push({
            value: item.id,
            label: item.name_cn
          })
        })
      })
    },
    // 编辑
    editInfo(id) {
      this.$router.push({
        name: 'staffEdit',
        params: {
          state: 'edit',
          id: id
        }
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 修改密码
    editPassword(id) {
      dialog({ type: 'editPsd', id: id })
    },
    // 删除
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择员工'))
      }
      this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deleteVip({
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
    // 禁止/允许登录
    forbidLogin(type) {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择员工'))
      }
      console.log(type)
      if (type === 0) {
        this.$request
          .forbidUser({
            forbid_id: this.deleteNum
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
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
        this.$request
          .allowUser({
            allow_id: this.deleteNum
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
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      }
    },
    // 选择员工组
    onGroupChange() {
      this.page_params.handleQueryChange('group', this.page_params.group)
      this.getList()
    }
  },
  watch: {
    // 监听已选择的行
    selection(newValue) {
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
  .headerList {
    // display: flex;
    // justify-content: flex-start;
    // overflow: hidden;
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .searchGroup {
      width: 22.2%;
      margin-right: 10px;
      // margin-right: 10px;
    }
    .el-col {
      margin-right: 10px;
    }
  }
  .el-button {
    margin-bottom: 8px;
  }
  .select-box {
    // margin-top: 5px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }
  .bottom-sty {
    button {
      margin-bottom: 0;
    }
    display: flex;
    align-items: center;
    // margin-top: 20px;
    // margin-bottom: 10px;
  }
}
</style>

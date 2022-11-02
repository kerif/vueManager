<template>
  <div class="staff-group-container list-main">
    <div class="select-box">
      <div class="bottom-sty">
        <!-- 删除 -->
        <el-button class="btn-light-red" size="small" @click="deleteData">{{
          $t('删除')
        }}</el-button>
      </div>
      <div class="searchGroup">
        <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
        <add-btn @click.native="addStaff">{{ $t('添加员工组') }}</add-btn>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        class="data-list"
        :data="staff_group_list"
        border
        @selection-change="selectionChange"
        v-loading="tableLoading"
        ref="table"
        height="calc(100vh - 275px)"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 员工组中文名 -->
        <el-table-column prop="name_cn" :label="$t('员工组中文名')"> </el-table-column>
        <!-- 员工组英文名 -->
        <el-table-column prop="name_en" :label="$t('员工组英文名')"> </el-table-column>
        <!-- 成员数量 -->
        <el-table-column prop="admin_count" :label="$t('成员数量')" width="100"> </el-table-column>
        <!-- 所属仓库 -->
        <el-table-column prop="warehouses" :label="$t('所属仓库')" :formatter="fileData">
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" width="500">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              v-if="scope.row.permissions === 1"
              class="btn-blue"
              @click.stop="editStaff(scope.row.id)"
              >{{ $t('编辑') }}</el-button
            >
            <!-- 修改权限 -->
            <el-button
              class="btn-purple"
              v-if="scope.row.permissions === 1"
              @click.stop="changePre(scope.row.id)"
            >
              {{ $t('修改权限') }}
            </el-button>
            <!-- 成员 -->
            <el-button @click.stop="member(scope.row.id)" class="btn-green">{{
              $t('成员')
            }}</el-button>
            <!-- 所属仓库 -->
            <el-button
              class="btn-deep-blue"
              v-if="scope.row.permissions === 1"
              @click="warehouseChange(scope.row.id)"
              >{{ $t('所属仓库') }}</el-button
            >
            <!-- 自提点权限 -->
            <el-button
              class="btn-pink"
              v-if="scope.row.permissions === 1"
              @click="pickPiont(scope.row.id)"
              >{{ $t('自提点权限') }}</el-button
            >
            <el-button
              class="btn-light-red"
              v-if="dataPermission.enabled === 1"
              @click="editTelPermission(scope.row.id, scope.row.hide_phone)"
              >{{ $t('数据权限') }}</el-button
            >
          </template>
        </el-table-column>
        <!-- <template slot="append">
        <div class="append-box">
        </div>
      </template> -->
      </el-table>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="$t('数据权限')" :visible.sync="show" @close="clear">
      <el-form>
        <el-form-item :label="$t('隐藏手机号')">
          <el-switch
            v-model="hide_phone"
            :active-text="$t('开')"
            :active-value="1"
            :inactive-value="0"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button :loading="$store.state.btnLoading" type="primary" @click="onConfirm">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog>
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
  data() {
    return {
      staff_group_list: [],
      tableLoading: false,
      normal: 1,
      dataPermission: {},
      show: false,
      hide_phone: 0
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    this.getConfig()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getVipGroup({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.staff_group_list = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          }
        })
    },
    // 编辑
    editInfo(id) {
      this.$router.push({
        name: 'VIPGroupInfoEdit',
        query: {
          id: id
        }
      })
    },
    // 添加员工组
    addStaff() {
      dialog({ type: 'addStaff', staff: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑
    editStaff(id) {
      dialog({ type: 'addStaff', id: id, staff: 'edit' }, () => {
        this.getList()
      })
    },
    // 修改所属仓库
    warehouseChange(id) {
      dialog({ type: 'warehouseTo', id: id }, () => {
        this.getList()
      })
    },
    // 自提点权限
    pickPiont(id) {
      dialog({ type: 'pickPoint', id: id }, () => {
        this.getList()
      })
    },
    fileData(row) {
      let arr = []
      if (!row.warehouses.length) {
        return (arr = ['全部仓库'])
      } else {
        row.warehouses.forEach((item, match) => {
          if (match > 10) {
            return
          }
          arr.push(item.warehouse_name)
        })
        return arr.join(',')
      }
    },
    // 成员
    member(id) {
      dialog({ type: 'staffGroup', id: id })
    },
    // 修改权限
    changePre(id) {
      this.$router.push({
        name: 'modifyPermissions',
        params: {
          id: id
        }
      })
    },
    // 删除
    deleteData() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择员工组'))
      }
      this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deleteGroup({
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
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
    },
    editTelPermission(id, hide_phone) {
      this.show = true
      this.id = id
      this.hide_phone = hide_phone
    },
    onConfirm() {
      let params = {}
      params.hide_phone = this.hide_phone
      this.$request.telPermission(this.id, params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getConfig() {
      this.$request.getFunConfig().then(res => {
        if (res.ret) {
          this.dataPermission = res.data[2]
          console.log(this.dataPermission)
        }
      })
    },
    clear() {}
  },
  watch: {
    // 监听已选择的行
    selection(newValue) {
      if (newValue.length) {
        if (newValue.every(item => item.normal === 1)) {
          this.normal = 1
        } else {
          this.normal = 0
        }
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
    // margin-top: 5px;
    display: flex;
    justify-content: space-between;
    .bottom-sty {
      display: flex;
      align-items: center;
      button {
        margin-bottom: 0;
      }
    }
  }
  .searchGroup {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    .search-group {
      margin-right: 10px;
      width: 22.3%;
    }
  }
}
</style>

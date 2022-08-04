<template>
  <div class="vipgroup-list-container">
    <div class="btn-flex">
      <div class="vip-group-search">
        <search-group
          paddingBottom="0"
          v-model="page_params.keyword"
          @search="goSearch"
        ></search-group>
        <div class="bottom-sty">
          <el-button class="btn-light-red" size="small" @click="deleteData">{{
            $t('删除')
          }}</el-button>
        </div>
      </div>
      <div class="select-box">
        <add-btn @click.native="addVip">{{ $t('添加客户组') }}</add-btn>
      </div>
    </div>
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('客户组')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('客户标签')" name="1"></el-tab-pane>
    </el-tabs>
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div>
        <el-button class="btn-main" size="small" @click="addVip">{{ $t('新增') }}</el-button>
        <el-button class="btn-light-red" size="small" @click="deleteData">{{
          $t('删除')
        }}</el-button>
      </div>
      <div style="background: #fff; padding: 10px 30px; border-radius: 5px; font-size: 14px">
        <span v-if="activeName === '0'">{{ $t('注: 每个客户仅能属于一个客户组') }}</span>
        <span v-else>{{ $t('注: 每个客户可以属于多个标签组') }}</span>
      </div>
      <div>
        <search-group
          paddingBottom="0"
          v-model="page_params.keyword"
          @search="goSearch"
        ></search-group>
      </div>
    </div>
    <div v-if="activeName === '0'"> -->
    <el-table
      :data="vipGroupList"
      stripe
      border
      ref="table"
      class="data-list"
      v-loading="tableLoading"
      height="calc(100vh - 275px)"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('客户组中文名')" prop="name_cn"></el-table-column>
      <el-table-column :label="$t('客户组英文名')" prop="name_en"></el-table-column>
      <el-table-column :label="$t('成员数量')" prop="user_count"></el-table-column>
      <el-table-column :label="$t('客户组描述')" prop="description"></el-table-column>
      <el-table-column :label="$t('同行货系统')" prop="stg_auth">
        <template slot-scope="scope">
          <span v-if="scope.row.stg_auth === 0">{{ $t('未授权') }}</span>
          <span v-else>{{ $t('已授权') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="350">
        <template slot-scope="scope">
          <el-button
            class="btn-green"
            @click="
              editVip(scope.row.id, scope.row.name_cn, scope.row.name_en, scope.row.description)
            "
            >{{ $t('修改资料') }}</el-button
          >
          <el-button class="btn-main" @click="member(scope.row.id)">{{ $t('成员') }}</el-button>
          <el-button
            class="btn-deep-purple"
            v-if="scope.row.stg_auth === 0"
            @click="tradeAuth(scope.row.id, 1)"
            >{{ $t('同行货授权') }}</el-button
          >
          <el-button class="btn-light-red" v-else @click="tradeAuth(scope.row.id, 0)">{{
            $t('解除授权')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
  <!-- <div v-else>
      <el-table
        :data="labelData"
        stripe
        border
        ref="table"
        class="data-list"
        v-loading="tableLoading"
        height="calc(100vh - 275px)"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column :label="$t('标签')" prop="name"></el-table-column>
        <el-table-column :label="$t('成员数量')" prop="users_count"></el-table-column>
        <el-table-column :label="$t('标签描述')" prop="description"></el-table-column>
        <el-table-column :label="$t('操作')" width="350">
          <div></div>
          <template slot-scope="scope">
            <el-button class="btn-main" @click="onEditInfo(scope.row.id)">{{
              $t('修改资料')
            }}</el-button>
            <el-button class="btn-light-green">{{ $t('批量导入') }}</el-button>
            <el-button class="btn-deep-purple" @click="member(scope.row.id)">{{
              $t('成员')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div> -->
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  name: 'vipGroupList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data() {
    return {
      vipGroupList: [],
      tableLoading: false,
      deleteNum: [],
      activeName: '0',
      labelData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getUserGroup({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.vipGroupList = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      // if (this.activeName === '0') {
      //   this.$request
      //     .getUserGroup({
      //       keyword: this.page_params.keyword,
      //       page: this.page_params.page,
      //       size: this.page_params.size
      //     })
      //     .then(res => {
      //       this.tableLoading = false
      //       if (res.ret) {
      //         this.vipGroupList = res.data
      //         this.page_params.page = res.meta.current_page
      //         this.page_params.total = res.meta.total
      //         this.$nextTick(() => {
      //           this.$refs.table.doLayout()
      //         })
      //       } else {
      //         this.$notify({
      //           title: this.$t('操作失败'),
      //           message: res.msg,
      //           type: 'warning'
      //         })
      //       }
      //     })
      // } else if (this.activeName === '1') {
      //   this.$request
      //     .userTag({
      //       keyword: this.page_params.keyword,
      //       page: this.page_params.page,
      //       size: this.page_params.size
      //     })
      //     .then(res => {
      //       this.tableLoading = false
      //       if (res.ret) {
      //         this.labelData = res.data
      //         this.page_params.page = res.meta.current_page
      //         this.page_params.total = res.meta.total
      //         this.$nextTick(() => {
      //           this.$refs.table.doLayout()
      //         })
      //       } else {
      //         this.$notify({
      //           title: this.$t('操作失败'),
      //           message: res.msg,
      //           type: 'warning'
      //         })
      //       }
      //     })
      // }
    },
    // 用户组分类选择值加载
    goSearchType(val) {
      this.page_params.page = 1
      this.page_params.name_cn = val
      this.getList()
    },
    // 添加客户组
    addVip() {
      dialog({ type: 'editVip', state: 'add' }, () => {
        this.getList()
      })
      // if (this.activeName === '0') {
      //   dialog({ type: 'editVip', state: 'add' }, () => {
      //     this.getList()
      //   })
      // } else if (this.activeName === '1') {
      //   dialog({ type: 'editLabel' }, () => {
      //     this.getList()
      //   })
      // }
    },
    // 修改资料
    editVip(id, nameCn, nameEn, description) {
      dialog(
        {
          type: 'editVip',
          id: id,
          name_cn: nameCn,
          name_en: nameEn,
          description: description,
          state: 'edit'
        },
        () => {
          this.getList()
        }
      )
    },
    // 成员
    member(id) {
      dialog({ type: 'vipList', id }, () => {
        this.getList()
      })
      // if (this.activeName === '0') {
      //   dialog({ type: 'vipList', id }, () => {
      //     this.getList()
      //   })
      // } else if (this.activeName === '1') {
      //   dialog({ type: 'labelMember', id }, () => {
      //     this.getList()
      //   })
      // }
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
    },
    // 删除
    deleteData() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户组'))
      }
      this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .userGroupDelete({
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
      // if (!this.deleteNum || !this.deleteNum.length) {
      //   return this.$message.error(
      //     this.activeName === '0' ? this.$t('请选择客户组') : this.$t('请选择标签')
      //   )
      // }
      // this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
      //   confirmButtonText: this.$t('确定'),
      //   cancelButtonText: this.$t('取消'),
      //   type: 'warning'
      // }).then(() => {
      //   if (this.activeName === '0') {
      //     this.$request
      //       .userGroupDelete({
      //         DELETE: this.deleteNum
      //       })
      //       .then(res => {
      //         if (res.ret) {
      //           this.$notify({
      //             title: this.$t('操作成功'),
      //             message: res.msg,
      //             type: 'success'
      //           })
      //           this.getList()
      //         } else {
      //           this.$message({
      //             message: res.msg,
      //             type: 'error'
      //           })
      //         }
      //       })
      //   } else {
      //     this.$request
      //       .deleteTag({
      //         DELETE: this.deleteNum
      //       })
      //       .then(res => {
      //         if (res.ret) {
      //           this.$notify({
      //             title: this.$t('操作成功'),
      //             message: res.msg,
      //             type: 'success'
      //           })
      //           this.getList()
      //         } else {
      //           this.$message({
      //             message: res.msg,
      //             type: 'error'
      //           })
      //         }
      //       })
      //   }
      // })
    },
    tradeAuth(id, stgAuth) {
      this.$confirm(
        stgAuth === 0
          ? this.$t('您是否确认解除该客户组同行货系统授权')
          : this.$t('您是否确认给予该客户组同行货系统授权'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.sameTradeAuth(id, stgAuth).then(res => {
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
    handleClick() {
      this.getList()
    },
    onEditInfo(id) {
      dialog({ type: 'editLabel', id }, () => {
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss">
.vipgroup-list-container {
  .select-box {
    overflow: hidden;
    display: inline-block;
    float: right;
    margin-left: 10px;
  }
  .btn-flex {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }
  .vip-group-search {
    width: 12.5%;
    overflow: hidden;
    float: left;
    display: flex;
    flex: 1;
    justify-content: space-between;
    flex-direction: row-reverse;
    align-items: center;
    .bottom-sty {
      // margin-top: 20px;
      // margin-bottom: 10px;
    }
  }
}
</style>

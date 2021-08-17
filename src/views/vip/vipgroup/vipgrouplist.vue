<template>
  <div class="vipgroup-list-container">
    <div class="btn-flex">
      <div class="search">
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
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            class="btn-green"
            @click="
              editVip(scope.row.id, scope.row.name_cn, scope.row.name_en, scope.row.description)
            "
            >{{ $t('修改资料') }}</el-button
          >
          <el-button class="btn-main" @click="member(scope.row.id)">{{ $t('成员') }}</el-button>
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
        </div>
      </template> -->
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
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
      deleteNum: []
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
      console.log(id, 'id')
      dialog({ type: 'vipList', id: id }, () => {
        this.getList()
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户组'))
      }
      this.$confirm(this.$t('是否确认删除？'), this.$t('提示'), {
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
    // width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }
  .search {
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

<template>
  <div class="apply-list-container">
    <!-- <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div> -->
      <div class="apply-top">
        <div class="apply-left">
           <el-radio-group v-model="radio">
            <el-radio :label="1">{{$t('按预报单号')}}</el-radio>
            <el-radio :label="2">{{$t('按会员ID')}}</el-radio>
          </el-radio-group>
        </div>
        <div class="apply-left">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="textarea2">
          </el-input>
        </div>
      </div>
    <el-table :data="applyList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')" prop="name_cn"></el-table-column>
      <!-- 预报单号 -->
      <el-table-column :label="$t('预报单号')" prop="name_en"></el-table-column>
      <!-- 物品名称 -->
      <el-table-column :label="$t('物品名称')" prop="user_count"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column :label="$t('物品属性')" prop="user_count"></el-table-column>
      <!-- 物品重量 -->
      <el-table-column :label="$t('物品重量')" prop="user_count"></el-table-column>
      <!-- 寄往国家 -->
      <el-table-column :label="$t('寄往国家')" prop="user_count"></el-table-column>
      <!-- 入库时间 -->
      <el-table-column :label="$t('入库时间')" prop="user_count"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column :label="$t('提交时间')" prop="user_count"></el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button class="btn-green" @click="editVip(scope.row.id, scope.row.name_cn,scope.row.name_en)">{{$t('修改')}}</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-deep-purple" @click="deleteData">{{$t('申请打包&合箱')}}</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
// import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  name: 'applyList',
  components: {
    // SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      applyList: [],
      tableLoading: false,
      textarea2: '',
      deleteNum: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getUserGroup({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.applyList = res.data
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
    // 用户组分类选择值加载
    goSearchType (val) {
      this.page_params.page = 1
      this.page_params.name_cn = val
      this.getList()
    },
    // 添加客户组
    addVip () {
      dialog({ type: 'editVip', state: 'add' }, () => {
        this.getList()
      })
    },
    // 修改资料
    editVip (id, nameCn, nameEn) {
      dialog({ type: 'editVip', id: id, name_cn: nameCn, name_en: nameEn, state: 'edit' }, () => {
        this.getList()
      })
    },
    // 成员
    member (id) {
      console.log(id, 'id')
      dialog({ type: 'vipList', id: id }, () => {
        this.getList()
      })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除
    deleteData () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择客户组'))
      }
      this.$confirm(this.$t('是否确认删除？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.userGroupDelete({
          DELETE: this.deleteNum
        }).then(res => {
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
.apply-list-container {
}
</style>

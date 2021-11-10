<template>
  <div class="vip-address-container">
    <el-button class="btn-light-red" @click="uploadList" size="mini">{{
      $t('导出清单')
    }}</el-button>
    <div class="searchGroup">
      <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
    </div>
    <div class="clear"></div>
    <el-table
      border
      stripe
      ref="table"
      :data="addressList"
      class="data-list"
      v-loading="tableLoading"
      height="calc(100vh - 275px)"
    >
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
      <el-table-column :label="$t('收件人')" prop="receiver_name"></el-table-column>
      <el-table-column :label="$t('联系电话')" prop="phone"></el-table-column>
      <el-table-column :label="$t('国家地区')" prop="country.name"></el-table-column>
      <el-table-column :label="$t('城市')" prop="city"></el-table-column>
      <el-table-column :label="$t('街道')" prop="street"></el-table-column>
      <el-table-column :label="$t('门牌号')" prop="door_no"></el-table-column>
      <el-table-column :label="$t('邮编')" prop="postcode"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editVip(scope.row.id, scope.row.user_id)">{{
            $t('修改')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  name: 'vipaddress',
  data() {
    return {
      addressList: [],
      tableLoading: false
    }
  },
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  activated() {
    this.getList()
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getUserAddress({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.addressList = res.data
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
    // 修改资料
    editVip(id, userId) {
      dialog({ type: 'addressEdit', id: id, userId: userId }, () => {
        this.getList()
      })
    },
    uploadList() {
      let param = {
        keyword: this.page_params.keyword
      }
      this.$request.exportList(param).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.searchGroup {
  width: 21.5%;
  float: right;
}
.clear {
  clear: both;
}
</style>

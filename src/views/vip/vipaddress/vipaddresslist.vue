<template>
  <div class="vip-address-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch"
      ></search-group>
    </div>
    <el-table border stripe :data="addressList" class="data-list"
    v-loading="tableLoading">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column label="客户ID" prop="user_id"></el-table-column>
      <el-table-column label="收件人" prop="receiver_name"></el-table-column>
      <el-table-column label="联系电话" prop="phone"></el-table-column>
      <el-table-column label="国家" prop="country.cn_name"></el-table-column>
      <el-table-column label="城市" prop="city"></el-table-column>
      <el-table-column label="街道" prop="street"></el-table-column>
      <el-table-column label="门牌号" prop="door_no"></el-table-column>
      <el-table-column label="邮编" prop="postcode"></el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'vipAddressList',
  data () {
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
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getUserAddress({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.addressList = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<!--成员信息界面-->
<template>
  <div> 
    <el-table :data="tableData" border style="width: 100%">
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column prop="username" label="用户名" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="phone" label="电话"></el-table-column>
    <el-table-column prop="last_login_at" label="最后登录时间"></el-table-column>
  </el-table>
  <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </div>
</template>

<script>
import { pagination } from '@/mixin'
import NlePagination from '@/components/pagination'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  props: {
    id: 0,
  },
  data() {
    return {
      tableData: [],
      page_params: {
        page: 1,
        size: 5,
      },
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$request
        .getVipMember(this.id, {
          page: this.page_params.page,
          size: this.page_params.size//默认是请求5个
        })
        .then(res => {
          console.log('这里的tableData为',res.data)
          this.tableData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        })
    },

    init() {
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
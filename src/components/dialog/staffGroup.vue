<template>
  <el-dialog :visible.sync="show" title="员工组成员" class="dialog-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 用户名 -->
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <!-- 邮箱 -->
        <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <!-- 电话 -->
        <el-table-column
        prop="phone"
        label="电话">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="last_login_at"
        label="最后登录时间">
      </el-table-column>
    </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm(ruleForm)">确定</el-button>
    </div> -->
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      tableData: [],
      rules: {
        name: [
          { required: true, message: '请输入员工组中文名', trigger: 'blur' }
        ],
        enName: [
          { required: true, message: '请输入员工组英文名', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    getList () {
      this.$request.getVipMember(this.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableData = res.data
        this.page_params.page = res.meta.current_page
        this.page_params.total = res.meta.total
      })
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.pagination-box {
  margin-top: 10px;
}
</style>

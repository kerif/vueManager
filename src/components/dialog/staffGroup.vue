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
        prop="real_name"
        label="用户名">
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column
        prop="phone_number"
        label="姓名">
      </el-table-column>
      <!-- 邮箱 -->
        <el-table-column
        prop="phone_number"
        label="邮箱">
      </el-table-column>
      <!-- 电话 -->
        <el-table-column
        prop="phone_number"
        label="电话">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="phone_number"
        label="最后登录时间">
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm(ruleForm)">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
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
  methods: {
    getList () {
      this.$request.getVipMember(this.id).then(res => {
        this.tableData = res.data
      })
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
</style>

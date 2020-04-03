<template>
  <el-dialog :visible.sync="show" title="设置佣金" class="dialog-commission"
  @close="clear">
    <el-form ref="form" :model="ruleForm" label-width="140px">
      <el-form-item label="代理名称">
        <span>{{agentName}}</span>
      </el-form-item>
      <el-form-item label="默认佣金">
          <el-input v-model="ruleForm.commission" class="input-select"></el-input>%
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 用户名 -->
      <el-table-column
        prop="name"
        label="线路名称">
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column
        label="分成方式">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 邮箱 -->
        <el-table-column
        label="值">
        <template slot-scope="scope">
          <el-input v-model="scope.row.commission"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm(ruleForm, tableData)">确定</el-button>
    </div>
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      ruleForm: {
        commission: ''
      },
      options: [
        {
          id: 1,
          name: '按比例提成'
        }, {
          id: 2,
          name: '按固定金额提成'
        }
      ],
      agentName: '',
      tableData: [
        {
          type: '',
          commission: ''
        }
      ]
    }
  },
  methods: {
    getList () {
      this.$request.getCommissions(this.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableData = res.data
        this.page_params.page = res.meta.current_page
        this.page_params.total = res.meta.total
      })
    },
    confirm (ruleForm, tableData) {
      let arr = tableData.map(item => {
        return {
          express_line_id: item.express_line_id,
          type: item.type,
          commission: item.commission
        }
      })
      this.$request.updateCommissions(this.id, {
        commission: this.ruleForm.commission,
        rules: arr
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.show = false
      })
    },
    init () {
      this.agentName = this.agentName
      this.ruleForm.commission = this.commission
      this.getList()
    },
    clear () {
      this.page_params.page = 1
      this.ruleForm.commission = ''
    }
  }
}
</script>
<style lang="scss">
.dialog-commission {
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }
  .input-select {
    width: 30%;
    margin-right: 10px;
  }
  .el-dialog__close {
    color: #FFF;
  }
}
</style>

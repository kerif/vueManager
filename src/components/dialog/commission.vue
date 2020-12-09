<template>
  <el-dialog :visible.sync="show" :title="$t('设置佣金')" class="dialog-commission"
  @close="clear" width="65%">
    <el-form ref="form" :model="ruleForm" class="commission-top">
      <el-form-item :label="$t('代理名称')">
        <span>{{agentName}}</span>
      </el-form-item>
      <el-form-item>
       <el-checkbox v-model="ruleForm.mode">{{$t('按比例计佣时，仅计算实际运费佣金（不包含增值费用、保险费用、抵用券等）')}}</el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('默认佣金')">
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
        :label="$t('线路名称')">
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column
        :label="$t('分成方式')">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" :placeholder="$t('请选择')" clearable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 值 -->
        <el-table-column
        :label="$t('值')">
        <template slot-scope="scope">
          <el-input v-model="scope.row.commission"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm(ruleForm, tableData)">{{$t('确定')}}</el-button>
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
        commission: '',
        mode: ''
      },
      options: [
        {
          id: 1,
          name: this.$t('按比例提成')
        }, {
          id: 2,
          name: this.$t('按固定金额提成')
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
    getAgent () {
      this.$request.getEditAgent(this.id).then(res => {
        if (res.ret) {
          this.ruleForm.mode = Boolean(res.data.mode)
        }
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
        mode: Number(this.ruleForm.mode),
        rules: arr
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
      this.getAgent()
    },
    clear () {
      this.page_params.page = 1
      this.ruleForm.commission = ''
      this.ruleForm.mode = ''
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
  .commission-top {
    margin-left: 20px;
  }
}
</style>

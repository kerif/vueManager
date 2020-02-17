<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? '新增货位': '编辑货位'" class="dialog-editAdd-location"
  @close="clear" width="60%">
  <div class="tips">
    <span>货位号生成规则：区域编号+连接符+所属列+连接符+所属层；限99列99层；货位数量=列数*层数</span>
  </div>
  <el-form ref="form" :model="location" label-width="140px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="区域编号">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="所属仓库">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <div class="unit">货架规格</div>
              <el-input class="right-unit"></el-input>*列 ——
                <el-input class="right-unit"></el-input>*层
        <el-form-item label="仓库数量">
          <el-input></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        prop="id"
        label="客户ID">
      </el-table-column>
      <!-- 客户昵称 -->
        <el-table-column
        prop="name"
        label="客户昵称">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="last_login_at"
        label="最后登录时间">
      </el-table-column>
    </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
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
      location: {},
      state: ''
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    getList () {
      this.$request.getUserMembers(this.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          console.log(this.tableData, 'tableData')
        }
      })
    },
    init () {
      // this.getList()
    },
    clear () {
      this.page_params.page = 1
    }
  }
}
</script>
<style lang="scss">
.dialog-editAdd-location {
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
  .el-dialog__close {
    color: #FFF;
  }
  .tips {
    margin-bottom: 30px;
    background-color: #fff2f1;
    border: 1px solid #ffc2c0;
    line-height: 30px;
  }
  .unit {
    display: inline-block;
  }
  .el-input {
  }
  .right-unit {
    width: 30% !important;
  }
}
</style>

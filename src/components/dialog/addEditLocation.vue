<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? '新增货位': '编辑货位'" class="dialog-editAdd-location"
  @close="clear" width="60%">
  <div class="tips">
    <span>货位号生成规则：区域编号+连接符+所属列+连接符+所属层；限99列99层；货位数量=列数*层数</span>
  </div>
  <el-form ref="form" :model="location" label-width="140px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="*区域编号">
          <el-input v-model="location.number" placeholder="请输入区域编号"></el-input>
        </el-form-item>
        <el-form-item label="所属仓库">
          <el-input v-model="warehouseName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <div class="unit">
        <span>货架规格</span>&nbsp;&nbsp;
              <el-input class="right-unit" v-model="location.column"
              placeholder="请输入" @blur="changeRow"></el-input>*列 ——
                <el-input class="right-unit" v-model="location.row"
                placeholder="请输入" @blur="changeRow"></el-input>*层
        </div>
        <el-form-item label="仓库数量">
          <el-input v-model="qty" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="bottom-btn">
      <el-button type="primary" @click="confirm">生成货位</el-button>
    </div>
  </el-form>
    <el-table
      v-if="this.state === 'edit'"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        prop="number"
        label="区域编号">
      </el-table-column>
      <!-- 客户昵称 -->
        <el-table-column
        prop="column"
        label="列数">
      </el-table-column>
        <el-table-column
        prop="row"
        label="层数">
      </el-table-column>
      <el-table-column
        prop="code"
        label="货位编码">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        label="货位状态">
        <template slot-scope="scope">
          <span v-if="scope.row.is_used === 0">未使用</span>
          <span v-if="scope.row.is_used === 1">已使用</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div> -->
    <div class="pagination-box" v-if="this.state === 'edit'">
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
      location: {
        row: '',
        column: '',
        number: ''
      },
      qty: '',
      areaId: '',
      state: '',
      warehouseName: '',
      id: ''
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    // 获取列表数据
    getList () {
      this.$request.getLocationList(this.id, this.areaId, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        }
      })
    },
    // 获得编辑区数据
    getDetails () {
      this.$request.getAllLocation(this.id, this.areaId).then(res => {
        if (res.ret) {
          this.location = res.data
          this.qty = res.data.column * res.data.row
        } else {
          return this.$message.error(res.msg)
        }
      })
    },
    changeRow () {
      if (this.location.column && this.location.row) {
        this.qty = this.location.column * this.location.row
      }
    },
    confirm () {
      if (!this.location.number) {
        return this.$message.error('请输入区域编号')
      } else if (!this.location.column) {
        return this.$message.error('请输入列数')
      } else if (!this.location.row) {
        return this.$message.error('请输入层数')
      }
      if (this.state === 'add') {
        this.$request.addLocation(this.id, this.location).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '成功',
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
      } else {
        this.$request.updateAllLocation(this.id, this.areaId, this.location).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            this.getList()
            // this.location.column = ''
            // this.location.row = ''
            // this.qty = ''
            // this.location.number = ''
            // this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
          // this.show = false
        })
      }
    },
    init () {
      // this.getList()
      if (this.state === 'edit') {
        this.getList() // 列表数据
        this.getDetails() // 详细数据
      }
      console.log(this.id, 'id')
      console.log(this.warehouseName, 'warehouseName')
    },
    clear () {
      this.page_params.page = 1
      this.location.column = ''
      this.location.row = ''
      this.qty = ''
      this.location.number = ''
      this.warehouseName = ''
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
    padding-left: 20px;
  }
  .unit {
    // display: inline-block;
    margin-bottom: 20px;
    margin-left: 70px;
  }
  .right-unit {
    width: 25% !important;
  }
  .bottom-btn {
    margin-left: 70px;
    margin-bottom: 20px;
  }
}
</style>

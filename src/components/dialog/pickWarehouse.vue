<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('新增货位') : $t('编辑货位')"
    class="dialog-pick-warehouse"
    @close="clear"
    width="60%"
  >
    <div class="tips">
      <span>{{
        $t(
          '货位号生成规则：区域编号+连接符+所属列+连接符+所属层；货位数量=列数*层数；货位数量不能超过10000'
        )
      }}</span>
    </div>
    <el-form ref="form" :model="location" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('*区域编号')" v-if="this.state === 'edit'">
            <el-input
              v-model="location.number"
              disabled
              :placeholder="$t('请输入区域编号')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('*区域编号')" v-else>
            <el-input v-model="location.number" :placeholder="$t('请输入区域编号')"></el-input>
          </el-form-item>
          <!-- <el-form-item :label="$t('自提点')">
          <el-input v-model="warehouseName" disabled></el-input>
        </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <div class="unit">
            <span>{{ $t('货架规格') }}</span
            >&nbsp;&nbsp;
            <el-input
              class="right-unit"
              v-model="location.column"
              :placeholder="$t('请输入')"
              @blur="changeRow"
            ></el-input
            >*{{ $t('列') }} ——
            <el-input
              class="right-unit"
              v-model="location.row"
              :placeholder="$t('请输入')"
              @blur="changeRow"
            ></el-input
            >*{{ $t('层') }}
          </div>
          <el-form-item :label="$t('货位数量')">
            <el-input v-model="qty" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item>
      <el-checkbox v-model="location.reusable">{{$t('允许同一个用户使用相同货位')}}</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row> -->
      <div class="bottom-btn">
        <el-button type="primary" @click="confirm">{{ $t('生成货位') }}</el-button>
      </div>
    </el-form>
    <el-table v-if="this.state === 'edit'" :data="tableData" border style="width: 100%">
      <el-table-column type="index"> </el-table-column>
      <!-- 客户ID -->
      <el-table-column prop="number" :label="$t('区域编号')"> </el-table-column>
      <!-- 客户昵称 -->
      <el-table-column prop="column" :label="$t('列数')"> </el-table-column>
      <el-table-column prop="row" :label="$t('层数')"> </el-table-column>
      <el-table-column prop="code" :label="$t('货位编码')"> </el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column :label="$t('货位状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_locked === 1">{{ $t('已锁定') }}</span>
          <span v-else>
            <span v-if="scope.row.used_count === 0">{{ $t('未使用') }}</span>
            <span v-else>{{ $t('已使用') }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            class="btn-dark-green"
            v-if="scope.row.is_locked === 1"
            @click="lockLocation(scope.row.id, 0)"
            >{{ $t('解锁') }}</el-button
          >
          <el-button
            class="btn-light-red"
            v-if="scope.row.is_locked === 0"
            @click="lockLocation(scope.row.id, 1)"
            >{{ $t('锁定') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div> -->
    <!-- <div class="pagination-box" v-if="this.state === 'edit'">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div> -->
  </el-dialog>
</template>
<script>
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      tableData: [],
      location: {
        row: '',
        column: '',
        number: ''
        // reusable: ''
      },
      qty: '',
      areaId: '',
      state: '',
      warehouseName: '',
      id: ''
    }
  },
  components: {
    // NlePagination
  },
  mixins: [pagination],
  methods: {
    // 获得数据
    getDetails() {
      this.$request
        .getAlongLocation(this.areaId, {
          XStationId: this.id
        })
        .then(res => {
          if (res.ret) {
            this.location = res.data
            this.qty = res.data.column * res.data.row
            // this.location.reusable = Boolean(res.data.reusable)
            this.tableData = res.data.locations
            // this.page_params.page = res.meta.current_page
            // this.page_params.total = res.meta.total
          } else {
            return this.$message.error(res.msg)
          }
        })
    },
    changeRow() {
      if (this.location.column && this.location.row) {
        this.qty = this.location.column * this.location.row
      }
    },
    // 解锁 或 锁定
    lockLocation(id, val) {
      this.$request
        .locationLocked(id, val, {
          XStationId: this.id
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getDetails()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    confirm() {
      if (!this.location.number) {
        return this.$message.error(this.$t('请输入区域编号'))
      } else if (!this.location.column) {
        return this.$message.error(this.$t('请输入列数'))
      } else if (!this.location.row) {
        return this.$message.error(this.$t('请输入层数'))
      }
      if (this.state === 'add') {
        this.$request
          .locationAdd({
            XStationId: this.id,
            ...this.location
            // reusable: Number(this.location.reusable)
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
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
        this.$request
          .locationEdit(this.areaId, {
            XStationId: this.id,
            ...this.location
            // reusable: Number(this.location.reusable)
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getDetails()
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
    init() {
      if (this.state === 'edit') {
        this.getDetails() // 详细数据
      }
      console.log(this.id, 'id')
      console.log(this.warehouseName, 'warehouseName')
    },
    clear() {
      this.page_params.page = 1
      this.location.column = ''
      this.location.row = ''
      this.qty = ''
      this.location.number = ''
      this.warehouseName = ''
      // this.location.reusable = ''
    }
  }
}
</script>
<style lang="scss">
.dialog-pick-warehouse {
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
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

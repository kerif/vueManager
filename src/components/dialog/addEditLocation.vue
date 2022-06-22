<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('新增货位') : $t('编辑货位')"
    class="dialog-editAdd-location"
    @close="clear"
    width="65%"
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
          <el-form-item :label="$t('货位生成方式')">
            <el-radio-group v-model="radio">
              <el-radio :label="0">{{ $t('规则生成') }}</el-radio>
              <el-radio :label="1">{{ $t('自定义添加') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
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
          <el-form-item :label="$t('所属仓库')">
            <el-input v-model="warehouseName" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('货位容量')">
            <el-input-number v-model="location.max_count" :min="1" :max="1000"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="unit" v-if="radio === 0">
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
          <el-form-item :label="$t('仓位数量')" v-if="radio === 0">
            <el-input v-model="qty" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('同一客户包裹货位规则')">
            <!-- <el-checkbox v-model="location.reusable">{{
              $t('允许同一个用户使用相同货位')
            }}</el-checkbox> -->
            <el-select
              v-model="location.reusable"
              popper-class="billing-select"
              style="width: 100%"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in capacityData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item :label="$t('货位容量')">
          <el-input-number v-model="location.max_count" :min="1" :max="1000"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row> -->
      <div class="bottom-btn">
        <el-button type="primary" @click="confirm">{{ $t('生成货位') }}</el-button>
      </div>
    </el-form>
    <div v-if="this.state === 'edit'">
      <el-button class="btn-main">{{ $t('批量导入') }}</el-button>
      <el-button class="btn-main">{{ $t('添加') }}</el-button>
    </div>
    <el-table v-if="this.state === 'edit'" :data="tableData" border style="width: 100%">
      <el-table-column type="index"> </el-table-column>
      <!-- 客户ID -->
      <el-table-column prop="number" :label="$t('区域编号')"> </el-table-column>
      <el-table-column :label="$t('货位编码')"></el-table-column>
      <!-- 客户昵称 -->
      <el-table-column prop="column" :label="$t('列数')"> </el-table-column>
      <el-table-column prop="row" :label="$t('层数')"> </el-table-column>
      <el-table-column prop="code" :label="$t('货位编码')"> </el-table-column>
      <el-table-column prop="is_used" :label="$t('包裹数量')"> </el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column :label="$t('货位状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_locked === 0 && scope.row.is_used === 0">{{
            $t('未使用')
          }}</span>
          <span
            class="click-sty"
            v-if="scope.row.is_locked === 0 && scope.row.is_used > 0"
            @click="finishedUser(scope.row.id, scope.row.code)"
            >{{ $t('已使用') }}</span
          >
          <span v-if="scope.row.is_locked === 1">{{ $t('已锁定') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            class="btn-light-red"
            v-if="scope.row.is_locked === 1"
            @click="lockLocation(scope.row.id, 0)"
            >{{ $t('解锁') }}</el-button
          >
          <el-button
            class="btn-dark-green"
            v-if="scope.row.is_locked === 0"
            @click="lockLocation(scope.row.id, 1)"
            >{{ $t('锁定') }}</el-button
          >
          <el-button>{{ $t('删除') }}</el-button>
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
    <el-dialog
      :visible.sync="innerVisible"
      :title="$t('货位') + finishCode"
      class="dialog-invoice"
      width="35%"
      @close="clearSecond"
      append-to-body
    >
      <el-table :data="finishData" style="100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column :label="$t('快递单号/订单号')" prop="express_num"></el-table-column>
        <el-table-column :label="$t('上架时间')" prop="in_storage_at"></el-table-column>
      </el-table>
    </el-dialog>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      tableData: [],
      location: {
        row: '',
        column: '',
        max_count: '',
        number: '',
        reusable: ''
      },
      qty: '',
      areaId: '',
      state: '',
      warehouseName: '',
      id: '',
      innerVisible: false,
      finishId: '',
      finishCode: '',
      finishData: [],
      radio: 0,
      capacityData: [
        {
          id: 0,
          name: this.$t('优先推荐同一/相邻货位(受货位容量限制)')
        },
        {
          id: 1,
          name: this.$t('专用货位(不受货位容量限制)')
        },
        {
          id: 2,
          name: this.$t('专用货位(受货位容量限制)')
        }
      ]
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    // 获取列表数据
    getList() {
      this.$request
        .getLocationList(this.id, this.areaId, {
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    // 获得编辑区数据
    getDetails() {
      this.$request.getAllLocation(this.id, this.areaId).then(res => {
        if (res.ret) {
          this.location = res.data
          this.qty = res.data.column * res.data.row
          this.location.reusable = res.data.reusable
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
      this.$request.lockLocation(1, id, val).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    finishedUser(id, code) {
      this.innerVisible = true
      this.finishId = id
      this.finishCode = code
      this.getFinish()
    },
    getFinish() {
      this.$request.checkedFinish(this.finishId).then(res => {
        if (res.ret) {
          this.finishData = res.data
        }
      })
    },
    clearSecond() {},
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
          .addLocation(this.id, {
            ...this.location,
            reusable: Number(this.location.reusable)
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
          .updateAllLocation(this.id, this.areaId, {
            ...this.location,
            reusable: Number(this.location.reusable)
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
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
    init() {
      // this.getList()
      if (this.state === 'edit') {
        this.getList() // 列表数据
        this.getDetails() // 详细数据
      }
      console.log(this.id, 'id')
      console.log(this.warehouseName, 'warehouseName')
    },
    clear() {
      this.page_params.page = 1
      this.location.column = ''
      this.location.max_count = ''
      this.location.row = ''
      this.qty = ''
      this.location.number = ''
      this.warehouseName = ''
      this.location.reusable = ''
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
  .click-sty {
    cursor: pointer;
  }
}
.billing-select {
  .el-select-dropdown__item {
    width: 100%;
    overflow: auto;
  }
}
</style>

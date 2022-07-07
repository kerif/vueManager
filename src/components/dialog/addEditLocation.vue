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
            <el-radio-group v-model="location.type">
              <el-radio :label="0" :disabled="location.type === 1" v-if="this.state === 'edit'">{{
                $t('规则生成')
              }}</el-radio>
              <el-radio :label="0" v-if="this.state === 'add'">{{ $t('规则生成') }}</el-radio>
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  $t('配置区域编号、列数、行数后,系统自动三个生成规则货位,货位编号不可修改')
                "
                placement="top"
              >
                <span class="el-icon-question custom-icon"></span>
              </el-tooltip>
              <el-radio
                :label="1"
                :disabled="location.type === 1"
                v-if="this.state === 'edit'"
                @change="changeVal($event)"
                >{{ $t('自定义添加') }}</el-radio
              >
              <el-radio :label="1" v-if="this.state === 'add'" @change="changeVal($event)">{{
                $t('自定义添加')
              }}</el-radio>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('生成自定义货区后,可添加自定义货位,货位编号无格式限制')"
                placement="top"
              >
                <span class="el-icon-question custom-icon"></span>
              </el-tooltip>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="location.type === 0">
        <el-col :span="12">
          <el-form-item :label="$t('*区域编号')" v-if="this.state === 'edit'">
            <el-input
              v-model="location.locationRule.number"
              disabled
              :placeholder="$t('请输入区域编号')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('*区域编号')" v-else>
            <el-input
              v-model="location.locationRule.number"
              :placeholder="$t('请输入区域编号')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('所属仓库')">
            <el-input v-model="warehouseName" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('货位容量')">
            <el-input-number
              v-model="location.locationRule.max_count"
              :min="1"
              :max="1000"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="unit">
            <span>{{ $t('货架规格') }}</span
            >&nbsp;&nbsp;
            <el-input
              class="right-unit"
              v-model="location.locationRule.column"
              :placeholder="$t('请输入')"
              @blur="changeRow"
            ></el-input
            >*{{ $t('列') }} ——
            <el-input
              class="right-unit"
              v-model="location.locationRule.row"
              :placeholder="$t('请输入')"
              @blur="changeRow"
            ></el-input
            >*{{ $t('层') }}
          </div>
          <el-form-item :label="$t('仓位数量')">
            <el-input v-model="qty" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('同一客户包裹货位规则')">
            <el-select
              v-model="location.locationRule.reusable"
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
      <el-row :gutter="20" v-if="location.type === 1">
        <el-col :span="12">
          <el-form-item :label="$t('*区域编号')" v-if="this.state === 'edit'">
            <el-input
              v-model="location.locationCustom.number"
              disabled
              :placeholder="$t('请输入区域编号')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('*区域编号')" v-else>
            <el-input
              v-model="location.locationCustom.number"
              :placeholder="$t('请输入区域编号')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('所属仓库')">
            <el-input v-model="warehouseName" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('货位容量')">
            <el-input-number
              v-model="location.locationCustom.max_count"
              :min="1"
              :max="1000"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('同一客户包裹货位规则')">
            <el-select
              v-model="location.locationCustom.reusable"
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
      <div class="bottom-btn">
        <el-button type="primary" @click="confirm" v-if="this.state === 'add'">{{
          $t('生成货位')
        }}</el-button>
        <el-button
          type="primary"
          @click="onSave"
          v-if="this.state === 'edit' && location.type === 1"
          >{{ $t('保存') }}</el-button
        >
      </div>
    </el-form>
    <div v-if="this.state === 'edit' && location.type === 1" class="add-btn">
      <el-button class="btn-main" @click="addLocationCode">{{ $t('添加') }}</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-if="this.state === 'edit' && location.type === 0"
    >
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="number" :label="$t('区域编号')"> </el-table-column>
      <el-table-column prop="column" :label="$t('列数')"> </el-table-column>
      <el-table-column prop="row" :label="$t('层数')"> </el-table-column>
      <el-table-column prop="code" :label="$t('货位编码')"> </el-table-column>
      <el-table-column prop="is_used" :label="$t('包裹数量')">
        <template slot-scope="scope">
          <span>{{ scope.row.is_used }}</span>
        </template>
      </el-table-column>
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
      <el-table-column :label="$t('操作')" width="180px">
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
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" v-if="this.state === 'edit' && location.type === 0">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <el-table
      :data="locationData"
      border
      style="width: 100%"
      v-if="this.state === 'edit' && location.type === 1"
    >
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="number" :label="$t('区域编号')"> </el-table-column>
      <el-table-column prop="code" :label="$t('货位编码')"> </el-table-column>
      <el-table-column prop="is_used" :label="$t('包裹数量')"> </el-table-column>
      <el-table-column :label="$t('货位状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_locked === 0 && scope.row.is_used === 1">{{
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
      <el-table-column :label="$t('操作')" width="180px">
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
          <el-button class="btn-light-red" @click="onDeleteLocation(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" v-if="this.state === 'edit' && location.type === 1">
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
    <el-dialog :visible.sync="innerShow" :title="$t('添加')" @close="clearCode" append-to-body>
      <el-form :model="ruleForm">
        <el-form-item :label="$t('输入货位编码')">
          <el-input v-model="ruleForm.codes" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
      </div>
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
        type: 0,
        locationRule: {
          row: '',
          column: '',
          max_count: '',
          number: '',
          reusable: '',
          type: 0
        },
        locationCustom: {
          max_count: '',
          number: '',
          reusable: ''
        }
      },
      qty: '',
      areaId: '',
      state: '',
      warehouseName: '',
      id: '',
      innerVisible: false,
      innerShow: false,
      finishId: '',
      finishCode: '',
      finishData: [],
      locationData: [],
      ruleForm: {
        codes: ''
      },
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
            if (this.location.type === 0) {
              this.tableData = res.data
              this.locationData = []
              this.page_params.page = res.meta.current_page
              this.page_params.total = res.meta.total
            } else {
              this.tableData = []
              this.locationData = res.data
              this.page_params.page = res.meta.current_page
              this.page_params.total = res.meta.total
            }
          }
        })
    },
    // 获得编辑区数据
    getDetails() {
      this.$request.getAllLocation(this.id, this.areaId).then(res => {
        if (res.ret) {
          if (res.data.type === 0) {
            this.location.type = res.data.type
            this.location.locationRule = res.data
            this.qty = res.data.column * res.data.row
          } else {
            this.location.type = res.data.type
            this.location.locationCustom = res.data
          }
        } else {
          return this.$message.error(res.msg)
        }
      })
    },
    changeRow() {
      if (this.location.locationRule.column && this.location.locationRule.row) {
        this.qty = this.location.locationRule.column * this.location.locationRule.row
      } else if (this.location.locationCustom.column && this.location.locationCustom.row) {
        this.qty = this.location.locationCustom.column * this.location.locationCustom.row
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
    changeVal(e) {
      console.log(e)
    },
    addLocationCode() {
      this.innerShow = true
    },
    onDeleteLocation(id) {
      this.$request.delLocation(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
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
    onConfirm() {
      let params = {
        codes: this.ruleForm.codes.split('\n')
      }
      this.$request.addCustomLocation(this.areaId, params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.innerShow = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clearCode() {
      this.ruleForm.codes = ''
    },
    clearSecond() {},
    onSave() {
      let params = {
        ...this.location.locationCustom,
        type: this.location.type,
        reusable: Number(this.location.locationCustom.reusable)
      }
      this.$request.updateAllLocation(this.id, this.areaId, params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
          this.success()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm() {
      if (!this.location.locationRule.number && location.type === 0) {
        return this.$message.error(this.$t('请输入区域编号'))
      } else if (!this.location.locationRule.column && location.type === 0) {
        return this.$message.error(this.$t('请输入列数'))
      } else if (!this.location.locationRule.row && location.type === 0) {
        return this.$message.error(this.$t('请输入层数'))
      }
      let params = {}
      if (this.location.type === 0) {
        params = {
          ...this.location.locationRule,
          type: this.location.type,
          reusable: Number(this.location.locationRule.reusable)
        }
      } else {
        params = {
          ...this.location.locationCustom,
          type: this.location.type,
          reusable: Number(this.location.locationCustom.reusable)
        }
      }
      if (this.state === 'add') {
        this.$request.addLocation(this.id, params).then(res => {
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
        })
      } else {
        this.$request.updateAllLocation(this.id, this.areaId, params).then(res => {
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
        })
      }
    },
    init() {
      if (this.state === 'edit') {
        this.getDetails() // 详细数据
        this.getList() // 列表数据
      }
    },
    clear() {
      this.id = ''
      // this.page_params.page = 1
      this.location.locationRule.column = ''
      this.location.locationRule.max_count = ''
      this.location.locationRule.row = ''
      this.qty = ''
      this.location.locationRule.number = ''
      this.warehouseName = ''
      this.location.locationRule.reusable = ''
      this.location.locationCustom.column = ''
      this.location.locationCustom.max_count = ''
      this.location.locationCustom.row = ''
      this.location.locationCustom.number = ''
      this.location.locationCustom.reusable = ''
    }
  }
}
</script>
<style lang="scss">
.dialog-editAdd-location {
  .pagination-box {
    padding: 10px 0;
    margin: 10px 0;
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
  .add-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
  }
  .custom-icon {
    color: #74b34f;
    font-size: 18px;
  }
}
.billing-select {
  .el-select-dropdown__item {
    width: 100%;
    overflow: auto;
  }
}
</style>

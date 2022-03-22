<template>
  <div class="position-container">
    <h3>{{ $t('基本信息') }}</h3>
    <div class="box-card">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="leftWidth">
            <span class="leftSide">{{ $t('仓库名称') }}</span>
            <span class="rightBold">{{ this.$route.params.warehouseName }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button class="btn-deep-purple" style="margin-top: 20px" @click="editWarehouse">{{
            $t('修改')
          }}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="leftWidth">
            <span class="leftSide">{{ $t('收件人') }}</span>
            <span class="rightSide">{{ this.info.receiverName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="leftWidth">
            <span class="leftSide">{{ $t('联系电话') }}</span>
            <span class="rightSide">{{ this.info.phone }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="leftWidth">
            <span class="leftSide">{{ $t('地址') }}</span>
            <span class="rightSide">{{ this.info.address }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="leftWidth">
            <span class="leftSide">{{ $t('支持国家/地区') }}</span>
            <el-tag class="rightTag" v-for="item in this.info.supportCountries" :key="item.id">{{
              item.name
            }}</el-tag>
          </div>
        </el-col>
      </el-row>
    </div>
    <h3>{{ $t('仓库信息') }}</h3>
    <div class="select-box">
      <el-button type="danger" plain @click.native="addShelfRules">{{ $t('上架规则') }}</el-button>
      <add-btn @click.native="addLocation">{{ $t('新增货位') }}</add-btn>
    </div>
    <el-table
      :data="positionList"
      stripe
      border
      class="data-list positions-type"
      v-loading="tableLoading"
      @selection-change="selectionChange"
    >
      <el-table-column width="100px" align="center">
        <template>
          <i class="el-icon-sort icon-fonts"></i>
        </template>
      </el-table-column>
      <el-table-column :label="$t('区域编号')" prop="number"></el-table-column>
      <el-table-column :label="$t('列数')" prop="column"></el-table-column>
      <el-table-column :label="$t('层数')" prop="row"></el-table-column>
      <el-table-column :label="$t('货位数量')" prop="counts"></el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('状态')" width="180px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changeTransfer($event, scope.row.status, scope.row.id)"
            :active-text="$t('解锁')"
            :inactive-text="$t('锁定')"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="200">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editLocation(scope.row.id)">{{
            $t('修改货位')
          }}</el-button>
          <el-button class="btn-light-red" @click="deleteWarehouse(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <div class="sort-sty">
      *{{ $t('拖拽行可以进行排序') }}
      <el-button @click="typeRowUpdate" class="btn-deep-purple save-sort">{{
        $t('保存排序结果')
      }}</el-button>
      <el-button @click="autoRow" class="btn-pink save-sort">{{
        $t('按区域编号自动排序')
      }}</el-button>
    </div>
    <el-dialog
      :visible.sync="show"
      :title="$t('上架规则')"
      class="dialog-shelfRules"
      @close="clear"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
        <!--无人认领专区  -->
        <el-form-item :label="$t('规则一:包裹下架节点')">
          <el-select :placeholder="$t('请选择')" v-model="ruleForm.off_shelf_status">
            <el-option
              v-for="item in nodeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('规则二:无人认领专区')">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('*货区可多选当包裹为无人认领时强制放入专区不受其他规则限制')"
            placement="top"
          >
            <span class="el-icon-question question-icon" style="margin-left: -14px"></span>
          </el-tooltip>
          <el-select :placeholder="$t('请选择')" v-model="ruleForm.number" multiple>
            <el-option
              v-for="item in areaNumber"
              :key="item.id"
              :label="item.numbers"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import Sortable from 'sortablejs'
export default {
  name: 'positionList',
  components: {
    // SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data() {
    return {
      ruleForm: {
        number: '',
        off_shelf_status: ''
      },
      positionList: [],
      typeSendData: [],
      tableLoading: false,
      deleteNum: [],
      unClaimed: '',
      areaNumber: [],
      noAreaNumber: [],
      show: false,
      info: {},
      nodeList: [
        { id: 0, name: '打包完成' },
        { id: 1, name: '拣货完成' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .locationArea(this.$route.params.id, {
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.positionList = res.data
            this.typeSendData = [...res.data]
            // this.areaNumber = res.data.map(item => {
            //   let id = item.id
            //   let numbers = item.number
            //   return { id, numbers }
            // })
            this.$nextTick(() => {
              this.typeRowDrop()
            })
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.info = JSON.parse(this.$route.query.info)
            console.log(this.info)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 自定义物流 行拖拽
    typeRowDrop() {
      const tbody = document.querySelector('.positions-type tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.typeSendData.splice(oldIndex, 1)[0]
          this.typeSendData.splice(newIndex, 0, oldItem)
        }
      })
    },
    // 确定拖拽
    typeRowUpdate() {
      const ids = this.typeSendData.map(({ id, context }, index) => ({ id, index, context }))
      this.positionList = []
      this.$request.positionsSort(this.$route.params.id, ids).then(res => {
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
    // 按区域编号自动排序
    autoRow() {
      this.$confirm(this.$t('您是否确认按区域编号自动排序'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.resetIndex(this.$route.params.id).then(res => {
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
      })
    },
    // 修改仓库
    editWarehouse() {
      this.$router.push({
        name: 'warehouseEdit',
        params: {
          id: this.$route.params.id
        }
      })
    },
    // 修改开关
    changeTransfer(event, enabled, id) {
      this.$request.updateLocks(id, Number(event)).then(res => {
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
    // 上架规则
    addShelfRules() {
      this.show = true
      this.$request.locationArea(this.$route.params.id, { size: 999 }).then(res => {
        if (res.ret) {
          this.ruleForm.number = res.data
            .filter(item => item.no_package_special)
            .map(item => item.id)
          this.areaNumber = res.data.map(item => {
            let id = item.id
            let numbers = item.number
            return { id, numbers }
          })
          this.getOffShelf()
        }
      })
    },
    // 新增货位
    addLocation() {
      dialog(
        {
          type: 'locationList',
          state: 'add',
          id: this.$route.params.id,
          warehouseName: this.$route.params.warehouseName
        },
        () => {
          this.getList()
        }
      )
    },
    // 编辑货位
    editLocation(areaId) {
      dialog(
        {
          type: 'locationList',
          state: 'edit',
          id: this.$route.params.id,
          areaId: areaId,
          warehouseName: this.$route.params.warehouseName
        },
        () => {
          this.getList()
        }
      )
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
    },
    // 删除单条转账支付
    deleteWarehouse(areaId) {
      this.$confirm(this.$t('您真的要删除此货位吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteLocation(this.$route.params.id, areaId).then(res => {
          if (res.ret) {
            this.$notify({
              title: '',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    getOffShelf() {
      this.$request.aloneWarehouseAddress(this.$route.params.id).then(res => {
        if (res.ret) {
          this.ruleForm.off_shelf_status = res.data.off_shelf_status
        }
      })
    },
    submit() {
      this.$request
        .offShelfStatus(this.$route.params.id, {
          area_ids: this.ruleForm.number,
          off_shelf_status: this.ruleForm.off_shelf_status
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.show = false
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
    clear() {
      this.getList()
      this.ruleForm.number = ''
      this.ruleForm.off_shelf_status = ''
    }
  }
}
</script>
<style lang="scss">
.position-container {
  .box-card {
    font-size: 14px;
    background: #fff;
    .leftWidth {
      padding: 20px 0 5px 50px;
      width: 1000px;
      .leftSide {
        display: inline-block;
        width: 120px;
      }
      .rightSide {
        font-size: 14px;
      }
      .rightTag {
        margin: 5px 5px 5px 0;
      }
      .rightBold {
        font-size: 18px;
        font-weight: 700;
      }
    }
  }
  .select-box {
    float: right;
    overflow: hidden;
  }
  .country-box {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .add-btn-container {
    margin-left: 10px;
  }
  .icon-fonts {
    font-size: 28px;
  }
  .save-sort {
    margin-left: 10px;
  }
  .sort-sty {
    margin-top: 20px;
    color: red;
    font-size: 13px;
  }
  .dialog-shelfRules {
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
    .el-form-item__label {
      text-align: left;
    }
    .question-icon {
      color: #74b34f;
    }
  }
}
</style>

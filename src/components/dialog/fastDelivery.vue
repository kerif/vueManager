<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('快速出库')"
    class="fast-delivery-container"
    @close="clear"
    width="85%"
  >
    <el-row>
      <el-col :span="12">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          :placeholder="$t('多个包裹单号，请用回车分割')"
          v-model="textarea2"
        >
        </el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click.native="search">{{ $t('查询') }}</el-button>
      </el-col>
    </el-row>
    <el-table class="table-sty" :data="tableData" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')">
        <template slot-scope="scope">
          <span>{{ scope.row.user.id }}-{{ scope.row.user.name }}</span>
        </template>
      </el-table-column>
      <!-- 转运单号 -->
      <el-table-column prop="order_sn" :label="$t('转运单号')"> </el-table-column>
      <!-- 收件人 -->
      <el-table-column prop="receiver_name" :label="$t('收件人')"> </el-table-column>
      <!-- 联系电话 -->
      <el-table-column prop="receiver_phone" :label="$t('联系电话')"> </el-table-column>
      <!-- 到站时间 -->
      <el-table-column prop="shipped_at" :label="$t('到站时间')"> </el-table-column>
      <!-- 箱数 -->
      <el-table-column prop="box_count" :label="$t('箱数')"> </el-table-column>
      <!-- 重量 -->
      <el-table-column
        prop="actual_weight"
        :label="$t('重量') + `${localization.weight_unit ? localization.weight_unit : ''}`"
      >
      </el-table-column>
      <!-- 尺寸/体积 -->
      <el-table-column
        :label="$t('尺寸') + `${localization.length_unit ? localization.length_unit : ''}`"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.length }}</span
          >*<span>{{ scope.row.width }}</span
          >*<span>{{ scope.row.height }}</span>
        </template>
      </el-table-column>
      <!-- 所属发货单 -->
      <el-table-column prop="shipment_sn" :label="$t('所属发货单')"> </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="190px">
        <template slot-scope="scope">
          <el-button class="btn-light-red" @click="deleteRow(scope.$index, tableData)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p class="order-sty">
      {{ $t('订单数') }}：
      {{ tableData.length }}
    </p>
    <!-- <el-button class="created-btn" @click="goCreated">{{$t('创建发货单')}}</el-button> -->
    <div slot="footer">
      <!-- <el-button @click="show = false">{{$t('取消')}}</el-button> -->
      <el-button type="primary" @click="confirmShip">{{ $t('确定出库') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import dialog from '@/components/dialog'
export default {
  data() {
    return {
      innerVisible: false,
      tableLoading: false,
      invoiceList: [],
      invoice: {
        sn: ''
      },
      country: [],
      tableData: [],
      textarea2: '',
      form: {},
      id: '',
      localization: {},
      orderSnNum: [],
      state: ''
    }
  },
  methods: {
    // 查询单号数据
    search() {
      this.$request
        .shipData({
          XStationId: this.id,
          sn: this.textarea2
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.localization = res.localization
          }
        })
    },
    getName(val) {
      console.log(val)
    },
    // 创建发货单 取消
    returnShip() {
      this.innerVisible = false
      this.show = true
    },
    // 确认出库
    confirmShip() {
      let dataId = this.tableData.map(item => item.id)
      if (!dataId.length) {
        return this.$message(this.$t('没有可选择的订单'))
      }
      console.log(dataId, 'dataId')
      this.$request
        .shipBatch({
          XStationId: this.id,
          ids: dataId
        })
        .then(res => {
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
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    clear() {
      this.textarea2 = ''
      this.tableData = []
    },
    init() {
      if (this.state === 'batch') {
        this.textarea2 = this.orderSnNum.join('\n')
        this.search()
        console.log(this.orderSnNum, '1111')
      }
    }
  }
}
</script>
<style lang="scss" scope>
.fast-delivery-container {
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
  .created-btn {
    margin-left: 5px;
  }
  .content-long {
    .el-scrollbar {
      width: 200px !important;
    }
  }
  .table-sty {
    margin-top: 20px;
  }
  .order-sty {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
.container-center {
  margin-bottom: 20px !important;
}
.leftWidth {
  // display: inline-block;
  width: 120px;
}
.el-select-dropdown__item.hover {
  width: auto;
}
.el-select-dropdown__item {
  width: 180px;
  white-space: nowrap; /*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis;
}
</style>

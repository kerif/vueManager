<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('快速转运')"
    class="fast-transport-container"
    @close="clear"
    width="85%"
  >
    <el-row>
      <el-col :span="12">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          :placeholder="$t('多个包裹单号请用回车分割')"
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
      <!-- 会员ID -->
      <el-table-column :label="$t('会员ID')">
        <template slot-scope="scope">
          <span>{{ scope.row.user.id }}-{{ scope.row.user.name }}</span>
        </template>
      </el-table-column>
      <!-- 转运单号 -->
      <el-table-column prop="order_sn" :label="$t('转运单号')"> </el-table-column>
      <!-- 收件人 -->
      <el-table-column prop="receiver_name" :label="$t('收件人')"> </el-table-column>
      <!-- 收件地址-->
      <el-table-column prop="receiver_name" :label="$t('收件地址')"> </el-table-column>
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
      <!-- 收货方式 -->
      <el-table-column :label="$t('收货方式')">
        <template slot-scope="scope">
          <span v-if="scope.row.station_name">{{ $t('自提收货') }}</span>
          <span v-else>{{ $t('送货上门') }}</span>
        </template>
      </el-table-column>
      <!-- 收货自提点 -->
      <el-table-column prop="station_name" :label="$t('收货自提点')"> </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="190px">
        <template slot-scope="scope">
          <el-button class="btn-light-red" @click="deleteRow(scope.$index, tableData)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        {{ $t('转运至:')
        }}<el-autocomplete
          :fetch-suggestions="queryCNSearch"
          :placeholder="$t('请选择转往自提点')"
          @select="handleSelect"
          v-model="transport"
        >
        </el-autocomplete>
      </el-col>
      <el-col :span="6" :offset="6">
        <span class="order-sty">
          {{ $t('订单数') }}：
          {{ tableData.length }}
        </span>
        <el-button type="primary" @click="confirmToShip"
          >{{ $t('确定出库') }}&nbsp;({{ tableData.length }})</el-button
        >
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      innerVisible: false,
      tableLoading: false,
      tableData: [],
      textarea2: '',
      form: {},
      id: '',
      transport: '',
      localization: {},
      state: '',
      station_id: '',
      orderSnNum: [],
      deleteNum: []
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
            console.log(this.tableData)
            this.tableData = res.data
            this.localization = res.localization
          }
        })
    },
    // 确认出库
    confirmToShip() {
      let param = {
        order_ids: this.deleteNum,
        station_id: this.station_id
      }
      this.$request.transformOrder(param).then(res => {
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
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    queryCNSearch(queryString, callback) {
      var list = [{}]
      this.$request
        .getPackagePick({
          keyword: this.transport
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.name
          }
          list = res.data
          callback(list)
        })
    },
    handleSelect(item) {
      console.log(item)
      console.log(item.id)
      this.station_id = item.id
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
.fast-transport-container {
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

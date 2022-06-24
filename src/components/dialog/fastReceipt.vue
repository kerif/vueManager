<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('快速收货')"
    class="dialog-fast-receipt"
    @close="clear"
    width="80%"
  >
    <el-row>
      <el-col :span="10">
        <div>
          <span>{{ $t('请选择收货方式：') }}</span
          ><br />
          <el-radio @change="changeRadio" v-model="form.type" class="radio-sty" :label="1">{{
            $t('整发货单（先扫码发货单号，然后包裹一个扫码核对，需复核）')
          }}</el-radio>
          <el-radio @change="changeRadio" v-model="form.type" :label="2">{{
            $t('单票收货（单个包裹一个扫码收货，无复核）')
          }}</el-radio>
        </div>
      </el-col>
      <el-col :span="11" :offset="1">
        <div v-if="form.type === 1">
          <span>{{ $t('发货单：') }}</span
          ><br />
          <el-input
            v-model="form.sn"
            class="input-sty radio-sty"
            :placeholder="$t('请输入发货单号或相关订单号')"
          ></el-input>
          <el-button @click="getList">{{ $t('确定') }}</el-button>
          <el-input
            v-model="orderNumber"
            type="textarea"
            :rows="3"
            class="input-sty"
            :placeholder="$t('多个订单号，请用回车分割')"
          ></el-input>
          <el-button @click="clickOrders">{{ $t('复核') }}</el-button>
        </div>
        <div v-if="form.type === 2">
          <el-input
            v-model="form.sn"
            type="textarea"
            :rows="4"
            class="input-sty"
            :placeholder="$t('多个订单号，请用回车分割')"
          ></el-input>
          <el-button @click="getList">{{ $t('确定') }}</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      class="table-sty"
      :data="tableData"
      border
      ref="multipleTable"
      @selection-change="selectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <!-- 用户名 -->
      <el-table-column :label="$t('客户ID')">
        <template slot-scope="scope">
          <span>{{ scope.row.user.id }}</span>
        </template>
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column prop="order_sn" :label="$t('转运单号')"> </el-table-column>
      <!-- 邮箱 -->
      <el-table-column prop="receiver_name" :label="$t('收件人')"> </el-table-column>
      <!-- 电话 -->
      <el-table-column :label="$t('联系电话')" prop="receiver_phone"> </el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column prop="shipped_at" :label="$t('发货时间')"> </el-table-column>
      <el-table-column prop="box_count" :label="$t('箱数')"> </el-table-column>
      <el-table-column
        prop="actual_weight"
        :label="$t('重量') + `${localization.weight_unit ? localization.weight_unit : ''}`"
      >
      </el-table-column>
      <el-table-column
        :label="$t('尺寸') + `${localization.length_unit ? localization.length_unit : ''}`"
      >
        {{ localization }}
        <template slot-scope="scope">
          {{ scope.row.length }}*{{ scope.row.width }}*{{ scope.row.height }}
          <!-- /{{scope.row.length*scope.row.width*scope.row.height/1000/1000}} -->
        </template>
      </el-table-column>
      <el-table-column prop="shipment_sn" :label="$t('所属发货单')"> </el-table-column>
    </el-table>
    <p class="order-sty">{{ $t('订单数') }}：{{ tableLength }}</p>
    <span v-if="form.type === 1">{{ $t('已复核') }}：{{ chooseNum.length }}</span>
    <div slot="footer">
      <el-button type="primary" @click="confirm">{{ $t('确定收货') }}</el-button>
    </div>
    <div class="pagination-box">
      <!-- <nle-pagination :pageParams="page_params"></nle-pagination> -->
    </div>
  </el-dialog>
</template>
<script>
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    // NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      tableData: [],
      deleteNum: [],
      chooseNum: [],
      id: '',
      form: {
        sn: '',
        type: 1
      },
      localization: {},
      orderNumber: '',
      tableLength: ''
    }
  },
  methods: {
    getList() {
      console.log(this.form.sn, 'sn: this.form.sn,')
      this.$request
        .getReceive({
          XStationId: this.id,
          sn: this.form.sn,
          type: this.form.type,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.tableLength = this.tableData.length
            this.localization = res.localization
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      // console.log(this.deleteNum, 'this.deleteNum')
    },
    changeRadio() {
      this.tableData = []
      this.form.sn = ''
      this.orderNumber = ''
    },
    // 复核
    clickOrders() {
      this.chooseNum = this.orderNumber.split(/[(\r\n)\r\n]+/)
      console.log(this.chooseNum, 'chooseNum')
      const chooseData = this.tableData.filter(item => {
        console.log(this.chooseNum.includes(item.order_sn), item.order_sn)
        return this.chooseNum.includes(item.order_sn)
      })
      console.log(chooseData, 'chooseData')
      this.$refs.multipleTable.clearSelection()
      chooseData.forEach(item => {
        console.log(item, this.$refs)
        this.$refs.multipleTable.toggleRowSelection(item)
      })
      // let counts
      // console.log(counts, 'counts')副·
      // let tmap = {}
      // this.tableData.filter(item => {
      //   this.chooseNum = item.order_sn
      // })
      // console.log(tmap, 'tmap')
    },
    selectable() {
      // if (row.id === 1) {
      // }
    },
    confirm() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      if (this.deleteNum.length !== this.tableData.length) {
        return this.$message.error(this.$t('需要全选才能确定收货'))
      }
      console.log(this.deleteNum, 'this.deleteNum')
      this.$request
        .updateReceive({
          XStationId: this.id,
          ids: this.deleteNum
        })
        .then(res => {
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
    init() {
      if (this.state === 'batch') {
        this.form.type = 2
        this.form.sn = this.orderSnNum.join('\n')
        this.getList()
        console.log(this.orderSnNum, '1111')
      }
      // this.getList()
    },
    clear() {
      this.page_params.page = 1
      this.form.sn = ''
      this.orderNumber = ''
      this.tableData = []
    }
  }
}
</script>
<style lang="scss">
.dialog-fast-receipt {
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
  .input-sty {
    width: 65%;
    margin-right: 30px;
  }
  .radio-sty {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .table-sty {
    margin-top: 20px;
  }
  .order-sty {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>

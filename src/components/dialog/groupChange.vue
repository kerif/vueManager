<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('修改团单信息')"
    class="dialog-edit-group"
    @close="clear"
    width="40%"
  >
    <el-form ref="form" :model="groupData" label-width="100px">
      <el-form-item :label="$t('团购名称')">
        <el-input :placeholder="$t('请输入团购名称')" v-model="groupData.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('支付模式')">
        <el-radio-group v-model="groupData.mode">
          <el-radio :label="0">{{ $t('团员自付') }}</el-radio>
          <el-radio :label="1">{{ $t('团长代付') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('当前路线')">
        <span>{{ groupData.express_line && groupData.express_line.name }}</span>
      </el-form-item>
      <span style="margin-left: 30px">{{ $t('收件地址') }}</span
      ><br />
      <div class="main-sty">
        <div class="address-sty address-left" v-if="groupData.address">
          <span>{{ groupData.address.receiver_name }}</span
          >&nbsp;<span>{{ groupData.address.phone }}</span
          ><br />
          <span
            >{{ groupData.address.country_name }}&nbsp;{{ groupData.address.city }}&nbsp;{{
              groupData.address.province
            }}&nbsp;{{ groupData.address.street }}&nbsp;{{ groupData.address.address }}</span
          >
        </div>
        <div class="address-sty address-right">
          <el-button class="btn-green" @click="changeAddress('address')">{{
            $t('更改地址')
          }}</el-button>
        </div>
      </div>
      <el-form-item :label="$t('收货方式')">
        <el-radio-group v-model="groupData.is_delivery">
          <el-radio :label="0">{{ $t('送货上门') }}</el-radio>
          <el-radio :label="1">{{ $t('自提收货') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="groupData.is_delivery === 1">
        <span style="margin-left: 30px">{{ $t('选择自提点') }}</span
        ><br />
        <div class="main-sty">
          <div class="address-sty address-left">
            <span>{{ stationName }}</span
            >&nbsp;<br />
          </div>
          <div class="address-sty address-right">
            <el-button class="btn-green" @click="changeAddress('pickup')">{{
              $t('选择自提点')
            }}</el-button>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
    <div class="pagination-box" v-if="this.state === 'edit'">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <el-dialog
      :visible.sync="innerVisible"
      :title="status === 'address' ? $t('收件地址列表') : $t('自提点地址')"
      class="dialog-invoice"
      width="55%"
      @close="clearSecond"
      append-to-body
    >
      <el-table :data="addressData" style="100%" @row-click="onRowChange" border>
        <el-table-column>
          <template slot-scope="scope">
            <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column :label="$t('国家')" v-if="status === 'address'">
          <template slot-scope="scope">
            <span>{{ scope.row.country && scope.row.country.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('城市')"
          prop="city"
          v-if="status === 'address'"
        ></el-table-column>
        <el-table-column
          :label="$t('收件人')"
          prop="receiver_name"
          v-if="status === 'address'"
        ></el-table-column>
        <el-table-column
          :label="$t('收件电话')"
          prop="phone"
          v-if="status === 'address'"
        ></el-table-column>
        <el-table-column
          :label="$t('详细地址')"
          prop="address"
          v-if="status === 'address'"
        ></el-table-column>
        <el-table-column
          :label="$t('自提点名称')"
          prop="name"
          v-if="status === 'pickup'"
        ></el-table-column>
        <el-table-column :label="$t('详细地址')" v-if="status === 'pickup'">
          <template slot-scope="scope">
            <span
              >{{ scope.row.country && scope.row.country.name }}&nbsp;
              {{ scope.row.address }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="innerVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitChoose">{{ $t('确定') }}</el-button>
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
      groupData: {
        name: '',
        is_delivery: 0,
        mode: 0,
        address_id: '',
        station_id: ''
      },
      qty: '',
      areaId: '',
      state: '',
      warehouseName: '',
      id: '',
      innerVisible: false,
      finishId: '',
      finishData: [],
      status: '',
      addressData: [],
      chooseId: 0,
      group: {},
      radio: '',
      stationData: [],
      stationName: ''
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    // 更改地址 或 选择自提点
    changeAddress(status) {
      this.status = status
      this.innerVisible = true
      let method = status === 'address' ? 'buyingAddress' : 'buyingStation'
      this.$request[method](this.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.addressData = res.data
        }
      })
    },
    onRowChange(row) {
      this.chooseId = row.id
      this.group = row
    },
    submitChoose() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      if (this.status === 'address') {
        this.groupData.address.receiver_name = this.group.receiver_name
        this.groupData.address.phone = this.group.phone
        this.groupData.address.country_name = this.group.country.cn_name
        this.groupData.address.city = this.group.city
        this.groupData.address.street = this.group.street
        this.groupData.address.province = this.group.province
        this.groupData.address.address = this.group.address
        this.groupData.address_id = this.group.id
      } else {
        this.stationName = this.group.name
        this.groupData.station_id = this.group.id
      }
      this.innerVisible = false
    },
    // 获取拼团信息
    getDetails() {
      this.$request.groupDetails(this.id).then(res => {
        if (res.ret) {
          this.groupData = res.data
          if (res.data.address) {
            this.groupData.address_id = res.data.address.id
          }
          if (res.data.station) {
            this.groupData.station_id = res.data.station.id
            this.stationName = res.data.station.name
          }
          this.groupData.mode = res.data.mode
          this.groupData.is_delivery = res.data.is_delivery
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clearSecond() {
      this.chooseId = ''
      this.addressData = []
      this.status = ''
    },
    confirm() {
      this.$request
        .updateGroupDetails(this.id, {
          name: this.groupData.name,
          mode: this.groupData.mode,
          is_delivery: this.groupData.is_delivery,
          address_id: this.groupData.address_id,
          station_id: this.groupData.is_delivery === 0 ? '' : this.groupData.station_id
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
        })
    },
    init() {
      this.getDetails()
    },
    clear() {
      this.id = ''
      this.addressData = []
      this.stationName = ''
      this.groupData.name = ''
      this.groupData.is_delivery = 0
      this.groupData.address_id = 0
      this.groupData.mode = 0
      this.groupData.station_id = 0
    }
  }
}
</script>
<style lang="scss">
.dialog-edit-group {
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
  .address-sty {
    display: inline-block;
  }
  .address-left {
    float: left;
  }
  .address-right {
    float: right;
  }
  .main-sty {
    overflow: hidden;
    margin-left: 30px;
    margin-top: 10px;
    border: 1px solid #d8d8d8;
    padding: 10px;
    border-radius: 15px;
  }
}
</style>

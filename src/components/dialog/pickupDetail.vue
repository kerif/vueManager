<template>
  <el-drawer size="85%" :visible.sync="show" :title="$t('取件详细')">
    <div class="dialog-pickup-detail" v-if="pickupInfo.id !== undefined">
      <div class="pickup-detail-header">
        <el-row :gutter="20">
          <el-col :span="12"
            ><b>您的预约单号: {{ pickupInfo.sn }}</b></el-col
          >
          <el-col :span="12" class="right-text font16w">
            {{ getStatusName }}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">创建时间: {{ pickupInfo.created_at }}</el-col>
          <el-col :span="12" class="right-text">
            <el-button-group>
              <el-button v-if="pickupInfo.status == 1" @click="onDelete">删除</el-button>
              <el-button v-if="pickupInfo.status == 1" @click="onSetCheck">设为审核</el-button>
              <el-button v-if="pickupInfo.status == 2" @click="onSetTrackingNumber"
                >设置转运单号</el-button
              >
            </el-button-group>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="card-box" shadow="never">
            <div slot="header" class="clearfix">
              <h5>取件地址</h5>
            </div>
            <div class="address-info">
              <div class="address-contact-info">
                <span class="address-contact-fullname"> {{ pickupInfo.address.name }}</span>
                <span class="address-contact-phone"> {{ pickupInfo.address.phone }}</span>
                <br />
                <div class="address-contact-address">
                  {{ pickupInfo.address.province }}{{ pickupInfo.address.city
                  }}{{ pickupInfo.address.distinct }}{{ pickupInfo.address.address }}
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="12">期望上门时间</el-col>
              <el-col :span="12" class="right-text">
                <span style="font-size: 18px; color: blue">{{ pickupInfo.pickup_time }}</span>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="card-box" shadow="never">
            <div slot="header" class="clearfix">
              <h5>预报信息</h5>
            </div>
            <div>
              <el-row>
                <el-col :span="12">寄往仓库</el-col>
                <el-col :span="12" class="right-text">{{
                  pickupInfo.warehouse.warehouse_name
                }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">寄往国家/地区</el-col>
                <el-col :span="12" class="right-text">{{ pickupInfo.country.name }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">预计重量</el-col>
                <el-col :span="12" class="right-text"
                  ><span class="weight-text">{{ pickupInfo.weight }} KG</span> &nbsp;
                  <span class="size-text"
                    >{{ pickupInfo.length }} * {{ pickupInfo.width }} *
                    {{ pickupInfo.height }} CM</span
                  ></el-col
                >
              </el-row>
              <el-row>
                <el-col :span="12">物品照片与备注</el-col>
                <el-col :span="12" class="text-right">{{ pickupInfo.remark }}</el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <br />
      <h5>物品清单</h5>
      <br />
      <el-table :data="pickupInfo.item" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="express_num" label="物品名称" width="180"> </el-table-column>
        <el-table-column prop="status_name" label="物品数量" width="180"> </el-table-column>
        <el-table-column prop="package_value" label="物品价值"> </el-table-column>
      </el-table>

      <el-card class="service-box" shadow="never">
        <div slot="header" class="clearfix">
          <h5>到仓服务</h5>
        </div>
        <div v-for="(serivce, index) in services" :key="index">
          拆包清点 $3.00
          <div>这里是详细说明</div>
        </div>
      </el-card>
    </div>
  </el-drawer>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      id: 0,
      pickupInfo: {
        id: 0
      }
    }
  },
  computed: {
    getStatusName() {
      let name = ''
      switch (this.pickupInfo.status) {
        case 1:
          name = '待审核'
          break
        case 2:
          name = '待取件'
          break
        case 3:
          name = '转运中'
          break
        case 4:
          name = '已入库'
          break
      }
      return name
    }
  },
  methods: {
    onDelete() {
      const ids = [this.pickinfo.id]
      this.$confirm(this.$t('您要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.pickupDelete({ ids: ids }).then(res => {
          if (res.ret) {
            this.getPickupDetail()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    init() {
      this.show = true
      this.getPickupDetail()
    },
    onSetCheck() {
      let ids = [this.pickinfo.id]
      this.$request.pickupSetCheck({ ids: ids }).then(res => {
        if (res.ret) {
          this.getPickupDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onSetTrackingNumber() {
      dialog({
        type: 'pickupSetTrackingInfo',
        tableList: [this.pickinfo]
      })
    },
    getPickupDetail() {
      this.$request.pickupInfo(this.id).then(res => {
        this.pickupInfo = res.data
      })
    }
  }
}
</script>
<style lang="scss">
.dialog-pickup-detail {
  padding: 20px;
  line-height: 25px;
  font-size: 13px;
  .pickup-detail-header {
    line-height: 40px;
    margin-bottom: 20px;
    justify-content: flex-end;
  }
  .font16w {
    font-weight: bold;
    font-size: 16px;
  }
  h5 {
    margin: 0px;
    font-size: 16px;
  }
  .card-box {
    min-height: 300px;
    .el-row {
      line-height: 50px;
      height: 50px;
      border-bottom: 1px solid #cccccc;
    }
  }
  .right-text {
    text-align: right;
  }
  .weight-text {
    font-size: 18px;
    font-weight: bold;
    color: red;
  }
  .address-info {
    .address-contact-info {
      margin-bottom: 50px;
      .address-contact-fullname {
        font-weight: bold;
        font-size: 16px;
      }
      .address-contact-phone {
        padding-left: 20px;
        color: #333333;
      }
      .address-contact-address {
        padding-top: 20px;
        color: #333333;
      }
    }
  }
  .service-box {
    margin-top: 30px;
  }
  .btn-group {
    padding-top: 20px;
    text-align: right;
  }
}
</style>

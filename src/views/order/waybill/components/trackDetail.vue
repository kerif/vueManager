<template>
  <el-drawer
    title=""
    :visible.sync="showDetail"
    direction="rtl"
    :withHeader="false"
    :before-close="close"
    @opened="open"
    size="50%"
  >
    <div class="track-detail">
      <div>
        <div class="detail-title">{{ $t('订单轨迹详细') }}</div>
        <div class="order-info">
          <div class="first-line">
            <div class="info-box">
              <div class="tip">{{ $t('订单号') }}</div>
              <div class="bold-font">{{ expressType == 1 ? item.order_sn : item.express_num }}</div>
            </div>
            <div class="info-box">
              <div class="tip">{{ $t('订单状态') }}</div>
              <div class="blue-font">{{ item ? item.status_name : '' }}</div>
            </div>
          </div>
          <div class="first-line">
            <div class="info-box">
              <div class="tip">{{ $t('转运单号') }}</div>
              <div>
                <span v-if="item.logistics_sn">{{ item.logistics_sn }}</span>
                <span style="color: #c8c8c8" v-else>{{ $t('未设置') }}</span>
              </div>
            </div>
            <div class="info-box">
              <div class="tip">{{ $t('转运公司') }}</div>
              <div>
                <span v-if="item.logistics_company">{{ item.logistics_company }}</span>
                <span style="color: #c8c8c8" v-else>{{ $t('未设置') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isEmpty" class="step-list">
        <div>
          <el-steps :active="1" direction="vertical" :space="100">
            <el-step v-for="(val, index) in TrackingData">
              <template v-slot:icon>
                <div :class="index == 0 ? 'icon-bag active-icon' : 'icon-bag'"></div>
              </template>
              <template v-slot:title>
                <div class="step-title">
                  <div>{{ val.context }}</div>
                  <div class="del-font" v-if="val.id" @click="deleteTable(val.id)">删除</div>
                </div>
              </template>
              <template v-slot:description>
                <div class="step-description">{{ val.created_at }}</div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
      <div class="empty-box" v-else>
        <img src="@/assets/empty.png" />
        <div class="tip-no">{{ $t('暂无物流消息') }}</div>
      </div>
      <div class="operate-line">
        <el-button @click="goTransport">{{ $t('设置转运订单') }}</el-button>
        <el-button @click="updateTracking">{{ $t('添加物流轨迹') }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  name: 'trackDetail',
  props: ['showDetail', 'selectItem', 'expressType'],
  data() {
    return {
      show: true,
      item: {},
      TrackingData: [],
      isEmpty: false
    }
  },
  mounted() {},
  methods: {
    open() {
      console.log(this.selectItem)
      // return
      this.getDetail()
    },
    close() {
      this.$emit('receive', false)
    },
    getDetail() {
      console.log('nitama wsm bu chulai')
      let params = {}
      if (this.expressType == 1) {
        params.type = 'order'
        params.sns = this.selectItem.order_sn.split('\n')
      } else {
        params.type = 'package'
        params.sns = this.selectItem.express_num.split('\n')
      }
      this.$request.getTrackInfo(params).then(res => {
        console.log(res.data)
        this.item = res.data[0]
        this.goExpress()
      })
    },
    goExpress() {
      console.log('expressType', this.expressType)
      if (this.expressType == 1) {
        this.$request
          .goTracking({
            order_sn: this.item.order_sn,
            with_id: 1
          })
          .then(res => {
            if (res.ret) {
              this.TrackingData = res.data.data
              if (!this.TrackingData.length) {
                this.isEmpty = true
              } else {
                this.isEmpty = false
              }
            } else {
              this.TrackingData = []
              this.isEmpty = true
            }
          })
      } else if (this.expressType == 2) {
        this.$request
          .goTracking({
            track_no: this.item.express_num
          })
          .then(res => {
            if (res.ret) {
              this.TrackingData = res.data.data
              console.log(res.data.data, 'TrackingData')
              if (!this.TrackingData.length) {
                this.isEmpty = true
              } else {
                this.isEmpty = false
              }
            } else {
              // this.$notify({
              //   title: this.$t('操作失败'),
              //   message: res.msg,
              //   type: 'warning'
              // })
              this.TrackingData = []
              this.isEmpty = true
            }
          })
      }
    },
    goTransport() {
      dialog(
        {
          type: 'addCompany',
          orderId: this.item.id,
          state: 'multiBox'
        },
        () => {
          this.getDetail()
        }
      )
    },
    clear() {
      this.form.logistics_type_id = ''
      this.logisticsRemark = ''
      this.created_at = ''
    },
    // 获取全部物流状态
    getType() {
      this.$request.getOrderStatus().then(res => {
        if (res.ret) {
          this.modeData = res.data
        }
      })
    },
    // 弹窗 管理
    goMore() {
      this.trackDialog = false
      this.$router.push({
        name: 'configurationMore',
        query: {
          activeName: '4',
          secondTab4: '4'
        }
      })
    },
    // 更改物流状态
    changeStatus() {
      let params = {
        order_ids: [this.item.id],
        is_member: Number(this.is_member),
        remark: this.logisticsRemark,
        created_at: this.created_at
      }
      if (this.modeData.map(item => item.id).includes(this.form.logistics_type_id)) {
        params.logistics_type_id = this.form.logistics_type_id
      } else {
        params.context = this.form.logistics_type_id
      }
      this.$request.changeOrderStatus(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.trackDialog = false
          this.getDetail()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 更新物流状态
    updateTracking() {
      // this.trackDialog = true
      // this.getType()
      dialog(
        {
          type: 'addTrajectory',
          orderId: this.item.id,
          state: 'multiBox'
        },
        () => {
          this.getDetail()
        }
      )
    },
    deleteTable(id) {
      this.$request.deleteOrderTable(this.item.id, id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.goExpress()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
  }
}
</script>

<style lang="scss">
div::-webkit-scrollbar {
  /*滚动条整体样式*/
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  width: 8px;
}

div::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: rgba(41, 109, 241, 0.1);
}

div::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: 0;
  border-radius: 0;
  background: #f0f2f5;
}
.track-detail {
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .detail-title {
    font-size: 24px;
    font-weight: bold;
  }
  .order-info {
    margin-top: 36px;
    font-size: 16px;
    padding: 0 50px 0 20px;
    .first-line {
      display: flex;
      margin-bottom: 16px;
      justify-content: space-between;
      .info-box {
        .tip {
          width: 80px;
        }
        display: flex;
        align-items: center;
        .bold-font {
          font-weight: bold;
        }
        .blue-font {
          color: #848ac5;
        }
      }
      .info-box:last-child {
        width: 150px;
      }
    }
  }

  .step-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 50px;
    margin-top: 32px;
    .icon-bag {
      width: 20px;
      height: 20px;
      background-color: #c8c8c8;
      border-radius: 50%;
    }
    .active-icon {
      background-color: #353a96;
    }
    .step-title {
      font-weight: bold;
      color: black;
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      .del-font {
        color: red;
        cursor: pointer;
        font-weight: 100;
        width: 50px;
        text-align: right;
      }
    }
    .step-description {
      color: #b5b5b5;
    }
    .el-step__main {
      padding-left: 16px;
    }
    .el-step__icon {
      border: none !important;
    }
    .is-text {
      border: none !important;
      width: 20px;
      height: 20px;
    }
    .el-step__line {
      left: 9px;
    }
  }
  .empty-box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
    img {
      width: 150px;
    }
    .tip-no {
      color: #c8c8c8;
      padding-left: 20px;
    }
  }
  .operate-line {
    margin-top: 16px;
    display: flex;
    justify-content: end;
  }
}
</style>

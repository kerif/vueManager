<template>
  <div class="tracking-container">
    <div class="left-search">
      <div class="search-sty">
        <el-select
          style="width: 100%"
          v-model="expressType"
          :placeholder="$t('请选择')"
          @change="changeType"
        >
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="sn-list">
        <el-input
          type="textarea"
          :rows="15"
          :placeholder="$t('请输入订单号/包裹号,多个订单号/包裹号请用回车分隔')"
          v-model="sns"
        >
        </el-input>
        <el-button class="search-btn" type="primary" @click="getList">{{ $t('查询') }}</el-button>
      </div>
    </div>
    <div class="right-info">
      <div class="package-search">
        <div class="top">
          <h3 v-if="this.expressType == 1">{{ $t('订单号查询') }}</h3>
          <h3 v-else>{{ $t('包裹单号查询') }}</h3>
          <el-button @click.native="trackingMana">{{ $t('自定义轨迹管理') }}</el-button>
        </div>
        <div class="info-tab">
          <el-table
            v-if="tableData.length > 0"
            :data="tableData"
            border
            style="width: 100%"
            height="calc(100vh - 250px)"
            @row-click="goDetail"
            row-class-name="row-style"
          >
            <template v-if="this.expressType == 2">
              <el-table-column fixed="left" prop="express_num" :label="$t('快递单号')" width="180">
              </el-table-column>
              <el-table-column prop="code" :label="$t('包裹编码')" width="130"> </el-table-column>
              <el-table-column prop="status_name" :label="$t('包裹状态')"> </el-table-column>
              <el-table-column prop="order_sn" :label="$t('订单号')" width="180"> </el-table-column>
              <el-table-column prop="warehouse.warehouse_name" :label="$t('仓库')" width="130">
              </el-table-column>
              <el-table-column prop="user_id" :label="$t('会员ID')"> </el-table-column>
              <el-table-column prop="user_name" :label="$t('会员名称')" width="130">
              </el-table-column>
              <el-table-column prop="package_name" :label="$t('品名')" width="180">
              </el-table-column>
              <el-table-column prop="in_storage_at" :label="$t('入库时间')" width="180">
              </el-table-column>
              <el-table-column prop="package_weight" :label="$t('重量')" width="100">
              </el-table-column>
              <el-table-column prop="name" :label="$t('尺寸')" width="100">
                <template slot-scope="scope">
                  {{ scope.row.length }}*{{ scope.row.width }}*{{ scope.row.height }}
                </template>
              </el-table-column>
              <el-table-column prop="shelf_up_at" :label="$t('上架时间')" width="180">
              </el-table-column>
              <el-table-column prop="shelf_up_user" :label="$t('上架人')" width="100">
              </el-table-column>
              <el-table-column prop="location" :label="$t('库位')" width="180"> </el-table-column>
              <el-table-column prop="shelf_off_at" :label="$t('下架时间')" width="180">
              </el-table-column>
              <el-table-column prop="shelf_off_user" :label="$t('下架人')" width="100">
              </el-table-column>
            </template>
            <template v-if="this.expressType == 1">
              <el-table-column fixed="left" prop="order_sn" :label="$t('订单号')" width="180">
              </el-table-column>
              <el-table-column prop="logistics_sn" :label="$t('转运单号')" width="130">
              </el-table-column>
              <el-table-column prop="status_name" :label="$t('订单状态')"> </el-table-column>
              <el-table-column prop="shipment_sn" :label="$t('发货单号')" width="180">
              </el-table-column>
              <el-table-column prop="warehouse.warehouse_name" :label="$t('仓库')" width="130">
              </el-table-column>
              <el-table-column prop="user_id" :label="$t('会员ID')"> </el-table-column>
              <el-table-column prop="created_at" :label="$t('下单时间')" width="180">
              </el-table-column>
              <el-table-column prop="country" :label="$t('目的地')" width="180"> </el-table-column>
              <el-table-column prop="boxes_type" :label="$t('打包方式')" width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.boxes_type == 1 ? $t('单箱') : $t('多箱') }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="boxes_count" :label="$t('打包箱数')" width="100">
              </el-table-column>
              <el-table-column prop="qty" :label="$t('内含件数')" width="100"> </el-table-column>
              <el-table-column prop="payment_weight" :label="$t('打包计费重量')" width="180">
              </el-table-column>
              <el-table-column prop="created_at" :label="$t('创建时间')" width="180">
              </el-table-column>
              <el-table-column prop="paid_at" :label="$t('支付时间')" width="180">
              </el-table-column>
              <el-table-column prop="packed_at" :label="$t('打包时间')" width="180">
              </el-table-column>
              <el-table-column prop="operator" :label="$t('打包人')" width="100"> </el-table-column>
              <el-table-column prop="shipped_at" :label="$t('发货时间')" width="180">
              </el-table-column>
              <el-table-column prop="signed_at" :label="$t('签收时间')" width="180">
              </el-table-column>
            </template>
          </el-table>
          <div class="empty-box" v-else>
            <img src="../../assets/empty.png" />
            <div>{{ $t('暂无物流消息') }}</div>
          </div>
          <!--                            <nle-pagination-->
          <!--            style="margin-top: 5px"-->
          <!--            :pageParams="page_params"-->
          <!--            :notNeedInitQuery="false"-->
          <!--          ></nle-pagination>-->
        </div>
      </div>
    </div>
    <Detail
      :showDetail="showDetail"
      :expressType="expressType"
      :selectItem="selectItem"
      @receive="receive"
    />
    <!--    <div class="search-main">-->
    <!--      <div class="main-top">-->
    <!--        <div class="number-sty">{{ $t('单号查询') }}:</div>-->
    <!--        <div class="search-sty">-->
    <!--          <el-select v-model="expressType" :placeholder="$t('请选择')">-->
    <!--            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">-->
    <!--            </el-option>-->
    <!--          </el-select>-->
    <!--        </div>-->
    <!--        <el-input v-model="expressNumber" @keyup.enter.native="goExpress" class="input-sty">-->
    <!--        </el-input>-->
    <!--        <el-button @click.native="goExpress">{{ $t('查询') }}</el-button>-->
    <!--        <el-button @click.native="trackingMana">{{ $t('管理自定义物流轨迹') }}</el-button>-->
    <!--      </div>-->
    <!--      <div class="express-content" v-loading="$store.state.btnLoading">-->
    <!--        <div class="search-flex">-->
    <!--          <div v-if="TrackingData.length" class="line-sty">-->
    <!--            <div class="content-top">-->
    <!--              <div class="time">{{ $t('时间') }}</div>-->
    <!--              <div style="padding-left: 2em">{{ $t('跟踪进度') }}</div>-->
    <!--            </div>-->
    <!--            <ul class="result-list">-->
    <!--              <li-->
    <!--                :class="{ 'last-finish': index === 0 }"-->
    <!--                v-for="(item, index) in TrackingData"-->
    <!--                :key="index"-->
    <!--              >-->
    <!--                <div class="time">{{ item.ftime }}</div>-->
    <!--                <div class="dot">-->
    <!--                  <span class="out-dot dot-box"> </span>-->
    <!--                  <span class="in-dot dot-box"></span>-->
    <!--                </div>-->
    <!--                <div class="text">{{ item.context }}</div>-->
    <!--              </li>-->
    <!--            </ul>-->
    <!--          </div>-->
    <!--          <div class="empty-box" v-else>-->
    <!--            <img src="../../assets/empty.png" />-->
    <!--            <div>{{ $t('暂无物流消息') }}</div>-->
    <!--          </div>-->
    <!--          <div class="search-btn">-->
    <!--            &lt;!&ndash; <el-button @click="onUpdate">{{ $t('更新物流') }}</el-button> &ndash;&gt;-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!-- <el-dialog :visible.sync="trackDialog" width="30%" :title="$t('更新物流状态')" @close="clear">
      <el-form label-position="top" :model="form" ref="form">
        <el-form-item :label="$t('物流状态')">
          <el-select
            v-model="form.logistics_type_id"
            filterable
            allow-create
            default-first-option
            class="country-select"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in modeData"
              :key="item.id"
              :label="item.context"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-button class="type-sty" @click="goMore">{{ $t('管理') }}</el-button>
        </el-form-item>
        <el-form-item
          v-if="
            this.form.logistics_type_id &&
            !this.modeData.map(item => item.id).includes(this.form.logistics_type_id)
          "
        >
          <el-checkbox v-model="is_member">{{ $t('是否记住') }}</el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('时间')">
          <el-date-picker
            v-model="created_at"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('选择日期时间')"
          >
          </el-date-picker>
          <span style="color: red; margin-left: 5px">{{ $t('不选则默认是当前时间') }}</span>
        </el-form-item>
        <el-form-item :label="$t('备注')">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="$t('请输入内容')"
            v-model="logisticsRemark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="trackDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" :loading="$store.state.btnLoading" @click="changeStatus">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import Detail from './components/trackDetail'
import { pagination } from '@/mixin'
// import dialog from '@/components/dialog'
export default {
  components: {
    Detail
  },
  name: 'tracking',
  mixins: [pagination],
  data() {
    return {
      selectItem: null,
      options: [
        {
          id: 1,
          name: this.$t('订单号')
        },
        {
          id: 2,
          name: this.$t('包裹单号')
        }
      ],
      expressType: 1,
      expressNumber: '',
      TrackingData: [],
      isEmpty: false,
      form: {
        logistics_type_id: ''
      },
      is_member: '',
      logisticsRemark: '',
      trackDialog: false,
      sns: '',
      tableData: [],
      showDetail: false
    }
  },
  created() {},
  activated() {
    console.log(this.$route.query, 'this.$route.query.orderSn')
    if (this.$route.query.orderSn) {
      console.log('啊？')
      this.sns = this.$route.query.orderSn
      this.getList()
    }
  },
  methods: {
    receive() {
      this.showDetail = false
    },
    goDetail(scope) {
      this.showDetail = true
      this.selectItem = scope
      console.log('scope', scope)
      return false
      // if (this.expressType == 1) {
      //   dialog({ type: 'logisticsInfo', id: scope.order_sn, expressType: this.expressType }, () => {
      //     console.log('aa')
      //   })
      // } else {
      //   dialog(
      //     { type: 'logisticsInfo', id: scope.express_num, expressType: this.expressType },
      //     () => {
      //       console.log('aa')
      //     }
      //   )
      // }
    },
    changeType() {
      this.sns = null
      this.tableData = []
    },
    //查询物流
    getList() {
      let params = {}
      params.sns = this.sns.split('\n')
      if (this.expressType == 1) {
        params.type = 'order'
      } else {
        params.type = 'package'
      }

      this.$request.getTrackInfo(params).then(res => {
        console.log(res.data)
        this.tableData = res.data
      })
    },
    goExpress() {
      if (!this.expressNumber) {
        return this.$message.error(this.$t('请输入单号'))
      }
      console.log(this.expressNumber, 'expressNumber')
      if (this.expressType === 1) {
        this.$request
          .goTracking({
            order_sn: this.expressNumber
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
      } else if (this.expressType === 2) {
        this.$request
          .goTracking({
            track_no: this.expressNumber
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
    // 管理自定义物流轨迹
    trackingMana() {
      this.$router.push({ name: 'logistics' })
    },
    // 获取全部物流状态
    getType() {
      // this.$request.getOrderStatus().then(res => {
      //   if (res.ret) {
      //     this.modeData = res.data
      //   }
      // })
    },
    // onUpdate() {
    //   if (!this.expressNumber) {
    //     return this.$message.error(this.$t('请输入单号'))
    //   }
    //   this.trackDialog = true
    //   this.getType()
    // },
    // 弹窗 管理
    // goMore() {
    //   this.trackDialog = false
    //   this.$router.push({
    //     name: 'configurationMore',
    //     query: {
    //       activeName: '4',
    //       secondTab4: '4'
    //     }
    //   })
    // },
    // 更改物流状态
    // changeStatus() {
    //   let params = {
    //     order_ids: this.selectIDs,
    //     is_member: Number(this.is_member),
    //     remark: this.logisticsRemark,
    //     created_at: this.created_at
    //   }
    //   if (this.modeData.map(item => item.id).includes(this.form.logistics_type_id)) {
    //     params.logistics_type_id = this.form.logistics_type_id
    //   } else {
    //     params.context = this.form.logistics_type_id
    //   }
    //   this.$request.changeOrderStatus(params).then(res => {
    //     if (res.ret) {
    //       this.$notify({
    //         title: this.$t('操作成功'),
    //         message: res.msg,
    //         type: 'success'
    //       })
    //       this.trackDialog = false
    //       this.getList()
    //       this.selectIDs = []
    //     } else {
    //       this.$message({
    //         message: res.msg,
    //         type: 'error'
    //       })
    //     }
    //   })
    // },
    // getOrderInfo() {
    //   this.$request
    //     .getOrder({
    //       keyword: this.expressNumber
    //     })
    //     .then(res => {
    //       if (res.ret) {
    //         console.log(res)
    //       }
    //     })
    // },
    clear() {
      this.form.logistics_type_id = ''
      this.logisticsRemark = ''
      this.created_at = ''
    }
  }
}
</script>

<style lang="scss" scope>
.tracking-container {
  height: 100%;
  display: flex;
  div::-webkit-scrollbar {
    /*滚动条整体样式*/
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
    width: 8px;
  }

  div::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    background: rgba(41, 109, 241, 0.3);
  }
  div::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: 0;
    border-radius: 0;
    background: #f0f2f5;
  }
  .left-search {
    height: 100%;
    width: 300px;
    background-color: #ffffff;
    margin-right: 16px;
    padding: 0 16px;
    overflow-y: auto;
    .search-sty {
      margin: 20px 0;
    }
    .sn-list {
      .search-btn {
        margin: 8px 0;
        width: 100%;
      }
    }
  }
  .right-info {
    //flex: 1;
    width: calc(100% - 316px);
    height: 100%;
    background-color: #ffffff;
    padding: 0 16px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-tab {
      width: 100%;
      height: 50px;
      .row-style {
        cursor: pointer;
      }
    }
    .empty-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #c8c8c8;
      font-size: 14px;
      margin-top: 100px;
      img {
        width: 150px;
        margin-left: -10px;
      }
    }
  }
  .search-main {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    // line-height: 35px;
    .number-sty {
      display: inline-block;
      margin-right: 10px;
    }
    .search-sty {
      margin-bottom: 20px;
      display: inline-block;
      margin-right: 10px;
    }
    .input-sty {
      width: 30%;
      margin-right: 10px;
    }
    .dot-box {
      display: inline-block;
      border-radius: 50%;
    }
    .out-dot {
      width: 16px;
      height: 16px;
      background-color: #bcbcbc;
      opacity: 0.4;
      margin-top: 2px;
    }
    .in-dot {
      width: 10px;
      height: 10px;
      background-color: #bcbcbc;
      position: absolute;
      left: 3px;
      top: 5px;
    }
    .content-top {
      display: flex;
    }
    .express-content {
      font-size: 14px;
      text-align: center;
    }
    .time {
      width: 155px;
    }
    .result-list {
      padding: 0;
      li {
        display: flex;
        padding-bottom: 30px;
        &:not(:last-child) {
          .text::before {
            content: '';
            position: absolute;
            left: -8px;
            border-left: 1px solid #a8b7bf;
            height: calc(100% + 10px);
            top: 20px;
          }
        }
      }
      .last-finish {
        .out-dot {
          background-color: #35a581;
        }
        .in-dot {
          background-color: #35a581;
        }
      }
    }
    .text {
      padding-left: 10px;
      position: relative;
      flex: 1;
    }
    .dot {
      position: relative;
      width: 16px;
      height: 16px;
    }
    .main-top {
      text-align: center;
    }
    .empty-box {
      width: 600px;
      img {
        width: 150px;
      }
    }
    .line-sty {
      width: 600px;
    }
    .search-flex {
      display: flex;
      justify-content: center;
    }
    .search-btn {
      width: 200px;
    }
  }
}
</style>

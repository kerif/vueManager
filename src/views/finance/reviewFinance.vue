<template>
  <div class="review-finance-container">
    <div class="receiverMSg">
      <h4>{{ $t('客户信息') }}</h4>
      <el-row class="container-center" :gutter="20">
        <!-- 客户ID -->
        <el-col :span="9">
          <span class="leftWidth">{{ $t('客户ID') }}</span>
          <span>{{ form.user && form.user.id }}</span>
        </el-col>
        <!-- 客户昵称 -->
        <el-col :span="9" :offset="1">
          <span class="leftWidth">{{ $t('客户昵称') }}</span>
          <span>{{ form.user && form.user.name }}</span>
        </el-col>
      </el-row>
      <el-row class="container-center" :gutter="20">
        <!-- 流水号 -->
        <el-col :span="9">
          <span class="leftWidth">{{ $t('流水号') }}</span>
          <span>{{ form.serial_no }}</span>
        </el-col>
        <!-- 提交时间 -->
        <el-col :span="9" :offset="1">
          <span class="leftWidth">{{ $t('提交时间') }}</span>
          <span>{{ form.created_at }}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 支付审核 -->
    <div class="pay-message receiverMSg" v-if="this.$route.params.state === 'pay'">
      <h4>{{ $t('支付信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{ $t('支付方式') }}</p>
          <span>{{ form.payment_type_name }}</span
          ><br />
          <p class="transfer-right">{{ $t('转账支付账户') }}</p>
          <span>{{ form.transfer_account }}</span
          ><br />
          <p class="transfer-right">{{ $t('应付金额') + this.localization.currency_unit }}</p>
          <span>{{ form.order_amount }}</span
          ><br />
          <p class="transfer-right">
            {{ $t('抵用券金额') + this.localization.currency_unit }}
          </p>
          <span>{{ form.coupon_amount }}</span
          ><br />
          <p class="transfer-right">
            {{ $t('是否使用积分') }}
          </p>
          <span>{{ form.is_use_point === 1 ? '是' : '否' }}</span>
          <br />
          <p class="transfer-right">
            {{ $t('使用积分') }}
          </p>
          <span>{{ form.point }}</span>
          <br />
          <p class="transfer-right">
            {{ $t('积分抵扣的金额') + this.localization.currency_unit }}
          </p>
          <span>{{ form.point_amount }}</span>
          <br />
          <p class="transfer-right">{{ $t('实付金额') + this.localization.currency_unit }}</p>
          <span>{{ form.pay_amount }}</span>
          <span v-if="this.form.show_rate == true">
            （{{ this.form.currency_code }}&nbsp;{{ this.form.currency_symbol }}&nbsp;{{
              this.form.rate_amount
            }}） </span
          ><br />
          <p class="transfer-right">{{ $t('关联单号') }}</p>
          <span>{{ form.order_number }}</span
          ><br />
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.remark }}</span
          ><br />
          <p class="transfer-right">{{ $t('创建时间') }}</p>
          <span>{{ form.created_at }}</span>
        </el-col>
        <el-col :span="9" :offset="1">
          <p>{{ $t('客户截图') }}</p>
          <span
            v-for="item in form.images"
            :key="item.id"
            style="cursor: pointer"
            @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
          >
            <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 150px; margin-right: 30px" />
          </span>
        </el-col>
      </el-row>
    </div>
    <!-- 退款审核 -->
    <div class="pay-message receiverMSg" v-if="this.$route.params.state === 'refund'">
      <h4>{{ $t('退款信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{ $t('关联单号') }}</p>
          <span>{{ form.order_sn }}</span
          ><br />
          <p class="transfer-right">{{ $t('实际支付金额') }}</p>
          <span>{{ form.payment_amount }}</span
          ><br />
          <p class="transfer-right">{{ $t('退款金额') + this.localization.currency_unit }}</p>
          <span>{{ form.refund_amount }}</span
          ><br />
          <p class="transfer-right">{{ $t('退款方式') }}</p>
          <span v-if="form.refund_type === 0">{{ $t('原路返回') }}</span>
          <span v-if="form.refund_type === 1">{{ $t('退回余额') }}</span>
          <span v-if="form.refund_type === 2">{{ $t('其它方式') }}</span
          ><br />
          <div v-if="form.refund_type === 2">
            <p class="transfer-right">{{ $t('其它方式') }}</p>
            <span>{{ form.refund_method }}</span
            ><br />
          </div>
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.refund_remark }}</span
          ><br />
        </el-col>
        <el-col :span="9" :offset="1">
          <p>{{ $t('备注截图') }}</p>
          <span
            v-for="item in form.refund_images"
            :key="item.id"
            style="cursor: pointer"
            @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
          >
            <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 150px; margin-right: 30px" />
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="footer-btn" v-if="form.status === 0">
      <el-button type="danger" @click="reviewReject">{{ $t('审核拒绝') }}</el-button>
      <el-button type="primary" @click="reviewPass">{{ $t('审核通过') }}</el-button>
    </div>
    <!-- 支付审核通过信息 -->
    <div
      class="pay-message receiverMSg"
      v-if="this.$route.params.state === 'pay' && form.status === 1"
    >
      <h4>{{ $t('审核通过信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{ $t('审核人员') }}</p>
          <span>{{ form.operator }}</span
          ><br />
          <p class="transfer-right">{{ $t('确认支付金额') +'('+this.localization.currency_unit+')' }}</p>
          <span>{{ form.confirm_amount }}</span
          ><br />
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.customer_remark }}</span
          ><br />
          <p class="transfer-right">{{ $t('上传图片') }}</p>
          <div class="left-img">
            <img
              :src="`${$baseUrl.IMAGE_URL}${item}`"
              class="productImg"
              v-for="(item, index) in form.customer_images"
              :key="index"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item.url}`), (imgVisible = true)"
              style="cursor: pointer"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 支付审核拒绝信息 -->
    <div
      class="pay-message receiverMSg"
      v-if="this.$route.params.state === 'pay' && form.status === 2"
    >
      <h4>{{ $t('审核拒绝信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{ $t('审核人员') }}</p>
          <span>{{ form.operator }}</span
          ><br />
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.customer_remark }}</span
          ><br />
          <p class="transfer-right">{{ $t('上传照片') }}</p>
          <div class="left-img">
            <img
              :src="`${$baseUrl.IMAGE_URL}${item}`"
              class="productImg"
              v-for="(item, index) in form.customer_images"
              :key="index"
              style="cursor: pointer"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 退款审核通过信息 -->
    <div
      class="pay-message receiverMSg"
      v-if="this.$route.params.state === 'refund' && form.status === 1"
    >
      <h4>{{ $t('审核通过信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{ $t('审核人员') }}</p>
          <span>{{ form.operator }}</span
          ><br />
          <p class="transfer-right">{{ $t('确认支付金额') + this.localization.currency_unit }}</p>
          <span>{{ form.confirm_amount }}</span
          ><br />
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.remark }}</span
          ><br />
          <p class="transfer-right">{{ $t('上传图片') }}</p>
          <div class="left-img">
            <span
              v-for="item in form.images"
              :key="item.id"
              style="cursor: pointer"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
            >
              <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 150px; margin-right: 30px" />
            </span>
            <!-- <img :src="`${$baseUrl.IMAGE_URL}${item}`" class="productImg" v-for="(item, index) in form.customer_images" :key="index" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true" style="cursor:pointer;"> -->
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 退款审核拒绝信息 -->
    <div
      class="pay-message receiverMSg"
      v-if="this.$route.params.state === 'refund' && form.status === 2"
    >
      <h4>{{ $t('审核拒绝信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{ $t('审核人员') }}</p>
          <span>{{ form.operator }}</span
          ><br />
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.remark }}</span
          ><br />
          <p class="transfer-right">{{ $t('上传照片') }}</p>
          <div class="left-img">
            <!-- <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" v-for="(item, index) in form.customer_images" :key="index" style="cursor:pointer;"
           @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true"> -->
            <span
              v-for="item in form.images"
              :key="item.id"
              style="cursor: pointer"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
            >
              <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 150px; margin-right: 30px" />
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      form: {},
      oderData: [],
      PackageData: [],
      localization: {},
      imgVisible: false,
      imgSrc: ''
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      if (this.$route.params.state === 'pay') {
        this.getPay()
      } else {
        this.getReturn()
      }
    },
    // 支付审核
    getPay() {
      this.$request.payData(this.$route.params.id).then(res => {
        console.log(res)
        if (res.ret) {
          this.form = res.data
          this.oderData = [res.data.details]
          this.PackageData = res.data.packages
          this.localization = res.localization
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 退款审核
    getReturn() {
      this.$request.refundsData(this.$route.params.id).then(res => {
        console.log(res)
        if (res.ret) {
          this.form = res.data
          this.oderData = [res.data.details]
          this.PackageData = res.data.packages
          this.localization = res.localization
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 审核通过
    reviewPass() {
      if (this.$route.params.state === 'pay') {
        dialog(
          {
            type: 'financeReview',
            name: this.$route.params.state,
            id: this.form.order_id,
            state: 'pass',
            tranAmount: this.form.tran_amount
          },
          () => {
            this.$router.go(-1)
          }
        )
      } else {
        dialog(
          {
            type: 'financeReview',
            name: this.$route.params.state,
            id: this.$route.params.id,
            state: 'pass',
            tranAmount: this.form.refund_amount
          },
          () => {
            this.$router.go(-1)
          }
        )
      }
    },
    // 审核拒绝
    reviewReject() {
      if (this.$route.params.state === 'pay') {
        dialog(
          {
            type: 'financeReview',
            name: this.$route.params.state,
            id: this.form.order_id,
            state: 'reject'
          },
          () => {
            this.$router.go(-1)
          }
        )
      } else {
        dialog(
          {
            type: 'financeReview',
            name: this.$route.params.state,
            id: this.$route.params.id,
            state: 'reject'
          },
          () => {
            this.$router.go(-1)
          }
        )
      }
    }
  }
}
</script>

<style lang="scss">
.review-finance-container {
  .container-center {
    margin-bottom: 20px;
  }
  .receiverMSg {
    padding: 10px;
    margin-bottom: 20px;
    background-color: #fff !important;
  }
  .leftWidth {
    display: inline-block;
    width: 120px;
  }
  .bale {
    .bale-left {
      width: 50%;
      display: inline-block;
      vertical-align: top;
    }
    .left-img {
      margin-top: 20px;
      padding: 10px 5px;
    }
    .productImg {
      border: 1px dashed #ccc;
      display: inline-block;
      margin-right: 15px;
      width: 110px;
      height: 100px;
    }
  }
  .packed-details {
    margin-top: 20px;
  }
  .nullProduct {
    padding-left: 70px;
    color: #ccc;
  }
  .el-button--small {
    padding: 8px;
    margin-left: 5px;
  }
  .footer-btn {
    margin-top: 30px;
  }
  .transfer-right {
    display: inline-block;
    width: 130px;
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .left-img {
    padding: 10px;
  }
  .productImg {
    border: 1px dashed #ccc;
    display: inline-block;
    margin-right: 15px;
    width: 110px;
    height: 100px;
  }
}
</style>

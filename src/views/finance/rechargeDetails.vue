<template>
  <div class="recharge-review-container">
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
          <!-- 流水号 -->
          <span class="leftWidth">{{ $t('流水号') }}</span>
          <span>{{ form.serial_no }}</span>
        </el-col>
        <!-- 提交时间 -->
        <el-col :span="9" :offset="1">
          <!-- 提交时间 -->
          <span class="leftWidth">{{ $t('提交时间') }}</span>
          <span>{{ form.created_at }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="pay-message receiverMSg">
      <!-- 支付信息 -->
      <h4>{{ $t('支付信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <!-- 支付方式 -->
          <p class="transfer-right">{{ $t('支付方式') }}</p>
          <span>{{ form.payment_type_name }}</span
          ><br />
          <!-- 转账支付账户 -->
          <p class="transfer-right">{{ $t('转账支付账户') }}</p>
          <span>{{ form.account }}</span
          ><br />
          <!-- <p class="transfer-right">{{'应付金额' + this.localization.currency_unit}}</p>
          <span>{{form.order_amount}}</span><br/> -->
          <!-- <p class="transfer-right">
              {{'抵用券金额' + this.localization.currency_unit}}</p>
          <span>{{form.amount}}</span><br/> -->
          <p class="transfer-right">{{ $t('支付金额') + this.localization.currency_unit }}</p>
          <span>{{ form.amount }}</span>
          <span v-if="this.form.show_rate == true">
            （{{ this.form.currency_code }}&nbsp;{{ this.form.currency_symbol }}&nbsp;{{
              this.form.rate_amount
            }}） </span
          ><br />
          <!-- <p class="transfer-right">关联单号</p>
          <span>{{form.order_number}}</span><br/> -->
          <!-- 备注 -->
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.remark }}</span
          ><br />
          <!-- 创建时间 -->
          <p class="transfer-right">{{ $t('创建时间') }}</p>
          <span>{{ form.created_at }}</span>
        </el-col>
        <el-col :span="9" :offset="1">
          <!-- 客户截图 -->
          <p>{{ $t('客户截图') }}</p>
          <span
            v-for="item in form.images"
            :key="item.id"
            style="cursor: pointer"
            @click.stop=";(imgSrc = `${item}`), (imgVisible = true)"
          >
            <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 150px; margin-right: 30px" />
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="footer-btn" v-if="this.$route.params.state === 'review'">
      <!-- 审核拒绝 -->
      <el-button type="danger" @click="reviewReject">{{ $t('审核拒绝') }}</el-button>
      <!-- 审核通过 -->
      <el-button type="primary" @click="reviewPass">{{ $t('审核通过') }}</el-button>
    </div>
    <!-- 审核成功 -->
    <div class="pay-message receiverMSg" v-if="form.status === 1">
      <!-- 确认支付信息 -->
      <h4>{{ $t('确认支付信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{ $t('支付金额') + this.localization.currency_unit }}</p>
          <span>{{ form.confirm_amount }}</span
          ><br />
          <!-- 备注 -->
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.customer_remark }}</span
          ><br />
          <!-- 上传图片 -->
          <p class="transfer-right">{{ $t('上传图片') }}</p>
          <div class="left-img">
            <img
              :src="`${$baseUrl.IMAGE_URL}${item}`"
              class="productImg"
              v-for="(item, index) in form.customer_images"
              :key="index"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
              style="cursor: pointer"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 审核拒绝信息 -->
    <div class="pay-message receiverMSg" v-if="form.status === 2">
      <h4>{{ $t('审核拒绝信息') }}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <!-- 备注 -->
          <p class="transfer-right">{{ $t('备注') }}</p>
          <span>{{ form.customer_remark }}</span
          ><br />
          <!-- 上传照片 -->
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
          <!-- <span>{{form.customer_images}}</span><br/> -->
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
      imgSrc: '',
      currencyUnit: ''
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
    // if (this.$route.query.state === 'transaction') {
    //   this.getTransaction()
    // } else {
    //   this.getList()
    // }
  },
  methods: {
    getList() {
      this.$request.getRechargeDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.form = res.data
          this.oderData = [res.data.details]
          this.PackageData = res.data.packages
          this.localization = res.localization
          this.currencyUnit = res.localization.currency_unit
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 从流水记录跳转过来
    getTransaction() {
      this.$request.getReview(this.$route.query.id).then(res => {
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
      console.log(this.form.amount, 'tranAmount')
      dialog(
        {
          type: 'rechargeMsg',
          id: this.$route.params.id,
          state: 'pass',
          tranAmount: this.form.amount,
          currencyUnit: this.currencyUnit
        },
        () => {
          // this.$router.push({ name: 'wayBillList', query: { activeName: '2' } })
          this.$router.go(-1)
        }
      )
    },
    // 审核拒绝
    reviewReject() {
      dialog(
        {
          type: 'rechargeMsg',
          id: this.$route.params.id,
          state: 'reject',
          currencyUnit: this.currencyUnit
        },
        () => {
          // this.$router.push({ name: 'wayBillList' })
          this.$router.go(-1)
        }
      )
    }
  }
}
</script>

<style lang="scss">
.recharge-review-container {
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
    width: 120px;
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

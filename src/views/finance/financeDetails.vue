<template>
  <div class="review-container">
    <div class="receiverMSg">
    <h4>{{$t('客户信息')}}</h4>
    <el-row class="container-center" :gutter="20">
      <!-- 客户ID -->
      <el-col :span="9">
        <span class="leftWidth">{{$t('客户ID')}}</span>
        <span>{{form.user_id}}</span>
      </el-col>
      <!-- 客户昵称 -->
        <el-col :span="9" :offset="1">
         <span class="leftWidth">{{$t('客户昵称')}}</span>
         <span>{{form.user_name}}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
     <!-- 流水号 -->
      <el-col :span="9">
        <span class="leftWidth">{{$t('流水号')}}</span>
        <span>{{form.serial_no}}</span>
      </el-col>
      <!-- 提交时间 -->
        <el-col :span="9" :offset="1">
         <span class="leftWidth">{{$t('提交时间')}}</span>
         <span>{{form.created_at}}</span>
      </el-col>
    </el-row>
    </div>
    <div class="pay-message receiverMSg">
      <h4>{{$t('支付信息')}}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{$t('支付方式')}}</p>
          <span>{{form.payment_type_name}}</span><br/>
          <p class="transfer-right">{{$t('转账支付账户')}}</p>
          <span>{{form.transfer_account}}</span><br/>
          <p class="transfer-right">
              {{$t('抵用券金额') + this.localization.currency_unit}}</p>
          <span>{{form.coupon_amount}}</span><br/>
          <p class="transfer-right">{{$t('应付金额') + this.localization.currency_unit}}</p>
          <span>{{form.order_amount}}</span><br/>
          <p class="transfer-right">{{$t('支付金额') + this.localization.currency_unit}}</p>
          <span>{{form.tran_amount}}</span>
          <span v-if="form.show_rate == true">
            （{{form.currency_code}}&nbsp;{{form.currency_symbol}}&nbsp;{{form.rate_amount}}）
          </span><br/>
          <p class="transfer-right">{{$t('关联单号')}}</p>
          <span>{{form.order_number}}</span><br/>
          <p class="transfer-right">{{$t('备注')}}</p>
          <span>{{form.remark}}</span><br/>
          <p class="transfer-right">{{$t('创建时间')}}</p>
          <span>{{form.created_at}}</span>
        </el-col>
        <el-col :span="9" :offset="1">
          <!-- 客户截图 -->
          <p>{{$t('客户截图')}}</p>
          <span v-for="item in form.images"
          :key="item.id" style="cursor:pointer;"
            @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item}`, imgVisible=true">
              <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 150px; margin-right: 30px;">
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="pay-message receiverMSg" v-if="form.status === 1">
      <!-- 确认支付信息 -->
      <h4>{{$t('确认支付信息')}}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{$t('支付金额') + this.localization.currency_unit}}</p>
          <span>{{form.confirm_amount}}</span><br/>
          <!-- 备注 -->
          <p class="transfer-right">{{$t('备注')}}</p>
          <span>{{form.customer_remark}}</span><br/>
          <!-- 上传图片 -->
          <p class="transfer-right">{{$t('上传图片')}}</p>
          <div class="left-img">
            <img :src="`${$baseUrl.IMAGE_URL}${item}`" class="productImg" v-for="(item, index) in form.customer_images" :key="index" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item}`, imgVisible=true" style="cursor:pointer;">
          </div>
        </el-col>
      </el-row>
    </div>
      <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {},
      oderData: [],
      PackageData: [],
      localization: {},
      imgVisible: false,
      imgSrc: ''
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 转账支付跳转过来
    getList () {
      this.$request.getReview(this.$route.query.order_id).then(res => {
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
    }
  }
}
</script>

<style lang="scss">
.review-container {
  .container-center {
    margin-bottom: 20px;
  }
  .receiverMSg {
    padding: 10px;
    background-color: #fff !important;
    margin-bottom: 20px;
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
  .img_box{
   text-align: center;
   .imgDialog{
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

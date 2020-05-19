<template>
  <div class="wechat-container">
    <div class="receiverMSg">
    <h4>{{$t('客户信息')}}</h4>
    <el-row class="container-center" :gutter="20">
      <!-- 客户ID -->
      <el-col :span="11">
        <span class="leftWidth">{{$t('客户ID')}}</span>
        <span>{{form.user_id}}</span>
      </el-col>
      <!-- 客户昵称 -->
        <el-col :span="8" :offset="1">
         <span class="leftWidth">{{$t('客户昵称')}}</span>
         <span>{{form.user_name}}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
     <!-- 流水号 -->
      <el-col :span="11">
        <span class="leftWidth">{{$t('流水号')}}</span>
        <span>{{form.serial_no}}</span>
      </el-col>
      <!-- 提交时间 -->
        <el-col :span="8" :offset="1">
         <span class="leftWidth">{{$t('提交时间')}}</span>
         <span>{{form.created_at}}</span>
      </el-col>
    </el-row>
    </div>
    <div class="pay-message receiverMSg">
      <!-- 支付信息 -->
      <h4>{{$t('支付信息')}}</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <!-- 支付方式 -->
          <p class="transfer-right">{{$t('支付方式')}}</p>
          <!-- <span v-if="form.payment_type === 2">在线支付</span><br/> -->
          <span>{{form.payment_type_name}}</span><br/>
          <!-- 在线支付 -->
          <p class="transfer-right">
            <!-- 抵用券金额 -->
              {{$t('抵用券金额') + this.localization.currency_unit}}</p>
          <span>{{form.coupon_amount}}</span><br/>
          <!-- 应付金额 -->
          <p class="transfer-right">{{$t('应付金额') + this.localization.currency_unit}}</p>
          <span>{{form.order_amount}}</span><br/>
          <!-- 支付金额 -->
          <p class="transfer-right">{{$t('支付金额') + this.localization.currency_unit}}</p>
          <span>{{form.pay_amount}}</span><br/>
          <!-- 关联单号 -->
          <p class="transfer-right">{{$t('关联单号')}}</p>
          <span>{{form.order_sn}}</span><br/>
          <!-- <p class="transfer-right">备注</p>
          <span>{{form.remark}}</span><br/> -->
          <!-- <p class="transfer-right">创建时间</p>
          <span>{{form.created_at}}</span> -->
        </el-col>
      </el-row>
    </div>
      <!-- <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog> -->
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
    getList () {
      this.$request.getRecords(this.$route.query.id).then(res => {
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
.wechat-container {
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

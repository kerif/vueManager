<template>
  <div class="review-container">
    <div class="receiverMSg">
    <h4>客户信息</h4>
    <el-row class="container-center" :gutter="20">
      <!-- 客户ID -->
      <el-col :span="9">
        <span class="leftWidth">客户ID</span>
        <span>{{form.user_id}}</span>
      </el-col>
      <!-- 客户昵称 -->
        <el-col :span="9" :offset="1">
         <span class="leftWidth">客户昵称</span>
         <span>{{form.user_name}}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
     <!-- 流水号 -->
      <el-col :span="9">
        <span class="leftWidth">流水号</span>
        <span>{{form.serial_no}}</span>
      </el-col>
      <!-- 提交时间 -->
        <el-col :span="9" :offset="1">
         <span class="leftWidth">提交时间</span>
         <span>{{form.created_at}}</span>
      </el-col>
    </el-row>
    </div>
    <div class="pay-message receiverMSg">
      <h4>支付信息</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">支付方式</p>
          <span>{{form.pay_type}}</span><br/>
          <p class="transfer-right">转账支付账户</p>
          <span>{{form.transfer_account}}</span><br/>
          <p class="transfer-right">{{'总金额' + this.localization.currency_unit}}</p>
          <span>{{form.order_amount}}</span><br/>
          <p class="transfer-right">
              {{'抵用券金额' + this.localization.currency_unit}}</p>
          <span>{{form.coupon_amount}}</span><br/>
          <p class="transfer-right">{{'支付金额' + this.localization.currency_unit}}</p>
          <span>{{form.tran_amount}}</span><br/>
          <p class="transfer-right">关联单号</p>
          <span>{{form.order_number}}</span><br/>
          <p class="transfer-right">备注</p>
          <span>{{form.remark}}</span><br/>
          <p class="transfer-right">创建时间</p>
          <span>{{form.created_at}}</span>
        </el-col>
        <el-col :span="9" :offset="1">
          <p>客户截图</p>
          <span v-for="item in form.images"
          :key="item.id" style="cursor:pointer;"
            @click.stop="imgSrc=item, imgVisible=true">
              <img :src="item" style="width: 150px; margin-right: 30px;">
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="footer-btn" v-if="this.$route.query.state === 'review'">
      <el-button type="danger" @click="reviewReject">审核拒绝</el-button>
      <el-button type="primary" @click="reviewPass">审核通过</el-button>
    </div>
    <div class="pay-message receiverMSg" v-if="form.status === 1">
      <h4>确认支付信息</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{'支付金额' + this.localization.currency_unit}}</p>
          <span>{{form.confirm_amount}}</span><br/>
          <p class="transfer-right">备注</p>
          <span>{{form.customer_remark}}</span><br/>
          <p class="transfer-right">上传图片</p>
          <div class="left-img">
            <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" v-for="(item, index) in form.customer_images" :key="index" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true" style="cursor:pointer;">
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 审核拒绝信息 -->
    <div class="pay-message receiverMSg" v-if="form.status === 2">
      <h4>审核拒绝信息</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">备注</p>
          <span>{{form.customer_remark}}</span><br/>
          <p class="transfer-right">上传照片</p>
         <div class="left-img">
           <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" v-for="(item, index) in form.customer_images" :key="index" style="cursor:pointer;"
           @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
         </div>
          <!-- <span>{{form.customer_images}}</span><br/> -->
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
import dialog from '@/components/dialog'
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
    // if (this.$route.query.id) {
    //   this.getList()
    // }
    if (this.$route.query.state === 'transaction') {
      this.getTransaction()
    } else {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$request.getTransfer(this.$route.query.id).then(res => {
        if (res.ret) {
          this.form = res.data
          this.oderData = [res.data.details]
          this.PackageData = res.data.packages
          this.localization = res.localization
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 从流水记录跳转过来
    getTransaction () {
      this.$request.getReview(this.$route.query.id).then(res => {
        if (res.ret) {
          this.form = res.data
          this.oderData = [res.data.details]
          this.PackageData = res.data.packages
          this.localization = res.localization
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 审核通过
    reviewPass (id, tranAmount) {
      dialog({ type: 'reviewMsg', id: this.$route.query.id, state: 'pass', tranAmount: this.form.tran_amount }, () => {
        // this.$router.push({ name: 'wayBillList', query: { activeName: '2' } })
        this.$router.go(-1)
      })
    },
    // 审核拒绝
    reviewReject (id) {
      dialog({ type: 'reviewMsg', id: this.$route.query.id, state: 'reject' }, () => {
        // this.$router.push({ name: 'wayBillList' })
        this.$router.go(-1)
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
    border-bottom: 1px #ccc solid;
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

<template>
  <div class="withdrawal-container">
    <div class="receiverMSg">
    <h4>客户信息</h4>
    <el-row class="container-center" :gutter="20">
      <!-- 客户ID -->
      <el-col :span="9">
        <span class="leftWidth">客户ID</span>
        <span>{{form.user && form.user.id}}</span>
      </el-col>
      <!-- 客户昵称 -->
        <el-col :span="9" :offset="1">
         <span class="leftWidth">客户昵称</span>
         <span>{{form.user && form.user.name}}</span>
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
    <!-- 提现信息 -->
    <div class="pay-message receiverMSg">
      <h4>提现信息</h4>
      <el-row :gutter="20">
        <el-col :span="9">
          <p class="transfer-right">{{'提现金额' + this.localization.currency_unit}}</p>
          <span>{{form.amount}}</span><br/>
          <p class="transfer-right">提现方式</p>
          <span>{{form.type}}</span><br/>
          <p class="transfer-right">账户名</p>
          <span>{{form.account}}</span><br/>
          <p class="transfer-right">备注</p>
          <span>{{form.remark}}</span><br/>
        </el-col>
        <!-- <el-col :span="9" :offset="1">
          <p>客户截图</p>
          <span v-for="item in form.images"
          :key="item.id" style="cursor:pointer;"
            @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item}`, imgVisible=true">
              <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 150px; margin-right: 30px;">
          </span>
        </el-col> -->
      </el-row>
    </div>
    <div class="receiverMSg">
    <h4>提现明细</h4>
    <el-table class="data-list" border stripe
      v-loading="tableLoading"
      :data="withdrawList">
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <!-- 订单号 -->
      <el-table-column label="订单号" prop="order_number"></el-table-column>
      <!-- 状态 -->
      <el-table-column label="状态" prop="order_status"></el-table-column>
      <!-- 总金额 -->
      <el-table-column label="总金额" prop="order_amount"></el-table-column>
      <!-- 佣金比例 -->
      <el-table-column label="佣金比例%" prop="proportion"></el-table-column>
      <!-- 佣金 -->
      <el-table-column :label="'佣金' + this.localization.currency_unit" prop="commission_amount"></el-table-column>
        <template slot="append">
          <div class="append-box">
           <span>{{'总计' + this.localization.currency_unit}}：{{this.amount}}</span>
          </div>
      </template>
    </el-table>
    </div>
    <div class="footer-btn" v-if="this.$route.params.state === 'review'">
      <el-button type="danger" @click="reviewReject">审核拒绝</el-button>
      <el-button type="primary" @click="reviewPass">审核通过</el-button>
    </div>
    <div class="pay-message receiverMSg" v-if="this.$route.params.status === 'detail'">
      <h4>确认信息</h4>
      <el-row :gutter="0">
        <el-col :span="9">
          <p class="transfer-right">{{'提现金额' + this.localization.currency_unit}}</p>
          <span>{{form.confirm_amount}}</span><br/>
          <p class="transfer-right">备注</p>
          <span>{{form.customer_remark}}</span><br/>
          <!-- <p class="transfer-right">上传图片</p>
          <div class="left-img">
            <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" v-for="(item, index) in form.customer_images" :key="index" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true" style="cursor:pointer;">
          </div> -->
          <p class="transfer-right">操作人</p>
          <span>{{form.operator}}</span><br/>
          <p class="transfer-right">操作时间</p>
          <span>{{form.updated_at}}</span><br/>
        </el-col>
      </el-row>
    </div>
    <!-- 审核拒绝信息 -->
    <!-- <div class="pay-message receiverMSg" v-if="form.status === 2">
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
        </el-col>
      </el-row>
    </div> -->
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
      withdrawList: [],
      PackageData: [],
      localization: {},
      amount: '',
      imgVisible: false,
      imgSrc: '',
      tableLoading: false
    }
  },
  created () {
    this.getList()
    console.log(this.$route.params.userId, 'this.$route.params.userId')
  },
  methods: {
    getList () {
      this.$request.withdrawsIds(this.$route.params.userId, this.$route.params.id).then(res => {
        if (res.ret) {
          this.form = res.data
          this.withdrawList = res.data.commissions
          this.amount = res.data.amount
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
    reviewPass () {
      dialog({ type: 'reviewMsg', userId: this.$route.params.userId, id: this.$route.params.id, state: 'pass', tranAmount: this.amount }, () => {
        this.$router.go(-1)
      })
    },
    // 审核拒绝
    reviewReject () {
      dialog({ type: 'reviewMsg', userId: this.$route.params.userId, id: this.$route.params.id, state: 'reject' }, () => {
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="scss">
.withdrawal-container {
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

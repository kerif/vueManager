<template>
  <div class="bill-details-container">
    <div>
    <div class="receiverMSg msg-top">
    <h4>收货人信息</h4>
    <el-row class="container-center" :gutter="20">
      <!-- 姓名 -->
      <el-col :span="7">
        <span class="leftWidth">姓名</span>
        <span>{{form.address && form.address.receiver_name}}</span>
      </el-col>
      <!-- 手机/联系电话 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">手机/联系电话</span>
         <span>{{form.address &&form.address.phone}}</span>
      </el-col>
      <!-- 国家或地区 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">国家/地区</span>
         <span>{{form.address && form.address.country.cn_name}}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
     <!-- 城市 -->
      <el-col :span="7">
        <span class="leftWidth">城市</span>
        <span>{{form.address && form.address.city}}</span>
      </el-col>
      <!-- 街道/门牌号 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">街道门牌号</span>
         <span>{{form.address && form.address.street}}{{form.address && form.address.door_no}}</span>
      </el-col>
      <!-- 邮编 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">邮编</span>
         <span>{{form.address && form.address.postcode}}</span>
      </el-col>
    </el-row>
    </div>
    <div class="receiverMSg">
    <h4>运单详情</h4>
    <el-row class="container-center" :gutter="20">
      <!-- 客户id -->
      <el-col :span="7">
        <span class="leftWidth">客户ID</span>
        <span>{{form.user_id}}---{{form.user_name}}</span>
      </el-col>
      <!-- 订单号 -->
      <el-col :span="7" :offset="1">
        <span class="leftWidth">订单号</span>
        <span>{{form.order_sn}}</span>
        <!-- <el-button size="small" v-if="form.order_sn" @click="copyUrl">复制</el-button> -->
      </el-col>
      <!-- 线路名称 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">线路名称</span>
         <span>{{form.express_line && form.express_line.cn_name}}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
      <!-- 提交时间 -->
        <el-col :span="7">
         <span class="leftWidth">提交时间</span>
         <span>{{form.created_at}}</span>
      </el-col>
      <!-- 转运快递单号 -->
      <el-col :span="7" :offset="1">
        <span class="leftWidth">转运快递单号</span>
        <span>{{form.logistics_sn}}</span>
      </el-col>
      <!-- 转运快递公司 -->
      <el-col :span="7" :offset="1">
        <span class="leftWidth">转运快递公司</span>
        <span>{{form.logistics_company}}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
      <!-- 称重时间 -->
        <el-col :span="7">
         <span class="leftWidth">称重时间</span>
         <span>{{form.packed_at}}</span>
      </el-col>
      <!-- 发货时间 -->
      <el-col :span="7" :offset="1">
        <span class="leftWidth">发货时间</span>
        <span>{{form.shipped_at}}</span>
      </el-col>
      <!-- 签收时间 -->
      <el-col :span="7" :offset="1">
        <span class="leftWidth">签收时间</span>
        <span>{{form.signed_at}}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
      <!-- 增值服务 -->
      <el-col>
        <span class="leftWidth">增值服务</span>
        <span v-for="item in services" :key="item.id">{{item.name}}{{localization.currency_unit}}{{item.price}}&nbsp;&nbsp;&nbsp;</span>
      </el-col>
    </el-row>
    </div>
    </div>
   <el-table class="data-list" border stripe :data="oderData"
   v-loading="tableLoading">
      <!-- 预计重量kg -->
      <el-table-column :label="'预计重量' + this.localization.weight_unit" prop="except_weight"></el-table-column>
      <!-- 称重重量kg -->
      <el-table-column :label="'称重重量' + this.localization.weight_unit" prop="actual_weight"></el-table-column>
      <!-- 尺寸（长宽高cm） -->
      <el-table-column label="尺寸（长宽高cm）">
        <template slot-scope="scope">
          <span>{{scope.row.length}}*</span>
          <span>{{scope.row.width}}*</span>
          <span>{{scope.row.height}}</span>
        </template>
      </el-table-column>
      <!-- 预计费用¥ -->
      <el-table-column :label="'预计费用' + this.localization.currency_unit" prop="payment_fee"></el-table-column>
      <!-- 实际费用¥ -->
      <el-table-column :label="'实际费用' + this.localization.currency_unit" prop="actual_payment_fee"></el-table-column>
      <!-- 包裹价值 -->
      <el-table-column :label="'包裹价值' + this.localization.currency_unit" prop="value"></el-table-column>
      <!-- 包含的包裹 -->
      <el-table-column label="包含的包裹" width="240px">
        <template slot-scope="scope">
          <span>{{scope.row.packages.map(item => item.express_num).join(' ')}}</span>
           <!-- <span v-for="item in scope.row.packages" :key="item.id">{{item.express_num}}</span> -->
        </template>
      </el-table-column>
      <!-- 货位 -->
      <el-table-column label="货位" prop="location"></el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" prop="remark"></el-table-column>
    </el-table>
    <!-- 费用详情 -->
      <div v-if="this.$route.params.activeName === '2' || this.$route.params.activeName === '3' || this.$route.params.activeName === '4' || this.$route.params.activeName === '5'">
        <h4>费用详情</h4>
          <el-table :data="paymentData" class="data-list" border stripe
           v-loading="tableLoading">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="freight_amount">
            <template slot="header">
              <span>运费</span>
              <el-tooltip placement="top">
                <span slot="content" v-for="item in paymentData" :key="item.id">
                  <span>
                    首费{{`${localization.currency_unit} ${item.freights.first_freight_fee}`}}</span><br/>
                  <span>续费{{`${localization.currency_unit} ${item.freights.next_freight_fee}`}}</span><br/>
                  <span v-if="item.express_line_costs.length">
                  <span v-for="ele in item.express_line_costs" :key="ele.id">
                    {{ele.name}} {{`${localization.currency_unit}${ele.price}`}}
                  </span><br/>
                  </span>
                  </span>
              <i class="el-icon-question" style="font-size: 18px; color:#35B85A;"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="'抵用券金额' + this.localization.currency_unit" prop="coupon_amount"></el-table-column>
          <el-table-column :label="'增值服务费' + this.localization.currency_unit" prop="value_added_amount">
            <template slot="header">
              <span>增值服务</span>
              <el-tooltip placement="top">
                <span slot="content" v-for="item in paymentData" :key="item.id">
                  <span v-if="item.value_added_service.length">
                  <span v-for="val in item.value_added_service" :key="val.id">
                    {{val.name}} {{`${localization.currency_unit}${val.price}`}}
                  </span><br/>
                  </span>
                </span>
                <i class="el-icon-question" style="font-size: 18px; color:#35B85A;"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="'应付金额' + this.localization.currency_unit" prop="order_amount"></el-table-column>
          <el-table-column :label="'实际支付' + this.localization.currency_unit" prop="pay_amount"></el-table-column>
          <!-- 支付流水号 -->
          <!-- <el-table-column label="支付流水号">
            <template slot-scope="scope">
              <span @click="goSerial(scope.row.serial_number)" class="chooseOrder">{{scope.row.serial_number}}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="支付时间" prop="paid_at"></el-table-column>
        </el-table>
    </div>
    <!-- 包裹清单 -->
      <h4>包裹清单</h4>
      <el-table :data="PackageData" class="data-list" border stripe
       v-loading="tableLoading">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="快递单号" prop="express_num"></el-table-column>
        <el-table-column label="物品名称" prop="package_name"></el-table-column>
        <el-table-column :label="'物品价值' + this.localization.currency_unit" prop="package_value"></el-table-column>
        <el-table-column label="物品属性">
          <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">
            {{item.cn_name}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="代理" prop="agent"></el-table-column>
        <!-- 商品清单 -->
        <el-table-column label="商品清单" prop="item_pictures" width="130">
          <template slot-scope="scope">
            <span v-for="item in scope.row.item_pictures"
            :key="item.id" style="cursor:pointer;"
            @click.stop="imgSrc=$baseUrl.IMAGE_URL + item.path, imgVisible=true">
            <img :src="$baseUrl.IMAGE_URL + item.path" style="width: 40px; margin-right: 5px;">
            </span>
          </template>
        </el-table-column>
        <el-table-column label="货位" prop="location"></el-table-column>
      </el-table>
    <div class="bale">
      <div class="bale-left">
        <span>打包照片</span>
        <div class="left-img" v-for="item in form.pack_pictures" :key="item.id">
          <span style="cursor:pointer;" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
            <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" >
          </span>
        </div>
      </div>
      <div class="bale-left">
        <span>物品照片</span>
        <div class="left-img" v-for="item in form.in_warehouse_pictures" :key="item.id">
          <span style="cursor:pointer;" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
            <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" >
          </span>
        </div>
      </div>
    </div>
    <div class="packed-details">
      <span>留仓物品</span>
      <span v-if="form.in_warehouse_item">
        {{form.in_warehouse_item}}
        </span>
      <span v-else class="nullProduct">无</span>
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
      services: [],
      localization: {},
      paymentData: [],
      imgVisible: false,
      imgSrc: '',
      tableLoading: false
    }
  },
  created () {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getOrderDetails(this.$route.params.id).then(res => {
        this.tableLoading = false
        this.form = res.data
        this.oderData = [res.data.details]
        this.PackageData = res.data.packages
        this.services = res.data.services
        this.localization = res.localization
        this.paymentData = [res.data.payment]
      })
    },
    copyUrl () {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', this.form.order_sn)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('复制成功')
      }
      document.body.removeChild(input)
    },
    // 跳转到财务 流水记录
    goSerial (serialNumber) {
      this.$router.push({ name: 'transaction', query: { serial_number: serialNumber } })
    }
  }
}
</script>

<style lang="scss">
.bill-details-container {
  .container-center {
    margin-bottom: 20px;
  }
  .receiverMSg {
    padding: 10px;
    background-color: #fff !important;
  }
  .msg-top {
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
  .chooseOrder {
    cursor: pointer;
    color:blue;
    text-decoration: underline;
  }
  .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
}
</style>

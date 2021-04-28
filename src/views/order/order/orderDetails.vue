<template>
  <div class="order-details-container">
    <div>
      <div class="receiverMSg msg-top">
        <h4 class="change-sty">{{ $t('包裹详情') }}</h4>
        <el-form ref="form" :model="form" label-width="100px" label-position="right">
          <!-- <el-form-item :label="$t('姓名')"></el-form-item> -->
          <el-row class="container-center" :gutter="20">
            <!-- 快递单号 -->
            <el-col :span="7">
              <span class="leftWidth">{{ $t('快递单号') }}</span>
              <span>{{ form.express_num }}</span>
            </el-col>
            <!-- 快递公司 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('快递公司') }}</span>
              <span>{{ form.express_company && form.express_company.name }}</span>
            </el-col>
            <!-- 包裹状态 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('包裹状态') }}</span>
              <span v-if="form.status === 3">{{ $t('已集包') }}</span
              >&nbsp; <span v-if="form.status === 4 || form.status === 5">{{ $t('已发货') }}</span
              >&nbsp; <span v-if="form.status === 6">{{ $t('已收货') }}</span
              >&nbsp; <span v-if="form.status === 19">{{ $t('弃件') }}</span
              >&nbsp;
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 客户ID -->
            <el-col :span="7">
              <span class="leftWidth">{{ $t('客户ID') }}</span>
              <span>{{ form.user_id }}---{{ form.user_name }}</span>
            </el-col>
            <!-- 入库时间 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('入库时间') }}</span>
              <span>{{ form.in_storage_at }}</span>
            </el-col>
            <!-- 所属订单 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('所属订单') }}</span>
              <span>{{ form.order && form.order.order_sn }}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 寄往仓库 -->
            <el-col :span="7">
              <span class="leftWidth">{{ $t('寄往仓库') }}</span>
              <span>{{ form.warehouse && form.warehouse.warehouse_name }}</span>
            </el-col>
            <!-- 寄往地区 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('寄往地区') }}</span>
              <span>{{ form.country && form.country.name }}</span>
            </el-col>
            <!-- 所属发货单 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('所属发货单') }}</span>
              <span>{{ form.shipment_sn }}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 入库重量 -->
            <el-col :span="7">
              <span class="leftWidth">{{ $t('入库重量') }}</span>
              <span>{{ form.package_weight }}{{ localization.weight_unit }}</span>
            </el-col>
            <!-- 入库尺寸 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('入库尺寸') }}</span>
              <span>{{ form.dimension }}&nbsp;{{ localization.length_unit }}</span>
            </el-col>
            <!-- 备注 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('备注') }}</span>
              <span>{{ form.remark }}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 存放货位 -->
            <el-col :span="7">
              <span class="leftWidth">{{ $t('存放货位') }}</span>
              <span>{{ form.location }}</span>
              <span v-if="form.location_suffix !== ''">_{{ form.location_suffix }}</span>
            </el-col>
            <!-- 包裹编码 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('包裹编码') }}</span>
              <span>{{ form.code }}</span>
            </el-col>
            <!-- 弃件原因 -->
            <!-- <el-col :span="7" :offset="1">
        <span class="leftWidth">{{$t('弃件原因')}}</span>
        <span>{{form.reason}}</span>
      </el-col> -->
          </el-row>
          <el-row class="container-center" :gutter="20">
            <el-col>
              <span class="leftWidth">{{ $t('服务') }}</span>
              <span v-for="item in form.chosen_services" :key="item.id">
                {{ item.name }}
              </span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <el-col>
              <span class="leftWidth">{{ $t('物品属性') }}</span>
              <span v-for="item in form.props" :key="item.id">
                {{ item.cn_name }}
              </span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <el-col>
              <span class="leftWidth">{{ $t('弃件原因') }}</span>
              <span>{{ form.reason }}</span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="receiverMSg">
        <h4 class="all-group">{{ $t('商品信息') }}</h4>
        <el-row class="container-center" :gutter="20">
          <!-- 物品名称 -->
          <el-col :span="7">
            <span class="leftWidth">{{ $t('物品名称') }}</span>
            <p class="packageName">{{ form.package_name }}</p>
          </el-col>
          <!-- 件数 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('件数') }}</span>
            <span>{{ form.number }}</span>
          </el-col>
          <!-- 物品类型 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('物品分类') }}</span>
            <span v-for="item in form.categories" :key="item.id">
              {{ item.name }}
            </span>
          </el-col>
        </el-row>
        <el-row class="container-center" :gutter="20">
          <!-- 品牌 -->
          <el-col :span="7">
            <span class="leftWidth">{{ $t('品牌') }}</span>
            <span>{{ form.created_at }}</span>
          </el-col>
          <!-- 物品总价值 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('物品总价值') }}</span>
            <span>{{ form.package_value }}</span>
          </el-col>
          <!-- 转运快递公司 -->
          <!-- <el-col :span="7" :offset="1">
        <span class="leftWidth">{{$t('转运快递公司')}}</span>
        <span>{{form.logistics_company}}</span>
      </el-col> -->
        </el-row>
        <el-row class="container-center" :gutter="20">
          <!-- 称重时间 -->
          <el-col :span="7">
            <span class="leftWidth">{{ $t('物品照片') }}</span>
            <div class="left-img" v-for="item in form.package_pictures" :key="item.id">
              <span
                style="cursor: pointer"
                @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
              >
                <img class="productImg" :src="`${$baseUrl.IMAGE_URL}${item}`" />
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <h4>{{ $t('商品清单') }}</h4>
    <el-table :data="form.details" class="data-list" border stripe v-loading="tableLoading">
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 货品名称 -->
      <el-table-column :label="$t('货品名称')" prop="name"></el-table-column>
      <!-- 材质 -->
      <el-table-column :label="$t('材质')" prop="material"></el-table-column>
      <!-- 数量 -->
      <el-table-column :label="$t('数量')" prop="qty"></el-table-column>
      <!-- 单价 -->
      <el-table-column
        :label="$t('单价') + this.localization.currency_unit"
        prop="unit_price"
      ></el-table-column>
      <!-- 总价 -->
      <el-table-column :label="$t('总价') + this.localization.currency_unit">
        <template slot-scope="scope">
          <span>{{ scope.row.unit_price * scope.row.qty }}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">{{ $t('正常') }}</span>
          <span v-if="scope.row.status === 1">{{ $t('破损') }}</span>
          <span v-if="scope.row.status === 2">{{ $t('问题件') }}</span>
        </template>
      </el-table-column>
      <!-- 图片 -->
      <el-table-column :label="$t('图片')" prop="images" width="130">
        <template slot-scope="scope">
          <span
            v-for="item in scope.row.images"
            :key="item.id"
            style="cursor: pointer"
            @click.stop=";(imgSrc = $baseUrl.IMAGE_URL + item), (imgVisible = true)"
          >
            <img :src="$baseUrl.IMAGE_URL + item" style="width: 40px; margin-right: 5px" />
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      productData: [], // 商品清单
      services: [],
      localization: {},
      boxData: [],
      chooseId: 0,
      imgVisible: false,
      imgSrc: '',
      tableLoading: false,
      tableData: [],
      userId: '',
      unEdit: false
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
      // this.getProduct()
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request.getPackageDetails(this.$route.params.id).then(res => {
        this.tableLoading = false
        this.form = res.data
        this.services = res.data.services
        this.localization = res.localization
        this.boxData = res.data.box
        this.userId = res.data.user_id
      })
    },
    // 获取商品清单
    getProduct() {
      this.$request.packageDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.productData = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss">
.order-details-container {
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
  }
  .left-img {
    margin-top: 20px;
    padding: 10px 5px;
  }
  .productImg {
    border: 1px dashed #ccc;
    display: inline-block;
    margin-right: 15px;
    width: 110px !important;
    height: 100px;
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
    color: blue;
    text-decoration: underline;
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .sign-remark {
    display: inline-block;
  }
  .sign-font {
    font-size: 14px;
  }
  .change-sty {
    display: inline-block;
  }
  .msg-sty {
    margin-left: 10px;
  }
  .input-sty {
    width: 50%;
  }
  .second-sty {
    width: 25%;
  }
  .all-group {
    display: inline-block;
  }
  .all-sty {
    margin-left: 20px;
  }
  .group-sty {
    padding-left: 20px;
    font-size: 14px;
    color: #909399;
  }
  .packageName {
    display: inline-block;
    // width:60px;
    // word-break: keep-all;
    // overflow: hidden;
    // text-overflow: ellipsis
    width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
    margin: 0;
  }
  .packageName:hover {
    // width: auto;
  }
}
</style>

<template>
  <div class="configuration-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <el-tab-pane :label="$t('基础配置')" name="1">
        <div class="main-sty basic-configuration">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-menu
                :default-active="secondTab1"
                class="el-menu-vertical-demo"
                @select="handleSelect1"
              >
                <el-menu-item-group>
                  <el-menu-item index="1">
                    {{ $t('单位配置') }}
                  </el-menu-item>
                  <el-menu-item index="2">
                    {{ $t('预报与入库') }}
                  </el-menu-item>
                  <el-menu-item index="3">
                    {{ $t('支付配置') }}
                  </el-menu-item>
                  <el-menu-item index="4">
                    {{ $t('汇率配置') }}
                  </el-menu-item>
                  <el-menu-item index="5">
                    {{ $t('国家地区') }}
                  </el-menu-item>
                  <el-menu-item index="6">
                    {{ $t('转运须知') }}
                  </el-menu-item>
                  <el-menu-item index="7">
                    {{ $t('合箱须知') }}
                  </el-menu-item>
                  <el-menu-item index="8">
                    {{ $t('预设打包箱') }}
                  </el-menu-item>
                  <el-menu-item index="9">
                    {{ $t('收件地址配置') }}
                  </el-menu-item>
                  <el-menu-item index="10">
                    {{ $t('打包改价配置') }}
                  </el-menu-item>
                  <el-menu-item index="11">
                    {{ $t('上门取件配置') }}
                  </el-menu-item>
                  <el-menu-item index="12">
                    {{ $t('自动签收配置') }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-menu>
            </el-col>
            <!-- 单位配置 -->
            <el-col :span="13" v-if="secondTab1 === '1'" class="main-right">
              <unit-configure></unit-configure>
            </el-col>
            <!-- 预报与入库 -->
            <el-col :span="19" v-if="secondTab1 === '2'" class="main-right">
              <forecast-configure></forecast-configure>
            </el-col>
            <!-- 支付配置 -->
            <el-col :span="19" v-if="secondTab1 === '3'" class="main-right">
              <payment-configure></payment-configure>
            </el-col>
            <!-- 汇率配置 -->
            <el-col :span="19" v-if="secondTab1 === '4'" class="main-right">
              <exchange-configure></exchange-configure>
            </el-col>
            <!-- 国家地区 -->
            <el-col :span="20" v-if="secondTab1 === '5'" class="main-right">
              <country-configure></country-configure>
            </el-col>
            <!-- 转运规则 -->
            <el-col :span="19" v-if="secondTab1 === '6'" class="main-right">
              <transport-configure></transport-configure>
            </el-col>
            <el-col :span="19" v-if="secondTab1 === '7'" class="main-right">
              <box-configure></box-configure>
            </el-col>
            <!-- 预设打包箱 -->
            <el-col :span="19" v-if="secondTab1 === '8'" class="main-right">
              <preset-pack></preset-pack>
            </el-col>
            <!-- 收件地址配置 -->
            <el-col :span="19" v-if="secondTab1 === '9'" class="main-right">
              <address-config></address-config>
            </el-col>
            <!-- 打包改价配置 -->
            <el-col :span="19" v-if="secondTab1 === '10'" class="main-right">
              <pack-price-change></pack-price-change>
            </el-col>
            <!-- 上门取件配置 -->
            <el-col :span="19" v-if="secondTab1 === '11'" class="main-right">
              <pickup-time-config></pickup-time-config>
            </el-col>
            <el-col :span="19" v-if="secondTab1 === '12'" class="main-right">
              <auto-sign></auto-sign>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('系统服务配置')" name="2">
        <div class="main-sty">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-menu
                :default-active="secondTab2"
                class="el-menu-vertical-demo"
                @select="handleSelect2"
              >
                <el-menu-item-group>
                  <el-menu-item index="1">
                    {{ $t('小程序配置') }}
                  </el-menu-item>
                  <el-menu-item index="2">
                    {{ $t('公众号配置') }}
                  </el-menu-item>
                  <el-menu-item index="3">
                    {{ $t('PC端配置') }}
                  </el-menu-item>
                  <el-menu-item index="4">
                    {{ $t('API与服务*') }}
                  </el-menu-item>
                  <el-menu-item index="5">
                    {{ $t('客户登录配置') }}
                  </el-menu-item>
                  <el-menu-item index="6">
                    {{ $t('自定义后台系统') }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-menu>
            </el-col>
            <!-- 小程序配置 -->
            <el-col :span="19" v-if="secondTab2 === '1'" class="main-right">
              <app-configure></app-configure>
            </el-col>
            <!-- 公众号配置 -->
            <el-col :span="19" v-if="secondTab2 === '2'" class="main-right">
              <public-configura></public-configura>
            </el-col>
            <!-- PC端配置 -->
            <el-col :span="19" v-if="secondTab2 === '3'" class="main-right">
              <pc-configure></pc-configure>
            </el-col>
            <!-- API与服务 -->
            <el-col :span="19" v-if="secondTab2 === '4'" class="main-right">
              <api-configure></api-configure>
            </el-col>
            <!-- 客户登录配置 -->
            <el-col :span="19" v-if="secondTab2 === '5'" class="main-right">
              <login-configure></login-configure>
            </el-col>
            <!-- 自定义后台系统 -->
            <el-col :span="19" v-if="secondTab2 === '6'" class="main-right">
              <customize-background-system></customize-background-system>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('增值服务')" name="3">
        <div class="main-sty">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-menu
                :default-active="secondTab3"
                class="el-menu-vertical-demo"
                @select="handleSelect3"
              >
                <el-menu-item-group>
                  <el-menu-item index="1">
                    {{ $t('订单增值服务') }}
                  </el-menu-item>
                  <el-menu-item index="2">
                    {{ $t('包裹增值服务') }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-menu>
            </el-col>
            <!-- 订单增值服务 -->
            <el-col :span="19" v-if="secondTab3 === '1'" class="main-right">
              <order-service></order-service>
            </el-col>
            <!-- 包裹增值服务 -->
            <el-col :span="19" v-if="secondTab3 === '2'" class="main-right">
              <package-service></package-service>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('自定义配置')" name="4">
        <div class="main-sty">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-menu
                :default-active="secondTab4"
                class="el-menu-vertical-demo"
                @select="handleSelect4"
              >
                <el-menu-item-group>
                  <el-menu-item index="1">
                    {{ $t('单号规则') }}
                  </el-menu-item>
                  <el-menu-item index="2">
                    {{ $t('商品分类管理') }}
                  </el-menu-item>
                  <el-menu-item index="3">
                    {{ $t('发货快递公司') }}
                  </el-menu-item>
                  <el-menu-item index="4">
                    {{ $t('自定义轨迹类型') }}
                  </el-menu-item>
                  <el-menu-item index="5">
                    {{ $t('自定义标签') }}
                  </el-menu-item>
                  <!-- <el-menu-item index="6">
                    {{ $t('申报商品库管理') }}
                  </el-menu-item>-->
                  <el-menu-item index="6">
                    {{ $t('预报快递公司') }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-menu>
            </el-col>
            <!-- 单号规则 -->
            <el-col :span="19" v-if="secondTab4 === '1'" class="main-right">
              <order-rule></order-rule>
            </el-col>
            <!-- 商品分类管理 -->
            <el-col :span="19" v-if="secondTab4 === '2'" class="main-right">
              <commodity></commodity>
            </el-col>
            <!-- 发货快递公司 -->
            <el-col :span="19" v-if="secondTab4 === '3'" class="main-right">
              <express-company></express-company>
            </el-col>
            <!-- 自定义轨迹类型 -->
            <el-col :span="19" v-if="secondTab4 === '4'" class="main-right">
              <custom-track></custom-track>
            </el-col>
            <!-- 自定义标签 -->
            <el-col :span="19" v-if="secondTab4 === '5'" class="main-right">
              <custom-label></custom-label>
            </el-col>
            <!-- 申报商品库名称 -->
            <!-- <el-col :span="19" v-if="secondTab4 === '6'" class="main-right">
              <store-goods></store-goods>
            </el-col> -->
            <el-col :span="19" v-if="secondTab4 === '6'" class="main-right">
              <arrival></arrival>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('拼团配置')" name="5" v-if="unShow">
        <div class="main-sty main-right">
          <group-configure></group-configure>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import AppConfigure from './appConfigure'
import { pagination } from '@/mixin'
import PcConfigure from './pcConfigure.vue'
import ApiConfigure from './apiConfigure.vue'
import PublicConfigura from './publicConfigura'
import UnitConfigure from './unitConfigure.vue'
import ForecastConfigure from './forecastConfigure.vue'
import PaymentConfigure from './paymentConfigure.vue'
import ExchangeConfigure from './exchangeConfigure.vue'
import CountryConfigure from './countryConfigure.vue'
import TransportConfigure from './transportConfigure.vue'
import OrderService from './orderService'
import PackageService from './packageService.vue'
import OrderRule from './orderRule.vue'
import Commodity from './commodity.vue'
import ExpressCompany from './expressCompany.vue'
import CustomTrack from './customTrack.vue'
import CustomLabel from './customLabel.vue'
// import StoreGoods from './storeGoods.vue'
import Arrival from './arrival.vue'
import LoginConfigure from './loginConfigure.vue'
import customizeBackgroundSystem from './customizeBackgroundSystem.vue'
import boxConfigure from './boxConfigure'
import presetPack from './presetPack.vue'
import addressConfig from './addressConfig.vue'
import packPriceChange from './packPriceChange.vue'
import pickupTimeConfig from './pickupTimeConfig.vue'
import autoSign from './autoSign.vue'
// import GroupConfigure from './groupConfigure.vue'
export default {
  components: {
    AppConfigure,
    PcConfigure,
    ApiConfigure,
    PublicConfigura,
    UnitConfigure,
    ForecastConfigure,
    PaymentConfigure,
    ExchangeConfigure,
    CountryConfigure,
    TransportConfigure,
    OrderService,
    PackageService,
    OrderRule,
    Commodity,
    ExpressCompany,
    CustomTrack,
    CustomLabel,
    LoginConfigure,
    customizeBackgroundSystem,
    boxConfigure,
    presetPack,
    addressConfig,
    packPriceChange,
    pickupTimeConfig,
    // StoreGoods,
    Arrival,
    autoSign
    // GroupConfigure
  },
  mixins: [pagination],
  data() {
    return {
      secondTab1: '1',
      secondTab2: '1',
      secondTab3: '1',
      secondTab4: '1',
      activeName: '1',
      unShow: '' // 保存是否显示拼团配置
    }
  },
  mounted() {
    this.unShow = localStorage.getItem('me') ? Number(localStorage.getItem('me')) : 0
  },
  created() {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
      this.secondTab1 = this.$route.query.secondTab1
      this.secondTab2 = this.$route.query.secondTab2
      console.log(typeof this.secondTab2, 'this.secondTab2')
      this.secondTab3 = this.$route.query.secondTab3
      this.secondTab4 = this.$route.query.secondTab4
    }
  },
  methods: {
    onTabChange() {
      this.page_params.handleQueryChange('activeName', this.activeName)
      if (this.activeName === '1') {
        this.page_params.handleQueryChange('secondTab1', this.secondTab1)
      } else if (this.activeName === '2') {
        this.page_params.handleQueryChange('secondTab2', this.secondTab2)
      } else if (this.activeName === '3') {
        this.page_params.handleQueryChange('secondTab3', this.secondTab3)
      } else if (this.activeName === '4') {
        this.page_params.handleQueryChange('secondTab4', this.secondTab4)
      }
    },
    handleSelect1(key) {
      this.secondTab1 = key
      this.page_params.handleQueryChange('secondTab1', this.secondTab1)
    },
    handleSelect2(key) {
      this.secondTab2 = key
      this.page_params.handleQueryChange('secondTab2', this.secondTab2)
    },
    handleSelect3(key) {
      this.secondTab3 = key
      this.page_params.handleQueryChange('secondTab3', this.secondTab3)
    },
    handleSelect4(key) {
      this.secondTab4 = key
      this.page_params.handleQueryChange('secondTab4', this.secondTab4)
    }
  }
}
</script>

<style lang="scss" scoped>
.configuration-container {
  .save-btn {
    color: #fff;
    background-color: #3540a5;
  }
  .el-menu-vertical-demo {
    .el-menu-item {
      position: relative;
    }
    .is-active {
      color: #2597fc !important;
      background-color: #fff;
    }
    .is-active::after {
      content: '';
      display: block;
      position: absolute;
      height: 35px;
      width: 1px;
      background-color: #1790fc;
      top: 12px;
      left: 10px;
    }
  }
  .select-box {
    overflow: hidden;
    h4 {
      display: inline-block;
    }
  }
  .main-sty {
    background-color: #fff;
  }
  .main-right {
    padding: 20px;
  }
  .add-insurance {
    float: right;
    margin-top: 17px;
  }
  .sort-sty {
    color: red;
    font-size: 13px;
  }
  .icon-question {
    margin-left: 5px;
    font-size: 18px;
    color: #67c23a;
    position: relative;
    top: 3px;
  }
  // 基础配置
  .basic-configuration {
    // 汇率配置
    .rate-top {
      .rate-left {
        display: inline-block;
        .input-sty {
          margin-left: 10px;
          margin-right: 10px;
          width: 50%;
        }
      }
    }
  }
  //系统服务配置
  .logistics-container {
    background-color: #fff !important;
    padding: 20px;
  }
  .settings-container {
    padding: 20px;
    .el-tag {
      margin-right: 8px;
    }
    .no-warehouse {
      color: #606266;
    }
  }
}
</style>

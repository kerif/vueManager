<template>
  <div class="bill-details-container">
    <div>
      <div class="receiverMSg msg-top">
        <h4 class="change-sty">{{ $t('收货人信息') }}</h4>
        <el-button
          v-if="this.$route.params.activeName === '1' || this.$route.params.activeName === '2'"
          class="change-sty msg-sty btn-deep-purple"
          @click="changeReceive"
          >{{ $t('更换收货人信息') }}</el-button
        >
        <el-button
          v-if="unEdit === false"
          class="btn-deep-blue change-sty msg-sty"
          @click="goEdit"
          >{{ $t('编辑') }}</el-button
        >
        <el-button
          v-if="unEdit === true"
          class="btn-dark-green change-sty msg-sty"
          @click="saveMsg"
          >{{ $t('保存') }}</el-button
        >
        <el-button
          v-if="unEdit === true"
          class="btn-light-red change-sty msg-sty"
          @click="cancelMsg"
          >{{ $t('取消') }}</el-button
        >
        <el-form ref="form" :model="form" label-width="100px" label-position="right">
          <!-- <el-form-item :label="$t('姓名')"></el-form-item> -->
          <el-row class="container-center" :gutter="20">
            <!-- 姓名 -->
            <el-col :span="7">
              <span class="leftWidth">{{ $t('姓名') }}</span>
              <el-input
                class="input-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.receiver_name"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.receiver_name }}</span>
            </el-col>
            <!-- 手机/联系电话 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('手机/联系电话') }}</span>
              <el-input
                class="second-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.timezone"
                :placeholder="$t('区号')"
              ></el-input>
              <el-input
                class="second-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.phone"
                :placeholder="$t('号码')"
              ></el-input>
              <span v-if="unEdit === false"
                >{{ form.address && form.address.timezone }}-{{
                  form.address && form.address.phone
                }}</span
              >
            </el-col>
            <!-- 国家或地区 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('国家/地区') }}</span>
              <el-input
                class="second-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.country.cn_name"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.code }}</span
              >&nbsp;
              <span v-if="unEdit === false">{{
                form.address && form.address.country.cn_name
              }}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 城市 -->
            <el-col :span="7" v-if="form.address && form.address.is_cn_address == 1">
              <span class="leftWidth">{{ $t('省/市/区') }}</span>
              <el-input
                class="cn-address-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.province"
              ></el-input>
              <el-input
                class="cn-address-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.city"
              ></el-input>
              <el-input
                class="cn-address-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.district"
              ></el-input>
              <span v-if="unEdit === false"
                >{{ form.address && form.address.province }}{{ form.address && form.address.city
                }}{{ form.address && form.address.district }}</span
              >
            </el-col>
            <el-col :span="7" v-else>
              <span class="leftWidth">{{ $t('城市') }}</span>
              <el-input
                class="input-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.city"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.city }}</span>
            </el-col>
            <!-- 街道/门牌号 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('街道/门牌号') }}</span>
              <el-input
                class="second-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.street"
                :placeholder="$t('街道')"
              ></el-input>
              <el-input
                class="second-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.door_no"
                :placeholder="$t('门牌号')"
              ></el-input>
              <span v-if="unEdit === false"
                >{{ form.address && form.address.street
                }}{{ form.address && form.address.door_no }}</span
              >
            </el-col>
            <!-- 附加地址 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('附加地址') }}</span>
              <el-input
                class="input-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.address"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.address }}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 邮编 -->
            <el-col :span="7">
              <span class="leftWidth">{{ $t('邮编') }}</span>
              <el-input
                class="input-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.postcode"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.postcode }}</span>
            </el-col>
            <!-- 微信号 -->
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('微信号') }}</span>
              <el-input
                class="input-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.wechat_id"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.wechat_id }}</span>
            </el-col>
            <!-- 区域 -->
            <el-col :span="7" :offset="1" v-if="form.address && form.address.area">
              <span class="leftWidth">{{ $t('区域') }}</span>
              <el-input
                class="area-sty"
                v-if="form.address && unEdit === true && form.address.area"
                v-model="form.address.area.name"
              ></el-input>
              <span v-if="unEdit === false && form.address.area">{{
                form.address && form.address.area.name
              }}</span>
              <el-input
                class="area-sty"
                v-if="form.address && unEdit === true && form.address.sub_area"
                v-model="form.address.sub_area.name"
              ></el-input>
              <span v-if="unEdit === false && form.address.sub_area">{{
                form.address && form.address.sub_area.name
              }}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 收货自提点 -->
            <el-col :span="7">
              <span class="leftWidth">{{ $t('收货自提点') }}</span>
              <!-- <el-input class="input-sty" v-model="form.address.wechat_id"></el-input> -->
              <span>{{ form.station_name }}</span>
            </el-col>
            <!-- 个人通关码 -->
            <el-col :span="7" :offset="1" v-if="form.personal_code">
              <span class="leftWidth">{{ $t('个人通关码') }}</span>
              <el-input
                class="input-sty"
                v-if="form && unEdit === true"
                v-model="form.personal_code"
              ></el-input>
              <span v-if="unEdit === false">{{ form.personal_code }}</span>
            </el-col>
          </el-row>
          <el-row
            class="container-center"
            :gutter="20"
            v-if="form.clearance_code || form.id_card || form.personal_code"
          >
            <!-- 清关编码 -->
            <el-col :span="7" v-if="form.clearance_code">
              <span class="leftWidth">{{ $t('清关编码') }}</span>
              <el-input
                class="input-sty"
                v-if="form && unEdit === true"
                v-model="form.clearance_code"
              ></el-input>
              <span v-if="unEdit === false">{{ form.clearance_code }}</span>
            </el-col>
            <!-- 身份证号码 -->
            <el-col :span="7" :offset="1" v-if="form.id_card">
              <span class="leftWidth">{{ $t('身份证号码') }}</span>
              <el-input
                class="input-sty"
                v-if="form && unEdit === true"
                v-model="form.id_card"
              ></el-input>
              <span v-if="unEdit === false">{{ form.id_card }}</span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="receiverMSg">
        <h4 class="all-group">{{ $t('运单详情') }}</h4>
        <!-- <div class="all-group all-sty" v-if="this.$route.params.activeName === '1' && form.is_all_submitted === 1">
      <el-button class="btn-light-red">{{$t('全团已提交')}}</el-button>
    </div> -->
        <div v-if="form.group_name !== ''" class="all-group all-sty">
          <el-button class="btn-light-red">{{ form.group_name }}</el-button>
          <span class="group-sty" v-if="form.is_group_completed === 0">{{ $t('拼团进行中') }}</span>
          <span class="group-sty" v-if="form.is_group_completed === 1">{{ $t('拼团已完成') }}</span>
        </div>
        <el-row class="container-center" :gutter="20">
          <!-- 客户id -->
          <el-col :span="7">
            <span class="leftWidth">{{ $t('客户ID') }}</span>
            <span>{{ form.user_id }}---{{ form.user_name }}</span>
          </el-col>
          <!-- 订单号 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('订单号') }}</span>
            <span>{{ form.order_sn }}</span>
            <!-- <el-button size="small" v-if="form.order_sn" @click="copyUrl">复制</el-button> -->
          </el-col>
          <!-- 线路名称 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('线路名称') }}</span>
            <span>{{ form.express_line && form.express_line.cn_name }}</span>
            <span v-if="form.express_line && form.express_line.is_delivery === 0"
              >（{{ $t('仅送货上门') }}）</span
            >
            <span v-if="form.express_line && form.express_line.is_delivery === 1"
              >（{{ $t('仅自提') }}）</span
            >
            <span v-if="form.express_line && form.express_line.is_delivery === 2"
              >（{{ $t('送货上门与自提') }}）</span
            >
          </el-col>
        </el-row>
        <el-row class="container-center" :gutter="20">
          <!-- 提交时间 -->
          <el-col :span="7">
            <span class="leftWidth">{{ $t('提交时间') }}</span>
            <span>{{ form.created_at }}</span>
          </el-col>
          <!-- 转运快递单号 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('转运快递单号') }}</span>
            <span>{{ form.logistics_sn }}</span>
          </el-col>
          <!-- 转运快递公司 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('转运快递公司') }}</span>
            <span>{{ form.logistics_company }}</span>
          </el-col>
        </el-row>
        <el-row class="container-center" :gutter="20">
          <!-- 称重时间 -->
          <el-col :span="7">
            <span class="leftWidth">{{ $t('称重时间') }}</span>
            <span>{{ form.packed_at }}</span>
          </el-col>
          <!-- 发货时间 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('发货时间') }}</span>
            <span>{{ form.shipped_at }}</span>
          </el-col>
          <!-- 签收时间 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('签收时间') }}</span>
            <span>{{ form.signed_at }}</span>
          </el-col>
        </el-row>
        <el-row class="container-center" :gutter="20">
          <!-- 增值服务 -->
          <el-col :span="7">
            <span class="leftWidth">{{ $t('增值服务') }}</span>
            <span v-for="item in services" :key="item.id"
              >{{ item.name }}{{ localization.currency_unit
              }}{{ item.price }}&nbsp;&nbsp;&nbsp;</span
            >
          </el-col>
          <!-- 付款方式 -->
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('付款方式') }}</span>
            <span>{{ form.payment && form.payment.payment_type_name }}</span>
          </el-col>
          <!-- 签收方式 -->
          <el-col :span="7" :offset="1" v-if="form.sign_type === 1 || form.sign_type === 2">
            <span class="leftWidth">{{ $t('签收方式') }}</span>
            <span v-if="form.sign_type === 1">{{ $t('客户自行签收') }}</span>
            <span v-if="form.sign_type === 2">{{ $t('自提点签收') }}</span>
          </el-col>
          <!-- 团长ID -->
          <el-col :span="7" :offset="1" v-if="form.group_leader_id !== ''">
            <span class="leftWidth">{{ $t('团长ID') }}</span>
            <span>{{ form.group_leader_id }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-table class="data-list" border stripe :data="oderData" v-loading="tableLoading">
      <!-- 预计重量kg -->
      <el-table-column
        :label="
          baseMode === 1 ? $t('预计体积（立方）') : $t('预计重量') + this.localization.weight_unit
        "
        prop="except_weight"
      ></el-table-column>
      <el-table-column
        :label="
          baseMode === 1 ? $t('计费体积（立方）') : $t('计费重量') + this.localization.weight_unit
        "
        prop="payment_weight"
      ></el-table-column>
      <!-- 称重重量kg -->
      <el-table-column
        :label="$t('称重重量') + this.localization.weight_unit"
        prop="pack_weight"
      ></el-table-column>
      <!-- 体积重量 -->
      <el-table-column
        v-if="baseMode !== 1"
        :label="$t('体积重量') + this.localization.weight_unit"
        prop="volume_weight"
      ></el-table-column>
      <!-- 尺寸（长宽高cm） -->
      <el-table-column
        :label="$t('尺寸（长宽高）') + this.localization.length_unit"
        v-if="form.box_type === 1"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.length }}*</span>
          <span>{{ scope.row.width }}*</span>
          <span>{{ scope.row.height }}</span>
        </template>
      </el-table-column>
      <!-- 预计费用¥ -->
      <el-table-column
        :label="$t('预计费用') + this.localization.currency_unit"
        prop="payment_fee"
      ></el-table-column>
      <!-- 实际费用¥ -->
      <el-table-column
        :label="$t('实际费用') + this.localization.currency_unit"
        prop="actual_payment_fee"
      ></el-table-column>
      <!-- 包裹价值 -->
      <el-table-column
        :label="$t('包裹价值') + this.localization.currency_unit"
        prop="value"
      ></el-table-column>
      <!-- 包含的包裹 -->
      <el-table-column :label="$t('包含的包裹')" width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.packages.map(item => item.express_num).join(' ') }}</span>
          <!-- <span v-for="item in scope.row.packages" :key="item.id">{{item.express_num}}</span> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('出库类型')">
        <template slot-scope="scope">
          <span v-if="scope.row.box_type === 1">{{ $t('单箱出库') }}</span>
          <span v-if="scope.row.box_type === 2">{{ $t('多箱出库') }}</span>
        </template>
      </el-table-column>
      <!-- 货位 -->
      <el-table-column :label="$t('货位')" prop="location"></el-table-column>
      <!-- 备注 -->
      <el-table-column :label="$t('备注')" prop="remark"></el-table-column>
    </el-table>
    <!-- 费用详情 -->
    <div
      v-if="
        $route.params.activeName === '2' ||
        $route.params.activeName === '3' ||
        $route.params.activeName === '4' ||
        $route.params.activeName === '5'
      "
    >
      <h4>{{ $t('费用详情') }}</h4>
      <el-table :data="paymentData" class="data-list" border stripe v-loading="tableLoading">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="freight_amount">
          <template slot="header">
            <span>{{ $t('运费') }}</span>
            <el-tooltip placement="top">
              <span slot="content" v-for="item in paymentData" :key="item.id">
                <span>
                  {{ $t('首费')
                  }}{{ `${localization.currency_unit} ${item.freights.first_freight_fee}` }}</span
                ><br />
                <span
                  >{{ $t('续费')
                  }}{{ `${localization.currency_unit} ${item.freights.next_freight_fee}` }}</span
                ><br />
                <span v-if="item.express_line_costs.length">
                  <span v-for="ele in item.express_line_costs" :key="ele.id">
                    {{ ele.name }} {{ `${localization.currency_unit}${ele.price}` }} </span
                  ><br />
                </span>
              </span>
              <i class="el-icon-question" style="font-size: 18px; color: #35b85a"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('增值服务费') + this.localization.currency_unit"
          prop="value_added_amount"
        >
          <template slot="header">
            <span>{{ $t('增值服务') }}</span>
            <el-tooltip placement="top">
              <span slot="content" v-for="item in paymentData" :key="item.id">
                <span v-if="item.value_added_service.length">
                  <span v-for="val in item.value_added_service" :key="val.id">
                    {{ val.name }} {{ `${localization.currency_unit}${val.price}` }} </span
                  ><br />
                </span>
              </span>
              <i class="el-icon-question" style="font-size: 18px; color: #35b85a"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('增值服务费') + this.localization.currency_unit"
          prop="line_service_fee"
        >
          <template slot="header">
            <span>{{ $t('渠道增值服务') }}</span>
            <el-tooltip placement="top">
              <span slot="content" v-for="item in paymentData" :key="item.id">
                <span v-if="item.line_services.length">
                  <span v-for="val in item.line_services" :key="val.id">
                    {{ val.name }} {{ `${localization.currency_unit}${val.price}` }} </span
                  ><br />
                </span>
              </span>
              <i class="el-icon-question" style="font-size: 18px; color: #35b85a"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('渠道规则费用') + this.localization.currency_unit"
          prop="line_rule_fee"
        >
          <template slot="header">
            <span>{{ $t('渠道规则费用') }}</span>
            <el-tooltip placement="top">
              <span slot="content" v-for="item in paymentData" :key="item.id">
                <span v-if="item.line_rules.length">
                  <span v-for="val in item.line_rules" :key="val.id">
                    {{ val.name }} {{ `${localization.currency_unit}${val.price}` }} </span
                  ><br />
                </span>
              </span>
              <i class="el-icon-question" style="font-size: 18px; color: #35b85a"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('保险金额') + this.localization.currency_unit"
          prop="insurance_fee"
        ></el-table-column>
        <!-- 关税金额 -->
        <el-table-column
          :label="$t('关税金额') + this.localization.currency_unit"
          prop="tariff_fee"
        ></el-table-column>
        <el-table-column
          :label="$t('应付金额') + this.localization.currency_unit"
          prop="order_amount"
        ></el-table-column>
        <el-table-column :label="$t('计费价格模式')" prop="order_amount">
          <template slot-scope="scope">
            <span v-if="scope.row.freight_mode === 1">{{ $t('首重续重模式') }}</span>
            <span v-if="scope.row.freight_mode === 2">{{ $t('阶梯价格模式') }}</span>
            <span v-if="scope.row.freight_mode === 3">{{ $t('首重+阶梯价格档模式') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('抵用券金额') + this.localization.currency_unit"
          prop="coupon_amount"
        ></el-table-column>
        <el-table-column
          :label="$t('积分抵扣金额') + this.localization.currency_unit"
          prop="point_amount"
        ></el-table-column>
        <el-table-column
          :label="$t('实际支付') + this.localization.currency_unit"
          prop="pay_amount"
        ></el-table-column>
        <el-table-column :label="$t('支付时间')" prop="paid_at"></el-table-column>
      </el-table>
    </div>
    <!-- 包裹清单 -->
    <h4>{{ $t('包裹清单') }}</h4>
    <div class="add-sty" v-if="this.$route.params.activeName === '1'">
      <el-button class="btn-blue" @click="addPackages">{{ $t('添加包裹') }}</el-button>
    </div>
    <el-table :data="PackageData" class="data-list" border stripe v-loading="tableLoading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('快递单号')" prop="express_num"></el-table-column>
      <!-- 包裹编码 -->
      <el-table-column :label="$t('包裹编码')" prop="code"></el-table-column>
      <el-table-column :label="$t('物品名称')" prop="package_name"></el-table-column>
      <el-table-column
        :label="$t('物品价值') + this.localization.currency_unit"
        prop="package_value"
      ></el-table-column>
      <el-table-column :label="$t('物品属性')">
        <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">
            {{ item.cn_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('代理')" prop="agent"></el-table-column>
      <el-table-column
        :label="$t('长宽高') + this.localization.length_unit"
        prop="dimension"
      ></el-table-column>
      <el-table-column
        :label="$t('重量') + this.localization.weight_unit"
        prop="package_weight"
      ></el-table-column>
      <!-- 商品清单 -->
      <el-table-column :label="$t('入库照片')" width="130">
        <template slot-scope="scope">
          <span
            v-for="item in scope.row.package_pictures"
            :key="item.id"
            style="cursor: pointer"
            @click.stop=";(imgSrc = $baseUrl.IMAGE_URL + item), (imgVisible = true)"
          >
            <img :src="$baseUrl.IMAGE_URL + item" style="width: 40px; margin-right: 5px" />
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('货位')" prop="location"></el-table-column>
      <el-table-column :label="$t('操作')" width="140" v-if="this.$route.params.activeName === '1'">
        <template slot-scope="scope">
          <el-button @click="packageDetails(scope.row.id)" class="btn-deep-purple">
            {{ $t('详情') }}
          </el-button>
          <el-button
            class="btn-light-red"
            @click="removePackage(scope.row.id, scope.row.express_num, scope.row.order_sn)"
          >
            {{ $t('移除') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <h4>{{ $t('商品清单') }}</h4>
    <el-table :data="productData" class="data-list" border stripe v-loading="tableLoading">
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 物品名称 -->
      <el-table-column :label="$t('物品名称')" prop="name"></el-table-column>
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
      <!-- 材质 -->
      <el-table-column :label="$t('材质')" prop="material"></el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('状态')" prop="status_name"></el-table-column>
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
      <!-- 所属包裹 -->
      <el-table-column :label="$t('所属包裹')" prop="express_num"></el-table-column>
    </el-table>
    <!-- 多箱出库详情 -->
    <div
      v-if="
        (this.$route.params.activeName === '2' ||
          this.$route.params.activeName === '3' ||
          this.$route.params.activeName === '4' ||
          this.$route.params.activeName === '5') &&
        this.form.box_type === 2
      "
    >
      <h4>{{ $t('多箱出库详情') }}</h4>
      <el-table :data="boxData" class="data-list" border stripe v-loading="tableLoading">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          :label="$t('包裹实际重量') + this.localization.weight_unit"
          prop="weight"
        ></el-table-column>
        <el-table-column
          :label="$t('长') + this.localization.length_unit"
          prop="length"
        ></el-table-column>
        <el-table-column
          :label="$t('宽') + this.localization.length_unit"
          prop="width"
        ></el-table-column>
        <el-table-column
          :label="$t('高') + this.localization.length_unit"
          prop="height"
        ></el-table-column>
        <el-table-column
          :label="$t('体积重量') + this.localization.weight_unit"
          prop="volume_weight"
        ></el-table-column>
      </el-table>
    </div>
    <div class="bale-left packed-details">
      <span>{{ $t('仓库备注') }}</span>
      <span>
        {{ form.remark }}
      </span>
    </div>
    <div class="bale">
      <div class="bale-left">
        <span>{{ $t('打包照片') }}</span>
        <div class="left-img" v-for="item in form.pack_pictures" :key="item.id">
          <span
            style="cursor: pointer"
            @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item.url}`), (imgVisible = true)"
          >
            <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" />
          </span>
        </div>
      </div>
      <div class="bale-left">
        <span>{{ $t('物品照片') }}</span>
        <div class="left-img" v-for="item in form.in_warehouse_pictures" :key="item.id">
          <span
            style="cursor: pointer"
            @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item.url}`), (imgVisible = true)"
          >
            <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" />
          </span>
        </div>
      </div>
    </div>
    <!-- 留仓物品 -->
    <div class="bale">
      <div class="bale-left packed-details">
        <span>{{ $t('留仓物品') }}</span>
        <span v-if="form.in_warehouse_item">
          {{ form.in_warehouse_item }}
        </span>
        <span v-else class="nullProduct">{{ $t('无') }}</span>
      </div>
      <div class="bale-left packed-details">
        <span>{{ $t('签收照片') }}</span>
        <div class="left-img" v-for="item in form.sign_images" :key="item.id">
          <span style="cursor: pointer" @click.stop=";(imgSrc = `${item}`), (imgVisible = true)">
            <img :src="`${item}`" class="productImg" />
          </span>
        </div>
      </div>
    </div>
    <!-- 签收备注 -->
    <div class="packed-details" v-if="this.$route.params.activeName === '5'">
      <h4 class="sign-remark">{{ $t('签收备注') }}</h4>
      <span v-if="form.sign_remark" class="sign-font">
        {{ form.sign_remark }}
      </span>
      <span v-else class="nullProduct">{{ $t('无') }}</span>
    </div>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
    <!-- 收件地址弹窗 -->
    <el-dialog :visible.sync="boxDialog" :title="$t('收件地址列表')" @close="clear">
      <el-table :data="tableData" border @row-click="onRowChange" style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <!-- 国家 -->
        <el-table-column prop="country.cn_name" :label="$t('国家')"> </el-table-column>
        <!-- 收件人 -->
        <el-table-column prop="receiver_name" :label="$t('收件人')"> </el-table-column>
        <!-- 收件电话 -->
        <el-table-column :label="$t('收件电话')">
          <template slot-scope="scope">
            <span>{{ scope.row.timezone }}-{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <!-- 详细地址 -->
        <el-table-column :label="$t('详细地址')">
          <template slot-scope="scope">
            <span
              >{{ scope.row.street }}&nbsp;{{ scope.row.door_no }}&nbsp;{{ scope.row.city }}
              <span v-if="scope.row.address">({{ scope.row.address }})</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="boxDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
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
      productData: [], // 商品清单
      services: [],
      localization: {},
      paymentData: [],
      boxData: [],
      chooseId: 0,
      imgVisible: false,
      imgSrc: '',
      tableLoading: false,
      boxDialog: false,
      tableData: [],
      userId: '',
      unEdit: false,
      baseMode: 0
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
      this.getProduct()
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request.getOrderDetails(this.$route.params.id).then(res => {
        this.tableLoading = false
        this.form = res.data
        this.baseMode = res.data.express_line.base_mode
        this.oderData = [{ ...res.data.details, box_type: res.data.box_type }]
        console.log(this.oderData, 'this.oderData')
        this.PackageData = res.data.packages
        this.services = res.data.services
        this.localization = res.localization
        this.paymentData = [res.data.payment]
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
    },
    // 获取收件人可选信息
    getAddress() {
      this.$request
        .detailsAddress({
          user_id: this.userId
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
          }
        })
    },
    clear() {
      this.chooseId = ''
      this.user = {}
    },
    // 更换收件人信息
    changeReceive() {
      this.getAddress()
      this.boxDialog = true
    },
    // 编辑
    goEdit() {
      this.unEdit = true
    },
    // 保存 编辑
    saveMsg() {
      this.$request
        .modifyReceive(this.$route.params.id, {
          receiver_name: this.form.address.receiver_name,
          street: this.form.address.street,
          door_no: this.form.address.door_no,
          phone: this.form.address.phone,
          timezone: this.form.address.timezone,
          city: this.form.address.city,
          postcode: this.form.address.postcode,
          address: this.form.address.address,
          country: this.form.address.country.cn_name,
          clearance_code: this.form.clearance_code,
          wechat_id: this.form.address.wechat_id
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('保存成功'),
              message: res.msg,
              type: 'success'
            })
            this.unEdit = false
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 新增包裹
    addPackages() {
      dialog({ type: 'addPackages', id: this.$route.params.id }, () => {
        this.getList()
      })
    },
    // 取消
    cancelMsg() {
      this.unEdit = false
      this.getList()
    },
    copyUrl() {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', this.form.order_sn)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    },
    // 跳转到财务 流水记录
    goSerial(serialNumber) {
      this.$router.push({ name: 'transaction', query: { serial_number: serialNumber } })
    },
    onRowChange(row) {
      this.chooseId = row.id
      // this.box.address_id = this.chooseId
      this.user = row
    },
    // 包裹清单 详情
    packageDetails(id) {
      this.$router.push({ name: 'oderDetails', params: { id: id } })
    },
    // 移除 包裹清单
    removePackage(id, expressNum, orderSn) {
      this.$confirm(
        this.$t(
          `该操作无法撤回，移除后的包裹将回到已入库状态，您是否确认将包裹（${expressNum}）从订单（${orderSn}）中移除？注：若该订单只有一个包裹，则该包裹移除后订单自动作废`
        ),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.removePackage(this.$route.params.id, id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.getProduct()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    confirm() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request.confirmChange(this.$route.params.id, this.chooseId).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('保存成功'),
            message: res.msg,
            type: 'success'
          })
          this.boxDialog = false
          this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
      // console.log(this.user, 'user')
      // this.userData = this.user
      // this.boxDialog = false
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
  .area-sty {
    width: 29%;
  }
  .second-sty {
    width: 25%;
  }
  .cn-address-sty {
    width: 20%;
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
  .add-sty {
    text-align: right;
  }
}
</style>

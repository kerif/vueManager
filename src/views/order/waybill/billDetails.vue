<template>
  <div class="bill-details-container">
    <div style="text-align: center; font-size: 18px; margin-bottom: 20px">
      {{ $t('订单详情') }}
    </div>
    <el-row>
      <el-col :span="17">
        <div class="details-top">
          <div class="number-top">
            {{ $t('订单号') }}：<span
              >{{ form.order_sn }}{{ form.warehouse && form.warehouse.warehouse_name }}</span
            >
          </div>
          <div class="number-top">
            {{ $t('客户编号') }}：<span>{{ form.user_id }}---</span
            ><span>{{ form.user_name }}</span>
          </div>
          <div class="number-top">
            {{ $t('转运单号') }}：<span>{{ form.order_sn }}</span
            ><span>({{ form.logistics_company }})</span>
          </div>
        </div>
        <div class="details-top">
          <div class="container-sty container-line">
            <span
              ><strong>{{ form.express_line && form.express_line.name }}</strong></span
            ><br />
            <div class="container-left" style="color: blue">
              {{ form.address && form.address.country_name }}
            </div>
            <div class="container-right">{{ form.station_name }}</div>
          </div>
          <div class="container-sty container-weight">
            <span
              ><strong
                >{{ form.length }}{{ form.width }}{{ form.height }}&nbsp;{{
                  localization.length_unit
                }}</strong
              ></span
            ><i style="margin-left: 50px">/</i
            ><span style="margin-left: 50px"
              ><strong>{{ form.weight }}&nbsp;{{ localization.weight_unit }}</strong></span
            >
            <br />
            <div class="container-left">
              <span>{{ $t('计费体积') }}{{ form.details && form.details.payment_weight }}</span
              ><i style="margin-left: 60px">/</i>
              <span style="margin-left: 20px"
                >{{ $t('计费重量') }}{{ form.details && form.details.payment_weight }}</span
              >
            </div>
            <!-- <div class="container-right">{{ form.details && form.details.payment_weight }}</div> -->
          </div>
          <div class="container-sty container-pay">
            <span
              ><strong
                >{{ form.details && form.details.actual_payment_fee
                }}{{ localization.currency_unit }}</strong
              ></span
            ><span class="pay">{{ form.payment && form.payment.payment_type_name }}</span
            ><br />
            <div class="container-left">
              {{ $t('订单实付') }}
              {{ form.payment && form.payment.pay_amount }}({{ localization.currency_unit }})
            </div>
            <div class="container-right">
              <el-button
                class="btn-blue-green"
                v-if="['3', '4', '5'].includes(this.$route.params.activeName)"
                size="small"
                @click="payed"
                >{{ $t('改为已付款') }}
              </el-button>
            </div>
          </div>
          <div class="container-sty container-status">
            <span class="ship"
              ><strong>{{ form.status_name }}</strong></span
            ><br />
            <div class="container-left">{{ $t('状态') }}</div>
          </div>
        </div>
        <el-tabs v-model="activeName" class="tabLength">
          <el-tab-pane :label="$t('基本信息')" name="0">
            <el-row style="background-color: #fff; padding: 10px">
              <el-col :span="11" style="border-right: 1px solid #e5e5e5">
                <h4 class="change-sty">{{ $t('收货人信息') }}</h4>
                <el-button
                  v-if="
                    this.$route.params.activeName === '1' || this.$route.params.activeName === '2'
                  "
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
                <el-form
                  ref="form"
                  :model="form"
                  label-width="100px"
                  class="info"
                  label-position="right"
                >
                  <el-row class="container-center" :gutter="20">
                    <!-- 姓名 -->
                    <el-col :span="11">
                      <span class="leftWidth">{{ $t('姓名') }}</span>
                      <el-input
                        class="input-sty"
                        v-if="form.address && unEdit === true"
                        v-model="form.address.receiver_name"
                      ></el-input>
                      <span v-if="unEdit === false">{{
                        form.address && form.address.receiver_name
                      }}</span>
                    </el-col>
                    <!-- 手机/联系电话 -->
                    <el-col :span="11" :offset="1">
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
                  </el-row>
                  <el-row class="container-center" :gutter="20">
                    <!-- 国家或地区 -->
                    <el-col :span="11">
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
                    <el-col
                      :span="11"
                      :offset="1"
                      v-if="form.address && form.address.is_cn_address == 1"
                    >
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
                        >{{ form.address && form.address.province
                        }}{{ form.address && form.address.city
                        }}{{ form.address && form.address.district }}</span
                      >
                    </el-col>
                    <el-col :span="11" v-else :offset="1">
                      <span class="leftWidth">{{ $t('城市') }}</span>
                      <el-input
                        class="input-sty"
                        v-if="form.address && unEdit === true"
                        v-model="form.address.city"
                      ></el-input>
                      <span v-if="unEdit === false">{{ form.address && form.address.city }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="container-center" :gutter="20">
                    <!-- 城市 -->
                    <!-- 街道/门牌号 -->
                    <el-col :span="11">
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
                      <span class="over-sty" v-if="unEdit === false"
                        >{{ form.address && form.address.street
                        }}{{ form.address && form.address.door_no }}</span
                      >
                    </el-col>
                    <!-- 附加地址 -->
                    <el-col :span="11" :offset="1">
                      <span class="leftWidth">{{ $t('附加地址') }}</span>
                      <el-input
                        class="input-sty"
                        v-if="form.address && unEdit === true"
                        v-model="form.address.address"
                      ></el-input>
                      <div v-if="unEdit === false" class="over-sty">
                        {{ form.address && form.address.address }}
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="container-center" :gutter="20">
                    <!-- 邮编 -->
                    <el-col :span="11">
                      <span class="leftWidth">{{ $t('邮编') }}</span>
                      <el-input
                        class="input-sty"
                        v-if="form.address && unEdit === true"
                        v-model="form.address.postcode"
                      ></el-input>
                      <span v-if="unEdit === false">{{
                        form.address && form.address.postcode
                      }}</span>
                    </el-col>
                    <!-- 微信号 -->
                    <el-col :span="11" :offset="1">
                      <span class="leftWidth">{{ $t('微信号') }}</span>
                      <el-input
                        class="input-sty"
                        v-if="form.address && unEdit === true"
                        v-model="form.address.wechat_id"
                      ></el-input>
                      <span v-if="unEdit === false">{{
                        form.address && form.address.wechat_id
                      }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="container-center" :gutter="20">
                    <!-- 收货自提点 -->
                    <el-col :span="11">
                      <span class="leftWidth">{{ $t('收货自提点') }}</span>
                      <!-- <el-input class="input-sty" v-model="form.address.wechat_id"></el-input> -->
                      <span>{{ form.station_name }}</span>
                    </el-col>
                    <!-- 区域 -->
                    <el-col :span="11" :offset="1" v-if="form.address && form.address.area">
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
              </el-col>
              <el-col :span="13" style="padding-left: 10px; font-size: 14px">
                <div class="details-top" style="margin-bottom: 0px">
                  <h4>{{ $t('申请打包包裹记录') }}</h4>
                  <h4>{{ $t('包裹总价值') }}</h4>
                </div>
                <div class="review-package review-bg">
                  <div>{{ $t('快递单号') }}</div>
                  <div>{{ $t('物品') }}</div>
                  <div>{{ $t('重量') }}</div>
                  <div>{{ $t('照片') }}</div>
                </div>
                <div class="review-package package-sty" v-for="item in PackageData" :key="item.id">
                  <div>
                    <span>{{ item.express_num }}</span
                    ><br />
                    <span>{{ item.express_company }}</span
                    ><br />
                    <span>{{ item.code }}</span
                    ><br /><span>（包裹编码）</span>
                  </div>
                  <div style="margin-left: -30px">
                    <span>{{ item.package_name }}x{{ item.qty }}</span
                    ><br />
                    <span>{{ localization.currency_unit }}{{ item.package_value }}</span
                    ><br />
                    <span v-for="val in item.props" :key="val.id">
                      {{ val.cn_name }}
                    </span>
                  </div>
                  <div style="margin-left: 36px">
                    <span>{{ item.package_weight }}{{ localization.weight_unit }}</span
                    ><br />
                    <span>{{ item.dimension }}{{ localization.length_unit }}</span
                    ><br />
                    <span>{{ item.location }}</span>
                  </div>
                  <div>
                    <span>{{ item.agent }}{{ $t('代理') }}</span
                    ><br />
                    <span
                      v-for="pic in item.package_pictures"
                      :key="pic.id"
                      style="cursor: pointer"
                      @click.stop=";(imgSrc = $baseUrl.IMAGE_URL + pic), (imgVisible = true)"
                    >
                      <img :src="$baseUrl.IMAGE_URL + pic" style="width: 40px; margin-right: 5px" />
                    </span>
                  </div>
                </div>
                <div class="application-sty">
                  {{ $t('申请备注') }}
                  {{ form.vip_remark }}
                </div>
                <div class="application-sty">
                  {{ $t('申请增值服务') }}
                  <el-table
                    :data="addedData"
                    class="data-list"
                    border
                    stripe
                    v-loading="tableLoading"
                    ref="table"
                  >
                    <el-table-column type="index" label="#" width="50"></el-table-column>
                    <el-table-column :label="$t('服务名称')" prop="name"></el-table-column>
                    <el-table-column
                      prop="price"
                      :label="$t('费用') + localization.currency_unit"
                    ></el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
            <div style="background-color: #fff; padding: 10px">
              <h4>{{ $t('商品清单') }}</h4>
              <el-table
                :data="productData"
                class="data-list"
                border
                stripe
                v-loading="tableLoading"
              >
                <el-table-column type="index" label="#" width="50"></el-table-column>
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
                      <img
                        :src="$baseUrl.IMAGE_URL + item"
                        style="width: 40px; margin-right: 5px"
                      />
                    </span>
                  </template>
                </el-table-column>
                <!-- 所属包裹 -->
                <el-table-column :label="$t('所属包裹')" prop="express_num"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('打包详细')" name="1">
            <div class="package-details">
              <div class="details-top">
                <div class="size">
                  {{ $t('操作仓库') }}：{{ form.warehouse && form.warehouse.warehouse_name }}
                </div>
                <div class="size">
                  {{ $t('出库方式') }}：
                  <span v-if="form.box_type === 1">{{ $t('单箱') }}</span>
                  <span v-if="form.box_type === 2">{{ $t('多箱') }}</span>
                </div>
                <div class="size">
                  {{ $t('计费重量') }}：
                  <span
                    >{{ form.details && form.details.payment_weight
                    }}{{ localization.weight_unit }}</span
                  >
                </div>
              </div>
              <el-table
                :data="boxData"
                class="data-list"
                border
                stripe
                v-loading="tableLoading"
                ref="table"
              >
                <el-table-column :label="$t('箱号')" type="index"></el-table-column>
                <el-table-column :label="$t('包裹号')">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.packages" :key="index">
                      {{ item }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('长')" prop="length"></el-table-column>
                <el-table-column :label="$t('宽')" prop="width"></el-table-column>
                <el-table-column :label="$t('高')" prop="height"></el-table-column>
                <el-table-column :label="$t('体积重')" prop="volume_weight"></el-table-column>
                <el-table-column :label="$t('实重')" prop="weight"></el-table-column>
                <el-table-column :label="$t('承运单号')" prop="sn"></el-table-column>
              </el-table>
              <el-row class="size">
                <el-col :span="10">
                  <div class="bale">
                    <div class="bale-left">
                      <span>{{ $t('打包照片') }}</span>
                      <div class="left-img" v-for="item in form.pack_pictures" :key="item.id">
                        <span
                          style="cursor: pointer"
                          @click.stop="
                            ;(imgSrc = `${$baseUrl.IMAGE_URL}${item.url}`), (imgVisible = true)
                          "
                        >
                          <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {{ $t('转运公司') }}
                    {{ form.logistics_company }}
                  </div>
                  <div>
                    {{ $t('转运单号') }}
                    {{ form.logistics_sn }}
                  </div>
                  <div>
                    {{ $t('发货单单号') }}
                    {{ form.shipment && form.shipment.sn }}
                  </div>
                </el-col>
                <el-col :span="10" :offset="1">
                  <div>
                    {{ $t('存放货位') }}
                    {{ form.location }}
                  </div>
                  <div>
                    {{ $t('留仓物品') }}
                    {{ form.in_warehouse_item }}
                  </div>
                  <div>
                    {{ $t('仓库备注') }}
                    {{ form.remark }}
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('费用清单')" name="2">
            <div class="package-details">
              <div class="size">
                {{ $t('计价模式') }}:
                <span v-if="form.express_line && form.express_line.mode === 1">{{
                  $t('首重续重模式')
                }}</span>
                <span v-if="form.express_line && form.express_line.mode === 2">{{
                  $t('阶梯价格模式')
                }}</span>
                <span v-if="form.express_line && form.express_line.mode === 3">{{
                  $t('单位价格+阶梯总价模式')
                }}</span>
                <span v-if="form.express_line && form.express_line.mode === 4">{{
                  $t('多级续重模式')
                }}</span>
                <span v-if="form.express_line && form.express_line.mode === 5">{{
                  $t('阶梯首重续重模式')
                }}</span>
              </div>
              <el-table
                class="data-list"
                border
                stripe
                :data="paymentData"
                v-loading="tableLoading"
              >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column :label="$t('费用类型')" prop="name">
                  <!-- <template slot-scope="scope">
                    <span v-if="scope.row.name === '运费'">{{ scope.row.freight_mode }}</span>
                  </template> -->
                </el-table-column>
                <el-table-column prop="amount" :label="$t('金额') + localization.currency_unit">
                  <template slot-scope="scope">
                    <span v-if="scope.row.name === '运费'">{{ scope.row.freight_amount }}</span>
                    <span v-if="scope.row.name === '增值服务费'">{{
                      scope.row.value_added_amount
                    }}</span>
                    <span v-if="scope.row.name === '渠道服务费'">{{
                      scope.row.line_service_fee
                    }}</span>
                    <span v-if="scope.row.name === '渠道规则费'">{{
                      scope.row.line_rule_fee
                    }}</span>
                    <span v-if="scope.row.name === '保险费用'">{{ scope.row.insurance_fee }}</span>
                    <span v-if="scope.row.name === '抵用券减免'">{{
                      scope.row.coupon_amount
                    }}</span>
                    <span v-if="scope.row.name === '积分抵扣'">{{ scope.row.point_amount }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('描述')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.name === '运费'">
                      {{ $t('首费') }}{{ localization.currency_unit
                      }}{{ scope.row.first_freight_fee }},{{ $t('续费')
                      }}{{ localization.currency_unit }}{{ scope.row.next_freight_fee }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right; font-size: 14px">
                <div>
                  <div class="price-sty">{{ $t('应付') }}{{ localization.currency_unit }}</div>
                  <div class="price-sty pay-sty">
                    {{ form.payment && form.payment.order_amount }}
                  </div>
                </div>
                <div>
                  <div class="price-sty">{{ $t('实付') }}{{ localization.currency_unit }}</div>
                  <div class="price-sty pay-sty">{{ form.payment && form.pay_amount }}</div>
                </div>
                <div>
                  <div class="price-sty">{{ $t('支付方式') }}</div>
                  <div class="price-sty pay-sty">
                    {{ form.payment && form.payment.payment_type_name }}
                  </div>
                </div>
                <div>
                  <div class="price-sty">{{ $t('支付时间') }}</div>
                  <div class="price-sty pay-sty">{{ form.payment && form.paid_at }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('签收日志')" name="3">
            <div class="bale package-details">
              <div class="bale-left packed-details">
                <span>{{ $t('签收时间:') }}</span>
                <span>
                  {{ form.signed_at }}
                </span>
              </div>
              <div class="bale-left packed-details">
                <span>{{ $t('签收照片:') }}</span>
                <div class="left-img" v-for="item in form.sign_images" :key="item.id">
                  <span
                    style="cursor: pointer"
                    @click.stop=";(imgSrc = `${item}`), (imgVisible = true)"
                  >
                    <img :src="`${item}`" class="productImg" />
                  </span>
                </div>
              </div>
              <div style="margin-top: 20px; font-size: 14px">
                {{ $t('评价:') }}
                <span>{{ form.comment && form.comment.content }}</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="6" style="padding-left: 20px">
        <el-button
          @click="uploadInvoice"
          class="btn-green"
          v-if="['3', '4', '5'].includes($route.params.activeName)"
          >{{ $t('发票') }}</el-button
        >
        <el-button
          @click="batchEditCompany"
          class="btn-deep-purple"
          v-if="['3', '4'].includes($route.params.activeName)"
          >{{ $t('更新二程单号') }}</el-button
        >
        <el-button
          @click="updateTracking"
          class="btn-pink"
          v-if="$route.params.activeName === '4'"
          >{{ $t('更新物流轨迹') }}</el-button
        >
        <div class="express-content" v-loading="$store.state.btnLoading">
          <div v-if="TrackingData.length" class="line-sty">
            <div class="content-top">
              <div class="time">{{ $t('时间轴') }}</div>
            </div>
            <ul class="result-list">
              <li
                :class="{ 'last-finish': index === 0 }"
                v-for="(item, index) in TrackingData"
                :key="index"
              >
                <!-- <div class="time">{{ item.ftime }}</div> -->
                <div class="dot">
                  <span class="out-dot dot-box"> </span>
                  <span class="in-dot dot-box"></span>
                </div>
                <div class="text">
                  {{ item.context }}<br />
                  <span>{{ item.ftime }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <el-button @click="goTracking">{{ $t('查看全程物流轨迹') }}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <div>
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
          <el-row class="container-center" :gutter="20">
            <el-col :span="7">
              <span class="leftWidth">{{ $t('姓名') }}</span>
              <el-input
                class="input-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.receiver_name"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.receiver_name }}</span>
            </el-col>
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
            <el-col :span="7">
              <span class="leftWidth">{{ $t('邮编') }}</span>
              <el-input
                class="input-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.postcode"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.postcode }}</span>
            </el-col>
            <el-col :span="7" :offset="1">
              <span class="leftWidth">{{ $t('微信号') }}</span>
              <el-input
                class="input-sty"
                v-if="form.address && unEdit === true"
                v-model="form.address.wechat_id"
              ></el-input>
              <span v-if="unEdit === false">{{ form.address && form.address.wechat_id }}</span>
            </el-col>
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
            <el-col :span="7">
              <span class="leftWidth">{{ $t('收货自提点') }}</span>
              <span>{{ form.station_name }}</span>
            </el-col>
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
            <el-col :span="7" v-if="form.clearance_code">
              <span class="leftWidth">{{ $t('清关编码') }}</span>
              <el-input
                class="input-sty"
                v-if="form && unEdit === true"
                v-model="form.clearance_code"
              ></el-input>
              <span v-if="unEdit === false">{{ form.clearance_code }}</span>
            </el-col>
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
        <div v-if="form.group_name !== ''" class="all-group all-sty">
          <el-button class="btn-light-red">{{ form.group_name }}</el-button>
          <span class="group-sty" v-if="form.is_group_completed === 0">{{ $t('拼团进行中') }}</span>
          <span class="group-sty" v-if="form.is_group_completed === 1">{{ $t('拼团已完成') }}</span>
        </div>
        <el-row class="container-center" :gutter="20">
          <el-col :span="7">
            <span class="leftWidth">{{ $t('客户ID') }}</span>
            <span>{{ form.user_id }}---{{ form.user_name }}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('订单号') }}</span>
            <span>{{ form.order_sn }}</span>
          </el-col>
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
          <el-col :span="7">
            <span class="leftWidth">{{ $t('提交时间') }}</span>
            <span>{{ form.created_at }}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('转运快递单号') }}</span>
            <span>{{ form.logistics_sn }}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('转运快递公司') }}</span>
            <span>{{ form.logistics_company }}</span>
          </el-col>
        </el-row>
        <el-row class="container-center" :gutter="20">
          <el-col :span="7">
            <span class="leftWidth">{{ $t('称重时间') }}</span>
            <span>{{ form.packed_at }}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('发货时间') }}</span>
            <span>{{ form.shipped_at }}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('签收时间') }}</span>
            <span>{{ form.signed_at }}</span>
          </el-col>
        </el-row>
        <el-row class="container-center" :gutter="20">
          <el-col :span="7">
            <span class="leftWidth">{{ $t('增值服务') }}</span>
            <span v-for="item in services" :key="item.id"
              >{{ item.name }}{{ localization.currency_unit
              }}{{ item.price }}&nbsp;&nbsp;&nbsp;</span
            >
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{ $t('付款方式') }}</span>
            <span>{{ form.payment && form.payment.payment_type_name }}</span>
          </el-col>
          <el-col :span="7" :offset="1" v-if="form.sign_type === 1 || form.sign_type === 2">
            <span class="leftWidth">{{ $t('签收方式') }}</span>
            <span v-if="form.sign_type === 1">{{ $t('客户自行签收') }}</span>
            <span v-if="form.sign_type === 2">{{ $t('自提点签收') }}</span>
          </el-col>
          <el-col :span="7" :offset="1" v-if="form.group_leader_id !== ''">
            <span class="leftWidth">{{ $t('团长ID') }}</span>
            <span>{{ form.group_leader_id }}</span>
          </el-col>
        </el-row>
      </div>
    </div> -->
    <!-- <el-table class="data-list" border stripe :data="oderData" v-loading="tableLoading">
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
      <el-table-column
        :label="$t('称重重量') + this.localization.weight_unit"
        prop="pack_weight"
      ></el-table-column>
      <el-table-column
        v-if="baseMode !== 1"
        :label="$t('体积重量') + this.localization.weight_unit"
        prop="volume_weight"
      ></el-table-column>
      <el-table-column :label="$t('尺寸（长宽高）') + this.localization.length_unit">
        <template slot-scope="scope">
          <span>{{ scope.row.length }}*</span>
          <span>{{ scope.row.width }}*</span>
          <span>{{ scope.row.height }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('预计费用') + this.localization.currency_unit"
        prop="payment_fee"
      ></el-table-column>
      <el-table-column
        :label="$t('实际费用') + this.localization.currency_unit"
        prop="actual_payment_fee"
      ></el-table-column>
      <el-table-column
        :label="$t('包裹价值') + this.localization.currency_unit"
        prop="value"
      ></el-table-column>
      <el-table-column :label="$t('包含的包裹')" width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.packages.map(item => item.express_num).join(' ') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('出库类型')">
        <template slot-scope="scope">
          <span v-if="scope.row.box_type === 1">{{ $t('单箱出库') }}</span>
          <span v-if="scope.row.box_type === 2">{{ $t('多箱出库') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('货位')" prop="location"></el-table-column>
      <el-table-column :label="$t('备注')" prop="remark"></el-table-column>
    </el-table> -->
    <!-- <div
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
                  }}{{
                    `${localization.currency_unit} ${
                      item.freights && item.freights.first_freight_fee
                    }`
                  }}</span
                ><br />
                <span
                  >{{ $t('续费')
                  }}{{
                    `${localization.currency_unit} ${
                      item.freights && item.freights.next_freight_fee
                    }`
                  }}</span
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
    </div> -->
    <!-- <h4>{{ $t('包裹清单') }}</h4>
    <div class="add-sty" v-if="this.$route.params.activeName === '1'">
      <el-button class="btn-blue" @click="addPackages">{{ $t('添加包裹') }}</el-button>
    </div> -->
    <!-- <el-table :data="PackageData" class="data-list" border stripe v-loading="tableLoading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('快递单号')" prop="express_num"></el-table-column>
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
    </el-table> -->
    <!-- <h4>{{ $t('商品清单') }}</h4>
    <el-table :data="productData" class="data-list" border stripe v-loading="tableLoading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('物品名称')" prop="name"></el-table-column>
      <el-table-column :label="$t('数量')" prop="qty"></el-table-column>
      <el-table-column
        :label="$t('单价') + this.localization.currency_unit"
        prop="unit_price"
      ></el-table-column>
      <el-table-column :label="$t('总价') + this.localization.currency_unit">
        <template slot-scope="scope">
          <span>{{ scope.row.unit_price * scope.row.qty }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('材质')" prop="material"></el-table-column>
      <el-table-column :label="$t('状态')" prop="status_name"></el-table-column>
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
      <el-table-column :label="$t('所属包裹')" prop="express_num"></el-table-column>
    </el-table> -->
    <!-- <div
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
    </div> -->
    <!-- <div class="bale-left packed-details">
      <span>{{ $t('仓库备注') }}</span>
      <span>
        {{ form.remark }}
      </span>
    </div> -->
    <!-- <div class="bale">
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
    </div> -->
    <!-- <div class="bale">
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
    <div class="packed-details" v-if="this.$route.params.activeName === '5'">
      <h4 class="sign-remark">{{ $t('签收备注') }}</h4>
      <span v-if="form.sign_remark" class="sign-font">
        {{ form.sign_remark }}
      </span>
      <span v-else class="nullProduct">{{ $t('无') }}</span>
    </div> -->
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
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
    <el-dialog :visible.sync="trackDialog" width="30%" :title="$t('更新物流状态')" @close="clear">
      <el-form label-position="top" :model="logist" ref="form">
        <el-form-item :label="$t('物流状态')">
          <el-select
            v-model="logist.logistics_type_id"
            filterable
            class="country-select"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in modeData"
              :key="item.id"
              :label="item.context"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-button class="type-sty" @click="goMore">{{ $t('管理') }}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="trackDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="changeStatus">{{ $t('确定') }}</el-button>
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
      paymentType: [
        {
          name: this.$t('运费'),
          key: 'amount'
        },
        {
          name: this.$t('增值服务费'),
          key: 'amount'
        },
        {
          name: this.$t('渠道服务费'),
          key: 'amount'
        },
        {
          name: this.$t('渠道规则费'),
          key: 'amount'
        },
        {
          name: this.$t('保险费用'),
          key: 'amount'
        },
        {
          name: this.$t('抵用券减免'),
          key: 'amount'
        },
        {
          name: this.$t('积分抵扣'),
          key: 'amount'
        }
      ],
      boxData: [],
      chooseId: 0,
      imgVisible: false,
      imgSrc: '',
      tableLoading: false,
      boxDialog: false,
      tableData: [],
      userId: '',
      unEdit: false,
      activeName: '0',
      addedData: [],
      doubleData: [],
      baseMode: 0,
      trackDialog: false,
      modeData: [],
      logist: {
        logistics_type_id: ''
      },
      TrackingData: []
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
      this.getProduct()
    }
  },
  methods: {
    // 获取全部物流状态
    getType() {
      this.$request.getOrderStatus().then(res => {
        if (res.ret) {
          this.modeData = res.data
        }
      })
    },
    chooseData() {
      console.log(this.paymentData, 'this.paymentData11')
      for (var item in this.paymentData[0]) {
        console.log(item, 'item')
        this.paymentType.map(el => {
          if (el.key === item) {
            this.doubleData.push({
              name: el.name,
              value: this.paymentData[item]
            })
          }
        })
      }
      console.log(this.doubleData, 'doubleData')
    },
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
        this.paymentData = [
          {
            name: this.$t('运费'),
            freight_amount: res.data.payment.freight_amount,
            first_freight_fee: res.data.payment.freights.first_freight_fee,
            next_freight_fee: res.data.payment.freights.next_freight_fee
          },
          {
            name: this.$t('增值服务费'),
            value_added_amount: res.data.payment.value_added_amount,
            first_freight_fee: res.data.payment.freights.first_freight_fee,
            next_freight_fee: res.data.payment.freights.next_freight_fee
          },
          {
            name: this.$t('渠道服务费'),
            line_service_fee: res.data.payment.line_service_fee,
            first_freight_fee: res.data.payment.freights.first_freight_fee,
            next_freight_fee: res.data.payment.freights.next_freight_fee
          },
          {
            name: this.$t('渠道规则费'),
            line_rule_fee: res.data.payment.line_rule_fee,
            first_freight_fee: res.data.payment.freights.first_freight_fee,
            next_freight_fee: res.data.payment.freights.next_freight_fee
          },
          {
            name: this.$t('保险费用'),
            insurance_fee: res.data.payment.insurance_fee,
            first_freight_fee: res.data.payment.freights.first_freight_fee,
            next_freight_fee: res.data.payment.freights.next_freight_fee
          },
          {
            name: this.$t('抵用券减免'),
            coupon_amount: res.data.payment.coupon_amount,
            first_freight_fee: res.data.payment.freights.first_freight_fee,
            next_freight_fee: res.data.payment.freights.next_freight_fee
          },
          {
            name: this.$t('积分抵扣'),
            point_amount: res.data.payment.point_amount,
            first_freight_fee: res.data.payment.freights.first_freight_fee,
            next_freight_fee: res.data.payment.freights.next_freight_fee
          }
        ]
        this.TrackingData = [
          {
            context: '签收时间',
            ftime: res.data.signed_at
          },
          {
            context: '发货时间',
            ftime: res.data.shipped_at
          },
          {
            context: '支付时间',
            ftime: res.data.paid_at
          },
          {
            context: '打包时间',
            ftime: res.data.packed_at
          },
          {
            context: '提交时间',
            ftime: res.data.created_at
          }
        ]
        this.boxData = res.data.box
        this.userId = res.data.user_id
        if (res.data.payment && res.data.payment.value_added_service) {
          this.addedData = res.data.payment.value_added_service
        }
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
    // 导出发票
    uploadInvoice() {
      this.$confirm(this.$t('是否确认导出？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .uploadOrder({
            ids: this.$route.params.id
          })
          .then(res => {
            if (res.ret) {
              this.urlExcel = res.data.url
              window.open(this.urlExcel)
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              // this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    goTracking() {
      this.$router.push({
        name: 'tracking',
        query: {
          orderSn: this.form.order_sn
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
    // 弹窗 管理
    goMore() {
      this.trackDialog = false
      this.$router.push({
        name: 'configurationMore',
        query: {
          activeName: '4',
          secondTab4: '4'
        }
      })
    },
    // 修改转运快递公司
    batchEditCompany() {
      dialog(
        {
          type: 'addCompany',
          id: this.$route.params.id,
          state: 'edit'
        },
        () => {
          this.getList()
        }
      )
    },
    // 更改物流状态
    changeStatus() {
      this.$request
        .changeOrderStatus({
          logistics_type_id: this.logist.logistics_type_id,
          order_ids: this.$route.params.id
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.trackDialog = false
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    payed() {
      this.$confirm(this.$t('您真的确认更改状态为已付款吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .payedOrders({
            ids: this.$route.params.id
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    // 更新物流状态
    updateTracking() {
      this.trackDialog = true
      this.getType()
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
  .info {
    font-size: 14px;
  }
  .leftWidth {
    display: inline-block;
    width: 120px;
  }
  .bale {
    .bale-left {
      width: 100%;
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
    font-size: 14px;
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
    width: 46%;
  }
  .area-sty {
    width: 20%;
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
  .details-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .number-top {
      font-size: 14px;
      font-weight: 650;
    }
    .container-sty {
      // padding: 20px;
      background-color: #fff;
      overflow: hidden;
    }
    .container-line {
      width: 30%;
      padding: 10px !important;
    }
    .container-weight {
      width: 18%;
      padding: 10px !important;
    }
    .container-pay {
      width: 19%;
      padding: 10px !important;
      .pay {
        display: inline-block;
        margin-left: 105px;
        color: #d9001b;
        font-weight: 650;
        font-style: normal;
        font-size: 18px;
      }
    }
    .container-status {
      width: 15%;
      padding: 10px !important;
      .ship {
        color: #333333;
        font-size: 18px;
        font-weight: 650;
        font-style: normal;
      }
    }
    .container-sty > div {
      display: inline-block;
    }
    .container-left {
      float: left;
      font-size: 14px;
      margin-top: 10px;
    }
    .container-right {
      float: right;
      margin-top: 10px;
    }
  }
  .package-details {
    background-color: #fff;
    padding: 30px 10px 10px 10px;
  }
  .review-package {
    display: flex;
    justify-content: space-around;
    padding: 5px;
  }
  .package-sty {
    border: 1px solid #f0f0f0;
  }
  .review-bg {
    background-color: #f0f0f0;
  }
  .application-sty {
    margin-top: 20px;
  }
  .price-sty {
    display: inline-block;
  }
  .pay-sty {
    width: 200px;
  }
  .over-sty {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 80px;
  }
  .express-content {
    background-color: #fff;
    font-size: 14px;
    text-align: center;
    margin-top: 35px;
    padding-bottom: 20px;
  }
  .time {
    width: 155px;
  }
  .result-list {
    padding: 0;
    padding-left: 30px;
    li {
      display: flex;
      padding-bottom: 30px;
      &:not(:last-child) {
        .text::before {
          content: '';
          position: absolute;
          left: -8px;
          border-left: 1px solid #a8b7bf;
          height: calc(100% + 10px);
          top: 20px;
        }
      }
    }
    .last-finish {
      .out-dot {
        background-color: #35a581;
      }
      .in-dot {
        background-color: #35a581;
      }
    }
  }
  .dot-box {
    display: inline-block;
    border-radius: 50%;
  }
  .out-dot {
    width: 16px;
    height: 16px;
    background-color: #bcbcbc;
    opacity: 0.4;
    margin-top: 2px;
  }
  .in-dot {
    width: 10px;
    height: 10px;
    background-color: #bcbcbc;
    position: absolute;
    left: 3px;
    top: 5px;
  }
  .text {
    padding-left: 10px;
    position: relative;
    flex: 1;
    text-align: left;
  }
  .dot {
    position: relative;
    width: 16px;
    height: 16px;
    top: 5px;
  }
  .main-top {
    text-align: center;
  }
  .empty-box {
    text-align: center;
    img {
      width: 150px;
    }
  }
  .line-sty {
    // text-align: center;
    // width: 600px;
    margin: auto;
    padding-top: 20px;
  }
  .el-table tr th.is-leaf {
    border-bottom: 1px #ecedf0 solid;
    background-color: #fff;
  }
  .el-table th > .cell {
    text-align: center;
  }
  .el-table .cell {
    text-align: center;
  }
  .size {
    font-size: 14px;
  }
}
</style>

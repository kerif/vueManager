<template>
  <div class="bill-details-container">
    <el-steps :active="form.active" finish-status="success" class="steps">
      <el-step :title="$t('待处理')"></el-step>
      <el-step :title="$t('待支付')"></el-step>
      <el-step :title="$t('待发货')"></el-step>
      <el-step :title="$t('已发货')"></el-step>
      <el-step :title="$t('已签收')"></el-step>
      <el-step :title="$t('作废订单')"></el-step>
    </el-steps>
    <div
      style="
        text-align: center;
        font-size: 18px;
        margin-bottom: 20px;
        margin-top: 20px;
        line-height: 30px;
        overflow: hidden;
      "
    >
      {{ $t('订单详情') }}({{ form.warehouse && form.warehouse.warehouse_name }}) <Br />
      <div v-if="form.group_leader_id > 0" class="group-text">=======拼团订单=======</div>
      <el-alert
        v-if="form.status === 19"
        :title="$t('提示')"
        type="warning"
        description="订单已作废"
        show-icon
        closable="false"
      >
      </el-alert>
      <div class="tools">
        <el-button
          @click="downloadInvoice"
          icon="el-icon-tickets"
          mini
          v-if="[3, 4, 5].includes(form.status)"
          >{{ $t('发票') }}</el-button
        >
        <el-button
          type="primary"
          @click="packed(form.id, form.order_sn, form.status, form.is_parent, form.express_line.id)"
          icon="el-icon-suitcase"
          mini
          v-if="1 === form.status"
          >{{ $t('打包') }}</el-button
        >
        <el-button icon="el-icon-edit" @click="editPacked()" v-if="form.status === 2">{{
          $t('编辑')
        }}</el-button>

        <el-button @click="batchEditCompany" v-if="[3, 4].includes(form.status)">{{
          $t('更新二程单号')
        }}</el-button>
        <el-button @click="updateTracking" v-if="form.status === 4">{{
          $t('更新物流轨迹')
        }}</el-button>
      </div>
    </div>

    <el-row>
      <el-col :span="21">
        <div class="details-top">
          <div class="number-top">
            {{ $t('订单号') }}：<span
              >{{ form.order_sn }}({{ form.warehouse && form.warehouse.warehouse_name }})</span
            >
          </div>
          <div class="number-top">
            {{
              form.group_leader_id === 0 || form.group_leader_id === ''
                ? $t('客户编号')
                : $t('团长')
            }}：<span>{{ form.user_id }}---</span><span>{{ form.user_name }}</span>
            <span v-if="form.group_leader_id" class="group-status-text">
              拼团状态: {{ form.group_status_name }}</span
            >
          </div>
          <div class="number-top">
            <span>{{ $t('会员等级') }}: --- {{ form.user_member_level }}</span>
          </div>
          <div class="number-top">
            {{ $t('转运单号') }}：<span>{{ form.logistics_sn }}</span
            ><span>({{ form.logistics_company }})</span>
          </div>
        </div>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="panel-bg">
              <h4>
                {{
                  form.express_line &&
                  (form.express_line.cn_name === undefined
                    ? form.express_line.name
                    : form.express_line.cn_name)
                }}
                <span class="group-text">{{ form.group_name }}</span>
              </h4>
              <span style="color: blue; font-weight: bold">
                {{ form.address && form.address.country_name }}
              </span>
              {{ form.station_name }}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="panel-bg">
              {{ $t('计费体积') }} {{ form.length }} x {{ form.width }} x {{ form.height }}&nbsp;{{
                localization.length_unit
              }}
              <br />
              {{ $t('计费重量') }}
              <span class="weight-text">
                {{ form.details && form.details.payment_weight }}{{ localization.weight_unit }}
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="panel-bg">
              {{ $t('预计费用') }}&nbsp;{{ localization.currency_unit }}
              <strong>{{ form.details && form.details.payment_fee }}</strong>
              <br />
              {{ $t('实付费用') }}&nbsp;
              <span class="pay-text"
                >{{ localization.currency_unit }} {{ form.payment && form.payment.pay_amount }}
              </span>
              <span class="pay-type-text">
                {{ form.payment && form.payment.payment_type_name }}
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="panel-bg">
              <h4 style="font-size: 16px; color: blue">
                {{ form.status_name }}
                <router-link
                  v-if="form.status === 11"
                  style="color: red; font-weight: bolder"
                  :to="`/finance/orderReview/reviewFinance/${form.id}/pay`"
                >
                  {{ $t('待审核') }}
                </router-link>
                <router-link
                  v-if="form.status === 12"
                  class="choose-order"
                  style="color: red; font-weight: bolder"
                  :to="`/order/review/?id=${form.id}`"
                >
                  {{ $t('审核拒绝') }}
                </router-link>
              </h4>
              {{ $t('状态') }}
            </div>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
          <el-tab-pane :label="$t('基本信息')" name="0">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ $t('收货人信息') }}</span>
                <el-button
                  v-if="
                    this.form.status === 1 ||
                    this.form.status === 2 ||
                    this.form.status === 3 ||
                    this.form.status === 4
                  "
                  class="change-sty msg-sty btn-deep-purple"
                  @click="changeReceive"
                  >{{ $t('更换收货人信息') }}</el-button
                >
                <el-button
                  class="btn-deep-blue change-sty msg-sty"
                  @click="goEdit"
                  v-if="
                    this.form.status === 1 ||
                    this.form.status === 2 ||
                    this.form.status === 3 ||
                    this.form.status === 4
                  "
                  >{{ $t('编辑收货人') }}</el-button
                >
              </div>
              <div class="address" v-if="form.address">
                <table>
                  <tr>
                    <td>{{ $t('姓名') }}</td>
                    <th>{{ form.address.receiver_name }}</th>
                    <td>{{ $t('电话') }}</td>
                    <th>{{ form.address.timezone }}-{{ form.address.phone }}</th>
                  </tr>

                  <tr>
                    <td>{{ $t('国家地区') }}</td>
                    <th>{{ form.address.code }} {{ form.address.country.cn_name }}</th>
                    <td>{{ $t('省') }}</td>
                    <th class="part">
                      {{ form.address.province }}
                    </th>
                  </tr>

                  <tr>
                    <td>{{ $t('市') }}</td>
                    <th class="part">
                      {{ form.address.city }}
                    </th>
                    <td>{{ $t('区') }}</td>
                    <th class="part">
                      {{ form.address.district }}
                    </th>
                  </tr>

                  <tr>
                    <td>{{ $t('区域') }}</td>
                    <th>
                      {{ form.address && form.address.area && form.address.area.name }}&nbsp;{{
                        form.address && form.address.sub_area && form.address.sub_area.name
                      }}
                    </th>
                    <td>{{ $t('邮编') }}</td>
                    <th>{{ form.address.postcode }}</th>
                  </tr>

                  <tr>
                    <td>{{ $t('街道') }}</td>
                    <th>{{ form.address.street }}</th>
                    <td>{{ $t('门牌号') }}</td>
                    <th>{{ form.address.door_no }}</th>
                  </tr>

                  <tr class="one-line">
                    <td>{{ $t('附加地址') }}</td>
                    <th>{{ form.address.address }}</th>
                    <td>{{ $t('邮箱') }}</td>
                    <th>{{ form.address.email }}</th>
                  </tr>

                  <tr class="one-line" v-if="form.address.wechat_id">
                    <td>{{ $t('微信号') }}</td>
                    <th colspan="3">{{ form.address.wechat_id }}</th>
                  </tr>

                  <tr class="one-line" v-if="form.station_name">
                    <td>{{ $t('收货自提点') }}</td>
                    <th colspan="3">{{ form.station_name }}</th>
                  </tr>

                  <tr class="one-line" v-if="form.personal_code">
                    <td>{{ $t('个人通关码') }}</td>
                    <th colspan="3">{{ form.personal_code }}</th>
                  </tr>

                  <tr class="one-line" v-if="form.clearance_code">
                    <td>{{ $t('清关编码') }}</td>
                    <th colspan="3">{{ form.clearance_code }}</th>
                  </tr>

                  <tr class="one-line" v-if="form.id_card">
                    <td>{{ $t('身份证号码') }}</td>
                    <th colspan="3">{{ form.id_card }}</th>
                  </tr>
                </table>
              </div>
            </el-card>
            <br />
            <el-card class="box-card" v-if="form.is_parent === 1">
              <div slot="header" class="clearfix">
                <span>{{ $t('拼团子订单详细') }}</span>
              </div>
              <el-table :data="groupDataList">
                <!-- 订单号 -->
                <el-table-column :label="$t('操作')" fixed="left" width="100">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.group_buying_status === 0"
                      @click="
                        packed(
                          scope.row.id,
                          scope.row.order_sn,
                          scope.row.status,
                          scope.row.is_parent,
                          scope.row.express_line.id
                        )
                      "
                      icon="el-icon-suitcase"
                      mini
                      >{{ $t('打包') }}</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column :label="$t('订单号')" fixed="left" width="155">
                  <template slot-scope="scope">
                    <div>
                      <router-link
                        class="choose-order"
                        :to="`/order/billDetails/${scope.row.id}/${scope.row.status}`"
                      >
                        {{ scope.row.order_sn }}
                      </router-link>
                    </div>
                  </template>
                </el-table-column>
                <!-- 客户ID -->
                <el-table-column
                  :label="$t('客户ID')"
                  prop="user_id"
                  fixed="left"
                ></el-table-column>
                <el-table-column
                  :label="$t('用户名')"
                  prop="user_name"
                  fixed="left"
                  width="155"
                ></el-table-column>
                <el-table-column :label="$t('打包状态')">
                  <template slot-scope="scope">
                    <div class="no-package" v-if="scope.row.group_buying_status === 0">
                      {{ $t('未打包') }}
                    </div>
                    <div class="packaged" v-if="scope.row.group_buying_status >= 1">
                      {{ $t('已打包') }}
                    </div>
                  </template>
                </el-table-column>
                <!-- 支付状态 -->
                <el-table-column :label="$t('支付状态')">
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.status === 12"
                      @click="$router.push(`/order/review/?id=${scope.row.id}`)"
                    ></div>
                    <div v-else>{{ scope.row.status_name }}</div>
                  </template>
                </el-table-column>
                <!-- 转运快递单号 -->
                <el-table-column :label="$t('线路名称')" prop="express_line.cn_name" width="185">
                </el-table-column>
                <el-table-column
                  :label="$t('收货人')"
                  prop="address.receiver_name"
                ></el-table-column>
                <el-table-column
                  :label="$t('收货国家地区')"
                  prop="address.country_name"
                  width="155"
                ></el-table-column>
                <el-table-column :label="$t('包裹数与件数')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.package_count }}（{{ scope.row.number }}）</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('实际重量') + localization.weight_unit"
                  prop="actual_weight"
                ></el-table-column>
                <!-- 详见产品图 -->
                <el-table-column
                  :label="$t('实际费用') + localization.currency_unit"
                  prop="actual_payment_fee"
                ></el-table-column>
                <el-table-column
                  :label="$t('申报价值') + localization.currency_unit"
                  prop="declare_value"
                ></el-table-column>
                <!-- 支付方式 -->
                <el-table-column :label="$t('支付方式')">
                  <template slot-scope="scope">
                    <span class="payment-sty" v-if="scope.row.payment_type_name === '货到付款'">{{
                      scope.row.payment_type_name
                    }}</span>
                    <span v-else>{{ scope.row.payment_type_name }}</span>
                  </template>
                </el-table-column>
                <!-- 抵用券金额 -->
                <!-- 提交时间 -->
                <el-table-column
                  :label="$t('提交时间')"
                  prop="created_at"
                  width="155"
                ></el-table-column>
                <el-table-column
                  :label="$t('拣货时间')"
                  prop="packed_at"
                  width="155"
                ></el-table-column>
                <el-table-column :label="$t('签收时间')" prop="updated_at" width="155">
                </el-table-column>
              </el-table>
            </el-card>
            <br />
            <el-card class="box-card" v-if="form.is_parent === 0">
              <div slot="header" class="clearfix">
                <span>{{ $t('申请打包包裹记录') }}</span>
                <el-button style="float: right; padding: 3px 0" type="text"
                  >{{ $t('包裹总价值') }}:
                  <span style="font-size: 15px; font-weight: bold; color: red">
                    {{ localization.currency_unit }} {{ form.details.value }}
                  </span></el-button
                >
              </div>

              <el-alert
                v-if="form.vip_remark"
                :title="$t('申请打包备注')"
                type="warning"
                :description="form.vip_remark"
                show-icon
              >
              </el-alert>
              <el-table :data="PackageData" style="width: 100%">
                <el-table-column type="index" label="#" width="50"></el-table-column>
                <el-table-column :label="$t('快递单号')" width="180">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      icon="el-icon-link"
                      @click="packageDetail(scope.row.id)"
                      >{{ scope.row.express_num }}</el-button
                    ><br />
                    <span>{{ scope.row.code }}</span>
                    <span v-if="scope.row.code" class="small-text">（包裹编码）</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('物品')">
                  <template slot-scope="scope">
                    <div>
                      <span style="font-weight: bold; font-size: 12px"
                        >{{ scope.row.package_name }} x {{ scope.row.qty }}</span
                      ><br />
                      <span class="small-price-text"
                        >{{ localization.currency_unit }}{{ scope.row.package_value }}</span
                      ><br />
                      <span v-for="val in scope.row.props" :key="val.id" style="font-weight: bold">
                        {{ val.cn_name }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('重量尺寸')" width="180">
                  <template slot-scope="scope">
                    <div>
                      <strong>{{ scope.row.package_weight }} {{ localization.weight_unit }}</strong
                      ><br />
                      <span>{{ scope.row.dimension }} {{ localization.length_unit }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('货位')" width="180">
                  <template slot-scope="scope">
                    <div>
                      <strong>{{ scope.row.location }}</strong>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('照片')" width="180">
                  <template slot-scope="scope">
                    <div>
                      <span
                        v-for="pic in scope.row.package_pictures"
                        :key="pic.id"
                        style="cursor: pointer"
                        @click.stop=";(imgSrc = $baseUrl.IMAGE_URL + pic), (imgVisible = true)"
                      >
                        <img
                          :src="$baseUrl.IMAGE_URL + pic"
                          style="width: 40px; margin-right: 5px"
                        />
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
            <br />
            <el-card class="box-card" v-if="addedData">
              <div slot="header" class="clearfix">
                <span>{{ $t('申请增值服务') }}</span>
              </div>
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
            </el-card>
            <br />
            <el-card class="box-card" v-if="productData">
              <div slot="header" class="clearfix">
                <span>{{ $t('商品清单') }}</span>
              </div>

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
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="$t('打包详细')" name="1">
            <div class="package-details" v-if="form.status === 1">
              <h1><i class="el-icon-warning-outline"></i> 还未打包, 现在需要打包吗?</h1>
              <el-button
                type="primary"
                @click="
                  packed(form.id, form.order_sn, form.status, form.is_parent, form.express_line.id)
                "
                icon="el-icon-suitcase"
                mini
                v-if="1 === form.status"
                >{{ $t('打包') }}</el-button
              >
            </div>
            <div class="package-details" v-if="form.status > 1">
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
              <el-alert
                v-if="form.remark"
                :title="$t('仓库打包备注')"
                type="success"
                :description="form.remark"
                show-icon
              >
              </el-alert>
              <el-table
                :data="boxData"
                class="data-list"
                border
                stripe
                v-loading="tableLoading"
                ref="table"
              >
                <el-table-column :label="$t('箱号')" type="index" width="50"></el-table-column>
                <el-table-column :label="$t('包裹号')">
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.packages" :key="index">
                      {{ item }}
                    </span>
                    <span v-if="scope.row.packages.length === 0">-</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('长')" prop="length"></el-table-column>
                <el-table-column :label="$t('宽')" prop="width"></el-table-column>
                <el-table-column :label="$t('高')" prop="height"></el-table-column>
                <el-table-column :label="$t('体积重')" prop="volume_weight"></el-table-column>
                <el-table-column :label="$t('实重')" prop="weight"></el-table-column>
                <el-table-column :label="$t('承运单号')" prop="logistics_sn"></el-table-column>
              </el-table>
              <el-row class="size">
                <el-col :span="10">
                  <div class="bale info">
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
                  <div class="bale info">
                    <div class="bale-left">
                      <span>{{ $t('物品照片') }}</span>
                      <div
                        class="left-img"
                        v-for="item in form.in_warehouse_pictures"
                        :key="item.id"
                      >
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

                  <div class="info">
                    {{ $t('转运公司') }}
                    {{ form.logistics_company }}
                  </div>
                  <div class="info">
                    {{ $t('转运单号') }}
                    {{ form.logistics_sn }}
                  </div>
                  <div class="info">
                    {{ $t('发货单单号') }}
                    {{ form.logistics_sn && form.shipment && form.shipment.sn }}
                  </div>
                </el-col>
                <el-col :span="10" :offset="1">
                  <div class="info">
                    {{ $t('存放货位') }}
                    {{ form.location }}
                  </div>
                  <div class="info">
                    {{ $t('留仓物品') }}
                    {{ form.in_warehouse_item }}
                  </div>
                  <div class="info">
                    {{ $t('仓库备注') }}
                    {{ form.remark }}
                  </div>
                </el-col>
              </el-row>
              <el-row class="size">
                <div class="info">
                  <span>{{ $t('打包视频') }}</span>
                  <div style="display: flex; flex-wrap: wrap">
                    <div
                      style="margin: 10px 20px; width: 320px; height: 260px"
                      v-for="item in videoUrl"
                      :key="item.id"
                    >
                      <video :src="item.url" controls autoplay width="80%"></video>
                    </div>
                  </div>
                </div>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('费用清单')" name="2">
            <div class="package-details">
              <div class="size">
                {{ $t('计价模式') }}:
                <span class="pay-text" v-if="form.express_line && form.express_line.mode === 1">{{
                  $t('首重续重模式')
                }}</span>
                <span class="pay-text" v-if="form.express_line && form.express_line.mode === 2">{{
                  $t('阶梯价格模式')
                }}</span>
                <span class="pay-text" v-if="form.express_line && form.express_line.mode === 3">{{
                  $t('单位价格+阶梯总价模式')
                }}</span>
                <span class="pay-text" v-if="form.express_line && form.express_line.mode === 4">{{
                  $t('多级续重模式')
                }}</span>
                <span class="pay-text" v-if="form.express_line && form.express_line.mode === 5">{{
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
                <el-table-column :label="$t('费用类型')" prop="name"> </el-table-column>
                <el-table-column
                  prop="amount"
                  align="right"
                  :label="$t('金额') + localization.currency_unit"
                >
                  <template slot-scope="scope">
                    {{ scope.row.amount }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('描述')" prop="remark"> </el-table-column>
              </el-table>
              <div style="text-align: right; font-size: 14px">
                <div>
                  <div class="price-sty">{{ $t('应付') }}{{ localization.currency_unit }}</div>
                  <div class="price-sty pay-sty" style="color: blue">
                    {{ form.payment && form.payment.order_amount }}
                  </div>
                </div>
                <div>
                  <div class="price-sty">{{ $t('实付') }}{{ localization.currency_unit }}</div>
                  <div class="price-sty pay-sty" style="color: red">
                    {{ form.payment && form.payment.pay_amount }}
                  </div>
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
                <span>{{ $t('签收时间') }}</span>
                <span>
                  {{ form.signed_at }}
                </span>
              </div>
              <div class="bale-left packed-details">
                <span>{{ $t('签收照片') }}</span>
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
                {{ $t('评价') }}
                <span>{{ form.comment && form.comment.content }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('预申报信息')" name="4">
            <div class="declare-info">
              <el-form label-width="100px">
                <el-form-item :label="$t('税号')">
                  <span>{{ declare.tax_number }}</span>
                </el-form-item>
                <el-form-item :label="$t('海关编码')">
                  <span>{{ declare.hs_code }}</span>
                </el-form-item>
                <el-form-item :label="$t('申报类型')">
                  <span>{{ declare.type_name }}</span>
                </el-form-item>
                <el-form-item :label="$t('付费方式')">
                  <span>{{ declare.payment_mode }}</span>
                </el-form-item>
              </el-form>
              <el-table :data="declare.items" border stripe class="data-list">
                <el-table-column type="index"></el-table-column>
                <el-table-column :label="$t('中文品名')" prop="cn_name"></el-table-column>
                <el-table-column :label="$t('英文品名')" prop="en_name"></el-table-column>
                <el-table-column :label="$t('sku')" prop="sku"></el-table-column>
                <el-table-column :label="$t('海关编码')" prop="hs_code"></el-table-column>
                <el-table-column :label="$t('数量')" prop="quantity"></el-table-column>
                <el-table-column :label="$t('单位')" prop="unit_name"> </el-table-column>
                <el-table-column :label="$t('单价')" prop="unit_value"></el-table-column>
                <el-table-column :label="$t('总价值')" prop="value"></el-table-column>
                <el-table-column :label="$t('币种')" prop="currency_name"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="3" style="padding: 25px 0px 0px 20px">
        <div class="express-content" v-loading="$store.state.btnLoading">
          <div v-if="TrackingData.length" class="line-sty">
            <ul class="result-list">
              <li
                :class="{ 'last-finish': form.active === 4 - index }"
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
            <el-button @click="goTracking" mini>{{ $t('物流轨迹') }}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="boxDialog" :title="$t('收件地址列表')" @close="clear" width="80%">
      <el-table :data="tableData" border @row-click="onRowChange" style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <!-- 国家 -->
        <el-table-column prop="country.name" :label="$t('国家')"> </el-table-column>
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
            allow-create
            default-first-option
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
        <el-form-item
          v-if="
            this.logist.logistics_type_id &&
            !this.modeData.map(item => item.id).includes(this.logist.logistics_type_id)
          "
        >
          <el-checkbox v-model="is_member">{{ $t('是否记住') }}</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="trackDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" :loading="$store.state.btnLoading" @click="changeStatus">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 编辑信息 -->
    <el-dialog
      :visible.sync="dialogInfo"
      :title="$t('编辑收货人信息')"
      class="edit-info-dialog"
      @close="clear"
      width="80%"
    >
      <el-form :model="form" label-position="right" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('姓名')" class="label-sty">
              <el-input class="input-sty" v-model="address.receiver_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('手机联系电话')" class="label-sty">
              <el-input
                class="second-sty"
                v-model="address.timezone"
                :placeholder="$t('区号')"
              ></el-input>
              <el-input
                class="second-sty"
                v-model="address.phone"
                :placeholder="$t('号码')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('国家地区')" class="label-sty">
              <el-cascader
                v-model="countryList"
                :options="options"
                :props="{ checkStrictly: true }"
                clearable
                style="width: 60%"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('城市')" class="label-sty">
              <el-input class="input-sty" v-model="address.city"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('省')">
              <el-input class="input-sty" v-model="address.province"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('区')">
              <el-input class="input-sty" v-model="address.district"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('街道门牌号')" class="label-sty">
              <el-input
                class="second-sty"
                v-model="address.street"
                :placeholder="$t('街道')"
              ></el-input>
              <el-input
                class="second-sty"
                v-model="address.door_no"
                :placeholder="$t('门牌号')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('附加地址')" class="label-sty">
              <el-input class="input-sty" v-model="address.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('邮编')" class="label-sty">
              <el-input class="input-sty" v-model="address.postcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('微信号')" class="label-sty">
              <el-input class="input-sty" v-model="address.wechat_id"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('清关编码')" class="label-sty">
              <el-input class="input-sty" v-model="address.clearance_code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('邮箱')" class="label-sty">
              <el-input class="input-sty" v-model="address.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogInfo = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveMsg">{{ $t('确定') }}</el-button>
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
      address: {},
      oderData: [],
      PackageData: [],
      productData: [], // 商品清单
      services: [],
      localization: {},
      paymentData: [],
      active: 0,
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
      TrackingData: [],
      dialogInfo: false,
      groupDataList: [],
      options: [],
      countryList: [],
      declare: {},
      videoUrl: [],
      picking_divide_order_id: '',
      is_member: false
    }
  },
  created() {
    console.log(this.$route.query.sn, this.$route.params.id)
    // if (this.$route.query.sn) {
    //   this.getPurchaseSn()
    // }
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
    handleClick() {
      if (this.activeName === '1') {
        this.getVideo()
      }
    },
    getVideo() {
      this.$request.packageVideo(this.$route.params.id).then(res => {
        if (res.data.length) {
          this.videoUrl = res.data
        }
      })
    },
    // 国家列表
    getCountrys() {
      this.$request.getCountry().then(res => {
        if (res.ret) {
          this.options = res.data.map(item => {
            return {
              value: item.id,
              label: item.name,
              children: item.areas.length
                ? item.areas.map(item2 => {
                    return {
                      value: item2.id,
                      label: item2.name,
                      children: item2.areas.length
                        ? item2.areas.map(item3 => {
                            return {
                              value: item3.id,
                              label: item3.name
                            }
                          })
                        : []
                    }
                  })
                : []
            }
          })
          if (this.address.country_id) {
            this.countryList.push(+this.address.country_id)
          }
          if (this.address.area_id) {
            this.countryList.push(+this.address.area_id)
          }
          if (this.address.sub_area_id) {
            this.countryList.push(+this.address.sub_area_id)
          }
        }
      })
    },
    // 详情
    packageDetail(id) {
      this.$router.push({ name: 'oderDetails', params: { id: id } })
    },
    //拼团子订单详细
    loadGroupData(id) {
      this.$request.orderSecond(id).then(res => {
        if (res.ret) this.groupDataList = res.data
      })
    },
    getList() {
      this.tableLoading = true
      this.$request.getOrderDetails(this.$route.params.id).then(res => {
        this.tableLoading = false
        this.form = res.data
        this.address = res.data.address
        this.baseMode = res.data.express_line.base_mode
        this.oderData = [{ ...res.data.details, box_type: res.data.box_type }]
        console.log(this.oderData, 'this.oderData')
        this.PackageData = res.data.packages
        this.services = res.data.services
        this.localization = res.localization
        if (res.data.picking_divide_order_id) {
          this.picking_divide_order_id = res.data.picking_divide_order_id
          this.getPurchaseDetail()
        }
        if (res.data.pre_declare) {
          this.declare = res.data.pre_declare
        }
        let groupStatusName = ['进行中', '已结束', '已取消']
        this.form.group_status_name = groupStatusName[this.form.group_status]
        this.paymentData = [
          {
            name: this.$t('运费'),
            amount: res.data.payment.freight_amount,
            remark:
              '首费:' +
              res.data.payment.freights.first_freight_fee +
              ', 续费' +
              res.data.payment.freights.next_freight_fee +
              ', 附加费用' +
              res.data.payment.express_line_costs_amount
          },
          {
            name: this.$t('增值服务费'),
            amount: +res.data.payment.value_added_amount,
            remark: res.data.services.map(item => `${item.name}: ${item.price}`).join('，')
          },
          {
            name: this.$t('渠道服务费'),
            amount: +res.data.payment.line_service_fee,
            remark: res.data.payment.line_services
              .map(item => `${item.name}: ${item.price}`)
              .join('，')
          },
          {
            name: this.$t('渠道规则费'),
            amount: +res.data.payment.line_rule_fee,
            remark: res.data.payment.line_rules
              .map(item => `${item.name}: ${item.price}`)
              .join('，')
          },
          {
            name: this.$t('保险费用'),
            amount: +res.data.payment.insurance_fee,
            remark: ''
          },
          {
            name: this.$t('关税费用'),
            amount: +res.data.payment.tariff_fee,
            remark: ''
          },
          {
            name: this.$t('抵用券减免'),
            amount: +res.data.payment.coupon_amount,
            remark: ''
          },
          {
            name: this.$t('积分抵扣'),
            amount: +res.data.payment.point_amount,
            remark: ''
          },
          {
            name: this.$t('包裹增值服务'),
            amount: +res.data.payment.package_service_fee,
            remark: res.data.payment.package_services
              .map(item => `${item.name}:${item.price}`)
              .join('，')
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
        //如果是单箱出库
        if (this.form.box_type === 1) {
          this.boxData = [
            {
              id: 0,
              length: res.data.details.length,
              weight: res.data.details.actual_weight,
              height: res.data.details.height,
              width: res.data.details.width,
              volume_weight: res.data.details.volume_weight,
              logistics_sn: this.form.order_sn,
              sn: this.form.order_sn,
              packages: '全部一箱'
            }
          ]
        }
        //团购子订单
        if (this.form.group_buying_status && this.form.group_buying_status === 1) {
          this.form.status = 3
          this.form.status_name = '已打包'
        }
        switch (this.form.status) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            this.form.active = this.form.status - 1
            break
          case 6:
            this.form.active = 4
            break
          case 11:
          case 12:
            this.form.active = 2
            break
          case 19:
            this.form.active = 5
            break

          default:
            this.form.active = 0
            break
        }
        if (
          res.data.payment &&
          (res.data.payment.value_added_service || res.data.payment.line_services)
        ) {
          this.addedData = res.data.payment.value_added_service
          this.addedData.push(...res.data.payment.line_services)
        }
        if (this.form.is_parent === 1) this.loadGroupData(this.form.id)
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
    downloadInvoice() {
      this.$confirm(this.$t('是否确认导出'), this.$t('提示'), {
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
    getPurchaseSn() {
      // this.$request.purchaseSnDetail(this.$route.query.sn).then(res => {
      //   this.tableLoading = false
      //   this.form = res.data
      //   this.address = res.data.address
      //   this.baseMode = res.data.express_line.base_mode
      //   this.oderData = [{ ...res.data.details, box_type: res.data.box_type }]
      //   console.log(this.oderData, 'this.oderData')
      //   this.PackageData = res.data.packages
      //   this.services = res.data.services
      //   this.localization = res.localization
      //   if (res.data.picking_divide_order_id !== '') {
      //     this.picking_divide_order_id = res.data.picking_divide_order_id
      //     console.log(this.picking_divide_order_id)
      //     this.getPurchaseDetail()
      //   }
      //   if (res.data.pre_declare) {
      //     this.declare = res.data.pre_declare
      //   }
      //   let groupStatusName = ['进行中', '已结束', '已取消']
      //   this.form.group_status_name = groupStatusName[this.form.group_status]
      //   this.paymentData = [
      //     {
      //       name: this.$t('运费'),
      //       amount: res.data.payment.freight_amount,
      //       remark:
      //         '首费:' +
      //         res.data.payment.freights.first_freight_fee +
      //         ', 续费' +
      //         res.data.payment.freights.next_freight_fee +
      //         ', 附加费用' +
      //         res.data.payment.express_line_costs_amount
      //     },
      //     {
      //       name: this.$t('增值服务费'),
      //       amount: +res.data.payment.value_added_amount,
      //       remark: res.data.services.map(item => `${item.name}: ${item.price}`).join('，')
      //     },
      //     {
      //       name: this.$t('渠道服务费'),
      //       amount: +res.data.payment.line_service_fee,
      //       remark: res.data.payment.line_services
      //         .map(item => `${item.name}: ${item.price}`)
      //         .join('，')
      //     },
      //     {
      //       name: this.$t('渠道规则费'),
      //       amount: +res.data.payment.line_rule_fee,
      //       remark: res.data.payment.line_rules
      //         .map(item => `${item.name}: ${item.price}`)
      //         .join('，')
      //     },
      //     {
      //       name: this.$t('保险费用'),
      //       amount: +res.data.payment.insurance_fee,
      //       remark: ''
      //     },
      //     {
      //       name: this.$t('关税费用'),
      //       amount: +res.data.payment.tariff_fee,
      //       remark: ''
      //     },
      //     {
      //       name: this.$t('抵用券减免'),
      //       amount: +res.data.payment.coupon_amount,
      //       remark: ''
      //     },
      //     {
      //       name: this.$t('积分抵扣'),
      //       amount: +res.data.payment.point_amount,
      //       remark: ''
      //     },
      //     {
      //       name: this.$t('包裹增值服务'),
      //       amount: +res.data.payment.package_service_fee,
      //       remark: ''
      //     }
      //   ]
      //   this.TrackingData = [
      //     {
      //       context: '签收时间',
      //       ftime: res.data.signed_at
      //     },
      //     {
      //       context: '发货时间',
      //       ftime: res.data.shipped_at
      //     },
      //     {
      //       context: '支付时间',
      //       ftime: res.data.paid_at
      //     },
      //     {
      //       context: '打包时间',
      //       ftime: res.data.packed_at
      //     },
      //     {
      //       context: '提交时间',
      //       ftime: res.data.created_at
      //     }
      //   ]
      //   this.boxData = res.data.box
      //   this.userId = res.data.user_id
      //   //如果是单箱出库
      //   if (this.form.box_type === 1) {
      //     this.boxData = [
      //       {
      //         id: 0,
      //         length: res.data.details.length,
      //         weight: res.data.details.actual_weight,
      //         height: res.data.details.height,
      //         width: res.data.details.width,
      //         volume_weight: res.data.details.volume_weight,
      //         logistics_sn: this.form.order_sn,
      //         sn: this.form.order_sn,
      //         packages: '全部一箱'
      //       }
      //     ]
      //   }
      //   //团购子订单
      //   if (this.form.group_buying_status && this.form.group_buying_status === 1) {
      //     this.form.status = 3
      //     this.form.status_name = '已打包'
      //   }
      //   switch (this.form.status) {
      //     case 1:
      //     case 2:
      //     case 3:
      //     case 4:
      //     case 5:
      //       this.form.active = this.form.status - 1
      //       break
      //     case 6:
      //       this.form.active = 4
      //       break
      //     case 11:
      //       this.form.active = 2
      //       break
      //     case 19:
      //       this.form.active = 5
      //       break
      //     default:
      //       this.form.active = 0
      //       break
      //   }
      //   if (
      //     res.data.payment &&
      //     (res.data.payment.value_added_service || res.data.payment.line_services)
      //   ) {
      //     this.addedData = res.data.payment.value_added_service
      //     this.addedData.push(...res.data.payment.line_services)
      //   }
      //   if (this.form.is_parent === 1) this.loadGroupData(this.form.id)
      // })
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
          orderId: this.$route.params.id,
          state: 'multiBox'
        },
        () => {
          this.getList()
        }
      )
    },
    // 更改物流状态
    changeStatus() {
      let params = {
        order_ids: this.$route.params.id,
        is_member: Number(this.is_member)
      }
      if (this.modeData.map(item => item.id).includes(this.logist.logistics_type_id)) {
        params.logistics_type_id = this.logist.logistics_type_id
      } else {
        params.context = this.logist.logistics_type_id
      }
      this.$request.changeOrderStatus(params).then(res => {
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
    // 打包
    packed(id, order_sn, status, is_parent, line_id) {
      this.$router.push({
        name: 'billPacked',
        params: {
          id: id,
          order_sn: order_sn,
          activeName: status,
          parent: is_parent,
          lineId: line_id
        }
      })
    },
    // 待支付 编辑打包数据
    editPacked() {
      this.$router.push({
        name: 'editPacked',
        params: {
          id: this.form.id,
          activeName: this.form.status,
          parent: this.form.is_parent,
          lineId: this.form.express_line.id
        }
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
      this.countryList = []
    },
    // 更换收件人信息
    changeReceive() {
      this.getAddress()
      this.boxDialog = true
    },
    getPurchaseDetail() {
      this.$request.transportGoodList(this.picking_divide_order_id).then(res => {
        this.productData = res.data.map(item => {
          const name = item.p_goods.cn_name
          const qty = item.pack_quantity
          const material = item.p_goods.material
          const status_name = '无'
          const images = [item.p_goods.image]
          const unit_price = item.p_goods.purchase_price
          const express_num = '无'
          return {
            name,
            qty,
            material,
            status_name,
            images,
            unit_price,
            express_num
          }
        })
      })
    },
    // 编辑
    goEdit() {
      // this.unEdit = true
      this.dialogInfo = true
      this.getCountrys()
    },
    // 保存 编辑
    saveMsg() {
      this.$request
        .modifyReceive(this.$route.params.id, {
          receiver_name: this.address.receiver_name,
          street: this.address.street,
          door_no: this.address.door_no,
          phone: this.address.phone,
          timezone: this.address.timezone,
          city: this.address.city,
          postcode: this.address.postcode,
          address: this.address.address,
          clearance_code: this.address.clearance_code,
          wechat_id: this.address.wechat_id,
          country_id: this.countryList[0],
          area_id: this.countryList[1] || '',
          sub_area_id: this.countryList[2] || '',
          province: this.address.province,
          district: this.address.district,
          email: this.address.email
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('保存成功'),
              message: res.msg,
              type: 'success'
            })
            this.dialogInfo = false
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
    onRowChange(row) {
      this.chooseId = row.id
      this.user = row
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
    }
  }
}
</script>

<style lang="scss" scoped>
.bill-details-container {
  .container-center {
    margin-bottom: 20px;
  }
  .tools {
    float: right;
  }
  .choose {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  .info {
    margin-top: 20px;
  }
  .group-status-text,
  .weight-text {
    font-weight: bold;
    font-size: 15px;
    color: blue;
  }
  .pay-text {
    font-weight: bold;
    font-size: 15px;
    color: red;
  }
  .pay-type-text {
    font-weight: bold;
    font-size: 15px;
    color: #35a581;
  }
  .group-text {
    font-size: 16px;
    font-weight: bold;
    color: red;
  }
  .tabs {
    margin-top: 20px;
  }
  .address {
    font-size: 12px;
    padding: 0px;
    margin-bottom: 20px;
    table {
      clear: both;
      margin: 0px;
      padding: 0px;
      line-height: 35px;
      width: 99%;
      td {
        text-align: right;
        width: 15%;
        padding-right: 15px;
      }
      .part {
        width: 10% !important;
      }
      th {
        height: 35px;
        overflow: hidden;
        border-bottom: 1px solid #a8b7bf;
        font-weight: bold;
        text-align: left;
        width: 35%;
      }
    }
  }
  .address-tools {
    padding: 50px;
    text-align: center;
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
    width: 30%;
  }
  .add-sty {
    text-align: right;
  }
  .details-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
    .number-top {
      font-size: 14px;
      font-weight: 650;
    }
  }
  .panel-bg {
    background-color: white;
    padding: 20px;
    line-height: 35px;
    font-size: 13px;
    h4 {
      margin: 0px;
      padding: 0px;
    }
  }
  .package-details {
    background-color: #fff;
    padding: 30px 10px 10px 10px;
  }
  .review-package {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    line-height: 25px;
  }
  .small-text {
    font-size: 12px;
    color: #bcbcbc;
  }
  .small-price-text {
    font-size: 13px;
    color: red;
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
    font-size: 12px;
    text-align: center;
    // margin-top: 35px;
    position: relative;
    top: 15px;
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
  .flex-sty {
    display: flex;
    justify-content: space-between;
  }
  .label-sty {
    .el-form-item__label {
      width: 110px;
    }
  }
  .input-sty {
    width: 60%;
  }
  .declare-info {
    background: #fff;
    padding: 10px;
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>

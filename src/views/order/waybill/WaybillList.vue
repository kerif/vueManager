<template>
  <div class="way-list-container">
    <el-tabs v-model="activeName" class="tab-length" stretch @tab-click="onTabChange">
      <el-tab-pane :label="`${$t('全部')} (${countData.all || 0})`" name="0"></el-tab-pane>
      <el-tab-pane :label="`${$t('待处理')} (${countData.pending || 0})`" name="1"></el-tab-pane>
      <el-tab-pane :label="`${$t('待支付')} (${countData.paid || 0})`" name="2"></el-tab-pane>
      <el-tab-pane :label="`${$t('待发货')} (${countData.delivered || 0})`" name="3"></el-tab-pane>
      <el-tab-pane :label="`${$t('已发货')} (${countData.shipped || 0})`" name="4"></el-tab-pane>
      <el-tab-pane :label="`${$t('已签收')} (${countData.received || 0})`" name="5"></el-tab-pane>
      <el-tab-pane
        :label="`${$t('异常件')} (${countData.exceptional || 0})`"
        name="6"
      ></el-tab-pane>
      <el-tab-pane :label="`${$t('作废订单')} (${countData.invalid || 0})`" name="19"></el-tab-pane>
    </el-tabs>
    <waybill-list-search
      v-show="hasFilterCondition"
      :searchFieldData="searchFieldData"
      @info="getVal"
      v-on:submit="goMatch"
    ></waybill-list-search>
    <div class="header-range">
      <div v-if="oderData.length && ['1', '2', '3', '4', '5', '6'].includes(activeName)">
        <el-button class="btn-yellow" v-if="activeName === '1'" @click="oneBatch" size="small">{{
          $t('一键批量打包')
        }}</el-button>
        <el-button
          class="btn-deep-blue"
          v-if="activeName === '3'"
          size="small"
          @click="addInvoice(selectIDs)"
          style="margin-right: 10px"
          >{{ $t('加入发货单') }}</el-button
        >
        <el-dropdown v-if="['2', '4'].includes(activeName)" style="margin-right: 10px">
          <el-button class="btn-yellow" size="small">{{ $t('发送通知') }}</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="['2'].includes(activeName)" @click.native="orderUnpaidNotify">{{
              $t('订单待支付通知')
            }}</el-dropdown-item>
            <el-dropdown-item v-if="['4'].includes(activeName)" @click.native="goNotify(3)">
              {{ $t('已发货通知') }}
            </el-dropdown-item>
            <el-dropdown-item v-if="['4'].includes(activeName)" @click.native="goNotify(4)">
              {{ $t('待取件通知') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          class="btn-dark-green"
          v-if="activeName === '2'"
          size="small"
          @click="changeDelivery"
          >{{ $t('改成货到付款') }}</el-button
        >
        <el-dropdown v-if="['3', '4'].includes(activeName)" style="margin-right: 10px">
          <el-button size="small" class="btn-green">{{ $t('更新物流') }}</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="activeName === '4'" @click.native="updateTracking">{{
              $t('更新物流状态')
            }}</el-dropdown-item>
            <el-dropdown-item
              v-if="['3', '4'].includes(activeName)"
              @click.native="batchEditCompany"
            >
              {{ $t('更新物流单号二程') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="btn-blue-green" v-if="activeName === '2'" size="small" @click="isPaid"
          >{{ $t('改为已付款') }}
        </el-button>
        <el-button
          class="btn-blue-green"
          v-if="['3', '4', '5'].includes(activeName)"
          size="small"
          @click="payed"
          >{{ $t('改为已付款') }}
        </el-button>
        <el-button class="btn-purple" v-if="activeName === '4'" size="small" @click="signed"
          >{{ $t('改为已签收') }}
        </el-button>
        <el-button
          class="btn-light-red"
          size="small"
          v-if="['1', '2', '3', '4'].includes(activeName)"
          @click="goAbnormal"
        >
          {{ $t('转为异常件') }}
        </el-button>
        <el-button
          class="btn-purple"
          v-if="activeName === '6'"
          size="small"
          @click="handleException"
        >
          {{ $t('处理异常') }}
        </el-button>
        <el-button
          class="btn-deep-purple"
          v-if="['3', '4', '5'].includes(activeName)"
          size="small"
          @click="uploadInvoice(selectIDs)"
        >
          {{ $t('导出发票') }}
        </el-button>
      </div>
      <!-- <div
        style="margin-left: 5px"
        v-if="oderData.length && ['0', '1', '2', '3', '4', '5'].includes(activeName)"
      >
        <el-button @click="uploadList" size="small" type="success" plain>{{
          $t('导出清单')
        }}</el-button>
      </div> -->
      <div
        style="margin-left: 5px"
        v-if="oderData.length && ['0', '1', '2', '3', '4', '5', '6'].includes(activeName)"
      >
        <el-button size="small" type="success" @click="showTmpDrawer = true" plain>{{
          $t('导出清单')
        }}</el-button>
      </div>
      <div style="margin-left: 5px" v-if="['0', '1', '2', '3', '4', '5'].includes(activeName)">
        <el-button size="small" type="danger" @click="showDrawer = true" plain>{{
          $t('货量统计')
        }}</el-button>
      </div>
      <div class="header-search">
        <el-input
          class="header-keyword"
          v-model="searchFieldData.keyword"
          clearable
          :placeholder="$t('请输入')"
          size="medium"
          @keyup.enter.native="goMatch"
        >
          <el-button
            slot="append"
            @click="goMatch"
            :loading="$store.state.btnLoading"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <div class="filter">
          <el-button @click="onFilterChange" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
      </div>
      <el-popover
        popper-class="sort"
        placement="bottom"
        width="200"
        trigger="hover"
        @show="rowDrop"
      >
        <div>
          <el-checkbox-group
            v-model="sortResult"
            @change="changeSort"
            style="display: flex; flex-direction: column"
          >
            <el-checkbox
              v-for="item in checkColumn"
              :key="item.id"
              :label="item.id"
              style="padding: 5px 0; margin-right: 0; display: flex; align-items: center"
            >
              <div style="display: flex; align-items: center; justify-content: space-between">
                <div style="color: #000">{{ item.name }}</div>
                <i class="el-icon-rank"></i>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div style="padding-top: 10px; display: flex; justify-content: center">
          <el-button type="warning" size="mini" plain @click="remarkSort">{{
            $t('重置')
          }}</el-button>
          <el-button type="primary" size="mini" plain @click="saveSort">{{ $t('保存') }}</el-button>
        </div>
        <i slot="reference" class="el-icon-s-grid" style="cursor: pointer; color: #3540a5"> </i>
      </el-popover>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        row-key="id"
        class="waybill-data-list"
        current-row-key="id"
        border
        stripe
        v-loading="tableLoading"
        ref="table"
        @expand-change="exChange"
        :data="oderData"
        @selection-change="onSelectChange"
        height="calc(100vh - 270px)"
      >
        <el-table-column
          width="55"
          align="center"
          :type="['1', '2', '3', '4', '5', '6'].includes(activeName) ? 'selection' : 'index'"
          :key="['1', '2', '3', '4', '5', '6'].includes(activeName) ? 'selection' : 'index'"
        ></el-table-column>
        <template v-for="(item, idx) in checkColumn">
          <el-table-column
            :key="idx"
            :prop="item.idx"
            :label="item.name"
            v-if="item.checked"
            :width="item.width"
          >
            <template slot-scope="scope">
              <template v-if="item.id === 'order_sn'">
                <el-button @click="details(scope.row.id, activeName)" type="text">{{
                  scope.row.order_sn
                }}</el-button>
                <div
                  :title="$t('复制单号')"
                  class="copy-sty"
                  @click="copyNumber(scope.row.order_sn)"
                >
                  <i class="el-icon-copy-document"></i>
                </div>
                <el-button
                  type="text"
                  v-if="scope.row.is_parent === 1"
                  @click.native="groupBuy(scope.row)"
                >
                  <img class="group-sty" src="../../../assets/group.jpg"
                /></el-button>
                <span>
                  <el-button
                    style="color: red; font-weight: bolder"
                    type="text"
                    v-if="scope.row.status === 11"
                    @click.native="reviewPackage(scope.row.id)"
                    >{{ $t('待审核') }}</el-button
                  >
                  <router-link
                    v-if="scope.row.status === 12"
                    class="choose-order"
                    :to="`/order/review/?id=${scope.row.id}`"
                  >
                    {{ $t('审核拒绝') }}
                  </router-link>
                </span>
              </template>
              <template v-else-if="item.id === 'is_saved'">
                <span v-if="scope.row.is_saved === 1">{{ $t('待提交') }}</span>
                <span v-else></span>
              </template>
              <template v-else-if="item.id === 'status_name'">
                {{ scope.row.status_name }}
              </template>
              <template v-else-if="item.id === 'express_line'">
                {{ scope.row.express_line.cn_name }}
              </template>
              <template v-else-if="item.id === 'receiver_name'">
                {{ scope.row.address.receiver_name }}
              </template>
              <template v-else-if="item.id === 'country_name'">
                {{ scope.row.address.country_name }}
              </template>
              <template v-else-if="item.id === 'weight'">
                <span v-if="item.name === '预计重量' + localization.weight_unit">{{
                  scope.row.except_weight
                }}</span>
                <span v-else>{{ scope.row.actual_weight }}</span>
              </template>
              <template v-else-if="item.id === 'fee'">
                <span v-if="item.name === '预计费用' + localization.currency_unit">{{
                  scope.row.payment_fee
                }}</span>
                <span v-else>{{ scope.row.actual_payment_fee }}</span>
              </template>
              <template v-else-if="item.id === 'agent'">
                {{ scope.row.agent }}({{ scope.row.agent_commission }}%)
              </template>
              <template v-else-if="item.id === 'payment_type_name'">
                <div class="payment-sty" v-if="scope.row.payment_type_name === $t('货到付款')">
                  {{ scope.row.payment_type_name }}
                  <p v-if="scope.row.on_delivery_status === 2">({{ $t('已付款') }})</p>
                </div>
                <div v-else>
                  {{ scope.row.payment_type_name }}
                </div>
              </template>
              <template v-else-if="item.id === 'logistics_company'">
                {{ scope.row.shipment && scope.row.shipment.logistics_company }}&nbsp;
                {{ scope.row.shipment && scope.row.shipment.logistics_sn }}
              </template>
              <template v-else-if="item.id === 'logistics_sn'">
                {{ scope.row.logistics_company }}&nbsp;{{ scope.row.logistics_sn }}
              </template>
              <template v-else-if="item.id === 'updated_at'">
                <span v-if="activeName === '1'">{{ scope.row.created_at }}</span>
                <span v-else-if="activeName === '2'">{{ scope.row.created_at }}</span>
                <span v-else-if="activeName === '3'">{{ scope.row.paid_at }}</span>
                <span v-else-if="activeName === '4'">{{ scope.row.shipped_at }}</span>
                <span v-else>{{ scope.row.updated_at }}</span>
              </template>
              <template v-else-if="item.id === 'shipment_sn'">
                <span @click="goShip(scope.row.shipment_sn)" class="choose-order">
                  {{ scope.row.shipment_sn }}
                </span>
              </template>
              <template v-else-if="item.id === 'exceptional_at'">
                <span>{{ scope.row.exceptional_at }}</span>
              </template>
              <template v-else-if="item.id === 'exceptional_operator'">
                <span>{{ scope.row.exceptional_operator }}</span>
              </template>
              <template v-else-if="item.id === 'address_type'">
                <span>{{ scope.row.address_type }}</span>
                <!-- <span v-if="scope.row.station_name !== ''">--{{ scope.row.station_name }}</span> -->
              </template>
              <template v-else-if="item.id === 'boxes_count'">
                <span>{{ scope.row.boxes_count }}</span>
              </template>
              <template v-else>{{ scope.row[item.id] }}</template>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          v-if="activeName !== '0'"
          key="operator"
          :label="$t('操作')"
          fixed="right"
          width="116px"
        >
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" plain>
                {{ $t('操作') }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="
                    (activeName === '2' && scope.row.status === 11) ||
                    ((activeName === '3' || activeName === '4') &&
                      scope.row.on_delivery_status === 11)
                  "
                  @click.native="reviewPackage(scope.row.id)"
                >
                  {{ $t('审核') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="activeName === '2'"
                  @click.native="
                    editPacked(
                      scope.row.id,
                      activeName,
                      scope.row.is_parent,
                      scope.row.express_line.id
                    )
                  "
                >
                  {{ $t('编辑') }}
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="
                    activeName === '1' &&
                    (scope.row.group_buying_status === 0 || scope.row.group_buying_status === 1)
                  "
                  @click.native="
                    packed(
                      scope.row.id,
                      scope.row.order_sn,
                      scope.row.is_parent,
                      activeName,
                      scope.row.express_line.id
                    )
                  "
                >
                  {{ $t('打包') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="activeName === '3'"
                  @click.native="addInvoice([scope.row.id])"
                >
                  {{ $t('加入发货单') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="activeName === '3' || activeName === '4'"
                  @click.native="multiLogisticsDialog(scope.row.id)"
                >
                  {{ $t('更新多箱物流') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="activeName === '3' && scope.row.shipment_sn"
                  @click.native="removeShip(scope.row.id)"
                  >{{ $t('移除发货单') }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="scope.row.is_parent === 1"
                  @click.native="groupBuy(scope.row)"
                >
                  {{ $t('团购') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="['1', '2', '3'].includes(activeName)"
                  @click.native="
                    invalidOrder(
                      scope.row.id,
                      activeName,
                      scope.row.pay_amount,
                      scope.row.payment_type_name,
                      scope.row.is_parent
                    )
                  "
                >
                  {{ $t('作废') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="
                    ((activeName === '2' ||
                      scope.row.on_delivery_status === 1 ||
                      scope.row.on_delivery_status === 12) &&
                      scope.row.is_parent === 0) ||
                    (activeName === '2' && scope.row.is_parent === 1 && scope.row.group_mode)
                  "
                  @click.native="
                    changePrice(scope.row.id, scope.row.order_sn, scope.row.actual_payment_fee)
                  "
                >
                  {{ $t('改价') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="['2', '3', '4', '5', '6'].includes(activeName)"
                  @click.native="onLogs(scope.row.id)"
                >
                  {{ $t('日志') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="activeName === '6'"
                  @click.native="operateLog(scope.row.id)"
                >
                  {{ $t('异常说明') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="activeName === '4'"
                  @click.native="logistics(scope.row.id, scope.row.order_sn)"
                >
                  {{ $t('轨迹') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="activeName === '3' && !scope.row.disabled"
                  @click.native="saveLogistics(scope.row)"
                >
                  {{ $t('保存') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="activeName === '3' && !scope.row.disabled"
                  @click.native="cancel(scope.row)"
                >
                  {{ $t('取消') }}
                </el-dropdown-item>
                <el-button v-if="activeName === '19'" @click.native="checkInvalid(scope.row.id)">
                  {{ $t('日志') }}
                </el-button>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- 二级分类列表 -->
        <el-table-column
          class-name="expand-class"
          type="expand"
          key="expand"
          width="1"
          v-if="activeName !== 0"
        >
          <template slot-scope="props">
            <el-table :data="props.row.secondData" class="expand-table">
              <!-- 客户ID -->
              <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
              <el-table-column :label="$t('用户名')" prop="user_name"></el-table-column>
              <!-- 订单号 -->
              <el-table-column :label="$t('订单号')">
                <template slot-scope="scope">
                  <router-link
                    class="choose-order"
                    :to="`/order/billDetails/${scope.row.id}/${scope.row.status}`"
                  >
                    {{ scope.row.order_sn }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('打包状态')" v-if="activeName === '1'">
                <template slot-scope="scope">
                  <div class="no-package" v-if="scope.row.group_buying_status === 0">
                    {{ $t('未打包') }}
                  </div>
                  <div class="packaged" v-if="scope.row.group_buying_status === 1">
                    {{ $t('已打包') }}
                  </div>
                </template>
              </el-table-column>
              <!-- 支付状态 -->
              <el-table-column :label="$t('支付状态')" v-if="activeName === '2'">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 3" class="packaged">{{ $t('已支付') }}</span>
                  <el-button
                    type="text"
                    v-if="scope.row.status === 11"
                    @click.native="reviewPackage(scope.row.id)"
                    >{{ $t('待审核') }}</el-button
                  >
                  <router-link
                    v-if="scope.row.status === 12"
                    class="choose-order"
                    :to="`/order/review/?id=${scope.row.id}`"
                  >
                    {{ $t('审核拒绝') }}
                  </router-link>
                </template>
              </el-table-column>
              <!-- 转运快递单号 -->
              <el-table-column
                :label="$t('头程物流信息')"
                v-if="['3', '4', '5', '19'].includes(activeName)"
              >
                <template slot-scope="scope">
                  <span
                    >{{ scope.row.shipment && scope.row.shipment.logistics_company }}&nbsp;{{
                      scope.row.shipment && scope.row.shipment.logistics_sn
                    }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('二程物流信息')"
                v-if="['3', '4', '5', '19'].includes(activeName)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.logistics_company }}&nbsp;{{ scope.row.logistics_sn }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('线路名称')" prop="express_line.cn_name">
              </el-table-column>
              <el-table-column :label="$t('收货人')" prop="address.receiver_name"></el-table-column>
              <el-table-column
                :label="$t('收货国家地区')"
                prop="address.country_name"
              ></el-table-column>
              <el-table-column :label="$t('包裹数与件数')">
                <template slot-scope="scope">
                  <span>{{ scope.row.package_count }}（{{ scope.row.number }}）</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="
                  activeName === '1'
                    ? $t('预计重量') + localization.weight_unit
                    : $t('实际重量') + localization.weight_unit
                "
                :prop="activeName === '1' ? 'except_weight' : 'actual_weight'"
              ></el-table-column>
              <!-- 详见产品图 -->
              <el-table-column
                :label="
                  activeName === '1'
                    ? $t('预计费用') + localization.currency_unit
                    : $t('实际费用') + localization.currency_unit
                "
                :prop="activeName === '1' ? 'payment_fee' : 'actual_payment_fee'"
              ></el-table-column>
              <el-table-column
                :label="$t('申报价值') + localization.currency_unit"
                prop="declare_value"
              ></el-table-column>
              <!-- 支付方式 -->
              <el-table-column :label="$t('支付方式')" v-if="['3', '4', '5'].includes(activeName)">
                <template slot-scope="scope">
                  <span class="payment-sty" v-if="scope.row.payment_type_name === '货到付款'">{{
                    scope.row.payment_type_name
                  }}</span>
                  <span v-else>{{ scope.row.payment_type_name }}</span>
                </template>
              </el-table-column>
              <!-- 抵用券金额 -->
              <el-table-column
                :label="$t('抵用券金额') + localization.currency_unit"
                v-if="['3', '4', '5'].includes(activeName)"
                prop="coupon_amount"
              >
              </el-table-column>
              <!-- 增值服务金额 -->
              <el-table-column
                :label="$t('增值服务金额') + localization.currency_unit"
                v-if="['3', '4', '5'].includes(activeName)"
                prop="value_added_amount"
              >
              </el-table-column>
              <!-- 所属代理 -->
              <el-table-column
                :label="$t('所属代理')"
                prop="agent + agent_commission"
                width="100px"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.agent }}</span>
                  <span>({{ scope.row.agent_commission }}%)</span>
                </template>
              </el-table-column>
              <!-- 提交时间 -->
              <el-table-column
                :label="$t('提交时间')"
                v-if="['1', '2', '3', '4'].includes(activeName)"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.created_at }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('拣货时间')"
                prop="packed_at"
                v-if="activeName === '2' || activeName === '3'"
              ></el-table-column>
              <el-table-column :label="$t('签收时间')" v-if="activeName === '5'">
                <template slot-scope="scope">
                  <span>{{ scope.row.updated_at }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('所属发货单')"
                v-if="['3', '4', '5'].includes(activeName)"
              >
                <template slot-scope="scope">
                  <span @click="goShip(scope.row.shipment_sn)" class="choose-order">{{
                    scope.row.shipment_sn
                  }}</span>
                </template>
              </el-table-column>
              <!-- 二级操作栏 -->
              <el-table-column :label="$t('操作')" width="116px">
                <template slot-scope="scope">
                  <el-dropdown>
                    <el-button type="primary" plain>
                      {{ $t('操作') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        class="item-sty"
                        @click.native="details(scope.row.id, activeName)"
                      >
                        <span>{{ $t('详情') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        class="item-sty"
                        @click.native="reviewPackage(scope.row.id)"
                      >
                        <span
                          v-if="
                            (activeName === '2' && scope.row.status === 11) ||
                            ((activeName === '3' || activeName === '4') &&
                              scope.row.on_delivery_status === 11)
                          "
                          >{{ $t('审核') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        class="item-sty"
                        @click.native="
                          editPacked(
                            scope.row.id,
                            activeName,
                            scope.row.is_parent,
                            scope.row.express_line.id
                          )
                        "
                      >
                        <span v-if="activeName === '1' && scope.row.group_buying_status === 1"
                          >{{ $t('编辑') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        class="item-sty"
                        @click.native="
                          packed(
                            scope.row.id,
                            scope.row.order_sn,
                            scope.row.is_parent,
                            activeName,
                            scope.row.express_line.id
                          )
                        "
                      >
                        <span v-if="activeName === '1' && scope.row.group_buying_status === 0">{{
                          $t('打包')
                        }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item class="item-sty" @click.native="getLabel(scope.row.id)">
                        <span size="small" v-if="activeName === '3'">{{ $t('打印标签') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item class="item-sty" @click.native="addCompany(scope.row.id)">
                        <span size="small" v-if="activeName === '3'">{{ $t('添加物流信息') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        class="item-sty"
                        @click.native="multiLogisticsDialog(scope.row.id)"
                      >
                        <span size="small" v-if="activeName === '3' || activeName === '4'">{{
                          $t('更新多箱物流')
                        }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item class="item-sty">
                        <span
                          @click="
                            invalidOrder(
                              scope.row.id,
                              activeName,
                              scope.row.pay_amount,
                              scope.row.payment_type_name
                            )
                          "
                          v-if="['1', '2', '3'].includes(activeName)"
                          >{{ $t('作废') }}</span
                        >
                      </el-dropdown-item>
                      <el-dropdown-item
                        class="item-sty"
                        @click.native="
                          changePrice(
                            scope.row.id,
                            scope.row.order_sn,
                            scope.row.actual_payment_fee
                          )
                        "
                      >
                        <span v-if="activeName === '2' || scope.row.on_delivery_status === 1">{{
                          $t('改价')
                        }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item class="item-sty" @click.native="onLogs(scope.row.id)">
                        <span size="small" v-if="['2', '3', '4', '5'].includes(activeName)"
                          >{{ $t('订单日志') }}
                        </span>
                      </el-dropdown-item>
                      <el-dropdown-item class="item-sty" @click.native="editCompany(scope.row.id)">
                        <span size="small" v-if="['3', '4'].includes(activeName)">{{
                          $t('修改物流信息')
                        }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        class="item-sty"
                        @click.native="logistics(scope.row.id, scope.row.order_sn)"
                      >
                        <span v-if="activeName === '4'">{{ $t('轨迹') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item class="item-sty" @click.native="checkInvalid(scope.row.id)">
                        <span v-if="activeName === '19'">{{ $t('日志') }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination
        style="margin-top: 5px"
        :pageParams="page_params"
        :notNeedInitQuery="false"
        saveSize="order"
      >
        <div class="remark-text">
          <span>{{ $t('总实际重量') }}:</span><span>{{ sumData.weight }} KG</span>
        </div>
      </nle-pagination>
    </div>
    <el-dialog :visible.sync="show" :title="$t('预览打印标签')" class="props-dialog" width="45%">
      <div class="dialog-sty">
        <iframe class="iframe" :src="urlHtml"></iframe>
      </div>
      <div slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="updateLabel">{{ $t('下载') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="trackDialog" width="30%" :title="$t('更新物流状态')" @close="clear">
      <el-form label-position="top" :model="form" ref="form">
        <el-form-item :label="$t('物流状态')">
          <el-select
            v-model="form.logistics_type_id"
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
    <!-- 轨迹 -->
    <el-dialog :visible.sync="showDialog" width="45%" :title="$t('轨迹')" @close="clearSn">
      <div class="table-sty">{{ $t('发货单号') }}{{ this.tableSn }}</div>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column :label="$t('物流轨迹')" prop="context"></el-table-column>
        <el-table-column :label="$t('时间')" prop="created_at"></el-table-column>
        <el-table-column :label="$t('操作人')" prop="operator"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-light-red" @click="deleteTable(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 改价 -->
    <el-dialog :visible.sync="priceDialog" width="35%" :title="$t('改价')" @close="clearPrice">
      <div class="table-sty">{{ $t('订单号') }}{{ this.priceSn }}</div>
      <el-form :model="priceForm" ref="form">
        <el-form-item :label="$t('最终价格') + localization.currency_unit">
          <el-input v-model="priceForm.actual_payment_fee"></el-input>
        </el-form-item>
        <el-form-item :label="$t('备注')">
          <el-input
            type="textarea"
            v-model="priceForm.remark"
            :autosize="{
              minRows: 2,
              maxRows: 4
            }"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="change-sty">
        <p>
          {{ $t('您的改价操作记录将会保存在日志记录中') }}
        </p>
      </div>
      <div slot="footer">
        <el-button @click="priceDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitPrice">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 一键批量打包 -->
    <el-dialog :visible.sync="boxDialog" :title="$t('一键批量打包')" width="80%">
      <div class="add-box">
        <!-- 一键将预计重量改成实际重量 -->
        <!-- <el-tooltip
          :content="
            $t(
              '一键更改数据时，如订单中包裹数量大于1，计算方式为该订单中所有包裹重量直接相加，数据误差较大时请手动更改'
            )
          "
          placement="top"
        >
          <el-button @click="changeWeight">{{ $t('一键将预计重量改成实际重量') }}</el-button>
        </el-tooltip> -->
        <!-- <el-tooltip
          :content="
            $t(
              '一键更改数据时，如订单中包裹数量大于1，计算方式为该订单中所有包裹体积重量相加，数据误差较大时请手动更改'
            )
          "
          placement="top"
        >
          <el-button @click="changeVolume">{{
            $t('一键将预计体积重量设为实际体积重量')
          }}</el-button>
        </el-tooltip> -->
        <el-button @click="goCreated">{{ $t('批量改支付方式') }}</el-button>
      </div>
      <el-table :data="boxDialogData" border style="width: 100%">
        <el-table-column prop="user_id" :label="$t('客户ID')"> </el-table-column>
        <el-table-column prop="order_sn" :label="$t('订单号')"> </el-table-column>
        <el-table-column prop="express_line.cn_name" :label="$t('线路名称')"> </el-table-column>
        <el-table-column :label="$t('支付方式')">
          <template slot-scope="scope">
            <span class="payment-sty" v-if="scope.row.payment_mode === 2">{{
              $t('货到付款')
            }}</span>
            <span v-else>{{ $t('预付') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="package_count" :label="$t('包裹数量')"> </el-table-column>
        <el-table-column prop="boxes_count" :label="$t('出库箱数')"></el-table-column>
        <el-table-column prop="except_package_weight" :label="$t('实际重量')"></el-table-column>
        <el-table-column
          prop="except_package_volume_weight"
          :label="$t('体积重量')"
        ></el-table-column>
        <!-- <el-table-column prop="except_weight" :label="$t('预计重量') + localization.weight_unit">
        </el-table-column>
        <el-table-column :label="$t('实际重量') + localization.weight_unit">
          <template slot-scope="scope">
            <el-input v-model="scope.row.actual_weight"></el-input>
          </template>
        </el-table-column> -->
        <!-- 实际体积重量 -->
        <!-- <el-table-column>
          <template slot-scope="scope">
            <el-input v-model="scope.row.volume_weight"></el-input>
          </template>
          <template slot="header">
            <span>{{ $t('实际体积重量') }}{{ localization.weight_unit }}</span>
            <el-tooltip placement="top">
              <span slot="content">
                <span>
                  {{ $t('如有合箱操作请勿填写此项填入实际尺寸即可') }}
                </span>
              </span>
              <i class="el-icon-question" style="font-size: 18px; color: '#35B85A'"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('实际尺寸') + localization.length_unit" width="200px">
          <template slot-scope="scope">
            <el-input
              class="dialog-input"
              :placeholder="$t('长')"
              v-model="scope.row.exceptLength"
            ></el-input>
            <el-input
              class="dialog-input"
              :placeholder="$t('宽')"
              v-model="scope.row.exceptWidth"
            ></el-input>
            <el-input
              class="dialog-input"
              :placeholder="$t('高')"
              v-model="scope.row.exceptHeight"
            ></el-input>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-light-red" @click="deleteTrack(scope.$index, boxDialogData)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item :label="$t('统一备注')">
          <el-input
            type="textarea"
            :autosize="{
              minRows: 4,
              maxRows: 6
            }"
            :placeholder="$t('请输入内容')"
            v-model="batch.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="boxDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmPack">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 批量更改支付方式 -->
    <el-dialog
      :visible.sync="innerVisible"
      :title="$t('批量更改支付方式')"
      width="45%"
      @close="clearPayment"
      append-to-body
    >
      <el-form ref="ruleForm" class="demo-form-inline" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="10">
            <!-- 员工组中文名 -->
            <el-form-item :label="$t('支付方式')">
              <el-select v-model="payment_mode" :placeholder="$t('请选择')" filterable>
                <el-option
                  v-for="item in payMode"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="returnShip"> {{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmCreated">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 日志 -->
    <el-dialog :visible.sync="invalidLog" :title="$t('作废日志')" width="45%">
      <el-table :data="invalidData" style="width: 100%">
        <el-table-column :label="$t('图片')">
          <template slot-scope="scope">
            <span
              v-for="(ele, index) in scope.row.images"
              :key="index"
              style="cursor: pointer"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${ele}`), (imgVisible = true)"
            >
              <img :src="`${$baseUrl.IMAGE_URL}${ele}`" class="product-img" />
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作日志')" prop="remark"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
    <!-- 导出清单 -->
    <el-dialog :title="$t('导出清单')" :visible.sync="dialogPackages" width="40%">
      <div class="excel-date">
        <el-radio :label="1" v-model="uploadRadio">{{ $t('导出清单含包裹信息') }}</el-radio>
        <el-radio :label="2" v-model="uploadRadio">{{ $t('导出清单') }}</el-radio>
        <el-radio :label="3" v-model="uploadRadio">{{ $t('美中国际定制') }}</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPackages = false" class="cancel-btn">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="updatePackages" :loading="$store.state.btnLoading">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showExplain" :title="$t('异常说明')" class="abnormalLog-container">
      <div style="margin: 10px 0">
        <el-row :gutter="20">
          <el-col :span="4">{{ $t('操作人') }}</el-col>
          <el-col :span="20">{{ operator }}</el-col>
        </el-row>
      </div>
      <div style="margin: 10px 0">
        <el-row :gutter="20">
          <el-col :span="4">{{ $t('备注') }}</el-col>
          <el-col :span="20">{{ remark }}</el-col>
        </el-row>
      </div>
      <div style="margin: 10px 0">
        <el-row :gutter="20">
          <el-col :span="4">{{ $t('恢复备注') }}</el-col>
          <el-col :span="20">{{ restoreRemark }}</el-col>
        </el-row>
      </div>
      <div style="margin: 10px 0">
        <el-row :gutter="20">
          <el-col :span="4">{{ $t('图片') }}</el-col>
          <el-col :span="20">
            <span
              v-for="(item, index) in images"
              :key="index"
              style="cursor: pointer"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
            >
              <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 150px; margin-right: 30px" />
            </span>
          </el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button @click="showExplain = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmExcept">{{ $t('去处理') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showHandExcept" :title="$t('处理异常')" @close="clearFinish">
      <el-form :model="ruleForm" ref="ruleForm">
        <el-form-item :label="$t('处理说明')">
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="$t('请输入处理说明')"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="ruleForm.textarea"
            class="text"
          >
          </el-input>
        </el-form-item>
        <div class="remark">{{ $t('注：处理完成后，订单将恢复到异常前的状态，继续正常流转') }}</div>
      </el-form>
      <div slot="footer">
        <el-button @click="showHandExcept = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmFinish">{{ $t('处理完成') }}</el-button>
      </div>
    </el-dialog>
    <!-- 货量统计 -->
    <waybill-list-drawer
      :showDrawer="showDrawer"
      :searchFieldData="searchFieldData"
      :activeName="activeName"
      :tag="keyData"
      @receive="receive"
    ></waybill-list-drawer>
    <!-- 导出清单抽屉 -->
    <waybill-list-tmp-drawer
      :showTmpDrawer="showTmpDrawer"
      :searchFieldData="searchFieldData"
      :uploadType="uploadType"
      :activeName="activeName"
      @receiveTmp="receiveTmp"
      class="tmp"
    ></waybill-list-tmp-drawer>
    <abnormal :showAbnormal="showAbnormal" :selectIDs="selectIDs" @passVal="passVal"></abnormal>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import WaybillListSearch from './components/waybillListSearch'
import WaybillListDrawer from './components/waybillListDrawer'
import WaybillListTmpDrawer from './components/waybillListTmpDrawer'
import Abnormal from './components/abnormal'
import columnData from '../../../utils/sortData.js'
import Sortable from 'sortablejs'
export default {
  components: {
    WaybillListSearch,
    WaybillListDrawer,
    WaybillListTmpDrawer,
    NlePagination,
    Abnormal
  },
  mixins: [pagination],
  name: 'wayBillList',
  data() {
    return {
      tableColumn: [],
      checkColumn: [],
      sortResult: [],
      timeList: [],
      uploadRadio: 1,
      sumData: {},
      packed_end_date: '',
      activeName: '1',
      oderData: [],
      secondData: [],
      localization: {
        weight_unit: '',
        currency_unit: ''
      },
      selectIDs: [],
      agent_name: '',
      payment_type: '',
      pay_delivery: '',
      tableLoading: false,
      countData: {},
      urlImport: '',
      urlHtml: '',
      show: false,
      labelId: '',
      modeData: [],
      trackDialog: false,
      priceDialog: false,
      priceForm: {
        actual_payment_fee: '',
        remark: ''
      },
      form: {
        logistics_type_id: ''
      },
      showDialog: false,
      expands: [],
      tableData: [],
      tableId: '',
      tableSn: '',
      priceSn: '',
      priceId: '',
      boxDialog: false,
      innerVisible: false,
      countryData: [],
      boxDialogData: [],
      payment_mode: '',
      payMode: [
        {
          id: 1,
          name: this.$t('预付')
        },
        {
          id: 2,
          name: this.$t('货到付款')
        }
      ],
      batch: {
        remark: ''
      },
      createdIds: [],
      invalidData: [],
      invalidLog: false,
      invalidId: '',
      imgVisible: false,
      imgSrc: '',
      dialogFilter: false,
      filterForm: {
        start: '',
        end: ''
      },
      secondExpands: {},
      dialogPackages: false,
      paramsData: {},
      searchFieldData: {
        express_line_id: '',
        payment_type: '',
        agent: '',
        begin_date: '',
        end_date: '',
        pay_delivery: '',
        date_type: '',
        order_sn: '',
        date: [],
        value_type: '',
        value_begin: '',
        value_end: '',
        receive_type: '',
        countryArr: [],
        country_id: '',
        station: '',
        keyword: ''
      },
      hasFilterCondition: false,
      page_params: {
        size: 20
      },
      type: '',
      box: [],
      user_id: '',
      order_sn: '',
      actual_payment_fee: '',
      orderInfo: '',
      selectUserID: [],
      user_name: '',
      status: '',
      id: '',
      showDrawer: false,
      showTmpDrawer: false,
      keyData: {},
      lineId: '',
      uploadType: 2,
      sortDialog: false,
      showAbnormal: false,
      showHandExcept: false,
      logId: '',
      showExplain: false,
      operator: '',
      remark: '',
      restoreRemark: '',
      images: [],
      ruleForm: {
        textarea: ''
      }
    }
  },
  activated() {
    this.initQuery()
  },
  created() {
    this.getOrderFieldList()
    this.getCounts()
    this.initQuery()
  },
  methods: {
    // 获取排序模板
    getTemplateColumn() {
      this.tableLoading = true
      this.$request.getTemplateColumn('ORDER').then(res => {
        if (res.ret) {
          if (res.data) {
            this.tableColumn = res.data.filed.map(item => ({
              id: item.id,
              name: item.name,
              width: item.width,
              checked: Boolean(+item.checked)
            }))
          } else {
            this.tableColumn = JSON.parse(JSON.stringify(columnData))
          }
          this.localization = res.localization
          this.handleColumn()
        }
      })
    },
    handleColumn() {
      const column = [
        'user_id',
        'user_name',
        'order_sn',
        'express_line',
        'receiver_name',
        'country_name',
        'address_type',
        'package_count',
        'declare_value',
        'agent',
        'sale_name',
        'customer_name',
        'weight',
        'fee'
      ]
      this.checkColumn = []
      this.tableColumn.forEach(item => {
        if (item.id === 'weight') {
          item.name = this.$t('实际重量') + this.localization.weight_unit
        }
        if (item.id === 'fee') {
          item.name = this.$t('实际费用') + this.localization.currency_unit
        }
        if (item.id === 'declare_value') {
          item.name = this.$t('申报价值') + this.localization.currency_unit
        }
        switch (this.activeName) {
          case '0':
            if ([...column].includes(item.id)) {
              this.checkColumn.push(item)
            }
            break
          case '1':
            if (item.id === 'weight') {
              item.name = this.$t('预计重量') + this.localization.weight_unit
            }
            if (item.id === 'fee') {
              item.name = this.$t('预计费用') + this.localization.currency_unit
            }
            if (item.id === 'updated_at') {
              item.name = this.timeLabel
            }
            if ([...column, 'is_saved', 'updated_at'].includes(item.id)) {
              this.checkColumn.push(item)
            }
            break
          case '2':
            if (item.id === 'updated_at') {
              item.name = this.timeLabel
            }
            if ([...column, 'updated_at', 'packed_at', 'boxes_count'].includes(item.id)) {
              this.checkColumn.push(item)
            }
            break
          case '3':
            if (item.id === 'updated_at') {
              item.name = this.timeLabel
            }
            if (
              [
                ...column,
                'payment_type_name',
                'logistics_company',
                'logistics_sn',
                'coupon_amount',
                'updated_at',
                'packed_at',
                'shipment_sn',
                'boxes_count'
              ].includes(item.id)
            ) {
              this.checkColumn.push(item)
            }
            break
          case '4':
            if (item.id === 'updated_at') {
              item.name = this.timeLabel
            }
            if (
              [
                ...column,
                'payment_type_name',
                'logistics_company',
                'logistics_sn',
                'coupon_amount',
                'updated_at',
                'shipment_sn',
                'boxes_count'
              ].includes(item.id)
            ) {
              this.checkColumn.push(item)
            }
            break
          case '5':
            if (
              [
                ...column,
                'payment_type_name',
                'logistics_company',
                'logistics_sn',
                'coupon_amount',
                'signed_at',
                'shipment_sn'
              ].includes(item.id)
            ) {
              this.checkColumn.push(item)
            }
            break
          case '6':
            if (item.id === 'weight') {
              item.name = this.$t('预计重量') + this.localization.weight_unit
            }
            if (item.id === 'fee') {
              item.name = this.$t('预计费用') + this.localization.currency_unit
            }
            if (item.id === 'updated_at') {
              item.name = this.timeLabel
            }
            if (
              [
                ...column,
                'status_name',
                'updated_at',
                'payment_type_name',
                'logistics_company',
                'logistics_sn',
                'coupon_amount',
                'packed_at',
                'exceptional_at',
                'exceptional_operator',
                'shipment_sn'
              ].includes(item.id)
            ) {
              this.checkColumn.push(item)
            }
            break
          case '19':
            if ([...column, 'logistics_company', 'logistics_sn'].includes(item.id)) {
              this.checkColumn.push(item)
            }
            break
          default:
            break
        }
      })
      this.checkColumn.forEach(item => {
        if (item.checked) {
          if (!this.sortResult.includes(item.id)) {
            this.sortResult.push(item.id)
          }
        }
      })
      this.getList()
    },
    changeSort() {
      this.checkColumn.forEach(item => {
        if (!this.sortResult.includes(item.id)) {
          item.checked = false
        } else {
          item.checked = true
        }
      })
    },
    rowDrop() {
      const tbody = document.querySelector('.el-checkbox-group')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (newIndex === oldIndex) return false
          const oldField = this.checkColumn[oldIndex].id
          const newField = this.checkColumn[newIndex].id
          const oldTabIndex = this.tableColumn.findIndex(item => item.id === oldField)
          const newTabIndex = this.tableColumn.findIndex(item => item.id === newField)
          const item = this.tableColumn.splice(oldTabIndex, 1)[0]
          this.tableColumn.splice(newTabIndex, 0, item)
          const columnItem = this.checkColumn.splice(oldIndex, 1)[0]
          this.checkColumn.splice(newIndex, 0, columnItem)
          this.getList()
        }
      })
    },
    saveSort() {
      const params = this.tableColumn.map((item, idx) => ({
        ...item,
        checked: item.checked ? 1 : 0,
        sort_id: idx + 1
      }))
      this.$request.updateTemplate('ORDER', { filed: params }).then(res => {
        if (res.ret) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    remarkSort() {
      this.tableColumn = JSON.parse(JSON.stringify(columnData))
      this.handleColumn()
    },
    initQuery() {
      if (this.$route.query.activeName) {
        this.activeName = this.$route.query.activeName
      }
      if (localStorage.getItem('order_size')) {
        this.page_params.size = Number(localStorage.getItem('order_size'))
      }
      if (this.$route.query.order_sn) {
        this.searchFieldData.keyword = this.$route.query.order_sn
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, order_sn: '' }
        })
      }
      this.getTemplateColumn()
      this.getCounts()
    },
    // 货量统计
    receive() {
      this.showDrawer = false
    },
    receiveTmp() {
      this.showTmpDrawer = false
    },
    passVal() {
      this.showAbnormal = false
    },
    getOrderFieldList() {
      this.$request.getOrderFieldList().then(res => {
        this.orderFieldList = res.data
      })
    },
    confirmFinish() {
      let params = {
        restore_remark: this.ruleForm.textarea
      }
      if (this.logId) {
        this.selectIDs = []
        params.ids = [this.logId]
      } else {
        params.ids = this.selectIDs
      }
      this.$request.restoreOrder(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.showHandExcept = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clearFinish() {
      this.showHandExcept = false
      this.ruleForm.textarea = ''
    },
    toogleExpand(row) {
      let $table = this.$refs.table
      $table.toggleRowExpansion(row)
    },
    onFilterChange() {
      this.hasFilterCondition = !this.hasFilterCondition
    },
    searchSubmit() {
      this.getList()
    },
    groupBuy(row, flag = true) {
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (flag) {
        this.toogleExpand(row)
      }
      if (row.secondData.length) return
      let id = row.id
      this.$request.orderSecond(id).then(res => {
        if (res.ret) {
          row.secondData = res.data.map(item => {
            return {
              ...item
            }
          })
        }
      })
    },
    getList() {
      this.tableLoading = true
      const params = this.computedParams()
      this.$request.getOrder(params).then(res => {
        if (res.ret) {
          this.tableLoading = false
          // 待发货列表的转运快递单号添加
          this.oderData = res.data.map(item => {
            return {
              ...item,
              secondData: []
            }
          })
          this.oderData.forEach(item => {
            item.disabled = true
            item.copySN = item.logistics_sn
            if (this.expands.includes(item.id)) {
              this.groupBuy(item, false)
            }
          })
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.sumData = res.sum
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 导出清单
    uploadList() {
      this.dialogPackages = true
    },
    computedParams() {
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.activeName === '6' ? 999 : this.activeName,
        keyword: this.searchFieldData.keyword
      }
      if (this.hasFilterCondition) {
        const searchData = this.searchFieldData
        params = {
          ...params,
          ...searchData,
          begin_date: searchData.date ? searchData.date[0] : '',
          end_date: searchData.date ? searchData.date[1] : '',
          order_sn: searchData.order_sn.split(/[(\r\n)\r\n]+/),
          country_id:
            searchData.countryArr.length > 1
              ? searchData.countryArr[0]
              : searchData.countryArr[searchData.countryArr.length - 1],
          area_id:
            searchData.countryArr.length > 1
              ? searchData.countryArr[searchData.countryArr.length - 1]
              : ''
        }
      }
      return params
    },
    updatePackages() {
      const searchData = this.searchFieldData
      let params = {
        ...searchData,
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.activeName === '6' ? 999 : this.activeName,
        keyword: this.searchFieldData.keyword,
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : '',
        order_sn: searchData.order_sn.split(/[(\r\n)\r\n]+/),
        country_id:
          searchData.countryArr.length > 1
            ? searchData.countryArr[0]
            : searchData.countryArr[searchData.countryArr.length - 1],
        area_id:
          searchData.countryArr.length > 1
            ? searchData.countryArr[searchData.countryArr.length - 1]
            : ''
      }
      if (this.uploadRadio === 2) {
        params.type = 1
      } else if (this.uploadRadio === 3) {
        params.type = 2
      }
      this.$request.orderExport(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.dialogPackages = false
          // this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    goMatch() {
      this.page_params.page = 1
      this.page_params.size = 20
      // this.handleQueryChange('page', this.page_params.page)
      // this.handleQueryChange('size', this.page_params.size)
      // this.handleQueryChange('keyword', this.page_params.keyword)
      this.getList()
      this.getCounts()
    },
    getVal(param) {
      this.keyData = param
    },
    // 更新物流状态
    updateTracking() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.trackDialog = true
      this.getType()
    },
    // 更改物流状态
    changeStatus() {
      this.$request
        .changeOrderStatus({
          logistics_type_id: this.form.logistics_type_id,
          order_ids: this.selectIDs
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
            this.selectIDs = []
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    clear() {
      this.form.logistics_type_id = ''
    },
    clearSn() {
      this.showDialog = false
      this.tableSn = ''
      this.tableId = ''
    },
    // 日志
    checkInvalid(id) {
      this.invalidId = id
      this.invalidLog = true
      this.getInvalid()
    },
    getInvalid() {
      this.$request.getInvalid(this.invalidId).then(res => {
        if (res.ret) {
          this.invalidData = [res.data]
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 轨迹
    logistics(id, sn) {
      this.tableId = id
      this.tableSn = sn
      this.showDialog = true
      this.getAlone()
    },
    // 获取单条轨迹
    getAlone() {
      this.$request.getAloneOrder(this.tableId).then(res => {
        if (res.ret) {
          this.tableData = res.data
        }
      })
    },
    deleteTable(id) {
      this.$request.deleteOrderTable(this.tableId, id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getAlone()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
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
    // 获取订单统计数据
    getCounts() {
      const params = this.computedParams()
      this.$request.getCounts(params).then(res => {
        if (res.ret) {
          this.countData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    isPaid() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      if (this.orderInfo[0].status === 11) {
        return this.$message.error(this.$t('该订单为待审核状态无法更改付款状态请操作审核'))
      }
      if (this.selectIDs.length > 1) {
        return this.$message.error(this.$t('请选择单个订单进行操作'))
      }
      this.order_sn = this.orderInfo[0].order_sn
      this.user_id = this.orderInfo[0].user_id
      this.actual_payment_fee = this.orderInfo[0].actual_payment_fee
      this.user_name = this.orderInfo[0].user_name
      this.id = this.orderInfo[0].id
      dialog(
        {
          type: 'addPaid',
          id: this.id,
          user_id: this.user_id,
          order_sn: this.order_sn,
          actual_payment_fee: this.actual_payment_fee,
          user_name: this.user_name
        },
        () => {
          this.getList()
        }
      )
    },
    payed() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的确认更改状态为已付款吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .payedOrders({
            ids: this.selectIDs
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
    signed() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的确认更改状态为已签收吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .signedOrders({
            ids: this.selectIDs
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
    // 获取全部物流状态
    getType() {
      this.$request.getOrderStatus().then(res => {
        if (res.ret) {
          this.modeData = res.data
        }
      })
    },
    orderUnpaidNotify() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要批量发送通知吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .sendingNotify({
            ids: this.selectIDs,
            type: 2
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    // 批量发送通知
    goNotify(type) {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request
        .sendingNotify({
          ids: this.selectIDs,
          type: type
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.$refs.table.clearSelection()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    multiLogisticsDialog(id) {
      dialog(
        {
          type: 'addCompany',
          orderId: id,
          state: 'multiBox'
        },
        () => {
          this.getList()
        }
      )
    },
    // 打印标签
    getLabel(id) {
      this.labelId = id
      this.show = true
      this.$request.checkOrderLabel(id).then(res => {
        if (res.ret) {
          this.urlHtml = res.data.url
          // this.urlImport = res.data.url
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 确认下载标签
    updateLabel() {
      this.show = false
      this.$request.updateOrderPdf(this.labelId).then(res => {
        if (res.ret) {
          window.open(res.data.url)
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 跳转到审核
    reviewPackage(id) {
      this.$router.push({
        name: 'reviewFinance',
        params: {
          id: id,
          state: 'pay'
        }
      })
    },
    // 待支付 编辑打包数据
    editPacked(id, activeName, parent, lineId) {
      this.$router.push({
        name: 'editPacked',
        params: {
          id: id,
          activeName: activeName,
          parent: parent,
          lineId
        }
      })
    },
    // 跳转到发货
    goShip(shipmentSn) {
      this.$router.push({
        name: 'shipContainer',
        query: {
          shipment_sn: shipmentSn
        }
      })
    },
    // 移除发货单
    removeShip(id) {
      this.$request
        .removeOrders({
          id: [id]
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
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
    packed(id, orderSN, parent, activeName, lineId) {
      this.$router.push({
        name: 'billPacked',
        params: {
          id: id,
          order_sn: orderSN,
          activeName: activeName,
          parent: parent,
          lineId
        }
      })
    },
    // 详情
    details(id, activeName) {
      this.$router.push({
        name: 'billDetails',
        params: {
          id: id,
          activeName: activeName
        }
      })
    },
    onSelectChange(selection) {
      this.selectIDs = selection.map(item => item.id)
      this.orderInfo = selection
    },
    exChange(row, expandedRows) {
      this.expands = expandedRows.map(item => item.id)
    },
    // 完成支付
    finishPay(id) {
      this.$request.finishOrder(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 加入发货单
    addInvoice(ids) {
      if (!ids.length) {
        return this.$message.error(this.$t('请选择商品'))
      }
      dialog(
        {
          type: 'addInvoice'
        },
        data => {
          this.$request.updateShipment(ids, data).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
      )
    },
    // 导出发票
    uploadInvoice(ids) {
      if (!ids.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('是否确认导出'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .uploadOrder({
            ids
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
    // 添加转运快递公司
    addCompany(id) {
      dialog(
        {
          type: 'addCompany',
          id: [id],
          state: 'add'
        },
        () => {
          this.getList()
        }
      )
    },
    // 修改转运快递公司
    editCompany(id) {
      dialog(
        {
          type: 'addCompany',
          id: [id],
          state: 'edit'
        },
        () => {
          this.getList()
        }
      )
    },
    // 修改转运快递公司
    batchEditCompany() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      dialog(
        {
          type: 'addCompany',
          id: this.selectIDs,
          state: 'edit'
        },
        () => {
          this.getList()
        }
      )
    },
    // 作废
    invalidOrder(id, activeName, payAmount, paymentTypeName, parent) {
      dialog(
        {
          type: 'voidList',
          id: id,
          activeName: activeName,
          payAmount: payAmount,
          paymentTypeName: paymentTypeName,
          parent: parent
        },
        () => {
          this.getList()
          this.getCounts()
        }
      )
    },
    // 改价
    submitPrice() {
      if (!this.priceForm.actual_payment_fee) {
        return this.$message.error('请输入最终价格')
      } else if (!this.priceForm.remark) {
        return this.$message.error('请输入备注')
      }
      this.$request
        .changeOrderPrice(this.priceId, {
          actual_payment_fee: this.priceForm.actual_payment_fee,
          remark: this.priceForm.remark
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('保存成功'),
              message: res.msg,
              type: 'success'
            })
            this.priceDialog = false
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
    // 改价
    changePrice(id, sn, fee) {
      this.priceId = id
      this.priceSn = sn
      this.priceDialog = true
      this.priceForm.actual_payment_fee = fee
    },
    clearPrice() {
      this.priceSn = ''
      this.priceId = ''
      this.priceForm.actual_payment_fee = ''
      this.priceForm.remark = ''
    },
    // 添加转运快递单号
    edit(row) {
      row.disabled = !row.disabled
    },
    // 取消
    cancel(row) {
      row.logistics_sn = row.copySN
      row.disabled = true
    },
    // 保存添加转运快递单号
    saveLogistics(row) {
      if (!row.logistics_sn) {
        return this.$message.info('请输入转运快递单号')
      }
      this.$request
        .updateLogistics([
          {
            id: row.id,
            sn: row.logistics_sn
          }
        ])
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('保存成功'),
              message: res.msg,
              type: 'success'
            })
            row.copySN = row.logistics_sn
            row.disabled = true
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 批量改成货到付款
    changeDelivery() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要批量改成货到付款吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .changePayMode({
            ids: this.selectIDs,
            payment_mode: 2
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
    // Tab Change
    onTabChange(tab) {
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.timeList = []
      this.packed_end_date = ''
      this.getCounts()
      this.handleColumn()
      this.selectIDs = []
    },
    // 订单日志
    onLogs(id) {
      dialog(
        {
          type: 'pickingLog',
          id: id
        },
        () => {
          this.getList()
        }
      )
    },
    operateLog(id) {
      this.showExplain = true
      this.logId = id
      this.$request.exceptDescription(id).then(res => {
        if (res.ret) {
          this.operator = res.data.operator
          this.remark = res.data.remark
          this.restoreRemark = res.data.restore_remark
          this.images = res.data.images
        }
      })
    },
    confirmExcept() {
      this.showExplain = false
      this.showHandExcept = true
    },
    copyNumber(orderSn) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', orderSn)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    },
    // 批量更改支付方式
    goCreated() {
      this.innerVisible = true
      this.boxDialog = false
      this.createdIds = this.boxDialogData.map(item => item.id)
    },
    // 一键修改预计重量
    changeWeight() {
      this.boxDialogData.forEach(item => {
        item.actual_weight = item.except_package_weight
      })
    },
    // 一键修改预计体积重量
    changeVolume() {
      this.boxDialogData.forEach(item => {
        item.volume_weight = item.except_package_volume_weight
      })
    },
    // 确认更改支付方式
    confirmCreated() {
      this.$request
        .changePayMode({
          ids: this.createdIds,
          payment_mode: this.payment_mode
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.innerVisible = false
            this.boxDialog = true
            this.$request
              .getOrderBatch({
                order_ids: this.createdIds
              })
              .then(res => {
                if (res.ret) {
                  this.boxDialogData = res.data
                }
              })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 一键批量打包
    oneBatch() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.boxDialog = true
      this.getBatch()
    },
    // 获取批量打包数据
    getBatch() {
      this.$request
        .getOrderBatch({
          order_ids: this.selectIDs
        })
        .then(res => {
          if (res.ret) {
            this.boxDialogData = res.data
            this.boxDialogData = this.boxDialogData.map(item => {
              return {
                ...item,
                exceptLength: 0,
                exceptHeight: 0,
                exceptWidth: 0
              }
            })
          }
        })
    },
    // 创建发货单 取消
    returnShip() {
      this.payment_mode = ''
      this.innerVisible = false
      this.boxDialog = true
    },
    // 确认打包
    confirmPack() {
      this.$request
        .confirmBatch({
          remark: this.batch.remark,
          order: this.boxDialogData.map(item => {
            return {
              length: item.exceptLength,
              height: item.exceptHeight,
              width: item.exceptWidth,
              weight: item.actual_weight,
              volume_weight: item.volume_weight,
              id: item.id
            }
          })
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.boxDialog = false
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 表格删除
    deleteTrack(index, rows) {
      rows.splice(index, 1)
    },
    clearPayment() {
      this.payment_mode = ''
    },
    goAbnormal() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.showAbnormal = true
    },
    handleException() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.showHandExcept = true
    }
    // 饼图
  },
  computed: {
    timeLabel() {
      let label = this.$t('提交时间')
      if (this.activeName === '3') {
        label = this.$t('支付时间')
      } else if (this.activeName === '4') {
        label = this.$t('发货时间')
      }
      return label
    }
  }
}
</script>

<style lang="scss">
.sort {
  padding: 5px 15px;
  .el-checkbox__label {
    flex: 1;
  }
}
.way-list-container {
  .header-range {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-search {
      display: flex;
      align-items: center;
      margin: 0 0 0 auto;
      .header-keyword {
        max-width: 300px;
      }
      .filter {
        margin: 0 20px;
      }
    }
  }
  .remark-text {
    font-size: 14px;
    font-weight: bold;
    color: red;
  }
  .remark {
    font-size: 14px;
  }
  .waybill-data-list {
    background-color: inherit;
    overflow-y: auto !important;
  }
  .tab-length {
    width: 950px !important;
  }
  .dialog-sty {
    margin-left: 30px;
  }
  .iframe {
    width: 100%;
    min-height: 300px;
    border-width: 0;
  }
  .choose-status {
    width: 150px;
    display: inline-block;
  }
  .customer-sty {
    margin-right: 10px;
  }
  .choose-order {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  .payment-sty {
    color: red;
  }
  .type-sty {
    margin-left: 10px;
  }
  .table-sty {
    margin-bottom: 10px;
  }
  .change-sty {
    color: red;
  }
  .group-sty {
    width: 20px;
  }
  .no-package {
    color: red !important;
  }
  .packaged {
    color: green !important;
  }
  .copy-sty {
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
  }
}
.dialog-input {
  width: 30% !important;
}
/deep/.el-drawer__open .el-drawer.rtl {
  width: 90% !important;
}
/deep/ .tmp .el-drawer__open .el-drawer.rtl {
  width: 30% !important;
}
/deep/.el-dialog__close {
  color: black !important;
}
/deep/.el-icon-close:before {
  color: black !important;
}
.add-box {
  margin-bottom: 10px;
  margin-right: 5px;
}
.product-img {
  width: 110px;
  height: 100px;
}
.img_box {
  text-align: center;
  .imgDialog {
    width: 50%;
  }
}
.import-list {
  display: inline-block;
  margin-left: 10px;
}
.excel-date {
  margin-top: 20px;
}
.input-sty {
  width: 30%;
}
.item-sty {
  text-align: center;
  color: #5b60b4;
}
.expand-table {
  width: 80%;
}
.el-dialog__header {
  background-color: #0e102a;
}
.el-dialog__title {
  font-size: 14px;
  color: #fff;
}
@media (min-width: 1550px) {
  .expand-table {
    width: 100%;
  }
}
</style>

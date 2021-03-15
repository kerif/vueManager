<template>
  <div class="way-list-container">
    <el-tabs  v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <el-tab-pane :label="$t('全部') + '(' + 0 + ')'" name="0" v-if="!this.countData.all"></el-tab-pane>
      <el-tab-pane v-else :label="$t('全部') + '(' + this.countData.all + ')'" name="0"></el-tab-pane>
      <!-- 待处理 -->
      <el-tab-pane :label="$t('待处理') + '(' + 0 + ')'" name="1" v-if="!this.countData.pending"></el-tab-pane>
      <el-tab-pane v-else :label="$t('待处理') + '(' + this.countData.pending + ')'" name="1"></el-tab-pane>
      <!-- 待支付 -->
      <el-tab-pane :label="$t('待支付') + '(' + 0 + ')'" name="2" v-if="!this.countData.paid"></el-tab-pane>
      <el-tab-pane v-else :label="$t('待支付') + '(' + this.countData.paid + ')'" name="2"></el-tab-pane>
      <!-- 待发货 -->
      <el-tab-pane :label="$t('待发货') + '(' + 0 + ')'" name="3" v-if="!this.countData.delivered"></el-tab-pane>
      <el-tab-pane v-else :label="$t('待发货') + '(' + this.countData.delivered
+ ')'" name="3"></el-tab-pane>
      <!-- 已发货 -->
      <el-tab-pane :label="$t('已发货') + '(' + 0 + ')'" name="4" v-if="!this.countData.shipped"></el-tab-pane>
      <el-tab-pane v-else :label="$t('已发货') + '(' + this.countData.shipped
+ ')'" name="4"></el-tab-pane>
      <!-- 已签收 -->
      <el-tab-pane :label="$t('已签收') + '(' + 0 + ')'" name="5" v-if="!this.countData.received"></el-tab-pane>
      <el-tab-pane v-else :label="$t('已签收') + '(' + this.countData.received
+ ')'" name="5"></el-tab-pane>
      <!-- 作废订单 -->
      <el-tab-pane :label="$t('作废订单') + '(' + 0 + ')'" name="19" v-if="!this.countData.invalid"></el-tab-pane>
      <el-tab-pane v-else :label="$t('作废订单') + '(' + this.countData.invalid
+ ')'" name="19"></el-tab-pane>
  </el-tabs>
  <search-group :placeholder="$t('请输入')" v-model="page_params.keyword" @search="goMatch">
      <!-- <el-col :span="13"> -->
        <div class="changeTime">
          <!-- 创建 -->
            <el-date-picker
            v-if="activeName === '1' || activeName === '2'|| activeName === '3'
            || activeName === '4'"
            class="timeStyle"
            v-model="timeList"
            type="daterange"
            @change="onTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('提交开始日期')"
            :end-placeholder="$t('提交结束日期')">
          </el-date-picker>
          <!-- 拣货 -->
            <el-date-picker
            v-if="activeName === '2' || activeName === '3'"
            class="timeStyle"
            v-model="pickingList"
            type="daterange"
            @change="onPick"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('拣货开始日期')"
            :end-placeholder="$t('拣货结束日期')">
          </el-date-picker>
          <!-- 签收 -->
            <el-date-picker
            v-if="activeName === '5'"
            v-model="signList"
            type="daterange"
            @change="onSign"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('签收开始日期')"
            :end-placeholder="$t('签收结束日期')">
          </el-date-picker>
        </div>
      <!-- </el-col> -->
      <!-- <el-col :span="4"> -->
        <!-- 用户名 -->
        <div class="chooseStatus customer-sty">
          <el-select v-model="agent_name" @change="onAgentChange" clearable :placeholder="$t('代理筛选')">
            <el-option
              v-for="item in agentData"
              :key="item.id"
              :value="item.user_id"
              :label="item.agent_name">
            </el-option>
          </el-select>
        </div>
        <!-- 支付方式 -->
        <div class="chooseStatus customer-sty">
          <el-select v-model="payment_type" @change="onPaymentChange" clearable :placeholder="$t('支付方式')">
            <el-option
              v-for="item in paymentData"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </el-option>
          </el-select>
        </div>
        <!-- 线路名称 -->
        <div class="chooseStatus customer-sty">
          <el-select v-model="express_line_id" @change="onExpressChange" clearable :placeholder="$t('线路名称')">
            <el-option
              v-for="item in lineData"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="chooseStatus">
          <el-select v-model="pay_delivery" @change="onDeliveryChange" clearable :placeholder="$t('货到付款')">
            <el-option
              v-for="item in deliveryData"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="import-list" v-if="activeName === '0' || activeName === '1'|| activeName === '2'|| activeName === '3'|| activeName === '4'|| activeName === '5'">
          <el-button @click="goFilter">{{$t('筛选')}}</el-button>
        </div>
        <div class="import-list">
          <el-button @click="uploadList(status)">{{$t('导出清单')}}</el-button>
        </div>
      <!-- </el-col> -->
    </search-group>
    <el-table row-key="id" :expand-row-keys="expands" class="data-list" border stripe
      v-if="oderData.length"
      v-loading="tableLoading"
      @expand-change="onExpand"
      highlight-current-row
      :data="oderData" @selection-change="onSelectChange"
      >
      <!-- 二级分类列表 -->
      <el-table-column width="0" type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.secondData" class="expand-table">
            <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
      <el-table-column :label="$t('用户名')" prop="user_name"></el-table-column>
      <!-- 订单号 -->
      <el-table-column :label="$t('订单号')">
        <template slot-scope="scope">
          <i v-if="scope.row.is_parent === 1" class="iconfont icon-icon-test group-sty"></i>
          <span>{{scope.row.order_sn}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('打包状态')">
        <template slot-scope="scope">
          <div class="no-package" v-if="scope.row.group_buying_status === 0">{{$t('未打包')}}</div>
          <div class="packaged" v-if="scope.row.group_buying_status === 1">{{$t('已打包')}}</div>
        </template>
      </el-table-column>
      <!-- 支付状态 -->
      <el-table-column :label="$t('支付状态')" v-if="activeName === '2'">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 3" class="packaged">{{$t('已支付')}}</span>
          <span v-if="scope.row.status === 11">{{$t('待审核')}}</span>
          <router-link v-if="scope.row.status === 12"
          class="chooseOrder"
          :to="`/order/review/?id=${scope.row.id}`">
            {{$t('审核拒绝')}}
          </router-link>
        </template>
      </el-table-column>
      <!-- 转运快递单号 -->
      <el-table-column :label="$t('转运快递单号-头程（发货单）')" v-if="activeName === '3' ||activeName === '4' || activeName === '5' || activeName === '6'">
        <template slot-scope="scope">
          <span>{{scope.row.shipment && scope.row.shipment.logistics_company}}&nbsp;{{scope.row.shipment && scope.row.shipment.logistics_sn}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('转运快递单号-二程')" v-if="activeName === '3' ||activeName === '4' || activeName === '5' || activeName === '6'">
        <template slot-scope="scope">
          <span>{{scope.row.logistics_company}}&nbsp;{{scope.row.logistics_sn}}</span>
        </template>
      </el-table-column>
        <!-- 转运快递公司 -->
        <!-- <el-table-column :label="$t('转运快递公司')" v-if="activeName === '3'|| activeName === '4' || activeName === '5' || activeName === '6'" prop="logistics_company"></el-table-column> -->
      <!-- 线路名称 -->
      <el-table-column :label="$t('线路名称')" prop="express_line.cn_name">
        <!-- <template slot-scope="scope">{{$t(scope.row.express_line.cn_name)}}</template> -->
      </el-table-column>
      <!-- 收货人 -->
      <el-table-column :label="$t('收货人')" prop="address.receiver_name"></el-table-column>
      <!-- 收货国家或地区 -->
      <el-table-column :label="$t('收货国家/地区')" prop="address.country_name"></el-table-column>
      <!-- 包裹数 -->
      <el-table-column :label="$t('包裹数')" prop="package_count"></el-table-column>
      <!-- 预计重量KG -->
      <el-table-column :label="activeName === '1' ? $t('预计重量') + localization.weight_unit : $t('实际重量') + localization.weight_unit" :prop="activeName === '1' ? 'except_weight' : 'actual_weight'"></el-table-column>
      <!-- 详见产品图 -->
      <el-table-column :label="activeName === '1' ? $t('预计费用') + localization.currency_unit : $t('实际费用') + localization.currency_unit" :prop="activeName === '1' ? 'payment_fee' : 'actual_payment_fee'"></el-table-column>
      <el-table-column :label="$t('申报价值') + localization.currency_unit" prop="declare_value"></el-table-column>
      <!-- 支付方式 -->
      <el-table-column :label="$t('支付方式')" v-if="activeName === '3'|| activeName === '4' || activeName === '5'">
        <template slot-scope="scope">
          <span class="payment-sty" v-if="scope.row.payment_type_name === '货到付款'">{{scope.row.payment_type_name}}</span>
          <span v-else>{{scope.row.payment_type_name}}</span>
        </template>
      </el-table-column>
      <!-- 抵用券金额 -->
       <el-table-column :label="$t('抵用券金额') + localization.currency_unit" v-if="activeName === '3'|| activeName === '4' || activeName === '5'" prop="coupon_amount">
      </el-table-column>
       <!-- 增值服务金额 -->
       <el-table-column :label="$t('增值服务金额') + localization.currency_unit" v-if="activeName === '3'|| activeName === '4' || activeName === '5'" prop="value_added_amount">
      </el-table-column>
      <!-- 所属代理 -->
      <el-table-column :label="$t('所属代理')" prop="agent + agent_commission" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.agent}}</span>
          <span>({{scope.row.agent_commission}}%)</span>
        </template>
      </el-table-column>
      <!-- 提交时间 -->
      <el-table-column :label="$t('提交时间')" prop="updated_at" v-if="activeName === '1' || activeName === '2' || activeName === '3' || activeName === '4'"></el-table-column>
      <!-- 拣货时间 -->
      <el-table-column :label="$t('拣货时间')" prop="packed_at" v-if="activeName === '2' || activeName === '3'"></el-table-column>
      <!-- 签收时间 -->
      <el-table-column :label="$t('签收时间')" prop="updated_at" v-if="activeName === '5'">
      </el-table-column>
      <!-- 所属发货单 -->
      <el-table-column :label="$t('所属发货单')" v-if="activeName === '4' || activeName === '3' || activeName === '5'">
        <template slot-scope="scope">
          <span @click="goShip(scope.row.shipment_sn)" class="chooseOrder">{{scope.row.shipment_sn}}</span>
        </template>
      </el-table-column>
      <!-- 二级操作栏 -->
      <el-table-column :label="$t('操作')" class="table-fixed" width="160">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary">
              {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="item-sty" @click.native="details(scope.row.id, activeName)">
                <!-- 详情 -->
                <span>{{$t('详情')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="reviewPackage(scope.row.id)">
                <!-- 审核 -->
                <span v-show="(activeName === '2' && scope.row.status === 11 ) || ((activeName === '3' || activeName === '4') && scope.row.on_delivery_status === 11)">{{$t('审核')}}
                </span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="editPacked(scope.row.id, activeName, scope.row.is_parent)">
                <span v-show="(activeName === '1' && scope.row.group_buying_status === 1)">{{$t('编辑')}}
                </span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="packed(scope.row.id,scope.row.order_sn, scope.row.is_parent, activeName)">
                <!-- 打包 -->
                <span v-show="activeName === '1' && scope.row.group_buying_status === 0">{{$t('打包')}}</span>
              </el-dropdown-item>
              <!-- 加入发货单 -->
              <!-- <el-dropdown-item class="item-sty">
                <span v-show="activeName === '3'"
                @click="addInvoice([scope.row.id])">{{$t('加入发货单')}}</span>
              </el-dropdown-item> -->
              <el-dropdown-item class="item-sty" @click.native="getLabel(scope.row.id)">
                 <!-- 打印标签 -->
                <span size="small" v-if="activeName ==='3'">{{$t('打印标签')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="addCompany(scope.row.id)">
                <!-- 添加转运快递公司 -->
                <span size="small" v-if="activeName === '3'">{{$t('添加物流信息')}}</span>
              </el-dropdown-item>
              <!-- 移除发货单 -->
              <!-- <el-dropdown-item class="item-sty">
                <span size="small" v-if="activeName === '3' && scope.row.shipment_sn" @click="removeShip(scope.row.id)">{{$t('移除发货单')}}
                </span>
              </el-dropdown-item> -->
              <!-- 作废 -->
              <el-dropdown-item class="item-sty">
                <span @click="invalidOrder(scope.row.id, activeName, scope.row.pay_amount, scope.row.payment_type_name)"
                v-if="activeName === '1' || activeName === '2' || activeName === '3'">{{$t('作废')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="changePrice(scope.row.id, scope.row.order_sn, scope.row.actual_payment_fee)">
                <!-- 改价 -->
                <span
                v-if="activeName === '2' || scope.row.on_delivery_status === 1">{{$t('改价')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="onLogs(scope.row.id)">
                <!-- 拣货日志 -->
                <span size="small" v-if="activeName === '2' || activeName === '3' || activeName === '4' || activeName === '5'">{{$t('订单日志')}}
                </span>
              </el-dropdown-item>
              <!-- 已付款 -->
              <!-- <el-dropdown-item class="item-sty" @click.native="payed(scope.row.id)">
                <span size="small" v-if="(activeName === '3' ||activeName === '4' || activeName === '5') && scope.row.on_delivery_status === 1">{{$t('已付款')}}
                </span>
              </el-dropdown-item> -->
              <el-dropdown-item class="item-sty" @click.native="editCompany(scope.row.id)">
                <!-- 修改物流信息 -->
                <span size="small" v-if="activeName === '4'">{{$t('修改物流信息')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="logistics(scope.row.id, scope.row.order_sn)">
                <span v-if="activeName === '4'">{{$t('轨迹')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="checkInvalid(scope.row.id)">
                <!-- 日志 -->
                <span v-if="activeName === '19'">{{$t('日志')}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </template>
        </el-table-column>
        </el-table>
        </template>
      </el-table-column>
      <!-- 一级 -->
      <el-table-column type="selection" width="55" align="center"
      v-if="activeName === '1'|| activeName === '2'|| activeName === '3' || activeName === '4'"></el-table-column>
      <el-table-column v-else type="index" width="50"></el-table-column>
      <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
      <el-table-column :label="$t('用户名')" prop="user_name"></el-table-column>
      <!-- 订单号 -->
      <el-table-column :label="$t('订单号')">
        <template slot-scope="scope">
          <i v-if="scope.row.is_parent === 1" class="iconfont icon-icon-test group-sty"></i>
          <span>{{scope.row.order_sn}}</span>
        </template>
      </el-table-column>
      <!-- 审核状态 -->
      <el-table-column :label="$t('审核状态')" v-if="activeName === '2'">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 11">{{$t('待审核')}}</span>
          <router-link v-if="scope.row.status === 12"
          class="chooseOrder"
          :to="`/order/review/?id=${scope.row.id}`">
            {{$t('审核拒绝')}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('转运快递单号-头程（发货单）')" v-if="activeName === '3' ||activeName === '4' || activeName === '5' || activeName === '6'">
        <template slot-scope="scope">
          <span>{{scope.row.shipment && scope.row.shipment.logistics_company}}&nbsp;{{scope.row.shipment && scope.row.shipment.logistics_sn}}</span>
        </template>
      </el-table-column>
      <!-- 转运快递单号 -->
      <el-table-column :label="$t('转运快递单号-二程')" v-if="activeName === '3' ||activeName === '4' || activeName === '5' || activeName === '6'">
        <template slot-scope="scope">
          <span>{{scope.row.logistics_company}}&nbsp;{{scope.row.logistics_sn}}</span>
        </template>
      </el-table-column>
        <!-- 转运快递公司 -->
        <!-- <el-table-column :label="$t('转运快递公司')" v-if="activeName === '3'|| activeName === '4' || activeName === '5' || activeName === '6'" prop="logistics_company"></el-table-column> -->
      <!-- 状态为待发货才会出现输入框 -->
      <!-- <el-table-column label="转运快递单号" v-if="activeName === '3'" width="140px">
        <template slot-scope="scope">
          <template v-if="activeName === '3'">
          <el-input v-model="scope.row.logistics_sn" :disabled="scope.row.disabled"></el-input>
          </template>
        </template>
      </el-table-column> -->
      <!-- 线路名称 -->
      <el-table-column :label="$t('线路名称')" prop="express_line.cn_name">
        <!-- <template slot-scope="scope">{{$t(scope.row.express_line.cn_name)}}</template> -->
      </el-table-column>
      <!-- 收货人 -->
      <el-table-column :label="$t('收货人')" prop="address.receiver_name"></el-table-column>
      <!-- 收货国家或地区 -->
      <el-table-column :label="$t('收货国家/地区')" prop="address.country_name"></el-table-column>
      <!-- 包裹数 -->
      <el-table-column :label="$t('包裹数')" prop="package_count"></el-table-column>
      <!-- 预计重量KG -->
      <el-table-column :label="activeName === '1' ? $t('预计重量') + localization.weight_unit : $t('实际重量') + localization.weight_unit" :prop="activeName === '1' ? 'except_weight' : 'actual_weight'"></el-table-column>
      <!-- 详见产品图 -->
      <el-table-column :label="activeName === '1' ? $t('预计费用') + localization.currency_unit : $t('实际费用') + localization.currency_unit" :prop="activeName === '1' ? 'payment_fee' : 'actual_payment_fee'"></el-table-column>
      <el-table-column :label="$t('申报价值') + localization.currency_unit" prop="declare_value"></el-table-column>
      <!-- 支付方式 -->
      <el-table-column :label="$t('支付方式')" v-if="activeName === '3'|| activeName === '4' || activeName === '5'">
        <template slot-scope="scope">
          <div class="payment-sty" v-if="scope.row.payment_type_name === '货到付款'">{{scope.row.payment_type_name}}
          <p v-if="scope.row.on_delivery_status === 2">({{$t('已付款')}})</p>
          </div>
          <div v-else>{{scope.row.payment_type_name}}</div>
        </template>
      </el-table-column>
      <!-- 抵用券金额 -->
       <el-table-column :label="$t('抵用券金额') + localization.currency_unit" v-if="activeName === '3'|| activeName === '4' || activeName === '5'" prop="coupon_amount">
      </el-table-column>
      <!-- 所属代理 -->
      <el-table-column :label="$t('所属代理')" prop="agent + agent_commission" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.agent}}</span>
          <span>({{scope.row.agent_commission}}%)</span>
        </template>
      </el-table-column>
      <!-- 提交时间 -->
      <el-table-column :label="$t('提交时间')" prop="updated_at" v-if="activeName === '1' || activeName === '2' || activeName === '3' || activeName === '4'"></el-table-column>
      <!-- 拣货时间 -->
      <el-table-column :label="$t('拣货时间')" prop="packed_at" v-if="activeName === '2' || activeName === '3'"></el-table-column>
      <!-- 签收时间 -->
      <el-table-column :label="$t('签收时间')" prop="updated_at" v-if="activeName === '5'">
      </el-table-column>
      <!-- 所属发货单 -->
      <el-table-column :label="$t('所属发货单')" v-if="activeName === '4' || activeName === '3' || activeName === '5'">
        <template slot-scope="scope">
          <span @click="goShip(scope.row.shipment_sn)" class="chooseOrder">{{scope.row.shipment_sn}}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" fixed="right" width="160">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary">
              {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- 详情 -->
              <el-dropdown-item class="item-sty" @click.native="details(scope.row.id, activeName)">
                <span>{{$t('详情')}}</span>
                <!-- <div @click="details(scope.row.id, activeName)">{{$t('详情')}}</div> -->
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="reviewPackage(scope.row.id)">
                <!-- 审核 -->
                <!-- <span v-show="activeName === '2' && scope.row.status === 11">{{$t('审核')}}
                </span> -->
                <span v-show="(activeName === '2' && scope.row.status === 11 ) || ((activeName === '3' || activeName === '4') && scope.row.on_delivery_status === 11)">{{$t('审核')}}
                </span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="editPacked(scope.row.id, activeName, scope.row.is_parent)">
                <span v-show="activeName === '2'">{{$t('编辑')}}
                </span>
              </el-dropdown-item>
              <!-- 打包 -->
              <el-dropdown-item class="item-sty" @click.native="packed(scope.row.id,scope.row.order_sn, scope.row.is_parent, activeName)">
                <!-- 打包 -->
                <span v-show="activeName === '1' && (scope.row.group_buying_status === 0 || scope.row.group_buying_status === 1)">{{$t('打包')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="addInvoice([scope.row.id])">
                <!-- 加入发货单 -->
                <span v-show="activeName === '3'">{{$t('加入发货单')}}</span>
              </el-dropdown-item>
              <!-- 打印标签 -->
              <!-- <el-dropdown-item class="item-sty">
                <span size="small" @click="getLabel(scope.row.id)" v-if="activeName ==='3'">{{$t('打印标签')}}</span>
              </el-dropdown-item> -->
              <!-- 添加转运快递公司 -->
              <!-- <el-dropdown-item class="item-sty">
                <span size="small" @click="addCompany(scope.row.id)" v-if="activeName === '3'">{{$t('添加物流信息')}}</span>
              </el-dropdown-item> -->
              <el-dropdown-item class="item-sty" @click.native="removeShip(scope.row.id)">
                <!-- 移除发货单 -->
                <span size="small" v-if="activeName === '3' && scope.row.shipment_sn">{{$t('移除发货单')}}
                </span>
              </el-dropdown-item>
               <el-dropdown-item class="item-sty" @click.native="groupBuy(scope.row)">
                <!-- 团购 -->
                <!-- v-if="scope.row.is_parent_order === 1" -->
                <span size="small" v-if="scope.row.is_parent === 1">{{$t('团购')}}
                </span>
              </el-dropdown-item>
              <!-- 作废 -->
              <el-dropdown-item class="item-sty" @click.native="invalidOrder(scope.row.id, activeName, scope.row.pay_amount, scope.row.payment_type_name, scope.row.is_parent)">
                <span v-if="activeName === '1' || activeName === '2' || activeName === '3'">{{$t('作废')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="changePrice(scope.row.id, scope.row.order_sn, scope.row.actual_payment_fee)">
                <!-- 改价 -->
                <span
                v-if="(activeName === '2' || scope.row.on_delivery_status === 1) && scope.row.is_parent === 0">{{$t('改价')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="onLogs(scope.row.id)">
                <!-- 拣货日志 -->
                <span size="small" v-if="activeName === '2' || activeName === '3' || activeName === '4' || activeName === '5'">{{$t('订单日志')}}
                </span>
              </el-dropdown-item>
              <!-- 已付款 -->
              <!-- <el-dropdown-item class="item-sty" @click.native="payed(scope.row.id)">
                <span size="small" v-if="(activeName === '3' ||activeName === '4' || activeName === '5') && scope.row.on_delivery_status === 1">{{$t('已付款')}}
                </span>
              </el-dropdown-item> -->
              <el-dropdown-item class="item-sty" @click.native="editCompany(scope.row.id)">
                <!-- 修改物流信息 -->
                <span size="small" v-if="activeName === '4'">{{$t('修改物流信息')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="logistics(scope.row.id, scope.row.order_sn)">
                <span v-if="activeName === '4'">{{$t('轨迹')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="saveLogistics(scope.row)">
                <span size="small"
                v-show="activeName === '3' && !scope.row.disabled"
                >{{$t('保存')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="cancel(scope.row)">
                <span size="small"
                v-show="activeName === '3' && !scope.row.disabled">{{$t('取消')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="checkInvalid(scope.row.id)">
                <!-- 日志 -->
                <span v-if="activeName === '19'">{{$t('日志')}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
          <!-- 完成支付 -->
          <!-- <el-button v-show="activeName === '2'" class="btn-orangey-red" @click="finishPay(scope.row.id)">完成支付</el-button> -->
          <!-- 添加转运快递单号 -->
          <!-- <el-button size="small" @click="edit(scope.row)" v-if="activeName === '3' && scope.row.disabled" class="btn-deep-purple detailsBtn">添加转运快递单号</el-button> -->
          <!-- 导出发票 -->
           <!-- <el-button class="btn-yellow detailsBtn" @click="invalidOrder(scope.row.id, activeName, scope.row.pay_amount, scope.row.payment_type_name)"
          v-if="activeName === '3' || activeName === '4' || activeName === '5'">{{$t('导出发票')}}</el-button> -->
        </template>
      </el-table-column>
      <template slot="append" v-if="activeName === '1' ||activeName === '3' || activeName === '2' || activeName === '4' || activeName === '5'">
        <div class="append-box">
          <!-- 删除 -->
          <!-- <el-button size="small">删除</el-button> -->
          <el-button class="btn-purple" v-if="activeName === '1'" @click="oneBatch">{{$t('一键批量打包')}}</el-button>
          <!-- 加入发货单 -->
          <el-button size="small" v-if="activeName === '3'" @click="addInvoice(selectIDs)">{{$t('加入发货单')}}</el-button>
           <!-- 导出发票 -->
           <el-button size="small" @click="uploadInvoice(selectIDs)" v-if="activeName === '3' || activeName === '4' || activeName === '5'">{{$t('导出发票')}}</el-button>
            <!-- 批量发送通知 -->
           <el-button size="small" @click="goNotify"
           v-if="this.activeName === '2' || this.activeName === '4'">{{$t('批量发送通知')}}</el-button>
           <!-- 批量改成货到付款 -->
           <el-button size="small"  v-if="this.activeName === '2'" @click="changeDelivery">{{$t('批量改成货到付款')}}</el-button>
           <!-- 更新物流状态 -->
            <el-button size="small" @click="updateTracking"
           v-if="this.activeName === '4'">{{$t('更新物流状态')}}</el-button>
           <!-- 已付款 -->
            <el-button size="small" v-if="activeName === '3' ||activeName === '4' || activeName === '5'" @click="payed">{{$t('已付款')}}
          </el-button>
        </div>
      </template>
    </el-table>
    <div class="noDate" v-else>{{$t('暂无数据')}}</div>
      <el-dialog :visible.sync="show" :title="$t('预览打印标签')" class="props-dialog" width="45%">
        <div class="dialogSty">
          <iframe class="iframe" :src="urlHtml"></iframe>
        </div>
      <div slot="footer">
        <el-button @click="show = false">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="updateLabel">{{$t('下载')}}</el-button>
      </div>
    </el-dialog>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="trackDialog" width="30%" :title="$t('更新物流状态')" @close="clear">
        <el-form label-position="top" :model="form" ref="form">
          <el-form-item :label="$t('物流状态')">
            <el-select
              v-model="form.logistics_type_id"
              filterable
              class="country-select"
              :placeholder="$t('请选择')">
                <el-option
                  v-for="item in modeData"
                  :key="item.id"
                  :label="item.context"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button class="type-sty" @click="goMore">{{$t('管理')}}</el-button>
            </el-form-item>
          </el-form>
        <div slot="footer">
          <el-button @click="trackDialog = false">{{$t('取消')}}</el-button>
          <el-button type="primary" @click="changeStatus">{{$t('确定')}}</el-button>
        </div>
      </el-dialog>
    <!-- 轨迹 -->
    <el-dialog :visible.sync="showDialog" width="45%" :title="$t('轨迹')" @close="clearSn">
      <div class="table-sty">
        {{$t('发货单号：')}}{{this.tableSn}}
      </div>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column :label="$t('物流轨迹')" prop="context"></el-table-column>
        <el-table-column :label="$t('时间')" prop="created_at"></el-table-column>
        <el-table-column :label="$t('操作人')" prop="operator"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-light-red" @click="deleteTable(scope.row.id)">{{$t('删除')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 改价 -->
    <el-dialog :visible.sync="priceDialog" width="35%" :title="$t('改价')" @close="clearPrice">
      <div class="table-sty">
        {{$t('订单号：')}}{{this.priceSn}}
      </div>
        <el-form :model="priceForm" ref="form">
          <el-form-item :label="$t('*最终价格') + this.localization.currency_unit">
            <el-input v-model="priceForm.actual_payment_fee"></el-input>
          </el-form-item>
          <el-form-item :label="$t('*备注')">
            <el-input type="textarea" v-model="priceForm.remark"
              :autosize="{ minRows: 2, maxRows: 4}">
            </el-input>
          </el-form-item>
        </el-form>
        <div class="change-sty">
          <p>{{$t('*您的改价操作记录将会保存在日志记录中')}}</p>
        </div>
        <div slot="footer">
          <el-button @click="priceDialog = false">{{$t('取消')}}</el-button>
          <el-button type="primary" @click="submitPrice">{{$t('确定')}}</el-button>
        </div>
      </el-dialog>
    <!-- 一键批量打包 -->
  <el-dialog :visible.sync="boxDialog" :title="$t('一键批量打包')" @close="batchClear"  width="80%">
    <div class="add-box">
      <!-- 一键将预计重量改成实际重量 -->
      <el-tooltip :content="$t('一键更改数据时，如订单中包裹数量大于1，计算方式为该订单中所有包裹重量直接相加，数据误差较大时请手动更改')" placement="top">
        <el-button @click="changeWeight">{{$t('一键将预计重量改成实际重量')}}</el-button>
      </el-tooltip>
      <el-tooltip :content="$t('一键更改数据时，如订单中包裹数量大于1，计算方式为该订单中所有包裹体积重量相加，数据误差较大时请手动更改')" placement="top">
        <el-button @click="changeVolume">{{$t('一键将预计体积重量设为实际体积重量')}}</el-button>
      </el-tooltip>
      <el-button @click="goCreated">{{$t('批量改支付方式')}}</el-button>
    </div>
    <el-table
      :data="boxDialogData"
      border
      style="width: 100%">
      <!-- 客户ID -->
      <el-table-column
        prop="user_id"
        :label="$t('客户ID')">
      </el-table-column>
      <!-- 订单号 -->
      <el-table-column
        prop="order_sn"
        :label="$t('订单号')">
      </el-table-column>
      <!-- 线路名称 -->
       <el-table-column
        prop="express_line.cn_name"
        :label="$t('线路名称')">
      </el-table-column>
      <!-- 支付方式 -->
      <el-table-column
        :label="$t('支付方式')">
         <template slot-scope="scope">
          <span class="payment-sty" v-if="scope.row.payment_mode === 2">{{$t('货到付款')}}</span>
          <span v-else>{{$t('预付')}}</span>
        </template>
      </el-table-column>
      <!-- 包裹数量 -->
      <el-table-column
        prop="package_count"
        :label="$t('包裹数量')">
      </el-table-column>
      <!-- 预计重量 -->
      <el-table-column
        prop="except_weight"
        :label="$t('预计重量') + this.localization.weight_unit">
      </el-table-column>
      <!-- 实际重量 -->
        <el-table-column
        :label="$t('实际重量') + this.localization.weight_unit">
        <template slot-scope="scope">
          <el-input v-model="scope.row.actual_weight"></el-input>
        </template>
        </el-table-column>
        <!-- 实际体积重量 -->
        <el-table-column>
          <template slot-scope="scope">
            <el-input v-model="scope.row.volume_weight"></el-input>
          </template>
          <template slot="header">
              <span>{{$t('实际体积重量')}}{{localization.weight_unit}}</span>
              <el-tooltip placement="top">
                <span slot="content">
                  <span>
                  {{$t('如有合箱操作，请勿填写此项，填入实际尺寸即可')}}
                  </span>
                  </span>
              <i class="el-icon-question" style="font-size: 18px; color:#35B85A;"></i>
              </el-tooltip>
          </template>
        </el-table-column>
        <!-- 实际尺寸 -->
        <el-table-column
        :label="$t('实际尺寸') + this.localization.length_unit" width="200px">
        <template slot-scope="scope">
          <el-input class="dialog-input" :placeholder="$t('长')" v-model="scope.row.exceptLength"></el-input>
          <el-input class="dialog-input" :placeholder="$t('宽')" v-model="scope.row.exceptWidth"></el-input>
          <el-input class="dialog-input" :placeholder="$t('高')" v-model="scope.row.exceptHeight"></el-input>
        </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')">
            <template slot-scope="scope">
              <!-- 删除 -->
              <el-button class="btn-light-red" @click="deleteTrack(scope.$index, boxDialogData)">{{$t('删除')}}</el-button>
            </template>
          </el-table-column>
    </el-table>
    <el-form>
      <el-form-item :label="$t('统一备注')">
        <el-input type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          :placeholder="$t('请输入内容')" v-model="batch.remark">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="boxDialog = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirmPack">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
  <!-- 批量更改支付方式 -->
  <el-dialog :visible.sync="innerVisible" :title="$t('批量更改支付方式')" width="45%" @close="clearPayment" append-to-body>
    <el-form ref="ruleForm" class="demo-form-inline" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="10">
        <!-- 员工组中文名 -->
        <el-form-item :label="$t('支付方式')">
          <el-select v-model="payment_mode" :placeholder="$t('请选择')"
              filterable>
              <el-option
                v-for="item in payMode"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="returnShip">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="confirmCreated">{{$t('确定')}}</el-button>
      </div>
  </el-dialog>
  <!-- 日志 -->
  <el-dialog :visible.sync="invalidLog" :title="$t('作废日志')" width="45%">
    <el-table
      :data="invalidData"
      style="width: 100%">
      <el-table-column :label="$t('图片')">
        <template slot-scope="scope">
          <span v-for="(ele, index) in scope.row.images" :key="index"  style="cursor:pointer;" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${ele}`, imgVisible=true">
            <img :src="`${$baseUrl.IMAGE_URL}${ele}`" class="productImg">
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作日志')" prop="remark"></el-table-column>
    </el-table>
  </el-dialog>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
    <!-- 筛选 -->
    <el-dialog :title="$t('筛选')" :visible.sync="dialogFilter" width="40%" @close="clearFilter">
      <div class="excel-date">
        <el-form ref="form" :model="filterForm">
          <el-form-item :label="$t('价格区间') + localization.currency_unit">
            <el-input :placeholder="$t('请输入起始价格')" v-model="filterForm.start" class="input-sty"></el-input> -
            <el-input :placeholder="$t('请输入结束价格')" v-model="filterForm.end" class="input-sty"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFilter = false" class="cancel-btn">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="createPrice" :loading="$store.state.btnLoading">{{$t('确定')}}</el-button>
    </div>
    </el-dialog>
    <!-- 导出清单 -->
    <el-dialog :title="$t('导出清单')" :visible.sync="dialogPackages" width="40%" @close="clearFilter">
      <div class="excel-date">
        <el-radio :label="1" v-model="uploadRadio">{{$t('导出清单（含包裹信息）')}}</el-radio>
        <el-radio :label="2" v-model="uploadRadio">{{$t('导出清单')}}</el-radio>
        <el-radio :label="3" v-model="uploadRadio">{{$t('美中国际定制')}}</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPackages = false" class="cancel-btn">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="updatePackages" :loading="$store.state.btnLoading">{{$t('确定')}}</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  name: 'wallbillList',
  data () {
    return {
      timeList: [],
      uploadRadio: 1,
      pickingList: [],
      expands: [],
      signList: [],
      begin_date: '',
      end_date: '',
      packed_begin_date: '',
      packed_end_date: '',
      updated_begin_date: '',
      updated_end_date: '',
      activeName: '1',
      oderData: [],
      secondData: [],
      localization: {},
      status: 1,
      selectIDs: [],
      agent_name: '',
      payment_type: '',
      express_line_id: '',
      pay_delivery: '',
      agentData: [],
      paymentData: [],
      deliveryData: [
        {
          id: 1,
          name: this.$t('全部货到付款')
        },
        {
          id: 2,
          name: this.$t('未支付')
        },
        {
          id: 3,
          name: this.$t('已支付')
        },
        {
          id: 11,
          name: this.$t('待审核')
        },
        {
          id: 12,
          name: this.$t('审核拒绝')
        }
      ],
      lineData: [],
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
      paramsData: {}
    }
  },
  created () {
    this.getCounts()
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
      this.status = Number(this.$route.query.activeName)
    }
    if (this.$route.query.order_sn) {
      this.page_params.keyword = this.$route.query.order_sn
    }
    if (this.$route.query.agent) {
      this.agent_name = Number(this.$route.query.agent)
    }
    // 拣货日期筛选保留
    if (this.$route.query.pickTimes) {
      this.pickingList = this.$route.query.pickTimes.split(' ')
      console.log(this.$route.query.pickTimes)
      console.log(this.pickingList, 'this.pickingList ')
      this.packed_begin_date = this.pickingList ? this.pickingList[0] : ''
      this.packed_end_date = this.pickingList ? this.pickingList[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('pickTimes', `${this.packed_begin_date} ${this.packed_end_date}`)
      this.getList()
    }
    // 签收时间筛选保留
    if (this.$route.query.signTimes) {
      this.signList = this.$route.query.signTimes.split(' ')
      console.log(this.$route.query.signTimes)
      console.log(this.signList, 'this.signList ')
      this.updated_begin_date = this.signList ? this.signList[0] : ''
      this.updated_end_date = this.signList ? this.signList[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('signTimes', `${this.updated_begin_date} ${this.updated_end_date}`)
      this.getList()
    }
    // 提交日期时间筛选保留
    // createdTimes
    if (this.$route.query.createdTimes) {
      this.timeList = this.$route.query.createdTimes.split(' ')
      console.log(this.$route.query.createdTimes)
      console.log(this.timeList, 'this.timeList ')
      this.begin_date = this.timeList ? this.timeList[0] : ''
      this.end_date = this.timeList ? this.timeList[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('createdTimes', `${this.begin_date} ${this.end_date}`)
      this.getList()
    }
    this.getAgentData()
    this.getPaymentType()
    this.getLineType()
  },
  mounted () {
    this.getList()
  },
  methods: {
    groupBuy (row) {
      this.secondExpands = row
      if (this.expands.find(item => item === row.id)) {
        this.expands = this.expands.filter(item => item !== row.id)
      } else {
        this.expands.push(row.id)
      }
      console.log(this.expands)
      // console.log(this.expands, 'expands')
      // this.$request.orderSecond(eId).then(res => {
      //   if (res.ret) {
      //     console.log(res.data)
      //     this.secondData = res.data
      //   }
      // })
      // 如果当前货单已经获取了二级菜单数据，就不在获取
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
        this.localization = res.localization
      })
    },
    getList () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent: this.agent_name,
        payment_type: this.payment_type,
        express_line_id: this.express_line_id,
        pay_delivery: this.pay_delivery,
        status: this.status,
        value_start: this.filterForm.start,
        value_end: this.filterForm.end
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      // 拣货时间
      this.packed_begin_date && (params.packed_begin_date = this.packed_begin_date)
      this.packed_end_date && (params.packed_end_date = this.packed_end_date)
      // 签收时间
      this.updated_begin_date && (params.updated_begin_date = this.updated_begin_date)
      this.updated_end_date && (params.updated_end_date = this.updated_end_date)
      this.$request.getOrder(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          // 待发货列表的转运快递单号添加
          res.data.forEach(item => {
            item.disabled = true
            item.copySN = item.logistics_sn
          })
          // this.oderData = res.data
          this.oderData = res.data.map(item => {
            return {
              ...item,
              // enabled: Boolean(item.enabled),
              // risk_warning_enabled: Boolean(item.risk_warning_enabled),
              secondData: []
            }
          })
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.expands = []
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 点开当前行，获取二级菜单数据
    onExpand (row) {
      console.log(11111)
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (row.secondData.length) return
      let id = row.id
      this.$request.getSecondWebsites(id).then(res => {
        if (res.ret) {
          row.secondData = res.data.map(item => {
            return {
              ...item
            }
          })
        }
      })
    },
    goFilter () {
      this.dialogFilter = true
    },
    clearFilter () {
      // this.filterForm.start = ''
      // this.filterForm.end = ''
    },
    // 筛选
    createPrice () {
      if (!this.filterForm.start) {
        return this.$message.error(this.$t('请输入起始价格'))
      } else if (!this.filterForm.end) {
        return this.$message.error(this.$t('请输入结束价格'))
      }
      this.getList()
      this.dialogFilter = false
    },
    // 导出清单
    uploadList (val) {
      console.log(val, 'val')
      this.paramsData = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent: this.agent_name,
        payment_type: this.payment_type,
        express_line_id: this.express_line_id,
        pay_delivery: this.pay_delivery,
        status: val,
        value_start: this.filterForm.start,
        value_end: this.filterForm.end
      }
      this.page_params.keyword && (this.paramsData.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (this.paramsData.begin_date = this.begin_date)
      this.end_date && (this.paramsData.end_date = this.end_date)
      // 拣货时间
      this.packed_begin_date && (this.paramsData.packed_begin_date = this.packed_begin_date)
      this.packed_end_date && (this.paramsData.packed_end_date = this.packed_end_date)
      // 签收时间
      this.updated_begin_date && (this.paramsData.updated_begin_date = this.updated_begin_date)
      this.updated_end_date && (this.paramsData.updated_end_date = this.updated_end_date)
      // console.log(params, 'params1111')
      this.dialogPackages = true
    },
    updatePackages () {
      console.log(this.paramsData, 'paramsData')
      if (this.uploadRadio === 1) {
        this.$request.orderExport(this.paramsData).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.dialogPackages = false
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else if (this.uploadRadio === 2) {
        this.$request.orderExport({
          ...this.paramsData,
          type: 1
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.dialogPackages = false
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else if (this.uploadRadio === 3) {
        this.$request.orderExport({
          ...this.paramsData,
          type: 2
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.dialogPackages = false
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
    },
    goMatch () {
      this.page_params.page = 1
      this.page_params.size = 10
      this.handleQueryChange('page', this.page_params.page)
      this.handleQueryChange('size', this.page_params.size)
      this.handleQueryChange('keyword', this.page_params.keyword)
      this.getList()
      this.getCounts()
    },
    // 更新物流状态
    updateTracking () {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.trackDialog = true
      this.getType()
    },
    // 更改物流状态
    changeStatus () {
      this.$request.changeOrderStatus({
        logistics_type_id: this.form.logistics_type_id,
        order_ids: this.selectIDs
      }).then(res => {
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
    clear () {
      // this.selectIDs = []
      // console.log(this.selectIDs, 'this.selectIDs = []111')
      this.form.logistics_type_id = ''
    },
    clearSn () {
      this.tableSn = ''
      this.tableId = ''
    },
    // 日志
    checkInvalid (id) {
      this.invalidId = id
      this.invalidLog = true
      this.getInvalid()
    },
    getInvalid () {
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
    logistics (id, sn) {
      this.tableId = id
      this.tableSn = sn
      this.showDialog = true
      this.getAlone()
    },
    // 获取单条轨迹
    getAlone () {
      this.$request.getAloneOrder(this.tableId).then(res => {
        if (res.ret) {
          this.tableData = res.data
        }
      })
    },
    deleteTable (id) {
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
    goMore () {
      this.$router.push({ name: 'payment',
        query: {
          activeName: '12'
        } })
    },
    // 获取订单统计数据
    getCounts () {
      let params = {
        agent: this.agent_name,
        payment_type: this.payment_type,
        express_line_id: this.express_line_id,
        pay_delivery: this.pay_delivery,
        keyword: this.page_params.keyword
      }
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
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
    // 获得客户下拉列表
    getAgentData () {
      this.$request.getAgent().then(res => {
        this.agentData = res.data
      })
    },
    // 获取支付方式列表
    getPaymentType () {
      this.$request.paymentType().then(res => {
        this.paymentData = res.data
      })
    },
    // 获取筛选线路列表
    getLineType () {
      this.$request.lineType().then(res => {
        this.lineData = res.data
      })
    },
    // eslint-disable-next-line no-unused-vars
    payed (id) {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的确认更改状态为已付款吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.payedOrders({
          ids: this.selectIDs
        }).then(res => {
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
    getType () {
      this.$request.getOrderStatus().then(res => {
        if (res.ret) {
          this.modeData = res.data
        }
      })
    },
    // 批量发送通知
    goNotify () {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      if (this.activeName === '2') {
        this.$confirm(this.$t('您真的要批量发送通知吗？'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$request.sendingNotify({
            ids: this.selectIDs,
            // type: this.activeName === '2' ? 2 : 3
            type: 2
          }).then(res => {
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
      } else if (this.activeName === '4') {
        dialog({ type: 'notifyOrder', ids: this.selectIDs }, () => {
          this.getList()
          this.selectIDs = []
        })
      }
    },
    // 打印标签
    getLabel (id) {
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
    updateLabel () {
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
    reviewPackage (id) {
      // this.$router.push({ name: 'review', query: { id: id, state: 'review' } })
      this.$router.push({ name: 'reviewFinance',
        params: {
          id: id,
          state: 'pay'
        } })
    },
    // 待支付 编辑打包数据
    editPacked (id, activeName, parent) {
      this.$router.push({ name: 'editPacked', params: { id: id, activeName: activeName, parent: parent } })
    },
    // 跳转到发货
    goShip (shipmentSn) {
      this.$router.push({ name: 'shipContainer', query: { shipment_sn: shipmentSn } })
    },
    // 移除发货单
    removeShip (id) {
      this.$request.removeOrders({
        id: [id]
      }).then(res => {
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
    // 创建时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('createdTimes', `${this.begin_date} ${this.end_date}`)
      this.getList()
      this.getCounts()
    },
    // 拣货时间
    onPick (val) {
      console.log(val, 'val')
      this.packed_begin_date = val ? val[0] : ''
      this.packed_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('pickTimes', `${this.packed_begin_date} ${this.packed_end_date}`)
      this.getList()
    },
    // 签收时间
    onSign (val) {
      this.updated_begin_date = val ? val[0] : ''
      this.updated_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('signTimes', `${this.updated_begin_date} ${this.updated_end_date}`)
      this.getList()
    },
    // 打包
    packed (id, orderSN, parent, activeName) {
      this.$router.push({ name: 'billPacked',
        params: { id: id, order_sn: orderSN, activeName: activeName, parent: parent } })
    },
    // 详情
    details (id, activeName) {
      this.$router.push({ name: 'billDetails',
        params: { id: id, activeName: activeName } })
    },
    onSelectChange (selection) {
      this.selectIDs = selection.map(item => item.id)
    },
    // 完成支付
    finishPay (id) {
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
    addInvoice (ids) {
      if (!ids.length) {
        return this.$message.info(this.$t('请选择商品'))
      }
      dialog({ type: 'addInvoice' }, (data) => {
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
      })
    },
    // 导出发票
    uploadInvoice (ids) {
      if (!ids.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('是否确认导出？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.uploadOrder({
          ids
        }).then(res => {
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
    addCompany (id) {
      dialog({ type: 'addCompany', id: id, state: 'add' }, () => {
        this.getList()
      })
    },
    // 修改转运快递公司
    editCompany (id) {
      dialog({ type: 'addCompany', id: id, state: 'edit' }, () => {
        this.getList()
      })
    },
    // 作废
    invalidOrder (id, activeName, payAmount, paymentTypeName, parent) {
      dialog({ type: 'voidList', id: id, activeName: activeName, payAmount: payAmount, paymentTypeName: paymentTypeName, parent: parent }, () => {
        this.getList()
        this.getCounts()
      })
    },
    // 改价
    submitPrice () {
      if (!this.priceForm.actual_payment_fee) {
        return this.$message.error('请输入最终价格')
      } else if (!this.priceForm.remark) {
        return this.$message.error('请输入备注')
      }
      this.$request.changeOrderPrice(this.priceId, {
        actual_payment_fee: this.priceForm.actual_payment_fee,
        remark: this.priceForm.remark
      }).then(res => {
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
    changePrice (id, sn, fee) {
      this.priceId = id
      this.priceSn = sn
      this.priceDialog = true
      this.priceForm.actual_payment_fee = fee
    },
    clearPrice () {
      this.priceSn = ''
      this.priceId = ''
      this.priceForm.actual_payment_fee = ''
      this.priceForm.remark = ''
    },
    // 添加转运快递单号
    edit (row) {
      row.disabled = !row.disabled
    },
    // 取消
    cancel (row) {
      row.logistics_sn = row.copySN
      row.disabled = true
    },
    // 保存添加转运快递单号
    saveLogistics (row) {
      if (!row.logistics_sn) {
        return this.$message.info('请输入转运快递单号')
      }
      this.$request.updateLogistics([{
        id: row.id,
        sn: row.logistics_sn
      }]).then(res => {
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
    changeDelivery () {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要批量改成货到付款吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.changePayMode({
          ids: this.selectIDs,
          payment_mode: 2
        }).then(res => {
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
    onTabChange (tab) {
      console.log('wwowowow')
      this.status = Number(tab.name)
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.timeList = []
      this.pickingList = []
      this.signList = []
      this.begin_date = ''
      this.end_date = ''
      this.packed_begin_date = ''
      this.packed_end_date = ''
      this.updated_begin_date = ''
      this.updated_end_date = ''
      this.getList()
      this.getCounts()
      this.expands = []
      this.selectIDs = []
      // if (this.expands.find(item => item === this.secondExpands.id)) {
      // }
    },
    // 选择代理用户
    onAgentChange () {
      this.page_params.handleQueryChange('agent', this.agent_name)
      this.getList()
      this.getCounts()
    },
    // 选择支付方式
    onPaymentChange () {
      this.page_params.handleQueryChange('payment_type', this.payment_type)
      this.getList()
      this.getCounts()
    },
    // 选择线路名称
    onExpressChange () {
      this.page_params.handleQueryChange('express_line_id', this.express_line_id)
      this.getList()
      this.getCounts()
    },
    // 选择货到付款
    onDeliveryChange () {
      this.page_params.handleQueryChange('pay_delivery ', this.pay_delivery)
      this.getList()
      this.getCounts()
    },
    // 订单日志
    onLogs (id) {
      dialog({ type: 'pickingLog', id: id }, () => {
        this.getList()
      })
      // this.$router.push({ name: 'pickingContainer', query: { active: '2', keyword: orderSN } })
    },
    // 批量更改支付方式
    goCreated () {
      this.innerVisible = true
      this.boxDialog = false
      this.createdIds = this.boxDialogData.map(item => item.id)
    },
    // 一键修改预计重量
    changeWeight () {
      this.boxDialogData.forEach(item => {
        item.actual_weight = item.except_package_weight
      })
    },
    // 一键修改预计体积重量
    changeVolume () {
      this.boxDialogData.forEach(item => {
        item.volume_weight = item.except_package_volume_weight
      })
    },
    // 确认更改支付方式
    confirmCreated () {
      this.$request.changePayMode({
        ids: this.createdIds,
        payment_mode: this.payment_mode
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.innerVisible = false
          this.boxDialog = true
          this.$request.getOrderBatch({
            order_ids: this.createdIds
          }).then(res => {
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
    oneBatch () {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.boxDialog = true
      this.getBatch()
    },
    // 清除一键批量打包
    batchClear () {
      // this.except_dimension.length = 0
      // this.except_dimension.width = 0
      // this.except_dimension.height = 0
    },
    // 获取批量打包数据
    getBatch () {
      this.$request.getOrderBatch({
        order_ids: this.selectIDs
      }).then(res => {
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
          console.log(this.boxDialogData, 'boxDialogData')
        }
      })
    },
    // 创建发货单 取消
    returnShip () {
      this.payment_mode = ''
      this.innerVisible = false
      this.boxDialog = true
    },
    // 确认打包
    confirmPack () {
      this.$request.confirmBatch({
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
      }).then(res => {
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
    deleteTrack (index, rows) {
      rows.splice(index, 1)
    },
    clearPayment () {
      this.payment_mode = ''
    }
  }
}
</script>

<style lang="scss" scope>
.way-list-container {
  .tabLength {
    width: 870px !important;
  }
  .detailsBtn {
    margin: 3px 2px !important;
  }
  .dialogSty {
    margin-left: 30px;
  }
  .el-icon  {
    display: none;
  }
  .iframe {
    width: 100%;
    min-height: 300px;
    border-width: 0;
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
    .el-select {
      // width: 100%;
    }
  }
  .customer-sty {
    margin-right: 10px;
  }
  .chooseOrder {
    cursor: pointer;
    color:blue;
    text-decoration: underline;
  }
  .changeTime {
    display: inline-block;
    // width: 70%;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
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
    color: #ff4b3d;
    margin-right: 5px;
  }
  .no-package {
    color:red !important;
  }
  .packaged {
    color:green !important;
  }
}
.dialog-input {
  width: 30% !important;
}
.add-box {
  margin-bottom: 10px;
  margin-right: 5px;
}
.productImg {
  width: 110px;
  height: 100px;
}
.img_box{
  text-align: center;
  .imgDialog{
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
.table-fixed {
  // height: 100% !important;
  // width: 100%;
  .el-table__fixed-right {
  height: 100% !important; //设置高优先，以覆盖内联样式
  }
}
.expand-table {
  width: 80%;
}
@media (min-width: 1550px) {
  .expand-table {
    width: 100%;
  }
}
</style>

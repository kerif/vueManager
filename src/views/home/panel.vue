<template>
  <div class="panel-container">
    <div class="panel-hint">
      <div>
        <strong>{{ $t('欢迎使用海鸥集运系统') }}</strong>
      </div>
      <div class="flex box-size">
        <div>
          <i class="el-icon-time time" />
          <span
            ><span>{{ $t('北京时间') }}</span
            >: {{ cnDate }}</span
          >
        </div>
        <div>
          <i class="el-icon-time time" />
          <span
            ><span>{{ $t('美东时间') }}</span
            >: {{ usDate }}</span
          >
        </div>
        <div>
          <i class="el-icon-time time" />
          <span
            ><span>{{ $t('欧州中部时间') }}</span
            >:{{ euDate }}</span
          >
        </div>
      </div>
    </div>
    <!-- 顶部快捷方式 -->
    <div class="top-quick">
      <div
        style="cursor: pointer"
        v-for="(item, index) in quickList"
        :key="index"
        @click="$router.push({ path: item.path })"
      >
        <img :src="require(`@/assets/${item.icon}.png`)" alt="" />
        <div>
          <strong>{{ item.name }}</strong>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 16px">
      <el-row>
        <el-col :span="16" style="padding-right: 16px">
          <div>
            <el-row :gutter="20">
              <el-col :span="6" style="padding-right: 8px">
                <div class="grid-content" @click="goNoSign">
                  <div class="flex">
                    <div class="content-size">{{ $t('待签收包裹') }}</div>
                    <div class="content-size2">{{ index_count_data.package_wait_sign }}</div>
                  </div>
                  <div class="box-size information">
                    <div>{{ $t('无人认领') }}:{{ index_count_data.package_no_owner }}</div>
                    <div style="margin-top: 5px">
                      {{ $t('正常预报') }}:{{ index_count_data.package_wait_in_storage }}
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="6" style="padding-left: 6px">
                <div class="grid-content" @click="goOrder('daidabao')">
                  <div class="flex">
                    <div class="content-size">{{ $t('待打包订单') }}</div>
                    <div class="content-size2">{{ index_count_data.order_wait_pick }}</div>
                  </div>
                  <div class="box-size information">
                    <div>
                      {{ $t('待支付') }}:
                      <span style="color: red">{{ index_count_data.order_unpaid }}</span>
                    </div>
                    <div style="margin-top: 5px">
                      {{ $t('待审核') }}:
                      <span style="color: red">{{ index_count_data.order_wait_audit }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="6" style="padding-left: 6px">
                <div class="grid-content" @click="goOrder('daifahuo')">
                  <div class="flex">
                    <div class="content-size">{{ $t('待发货订单') }}</div>
                    <div class="content-size2">{{ index_count_data.order_wait_ship }}</div>
                  </div>
                  <div class="box-size information">
                    <div>{{ $t('未加入发货单') }}:{{ index_count_data.order_no_shipment }}</div>
                    <div style="margin-top: 5px">
                      {{ $t('已加入发货单') }}:{{ index_count_data.order_with_shipment }}
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="6" style="padding-left: 6px">
                <div class="grid-content" @click="goNoExamine">
                  <div class="flex">
                    <div class="content-size">{{ $t('待财务审核') }}</div>
                    <div class="content-size2">{{ index_count_data.wait_review }}</div>
                  </div>
                  <div class="box-size information">
                    <div>{{ $t('订单支付待审核') }}:{{ index_count_data.order_review }}</div>
                    <div style="margin-top: 5px">
                      {{ $t('充值金额待审核') }}:{{ index_count_data.balance_review }}
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- 登录信息 -->
        <el-col :span="8">
          <div class="login-information">
            <div class="flex login-box">
              <div>
                <div style="display: flex; align-items: center">
                  <div style="margin-right: 20px">
                    <span class="mos">{{ me.company_name.charAt(0) }}</span>
                  </div>
                  <div>
                    <div class="content-size2">{{ me.company_name }}</div>
                    <div class="content-size">{{ $store.state.userName }}</div>
                  </div>
                </div>
                <div class="box-size" style="margin-top: 10px">
                  <div>{{ $t('上次登录时间') }}:{{ last_login_at }}</div>
                  <div style="margin-top: 5px">{{ $t('上次登录IP') }}:168.102.1.1</div>
                </div>
              </div>
              <div></div>
              <div style="margin-top: 10px">
                <div
                  class="login-information-count"
                  @click="$router.push({ name: 'reset-password' })"
                >
                  {{ $t('修改密码') }}
                </div>
                <div class="login-information-count" @click="onLogout">{{ $t('退出登录') }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 实况概括 -->
    <div style="margin-bottom: 16px;min-height: 270px">
      <el-row>
        <el-col :span="16" style="padding-right: 16px;height: 270px">
          <div class="title">
            <div class="flex" style="margin-bottom: 15px">
              <div>
                <span class="content-size">{{ $t('实况概括') }}</span>
                <span class="box-size update-time"
                  >{{ $t('更新于') }}{{ realtime.update_at ? realtime.update_at : 0 }}</span
                >
              </div>
              <div>
                <span class="box-size nav-Factual-generalization" @click="hiddenData">
                  <img src="@/assets/conceal.png" class="Factual-generalization-img" alt="" />
                  {{ hiddenDataShow == 'true' ? $t('隐藏数据') : $t('显示数据') }}
                </span>

                <span class="box-size nav-Factual-generalization" @click="copy">
                  <img src="@/assets/copy.png" class="Factual-generalization-imgs" alt="" />
                  {{ $t('复制数据') }}
                </span>
              </div>
            </div>
            <div class="Factual-generalization-content">
              <div class="Factual-generalization-item">
                <div class="flex">
                  <div>
                    <div class="content-size">{{ $t('今日新增用户') }}</div>
                    <div class="content-size2">
                      {{ hiddenDataShow == 'true' ? user.today : '*' }}
                    </div>
                  </div>
                  <div style="border-right: #e8eaec 1px solid; padding-right: 10px">
                    <div class="box-size">
                      {{ $t('昨日') }}:{{ hiddenDataShow == 'true' ? user.yesterday : '*' }}
                    </div>
                    <div class="box-size" style="color: #00bc4b; margin-top: 10px">
                      <span
                        :class="
                          hiddenDataShow == 'true' && user.today - user.yesterday > 0
                            ? 'red-data'
                            : ''
                        "
                        >{{ user.today - user.yesterday < 0 ? '' : '+'
                        }}{{
                          hiddenDataShow == 'true' ? (user.today - user.yesterday).toFixed(2) : '*'
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="Factual-generalization-item">
                <div class="flex">
                  <div>
                    <div class="content-size">{{ $t('本月新增用户') }}</div>
                    <div class="content-size2">
                      {{ hiddenDataShow == 'true' ? user.current_month : '*' }}
                    </div>
                  </div>
                  <div style="border-right: #e8eaec 1px solid; padding-right: 10px">
                    <div class="box-size">
                      {{ $t('上月') }}:{{ hiddenDataShow == 'true' ? user.last_month : '*' }}
                    </div>
                    <div class="box-size" style="color: #00bc4b; margin-top: 10px">
                      <span
                        :class="
                          hiddenDataShow == 'true' && user.current_month - user.last_month > 0
                            ? 'red-data'
                            : ''
                        "
                        >{{ user.current_month - user.last_month < 0 ? '' : '+'
                        }}{{
                          hiddenDataShow == 'true'
                            ? (user.current_month - user.last_month).toFixed(2)
                            : '*'
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="Factual-generalization-item">
                <div class="flex">
                  <div>
                    <div class="content-size">{{ $t('今日收入') }}</div>
                    <div class="content-size2">
                      {{ hiddenDataShow == 'true' ? income.today : '*' }}
                    </div>
                  </div>
                  <div style="border-right: #e8eaec 1px solid; padding-right: 10px">
                    <div class="box-size">
                      {{ $t('昨日') }}:{{ hiddenDataShow == 'true' ? income.yesterday : '*' }}
                    </div>
                    <div class="box-size" style="color: #00bc4b; margin-top: 10px">
                      <span
                        :class="
                          hiddenDataShow == 'true' && income.today - income.yesterday > 0
                            ? 'red-data'
                            : ''
                        "
                        >{{ income.today - income.yesterday < 0 ? '' : '+'
                        }}{{
                          hiddenDataShow == 'true'
                            ? (income.today - income.yesterday).toFixed(2)
                            : '*'
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="Factual-generalization-item">
                <div class="flex">
                  <div>
                    <div class="content-size">{{ $t('今日优惠') }}</div>
                    <div class="content-size2">
                      {{ hiddenDataShow == 'true' ? discount.today : '*' }}
                    </div>
                  </div>
                  <div style="padding-right: 10px">
                    <div class="box-size">
                      {{ $t('昨日') }}:{{ hiddenDataShow == 'true' ? discount.yesterday : '*' }}
                    </div>
                    <div class="box-size" style="color: #00bc4b; margin-top: 10px">
                      <span
                        :class="
                          hiddenDataShow == 'true' && discount.today - discount.yesterday > 0
                            ? 'red-data'
                            : ''
                        "
                        >{{ discount.today - discount.yesterday < 0 ? '' : '+'
                        }}{{
                          hiddenDataShow == 'true'
                            ? (discount.today - discount.yesterday).toFixed(2)
                            : '*'
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="Factual-generalization-item">
                <div class="flex">
                  <div>
                    <div class="content-size">{{ $t('今日支付金额') }}</div>
                    <div class="content-size2">
                      {{ hiddenDataShow == 'true' ? payment.today : '*' }}
                    </div>
                  </div>
                  <div style="border-right: #e8eaec 1px solid; padding-right: 10px">
                    <div class="box-size">
                      {{ $t('昨日') }}:{{ hiddenDataShow == 'true' ? payment.yesterday : '*' }}
                    </div>
                    <div class="box-size" style="color: #00bc4b; margin-top: 10px">
                      <span
                        :class="
                          hiddenDataShow == 'true' && payment.today - payment.yesterday > 0
                            ? 'red-data'
                            : ''
                        "
                        >{{ payment.today - payment.yesterday < 0 ? '' : '+'
                        }}{{
                          hiddenDataShow == 'true'
                            ? (payment.today - payment.yesterday).toFixed(2)
                            : '*'
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="Factual-generalization-item">
                <div class="flex">
                  <div>
                    <div class="content-size">{{ $t('今日充值金额') }}</div>
                    <div class="content-size2">
                      {{ hiddenDataShow == 'true' ? recharge.today : '*' }}
                    </div>
                  </div>
                  <div style="border-right: #e8eaec 1px solid; padding-right: 10px">
                    <div class="box-size">
                      {{ $t('昨日') }}:{{ hiddenDataShow == 'true' ? recharge.yesterday : '*' }}
                    </div>
                    <div class="box-size" style="color: #00bc4b; margin-top: 10px">
                      <span
                        :class="
                          hiddenDataShow == 'true' && recharge.today - recharge.yesterday > 0
                            ? 'red-data'
                            : ''
                        "
                        >{{ recharge.today - recharge.yesterday ? '' : '+'
                        }}{{
                          hiddenDataShow == 'true'
                            ? (recharge.today - recharge.yesterday).toFixed(2)
                            : '*'
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="Factual-generalization-item">
                <div class="flex">
                  <div>
                    <div class="content-size"></div>
                    <div class="content-size2"></div>
                  </div>
                  <div style="border-right: #e8eaec 1px solid; padding-right: 10px">
                    <div class="box-size"></div>
                    <div class="box-size" style="color: #00bc4b; margin-top: 10px"></div>
                  </div>
                </div>
              </div>

              <div class="Factual-generalization-item">
                <div class="flex">
                  <div>
                    <div class="content-size"></div>
                    <div class="content-size2"></div>
                  </div>
                  <div style="padding-right: 10px">
                    <div class="box-size"></div>
                    <div class="box-size" style="color: #00bc4b; margin-top: 10px"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 今日产能 -->
        <el-col style='height: 270px' :span="8">
          <div class="title">
            <div class="flex" style="margin-bottom: 15px">
              <div>
                <span class="content-size">{{ $t('今日产能') }}</span>
                <span class="box-size update-time">{{ $t('更新于') }}{{ product.update_at }}</span>
              </div>
            </div>
            <div class="capacity">
              <div class="capacity-item" style="background-color: #eff0ff">
                <div class="content-size">{{ $t('签收') }}</div>
                <div class="content-size2">{{ product.sign }}</div>
              </div>

              <div class="capacity-item">
                <div class="content-size">{{ $t('上架') }}</div>
                <div class="content-size2">{{ product.shelf_up }}</div>
              </div>

              <div class="capacity-item">
                <div class="content-size">{{ $t('打包') }}</div>
                <div class="content-size2">{{ product.pack }}</div>
              </div>

              <div class="capacity-item">
                <div class="content-size">{{ $t('出库') }}</div>
                <div class="content-size2">{{ product.ship }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 已入库包裹 -->
    <div style="margin-bottom: 16px">
      <el-row>
        <el-col :span="16" style="padding-right: 16px">
          <div style="height: 480px">
            <div class="title">
              <div class="flex" style="margin-bottom: 15px">
                <div>
                  <span class="content-size">{{
                    status === 2
                      ? $t('已入库包裹')
                      : status === 3
                      ? $t('已拣货包裹')
                      : $t('已发货包裹')
                  }}</span>
                  <span class="box-size update-time">{{ $t('更新于') }}{{ packageTime }}</span>
                </div>
                <div style="font-size: 14px">
                  <span
                    v-for="item in getDatasList"
                    :key="item.value"
                    :class="scope == item.value ? 'parcelData parcelDatas' : 'parcelData'"
                    @click="getDatasr(item.value)"
                    >{{ item.name }}</span
                  >

                  <!-- <el-select v-model="scope" @change="getDatas" :placeholder="$t('请选择')">
                <el-option :value="1" :label="$t('近一周')"></el-option>
                <el-option :value="2" :label="$t('近一月')"></el-option>
                <el-option :value="3" :label="$t('近半年')"></el-option>
                <el-option :value="4" :label="$t('全年')"></el-option>
              </el-select> -->
                </div>
                <div>
                  <span class="box-size subheading" @click="$router.push({ name: 'orderlist' })">
                    {{ $t('查看') }}
                    <img src="@/assets/look-over.png" class="subheading-icon" alt="" />
                  </span>
                </div>
              </div>
              <!-- 面板数据 -->
              <div class="panel-box main-item">
                <div>
                  <div class="echarts" id="myChart"></div>
                  <div class="type-list">
                    <div :class="['type-item', status === 2 ? 'select' : '']" @click="onStatus(2)">
                      {{ $t('已入库包裹') }}
                    </div>
                    <div :class="['type-item', status === 3 ? 'select' : '']" @click="onStatus(3)">
                      {{ $t('已拣货包裹') }}
                    </div>
                    <div :class="['type-item', status === 5 ? 'select' : '']" @click="onStatus(5)">
                      {{ $t('已发货包裹') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="12" style="padding-right: 16px">
              <div class="dataOverview">
                <div class="Factual-generalization">
                  <div class="title">
                    <div class="flex" style="margin-bottom: 15px">
                      <div>
                        <span class="content-size">{{ $t('实况概括') }}</span>
                      </div>
                      <div>
                        <span
                          class="box-size subheading"
                          @click="$router.push({ name: 'suggestlist' })"
                        >
                          {{ $t('去处理') }}
                          <img src="@/assets/look-over.png" class="subheading-icon" alt="" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <div class="capacity-item">
                        <div class="content-size">{{ $t('投诉数') }}</div>
                        <div class="content-size2" style="margin-top: 10px">
                          {{ suggestion.count
                          }}<span style="font-size: 15px; color: #ff4c42"
                            >（{{ $t('未处理') }}{{ suggestion.wait_deal }}）</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="Order-evaluation">
                  <div class="title">
                    <div class="flex" style="margin-bottom: 15px">
                      <div>
                        <span class="content-size">{{ $t('订单评价') }}</span>
                      </div>
                      <div>
                        <span
                          class="box-size subheading"
                          @click="$router.push({ name: 'evaluation' })"
                        >
                          {{ $t('去处理') }}
                          <img src="@/assets/look-over.png" class="subheading-icon" alt="" />
                        </span>
                      </div>
                    </div>
                    <!-- 订单评价 -->
                    <div>
                      <div class="charts-order-rate" id="orderRate"></div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <!-- 问题件列表 -->
            <el-col :span="12">
              <div class="issue-List">
                <div class="title">
                  <div class="flex" style="margin-bottom: 5px">
                    <div>
                      <span class="content-size">{{ $t('订单异常件') }}</span>
                    </div>
                    <div>
                      <span
                        class="box-size subheading"
                        @click="$router.push({ name: 'wayBillList', params: { type: 'erro' } })"
                      >
                        {{ $t('去处理') }}
                        <img src="@/assets/look-over.png" class="subheading-icon" alt="" />
                      </span>
                    </div>
                  </div>
                  <div style="overflow-x: auto; height: 415px">
                    <div class="issue-List-item" v-for="item in issueData">
                      <div>{{ $t('会员编号') }}：{{ item.user_id }}</div>
                      <div>{{ $t('订单号') }}：{{ item.express_num }}</div>
                      <!--                      <div>{{ $t('货物状态') }}：破碎</div>-->
                      <div>{{ $t('异常描述') }}：{{ item.exceptional_remark }}</div>
                      <div>{{ $t('提交时间') }}：{{ item.created_at }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- 注册统计 -->
    <div style="margin-bottom: 16px">
      <el-row>
        <el-col :span="16" style="padding-right: 16px">
          <div style="height: 480px">
            <div class="title">
              <div class="flex" style="margin-bottom: 15px">
                <div>
                  <span class="content-size">{{ $t('注册统计') }}</span>
                  <span class="box-size update-time">{{ $t('更新于') }}{{ registerTime }}</span>
                </div>
                <div>
                  <span class="box-size subheading" @click="$router.push({ name: 'reportList' })">
                    {{ $t('查看') }}
                    <img src="@/assets/look-over.png" class="subheading-icon" alt="" />
                  </span>
                </div>
              </div>
              <!-- 面板数据 -->
              <div class="panel-box main-item">
                <div>
                  <el-table
                    :data="tableData"
                    style="width: 100%"
                    border
                    height="calc(480px - 70px)"
                  >
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="days" :label="$t('统计日期')" width="180">
                    </el-table-column>
                    <el-table-column prop="count" :label="$t('注册用户数')" width="180">
                    </el-table-column>
                    <el-table-column prop="email_count" :label="$t('邮箱激活数')">
                    </el-table-column>
                    <el-table-column prop="phone_count" :label="$t('手机号激活数')">
                    </el-table-column>
                    <el-table-column prop="package_count" :label="$t('预报量')"> </el-table-column>
                    <el-table-column prop="conversion_ratio" :label="$t('转化率') + '%'">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="12" style="padding-right: 16px">
              <div class="statistical-data">
                <div class="discount-coupon">
                  <div class="title">
                    <div class="flex" style="margin-bottom: 15px">
                      <div>
                        <span class="content-size">{{ $t('优惠券') }}</span>
                      </div>
                      <div>
                        <span
                          class="box-size subheading"
                          @click="$router.push({ name: 'newUser' })"
                        >
                          {{ $t('查看') }}
                          <img src="@/assets/look-over.png" class="subheading-icon" alt="" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <div class="capacity-item">
                        <div class="charts-discount-coupon" id="discountCoupon">
                          <div class="definable-echarts">
                            <div
                              :style="
                                'width:' +
                                coupon.generate +
                                '%' +
                                ';' +
                                'background-color: #C3EBCA;'
                              "
                            ></div>
                            <div
                              :style="
                                'width:' + coupon.grant + '%' + ';' + 'background-color: #6ED183;'
                              "
                            ></div>
                            <div
                              :style="
                                'width:' + coupon.employ + '%' + ';' + 'background-color: #00BC4B;'
                              "
                            ></div>
                            <div
                              :style="
                                'width:' + coupon.pastDue + '%' + ';' + 'background-color: #C5C5CE;'
                              "
                            ></div>
                          </div>
                          <div class="definable-echarts-data">
                            <div
                              class="definable-echarts-item"
                              v-for="item in discountCouponData"
                              :key="item.name"
                            >
                              <div
                                class="definable-echarts-type"
                                :style="'background:' + item.color"
                              ></div>
                              <div>
                                <div class="definable-echarts-name">{{ item.name }}</div>
                                <div class="definable-echarts-quantity">{{ item.quantity }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="shipping-space">
                  <div class="title">
                    <div class="flex" style="margin-bottom: 15px">
                      <div>
                        <span class="content-size">{{ $t('仓位使用') }}</span>
                      </div>
                      <div>
                        <span
                          class="box-size subheading"
                          @click="$router.push({ name: 'goodsAllocation' })"
                        >
                          {{ $t('查看') }}
                          <img src="@/assets/look-over.png" class="subheading-icon" alt="" />
                        </span>
                      </div>
                    </div>
                    <!-- 仓位使用 -->
                    <div class="freight-space">
                      <div class="definable-echarts">
                        <div
                          :style="
                            'width:' + location.generate + '%' + ';' + 'background-color: #6ED183;'
                          "
                        ></div>
                        <div
                          :style="
                            'width:' + location.grant + '%' + ';' + 'background-color: #00BC4B;'
                          "
                        ></div>
                      </div>
                      <div class="definable-echarts-data">
                        <div
                          class="definable-echarts-item"
                          style="margin-top: 15px"
                          v-for="item in freightSpaceData"
                          :key="item.name"
                        >
                          <div
                            class="definable-echarts-type"
                            :style="'background:' + item.color"
                          ></div>
                          <div>
                            <div class="definable-echarts-name">{{ item.name }}</div>
                            <div class="definable-echarts-quantity">{{ item.quantity }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="definable-echarts">
                        <div
                          :style="
                            'width:' + location.employ + '%' + ';' + 'background-color: #E8EAEC;'
                          "
                        ></div>
                        <div
                          :style="
                            'width:' + location.pastDue + '%' + ';' + 'background-color: #FF3C31;'
                          "
                        ></div>
                      </div>

                      <div class="definable-echarts-data">
                        <div
                          class="definable-echarts-item"
                          style="margin-top: 15px"
                          v-for="item in freightSpaceDatas"
                          :key="item.name"
                        >
                          <div
                            class="definable-echarts-type"
                            :style="'background:' + item.color"
                          ></div>
                          <div>
                            <div class="definable-echarts-name">{{ item.name }}</div>
                            <div class="definable-echarts-quantity">{{ item.quantity }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="statistical-data">
                <div class="discount-coupon">
                  <div class="title">
                    <div class="flex" style="margin-bottom: 15px">
                      <div>
                        <span class="content-size">{{ $t('更新日志') }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="system-notice">
                        <ul class="notice">
                          <li
                            style="cursor: pointer; display: flex; justify-content: space-between"
                            @click="$router.push({ name: 'systemNotice', params: { id: item.id } })"
                            v-for="item in items"
                            :key="item.id"
                          >
                            <div>{{ item.title }}</div>
                            <div class="box-size subheading">
                              {{ $t('查看') }}
                              <img src="@/assets/look-over.png" class="subheading-icon" alt="" />
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="shipping-space">
                  <div class="download-management">
                    <!-- 下载管理 -->
                    <div
                      style="display: flex; padding: 10px 0px; cursor: pointer"
                      @click="goManual('software')"
                    >
                      <div style="margin-right: 10px">
                        <img src="@/assets/download-management.png" alt="" />
                      </div>
                      <div>
                        <div style="font-size: 16px; margin-bottom: 5px">
                          <strong>{{ $t('终端软件下载') }}</strong>
                        </div>
                        <div class="box-size">{{ $t('使用手机、桌面端集运业务') }}</div>
                      </div>
                    </div>

                    <div
                      style="display: flex; padding: 10px 0px; cursor: pointer"
                      @click="goManual('help')"
                    >
                      <div style="margin-right: 10px">
                        <img src="@/assets/operation-manual.png" alt="" />
                      </div>
                      <div style="flex: 1">
                        <div
                          style="
                            font-size: 16px;
                            margin-bottom: 5px;
                            display: flex;
                            justify-content: space-between;
                          "
                        >
                          <strong>{{ $t('操作手册') }}</strong>
                          <span
                            style="cursor: pointer; color: #1f6dff; font-size: 16px"
                            @click.stop="goTutorial"
                            >{{ $t('视频教程') }}</span
                          >
                        </div>
                        <div class="box-size">{{ $t('海鸥集运系统操作使用手册') }}</div>
                      </div>
                    </div>

                    <div
                      style="display: flex; padding: 10px 0px; cursor: pointer"
                      @click="followWx"
                    >
                      <div style="margin-right: 10px">
                        <img src="@/assets/attention.png" alt="" />
                      </div>
                      <div>
                        <div style="font-size: 16px; margin-bottom: 5px">
                          <strong>{{ $t('关注【海鸥集运系统】') }}</strong>
                        </div>
                        <div class="box-size">{{ $t('分享操作技巧、集运运营干货') }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- 本月统计数据 -->
    <!-- <el-row>
      <el-col :span="6" style="padding-right: 5px">
        <div class="addCustomer add-line blue-sty" @click="goToOtherPage(301, 'viplist')">
          <div class="box-header box-user">
            <el-row>
              <el-col :span="20">
                <div class="user-count">{{ $t('本月新增客户') }}</div>
                <div class="bold-box user-count">{{ user.current_month }}</div>
              </el-col>
              <el-col :span="4">
                <div class="icon-sty">
                  <i class="iconfont icon-gerenzhongxin icons-first"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-footer">
            <div class="user-count user-left">{{ $t('总用户') }}</div>
            <div class="count user-count user-right">{{ user.total }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="padding-right: 5px">
        <div class="addCustomer add-line yellow-sty" @click="goToOtherPage(401, 'orderlist')">
          <div class="box-header box-package">
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="package-count">{{ $t('本月预报包裹') }}</div>
                <div class="bold-box package-count">{{ packages.current_month }}</div>
              </el-col>
              <el-col :span="4" class="over-sty">
                <div class="icon-packages">
                  <i class="iconfont icon-hezi icons"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-footer">
            <span class="package-count user-left">{{ $t('总包裹量') }}</span>
            <span class="count package-count user-right">{{ packages.total }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="padding-right: 5px">
        <div class="addCustomer add-line green-sty" @click="goToOtherPage(402, 'wayBillList')">
          <div class="box-header box-order">
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="total-sty">{{ $t('本月新增订单') }}</div>
                <div class="bold-box total-sty">{{ order.current_month }}</div>
              </el-col>
              <el-col :span="4" class="over-sty">
                <div class="icon-order">
                  <i class="iconfont icon-ziliao icons-second"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-footer">
            <div class="total-sty user-left">{{ $t('总订单') }}</div>
            <div class="count total-sty user-right">{{ order.total }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="addCustomer light-blue">
          <div class="box-header box-open" @click="$router.push({ name: 'linelist' })">
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="open-sty">{{ $t('系统开放线路') }}</div>
                <div class="bold-box open-sty">{{ expressCount }}</div>
              </el-col>
              <el-col :span="4" class="over-sty">
                <div class="icon-express">
                  <i class="iconfont icon-ditu icons-third"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-footer" @click="goToOtherPage(502, 'shipContainer')">
            <div class="open-sty user-left">{{ $t('总发货单数') }}</div>
            <div class="count open-sty user-right">{{ shipment.total }}</div>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <!-- <div style="margin-top: 10px">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="wait-content">
            <div style="cursor: pointer" @click="$router.push({ name: 'orderlist', query: { activeName: '1' } })">
              <div class="wait-sty">
                <i class="iconfont icon-icon_rukou icon-weight"></i>
                <span class="wait-font">{{ $t('待入库包裹') }}</span>
              </div>
              <span class="number">{{
                count.package_wait_in_storage ? count.package_wait_in_storage : 0
              }}</span>
            </div>
            <div style="cursor: pointer" @click="$router.push({ name: 'wayBillList', query: { activeName: '1' } })">
              <div class="wait-sty">
                <i class="iconfont icon-huowudui icon-weight"></i>
                <span class="wait-font">{{ $t('待打包订单') }}</span>
              </div>
              <span class="number">{{ count.order_wait_pick ? count.order_wait_pick : 0 }}</span>
            </div>
            <div style="cursor: pointer" @click="$router.push({ name: 'wayBillList', query: { activeName: '3' } })">
              <div class="wait-sty">
                <i class="iconfont icon-icon_fabu icon-weight"></i>
                <span class="wait-font">{{ $t('待发货订单') }}</span>
              </div>
              <span class="number">{{ count.order_wait_ship ? count.order_wait_ship : 0 }}</span>
            </div>
            <div style="cursor: pointer" @click="$router.push({ name: 'orderReview', query: { activeName: '0' } })">
              <div class="wait-sty">
                <i class="iconfont icon-tianshenpi icon-weight"></i>
                <span class="wait-font">{{ $t('待审核付款') }}</span>
              </div>
              <span class="number">{{ count.order_wait_audit ? count.order_wait_audit : 0 }}</span>
            </div>
            <div style="cursor: pointer" @click="$router.push({ name: 'suggestlist' })">
              <div style="margin-bottom: 5px">
                <i class="iconfont icon-kefu icon-weight"></i>
                <span class="wait-font">{{ $t('待处理投诉') }}</span>
              </div>
              <span class="number">{{
                count.suggestion_wait_deal ? count.suggestion_wait_deal : 0
              }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12" style="padding-left: 1px">
          <div class="order-search">
            <div class="order-main">
              <div class="search-sty">
                <el-select v-model="expressType" :placeholder="$t('请选择')">
                  <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <el-input class="input-button" v-if="expressType" v-model="expressNumber" @keyup.enter.native="goExpress">
                <el-button style="color: #ccc; background-color: #3540a5; border-radius: 0" slot="append" @click.native="goExpress">{{ $t('物流查询') }}</el-button>
              </el-input>
            </div>
          </div>
        </el-col>
      </el-row>
    </div> -->
    <!-- <el-row :gutter="20" class="package-chart" type="flex">
      <el-col :span="13" style="height: 100%; padding-right: 0 !important"> -->
    <!-- 面板数据 -->
    <!-- <div class="panel-box main-item">
          <div class="show-box">
            <div class="show-list">
              <span class="package-text">{{
                status === 2 ? $t('已入库包裹') : status === 3 ? $t('已拣货包裹') : $t('已发货包裹')
              }}</span>
              <el-select v-model="scope" @change="getDatas" :placeholder="$t('请选择')">
                <el-option :value="1" :label="$t('近一周')"></el-option>
                <el-option :value="2" :label="$t('近一月')"></el-option>
                <el-option :value="3" :label="$t('近半年')"></el-option>
                <el-option :value="4" :label="$t('全年')"></el-option>
              </el-select>
            </div>
            <div class="echarts" id="myChart"></div>
            <div class="type-list">
              <div :class="['type-item', status === 2 ? 'select' : '']" @click="onStatus(2)">
                {{ $t('已入库包裹') }}
              </div>
              <div :class="['type-item', status === 3 ? 'select' : '']" @click="onStatus(3)">
                {{ $t('已拣货包裹') }}
              </div>
              <div :class="['type-item', status === 5 ? 'select' : '']" @click="onStatus(5)">
                {{ $t('已发货包裹') }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="11" style="height: 100%">
        <div class="package-main">
          <div class="show-list">
            <span class="package-text">{{ $t('订单概览') }}</span>
            <el-select v-model="days" @change="getPie" :placeholder="$t('请选择')">
              <el-option :value="1" :label="$t('今天')"></el-option>
              <el-option :value="7" :label="$t('近7天')"></el-option>
              <el-option :value="30" :label="$t('近30天')"></el-option>
            </el-select>
          </div>
          <ul>
            <li v-for="(item, index) in pieData" :key="index" class="main-first">
              <div v-if="item.name === 'all'">
                <p>{{ $t('全部') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'wait_pack'">
                <p class="no-warehouse warning-sty">{{ $t('待处理') }}</p>
                <p class="no-warehouse warning-sty">
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'wait_payment'">
                <p>{{ $t('待支付') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'wait_shipped'">
                <p class="no-warehouse warning-sty">{{ $t('待发货') }}</p>
                <p class="no-warehouse warning-sty">
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'shipped'">
                <p>{{ $t('已发货') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'received'">
                <p>{{ $t('已签收') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'invalid'">
                <p>{{ $t('作废订单') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
            </li>
          </ul>
          <div class="charts-content">
            <div class="charts-left" id="chartsFirst"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="bottom">
      <el-col :span="8">
        <div class="process">
          <span class="title">{{ $t('操作流程') }}</span>
          <div class="process-content">
            <div>
              <img src="../../assets/1.png" alt="" />
              <p>{{ $t('包裹预报') }}</p>
            </div>
            <span class="line"></span>
            <div>
              <img src="../../assets/2.png" alt="" />
              <p>{{ $t('包裹入库') }}</p>
            </div>
            <span class="line"></span>
            <div>
              <img src="../../assets/4.png" alt="" />
              <p>{{ $t('订单打包') }}</p>
            </div>
            <span class="line"></span>
            <div>
              <img src="../../assets/5.png" alt="" />
              <p>{{ $t('订单发货') }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="5" class="other-sty">
        <div class="other">
          <div class="process-content user-actions">
            <div @click="$router.push({ name: 'newUser' })" style="cursor: pointer">
              <img src="../../assets/用户福利.png" alt="" />
              <p>{{ $t('用户福利') }}</p>
            </div>
            <div @click="$router.push({ name: 'Public' })" style="cursor: pointer">
              <img src="../../assets/公告管理.png" alt="" />
              <p>{{ $t('公告管理') }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="help-center">
          <span class="title">{{ $t('帮助中心') }}</span>
          <div class="process-content">
            <div @click="goManual('help')" style="cursor: pointer">
              <img src="../../assets/操作手册.png" alt="" />
              <p>{{ $t('操作手册') }}</p>
            </div>
            <div @click="goManual('software')" style="cursor: pointer">
              <img src="../../assets/软件下载.png" alt="" />
              <p>{{ $t('软件下载') }}</p>
            </div>
            <div @click="goVideo" style="cursor: pointer">
              <img src="../../assets/视频教程.png" alt="" />
              <p>{{ $t('视频教程') }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="5" style="padding-left: 0 !important">
        <div class="system">
          <span class="title" @click="$router.push({ name: 'updateList' })">{{
            $t('更新日志')
          }}</span>
          <div class="system-notice">
            <ul class="notice">
              <li style="cursor: pointer" @click="$router.push({ name: 'systemNotice', params: { id: item.id } })" v-for="item in items" :key="item.id">
                {{ item.title }}
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <el-dialog
      :visible.sync="showTips"
      :title="$t('系统配置助手')"
      class="dialog-start-loading"
      width="45%"
    >
      <div class="loading-top">
        <span>{{ $t('亲爱的用户') }}</span
        ><br />
        <span>{{ $t('首次系统使用需要完成以下配置才能正常上线运营') }}</span>
      </div>
      <div class="loading-bottom">
        <div v-for="item in updateProp" :key="item.type_id" class="service">
          <div class="serviceLeft">
            <el-checkbox v-model="item.is_finished">{{ item.content }}</el-checkbox>
          </div>
          <div class="serviceRight" @click="goRouter(item.type_id, item.route)">
            <!-- <span>{{item.route}}</span> -->
            <!-- <router-link :to="`/${item.route}`" class="chooseOrder" @click="finishedGuides(item.type_id)">去配置</router-link> -->
            {{ $t('去配置') }}
          </div>
        </div>
      </div>
      <div class="not-btn">
        <el-button @click="notMind" class="btn-light-red">{{ $t('不再提示') }}</el-button>
      </div>
    </el-dialog>
    <!-- 查询物流 -->
    <el-dialog :visible.sync="trackingVisible" class="express-dialog-container" size="small">
      <div class="express-content" v-loading="$store.state.btnLoading">
        <div v-if="TrackingData.length">
          <div class="content-top">
            <div class="time">{{ $t('时间') }}</div>
            <div style="padding-left: 2em">{{ $t('跟踪进度') }}</div>
          </div>
          <ul class="result-list">
            <li
              :class="{ 'last-finish': index === 0 }"
              v-for="(item, index) in TrackingData"
              :key="index"
            >
              <div class="time">{{ item.ftime }}</div>
              <div class="dot">
                <span class="out-dot dot-box"> </span>
                <span class="in-dot dot-box"></span>
              </div>
              <div class="text">{{ item.context }}</div>
            </li>
          </ul>
        </div>
        <div class="empty-box" v-else>
          <img src="../../assets/empty.png" />
          <div>{{ $t('暂无物流消息') }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 操作手册下载 -->
    <el-dialog :visible.sync="helpVisible" :title="$t('操作手册下载')" width="60%">
      <div
        v-for="(item, index) in helpData"
        :key="index"
        class="book-sty"
        @click="chooseManual(item)"
        @mouseover="changeSty($event)"
        @mouseleave="removeSty($event)"
      >
        <div style="padding-top: 10px">
          <div>
            <img src="../../assets/book.jpg" />
          </div>
          <div>
            <i class="iconfont icon-xiazai upload-sty"></i>
          </div>
        </div>
        <div class="file-sty">{{ item.filename }}</div>
        <span>{{ item.updated_at }}</span>
      </div>
    </el-dialog>
    <!-- 软件下载 -->
    <el-dialog :visible.sync="appVisible" :title="$t('软件下载')" width="60%">
      <div
        class="book-sty"
        @click="uploadDesktop"
        @mouseover="changeSty($event)"
        @mouseleave="removeSty($event)"
      >
        <p>{{ $t('集运系统仓库桌面软件') }}</p>
        <div>
          <div>
            <i class="iconfont icon-diannaofuben desktop-sty"></i>
          </div>
          <div style="margin-top: 10px">
            <i class="iconfont icon-xiazai upload-sty"></i>
          </div>
        </div>
        <span>{{ $t('前往下载') }}</span>
      </div>
      <div
        class="book-sty"
        @click="uploadAndroid"
        @mouseover="changeApp($event)"
        @mouseleave="removeSty($event)"
      >
        <p>{{ $t('集运系统运营APP（安卓版）') }}</p>
        <div>
          <div @mouseover="getImg('android')">
            <i class="iconfont icon-anzhuo anzhuo-sty"></i>
            <!-- <img src="../../assets/book.jpg" /> -->
          </div>
          <div style="margin-top: 10px">
            <i class="iconfont icon-xiazai upload-sty"></i>
          </div>
        </div>
        <span>{{ $t('前往下载') }}</span>
      </div>
      <div
        class="book-sty"
        @click="uploadIos"
        @mouseover="changeSty($event)"
        @mouseleave="removeSty($event)"
      >
        <p>{{ $t('集运系统运营APP（iOS版）') }}</p>
        <div>
          <div @mouseover="getImg('ios')">
            <i class="iconfont icon-pingguo ios-sty"></i>
            <!-- <img src="../../assets/book.jpg" /> -->
          </div>
          <div style="margin-top: 10px">
            <i class="iconfont icon-xiazai upload-sty"></i>
          </div>
        </div>
        <span>{{ $t('前往下载') }}</span>
      </div>
      <el-dialog
        width="30%"
        :title="
          uplodaStatus === 'ios' ? $t('集运系统运营APP（iOS版）') : $t('集运系统运营APP（安卓版）')
        "
        :visible.sync="innerVisible"
        append-to-body
      >
        <div style="text-align: center">
          <img v-if="uplodaStatus === 'ios'" src="../../assets/ios.png" />
          <div v-else>
            <img src="../../assets/android.png" />
            <div>
              <span style="font-weight: bold">{{ $t('提示') }}：</span>
              <span>{{
                $t('微信扫码请点击打开页面右上角选择在浏览器中打开或直接使用浏览器扫码')
              }}</span>
            </div>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import dialog from '@/components/dialog'
import { formatWeek, formatMonth } from '@/utils'
import string from '../language/string.vue'
export default {
  components: { string },
  name: 'panel',
  data() {
    return {
      cnDate: '',
      usDate: '',
      packageTime: '',
      registerTime: '',
      euDate: '',
      shipment: {
        current_month: 0,
        total: 0
      },
      packages: {
        current_month: 0,
        total: 0
      },
      order: {
        current_month: 0,
        total: 0
      },
      waitInStorage: 0,
      waitPack: 0,
      upaid: 0,
      scope: 1,
      myChart: '',
      status: 2,
      option: '',
      orderRateOption: '',
      orderRateChart: '',
      cakeOption: '',
      showTips: false,
      updateProp: [],
      types: [],
      moreTips: '',
      items: [],
      cakeChart: '',
      pieData: [],
      days: 7,
      begin: '',
      end: '',
      trackingVisible: false,
      TrackingData: [],
      options: [
        {
          id: 1,
          name: this.$t('订单号')
        },
        {
          id: 2,
          name: this.$t('物流单号')
        }
      ],
      expressType: 1,
      expressNumber: '',
      expressCount: '',
      count: {},
      realtime: {}, //实况概括数据
      user: {}, //用户数据
      income: {}, //收入
      discount: {}, //今日优惠
      payment: {}, //今日支付金额
      recharge: {}, //今日充值金额
      product: {}, //今日产能
      suggestion: {}, //投诉数
      comment: {}, //订单评价
      coupon: {}, //优惠券
      location: {}, //仓位使用
      data_pick: {}, //待打包包裹
      index_count_data: {}, //订单和包裹模块数据
      helpVisible: false,
      optionStatus: '',
      helpData: [],
      optionsHelp: {},
      appVisible: false,
      innerVisible: false,
      uplodaStatus: '',
      quickList: [
        {
          name: this.$t('运费试算'),
          path: '/order/freight',
          icon: 'trialFreight'
        },
        {
          name: this.$t('物流查询'),
          path: '/station/tracking',
          icon: 'Recruitment'
        },
        {
          name: this.$t('包裹列表'),
          path: '/order/orderlist',
          icon: 'waybill_list'
        },
        {
          name: this.$t('快速入库'),
          path: '/station/warehouseOrder',
          icon: 'home_storage'
        },
        {
          name: this.$t('订单列表'),
          path: '/order/waybill_list',
          icon: 'waybill_list (2)'
        },
        {
          name: this.$t('公告管理'),
          path: '/customer/Public',
          icon: 'Public'
        },
        {
          name: this.$t('用户福利'),
          path: '/marketing/new',
          icon: 'Userwelfare'
        },
        {
          name: this.$t('仓位概览'),
          path: '/goodsAllocation/echarts',
          icon: 'goodsAllocation'
        },
        {
          name: this.$t('评价管理'),
          path: '/customer/evaluation',
          icon: 'evaluation'
        }
      ],
      getDatasList: [
        {
          name: this.$t('近一周'),
          value: 1
        },
        {
          name: this.$t('近一月'),
          value: 2
        },
        {
          name: this.$t('近半年'),
          value: 3
        },
        {
          name: this.$t('全年'),
          value: 4
        }
      ],
      tableData: [],
      discountCouponData: [],
      freightSpaceData: [],
      freightSpaceDatas: [],
      hiddenDataShow: '',
      last_login_at: '',
      issueData: [],
      me: {
        company_name:''
      }
      // systemData: []
    }
  },
  created() {
    this.getNumbers()
    this.getDatas()
    this.getStatus() // 获取是否显示弹窗
    this.getSystem()
    // this.getPie()
    this.checkExpired()
    this.getMe()
  },
  mounted() {
    window.setInterval(() => {
      this.getZoneTime(8)
      this.getZoneTime(-5)
      this.getZoneTime(1)
    }, 1000)
    this.getPanelData()
    this.getErrorInfo()
    this.getHomeData()
    this.getRegister()
    this.checkUser()
    this.getTimes()
    this.myChart = echarts.init(document.getElementById('myChart'))
    // window.onresize = this.myChart.resize
    this.option = {
      // legend: {
      //   left: 0,
      //   width: '100%'
      // },
      // 提示框
      tooltip: {
        trigger: 'axis'
        // axisPointer: {
        //   type: 'cross',
        //   label: {
        //     backgroundColor: '#6a7985'
        //   }
        // }
      },
      // toolbox: {
      //   show: false
      // },
      // grid: {
      //   left: '3%',
      //   right: '4%',
      //   bottom: '3%',
      //   containLabel: true
      // },
      yAxis: [
        {
          type: 'value',
          // minInterval: 1
          boundaryGap: [0, '30%'],
          splitLine: {
            lineStyle: {
              type: 'dashed' // y轴分割线类型
            }
          }
        }
      ]
      // color: ['#E5E7FB'],
      // textStyle: {
      //   fontWeight: 'bold'
      // }
    }
    // 订单评价饼图
    this.orderRateChart = echarts.init(document.getElementById('orderRate'))
    this.orderRateOption = {
      backgroundColor: '#ffffff',
      color: ['#F7BF17', '#00BC4B', '#F69999', '#FF3C31'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      }
    }
    // 包裹饼图
    // this.cakeChart = echarts.init(document.getElementById('chartsFirst'))
    // // window.onresize = this.cakeChart.resize
    // this.cakeOption = {
    //   backgroundColor: '#ffffff',
    //   color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
    //   tooltip: {
    //     trigger: 'item',
    //     formatter: '{a} <br/>{b}: {c} ({d}%)'
    //   }
    // }
    window.addEventListener('resize', () => {
      this.myChart.resize()
      //this.cakeChart.resize()
      this.orderRateChart.resize()
    })
  },
  computed: {
    isPermissionFilterArr() {
      return this.$store.state.isPermissionFilterArr
    },
    systemData() {
      return this.items.slice(0, 10)
    }
  },
  methods: {
    getMe() {
      this.$request.aboutMe().then(res => {
        if (res.ret) {
          this.me.company_name = res.data.company_name
        }
      })
    },
    //关注公众号
    followWx() {
      dialog({ type: 'followWx' }, () => {
        console.log('ccc')
      })
    },
    //跳转到视频教程
    goTutorial() {
      window.open(
        'https://www.douyin.com/user/MS4wLjABAAAAeXrbw1-Iyj0qJbrqf-qpnBcwgQdRFpN0EzKykvs7PxZgtvzgFrP3Ka0HoYjz-i-B?relation=2'
      )
    },
    //获取订单模块信息
    getPanelData() {
      this.$request.getPanelData().then(res => {
        this.index_count_data = res.data
      })
    },
    //货区异常件信息
    getErrorInfo() {
      this.$request.getErroInfo().then(res => {
        if (res.ret) {
          this.issueData = res.data
        }
      })
    },
    goNoSign() {
      this.$router.push({ name: 'orderlist', params: { type: 'noSign' } })
    },
    goOrder(name) {
      this.$router.push({ name: 'wayBillList', params: { type: name } })
    },
    goNoExamine() {
      this.$router.push({ name: 'orderReview' })
    },
    hiddenData() {
      let dataShow = localStorage.getItem('DataShow')
      if (dataShow == 'true') {
        localStorage.setItem('DataShow', false)
      } else {
        localStorage.setItem('DataShow', true)
      }
      this.hiddenDataShow = localStorage.getItem('DataShow')
    },
    checkUser() {
      this.$request.aboutMe().then(res => {
        if (res.ret) {
          this.last_login_at = res.data.last_login_at
        }
      })
    },
    formDate(val) {
      if (val < 10) {
        return '0' + val
      } else {
        return val
      }
    },
    getZoneTime(offset) {
      const formDate = this.formDate
      // 取本地时间
      var localtime = new Date()
      // 取本地毫秒数
      var localmesc = localtime.getTime()
      var localOffset = localtime.getTimezoneOffset() * 60000
      var utc = localOffset + localmesc
      // 得到指定时区时间
      var calctime = utc + 3600000 * offset
      var nd = new Date(calctime)
      const year = nd.getFullYear()
      const month = nd.getMonth() + 1
      const day = nd.getDate()
      const hours = nd.getHours()
      const minutes = nd.getMinutes()
      const seconds = nd.getSeconds()
      if (offset === 8) {
        this.cnDate = `${year}-${formDate(month)}-${formDate(day)} ${formDate(hours)}:${formDate(
          minutes
        )}:${formDate(seconds)}`
      } else if (offset === 1) {
        this.euDate = `${year}-${formDate(month)}-${formDate(day)} ${formDate(hours)}:${formDate(
          minutes
        )}:${formDate(seconds)}`
      } else {
        this.usDate = `${year}-${formDate(month)}-${formDate(day)} ${formDate(hours)}:${formDate(
          minutes
        )}:${formDate(seconds)}`
      }
    },
    getTimes() {
      var localtime = new Date()
      const formDate = this.formDate
      const year = localtime.getFullYear()
      const month = localtime.getMonth() + 1
      const day = localtime.getDate()
      const hours = localtime.getHours()
      const minutes = localtime.getMinutes() - 1
      const seconds = localtime.getSeconds()
      this.packageTime = `${year}-${formDate(month)}-${formDate(day)} ${formDate(hours)}:${formDate(
        minutes
      )}:${formDate(seconds)}`
      this.registerTime = `${year}-${formDate(month)}-${formDate(day - 1)} 0:5:00`
    },
    //检查系统是否快过期
    checkExpired() {
      dialog({ type: 'systemExpired' })
    },
    getHomeData() {
      this.$request.homeData().then(res => {
        if (res.ret) {
          this.count = res.data
          this.realtime = res.data.realtime
          this.user = res.data.realtime.user
          this.income = res.data.realtime.income
          this.discount = res.data.realtime.discount
          this.payment = res.data.realtime.payment
          this.recharge = res.data.realtime.recharge
          this.product = res.data.product
          this.suggestion = res.data.suggestion
          this.getShippingSpace(res.data.location)
          this.discountCoupon(res.data.coupon)
          this.getOrderEvaluationPie()
          if (localStorage.getItem('DataShow')) {
            localStorage.getItem('DataShow')
          } else {
            localStorage.setItem('DataShow', true)
          }
          this.hiddenDataShow = localStorage.getItem('DataShow')
        }
      })
    },
    copy() {
      const input = document.createElement('input')
      document.body.appendChild(input)
      let code = `今日新增用户:${this.user.today},本月新增用户:${this.user.current_month},今日收入:${this.income.today},今日优惠:${this.discount.today},今日支付金额:${this.payment.today},今日充值金额:${this.recharge.today},`
      input.setAttribute('value', code)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    },
    getRegister() {
      let params = {
        page: 1,
        size: 10
      }
      this.$request.getUserRegister(params).then(res => {
        if (res.ret) {
          this.tableData = res.data
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    discountCoupon(data) {
      let { all, issued, used, expired } = data
      this.discountCouponData.push(
        {
          name: this.$t('已生成'),
          quantity: all,
          color: '#C3EBCA'
        },
        {
          name: this.$t('已发放'),
          quantity: issued,
          color: '#6ED183'
        },
        {
          name: this.$t('已使用'),
          quantity: used,
          color: '#00BC4B'
        },
        {
          name: this.$t('已过期'),
          quantity: expired,
          color: '#C5C5CE'
        }
      )
      let total = (all + issued + used + expired) / 100
      let generate = all / total
      let grant = issued / total
      let employ = used / total
      let pastDue = expired / total
      this.coupon = {
        generate,
        grant,
        employ,
        pastDue
      }
    },
    //仓位使用
    getShippingSpace(data) {
      let { all, used, shelf_up_packages, expired_packages } = data
      this.freightSpaceData.push(
        {
          name: this.$t('已生成仓位'),
          quantity: all,
          color: '#6ED183'
        },
        {
          name: this.$t('已使用仓位'),
          quantity: used,
          color: '#00BC4B'
        }
      )
      this.freightSpaceDatas.push(
        {
          name: this.$t('已上架包裹'),
          quantity: shelf_up_packages,
          color: '#E8EAEC'
        },
        {
          name: this.$t('已超期包裹'),
          quantity: expired_packages,
          color: '#FF3C31'
        }
      )
      let total = (all + used) / 100
      let totals = (shelf_up_packages + expired_packages) / 100
      let generate = all / total
      let grant = used / total
      let employ = shelf_up_packages / totals
      let pastDue = expired_packages / totals
      this.location = {
        generate,
        grant,
        employ,
        pastDue
      }
    },
    // 获取上面的统计数据
    getNumbers() {
      this.$request.getIndexNumber().then(res => {
        if (res.ret) {
          this.data_pick = res.data
          //this.count = res.data
          // this.user = res.data.user
          // this.shipment = res.data.shipment
          // this.packages = res.data.package
          // this.expressCount = res.data.express_line_count
          // this.order = res.data.order
          // this.waitInStorage = res.data.package_wait_in_storage
          // this.waitPack = res.data.order_wait_pick
          // this.upaid = res.data.order_unpaid
        }
      })
    },
    // 选择包裹类型
    onStatus(status) {
      this.status = status
      this.getDatas()
    },
    // 客户端下载
    checkAbout() {
      dialog({ type: 'aboutCheck' })
    },
    // 获取系统通知
    getSystem() {
      this.$request.getSystem().then(res => {
        if (res.ret) {
          this.items = res.data
        }
      })
    },
    checkSystem(id) {
      this.$router.push({
        name: 'systemNotice',
        params: {
          id: id
        }
      })
    },
    // 获取图表数据
    getDatas() {
      this.$request
        .getIndexData({
          scope: this.scope,
          status: this.status
        })
        .then(res => {
          if (res.ret) {
            // 横坐标显示数据
            let xData = res.data.map(item => {
              if (this.scope === 1 || this.scope === 2) {
                return formatWeek(item.days)
              } else {
                return formatMonth(item.months)
              }
            })
            // 纵坐标显示数据
            let yData = res.data.map(item => item.count)
            this.option.xAxis = [
              {
                type: 'category',
                boundaryGap: false,
                data: xData
              }
            ]
            this.option.series = [
              {
                type: 'line',
                stack: this.$t('总量'),
                symbol: 'none',
                // areaStyle: {},
                smooth: true,
                data: yData,
                lineStyle: {
                  color: '#223CC5',
                  width: 3
                  // normal: {
                  // }
                },
                areaStyle: {
                  normal: {
                    color: '#DFE2FF'
                  }
                }
                // itemStyle: {
                //   normal: {
                //     borderColor: '#9FA4D5'
                //   }
                // }
              }
            ]
            this.myChart.setOption(this.option)
          }
        })
    },
    getDatasr(val) {
      this.scope = val
      this.getDatas()
    },
    //获取优惠券图
    // getDiscountCouponChart() {

    // },
    //订单评价饼图
    getOrderEvaluationPie() {
      this.$nextTick(() => {
        let { five, four, others, three } = this.count.comment
        this.orderRateOption.legend = {
          top: 'bottom',
          textStyle: {
            fontSize: 12
          },
          itemWidth: 10,
          data: [this.$t('五星'), this.$t('四星'), this.$t('三星'), this.$t('三星以下')]
        }
        this.orderRateOption.series = [
          {
            name: '订单评价概览',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              { value: five, name: '五星' },
              { value: four, name: '四星' },
              { value: three, name: '三星' },
              { value: others, name: '三星以下' }
            ]
          }
        ]
        this.orderRateChart.setOption(this.orderRateOption)
      })
    },
    // 包裹饼图数据
    getPie() {
      let params = {
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.getOrderPie(params).then(res => {
        if (res.ret) {
          this.pieData = res.data
          const obj = {
            wait_pack: this.$t('待处理'),
            wait_payment: this.$t('待支付'),
            wait_shipped: this.$t('待发货'),
            shipped: this.$t('已发货'),
            received: this.$t('已签收'),
            invalid: this.$t('作废订单')
          }
          let pieOrderList = res.data
            .filter(item => {
              return item.name !== 'all'
            })
            .map(item => {
              return {
                value: item.counts,
                name: obj[item.name]
              }
            })
          this.cakeOption.legend = {
            orient: 'vertical',
            left: 10,
            data: [
              this.$t('待处理'),
              this.$t('待支付'),
              this.$t('待发货'),
              this.$t('已发货'),
              this.$t('已签收'),
              this.$t('作废订单')
            ]
          }
          this.cakeOption.series = [
            {
              name: '包裹概览',
              type: 'pie',
              radius: ['50%', '70%'],
              label: {
                formatter: ' {d}% '
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: pieOrderList
            }
          ]
          this.cakeChart.setOption(this.cakeOption)
        }
      })
    },
    goToOtherPage(permissionNumber, routerName, query = {}) {
      if (!this.isPermissionFilterArr.includes(permissionNumber)) {
        this.$message({
          type: 'error',
          message: this.$t('当前操作暂无权限')
        })
      } else {
        this.$router.push({ name: routerName, query: query })
      }
    },
    // 查询运费
    goFreight() {
      this.$router.push({ name: 'freight' })
    },
    // 获取是否显示弹窗
    getStatus() {
      this.$request.tipStatus().then(res => {
        if (res.ret) {
          this.moreTips = res.data.no_more_tips
          if (this.moreTips === 0) {
            this.showTips = true
            this.getGuides() // 获取弹窗数据
          }
        }
      })
    },
    goExpress() {
      if (this.expressType === 1) {
        this.$request
          .goTracking({
            order_sn: this.expressNumber
          })
          .then(res => {
            if (res.ret) {
              this.trackingVisible = true
              this.TrackingData = res.data.data
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else if (this.expressType === 2) {
        this.$request
          .goTracking({
            track_no: this.expressNumber
          })
          .then(res => {
            if (res.ret) {
              this.trackingVisible = true
              console.log(res.data.data, 'res.data.data')
              this.TrackingData = res.data.data
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

    onLogout() {
      this.$confirm(this.$t('是否确认退出登录'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.logout().then(res => {
          if (res.ret) {
            this.$store.commit('saveFileterAfterRouterMap', {
              fileterAfterRouterMap: [],
              isPermissionFilter: []
            })
            this.$store.commit('savePermissionStatus', false)
            this.$store.commit('removeToken')
            this.$router.replace({ name: 'login' })
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: this.$t('退出失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
      // .catch(() => {})
      // .finally(() => {
      //   resetRouter()
      // })
    },
    // 获取弹窗数据
    getGuides() {
      this.$request.getGuides().then(res => {
        if (res.ret) {
          res.data.forEach(items => {
            items.is_finished = !!items.is_finished
            if (items.type_id === 2) {
              items.route = 'config/line'
            } else if (items.type_id === 3) {
              items.route = 'config/configuration-more?activeName=4&secondTab4=2'
            } else if (items.type_id === 4) {
              items.route = 'config/configuration-more?activeName=1&secondTab4=2&secondTab1=3'
            } else if (items.type_id === 5) {
              items.route =
                'config/configuration-more?activeName=2&secondTab4=5&secondTab1=7&secondTab3=1&secondTab2=4'
            }
          })
          this.updateProp = res.data
        }
      })
    },
    finishedGuides(id) {
      console.log(id, 'type_id')
    },
    goRouter(id, route) {
      this.showTips = false
      this.$request.updateGuides(id)
      this.$router.push(`/${route}`)
    },
    // 弹窗 不再提示
    notMind() {
      this.$request.noTips().then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.showTips = false
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 帮助中心
    goManual(status) {
      this.optionStatus = status
      if (status === 'help') {
        this.helpVisible = true
        this.getHelp()
      } else {
        this.appVisible = true
      }
    },
    // 获取操作手册数据
    getHelp() {
      this.$request.optionsManual().then(res => {
        if (res.ret) {
          this.helpData = res.data
        }
      })
    },
    chooseManual(item) {
      // this.optionsHelp = item
      window.open(item.url)
    },
    changeSty($event) {
      $event.currentTarget.className = 'book-sty boxShadow'
    },
    removeSty($event) {
      $event.currentTarget.className = 'book-sty'
    },
    uploadDesktop() {
      let url = 'http://update.tongxiao.tech/jiyun_v3/update.html'
      window.open(url)
    },
    uploadAndroid() {
      let url = 'https://jiyun-app-1314883188.cos.ap-hongkong.myqcloud.com/app-release-latest.apk'
      window.open(url)
    },
    uploadIos() {
      let url = 'https://apps.apple.com/cn/app/id1492557133'
      window.open(url)
    },
    goVideo() {
      let url =
        'https://www.douyin.com/user/MS4wLjABAAAAeXrbw1-Iyj0qJbrqf-qpnBcwgQdRFpN0EzKykvs7PxZgtvzgFrP3Ka0HoYjz-i-B?relation=2'
      window.open(url)
    },
    changeApp($event) {
      $event.currentTarget.className = 'book-sty boxShadow'
    },
    getImg(status) {
      this.uplodaStatus = status
      console.log(this.uplodaStatus, 'this.uplodaStatus')
      this.innerVisible = true
    },
    changeSoftware(status) {
      console.log(status, 'status')
    }
  }
}
</script>
<style lang="scss">
.panel-container {
  .panel-hint {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .definable-echarts {
    width: 100%;
    height: 16px;
    background-color: #efffff;
    display: flex;
    margin-top: 20px;
  }
  .definable-echarts-data {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 2;
    justify-content: space-between;
    .definable-echarts-item {
      margin-top: 30px;
      display: flex;
      width: 50%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .definable-echarts-type {
        width: 16px;
        height: 16px;
        background-color: #c3ebca;
        margin-top: 10px;
        margin-right: 10px;
      }
      .definable-echarts-name {
        font-size: 10px;
        color: #c5c5ce;
      }
      .definable-echarts-quantity {
        font-size: 16px;
        margin-top: 5px;
      }
    }
  }
  .statistical-data {
    height: 480px;
    .discount-coupon {
      height: 231px;
      margin-bottom: 16px;
      background-color: #ffffff;
    }
    .shipping-space {
      height: 231px;
      background-color: #ffffff;
    }
    .download-management {
      padding: 20px 15px;
      white-space: nowrap;
      overflow-y: hidden;
      text-overflow: ellipsis;
    }
    .system-notice {
      padding: 5px 0;
      background-color: #fff;
      overflow-x: hidden;
      height: 150px;
      .notice {
        margin: 0;
        padding: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        li {
          padding: 5px;
          list-style: none;
          font-size: 14px;
          border-bottom: 1px solid #f6f6f6;
        }
      }
    }
  }
  .dataOverview {
    height: 480px;
    .Factual-generalization {
      margin-bottom: 16px;
      height: 140px;
      background-color: #ffffff;
    }
    .Order-evaluation {
      height: 322px;
    }
  }
  .login-information {
    background-color: #4c5be7;
    color: #ffffff;
    padding: 5px 15px;
    height: 135px;
    display: flex;
    justify-content: space-between;
    .mos {
      padding: 5px 12px;
      font-size: 40px;
      background-color: #ffffff !important;
      border-radius: 50%;
      color: #17233d;
      font-weight: bold;
    }
  }
  .title {
    padding: 15px;
    background-color: #ffffff;
    height: calc( 100% - 32px );
    .update-time {
      margin-left: 20px;
    }
  }
  .subheading {
    position: relative;
    margin-right: 15px;
    cursor: pointer;
    .subheading-icon {
      position: absolute;
      top: 0px;
    }
  }
  .issue-List {
    height: 480px !important;
    background-color: #ffffff;
    .issue-List-item {
      background-color: #eff0ff;
      padding: 0px 8px;
      font-size: 14px;
      border-radius: 3px;
      color: #17233d;
      margin-bottom: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .issue-List-item div {
      margin-bottom: 5px;
    }
  }
  ::-webkit-scrollbar {
    width: 0px !important;
  }
  .nav-Factual-generalization {
    margin-left: 28px;
    position: relative;
    cursor: pointer;
    .Factual-generalization-img {
      position: absolute;
      top: 0px;
      right: 60px;
    }
    .Factual-generalization-imgs {
      position: absolute;
      top: -1px;
      right: 55px;
    }
  }
  .Factual-generalization-content {
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 4;
    justify-content: space-between;
    .Factual-generalization-item {
      cursor: pointer;
      padding: 20px;
      flex-basis: calc(20%);
    }
  }
  .capacity {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 2;
    justify-content: space-between;
    margin-top: 30px;
    .capacity-item {
      padding: 10px;
      flex-basis: calc(40%);
    }
  }
  .login-information-count {
    padding: 2px 15px;
    border: #ffffff 1px solid;
    text-align: center;
    margin-bottom: 15.5px;
    font-size: 13px;
    cursor: pointer;
  }
  .content-size {
    font-size: 18px;
    font-weight: bold;
  }
  .content-size2 {
    font-size: 32px;
    font-weight: bold;
  }
  .parcelData {
    cursor: pointer;
    margin-right: 24px;
  }
  .parcelDatas {
    color: #4c5be7;
  }
  .charts-order-rate {
    height: 255px;
    background-color: #ffffff;
  }
  .charts-discount-coupon {
    height: 160px;
  }
  .freight-space {
    height: 160px;
  }
  @media screen and (max-width: 1600px) {
    .content-size {
      font-size: 16px !important;
      font-weight: bold;
    }
    .content-size2 {
      font-size: 25px;
      font-weight: bold;
    }
    .issue-List-item {
      font-size: 10px !important;
    }
    .notice li {
      font-size: 10px !important;
      text-overflow: ellipsis;
    }
  }
  .information {
    margin-top: 20px;
  }
  .top-quick {
    padding: 20px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-around;
    text-align: center;
    margin-bottom: 16px;
  }
  .grid-content {
    background-color: #ffffff;
    padding: 20px;
    height: 105px;
    cursor: pointer;
  }
  .flex {
    //display: flex;
    //gap: 15px;
    //align-items: center;
  }
  .login-box {
    width: 100%;
  }
  .box-size {
    font-size: 13px;
    color: #adb2b8;
  }
  .main-item {
    background-color: #fff;
  }
  .right-item {
    padding: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 35px;
  }
  .addCustomer {
    // background: #E5E7FB;
    border-radius: 4px;
    cursor: pointer;
  }
  .add-line {
    margin-right: 5px;
  }
  .blue-sty {
    background-color: #d6f5e3;
  }
  .yellow-sty {
    background-color: #ffeae0;
  }
  .green-sty {
    background-color: #e2eaff;
  }
  .light-blue {
    background-color: #dfe2ff;
  }
  .panel-right {
    box-sizing: border-box;
    padding-left: 20px;
  }
  .count {
    padding-left: 20px;
  }
  .user-count {
    color: #69a482;
  }
  .user-left {
    float: left;
  }
  .user-right {
    float: right;
  }
  .package-count {
    color: #ef8b5b;
  }
  .total-sty {
    color: #8e98f1;
  }
  .open-sty {
    color: #828cea;
  }
  .waitMsg {
    background-color: #3540a5;
    color: #ccc;
    line-height: 35px;
    font-size: 14px;
    padding-left: 20px;
  }
  // ul {
  //   padding: 0 10px 30px 10px;
  //   margin: 0;
  //   list-style-type: none;
  //   border: 1px solid #ccc;
  //   li {
  //     line-height: 40px;
  //     padding: 0 10px;
  //     border-bottom: 1px solid #ccc;
  //     &::before {
  //       content: '·';
  //       color: #3540A5;
  //       font-weight: bold;
  //       font-size: 22px;
  //     }
  //   }
  // }
  .main-box {
    cursor: pointer;
  }
  .msg-right {
    float: right;
    color: red;
  }
  .main {
    border: 1px solid #ccc;
    margin-top: 15px;
    line-height: 70px;
    padding: 0 20px;
    text-align: center;
  }
  .box-header,
  .box-footer {
    padding: 0 10px;
    line-height: 35px;
    overflow: hidden;
  }
  .box-user {
    border-bottom: 1px solid #bee6cf;
  }
  .box-package {
    border-bottom: 1px solid #fccfb9;
  }
  .box-order {
    border-bottom: 1px solid #cad5f4;
  }
  .box-open {
    border-bottom: 1px solid #c9cdf2;
  }
  .box-header {
    padding-top: 5px;
  }
  .bold-box {
    padding-top: 10px;
    font-weight: bold;
    font-size: 24px;
  }
  .tip-img {
    margin-right: 10px;
    position: relative;
    top: 12px;
  }
  .panel-box {
    // border: 1px solid #e8e9eb;
  }
  .show-box {
    padding: 30px 20px;
  }
  .show-list {
    // width: 80%;
    text-align: right;
    line-height: 40px;
    margin-bottom: 30px;
  }
  .package-text {
    float: left;
    font-weight: 700;
  }
  .echarts {
    width: 85%;
    height: 405px;
    display: inline-block;
  }
  .type-list {
    display: inline-block;
    // margin-left: 30px;
    position: absolute;
    bottom: 100px;
  }
  .type-item {
    padding: 5px 10px;
    border: 1px solid #e5e7fb;
    color: #3540a5;
    margin-bottom: 10px;
    cursor: pointer;
    &.select {
      background-color: #3540a5;
      color: #fff;
    }
  }
  li {
    // cursor: pointer;
  }
  .dialog-start-loading {
    .el-input {
      width: 40% !important;
      margin-left: 50px;
    }
    .el-textarea {
      width: 40% !important;
      margin-left: 50px;
    }
    .el-form-item__label {
      width: 200px;
    }
    .el-form-item__error {
      margin-left: 250px !important;
    }
    .el-dialog__header {
      background-color: #0e102a;
    }
    .el-dialog__title {
      font-size: 14px;
      color: #fff;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
  .loading-top {
    margin-bottom: 20px;
    font-size: 15px;
  }
  .service {
    overflow: hidden;
    line-height: 40px;
    .el-input__inner {
      line-height: 40px !important;
      margin-bottom: 10px;
    }
    .serviceLeft {
      display: inline-block;
      float: left;
    }
    .serviceRight {
      cursor: pointer;
      color: blue;
      display: inline-block;
      float: right;
    }
  }
  .not-btn {
    margin-top: 20px;
  }
  .system-sty {
    // height: 400px;
  }
  .check-sty {
    cursor: pointer;
  }
  .express-sty {
    color: red;
  }
  .search-sty {
    margin-bottom: 20px;
    display: inline-block;
  }
  .express-dialog-container {
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
    .content-top {
      display: flex;
    }
    .express-content {
      font-size: 14px;
    }
    .time {
      width: 155px;
    }
    .result-list {
      padding: 0;
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
    .text {
      padding-left: 10px;
      position: relative;
      flex: 1;
    }
    .dot {
      position: relative;
      width: 16px;
      height: 16px;
    }
  }
  .empty-box {
    text-align: center;
    img {
      width: 150px;
    }
  }
  .main-top {
    background-color: #f5f5f5;
  }
  .about-sty {
    cursor: pointer;
  }
  .icon-sty,
  .icon-packages,
  .icon-order,
  .icon-express {
    position: relative;
    top: 10px;
    text-align: center;
    border-radius: 50%;
    width: 35px;
    height: 35px;
  }
  .icon-sty {
    border: 1px solid #d6f5e3;
    background-color: #c5e7d3;
  }
  .icon-packages {
    border: 1px solid #ffeae0;
    background-color: #ffba98;
  }
  .icon-order {
    border: 1px solid #b3c7ff;
    background-color: #e2eaff;
  }
  .icon-express {
    border: 1px solid #dfe2ff;
    background-color: #9fa7f5;
  }
  .icons-third {
    color: #c0c5ee !important;
    font-size: 25px !important;
  }
  .icons-second {
    color: #8e98f1 !important;
    font-size: 25px !important;
  }
  .icons-first {
    color: #69a482 !important;
    font-size: 25px !important;
  }
  .over-sty {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .icons {
    color: #ffa072 !important;
    font-size: 25px !important;
  }
  .wait-content {
    padding: 30px 20px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(5, 1fr);
    color: #8b8b8b;
    background-color: #fff;
    .wait-sty {
      border-right: 1px solid#E8E9EB;
      padding-right: 10px;
      margin-bottom: 5px;
    }
    .number {
      color: #2c2c2c;
      font-weight: bold;
      font-size: 20px;
    }
    .wait-font {
      font-size: 13px;
      padding-left: 5px;
      color: #8b8b8b;
    }
    .icon-weight,
    .wait-font {
      font-weight: 700;
    }
  }
  .order-search {
    background-color: #fff;
    height: 114px;
    padding-left: 10px;
    .input-button {
      width: 55%;
    }
    .order-main {
      position: relative;
      top: 30px;
    }
  }
  .package-chart {
    margin-top: 10px;
  }
  .package-main {
    padding: 30px 20px;
    background-color: #fff;
    ul {
      display: flex;
      justify-content: space-between;
      padding: 0;
      list-style: none;
      li {
        padding: 0 20px;
        text-align: center;
        border-right: 1px solid #e8e9eb;
        p {
          font-size: 14px;
        }
      }
      li:last-child {
        border-right: none;
      }
    }
    .charts-left {
      display: inline-block;
      width: 100%;
      height: 300px;
    }
  }

  .bottom {
    margin-top: 20px;
    .process,
    .other,
    .help-center,
    .system {
      padding: 20px;
      height: 150px;
      background-color: #fff;
      overflow: auto;
      // .title {
      //   font-size: 16px;
      //   font-weight: bold;
      //   cursor: pointer;
      // }
      .process-content {
        padding: 5px 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .line {
          width: 25px;
          height: 2px;
          background-color: #e5e7fb;
          position: relative;
          bottom: 35px;
        }
      }
      .system-notice {
        padding: 5px 0;
        background-color: #fff;
        .notice {
          margin: 0;
          padding: 0;
          li {
            padding: 10px;
            list-style: none;
            font-size: 14px;
            border-bottom: 1px solid #f6f6f6;
          }
        }
      }
      .user-actions {
        padding-top: 25px;
      }
    }
  }
  .book-sty {
    display: inline-block;
    width: 25%;
    border: 2px solid #fff;
    // box-shadow: 3px 3px 3px 3px #f5f5f5;
    text-align: center;
    // padding-top: 40px;
    // padding-bottom: 20px;
    margin-right: 30px;
    cursor: pointer;
    .upload-sty {
      font-size: 30px;
      color: #30359a;
    }
    .file-sty {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
  .desktop-sty,
  .anzhuo-sty,
  .ios-sty {
    font-size: 45px;
  }
  .desktop-sty {
    color: #30359a;
  }
  .anzhuo-sty {
    color: #52cc35;
  }
  .ios-sty {
    color: #c6c6c6;
  }
  .boxShadow {
    border: 2px solid #30359a;
  }
  .warning-sty {
    color: #e55f51;
  }
  .charts-content {
    margin-top: 59px;
  }
  .other-sty {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
.red-data {
  color: red;
}
@media screen and (max-width: 1359px) {
  .order-search {
    height: 135px !important;
  }
}
@media screen and (max-width: 1596px) {
  .echarts {
    height: 410px !important;
  }
}
@media screen and (max-width: 1396px) {
  .echarts {
    height: 480px !important;
  }
}
</style>

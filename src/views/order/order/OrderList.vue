<template>
  <div class="order-list-container">
    <order-list-search
      v-show="hasFilterCondition"
      :searchFieldData="searchFieldData"
      v-on:submit="goMatch"
    ></order-list-search>
    <div style="background-color: #fff; padding: 15px 20px">
      <el-tabs v-model="activeName" @tab-click="onTabChange" class="tab-length" stretch>
        <el-tab-pane :label="`${$t('全部')} (${countData.all || 0})`" name="0"></el-tab-pane>
        <el-tab-pane
          :label="`${$t('未入库')} (${countData.wait_in_storage || 0})`"
          name="1"
        ></el-tab-pane>
        <el-tab-pane
          :label="`${$t('已入库')} (${countData.in_storage || 0})`"
          name="2"
        ></el-tab-pane>
        <el-tab-pane :label="`${$t('已集包')} (${countData.packed || 0})`" name="3"></el-tab-pane>
        <el-tab-pane :label="`${$t('已发货')} (${countData.shipped || 0})`" name="4"></el-tab-pane>
        <el-tab-pane :label="`${$t('已收货')} (${countData.received || 0})`" name="5"></el-tab-pane>
        <el-tab-pane :label="$t('弃件包裹')" name="6"></el-tab-pane>
        <el-tab-pane
          :label="`${$t('无人认领')} (${countData.no_owner || 0})`"
          name="7"
        ></el-tab-pane>
      </el-tabs>
      <div class="header-range">
        <div class="header-btns">
          <el-button
            class="btn-light-red"
            size="small"
            @click="deleteData"
            v-if="activeName === '1'"
            >{{ $t('删除') }}</el-button
          >
          <el-button
            class="btn-orangey-red"
            size="small"
            @click="discardPackage"
            v-if="['1', '2'].includes(activeName)"
            >{{ $t('弃件') }}</el-button
          >
          <el-button
            class="btn-green"
            size="small"
            @click="batchPackage"
            v-if="activeName === '2'"
            >{{ $t('批量集包') }}</el-button
          >
          <el-button
            class="btn-pink notify"
            size="small"
            @click="goNotify"
            v-if="activeName === '2'"
            >{{ $t('批量发送通知') }}</el-button
          >
          <el-button
            class="btn-dark-green"
            size="small"
            v-if="activeName === '6'"
            @click="restore"
            >{{ $t('恢复') }}</el-button
          >
          <el-button
            class="btn-blue-green"
            size="small"
            v-if="activeName === '6'"
            @click="deleteDiscard"
            >{{ $t('彻底删除') }}</el-button
          >
          <el-button
            class="btn-purple"
            v-if="activeName !== '6' && activeName !== '7'"
            @click="importOrder"
            size="small"
            plain
            >{{ $t('批量入库') }}</el-button
          >
          <el-button
            class="btn-blue"
            v-if="activeName !== '6' && activeName !== '7'"
            @click="batchForecast"
            size="small"
            plain
          >
            {{ $t('批量预报') }}
          </el-button>
          <el-button
            class="btn-yellow"
            v-if="activeName !== '6' && activeName !== '7'"
            @click="uploadList"
            size="small"
            type="success"
            plain
          >
            {{ $t('导出清单') }}
          </el-button>
          <el-button
            class="btn-light-red"
            v-if="activeName !== '1' && activeName !== '6' && activeName !== '7'"
            @click="batchShelves"
            size="small"
            plain
          >
            {{ $t('批量上架') }}
          </el-button>
          <el-button
            class="btn-light-red"
            v-if="activeName === '2'"
            @click="batchModify"
            size="small"
            plain
          >
            {{ $t('批量修改') }}
          </el-button>
          <el-button
            class="btn-light-red"
            size="small"
            v-if="activeName === '7'"
            @click="deleteListData"
            >{{ $t('删除') }}</el-button
          >
          <el-button
            class="btn-blue-green"
            size="small"
            v-if="activeName === '7'"
            @click="claimList"
            >{{ $t('认领记录') }}</el-button
          >
          <el-button
            type="success"
            plain
            size="small"
            v-if="activeName === '7'"
            @click="uploadListData"
            >{{ $t('导出清单') }}</el-button
          >
          <el-button
            class="btn-light-red"
            size="small"
            v-if="['1', '2'].includes(activeName)"
            @click="batchChangePackage"
            >{{ $t('批量包裹变更') }}</el-button
          >
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
            <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
              >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
            ></el-button>
          </div>
        </div>
      </div>
      <div style="height: calc(100vh - 325px)" v-if="activeName !== '7'">
        <el-table
          border
          stripe
          ref="table"
          :data="orderData"
          @selection-change="selectionChange"
          v-loading="tableLoading"
          height="calc(100vh - 330px)"
          class="order-data-list"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            v-if="activeName !== '7'"
            :type="['1', '2', '6'].includes(activeName) ? 'selection' : 'index'"
            :key="['1', '2', '6'].includes(activeName) ? 'selection' : 'index'"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('客户')"
            v-if="activeName !== '7'"
            key="user_id"
            width="160"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="customer">
                <div class="user-id" v-if='$store.state.uid === 1'>
                  {{ $t('编号') }}:<span v-if="$store.state.uid === 1">{{
                    scope.row.user_uid
                  }}</span>
                </div>
                <div class="user-id">
                  <span>ID：</span>
                  <span>{{ scope.row.user_id }}</span>
                </div>

                <div>
                  <span>{{ $t('昵称') }}：</span>
                  <span>{{ scope.row.user_name }}</span>
                </div>
                <div>
                  <span>{{ $t('会员等级') }}：</span>
                  <span>{{ scope.row.user_member_level }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName !== '7'"
            :label="$t('快递单号')"
            key="express_num"
            width="180"
          >
            <template slot-scope="scope">
              <div class="express">
                <div class="express-top">
                  <div>
                    <div>
                      <el-button
                        v-if="activeName === '2'"
                        :class="scope.row.is_claimed === 1 ? 'colorsty' : ''"
                        @click="oderDetails(scope.row.id)"
                        type="text"
                        >{{ scope.row.express_num }}
                      </el-button>
                      <el-button v-else @click="oderDetails(scope.row.id)" type="text"
                        >{{ scope.row.express_num }}
                      </el-button>
                    </div>
                    <span v-if="scope.row.code != ''" style="color: #66666"
                      >({{ scope.row.code }})</span
                    >
                  </div>
                  <span
                    :title="$t('复制单号')"
                    class="copy-number"
                    @click="copyNumber(scope.row.express_num)"
                  >
                    <i class="el-icon-copy-document"></i>
                  </span>
                </div>
                <div class="express-bottom">
                  <span class="seer" v-show="scope.row.source === 3">{{ $t('先知') }}</span>
                  <img class="beizhu-img" src="@/assets/beizhu.png" @click="goRemark(scope.row)" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('收发区域')" key="address" width="180">
            <template slot-scope="scope">
              <div class="address">
                <div class="address-line">
                  <img
                    style="width: 20px; height: 20px; margin-right: 10px"
                    src="@/assets/ji.png"
                  />
                  {{ scope.row.warehouse.warehouse_name }}
                </div>
                <div class="address-line">
                  <img
                    style="width: 20px; height: 20px; margin-right: 10px"
                    src="@/assets/shou.png"
                  />{{ scope.row.destination_country ? scope.row.destination_country.cn_name : '' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('清单')" key="inventory" width="300">
            <template slot-scope="scope">
              <div class="inventory">
                <div>
                  <span class="tip">{{ $t('品名') }}：</span>{{ scope.row.package_name }}
                </div>
                <div class="inventory-line">
                  <div>
                    <span class="tip">{{ $t('商品数量') }}：</span>{{ scope.row.qty }}
                  </div>
                  <div>
                    <span class="tip">{{ $t('商品分类') }}：</span
                    ><span v-for="item in scope.row.categories" :key="item.id">
                      {{ item.name_cn }}
                    </span>
                  </div>
                </div>
                <div class="inventory-line">
                  <div>
                    <span class="tip">{{ $t('物品价值') }}：</span
                    ><span>{{ scope.row.package_value }}</span>
                  </div>
                  <div>
                    <span class="tip">{{ $t('物品属性') }}：</span
                    ><span v-for="item in scope.row.props" :key="item.id">
                      <span
                        class="prop-box"
                        :style="'background-color:' + item.color + ';color:' + item.font_color"
                        >{{ item.cn_name }}</span
                      > </span
                    >&nbsp;
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('状态')"
            width="100"
            align="center"
            key="status"
            v-if="activeName !== '7'"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">{{ $t('未入库') }}</span>
              <span v-if="scope.row.status === 2">{{ $t('已入库') }}</span>
              <span v-if="scope.row.status === 3 || scope.row.status === 4">{{
                $t('已集包')
              }}</span>
              <span v-if="scope.row.status === 5">{{ $t('已发货') }}</span>
              <span v-if="scope.row.status === 6">{{ $t('已收货') }}</span>
              <!-- <span v-if="scope.row.status === 999">{{ $t('无人认领') }}</span> -->

              <el-tooltip
                v-if="scope.row.status === 1 && scope.row.is_warning === 1"
                class="item"
                effect="dark"
                :content="$t('丢包预警')"
                placement="top-start"
              >
                <i class="el-icon-warning" style="color: red"></i>
              </el-tooltip>

              <el-tooltip
                v-if="scope.row.is_exceptional === 1"
                class="item"
                effect="dark"
                :content="scope.row.exceptional_remark"
                placement="top-start"
              >
                <i class="el-icon-wind-power" style="color: red"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('入仓信息')" key="warehouse" width="300">
            <template slot-scope="scope">
              <div class="inventory">
                <div>
                  <span class="tip">{{ $t('重量') }}(KG)：</span>{{ scope.row.package_weight }}
                </div>
                <div class="inventory-line">
                  <div>
                    <span class="tip">{{ $t('体积') }}(m³)：</span
                    >{{
                      (scope.row.length * scope.row.width * scope.row.height) /
                      1000000 /
                      (1 * 1 * 1)
                    }}
                  </div>
                  <div>
                    <span class="tip">{{ $t('长宽高') }}(CM)：</span>
                    {{ scope.row.length }}*{{ scope.row.width }}*{{ scope.row.height }}
                  </div>
                </div>
                <div class="inventory-line">
                  <div>
                    <span class="tip">{{ $t('货位') }}：</span><span>{{ scope.row.location }}</span>
                  </div>
                  <div style="text-align: right">
                    <img
                      class="img"
                      v-if="scope.row.package_pictures.length === 0"
                      src="@/assets/pic.png"
                    />
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('时间')" key="time" width="300">
            <template slot-scope="scope">
              <div class="time">
                <div>
                  <span class="tip">{{ $t('下架时间') }}：</span>{{ scope.row.shelf_off_at }}
                </div>
                <div>
                  <span class="tip">{{ $t('上架时间') }}：</span>{{ scope.row.shelf_up_at }}
                </div>
                <div>
                  <span class="tip">{{ $t('签收时间') }}：</span>{{ scope.row.received_at }}
                </div>
                <div>
                  <span class="tip">{{ $t('预报时间') }}：</span>{{ scope.row.created_at }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!--          <el-table-column-->
          <!--            :label="$t('物流状态')"-->
          <!--            prop="third_tracking_status_name"-->
          <!--            key="third_tracking_status_name"-->
          <!--            v-if="activeName === '1'"-->
          <!--            width="150"-->
          <!--          >-->
          <!--            <template slot-scope="scope">-->
          <!--              <el-button type="text" class="copy-number" @click="packageTrack(scope.row.id)">{{-->
          <!--                scope.row.third_tracking_status_name-->
          <!--              }}</el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('物品名称')"-->
          <!--            prop="package_name"-->
          <!--            key="package_name"-->
          <!--            width="150"-->
          <!--            v-if="activeName !== '7'"-->
          <!--            show-overflow-tooltip-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('物品价值') + localization.currency_unit"-->
          <!--            v-if="activeName !== '7'"-->
          <!--            prop="package_value"-->
          <!--            key="package_value"-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('物品单价') + localization.currency_unit + '/' + localization.weight_unit"-->
          <!--            v-if="activeName !== '7'"-->
          <!--            prop="unit_value"-->
          <!--            key="unit_value"-->
          <!--            min-width="100"-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column :label="$t('物品属性')" key="props" v-if="activeName !== '7'">-->
          <!--            <template slot-scope="scope">-->
          <!--              <span v-for="item in scope.row.props" :key="item.id">-->
          <!--                {{ item.cn_name }}-->
          <!--              </span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('物品重量')"-->
          <!--            key="package_weight"-->
          <!--            v-if="['2', '3', '4', '5'].includes(activeName)"-->
          <!--          >-->
          <!--            <template slot-scope="scope">-->
          <!--              <span>{{ scope.row.package_weight }}{{ localization.weight_unit }}</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('商品数量')"-->
          <!--            prop="qty"-->
          <!--            key="qty"-->
          <!--            v-if="['1', '2'].includes(activeName)"-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column :label="$t('体积(m³)')" v-if="['2'].includes(activeName)">-->
          <!--            <template slot-scope="scope">-->
          <!--              <span>{{-->
          <!--                (scope.row.length * scope.row.width * scope.row.height) / 1000000 / (1 * 1 * 1)-->
          <!--              }}</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('商品分类')"-->
          <!--            prop="categories"-->
          <!--            key="categories"-->
          <!--            v-if="['1', '2'].includes(activeName)"-->
          <!--          >-->
          <!--            <template slot-scope="scope">-->
          <!--              <span v-for="item in scope.row.categories" :key="item.id">-->
          <!--                {{ item.name_cn }}-->
          <!--              </span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('寄往国家')"-->
          <!--            prop="destination_country.cn_name"-->
          <!--            key="destination_country.cn_name"-->
          <!--            v-if="activeName !== '7'"-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('仓库')"-->
          <!--            prop="warehouse.warehouse_name"-->
          <!--            key="warehouse.warehouse_name"-->
          <!--            v-if="activeName !== '7'"-->
          <!--            width="155"-->
          <!--          >-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('规格(长宽高cm)')"-->
          <!--            prop="dimension"-->
          <!--            key="dimension"-->
          <!--            width="120px"-->
          <!--            v-if="activeName === '2'"-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('存放货位')"-->
          <!--            key="location"-->
          <!--            width="120px"-->
          <!--            v-if="activeName === '2' || activeName === '3'"-->
          <!--          >-->
          <!--            <template slot-scope="scope">-->
          <!--              <span>{{ scope.row.location }}</span>-->
          <!--              <span v-if="scope.row.location_suffix !== ''">_{{ scope.row.location_suffix }}</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('入库时间')"-->
          <!--            width="155"-->
          <!--            prop="in_storage_at"-->
          <!--            key="in_storage_at"-->
          <!--            v-if="activeName === '2' || activeName === '3'"-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('签收时间')"-->
          <!--            width="155"-->
          <!--            prop="received_at"-->
          <!--            key="received_at"-->
          <!--            v-if="['0', '1', '2'].includes(activeName)"-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column-->
          <!--            :label="$t('提交时间')"-->
          <!--            prop="created_at"-->
          <!--            v-if="activeName !== '7'"-->
          <!--            key="created_at"-->
          <!--            width="155"-->
          <!--          >-->
          <!--          </el-table-column>-->
          <el-table-column
            :label="$t('操作')"
            fixed="right"
            v-if="activeName !== '7'"
            key="operator"
            width="116px"
          >
            <template slot-scope="scope">
              <el-dropdown>
                <el-button type="primary" plain>
                  {{ $t('操作') }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="storage(scope.row.id)">
                    <!-- 入库 -->
                    <span v-if="activeName === '1' || scope.row.status === 1">{{
                      $t('入库')
                    }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="onStorage(scope.row.id)">
                    <!-- 入库 -->
                    <span v-if="activeName === '1' || scope.row.status === 1">{{
                      $t('入库下单')
                    }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="goExpress(scope.row.express_num)">
                    <span
                      v-if="['1', '2'].includes(activeName) && [1, 2].includes(scope.row.status)"
                      >{{ $t('单号追踪') }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="returnWarehouse(scope.row.id)">
                    <span v-if="activeName === '2'">{{ $t('退回未入库') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="onUnclaimed(scope.row.id)">
                    <span v-if="activeName === '2'">{{ $t('退回无人认领') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="onLogs(scope.row.express_num)">
                    <span
                      v-if="
                        ['0', '2', '3', '4', '5'].includes(activeName) &&
                        [2, 3, 4, 5, 6].includes(scope.row.status)
                      "
                      >{{ $t('入库日志') }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="editWarehoused(scope.row.id)">
                    <span v-if="activeName === '2' || scope.row.status === 2">{{
                      $t('编辑')
                    }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="fastClosing(scope.row.user_id)">
                    <span v-if="activeName === '2'">{{ $t('快速合箱') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="invalidLog(scope.row.id)">
                    <span v-if="activeName === '6'">{{ $t('日志') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="getLabel(scope.row.id)">
                    <span size="small" v-if="activeName === '2' || scope.row.status === 2">{{
                      $t('打印标签')
                    }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <nle-pagination
        style="margin-top: 5px"
        :pageParams="page_params"
        :notNeedInitQuery="false"
        saveSize="package"
      >
        <div class="remark-text">
          <span>{{ $t('总实际重量') }}:</span><span>{{ sumData.weight }} KG</span>
        </div>
      </nle-pagination>
      <div style="height: calc(100vh - 270px)" v-if="activeName === '7'">
        <el-table
          class="data-list"
          border
          stripe
          :data="ownerData"
          @selection-change="selectionChange"
          v-loading="tableLoading"
          height="calc(100vh - 275px)"
          ref="table"
        >
          <!-- height="550" -->
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <!-- 快递单号 -->
          <el-table-column :label="$t('快递单号')" width="155">
            <template slot-scope="scope">
              <el-button @click="oderDetails(scope.row.id)" type="text">{{
                scope.row.express_num
              }}</el-button>
              <span
                :title="$t('复制单号')"
                class="copy-number"
                @click="copyNumber(scope.row.express_num)"
              >
                <i class="el-icon-copy-document"></i>
              </span>
              <span class="seer" v-if="scope.row.source === 3">{{ $t('先知') }}</span>
            </template>
          </el-table-column>
          <!-- 包裹编码 -->
          <el-table-column :label="$t('包裹编码')" prop="code"></el-table-column>
          <!-- 物品价值 -->
          <el-table-column
            :label="$t('包裹重量') + this.localization.weight_unit"
            prop="package_weight"
            width="155"
          ></el-table-column>
          <!-- 物品属性 -->
          <el-table-column :label="$t('物品属性')">
            <template slot-scope="scope">
              <span v-for="item in scope.row.props" :key="item.id">
                <span
                  class="prop-box"
                  :style="'background-color:' + item.color + ';color:' + item.font_color"
                  >{{ item.cn_name }}</span
                >
              </span>
            </template>
          </el-table-column>
          <!-- 规格 -->
          <el-table-column
            :label="$t('规格') + this.localization.length_unit"
            prop="dimension"
            width="120px"
          ></el-table-column>
          <!-- 提交时间 -->
          <el-table-column :label="$t('提交时间')" prop="created_at" width="155"> </el-table-column>
          <!-- 仓库 -->
          <el-table-column :label="$t('仓库')" prop="warehouse.warehouse_name" width="155">
          </el-table-column>
          <el-table-column :label="$t('货位')" prop="location"> </el-table-column>
          <!-- 包裹图片 -->
          <el-table-column :label="$t('包裹图片')" prop="package_pictures" width="150">
            <template slot-scope="scope">
              <span
                v-for="(item, index) in scope.row.package_pictures"
                :key="index"
                style="cursor: pointer"
                @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
              >
                <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 40px; margin-right: 5px" />
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('签收时间')" prop="received_at"></el-table-column>
          <el-table-column :label="$t('操作')" width="220" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" @click="getLabel(scope.row.id)" class="btn-pink">{{
                $t('打印标签')
              }}</el-button>
              <el-button class="btn-deep-blue" @click="goClaim([scope.row.id], 'alone')">{{
                $t('认领')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
      </div>
      <el-dialog :visible.sync="imgVisible" size="small">
        <div class="img-box">
          <img :src="imgSrc" class="img-dialog" />
        </div>
      </el-dialog>
      <el-dialog :visible.sync="show" :title="$t('预览打印标签')" class="props-dialog" width="45%">
        <div class="dialog-sty">
          <iframe class="iframe" :src="urlHtml"></iframe>
        </div>
        <div slot="footer">
          <el-button @click="show = false">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="updateLabel">{{ $t('下载') }}</el-button>
        </div>
      </el-dialog>
      <batch-modify
        :showBatch="showBatch"
        :deleteNum="deleteNum"
        :isFresh="isFresh"
        :packageData="packageData"
        @passVal="passVal"
      ></batch-modify>
    </div>
  </div>
</template>

<script>
import OrderListSearch from './components/orderListSearch'
import BatchModify from './components/batchModify'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    OrderListSearch,
    NlePagination,
    BatchModify
  },
  name: 'orderlist',
  mixins: [pagination],
  data() {
    return {
      activeName: 0,
      orderData: [],
      tableLoading: false,
      localization: {
        currency_unit: '',
        weight_unit: ''
      },
      imgVisible: false,
      imgSrc: '',
      urlHtml: '',
      show: false,
      labelId: '',
      deleteNum: [],
      countData: {},
      urlExcel: '',
      hasFilterCondition: false,
      sumData: {},
      ownerData: [],
      searchFieldData: {
        begin_date: '',
        end_date: '',
        date_type: '',
        express_num: '',
        date: [],
        value_type: '',
        value_begin: '',
        value_end: '',
        keyword: '',
        is_warning: 0,
        code: '',
        member_level: ''
      },
      showBatch: false,
      packageData: [],
      trackId: '',
      isFresh: true
    }
  },
  activated() {
    this.initSize()
    this.getList()
    this.getCounts()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
    if (this.$route.params.type === 'noSign') {
      this.activeName = '1'
    }
  },
  created() {
    this.initSize()
    this.getList()
    this.getCounts()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  mounted() {},
  methods: {
    goRemark(item) {
      dialog({ type: 'packpageRemark', id: item.id }, () => {
        console.log('cnm')
      })
    },
    initSize() {
      if (localStorage.getItem('package_size')) {
        this.page_params.size = Number(localStorage.getItem('package_size'))
      }
    },
    // 获取订单统计数据
    getCounts() {
      const params = this.computedParams()
      this.$request.getOrderCounts(params).then(res => {
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
    passVal() {
      this.showBatch = false
    },
    batchChangePackage() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      dialog(
        {
          type: 'packageChange',
          packageData: this.packageData
        },
        () => {
          this.getList()
        }
      )
    },
    goMatch() {
      this.page_params.page = 1
      this.page_params.size = 10
      this.getList()
      this.getCounts()
    },
    packageTrack(id) {
      dialog({
        type: 'tracking',
        id
      })
    },
    computedParams() {
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.activeName === '6' ? 19 : this.activeName,
        keyword: this.searchFieldData.keyword
      }
      if (this.hasFilterCondition) {
        const searchData = this.searchFieldData
        params = {
          ...params,
          ...searchData,
          express_num: searchData.express_num.split(/[(\r\n)\r\n]+/),
          begin_date: searchData.date ? searchData.date[0] : '',
          end_date: searchData.date ? searchData.date[1] : ''
        }
      }
      return params
    },
    getList() {
      if (this.activeName === '6') {
        return this.getDiscard()
      }
      if (this.activeName === '7') {
        return this.getNoOwnerList()
      }
      this.tableLoading = true
      const params = this.computedParams()
      this.$request
        .getWarehouse(params)
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.orderData = res.data.filter(item => item.user_id !== 0)
            this.sumData = res.sum
            this.localization = res.localization
            this.page_params.page = res.meta.current_page
            if (this.orderData.length) {
              this.page_params.total = res.meta.total
            } else {
              this.page_params.total = 0
            }
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
        .catch(() => (this.tableLoading = false))
    },
    importOrder() {
      // this.$router.push({ name: 'ImportOrder' })
      this.$router.push({ name: 'batchOperate', query: { type: '2' } })
    },
    batchShelves() {
      // this.$router.push({ name: 'BatchShelves' })
      this.$router.push({ name: 'batchOperate', query: { type: '4' } })
    },
    batchForecast() {
      // this.$router.push({ name: 'BatchForecast' })
      this.$router.push({ name: 'batchOperate', query: { type: '3' } })
    },
    getDiscard() {
      this.tableLoading = true
      const params = this.computedParams()
      this.$request
        .getWarehouse(params)
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.orderData = res.data
            this.sumData = res.sum
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(() => (this.tableLoading = false))
    },
    storage(id) {
      this.$router.push({ name: 'editStorage', params: { id: id } })
    },
    onStorage(id) {
      this.$router.push({ name: 'warehouseOrder', query: { id, type: '1' } })
    },
    // 已入库编辑
    editWarehoused(id) {
      this.$router.push({ name: 'editWarehouse', params: { id: id, state: 'editWarehouse' } })
    },
    // 认领记录
    claimList() {
      dialog({ type: 'claimRecord' })
    },
    // 认领包裹
    goClaim(id, status) {
      dialog({ type: 'claim', id: id, status }, () => {
        this.getNoOwnerList()
      })
    },
    uploadListData() {
      const searchData = this.searchFieldData
      let params = {
        ...searchData,
        express_num: searchData.express_num.split(/[(\r\n)\r\n]+/),
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : '',
        page: this.page_params.page,
        size: this.page_params.size,
        keyword: searchData.keyword
      }
      this.$request.uploadNoOwner(params).then(res => {
        if (res.ret) {
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
    deleteListData() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要删除这个包裹吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deleteNoOwner({
            DELETE: this.deleteNum
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
    // 获取无人认领列表
    getNoOwnerList() {
      this.tableLoading = true
      this.ownerData = []
      const searchData = this.searchFieldData
      let params = {
        ...searchData,
        express_num: searchData.express_num.split(/[(\r\n)\r\n]+/),
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : '',
        page: this.page_params.page,
        size: this.page_params.size,
        keyword: searchData.keyword
      }
      this.$request.getNoOwner(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.ownerData = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
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
    // 快速合箱
    fastClosing(userId) {
      this.$router.push({ name: 'applyPackage', query: { userId: userId } })
    },
    selectionChange(selection) {
      console.log(selection, 'selection-change')
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum)
      this.packageData = selection
    },
    goExpress(expressNum) {
      window.open(`https://m.kuaidi100.com/app/query/?coname=uc&nu=${expressNum}`)
    },
    // 批量发送通知
    goNotify() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要批量发送通知吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .sendingNotify({
            ids: this.deleteNum,
            type: 1
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
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
    // 退回未入库
    returnWarehouse(id) {
      this.$confirm(this.$t('您是否确认将该包裹退回未入库状态'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.returnBack(id).then(res => {
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
    onUnclaimed(id) {
      this.$confirm(this.$t('您是否确认将该包裹退回无人认领状态'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.ReturnUnclaimed(id).then(res => {
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
    // 删除
    deleteData() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要删除这个包裹吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deletePackages({
            DELETE: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
              this.getList()
              this.getCounts()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    //复制单号
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
    // 弃件日志
    invalidLog(id) {
      dialog({ type: 'invalidLog', id: id })
    },
    // 批量弃件
    discardPackage() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      dialog({ type: 'discardList', deleteNum: this.deleteNum }, () => {
        this.$refs.table.clearSelection()
        this.getList()
      })
    },
    // 批量集包
    batchPackage() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$router.push({ name: 'boxing', query: { packageId: this.deleteNum } })
    },
    // 彻底删除
    deleteDiscard() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要彻底删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deleteDiscard({
            ids: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
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
    // 恢复被弃件的包裹
    restore() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要恢复包裹吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .restoreDiscard({
            ids: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$refs.table.clearSelection()
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
    // 打印标签
    getLabel(id) {
      this.labelId = id
      this.show = true
      this.$request.checkPackageLabel(id).then(res => {
        if (res.ret) {
          this.urlHtml = res.data.url
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
      this.$request.updatePackagePdf(this.labelId).then(res => {
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
    // 导出清单
    uploadList() {
      // const params = this.computedParams()
      const searchData = this.searchFieldData
      let param = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.activeName === '6' ? 19 : this.activeName,
        keyword: this.searchFieldData.keyword
      }
      let params = {
        ...param,
        ...searchData,
        express_num: searchData.express_num.split(/[(\r\n)\r\n]+/),
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : ''
      }
      this.$request.uploadPackage(params).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
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
    // 入库日志
    onLogs(expressNum) {
      this.$router.push({ name: 'pickingContainer', query: { keyword: expressNum } })
    },
    // 详情
    oderDetails(id) {
      this.$router.push({ name: 'oderDetails', params: { id: id } })
    },
    onTabChange() {
      this.page_params.page = 1
      this.getList()
    },
    batchModify() {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.showBatch = true
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list-container {
  .seer {
    padding: 2px;
    width: 40px;
    display: block;
    text-align: center;
    line-height: 15px;
    border: #f7aa47 1px solid;
    color: #f7aa47;
    font-size: 10px;
    border-radius: 5px;
    margin-top: 6px;
  }
  .remark-text {
    font-size: 14px;
    font-weight: bold;
    color: red;
  }
  .header-range {
    display: flex;
    // flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1px;
    .header-search {
      display: flex;
      align-items: center;
      // margin: 0 0 0 auto;
      .header-keyword {
        max-width: 300px;
      }
      .filter {
        margin: 0 20px;
      }
    }
  }
  .order-data-list {
    background-color: inherit;
    .customer {
      .user-id {
        font-weight: 600;
      }
    }
    .express {
      button {
        padding: 0;
      }
      .express-top {
        display: flex;
        align-items: center;
      }
      .express-bottom {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .beizhu-img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    .address {
      font-weight: bold;
      .address-line {
        display: flex;
        align-items: center;
        margin-top: 8px;
      }
    }
    .inventory {
      .inventory-line {
        display: flex;
        div {
          flex: 1;
        }
        .prop-box {
          padding: 3px;
          border-radius: 3px;
          color: rgba(99, 111, 122, 1);
          background-color: rgba(0, 0, 0, 0);
          margin-right: 5px;
        }
        .img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    .tip {
      color: #989898;
    }
    .put-storage {
      .tip {
        color: #989898;
      }
      .put-storage-center {
        display: flex;
        align-items: center;
        div {
          flex: 1;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .tab-length {
    width: 950px !important;
  }
  .copy-number {
    padding-left: 20px;
    cursor: pointer;
  }
  .img-box {
    text-align: center;
    .img-dialog {
      width: 50%;
    }
  }
  .dialog-sty {
    margin-left: 30px;
  }
  .iframe {
    width: 100%;
    min-height: 300px;
    border-width: 0;
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
  }
  .excel-date {
    margin-top: 20px;
  }
  .input-sty {
    width: 30%;
  }
  .warning-sty {
    color: red;
  }
  // .el-button--text {
  //   color: blue;
  // }
  .colorsty {
    color: #3cb371;
  }
  .notify {
    &:focus {
      background: pink !important;
      border: 1px solid pink !important;
      color: white !important;
    }
  }
}
</style>

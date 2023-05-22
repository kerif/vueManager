<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('快速下单')" name="1">
        <div class="warehouse-order">
          <el-form
            ref="ruleForm"
            :rules="rule"
            :model="ruleForm"
            label-width="120px"
            label-position="left"
          >
            <div class="type-line">
              <div class="type-box" :class="ruleForm.mode === 1 ? 'active-open' : ''">
                <div class="type-info">
                  <div class="is-open" v-if="ruleForm.mode === 1">{{ $t('已启用') }}</div>
                  <div class="title">{{ $t('集齐再发') }}</div>
                  <div class="sub-title">
                    {{ $t('包裹到齐仓库后，由客人选择包裹后再进行发货') }}
                  </div>
                  <div class="open-btn" v-if="ruleForm.mode !== 1">
                    <el-button type="primary" @click="openType(1)">{{ $t('启用') }}</el-button>
                  </div>
                </div>
              </div>
              <div class="type-box" :class="ruleForm.mode === 2 ? 'active-open' : ''">
                <div class="type-info">
                  <div class="is-open" v-if="ruleForm.mode === 2">{{ $t('已启用') }}</div>
                  <div class="title">{{ $t('到件即发') }}</div>
                  <div class="sub-title">
                    {{ $t('包裹到了仓库后，立即打包发货，需要在下单时候选择收件信息及发货渠道') }}
                  </div>
                  <div class="open-btn" v-if="ruleForm.mode !== 2">
                    <el-button
                      type="primary"
                      @click="openType(2)"
                      :disabled="ruleForm.user_id === ''"
                    >{{ $t('启用') }}</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('当前模式为')" class="express-num">
                  <span class="type-font">{{ ruleForm.mode === 1 ? '集齐再发' : '到件即发' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('快递单号')" class="express-num" prop="express_num">
                  <el-input
                    v-model="ruleForm.express_num"
                    :placeholder="$t('请输入快递单号')"
                    @blur="getNum(ruleForm.express_num)"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('服务')" class="service" prop="chosen_services">
                  <el-checkbox-group v-model="ruleForm.chosen_services">
                    <div v-for="item in updateService" :key="item.id" class="service-item">
                      <el-checkbox :label="item.id">{{ item.name }} </el-checkbox>
                      <el-tooltip effect="dark" :content="item.remark" placement="top">
                        <span class="el-icon-warning icon-info"></span>
                      </el-tooltip>
                      <el-input v-model="item.price" class="add-value-ipt"></el-input>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="line-center"></div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('重量')" prop="package_weight">
                  <el-input
                    v-model="ruleForm.package_weight"
                    :placeholder="$t('请输入重量')"
                    class="input-box"
                    @blur="onLimit"
                  >
                    <template slot="append">{{ localization.weight_unit }}</template>
                  </el-input>
                </el-form-item></el-col
              >
              <el-col :span="12">
                <el-form-item :label="$t('尺寸')" class="size">
                  <el-input
                    :placeholder="$t('长') + localization.length_unit"
                    class="size-item"
                    v-model="ruleForm.length"
                    @blur="onLimitLength"
                  ></el-input>
                  <el-input
                    :placeholder="$t('宽') + localization.length_unit"
                    class="size-item"
                    v-model="ruleForm.width"
                    @blur="onLimitWidth"
                  ></el-input>
                  <el-input
                    :placeholder="$t('高') + localization.length_unit"
                    class="size-item"
                    v-model="ruleForm.height"
                    @blur="onLimitHeight"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('寄往仓库')" prop="warehouse_id">
                  <el-select
                    v-model="ruleForm.warehouse_id"
                    :placeholder="$t('请选择')"
                    class="input-box"
                    @change="getAreaData"
                    clearable
                  >
                    <el-option
                      v-for="item in warehouseData"
                      :key="item.id"
                      :value="item.id"
                      :label="item.warehouse_name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('客户编号')" class="changeQuery" prop="user_id">
                  <el-autocomplete
                    :fetch-suggestions="queryCNSearch"
                    @select="handleSelect"
                    v-model="ruleForm.user_id"
                    @change="changeSelect"
                    :placeholder="$t('请输入客户ID,不填则默认无人认领')"
                  >
                    <template slot-scope="{ item }">
                      <UserSelect :item="item" />
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('寄往地区')" prop="country_id">
                  <el-select
                    :placeholder="$t('请选择')"
                    v-model="ruleForm.country_id"
                    class="input-box"
                    clearable
                    :disabled="ruleForm.warehouse_id === '' || shipNum != ''"
                  >
                    <el-option
                      v-for="item in regionData"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="location">
                  <div slot="label">
                    <span>{{ $t('存放货位') }}</span>
                    <el-tooltip
                      effect="dark"
                      :content="
                        $t('当您为仓库添加了货位系统会自动分配货位同时您也可以自定义填写货位')
                      "
                      placement="top"
                    >
                      <span class="el-icon-question icon-question"></span>
                    </el-tooltip>
                  </div>
                  <el-autocomplete
                    :disabled="ruleForm.warehouse_id === ''"
                    :fetch-suggestions="locationCNSearch"
                    ref="autocompleteRef"
                    :placeholder="$t('请输入存放货位')"
                    v-model="ruleForm.location"
                  >
                  </el-autocomplete>
                  <el-button v-if="locationCode" class="location-box" @click="onRecommend"
                  >{{ $t('推荐货位') }}{{ locationCode }}</el-button
                  >
                  <el-checkbox
                    v-model="ruleForm.isbig"
                    @change="changeLarge"
                    class="location-box"
                  >{{ $t('上大货专区') }}</el-checkbox
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <div class="line-center"></div>
            <el-row>
              <el-col :lg="12">
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('物品状态')" prop="is_exceptional">
                      <el-radio-group v-model="ruleForm.is_exceptional">
                        <el-radio :label="0">{{ $t('正常件') }}</el-radio>
                        <el-radio :label="1">{{ $t('异常件') }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col></el-row
                >
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('物品属性')" prop="props">
                      <el-checkbox-group v-model="ruleForm.props">
                        <el-checkbox v-for="item in propList" :key="item.id" :label="item.id"
                        ><span
                          class="prop-box"
                          :style="'background-color:' + item.color + ';color:' + item.font_color"
                        >{{ item.cn_name }}</span
                        >
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('物品照片')">
                      <span class="img-item" v-for="(item, index) in goodsImgList" :key="index">
                        <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
                        <span class="model-box"></span>
                        <span class="operat-box">
                          <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                          <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
                        </span>
                      </span>
                      <el-upload
                        v-show="goodsImgList.length < 3"
                        class="avatar-uploader"
                        list-type="picture-card"
                        action=""
                        :before-upload="beforeUploadImg"
                        :http-request="uploadGoodsImg"
                        :show-file-list="false"
                      >
                        <i class="el-icon-plus"> </i>
                      </el-upload>
                      <div class="updateImg">
                        {{ $t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张') }}
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('备注')" prop="remark">
                      <el-input
                        type="textarea"
                        v-model="ruleForm.remark"
                        :placeholder="$t('请输入备注')"
                        :autosize="{ minRows: 4, maxRows: 6 }"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :lg="12">
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('快递公司')" prop="express_company_id">
                      <el-select
                        :placeholder="$t('请选择')"
                        v-model="ruleForm.express_company_id"
                        @change="handleExpressSelect"
                        clearable
                      >
                        <el-option
                          v-for="item in expressData"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('物品名称')" prop="package_name">
                      <el-input
                        :placeholder="$t('请输入物品名称')"
                        v-model="ruleForm.package_name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('商品数量')" prop="qty">
                      <el-input :placeholder="$t('请输入件数')" v-model="ruleForm.qty"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('当前件数')" prop="number">
                      <el-input
                        :placeholder="$t('请输入件数')"
                        v-model="ruleForm.number"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('包裹编码')" prop="code">
                      <el-input
                        :placeholder="$t('请输入包裹编码')"
                        v-model="ruleForm.code"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item
                      :label="$t('物品总价值') + localization.currency_unit"
                      prop="package_value"
                    >
                      <el-input
                        :placeholder="$t('请输入物品总价值')"
                        v-model="ruleForm.package_value"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-form-item :label="$t('品牌')" prop="brand_name">
                      <el-input
                        :placeholder="$t('请输入品牌')"
                        v-model="ruleForm.brand_name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="line-center"></div>
            <!--      <el-form-item :label="$t('下单方式')" prop="mode">-->
            <!--        <el-radio-group v-model="ruleForm.mode" @change="changeMethod">-->
            <!--          <el-radio :label="1">{{ $t('集齐再发') }}</el-radio>-->
            <!--          <el-radio :label="2" :disabled="ruleForm.user_id === ''">{{ $t('到件即发') }}</el-radio>-->
            <!--        </el-radio-group>-->
            <!--      </el-form-item>-->
            <div v-if="ruleForm.mode === 2">
              <h4>{{ $t('收件信息') }}</h4>
              <el-form-item :label="$t('收件形式')" prop="type">
                <el-radio-group v-model="ruleForm.type" @change="changeRadio">
                  <el-radio :label="1" :disabled="ruleForm.address_type === 2">{{
                      $t('送货上门')
                    }}</el-radio>
                  <el-radio :label="2">{{ $t('自提点提货') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('收件地址')" prop="address_type">
                <el-radio-group v-model="ruleForm.address_type" @change="changeRadio">
                  <el-radio :label="1">{{ $t('使用客户地址') }}</el-radio>
                  <el-radio :label="2" :disabled="ruleForm.type === 1">{{
                      $t('使用自提点地址')
                    }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row :gutter="20" v-if="ruleForm.address_type === 1">
                <el-col :span="12">
                  <el-form-item :label="$t('寄件地址')">
                    <div class="send">
                      <el-input
                        type="textarea"
                        :disabled="isDisable"
                        :placeholder="$t('请选择寄件地址')"
                        v-model="address"
                        :autosize="{ minRows: 4, maxRows: 6 }"
                      ></el-input>
                      <el-button class="btn-green send-btn" @click="changeAddress">{{
                          $t('更改地址')
                        }}</el-button>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2"> </el-col>
              </el-row>
              <el-form-item :label="$t('快递方式')" prop="express_line_id">
                <el-select
                  :placeholder="$t('请选择')"
                  v-model="ruleForm.express_line_id"
                  @change="changeExpress"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('自提点地址')" v-if="ruleForm.type === 2">
                <div @click="addressDialog = true" class="cursor">{{ $t('请选择') }}></div>
                <div v-if="this.selfData && this.selfData.id" class="station-text">
                  {{ selfData.address }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('清关编码')" prop="clearance_code" v-if="needCode">
                <el-input
                  v-model="ruleForm.clearance_code"
                  :placeholder="$t('请输入清关编码')"
                  class="ipt"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('身份证号')" prop="id_card" v-if="idCode">
                <el-input
                  v-model="ruleForm.id_card"
                  :placeholder="$t('请输入清关编码')"
                  class="ipt"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('个人通关码')" prop="personal_code" v-if="personalCode">
                <el-input
                  v-model="ruleForm.personal_code"
                  :placeholder="$t('请输入个人通关码')"
                  class="ipt"
                ></el-input>
              </el-form-item>
              <div class="line-center"></div>
              <h4>{{ $t('增值服务') }}</h4>
              <div class="express-left">
                <span>{{ $t('保险服务') }}</span>
                <el-tooltip class="item" effect="dark" :content="explanation" placement="top">
                  <span class="el-icon-warning-outline icon-info"></span> </el-tooltip
                ><br />
                <el-radio-group v-model="ruleForm.is_insurance" class="radio-select">
                  <el-radio :label="1">{{ $t('启用保险') }}</el-radio>
                  <el-radio :label="0">{{ $t('不启用保险') }}</el-radio>
                  <el-radio :label="2">{{ $t('仅强制要求购买保险的订单启用') }}</el-radio>
                </el-radio-group>
              </div>
              <div style="margin-top: 20px">
                <div>{{ $t('增值服务') }}</div>
                <el-checkbox-group v-model="ruleForm.added_service" class="radio-select">
                  <el-checkbox
                    :label="item.id"
                    v-for="item in servicesData"
                    :key="item.id"
                    class="radio-main"
                  >{{ item.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
              <div class="express-left">
                <span>{{ $t('关税服务') }}</span>
                <el-tooltip class="item" effect="dark" :content="tariffExplanation" placement="top">
                  <span class="el-icon-warning-outline icon-info"></span> </el-tooltip
                ><br />
                <el-radio-group v-model="ruleForm.is_tariff" class="radio-select">
                  <el-radio :label="1">{{ $t('启用关税') }}</el-radio>
                  <el-radio :label="0">{{ $t('不启用关税') }}</el-radio>
                  <el-radio :label="2">{{ $t('仅强制要求购买关税的订单启用') }}</el-radio>
                </el-radio-group>
              </div>
              <div class="recipient-address">
                <h4>{{ $t('付款方式') }}</h4>
                <div class="express-left">
                  <el-radio-group v-model="ruleForm.payment_mode" class="radio-select">
                    <el-radio :label="1" class="radio-main">{{ $t('预付') }}</el-radio>
                    <el-radio :label="2" class="radio-main">{{ $t('货到付款') }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="recipient-address">
                <h4>{{ $t('批量集包方式') }}</h4>
                <div class="express-left">
                  <el-radio-group v-model="ruleForm.changeUpdate" class="radio-select">
                    <el-radio :label="1" class="radio-main"
                    >{{ $t('按客户ID集包') }}
                      <el-tooltip
                        effect="dark"
                        :content="$t('每个客户的包裹合成一个订单')"
                        placement="top"
                      >
                        <span class="el-icon-question icon-question"></span>
                      </el-tooltip>
                    </el-radio>

                    <el-radio :label="2" class="radio-main"
                    >{{ $t('快速下单') }}
                      <el-tooltip effect="dark" :content="$t('每个包裹一个订单')" placement="top">
                        <span class="el-icon-question icon-question"></span>
                      </el-tooltip>
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div class="saveBtn">
              <el-button @click="onSave" :loading="$store.state.btnLoading">{{
                  $t('保存')
                }}</el-button>
            </div>
          </el-form>
          <el-dialog :visible.sync="boxDialog" :title="$t('收件地址列表')" @close="clearAddress">
            <div class="add-box" width="80%">
              <el-button @click="goCreated">{{ $t('新增') }}</el-button>
            </div>
            <el-table :data="tableData" border @row-click="onRowChange" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="country.name" :label="$t('国家')"> </el-table-column>
              <el-table-column prop="area" :label="$t('区域')">
                <template slot-scope="scope">
                  <span
                  >{{ scope.row.area ? scope.row.area.name : '' }}&nbsp;&nbsp;{{
                      scope.row.sub_area ? scope.row.sub_area.name : ''
                    }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column prop="postcode" :label="$t('邮编')"> </el-table-column>
              <el-table-column prop="timezone" :label="$t('区号')"> </el-table-column>
              <el-table-column prop="receiver_name" :label="$t('收件人')"> </el-table-column>
              <el-table-column :label="$t('收件电话')">
                <template slot-scope="scope">
                  <span>{{ scope.row.timezone }}-{{ scope.row.phone }}</span>
                </template>
              </el-table-column>
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
              <el-button type="primary" @click="selectAddress">{{ $t('确定') }}</el-button>
            </div>
          </el-dialog>
          <el-dialog
            :visible.sync="innerVisible"
            :title="$t('新建收货地址')"
            width="45%"
            @close="clearNewAddress"
            append-to-body
          >
            <el-form
              :model="form"
              :rules="rules"
              ref="form"
              class="demo-form-inline"
              label-width="100px"
            >
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item :label="$t('国家')" prop="country_id">
                    <el-cascader
                      v-model="form.country_id"
                      :options="countryOptions"
                      ref="country"
                      :props="props"
                      collapse-tags
                      clearable
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="$t('收件电话')" prop="phone">
                    <el-input
                      v-model="form.phone"
                      class="inner-textarea"
                      :placeholder="$t('请输入收件电话')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="$t('城市')" prop="city">
                    <el-input
                      v-model="form.city"
                      class="inner-textarea"
                      :placeholder="$t('请输入城市')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="$t('收件人')" prop="receiver_name">
                    <el-input
                      v-model="form.receiver_name"
                      class="inner-textarea"
                      :placeholder="$t('请输入收件人')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="$t('门牌号')" prop="door_no">
                    <el-input
                      v-model="form.door_no"
                      class="inner-textarea"
                      :placeholder="$t('请输入门牌号')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="$t('区号')" prop="timezone">
                    <el-select v-model="form.timezone" :placeholder="$t('请选择区号')" filterable>
                      <el-option
                        v-for="item in countryData"
                        :key="item.id"
                        :label="item.timezone"
                        :value="item.timezone"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="$t('邮编')" prop="postcode">
                    <el-input
                      v-model="form.postcode"
                      class="inner-textarea"
                      :placeholder="$t('请输入邮编')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="$t('附加地址')" prop="address">
                    <el-input
                      v-model="form.address"
                      class="inner-textarea"
                      :placeholder="$t('请输入附加地址')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="$t('街道')" prop="street">
                    <el-input
                      v-model="form.street"
                      class="inner-textarea"
                      :placeholder="$t('请输入街道')"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer">
              <el-button @click="returnShip">{{ $t('取消') }}</el-button>
              <el-button type="primary" @click="confirmCreated('ruleForm')">{{
                  $t('确定')
                }}</el-button>
            </div>
          </el-dialog>
          <el-dialog :visible.sync="addressDialog" :title="$t('自提点地址')" @close="clearSelf">
            <el-table :data="stationsData" border @row-click="onRowAddress" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <el-radio v-model="station_id" :label="scope.row.id"></el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('自提点名称')"> </el-table-column>
              <el-table-column :label="$t('详细地址')" prop="address"> </el-table-column>
            </el-table>
            <div slot="footer">
              <el-button @click="addressDialog = false">{{ $t('取消') }}</el-button>
              <el-button type="primary" @click="confirmSelf">{{ $t('确定') }}</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('批量入库')" name="2"><ImportOrder></ImportOrder></el-tab-pane>
      <el-tab-pane :label="$t('批量预报')" name="3"><BatchForecast></BatchForecast></el-tab-pane>
      <el-tab-pane :label="$t('批量上架')" name="4"><BatchShelves></BatchShelves></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ImportOrder from '@/views/order/order/importOrder'
import BatchShelves from '@/views/order/order/batchShelves'
import BatchForecast from '@/views/order/order/batchForecast'
import dialog from '@/components/dialog'
import UserSelect from '@/components/userSelect'
export default {
  components: {
    UserSelect,
    ImportOrder,
    BatchShelves,
    BatchForecast,
  },
  data() {
    return {
      activeName: '1',
      ruleForm: {
        user_id: '',
        express_num: '',
        package_weight: '',
        is_insurance: 0,
        is_tariff: 0,
        payment_mode: 1,
        changeUpdate: 1,
        added_service: [],
        props: [],
        warehouse_id: '',
        country_id: '',
        brand_name: '',
        package_value: '',
        code: '',
        is_exceptional: 0,
        package_name: '',
        qty: '',
        express_company_id: '',
        remark: '',
        location: '',
        number: '',
        express_line_id: '',
        type: 1,
        chosen_services: [],
        address_id: '',
        mode: 1,
        clearance_code: '',
        isbig: false,
        address_type: 1,
        width: '',
        height: '',
        length: '',
        station_id: '',
        package_pictures: '',
        id_card: '',
        personal_code: ''
      },
      expressNum: '',
      shipNum: '',
      locationId: '',
      explanation: '',
      tariffExplanation: '',
      userId: '',
      supplierId: '',
      supplierName: '',
      updateService: [],
      localization: {},
      goodsImgList: [],
      servicesData: [],
      expressData: [],
      warehouseData: [],
      propList: [],
      regionData: [],
      options: [],
      boxDialog: false,
      innerVisible: false,
      addressDialog: false,
      chooseId: '',
      tableData: [],
      address: '',
      countryData: [],
      countryOptions: [],
      props: { checkStrictly: true },
      userAddress: {},
      locationCode: '',
      form: {
        receiver_name: '',
        phone: '',
        timezone: '',
        country_id: [],
        door_no: '',
        city: '',
        postcode: '',
        street: '',
        address: ''
      },
      station_id: '',
      stationsData: [],
      selfData: {},
      isDisable: true,
      areaId: '',
      selfAddress: {},
      needCode: '',
      idCode: '',
      personalCode: '',
      lineId: '',
      rules: {
        country_id: [{ required: true, message: this.$t('请选择国家'), trigger: 'blur' }],
        phone: [{ required: true, message: this.$t('请输入电话'), trigger: 'blur' }],
        receiver_name: [{ required: true, message: this.$t('请输入收件人'), trigger: 'blur' }],
        city: [{ required: true, message: this.$t('请输入城市'), trigger: 'blur' }]
      },
      rule: {
        express_num: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
        package_weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        warehouse_id: [{ required: true, message: '请选择寄往仓库', trigger: 'blur' }],
        user_id: [{ required: true, message: '请选择客户', trigger: 'blur' }],
        props: [{ required: true, message: '请选择物品属性', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initQuery()
    this.getService()
    this.getExpressData()
    this.getProp()
    this.getWarehouseData()
    this.getServices()
    this.getUid()

    if (this.$route.query.type) {
      this.activeName = this.$route.query.type
    } else {
      this.activeName = '1'
    }
    if (this.$route.query.id) {
      this.getList()
    }
  },
  mounted() {},
  methods: {
    getUid() {
      this.$request.initUserId().then(res => {
        this.$store.commit('saveUid', res.data.user_uid)
        console.log(this.$store.state.uid, '@@@uid')
      })
    },
    getList() {
      let id = this.$route.query.id || this.shipNum
      this.$request.getProductDetails(id).then(res => {
        if (res.ret) {
          for (const key in this.ruleForm) {
            if (Object.hasOwnProperty.call(this.ruleForm, key) && res.data[key]) {
              if (key === 'user_id') {
                this.ruleForm[key] = `${res.data[key]}`
              } else {
                this.ruleForm[key] = res.data[key]
              }
            }
          }
          if (res.data.user_id) {
            this.userId = res.data.user_id
          }
          this.ruleForm.user_id = res.data.user_id + '---' + res.data.user_name
          this.ruleForm.props = res.data.props.map(item => item.id)
          this.ruleForm.chosen_services = res.data.chosen_services.map(item => item.service_id)
          this.getServices()
          this.ruleForm.warehouse_id = res.data.warehouse && res.data.warehouse.id
          this.getAreaLocation()
          if (res.data.express_company) {
            this.ruleForm.express_company_id = res.data.express_company.id
          }
          if (res.data.country) {
            this.$set(this.ruleForm, 'country_id', res.data.country.id)
          }
          this.areaId = this.ruleForm.warehouse_id
          this.locationId = this.areaId
          this.goodsImgList = res.data.package_pictures
          this.updateAreaData()
          this.locationCNSearch()
        }
      })
    },
    initQuery() {
      if (this.$route.query.sn) {
        this.ruleForm.express_num = this.$route.query.sn
      }
    },
    getId(id) {
      this.$request.idCards(id).then(res => {
        if (res.ret) {
          this.needCode = res.data.need_clearance_code
          this.idCode = res.data.need_id_card
          this.personalCode = res.data.need_personal_code
        }
      })
    },
    // 上传物品照片
    uploadGoodsImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.goodsImgList.push(item.path)
          })
        }
      })
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      this.goodsImgList.splice(index, 1)
    },
    beforeUploadImg(file) {
      if (!/^image/.test(file.type)) {
        this.$message.info(this.$t('请上传图片类型文件'))
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info(this.$t('上传图片大小不能超过2M'))
        return false
      }
      return true
    },
    getService() {
      this.$request.servicesPackage({ size: 100 }).then(res => {
        if (res.ret) {
          this.servicesData = res.data
        }
      })
    },
    getCountry() {
      this.$request.getCountry().then(res => {
        this.countryData = res.data
        this.countryOptions = res.data.map(item => {
          return {
            value: item.id,
            label: item.name,
            children:
              item.areas < 1
                ? undefined
                : item.areas.map(item => {
                  return {
                    value: item.id,
                    label: item.name,
                    children:
                      item.areas < 1
                        ? undefined
                        : item.areas.map(item => {
                          return {
                            value: item.id,
                            label: item.name,
                            children:
                              item.areas < 1
                                ? undefined
                                : item.areas.map(item => {
                                  return {
                                    value: item.id,
                                    label: item.name
                                  }
                                })
                          }
                        })
                  }
                })
          }
        })
      })
    },
    handleExpressSelect() {
      this.$forceUpdate()
    },
    getNum(num) {
      if (num) {
        this.expressNum = num
        this.getShipmentNum()
      } else {
        return this.$message.error(this.$t('请输入快递单号'))
      }
    },
    getShipmentNum() {
      this.$request.getShipmentNum(this.expressNum).then(res => {
        if (res.ret) {
          this.shipNum = res.data.id
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
    getExpressData() {
      this.$request.getExpressData().then(res => {
        this.expressData = res.data
      })
    },
    getProp() {
      this.$request.getProps().then(res => {
        this.propList = res.data
        this.localization = res.localization
      })
    },
    getWarehouseData() {
      this.$request.getSimpleWarehouse().then(res => {
        this.warehouseData = res.data
      })
    },
    getAreaData(id) {
      if (id) {
        this.locationId = id
        this.ruleForm.location = ''
        this.locationCNSearch()
        this.getAreaLocation()
        this.$request.getArea(id).then(res => {
          if (res.ret) {
            this.regionData = res.data
          }
        })
      }
    },
    changeSelect() {
      if (this.ruleForm.user_id) {
        if (this.locationId) {
          this.locationCNSearch()
        }
      }
      // this.getAddressDialog()
    },
    locationSearch() {
      this.$request
        .bigAutoLocation(this.locationId, {
          isbig: Number(this.ruleForm.isbig),
          // user_id: this.ruleForm.user_id.split('---')[0]
          user_id: this.supplierId
        })
        .then(res => {
          this.ruleForm.location = res.data[0].code
        })
    },
    locationCNSearch(queryString, callback) {
      var list = [{}]
      this.$request
        .AutoLocation(this.locationId, {
          keyword: this.ruleForm.location,
          // user_id: this.ruleForm.user_id.split('---')[0]
          user_id: this.supplierId
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.code
          }
          if (!this.ruleForm.location) {
            this.ruleForm.location = res.data[0].code
          }
          list = res.data
          callback && callback(list)
        })
        .catch(() => {
          // eslint-disable-next-line no-array-constructor
          callback && callback(new Array())
        })
    },
    getServices() {
      this.$request.getAllService().then(res => {
        this.updateService = res.data
      })
    },
    updateAreaData() {
      this.$request.getArea(this.areaId).then(res => {
        this.regionData = res.data
      })
    },
    queryCNSearch(queryString, callback) {
      var list = [{}]
      this.$request
        .Automatic({
          keyword: this.ruleForm.user_id.split('---')[0]
        })
        .then(res => {
          for (let i of res.data) {
            if (this.$store.state.uid === 0) {
              i.value = i.id + '---' + i.name
            } else {
              i.value = i.uid + '---' + i.name
            }
          }
          list = res.data
          callback && callback(list)
        })
    },
    handleSelect(item) {
      this.supplierId = item.id
      this.userId = item.id
      this.supplierName = item.name
      this.ruleForm.location = ''

      if (this.ruleForm.warehouse_id) {
        this.getAreaLocation()
        if (this.locationId) {
          this.locationCNSearch()
        }
      }
      this.address = ''
      this.getAddressDialog()
    },
    getAreaLocation() {
      this.locationCode = ''
      if (this.ruleForm.warehouse_id && this.userId) {
        this.$request.getAreaLocation(this.ruleForm.warehouse_id, this.userId).then(res => {
          if (res.ret) {
            this.locationCode = res.data.code
          }
        })
      }
    },
    clearAddress() {
      this.chooseId = ''
    },
    changeAddress() {
      this.boxDialog = true
      this.getAddressDialog()
    },
    changeLarge(val) {
      if (val) {
        this.locationSearch()
      } else {
        this.ruleForm.location = ''
        this.locationCNSearch()
      }
    },
    getAddressDialog() {
      this.$request
        .previewAddress({
          // user_id: this.ruleForm.user_id.split('---')[0]
          user_id: this.supplierId
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.ruleForm.address_id = res.data[0].id
            this.address =
              res.data[0].user_id +
              ' ' +
              res.data[0].timezone +
              ' ' +
              res.data[0].phone +
              ' ' +
              (res.data[0].country ? res.data[0].country.name : '') +
              (res.data[0].area ? res.data[0].area.name : '') +
              (res.data[0].sub_area ? res.data[0].sub_area.name : '') +
              res.data[0].street +
              res.data[0].door_no +
              res.data[0].city +
              res.data[0].address

            this.getExpress()
          }
        })
    },
    selectAddress() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      this.getExpress()
      this.boxDialog = false
      this.ruleForm.address_id = this.userAddress.id
      this.address =
        this.userAddress.user_id +
        ' ' +
        this.userAddress.timezone +
        ' ' +
        this.userAddress.phone +
        ' ' +
        (this.userAddress.country ? this.userAddress.country.name : '') +
        (this.userAddress.area ? this.userAddress.area.name : '') +
        (this.userAddress.sub_area ? this.userAddress.sub_area.name : '') +
        this.userAddress.street +
        this.userAddress.door_no +
        this.userAddress.city +
        this.userAddress.address
    },
    goCreated() {
      this.innerVisible = true
      this.boxDialog = false
      this.getCountry()
    },
    onRowChange(row) {
      this.chooseId = row.id
      this.ruleForm.address_id = this.chooseId
      this.userAddress = row
      console.log(this.userAddress, 'this.userAddress')
    },
    confirmCreated(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request
            .addAddress({
              ...this.form,
              country_id: this.form.country_id[0],
              area_id: this.form.country_id[1] ? this.form.country_id[1] : '',
              sub_area_id: this.form.country_id[2] ? this.form.country_id[2] : '',
              // user_id: this.ruleForm.user_id.split('---')[0]
              user_id: this.supplierId
            })
            .then(res => {
              this.notifyInfo(res)
              this.innerVisible = false
              this.boxDialog = true
              this.getAddressDialog()
            })
        } else {
          return false
        }
      })
    },
    changeRadio() {
      this.ruleForm.express_line_id = ''
      this.options = []
      this.getExpress()
    },
    getExpress() {
      const { address_id, props, length, width, height, warehouse_id, type } = this.ruleForm
      let params = {
        weight: this.ruleForm.package_weight,
        address_id,
        props,
        length,
        width,
        height,
        type,
        warehouse_id
      }
      this.$request.getExpressList(params).then(res => {
        this.notifyInfo(res)
        if (res.ret) {
          this.options = res.data.original.data
          this.ruleForm.express_line_id = res.data.original.data[0].id
          this.lineId = this.ruleForm.express_line_id
          this.getStationList()
          this.getId(this.lineId)
        }
      })
    },
    returnShip() {
      this.innerVisible = false
      this.boxDialog = true
    },
    getStationList() {
      this.$request.lineStations(this.ruleForm.express_line_id).then(res => {
        if (res.ret) {
          this.stationsData = res.data
        }
      })
    },
    openType(type) {
      this.ruleForm.mode = type
      if (this.ruleForm.mode === 2) {
        if (this.ruleForm.user_id) {
          this.getAddressDialog()
        }
      }
    },
    changeMethod() {
      if (this.ruleForm.mode === 2) {
        if (this.ruleForm.user_id) {
          this.getAddressDialog()
        }
      }
    },
    onRowAddress(row) {
      this.station_id = row.id
      this.selfAddress = row
    },
    confirmSelf() {
      if (!this.station_id) {
        return this.$message.error(this.$t('请选择'))
      }
      this.selfData = this.selfAddress
      this.addressDialog = false
    },
    changeExpress() {
      this.selfData = {}
      this.lineId = this.ruleForm.express_line_id
      this.getStationList()
      this.getId(this.lineId)
      this.ruleForm.clearance_code = ''
      this.ruleForm.id_card = ''
      this.ruleForm.personal_code = ''
    },
    clearSelf() {
      this.station_id = ''
      this.selfAddress = {}
    },
    clearNewAddress() {
      this.$refs.form.resetFields()
    },
    resetForm() {
      this.goodsImgList = []
      this.ruleForm.length = this.ruleForm.width = this.ruleForm.height = ''
      this.locationCode = ''
      this.$refs.ruleForm.resetFields()
    },
    notifyInfo(data) {
      if (data.ret) {
        this.$notify({
          type: 'success',
          title: this.$t('操作成功'),
          message: data.msg
        })
      } else {
        this.$message({
          title: this.$t('操作失败'),
          message: data.msg,
          type: 'warning'
        })
      }
    },
    onLimit() {
      let reg = /[^0-9.]/g
      if (reg.test(this.ruleForm.package_weight)) {
        this.ruleForm.package_weight = ''
        return this.$message.error(this.$t('只能输入数字'))
      }
    },
    onLimitLength() {
      let reg = /[^0-9.]/g
      if (reg.test(this.ruleForm.length)) {
        this.ruleForm.length = ''
        return this.$message.error(this.$t('只能输入数字'))
      }
    },
    onLimitWidth() {
      let reg = /[^0-9.]/g
      if (reg.test(this.ruleForm.width)) {
        this.ruleForm.width = ''
        return this.$message.error(this.$t('只能输入数字'))
      }
    },
    onLimitHeight() {
      let reg = /[^0-9.]/g
      if (reg.test(this.ruleForm.height)) {
        this.ruleForm.height = ''
        return this.$message.error(this.$t('只能输入数字'))
      }
    },
    onRecommend() {
      this.ruleForm.location = this.locationCode
    },
    onSave() {
      if (this.ruleForm.express_num === '') {
        return this.$message.error(this.$t('请输入快递单号'))
      } else if (this.ruleForm.package_weight === '') {
        return this.$message.error(this.$t('请输入重量'))
      } else if (this.ruleForm.warehouse_id === '') {
        return this.$message.error(this.$t('请选择仓库'))
      } else if (!this.ruleForm.props.length) {
        return this.$message.error(this.$t('请选择物品属性'))
      }
      if (this.ruleForm.mode === 2 && this.ruleForm.user_id === '') {
        return this.$message.error(this.$t('请输入用户编号'))
      }

      if (this.ruleForm.mode === 2) {
        if (this.ruleForm.express_line_id === '') {
          return this.$message.error(this.$t('请选择快递方式'))
        }
        if (
          (this.ruleForm.address_type === 2 || this.ruleForm.address_type === 1) &&
          !this.selfData.id &&
          this.ruleForm.type === 2
        ) {
          return this.$message.error(this.$t('请选择自提点地址'))
        }
      }
      // this.ruleForm.user_id = this.ruleForm.user_id.split('---')[0]
      this.ruleForm.user_id = this.supplierId
      this.ruleForm.package_pictures = this.goodsImgList
      this.ruleForm.station_id = this.selfData.id
      this.ruleForm.isbig = Number(this.ruleForm.isbig)
      const chosen_services = this.updateService
        .filter(item => this.ruleForm.chosen_services.includes(item.id))
        .map(item => {
          return {
            id: item.id,
            price: item.price
          }
        })
      if (this.$route.query.id) {
        this.$request
          .submitPackage(this.$route.query.id, {
            ...this.ruleForm,
            chosen_services
          })
          .then(res => {
            this.notifyInfo(res)
            if (res.ret) {
              this.resetForm()
              this.$router.replace('/station/warehouseOrder')
            }
          })
      } else {
        this.$request.inStorage({ ...this.ruleForm, chosen_services }).then(res => {
          if (res.ret === 1) {
            this.notifyInfo(res)
            this.$router.push({
              name: 'wayBillList'
            })
          } else if (res.ret === 2) {
            this.$confirm(this.$t('快递单号不存在或客户未预报请确认是否入库'), this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
              cancelButtonText: this.$t('取消'),
              type: 'warning'
            }).then(() => {
              this.$request.addShipment({ ...this.ruleForm, chosen_services }).then(res => {
                this.notifyInfo(res)
                if (res.ret) {
                  this.getServices()
                  this.resetForm()
                }
              })
            })
          } else {
            this.notifyInfo(res)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.warehouse-order {
  background-color: #fff !important;
  padding: 20px;
  .type-line {
    display: flex;
    justify-content: space-around;
    margin-bottom: 60px;
    .active-open {
      border: 2px solid #3641a3 !important;
    }
    .type-box {
      width: 450px;
      height: 225px;
      border: 2px solid #b8b8b8;
      .type-info {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        position: relative;
        .title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .sub-title {
          font-size: 14px;
          color: #737373;
          padding: 0 16px;
        }
        .open-btn {
          position: absolute;
          bottom: 30px;
        }
        .is-open {
          width: 100px;
          height: 30px;
          background-color: #3641a3;
          color: #ffffff;
          text-align: center;
          line-height: 30px;
          position: absolute;
          top: 0;
          left: 0;
          border-bottom-right-radius: 18px;
        }
      }
    }
  }
  .type-font {
    color: #993433;
    font-weight: bold;
  }
  .express-num {
    .el-form-item__content .el-input__inner {
      height: 50px !important;
    }
  }
  .line-center {
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
  .size {
    .size-item {
      width: 20%;
      margin-right: 10px;
    }
  }
  .service {
    .service-item {
      float: left;
      width: 310px;
      margin-right: 25px;
      overflow: hidden;
      .add-value-ipt {
        width: 100px;
        margin-left: 5px;
      }
    }
  }
  .express-left {
    display: inline-block;
  }
  .radio-select {
    margin-top: 20px;
    .radio-main {
      margin-bottom: 10px;
    }
  }
  .send {
    display: flex;
    align-items: center;
    .send-btn {
      margin-left: 10px;
    }
  }
  .changeQuery {
    .el-autocomplete {
      width: 60%;
    }
  }
  .ipt {
    width: 50%;
  }
  .input-box {
    width: 60%;
  }
  .img-item {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      .model-box,
      .operat-box {
        opacity: 1;
        transition: all 0.5s ease-in;
      }
    }
  }
  .operat-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    i {
      font-size: 20px;
      color: #fff;
      margin-right: 10px;
    }
  }
  .model-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .updateImg {
    margin-top: 10px;
    color: #ccc;
  }
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
  }
  .location-box {
    margin-left: 10px;
  }
  .icon-question,
  .icon-info {
    margin-left: 5px;
    font-size: 18px;
    color: #67c23a;
    position: relative;
    top: 3px;
  }
  .cursor {
    cursor: pointer;
  }
  .station-text {
    color: #b6b6b6;
  }
  .saveBtn {
    margin-top: 20px;
    .el-button {
      background-color: #3540a5;
      color: #fff;
      padding: 15px 35px;
    }
  }
}
</style>

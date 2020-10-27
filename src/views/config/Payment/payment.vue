<template>
    <div class="payment-container">
      <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
        <!-- 支付配置 -->
        <el-tab-pane :label="$t('支付配置')" name="1">
          <!-- 微信支付 -->
          <h4>{{$t('在线支付')}}</h4>
          <el-table v-if="paymentData.length" :data="paymentData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column :label="$t('类型')" prop="name"></el-table-column>
            <el-table-column :label="$t('是否启用')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeOnline($event, scope.row.type)"
                  :active-text="$t('开')"
                  :inactive-text="$t('关')"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column :label="$t('配置')">
              <template slot-scope="scope">
                <el-button v-if="scope.row.type === 1 || scope.row.type === 2 || scope.row.type === 4" class="btn-main" @click="configuration(scope.row.type, scope.row.name)">{{$t('配置')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 转账支付 -->
          <div class="select-box">
          <h4>{{$t('转账支付')}}</h4>
          <add-btn @click.native="addTransfer">{{$t('添加支付类型')}}</add-btn>
        </div>
          <el-table :data="transferData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column :label="$t('类型')" prop="name"></el-table-column>
            <el-table-column :label="$t('是否启用')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
                  :active-text="$t('开')"
                  :inactive-text="$t('关')"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onLang(scope.row, item)"></span>
                <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editTransfer(scope.row.id)">{{$t('编辑')}}</el-button>
                <el-button class="btn-light-red" @click="deleteTransfer(scope.row.id)">{{$t('删除')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 预设充值金额 -->
          <div class="select-box">
          <h4>{{$t('预设充值金额')}}</h4>
          <add-btn @click.native="addRecharge">{{$t('新增')}}</add-btn>
        </div>
          <el-table :data="rechargeAmount" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column :label="$t('金额')" prop="amount"></el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button class="btn-light-red" @click="deleteRecharge(scope.row.id)">{{$t('删除')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 物流跟踪配置 -->
      <el-tab-pane :label="$t('服务配置')" name="2">
        <div class="logistics-container">
          <div class="form-title">{{$t('快递100配置')}}</div>
          <el-form :model="logisticsData" ref="ruleForm" class="demo-ruleForm"
            label-position="left" label-width="150px">
            <!-- Customer ID -->
            <el-form-item label="Customer ID" prop="kd100_app_id">
              <el-input v-model="logisticsData.kd100_app_id" :placeholder="$t('请输入Customer ID')" class="logistic-sty"></el-input>
            </el-form-item>
            <!-- 授权KEY -->
            <el-form-item :label="$t('授权KEY')" prop="kd100_app_key">
              <el-input v-model="logisticsData.kd100_app_key" :placeholder="$t('请输入授权KEY')" class="logistic-sty"></el-input>
              <div class="test-btn">
                <el-button class="btn-light-red" @click="testExpress">{{$t('测试')}}</el-button>
              </div>
            </el-form-item>
          <div class="form-title">{{$t('Tracking more配置')}}</div>
          <el-form-item label="Appkey" prop="trackingmore_key">
            <el-input v-model="logisticsData.trackingmore_key" :placeholder="$t('请输入AppSecret')" class="logistic-sty"></el-input>
            <div class="test-btn">
              <el-button class="btn-light-red" @click="testTracking">{{$t('测试')}}</el-button>
            </div>
          </el-form-item>
          <div class="form-title">{{$t('邮箱发件信息配置')}}</div>
          <el-form-item :label="$t('发件人邮件')" prop="from_address">
            <el-input v-model="logisticsData.from_address" placeholder="请输入发件人邮件" class="logistic-sty"></el-input>
          </el-form-item>
            <el-form-item :label="$t('发件人名称')" prop="from_name">
              <el-input v-model="logisticsData.from_name" :placeholder="$t('请输入发件人名称')" class="logistic-sty"></el-input>
            </el-form-item>
            <el-form-item :label="$t('SMTP域名')" prop="host">
              <el-input v-model="logisticsData.host" :v-html="$t('请输入SMTP域名')" class="logistic-sty"></el-input>
            </el-form-item>
            <el-form-item :label="$t('SMTP端口')" prop="port">
              <el-input v-model="logisticsData.port" :placeholder="$t('请输入SMTP端口')" class="logistic-sty"></el-input>
            </el-form-item>
            <el-form-item :label="$t('发件人用户名')" prop="username">
              <el-input v-model="logisticsData.username" placeholder="请输入发件人用户名" class="logistic-sty"></el-input>
            </el-form-item>
            <el-form-item :label="$t('发件人密码')" prop="password">
              <el-input type="password" v-model="logisticsData.password" :placeholder="$t('请输入发件人密码')" class="logistic-sty"></el-input>
              <div class="test-btn">
                <el-button class="btn-light-red" @click="testSmtp">{{$t('测试')}}</el-button>
              </div>
            </el-form-item>
            <el-form-item :label="$t('加密方式')">
              <el-radio-group v-model="logisticsData.encryption" class="logistic-sty">
                <el-radio :label="0">{{$t('无')}}</el-radio>
                <el-radio :label="1">{{$t('TLS加密')}}</el-radio>
                <el-radio :label="2">{{$t('SSL加密')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('开启邮箱登录验证')">
              <el-switch
                v-model="logisticsData.validate_email"
                :active-text="$t('开')"
                :active-value="1"
                :inactive-value="0"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </el-form-item>
          <div class="form-title">{{$t('短信配置——聚合')}}</div>
          <el-form-item label="Appkey" prop="juhe_key">
            <el-input v-model="logisticsData.juhe_key" placeholder="请输入Appkey"
            class="logistic-sty"></el-input>
          </el-form-item>
            <el-form-item :label="$t('发送验证码模板ID')" prop="juhe_tpl_id">
              <el-input v-model="logisticsData.juhe_tpl_id" placeholder="请输入发送验证码模板ID" class="logistic-sty"></el-input>
              <div class="test-btn">
                <el-button class="btn-light-red" @click="testJuhe">{{$t('测试')}}</el-button>
              </div>
            </el-form-item>
            <el-form-item :label="$t('开启短信登录验证')">
              <el-switch
                v-model="logisticsData.validate_phone"
                :active-text="$t('开')"
                :active-value="1"
                :inactive-value="0"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </el-form-item>
          </el-form>
          <div>
            <el-button :loading="$store.state.btnLoading" class="save-btn" @click="confirmLogistic('ruleForm')">{{$t('保存')}}</el-button>
          </div>
        </div>
        </el-tab-pane>
        <!-- 基础配置 -->
        <el-tab-pane :label="$t('基础配置')" name="3">
          <!-- 重量及货币配置 -->
          <div class="settings-container">
            <el-form>
                <!-- 重量单位： -->
                <el-form-item :label="$t('重量单位：')">
                    <el-select v-model="weightName" :placeholder="$t('请选择')">
                      <el-option
                      v-for="item in weightList"
                      :key="item.id"
                      :value="item.name"
                      :label="item.name">
                      </el-option>
                    </el-select>
                </el-form-item>
                <!-- 货币单位： -->
                <el-form-item :label="$t('货币单位：')">
                    <el-select v-model="currencyName" :placeholder="$t('请选择')">
                      <el-option
                      v-for="item in currencyList"
                      :key="item.id"
                      :value="item.name"
                      :label="item.name">
                      </el-option>
                    </el-select>
                </el-form-item>
                <!-- 长度单位 -->
                <el-form-item :label="$t('长度单位：')">
                    <el-select v-model="lengthName" :placeholder="$t('请选择')">
                      <el-option
                      v-for="(item, index) in lengthList"
                      :key="index"
                      :value="item.name"
                      :label="item.name">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('结算货币：')">
                  <el-select v-model="currency" :placeholder="$t('请选择')">
                    <el-option
                    v-for="item in rateList"
                    :key="item.id"
                    :value="item.code"
                    :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- 未入库丢包预警 -->
                <el-form-item>
                  <span class="no-warehouse">{{$t('未入库丢包预警')}}</span>
                  <el-tooltip class="item" effect="dark" :content="$t('开启后，若预报包裹超过设定时间未入库，将会在包裹列表进行提示，表示包裹有丢失风险')" placement="top">
                  <span class="el-icon-question icon-question"></span>
                  </el-tooltip>
                  <el-radio-group v-model="basic.package_warning" @change="changeBasic" class="radio-sty">
                    <el-radio :label="5">{{$t('5天')}}</el-radio>
                    <el-radio :label="7">{{$t('7天')}}</el-radio>
                    <el-radio :label="10">{{$t('10天')}}</el-radio>
                    <el-radio :label="0">{{$t('不开启')}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('物品属性：')">
                  <el-tag
                    :key="item.id"
                    v-for="item in dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(item.id)">
                    {{item.cn_name}}
                  </el-tag>
                <el-button class="btn-light-red" @click="addProps">{{$t('添加属性')}}</el-button>
                <el-button class="btn-deep-purple others-btn" v-for="item in formatLangData" :key="item.id" @click="onProps(item)">{{item.name}}</el-button>
                </el-form-item>
                <!-- 预报选择线路 -->
              <!-- <el-form-item :label="$t('预报选择线路')">
                    <el-switch
                      v-model="package_express_line"
                      :active-text="$t('开')"
                      :active-value="1"
                      :inactive-value="0"
                      :inactive-text="$t('关')"
                      active-color="#13ce66"
                      inactive-color="gray">
                    </el-switch>
                </el-form-item> -->
                <el-form-item :label="$t('入库是否必填尺寸')">
                  <el-switch
                    v-model="basic.size"
                    @change="changeBasic($event)"
                    :active-text="$t('开')"
                    :inactive-text="$t('关')"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </el-form-item>
                <el-form-item :label="$t('入库是否必填货位')">
                  <el-switch
                    v-model="basic.location"
                    @change="changeBasic($event)"
                    :active-text="$t('开')"
                    :inactive-text="$t('关')"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </el-form-item>
              <el-button :loading="$store.state.btnLoading" class="save-btn" @click="saveSetting">{{$t('保存')}}</el-button>
              </el-form>
          </div>
        </el-tab-pane>
        <!-- 订单增值服务 -->
        <el-tab-pane :label="$t('订单增值服务')" name="4">
          <div class="select-box">
            <add-btn @click.native="addService">{{$t('添加订单增值服务')}}</add-btn>
          </div>
            <el-table :data="valueData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" :label="$t('增值服务名称')"></el-table-column>
            <el-table-column prop="price" :label="'价格' + this.localization.currency_unit"></el-table-column>
            <el-table-column prop="remark" :label="$t('备注')"></el-table-column>
              <el-table-column :label="$t('是否启用')">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeService($event, scope.row.id)"
                    :active-text="$t('开')"
                    :inactive-text="$t('关')"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
              </el-table-column>
          <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onService(scope.row, item)"></span>
              <span v-else class="el-icon-plus icon-sty" @click="onService(scope.row, item)"></span>
            </template>
          </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button class="btn-dark-green" @click="editService(scope.row.id)">{{$t('编辑')}}</el-button>
                  <el-button class="btn-light-red" @click="deleteService(scope.row.id)">{{$t('删除')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
          <!-- 保险服务 -->
          <div class="select-box">
            <h4>{{$t('保险服务')}}</h4>&nbsp;&nbsp;&nbsp;
              <!-- v-model="enabled" -->
            <el-switch
              v-model="insuranceEnabled"
              @change="changeInsurance($event)"
              :active-value="1"
              :inactive-value="0"
              :active-text="$t('开')"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
          </el-switch>
          <el-button class="add-insurance" @click="goInsurance">{{$t('保险说明')}}</el-button>
          </div>
          <el-table :data="insuranceData" v-loading="tableLoading" class="data-list" v-if="insuranceEnabled === 1"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column :label="$t('商品价值')+ this.localization.currency_unit" prop="divide_string"></el-table-column>
            <el-table-column :label="$t('保价类型')">
              <template slot-scope="scope">
                <span v-if="scope.row.insurance_type === 1">{{$t('比例')}}</span>
                <span v-if="scope.row.insurance_type === 2">{{$t('固定金额')}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('保险金额')">
              <template slot-scope="scope">
                <span v-if="scope.row.insurance_type === 1">
                  {{scope.row.insurance_proportion}}%
                </span>
                <span v-if="scope.row.insurance_type === 2">
                  {{localization.currency_unit}}{{scope.row.insurance_proportion}}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('是否强制购买')">
              <template slot-scope="scope">
                <span v-if="scope.row.is_force === 0">{{$t('否')}}</span>
                <span v-if="scope.row.is_force === 1">{{$t('是')}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onLang(scope.row, item)"></span>
                <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
              </template>
            </el-table-column> -->
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editInsurance(scope.row.id, scope.row.is_start)">{{$t('编辑')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 包裹增值服务 -->
        <el-tab-pane :label="$t('包裹增值服务')" name="5">
          <div class="select-box">
            <add-btn @click.native="addParcel">{{$t('添加包裹增值服务')}}</add-btn>
          </div>
            <el-table :data="parcelData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" :label="$t('增值服务名称')"></el-table-column>
            <el-table-column prop="price" :label="$t('价格') + this.localization.currency_unit"></el-table-column>
            <el-table-column prop="remark" :label="$t('备注')"></el-table-column>
              <el-table-column :label="$t('是否启用')">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeParcel($event, scope.row.id)"
                    :active-text="$t('开')"
                    :inactive-text="$t('关')"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onPackage(scope.row, item)"></span>
                  <span v-else class="el-icon-plus icon-sty" @click="onPackage(scope.row, item)"></span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button class="btn-dark-green" @click="editParcel(scope.row.id)">{{$t('编辑')}}</el-button>
                  <el-button class="btn-light-red" @click="deleteParcel(scope.row.id)">{{$t('删除')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 其余配置 -->
      <el-tab-pane :label="$t('PC端配置')" name="6">
        <!-- 其余配置 -->
      <div class="setOthers">
        <el-form :model="setForm" ref="setForm" class="demo-ruleForm"
        label-width="150px" label-position="left">
            <!-- 网站名称 -->
            <el-form-item :label="$t('*网站名称')">
              <el-input v-model="setForm.website_name">
              </el-input>
              <el-button class="btn-deep-purple others-btn" v-for="item in formatLangData" :key="item.id" @click="onPc(item)">{{item.name}}</el-button>
            </el-form-item>
            <!-- 网站链接 -->
            <el-form-item class="url-sty">
              <div slot="label">
                <span>{{$t('*网站链接')}}</span>
                <el-tooltip effect="dark" :content="$t('主要用于集运插件识别（非常重要,多个用英文逗号切分，例如http.www.baidu.com,http.www.google.com')" placement="top">
                  <span class="el-icon-question icon-question"></span>
                </el-tooltip>
              </div>
              <el-input v-model="setForm.pc_website_url" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"
              >
              </el-input>
            </el-form-item>
            <!-- 网站ID -->
            <el-form-item :label="$t('*网站ID')">
              <el-input v-model="setForm.app_id">
              </el-input>
            </el-form-item>
             <el-form-item :label="$t('*备案号')">
              <el-input v-model="setForm.icp">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('*网站Secret')">
              <el-input v-model="setForm.secret">
              </el-input>
            </el-form-item>
            <el-form-item label="*token">
              <el-input v-model="setForm.token">
              </el-input>
            </el-form-item>
            <el-form-item label="*aes_key">
              <el-input v-model="setForm.aes_key">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('*小程序码')" class="updateChe">
                <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                    <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
                </span>
                </span>
                <el-upload
                  v-show="baleImgList.length < 1"
                  class="avatar-uploader"
                  action=""
                  list-type="picture-card"
                  :http-request="uploadBaleImg"
                  :show-file-list="false">
                  <i class="el-icon-plus">
                  </i>
              </el-upload>
            </el-form-item>
            <!-- pc端客服二维码 -->
            <el-form-item :label="$t('*pc端客服二维码')" class="updateChe">
                <span class="img-item" v-for="(item, index) in customerList" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                    <i class="el-icon-delete" @click="onDeleteCus(index)"></i>
                </span>
                </span>
              <el-upload
                v-show="customerList.length < 1"
                class="avatar-uploader"
                action=""
                list-type="picture-card"
                :http-request="customerImg"
                :show-file-list="false">
                <i class="el-icon-plus">
                </i>
            </el-upload>
            </el-form-item>
            <!-- LOGO -->
            <el-form-item label="*LOGO" class="updateChe">
                <span class="img-item" v-for="(item, index) in LogoImgList" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                    <i class="el-icon-delete" @click="onDeleteLogo(index)"></i>
                </span>
                </span>
                <el-upload
                  v-show="LogoImgList.length < 1"
                  class="avatar-uploader"
                  action=""
                  list-type="picture-card"
                  :http-request="uploadLogo"
                  :show-file-list="false">
                  <i class="el-icon-plus">
                  </i>
              </el-upload>
            </el-form-item>
            <!-- 登录页背景图 -->
            <el-form-item :label="$t('*登录页背景图')" class="updateChe">
                <span class="img-item" v-for="(item, index) in bgList" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                    <i class="el-icon-delete" @click="onDeleteBg(index)"></i>
                </span>
                </span>
              <el-upload
                v-show="bgList.length < 1"
                class="avatar-uploader"
                action=""
                list-type="picture-card"
                :http-request="bgImg"
                :show-file-list="false">
                <i class="el-icon-plus">
                </i>
            </el-upload>
            </el-form-item>
            </el-form>
          <el-button :loading="$store.state.btnLoading" class="save-btn" @click="editOthers">{{$t('保存')}}</el-button>
        </div>
        </el-tab-pane>
        <!-- 订单增值服务 -->
        <el-tab-pane :label="$t('商品分类管理')" name="7">
          <div class="select-box">
            <add-btn @click.native="addClassify">{{$t('添加商品分类')}}</add-btn>
          </div>
        <el-table :data="CategoriesList" stripe
          border class="data-list"
          @expand-change="onExpand"
          v-loading="tableLoading">
          <!-- 二级分类列表 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.orders">
                <!-- 二级分类名称 -->
                <el-table-column :label="$t('二级分类名称')" prop="name"></el-table-column>
                <!-- 是否显示 -->
                <el-table-column :label="$t('是否显示')">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.enabled"
                      @change="changeShow($event, scope.row.id)"
                      :active-text="$t('开')"
                      :inactive-text="$t('关')"
                      active-color="#13ce66"
                      inactive-color="gray">
                    </el-switch>
                </template>
                </el-table-column>
                <!-- 是否开启风险提示 -->
                <el-table-column :label="$t('是否开启风险提示')">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.risk_warning_enabled"
                      @change="changeRisk($event, scope.row.id)"
                      :active-text="$t('开')"
                      :inactive-text="$t('关')"
                      active-color="#13ce66"
                      inactive-color="gray">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onCategories(scope.row, item)"></span>
                    <span v-else class="el-icon-plus icon-sty" @click="onCategories(scope.row, item)"></span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('操作')" width="300">
                  <template slot-scope="scope">
                    <!-- 编辑 -->
                    <el-button class="btn-dark-green btn-margin" @click="editClassify(scope.row.id)">{{$t('编辑')}}</el-button>
                    <!-- 风险提示 -->
                    <el-button class="btn-main" @click="goSick(scope.row.id)">{{$t('风险提示')}}</el-button>
                    <!-- 删除 -->
                    <el-button @click="deleteCategories(scope.row.id)" class="btn-light-red">{{$t('删除')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
            <!-- 一级分类列表 -->
            <el-table-column type="index" width="50"></el-table-column>
            <!-- 一级分类名称 -->
            <el-table-column :label="$t('一级分类名称')" prop="name"></el-table-column>
            <!-- 是否显示 -->
            <el-table-column :label="$t('是否显示')">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeShow($event, scope.row.id)"
                    :active-text="$t('开')"
                    :inactive-text="$t('关')"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
            </el-table-column>
            <!-- 是否开启风险提示 -->
            <el-table-column :label="$t('是否开启风险提示')">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.risk_warning_enabled"
                    @change="changeRisk($event, scope.row.id)"
                    :active-text="$t('开')"
                    :inactive-text="$t('关')"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
            </el-table-column>
            <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onCategories(scope.row, item)"></span>
                <span v-else class="el-icon-plus icon-sty" @click="onCategories(scope.row, item)"></span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :label="$t('操作')" width="300">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button class="btn-dark-green btn-margin" @click="editClassify(scope.row.id)">{{$t('编辑')}}</el-button>
                <!-- 风险提示 -->
                <el-button class="btn-main" @click="goSick(scope.row.id)">{{$t('风险提示')}}</el-button>
                <!-- 删除 -->
                <el-button class="btn-light-red btn-margin" @click="deleteCategories(scope.row.id)">{{$t('删除')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 邮件模版 -->
        <el-tab-pane :label="$t('邮件模版')" name="8">
          <div class="select-box">
            <search-select :placeholder="$t('请选择')" :selectArr="emailType"
            v-model="page_params.type" @search="onGroupChange">
          </search-select>
          <add-btn router="emailAdd">{{$t('添加邮件模版')}}</add-btn>
        </div>
          <el-table :data="emailData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <!-- 模版类型 -->
            <el-table-column :label="$t('模版类型')">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">{{$t('绑定邮箱')}}</span>
                <span v-if="scope.row.type === 2">{{$t('更改邮箱')}}</span>
                <span v-if="scope.row.type === 3">{{$t('登录邮件')}}</span>
                <span v-if="scope.row.type === 4">{{$t('订单支付成功')}}</span>
                <span v-if="scope.row.type === 5">{{$t('已发货订单')}}</span>
                <span v-if="scope.row.type === 6">{{$t('已入库包裹')}}</span>
                <span v-if="scope.row.type === 7">{{$t('提交订单成功')}}</span>
              </template>
            </el-table-column>
            <!-- 邮件标题 -->
            <el-table-column :label="$t('邮件标题')" prop="title"></el-table-column>
            <el-table-column :label="$t('是否启用')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeEmail($event, scope.row.enabled, scope.row.id)"
                  :active-text="$t('开')"
                  :inactive-text="$t('关')"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column :label="$t('创建时间')" prop="created_at"></el-table-column>
            <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onEmail(scope.row, item)"></span>
                <span v-else class="el-icon-plus icon-sty" @click="onEmail(scope.row, item)"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')" width="150">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editEmail(scope.row.id)">{{$t('编辑')}}</el-button>
                <el-button class="btn-light-red" @click="deleteEmail(scope.row.id)">{{$t('删除')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 发货快递公司 -->
        <el-tab-pane :label="$t('发货快递公司')" name="9">
          <div class="select-box">
            <add-btn @click.native="addExpress">{{$t('添加')}}</add-btn>
          </div>
            <el-table :data="expressData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <!-- 状态 -->
            <el-table-column :label="$t('状态')">
              <template slot-scope="scope">
                <span v-if="scope.row.status === false">{{$t('禁用')}}</span>
                <span v-if="scope.row.status === true">{{$t('启用')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="LOGO">
              <template slot-scope="scope">
                <span style="cursor:pointer;" v-if="scope.row.logo"
                  @click.stop="imgSrc=scope.row.logo, imgVisible=true">
                    <img :src="scope.row.logo" style="width:70px; height: 80px;">
                </span>
                <!-- <span v-else style="cursor:pointer;" @click.stop="imgSrc=scope.row.logo, imgVisible=true">
                  <img :src="$baseUrl.IMAGE_URL + scope.row.logo" style="width:70px; height: 80px;">
                </span> -->
              </template>
            </el-table-column>
            <!-- 快递公司名称 -->
            <el-table-column prop="name" :label="$t('快递公司名称')"></el-table-column>
            <!-- 快递公司代码 -->
             <el-table-column prop="code" :label="$t('快递公司代码')"></el-table-column>
             <!-- 联系电话 -->
             <el-table-column prop="contact_phone" :label="$t('联系电话')"></el-table-column>
             <!-- 官网 -->
            <el-table-column prop="website" :label="$t('官网')"></el-table-column>
            <el-table-column :label="$t('是否启用')" width="120px">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    @change="changeExpress($event, scope.row.id)"
                    :active-text="$t('开')"
                    :inactive-text="$t('关')"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
            </el-table-column>
            <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onExpress(scope.row, item)"></span>
              <span v-else class="el-icon-plus icon-sty" @click="onExpress(scope.row, item)"></span>
            </template>
          </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button class="btn-dark-green" @click="editExpress(scope.row.id)" v-if="scope.row.is_default === 0">{{$t('编辑')}}</el-button>
                  <el-button class="btn-light-red delete-btn" @click="deleteService(scope.row.id)" v-if="scope.row.is_default === 0">{{$t('删除')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 单号规则 -->
        <el-tab-pane :label="$t('单号规则')" name="10">
          <el-table :data="rulesData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <!-- 状态 -->
            <el-table-column :label="$t('项目名称')">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">{{$t('会员编号')}}</span>
                <span v-if="scope.row.type === 2">{{$t('订单编号')}}</span>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column :label="$t('状态')">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">{{$t('关闭')}}</span>
                <span v-if="scope.row.status === 1">{{$t('启用')}}</span>
              </template>
            </el-table-column>
            <!-- 前缀字符 -->
             <el-table-column prop="prefix" :label="$t('前缀字符')"></el-table-column>
             <!-- 单号长度 -->
             <el-table-column prop="length" :label="$t('单号长度')"></el-table-column>
             <!-- 数字增值 -->
            <el-table-column prop="system" :label="$t('数字增值')"></el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button class="btn-dark-green" @click="editRules(scope.row.id, scope.row.type)">{{$t('编辑')}}</el-button>
                <!-- 重新生成 -->
                <el-button class="btn-light-red delete-btn" @click="regenerate(scope.row.id)" v-if="scope.row.type === 1">{{$t('重新生成')}}</el-button>
              </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 国家地区 -->
        <el-tab-pane :label="$t('国家地区')" name="11">
          <div class="select-box">
            <add-btn @click.native="addCountry">{{$t('添加')}}</add-btn>
          </div>
          <el-table :data="countryData" v-loading="tableLoading" class="data-list country"
            border stripe>
            <el-table-column width="100px" align="center">
              <template >
                <i class="el-icon-sort icon-fonts"></i>
              </template>
            </el-table-column>
            <!-- 前缀字符 -->
             <el-table-column prop="name" :label="$t('国家/地区')">
             </el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <!-- 删除 -->
                <el-button class="btn-light-red" @click="deleteCountry(scope.row.id)">{{$t('删除')}}</el-button>
              </template>
              </el-table-column>
            </el-table>
            <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
            <div class="sort-sty">*{{$t('拖拽行可以进行排序')}}
              <el-button @click="rowUpdate" class="btn-deep-purple save-sort">{{$t('保存排序结果')}}</el-button>
            </div>
        </el-tab-pane>
        <!-- 自定义轨迹类型 -->
        <el-tab-pane :label="$t('自定义轨迹类型')" name="12">
          <div class="select-box">
          <h4>{{$t('系统物流类型')}}</h4>
          <!-- <add-btn @click.native="addTransfer">{{$t('添加支付类型')}}</add-btn> -->
        </div>
          <el-table :data="systemData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column :label="$t('类型')" prop="name"></el-table-column>
            <el-table-column :label="$t('是否启用')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  @change="changeSystem($event, scope.row.status, scope.row.id)"
                  :active-text="$t('开')"
                  :inactive-text="$t('关')"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column :label="$t('描述')" prop="context"
            :show-overflow-tooltip="true" width="120"></el-table-column>
            <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="trackingLang(scope.row, item)"></span>
                <span v-else class="el-icon-plus icon-sty" @click="trackingLang(scope.row, item)"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editTracking(scope.row.id)">{{$t('编辑')}}</el-button>
                <!-- <el-button class="btn-light-red" @click="deleteTransfer(scope.row.id)">{{$t('删除')}}</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 自定义级别物流类型 -->
          <div class="select-box">
            <h4>{{$t('自定义物流类型')}}</h4>
            <add-btn @click.native="addLogisticsType">{{$t('添加')}}</add-btn>
          </div>
          <el-table :data="TypeData" v-loading="tableLoading" class="data-list logistics-type"
            border stripe>
            <el-table-column width="100px" align="center">
              <template >
                <i class="el-icon-sort icon-fonts"></i>
              </template>
            </el-table-column>
            <!-- 物流类型 -->
             <el-table-column prop="context" :label="$t('物流信息')">
             </el-table-column>
             <!-- 是否启用 -->
            <el-table-column :label="$t('是否启用')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  @change="changeType($event, scope.row.status, scope.row.id)"
                  :active-text="$t('开')"
                  :inactive-text="$t('关')"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="TypeLang(scope.row, item)"></span>
                <span v-else class="el-icon-plus icon-sty" @click="TypeLang(scope.row, item)"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')" width="160px">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editLogisticsType(scope.row.id)">{{$t('编辑')}}</el-button>
                <el-button class="btn-light-red" @click="deleteLogisticsType(scope.row.id)">{{$t('删除')}}</el-button>
              </template>
            </el-table-column>
            </el-table>
            <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
            <div class="sort-sty">*{{$t('拖拽行可以进行排序')}}
              <el-button @click="typeRowUpdate" class="btn-deep-purple save-sort">{{$t('保存排序结果')}}</el-button>
            </div>
        </el-tab-pane>
        <!-- 汇率配置 -->
        <el-tab-pane :label="$t('汇率配置')" name="13">
          <div class="rate-top">
            <div class="rate-left">
              1&nbsp;{{$t('人民币')}}&nbsp;= <el-input v-model="rate" class="input-sty" :placeholder="$t('请输入')"></el-input>
              {{currencyData.name}}
            </div>
            <el-button class="btn-dark-green" @click="saveRate">{{$t('保存')}}</el-button>
            <el-button class="btn-blue-green" @click="autoGet">{{$t('自动获取')}}</el-button>
          </div>
            <el-table :data="ratesData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="rate" :label="$t('汇率（当前币种:' + currencyData.name + '）')"></el-table-column>
            <el-table-column :label="$t('是否生效')">
              <template slot-scope="scope">
                <span v-if="scope.row.enabled === 1">{{$t('是')}}</span>
                <span v-if="scope.row.enabled === 0">{{$t('否')}}</span>
              </template>
              </el-table-column>
              <!-- 创建人 -->
              <el-table-column :label="$t('创建人')" prop="operator"></el-table-column>
              <!-- 创建时间 -->
              <el-table-column :label="$t('创建时间')" prop="created_at"></el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.enabled === 0" class="btn-dark-green" @click="changeRate(scope.row.id)">{{$t('生效')}}</el-button>
                  <el-button class="btn-light-red" @click="deleteRate(scope.row.id)">{{$t('删除')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
      </el-tabs>
      <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
    <!-- 预设充值金额 -->
    <el-dialog :visible.sync="rechargeDialog" width="30%" :title="$t('*预设充值金额')" @close="clear">
      <el-input v-model="amount"></el-input>
      <div slot="footer">
        <el-button @click="rechargeDialog = false">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="submitRecharge">{{$t('确定')}}</el-button>
      </div>
    </el-dialog>
    <!-- 编辑系统物流类型 -->
    <el-dialog :visible.sync="trackingDialog" width="30%" :title="$t('编辑')" @close="clearTracking">
      <el-input v-model="context" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
      <div slot="footer">
        <el-button @click="trackingDialog = false">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="saveTackingType">{{$t('确定')}}</el-button>
      </div>
    </el-dialog>
    <!-- 自定义物流类型 -->
    <el-dialog :visible.sync="expressDialog" width="30%" :title="this.typeId ? $t('编辑') : $t('新增')" @close="clearType">
      <el-form :model="typeForm" ref="typeForm" class="demo-ruleForm">
        <el-form-item :label="$t('物流信息')">
          <el-input v-model="typeForm.context"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer">
        <el-button @click="expressDialog = false">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="submitExpress">{{$t('确定')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import NlePagination from '@/components/pagination'
import { SearchSelect } from '@/components/searchs'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  components: {
    AddBtn,
    NlePagination,
    SearchSelect
  },
  mixins: [pagination],
  data () {
    return {
      countrySendData: [],
      typeSendData: [],
      paymentData: [
        {
          enabled: true
        }
      ],
      emailData: [
        {
          enabled: true
        }
      ],
      transferData: [
        {
          enabled: true
        }
      ],
      systemData: [],
      logisticsTypeData: [],
      TypeData: [],
      typeForm: {
        context: ''
      },
      rechargeAmount: [],
      amount: '',
      valueData: [
        {
          enabled: true
        }
      ],
      ratesData: [],
      rate: '',
      currencyData: {},
      insuranceEnabled: 0,
      insuranceData: [],
      parcelData: [
        {
          enabled: true
        }
      ],
      expressData: [
        {
          status: true
        }
      ],
      ids: '',
      rulesData: [],
      countryData: [],
      tableLoading: false,
      imgVisible: false,
      imgSrc: '',
      localization: {},
      activeName: '1',
      logisticsData: {
        trackingmore_key: '',
        kd100_app_id: '',
        kd100_app_key: '',
        juhe_key: '',
        juhe_tpl_id: '',
        host: '',
        port: '',
        encryption: '',
        validate_email: '',
        validate_phone: '',
        username: '',
        password: '',
        from_address: '',
        from_name: ''
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      weightName: '',
      package_express_line: '',
      lengthName: '',
      currency: '',
      currencyName: '',
      weightList: [],
      currencyList: [],
      lengthList: [],
      rateList: [],
      noWarehouse: [
        {
          id: 5,
          name: this.$t('5天')
        },
        {
          id: 7,
          name: this.$t('7天')
        },
        {
          id: 10,
          name: this.$t('10天')
        },
        {
          id: 0,
          name: this.$t('不开启')
        }
      ],
      setForm: {
        website_name: '',
        default_img: [],
        customer_qr_code: [],
        pc_website_url: '',
        secret: '',
        app_id: '',
        icp: '',
        token: '',
        aes_key: ''
      },
      tranAmount: '',
      baleImgList: [],
      LogoImgList: [],
      customerList: [],
      bgList: [],
      CategoriesList: [
        {
          enabled: true,
          risk_warning_enabled: true
        }
      ],
      orders: {
        enabled: true,
        risk_warning_enabled: true
      },
      id: 0,
      show: false,
      languageData: [],
      emailType: [],
      transCode: '',
      serviceCode: '',
      packageCode: '',
      emailCode: '',
      rechargeDialog: false,
      expressDialog: false,
      typeId: '',
      trackingDialog: false,
      trackingId: '',
      context: '',
      categoriesCode: '',
      page_params: {
        type: ''
      },
      basic: {
        size: '',
        location: '',
        package_warning: 0
      },
      rules: {
        kd100_app_id: [
          { required: true, message: this.$t('请输入Customer ID'), trigger: 'change' }
        ],
        kd100_app_key: [
          { required: true, message: this.$t('请输入授权key ID'), trigger: 'change' }
        ],
        trackingmore_key: [
          { required: true, message: this.$t('请输入Appkey'), trigger: 'change' }
        ],
        juhe_key: [
          { required: true, message: this.$t('请输入Appkey'), trigger: 'change' }
        ],
        juhe_tpl_id: [
          { required: true, message: this.$t('请输入发送验证码模板ID'), trigger: 'change' }
        ],
        host: [
          { required: true, message: this.$t('请输入SMTP域名'), trigger: 'change' }
        ],
        port: [
          { required: true, message: this.$t('请输入SMTP端口'), trigger: 'change' }
        ],
        // encryption: [
        //   { required: true, message: '请选择加密方式', trigger: 'change' }
        // ],
        username: [
          { required: true, message: this.$t('请输入发件人用户名'), trigger: 'change' }
        ],
        password: [
          { required: true, message: this.$t('请输入发件人密码'), trigger: 'change' }
        ],
        from_address: [
          { required: true, message: this.$t('请输入发件人邮件'), trigger: 'change' }
        ],
        from_name: [
          { required: true, message: this.$t('请输入发件人名称'), trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // this.activeName = '1'
    this.getLanguageList()
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    if (this.activeName === '1') {
      this.getWechat()
      this.getPayment()
      this.getRecharge()
      // this.getLanguageList()
    } else if (this.activeName === '2') {
      this.getLogisticsData()
    } else if (this.activeName === '3') {
      this.confirmSetting()
      this.getAllCurrency()
      this.getSetting()
      this.getProps()
      this.getBasic()
    } else if (this.activeName === '4') {
      this.page_params.page = 1
      this.getList()
    } else if (this.activeName === '5') {
      this.page_params.page = 1
      this.getList()
    } else if (this.activeName === '6') {
      this.getOthers()
    } else if (this.activeName === '7') {
      this.page_params.page = 1
      this.getList()
    } else if (this.activeName === '8') {
      this.getEmail()
      this.getType()
    } else if (this.activeName === '9') {
      this.getExpress()
    } else if (this.activeName === '10') {
      this.getRules()
    } else if (this.activeName === '11') {
      this.getCountryList()
    } else if (this.activeName === '12') {
      this.getSystem()
      this.getTypeData()
    } else if (this.activeName === '13') {
      this.getRate()
      this.getCurrency()
    }
  },
  mounted () {
    console.log('进来了')
  },
  methods: {
    handleEdit (val) {
      console.log(val)
      this.id = val.id // 这里就是当前拖动行的值，把需要的值赋值给你之前定义好的就可以了
    },
    // 国家地区 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.country tbody')
      console.log(tbody, 'tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.countrySendData.splice(oldIndex, 1)[0]
          this.countrySendData.splice(newIndex, 0, oldItem)
        }
      })
    },
    // 确定拖拽 国家地区
    rowUpdate () {
      // eslint-disable-next-line camelcase
      const ids = this.countrySendData.map(({ id, name }, index) => ({ id, index, name }))
      console.log(ids)
      this.countryData = []
      this.$request.countryLocationIndex(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getCountryList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自定义物流 行拖拽
    typeRowDrop () {
      const tbody = document.querySelector('.logistics-type tbody')
      console.log(tbody, 'tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.typeSendData.splice(oldIndex, 1)[0]
          this.typeSendData.splice(newIndex, 0, oldItem)
        }
      })
    },
    // 确定拖拽 自定义物流
    typeRowUpdate () {
      // eslint-disable-next-line camelcase
      const ids = this.typeSendData.map(({ id, context }, index) => ({ id, index, context }))
      console.log(ids)
      this.TypeData = []
      this.$request.typeLocationIndex(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getTypeData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改在线支付的开关
    changeOnline (event, name) {
      console.log(name, 'name')
      this.$request.changePayment(Number(event), name).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getWechat()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改转账支付的开关
    changeTransfer (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closePayments(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getPayment()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 系统物流类型 开启或关闭
    changeSystem (event, enabled, id) {
      this.$request.closeSystem(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getSystem()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 基础配置 修改语言
    onProps (item) {
      console.log(item, 'item')
      dialog({ type: 'propsLang', lang: item, dynamicTags: this.dynamicTags }, () => {
        this.getProps()
      })
    },
    // 保险服务 保险说明
    goInsurance () {
      dialog({ type: 'explanationAdd' }, () => {
        this.getInsurance()
      })
    },
    // pc端配置 修改语言
    onPc (item) {
      // console.log(line, lang)
      // this.transCode = line['trans_' + lang.language_code]
      // line, lang: lang, transCode: this.transCode
      console.log(item, 'item')
      dialog({ type: 'pcLang', lang: item }, () => {
        this.getOthers()
      })
    },
    // 发货快递公司 修改语言
    onExpress (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'expressLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getExpress()
      })
    },
    // 转账 修改语言
    onLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'payLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getPayment()
      })
    },
    // 订单增值服务 修改语言
    onService (line, lang) {
      console.log(line, lang)
      this.serviceCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'serviceLang', line: line, lang: lang, transCode: this.serviceCode, state: 'service' }, () => {
        this.getValue()
      })
    },
    // 包裹增值服务 修改语言
    onPackage (line, lang) {
      console.log(line, lang)
      this.packageCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'serviceLang', line: line, lang: lang, transCode: this.packageCode, state: 'package' }, () => {
        this.getValue()
      })
    },
    // 邮件模版 修改语言
    onEmail (line, lang) {
      this.emailCode = line['trans_' + lang.language_code]
      this.$router.push({ name: 'emailLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.emailCode
        } })
    },
    // 商品分类管理 修改语言
    onCategories (line, lang) {
      this.categoriesCode = line['trans_' + lang.language_code]
      this.$router.push({ name: 'categoriesLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.categoriesCode
        } })
    },
    // 邮件模版 开启或关闭
    changeEmail (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeEmail(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getEmail()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 删除单条转账支付
    deleteTransfer (id) {
      this.$confirm(this.$t('您真的要删除转账支付吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTransfer(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getPayment()
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
    // 增加转账支付配置
    addTransfer () {
      dialog({ type: 'addTransfer', state: 'add' }, () => {
        this.getPayment()
      })
    },
    clear () {
      this.amount = ''
    },
    clearType () {
      this.typeForm.context = ''
    },
    submitRecharge () {
      if (!this.amount) {
        return this.$message.error(this.$t('请输入预设充值金额'))
      }
      this.$request.updateRechargeAmount(this.amount).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.rechargeDialog = false
          this.getRecharge()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 新增 预设充值金额
    addRecharge () {
      this.rechargeDialog = true
    },
    deleteRecharge (id) {
      this.$request.deleteRechargeAmount(id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getRecharge()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 编辑邮件模版
    editEmail (id) {
      this.$router.push({
        name: 'emailEdit',
        params: {
          id: id
        }
      })
    },
    // 删除单条邮件模版
    deleteEmail (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteAloneEmail(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getEmail()
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
    // 删除国家地区
    deleteCountry (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCountryLocation(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCountryList()
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
    regenerate () {
      this.$confirm(this.$t('确定要重新生成会员编号吗？原来的编号将会被重置，可能会部分影响到包裹订单出入库'), this.$t('重新生成'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.goResetId().then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getRules()
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
    // 编辑转账支付配置
    editTransfer (id) {
      console.log(id, 'id')
      dialog({ type: 'addTransfer', state: 'edit', id: id }, () => {
        this.getPayment()
      })
    },
    // 编辑保险服务
    editInsurance (id, start) {
      console.log(id, 'id')
      dialog({ type: 'insuranceEdit', id: id, start: start }, () => {
        this.getInsurance()
      })
    },
    // 订单 增加增值服务
    addService () {
      dialog({ type: 'addService', state: 'add', name: 'addService' }, () => {
        this.getList()
      })
    },
    // 添加发货快递公司
    addExpress () {
      dialog({ type: 'expressEditAdd', state: 'add' }, () => {
        this.getExpress()
      })
    },
    editExpress (id) {
      dialog({ type: 'expressEditAdd', state: 'edit', id: id }, () => {
        this.getExpress()
      })
    },
    // 订单 编辑增值服务
    editService (id) {
      dialog({ type: 'addService', state: 'edit', id: id, name: 'editService' }, () => {
        this.getList()
      })
    },
    // 包裹 增加增值服务
    addParcel () {
      dialog({ type: 'addService', state: 'add', name: 'addParcel' }, () => {
        this.getList()
      })
    },
    // 包裹 编辑增值服务
    editParcel (id) {
      dialog({ type: 'addService', state: 'edit', id: id, name: 'editParcel' }, () => {
        this.getList()
      })
    },
    // 订单 删除增值服务
    deleteService (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteExpress(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getExpress()
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
    // 包裹 删除增值服务
    deleteParcel (id) {
      this.$confirm(this.$t('您真的要删除增值服务吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteParcel(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
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
    // 订单增值服务 开关启用状态
    changeService (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeValue(id, Number(event)).then(res => {
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
    // 发货快递公司 开关启用状态
    changeExpress (event, id) {
      this.$request.closeExpress(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getExpress()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 包裹增值服务 开关启用状态
    changeParcel (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeParcel(id, Number(event)).then(res => {
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
    // 删除单条商品分类
    deleteCategories (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCategories(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    handleClose (id) {
      console.log(id, 'id')
      this.dynamicTags.splice(this.dynamicTags.indexOf(id), 1)
      this.$request.deleteProps({
        DELETE: [id]
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getProps()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 支付配置
    configuration (type, name) {
      if (type === 1) {
        dialog({ type: 'paypalSet' }, () => {
          this.getWechat()
        })
      } else if (type === 2) {
        dialog({ type: 'configuration' }, () => {
          this.getWechat()
        })
      } else if (type === 4) {
        dialog({ type: 'alipay' }, () => {
          this.getWechat()
        })
      }
    },
    // 获取物流跟踪配置
    getLogisticsData () {
      this.$request.getLogistics().then(res => {
        if (res.ret && res.data) {
          this.logisticsData = res.data
          // this.logisticsData.encryption = Boolean(res.data.encryption)
        } else {
          return false
        }
      })
    },
    // 获取pc端配置
    getOthers () {
      this.$request.getWebsite().then(res => {
        this.setForm = res.data
        this.setForm.pc_website_url = res.data.pc_website_url.map(item => item.url).toString()
        res.data.default_img && (this.baleImgList[0] = res.data.default_img)
        res.data.customer_qr_code && (this.customerList[0] = res.data.customer_qr_code)
        res.data.logo_image && (this.LogoImgList[0] = res.data.logo_image)
        res.data.background_image && (this.bgList[0] = res.data.background_image)
      })
    },
    // 修改pc端配置
    editOthers () {
      if (this.baleImgList[0]) {
        this.setForm.default_img = this.baleImgList[0]
      } else {
        this.setForm.default_img = []
      }
      if (this.customerList[0]) {
        this.setForm.customer_qr_code = this.customerList[0]
      } else {
        this.setForm.customer_qr_code = []
      }
      if (this.LogoImgList[0]) {
        this.setForm.logo_image = this.LogoImgList[0]
      } else {
        this.setForm.logo_image = []
      }
      if (this.bgList[0]) {
        this.setForm.background_image = this.bgList[0]
      } else {
        this.setForm.background_image = []
      }
      if (!this.setForm.website_name) {
        return this.$message.error(this.$t('请输入网站名称'))
      } else if (!this.baleImgList[0]) {
        return this.$message.error(this.$t('请上传小程序码'))
      } else if (!this.customerList[0]) {
        return this.$message.error(this.$t('请上传pc端客户二维码'))
      } else if (!this.setForm.secret) {
        return this.$message.error(this.$t('请输入网站Secret'))
      } else if (!this.setForm.app_id) {
        return this.$message.error(this.$t('请输入网站ID'))
      } else if (!this.setForm.icp) {
        return this.$message.error(this.$t('请输入备案号'))
      } else if (!this.setForm.token) {
        return this.$message.error(this.$t('请输入token'))
      } else if (!this.setForm.aes_key) {
        return this.$message.error(this.$t('请输入aes_key'))
      } else if (!this.LogoImgList[0]) {
        return this.$message.error(this.$t('请上传logo图'))
      } else if (!this.bgList[0]) {
        return this.$message.error(this.$t('请上传登录页背景图'))
      }
      console.log(this.setForm.pc_website_url.split(','))
      this.$request.editWebsite({ ...this.setForm, pc_website_url: this.setForm.pc_website_url.split(',') }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getOthers()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 物流跟踪配置确认
    confirmLogistic (formName) {
      console.log(this.logisticsData.encryption, 'this.logisticsData.encryption')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.editLogistics({
            ...this.logisticsData
            // encryption: Number(this.logisticsData.encryption)
          }).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.activeName = '1'
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 获取全部重量及货币配置
    confirmSetting () {
      this.$request.getLocalization().then(res => {
        this.weightList = res.data.weight
        this.currencyList = res.data.currency
        this.lengthList = res.data.length
      })
    },
    // 获取全部结算货币
    getAllCurrency () {
      this.$request.getAllRate().then(res => {
        if (res.ret) {
          this.rateList = res.data
        }
      })
    },
    // 获取当前选择的重量及货币配置
    getSetting () {
      this.$request.chooseLocalization().then(res => {
        if (res.ret) {
          this.currencyName = res.data.currency_name
          this.weightName = res.data.weight_name
          this.lengthName = res.data.length_name
          this.package_express_line = res.data.package_express_line
          this.currency = res.data.currency
        }
      })
    },
    // 获取入库是否必填
    getBasic () {
      this.$request.getBasic().then(res => {
        if (res.ret) {
          this.basic.size = res.data.size
          this.basic.location = res.data.location
          this.basic.package_warning = res.data.package_warning
        }
      })
    },
    changeBasic (val) {
      this.$request.updateBasic({
        size: this.basic.size,
        location: this.basic.location,
        package_warning: this.basic.package_warning
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getBasic()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 保存当前选择的重量及货币配置
    saveSetting () {
      let weight = this.weightList.filter(item => item.name === this.weightName)
      let currency = this.currencyList.filter(item => item.name === this.currencyName)
      let length = this.lengthList.filter(item => item.name === this.lengthName)
      this.$request.confirmLocalization({
        weight_name: weight[0].name,
        weight_symbol: weight[0].symbol,
        currency_name: currency[0].name,
        currency_symbol: currency[0].symbol,
        length_name: length[0].name,
        length_symbol: length[0].symbol,
        package_express_line: this.package_express_line,
        currency: this.currency
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.activeName = '1'
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取物品属性
    getProps () {
      this.$request.getPackage().then(res => {
        if (res.ret) {
          this.dynamicTags = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 添加属性
    addProps () {
      dialog({ type: 'addPackage' }, () => {
        this.getProps()
      })
    },
    //  支付配置 获取在线支付
    getWechat () {
      this.tableLoading = true
      this.$request.getPaymentOnline().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.paymentData = res.data.map(item => ({ ...item,
            enabled: Boolean(item
              .enabled) }))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取转账支付
    getPayment () {
      this.tableLoading = true
      this.$request.getPayments().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transferData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 系统物流类型数据
    getSystem () {
      this.$request.getSetSystem().then(res => {
        if (res.ret) {
          this.systemData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 系统物流类型 修改语言
    trackingLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'trackingLang', line: line, lang: lang, transCode: this.transCode, state: 'tracking' }, () => {
        this.getSystem()
      })
    },
    // 自定义物流类型 修改语言
    TypeLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'trackingLang', line: line, lang: lang, transCode: this.transCode, state: 'type' }, () => {
        this.getTypeData()
      })
    },
    // 获取预设充值金额
    getRecharge () {
      this.tableLoading = true
      this.$request.getRechargeAmount().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.rechargeAmount = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取邮件模版
    getEmail () {
      this.tableLoading = true
      this.$request.getEmail({
        type: this.page_params.type
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.emailData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取模版类型数据
    getType () {
      this.$request.emailType().then(res => {
        res.data.forEach(item => {
          this.emailType.push({
            value: item.id,
            label: item.name
          })
        })
      })
    },
    onGroupChange () {
      this.page_params.handleQueryChange('type', this.page_params.type)
      this.getEmail()
    },
    // 商品分类管理 开启或关闭 是否显示
    changeShow (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeCategories(id, Number(event)).then(res => {
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
    // 商品分类管理 开启或关闭 风险提示
    changeRisk (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeRisk(id, Number(event)).then(res => {
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
    // 修改风险提示
    goSick (id) {
      this.$router.push({ name: 'sickTips',
        params: {
          id: id
        } })
    },
    // 添加商品分类
    addClassify () {
      dialog({ type: 'classifyGroup', state: 'add', id: '' }, () => {
        this.getList()
      })
    },
    // 编辑商品分类
    editClassify (id) {
      dialog({ type: 'classifyGroup', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    getList () {
      if (this.activeName === '4') {
        this.getValue()
        this.getInsurance()
      } else if (this.activeName === '5') {
        this.getParcel()
      } else if (this.activeName === '7') {
        this.getCategories()
      } else if (this.activeName === '9') {
        this.getExpress()
      } else if (this.activeName === '10') {
        this.getRules()
      } else if (this.activeName === '13') {
        this.getRate()
        this.getCurrency()
      }
    },
    // 获取订单增值服务
    getValue () {
      this.tableLoading = true
      this.$request.getValue({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.valueData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.valueData, 'valueData')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取汇率配置
    getRate () {
      this.$request.getRates({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.ratesData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取当前结算货币
    getCurrency () {
      this.$request.getCurrency().then(res => {
        if (res.ret) {
          this.currencyData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自动获取
    autoGet () {
      this.$request.autoGet().then(res => {
        if (res.ret) {
          this.rate = res.data.rate
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 汇率 删除
    deleteRate (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteRate(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getRate()
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
    // 汇率 开启或关闭
    changeRate (id) {
      this.$request.closeRate(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getRate()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 新建汇率
    saveRate () {
      if (!this.rate) {
        return this.$message.error(this.$t('请输入汇率'))
      } else {
        this.$request.saveRate({
          rate: this.rate
        }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getRate()
            this.rate = ''
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 更改保险服务的开关
    changeInsurance (val) {
      console.log(val, 'val')
      this.$request.changeInsurance(val).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getInsurance()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取保险服务
    getInsurance () {
      this.tableLoading = true
      this.$request.getInsurance().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.insuranceEnabled = res.data.enabled
          this.insuranceData = res.data.data
        }
      })
    },
    // 获取发货快递公司
    getExpress () {
      this.tableLoading = true
      this.$request.getExpressValue({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.expressData = res.data.map(item => ({ ...item, status: Boolean(item.status) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.valueData, 'valueData')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取单号规则数据
    getRules () {
      this.tableLoading = true
      this.$request.getRules({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.rulesData = res.data
        }
      })
    },
    // 添加国家/地区
    addCountry () {
      dialog({ type: 'setCountry' }, () => {
        this.getCountryList()
      })
    },
    // 系统物流类型 开启或关闭
    changeType (event, enabled, id) {
      this.$request.closeType(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getTypeData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自定义物流系统列表
    getTypeData () {
      this.$request.TypeData().then(res => {
        if (res.ret) {
          this.TypeData = res.data
          this.typeSendData = [...res.data]
          console.log('typeSendData')
          this.$nextTick(() => {
            this.typeRowDrop()
          })
        }
      })
    },
    // 删除 自定义物流
    deleteLogisticsType (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTypeData(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getTypeData()
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
    // 新增 自定义物流类型
    addLogisticsType () {
      this.expressDialog = true
    },
    // 编辑 自定义物流类型
    editLogisticsType (id) {
      this.typeId = id
      this.expressDialog = true
      this.getTypeDialog()
    },
    // 获取 单条自定义物流信息
    getTypeDialog () {
      this.$request.getAloneType(this.typeId).then(res => {
        if (res.ret) {
          this.typeForm.context = res.data.context
        }
      })
    },
    // 确定提交 自定义物流类型
    submitExpress () {
      if (this.typeId) {
        this.$request.updateTypeData(this.typeId, this.typeForm).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.expressDialog = false
            this.getTypeData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        this.$request.addTypeData(this.typeForm).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.expressDialog = false
            this.getTypeData()
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
    // 编辑系统物流系统
    editTracking (id) {
      this.trackingId = id
      this.trackingDialog = true
      this.getTackingType()
    },
    clearTracking () {
      this.trackingId = ''
      this.context = ''
    },
    // 获取单条物流类型
    getTackingType () {
      this.$request.getAloneTracking(this.trackingId).then(res => {
        if (res.ret) {
          this.context = res.data.context
        }
      })
    },
    // 更新 单条物流系统
    saveTackingType () {
      this.$request.updateAloneTracking(this.trackingId, {
        context: this.context
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.trackingDialog = false
          this.getSystem()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取国家/地区数据
    getCountryList () {
      this.tableLoading = true
      this.$request.countryLocation().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.countryData = res.data
          this.countrySendData = [...res.data]
          console.log('countryData')
          this.$nextTick(() => {
            this.rowDrop()
          })
        }
      })
    },
    editRules (id, name) {
      dialog({ type: 'rulesEdit', id: id, name: name }, () => {
        this.getRules()
      })
    },
    // 获取包裹增值服务
    getParcel () {
      this.tableLoading = true
      this.$request.getParcel({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.parcelData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.parcelData, 'parcelData')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onTabChange () {
      if (this.activeName === '1') {
        this.getWechat()
        this.getPayment()
        this.getRecharge()
        this.getLanguageList()
      } else if (this.activeName === '2') {
        this.getLogisticsData()
      } else if (this.activeName === '3') {
        this.confirmSetting()
        this.getAllCurrency()
        this.getSetting()
        this.getProps()
        this.getBasic()
      } else if (this.activeName === '4') {
        this.page_params.page = 1
        this.getList()
      } else if (this.activeName === '5') {
        this.page_params.page = 1
        this.getList()
      } else if (this.activeName === '6') {
        this.getOthers()
      } else if (this.activeName === '7') {
        this.page_params.page = 1
        this.getList()
      } else if (this.activeName === '8') {
        this.getEmail()
        this.getType()
      } else if (this.activeName === '9') {
        this.page_params.page = 1
        this.getExpress()
      } else if (this.activeName === '10') {
        this.page_params.page = 1
        this.getRules()
      } else if (this.activeName === '11') {
        this.getCountryList()
      } else if (this.activeName === '12') {
        this.getSystem()
        this.getTypeData()
      } else if (this.activeName === '13') {
        this.getRate()
        this.getCurrency() // 获取当前结算货币
      }
      this.page_params.handleQueryChange('activeName', this.activeName)
    },
    // 上传打包照片
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        }
      })
    },
    uploadLogo (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.LogoImgList.push(item.path)
          })
        }
      })
    },
    // pc端客服二维码
    customerImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.customerList.push(item.path)
          })
        }
      })
    },
    // 登录页背景图
    bgImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.bgList.push(item.path)
          })
        }
      })
    },
    // 预览图片
    onPreview (image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除小程序码
    onDeleteImg (index) {
      this.baleImgList.splice(index, 1)
    },
    // 删除logo
    onDeleteLogo (index) {
      this.LogoImgList.splice(index, 1)
    },
    // 删除pc端二维码
    onDeleteCus (index) {
      this.customerList.splice(index, 1)
    },
    // 删除登录页背景图
    onDeleteBg (index) {
      this.bgList.splice(index, 1)
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 获取商品分类管理列表
    getCategories () {
      this.tableLoading = true
      this.$request.getCategories({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.CategoriesList = res.data.map(item => {
            return {
              ...item,
              enabled: Boolean(item.enabled),
              risk_warning_enabled: Boolean(item.risk_warning_enabled),
              orders: []
            }
          })
          this.localization = res.localization
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
    },
    // 点开当前行，获取二级菜单数据
    onExpand (row) {
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (row.orders.length) return
      let id = row.id
      this.$request.getSecondCategories(id).then(res => {
        if (res.ret) {
          row.orders = res.data.map(item => {
            return {
              ...item,
              enabled: Boolean(item.enabled),
              risk_warning_enabled: Boolean(item.risk_warning_enabled)
            }
          })
        }
      })
    },
    // 检测快递100
    testExpress () {
      if (this.logisticsData.kd100_app_id === '') {
        return this.$message.error('请输入Customer ID')
      } else if (this.logisticsData.kd100_app_key === '') {
        return this.$message.error(this.$t('请输入授权KEY'))
      }
      this.$request.verifyKd100({
        kd100_app_id: this.logisticsData.kd100_app_id,
        kd100_app_key: this.logisticsData.kd100_app_key
      }).then(res => {
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
    // 检测Tracking more
    testTracking () {
      if (this.logisticsData.trackingmore_key === '') {
        return this.$message.error('请输入Customer ID')
      }
      this.$request.verifyTrackingMore({
        trackingmore_key: this.logisticsData.trackingmore_key
      }).then(res => {
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
    // 检测邮件配置
    testSmtp () {
      if (this.logisticsData.from_address === '') {
        return this.$message.error(this.$t('请输入发件人邮件'))
      } else if (this.logisticsData.from_name === '') {
        return this.$message.error(this.$t('请输入发件人名称'))
      } else if (this.logisticsData.host === '') {
        return this.$message.error(this.$t('请输入SMTP域名'))
      } else if (this.logisticsData.port === '') {
        return this.$message.error(this.$t('请输入SMTP端口'))
      } else if (this.logisticsData.username === '') {
        return this.$message.error(this.$t('请输入发件人用户名'))
      } else if (this.logisticsData.password === '') {
        return this.$message.error(this.$t('请输入发件人密码'))
      }
      this.$request.verifySmtp({
        host: this.logisticsData.host,
        port: this.logisticsData.port,
        encryption: this.logisticsData.encryption,
        username: this.logisticsData.username,
        validate_phone: this.logisticsData.validate_phone,
        validate_email: this.logisticsData.validate_email,
        password: this.logisticsData.password,
        from_address: this.logisticsData.from_address,
        from_name: this.logisticsData.from_name
      }).then(res => {
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
    // 检测Juhe
    testJuhe () {
      if (this.logisticsData.juhe_key === '') {
        return this.$message.error('请输入Appkey')
      } else if (this.logisticsData.juhe_tpl_id === '') {
        return this.$message.error('请输入发送验证码模板ID')
      }
      this.$request.verifyJuhe({
        juhe_key: this.logisticsData.juhe_key,
        juhe_tpl_id: this.logisticsData.juhe_tpl_id
      }).then(res => {
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
    // 获取全部语言
    getLanguageList () {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    }
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  }
}
</script>

<style lang="scss">
.payment-container {
  .tabLength {
    //  width: 520px !important;
  }
  .logistics-container {
    background-color: #fff !important;
    padding: 20px;
    // width: 35%;
    .el-input__inner {
      // width: 30%;
    }
  }
  .save-btn {
    color: #fff;
    background-color: #3540A5;
  }
  .settings-container {
     background-color: #fff !important;
     padding: 20px;
    .el-tag {
      margin-right: 8px;
    }
  }
  .select-box {
    overflow: hidden;
    h4 {
      display: inline-block;
    }
  }
  .setOthers {
    background-color: #fff !important;
    padding: 20px;
    .el-input {
      width: 50%;
    }
    .el-textarea__inner {
      width: 30%;
      background-color: #F5F5F5;
    }
    .goods-img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
    .avatar-uploader {
      display: inline-block;
      vertical-align: top;
      // margin-left: 50px;
    }
    .img-item {
      display: inline-block;
      border: 1px dashed #d9d9d9;
      width: 148px;
      height: 148px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 6px;
      text-align: center;
      position: relative;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        .model-box, .operat-box {
          opacity: 1;
          transition: all .5s ease-in;
        }
      }
    }
    .model-box {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      opacity: 0;
      background-color: rgba(0, 0, 0, .3);
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
  }
  .btn-margin {
    margin-bottom: 5px;
  }
  .icon-question {
    margin-left: 5px;
    font-size: 18px;
    color: #67C23A;
    position: relative;
    top: 3px;
  }
  .form-title {
    font-weight: bold;
    margin-bottom: 15px;
  }
  .url-sty {
    .el-textarea__inner {
      width: 50%;
    }
  }
  .test-btn {
    display: inline-block;
    margin-left: 20px;
  }
  .logistic-sty {
    width: 50% !important;
  }
  .icon-sty {
    cursor: pointer;
    // padding-left: 20px;
    font-weight: 700;
    color: black;
  }
  .others-btn {
    margin-left: 15px;
  }
  .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
  .delete-btn {
    margin: 8px;
  }
  .country-sty {
    text-align: center;
  }
  .sort-sty {
    color: red;
    font-size: 13px;
  }
  .add-insurance {
    float: right;
    margin-top: 17px;
  }
  .icon-fonts {
    font-size: 28px;
  }
  .save-sort {
    margin-left: 10px;
  }
  .rate-left {
    display: inline-block;
  }
  .input-sty {
    margin-left: 10px;
    margin-right: 10px;
    width: 50%;
  }
  .no-warehouse {
    color: #606266;
  }
  .radio-sty {
    margin-left: 20px;
  }
}
</style>

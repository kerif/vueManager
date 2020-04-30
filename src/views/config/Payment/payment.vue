<template>
    <div class="payment-container">
      <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
        <!-- 支付配置 -->
        <el-tab-pane label="支付配置" name="1">
          <!-- 微信支付 -->
          <h4>在线支付</h4>
          <el-table v-if="paymentData.length" :data="paymentData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="类型" prop="type"></el-table-column>
            <el-table-column label="是否启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeOnline($event)"
                  active-text="开"
                  inactive-text="关"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="配置">
              <template slot-scope="scope">
                <el-button class="btn-main" @click="configuration(scope.row.id)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 转账支付 -->
          <div class="select-box">
          <h4>转账支付</h4>
          <add-btn @click.native="addTransfer">添加支付类型</add-btn>
        </div>
          <el-table :data="transferData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="类型" prop="name"></el-table-column>
            <el-table-column label="是否启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
                  active-text="开"
                  inactive-text="关"
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editTransfer(scope.row.id)">编辑</el-button>
                <el-button class="btn-light-red" @click="deleteTransfer(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 物流跟踪配置 -->
      <el-tab-pane label="服务配置" name="2">
        <div class="logistics-container">
          <div class="form-title">快递100配置</div>
          <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm"
            label-position="left" label-width="150px">
            <!-- Customer ID -->
            <el-form-item label="Customer ID" prop="kd100_app_id">
              <el-input v-model="logisticsData.kd100_app_id" placeholder="请输入Customer ID" class="logistic-sty"></el-input>
            </el-form-item>
            <!-- 授权KEY -->
            <el-form-item label="授权KEY" prop="kd100_app_key">
              <el-input v-model="logisticsData.kd100_app_key" placeholder="请输入授权KEY" class="logistic-sty"></el-input>
              <div class="test-btn">
                <el-button class="btn-light-red" @click="testExpress">测试</el-button>
              </div>
            </el-form-item>
          <div class="form-title">Tracking more配置</div>
          <el-form-item label="Appkey" prop="trackingmore_key">
            <el-input v-model="logisticsData.trackingmore_key" placeholder="请输入AppSecret" class="logistic-sty"></el-input>
            <div class="test-btn">
              <el-button class="btn-light-red" @click="testTracking">测试</el-button>
            </div>
          </el-form-item>
          <div class="form-title">邮箱发件信息配置</div>
          <el-form-item label="发件人邮件" prop="from_address">
            <el-input v-model="logisticsData.from_address" placeholder="请输入发件人邮件" class="logistic-sty"></el-input>
          </el-form-item>
            <el-form-item label="发件人名称" prop="from_name">
              <el-input v-model="logisticsData.from_name" placeholder="请输入发件人名称" class="logistic-sty"></el-input>
            </el-form-item>
            <el-form-item label="SMTP域名" prop="host">
              <el-input v-model="logisticsData.host" placeholder="请输入SMTP域名" class="logistic-sty"></el-input>
            </el-form-item>
            <el-form-item label="SMTP端口" prop="port">
              <el-input v-model="logisticsData.port" placeholder="请输入SMTP端口" class="logistic-sty"></el-input>
            </el-form-item>
            <el-form-item label="发件人用户名" prop="username">
              <el-input v-model="logisticsData.username" placeholder="请输入发件人用户名" class="logistic-sty"></el-input>
            </el-form-item>
            <el-form-item label="发件人密码" prop="password">
              <el-input type="password" v-model="logisticsData.password" placeholder="请输入发件人密码" class="logistic-sty"></el-input>
              <div class="test-btn">
                <el-button class="btn-light-red" @click="testSmtp">测试</el-button>
              </div>
            </el-form-item>
            <el-form-item label="加密方式">
              <el-radio-group v-model="logisticsData.encryption" class="logistic-sty">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">TLS加密</el-radio>
                <el-radio :label="2">SSL加密</el-radio>
              </el-radio-group>
            </el-form-item>
          <div class="form-title">短信配置——聚合</div>
          <el-form-item label="Appkey" prop="juhe_key">
            <el-input v-model="logisticsData.juhe_key" placeholder="请输入Appkey"
            class="logistic-sty"></el-input>
          </el-form-item>
            <el-form-item label="发送验证码模板ID" prop="juhe_tpl_id">
              <el-input v-model="logisticsData.juhe_tpl_id" placeholder="请输入发送验证码模板ID" class="logistic-sty"></el-input>
              <div class="test-btn">
                <el-button class="btn-light-red" @click="testJuhe">测试</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div>
            <el-button class="save-btn" @click="confirmLogistic('ruleForm')">保存</el-button>
          </div>
        </div>
        </el-tab-pane>
        <!-- 基础配置 -->
        <el-tab-pane label="基础配置" name="3">
          <!-- 重量及货币配置 -->
          <div class="settings-container">
            <el-form>
              <!-- 重量单位： -->
              <el-form-item label="重量单位：">
                  <el-select v-model="weightName">
                    <el-option
                    v-for="item in weightList"
                    :key="item.id"
                    :value="item.name"
                    :label="item.name">
                    </el-option>
                  </el-select>
              </el-form-item>
              <!-- 货币单位： -->
              <el-form-item label="货币单位：">
                  <el-select v-model="currencyName">
                    <el-option
                    v-for="item in currencyList"
                    :key="item.id"
                    :value="item.name"
                    :label="item.name">
                    </el-option>
                  </el-select>
              </el-form-item>
              <!-- 长度单位 -->
              <el-form-item label="长度单位：">
                  <el-select v-model="lengthName">
                    <el-option
                    v-for="(item, index) in lengthList"
                    :key="index"
                    :value="item.name"
                    :label="item.name">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="物品属性：">
                <el-tag
                  :key="item.id"
                  v-for="item in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(item.id)">
                  {{item.cn_name}}
                </el-tag>
              <el-button class="btn-light-red" @click="addProps">添加属性</el-button>
              <el-button class="btn-deep-purple others-btn" v-for="item in formatLangData" :key="item.id" @click="onProps(item)">{{item.name}}</el-button>
              </el-form-item>
              </el-form>
              <el-button class="save-btn" @click="saveSetting">保存</el-button>
          </div>
        </el-tab-pane>
        <!-- 订单增值服务 -->
        <el-tab-pane label="订单增值服务" name="4">
          <div class="select-box">
            <add-btn @click.native="addService">添加订单增值服务</add-btn>
          </div>
            <el-table :data="valueData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="增值服务名称"></el-table-column>
            <el-table-column prop="price" :label="'价格' + this.localization.currency_unit"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
              <el-table-column label="是否启用">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeService($event, scope.row.id)"
                    active-text="开"
                    inactive-text="关"
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
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button class="btn-dark-green" @click="editService(scope.row.id)">编辑</el-button>
                  <el-button class="btn-light-red" @click="deleteService(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 包裹增值服务 -->
        <el-tab-pane label="包裹增值服务" name="5">
          <div class="select-box">
            <add-btn @click.native="addParcel">添加包裹增值服务</add-btn>
          </div>
            <el-table :data="parcelData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="增值服务名称"></el-table-column>
            <el-table-column prop="price" :label="'价格' + this.localization.currency_unit"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
              <el-table-column label="是否启用">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeParcel($event, scope.row.id)"
                    active-text="开"
                    inactive-text="关"
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
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button class="btn-dark-green" @click="editParcel(scope.row.id)">编辑</el-button>
                  <el-button class="btn-light-red" @click="deleteParcel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 其余配置 -->
      <el-tab-pane label="PC端配置" name="6">
        <!-- 其余配置 -->
      <div class="setOthers">
        <el-form :model="setForm" ref="setForm" class="demo-ruleForm"
        label-width="150px" label-position="left">
            <!-- 网站名称 -->
            <el-form-item label="*网站名称">
              <el-input v-model="setForm.website_name">
              </el-input>
              <el-button class="btn-deep-purple others-btn" v-for="item in formatLangData" :key="item.id" @click="onPc(item)">{{item.name}}</el-button>
            </el-form-item>
            <!-- 网站链接 -->
            <el-form-item class="url-sty">
              <div slot="label">
                <span>*网站链接</span>
                <el-tooltip effect="dark" content="主要用于集运插件识别（非常重要,多个用英文逗号切分，例如http.www.baidu.com,http.www.google.com" placement="top">
                  <span class="el-icon-question icon-question"></span>
                </el-tooltip>
              </div>
              <el-input v-model="setForm.pc_website_url" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"
              >
              </el-input>
            </el-form-item>
            <!-- 网站ID -->
            <el-form-item label="*网站ID">
              <el-input v-model="setForm.app_id">
              </el-input>
            </el-form-item>
            <el-form-item label="*网站Secret">
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
            <el-form-item label="*小程序码" class="updateChe">
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
            <el-form-item label="*pc端客服二维码" class="updateChe">
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
            <el-form-item label="*登录页背景图" class="updateChe">
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
          <el-button class="save-btn" @click="editOthers">保存</el-button>
        </div>
        </el-tab-pane>
        <!-- 订单增值服务 -->
        <el-tab-pane label="商品分类管理" name="7">
          <div class="select-box">
            <add-btn @click.native="addClassify">添加商品分类</add-btn>
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
                <el-table-column label="二级分类名称" prop="name"></el-table-column>
                <!-- 是否显示 -->
                <el-table-column label="是否显示">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.enabled"
                      @change="changeShow($event, scope.row.id)"
                      active-text="开"
                      inactive-text="关"
                      active-color="#13ce66"
                      inactive-color="gray">
                    </el-switch>
                </template>
                </el-table-column>
                <!-- 是否开启风险提示 -->
                <el-table-column label="是否开启风险提示">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.risk_warning_enabled"
                      @change="changeRisk($event, scope.row.id)"
                      active-text="开"
                      inactive-text="关"
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
                <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
                    <!-- 编辑 -->
                    <el-button class="btn-dark-green btn-margin" @click="editClassify(scope.row.id)">编辑</el-button>
                    <!-- 风险提示 -->
                    <el-button class="btn-main" @click="goSick(scope.row.id)">风险提示</el-button>
                    <!-- 删除 -->
                    <el-button @click="deleteCategories(scope.row.id)" class="btn-light-red">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
            <!-- 一级分类列表 -->
            <el-table-column type="index" width="50"></el-table-column>
            <!-- 一级分类名称 -->
            <el-table-column label="一级分类名称" prop="name"></el-table-column>
            <!-- 是否显示 -->
            <el-table-column label="是否显示">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeShow($event, scope.row.id)"
                    active-text="开"
                    inactive-text="关"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
            </el-table-column>
            <!-- 是否开启风险提示 -->
            <el-table-column label="是否开启风险提示">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.risk_warning_enabled"
                    @change="changeRisk($event, scope.row.id)"
                    active-text="开"
                    inactive-text="关"
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
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button class="btn-dark-green btn-margin" @click="editClassify(scope.row.id)">编辑</el-button>
                <!-- 风险提示 -->
                <el-button class="btn-main" @click="goSick(scope.row.id)">风险提示</el-button>
                <!-- 删除 -->
                <el-button class="btn-light-red btn-margin" @click="deleteCategories(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 邮件模版 -->
        <el-tab-pane label="邮件模版" name="8">
          <div class="select-box">
            <search-select placeholder="请选择" :selectArr="emailType"
            v-model="page_params.type" @search="onGroupChange">
          </search-select>
          <add-btn router="emailAdd">添加邮件模版</add-btn>
        </div>
          <el-table :data="emailData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <!-- 模版类型 -->
            <el-table-column label="模版类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">绑定邮箱</span>
                <span v-if="scope.row.type === 2">更改邮箱</span>
                <span v-if="scope.row.type === 3">邮箱登录</span>
                <span v-if="scope.row.type === 4">绑定邮箱</span>
                <span v-if="scope.row.type === 5">订单支付成功</span>
                <span v-if="scope.row.type === 6">已发货订单</span>
                <span v-if="scope.row.type === 7">已入库包裹</span>
                <span v-if="scope.row.type === 7">提交订单成功</span>
              </template>
            </el-table-column>
            <!-- 邮件标题 -->
            <el-table-column label="邮件标题" prop="title"></el-table-column>
            <el-table-column label="是否启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeEmail($event, scope.row.enabled, scope.row.id)"
                  active-text="开"
                  inactive-text="关"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column label="创建时间" prop="created_at"></el-table-column>
            <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onEmail(scope.row, item)"></span>
                <span v-else class="el-icon-plus icon-sty" @click="onEmail(scope.row, item)"></span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editEmail(scope.row.id)">编辑</el-button>
                <el-button class="btn-light-red" @click="deleteEmail(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
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
      paymentData: [
        {
          type: '微信支付',
          enabled: ''
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
      valueData: [
        {
          enabled: true
        }
      ],
      parcelData: [
        {
          enabled: true
        }
      ],
      tableLoading: false,
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
        username: '',
        password: '',
        from_address: '',
        from_name: ''
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      weightName: '',
      lengthName: '',
      currencyName: '',
      weightList: [],
      currencyList: [],
      lengthList: [],
      setForm: {
        website_name: '',
        default_img: [],
        customer_qr_code: [],
        pc_website_url: '',
        secret: '',
        app_id: '',
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
      categoriesCode: '',
      page_params: {
        type: ''
      },
      rules: {
        kd100_app_id: [
          { required: true, message: '请输入Customer ID', trigger: 'change' }
        ],
        kd100_app_key: [
          { required: true, message: '请输入授权key', trigger: 'change' }
        ],
        trackingmore_key: [
          { required: true, message: '请输入Appkey', trigger: 'change' }
        ],
        juhe_key: [
          { required: true, message: '请输入Appkey', trigger: 'change' }
        ],
        juhe_tpl_id: [
          { required: true, message: '请输入发送验证码模板ID', trigger: 'change' }
        ],
        host: [
          { required: true, message: '请输入SMTP域名', trigger: 'change' }
        ],
        port: [
          { required: true, message: '请输入SMTP端口', trigger: 'change' }
        ],
        // encryption: [
        //   { required: true, message: '请选择加密方式', trigger: 'change' }
        // ],
        username: [
          { required: true, message: '请输入发件人用户名', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入发件人密码', trigger: 'change' }
        ],
        from_address: [
          { required: true, message: '请输入发件人邮件', trigger: 'change' }
        ],
        from_name: [
          { required: true, message: '请输入发件人名称', trigger: 'change' }
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
      // this.getLanguageList()
    } else if (this.activeName === '2') {
      this.getLogisticsData()
    } else if (this.activeName === '3') {
      this.confirmSetting()
      this.getSetting()
      this.getProps()
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
    }
    // if (this.activeName === '1') {
    //   this.getWechat()
    //   this.getPayment()
    //   this.getLanguageList()
    // }
    // if (this.$route.query.activeName === '7') {
    //   this.activeName = '7'
    //   this.getList()
    //   this.getLanguageList()
    // }
  },
  methods: {
    // 修改在线支付的开关
    changeOnline (event) {
      console.log(event, 'event')
      console.log(typeof event, 'event')
      this.$request.changePayment(Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
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
            title: '操作成功',
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
    // 基础配置 修改语言
    onProps (item) {
      console.log(item, 'item')
      dialog({ type: 'propsLang', lang: item, dynamicTags: this.dynamicTags }, () => {
        this.getProps()
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
    // 转账 修改语言
    onLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
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
            title: '操作成功',
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
      this.$confirm(`您真的要删除转账支付吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteTransfer(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getPayment()
          } else {
            this.$notify({
              title: '操作失败',
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
      this.$confirm(`您真的要删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteAloneEmail(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getEmail()
          } else {
            this.$notify({
              title: '操作失败',
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
    // 订单 增加增值服务
    addService () {
      dialog({ type: 'addService', state: 'add', name: 'addService' }, () => {
        this.getList()
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
      this.$confirm(`您真的要删除增值服务吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteValue(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 包裹 删除增值服务
    deleteParcel (id) {
      this.$confirm(`您真的要删除增值服务吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteParcel(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
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
            title: '操作成功',
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
    // 包裹增值服务 开关启用状态
    changeParcel (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeParcel(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
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
      this.$confirm(`您真的要删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteCategories(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
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
            title: '成功',
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
    configuration (id) {
      dialog({ type: 'configuration', id: id
      }, () => {
        this.getWechat()
      })
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
        return this.$message.error('请输入网站名称')
      } else if (!this.baleImgList[0]) {
        return this.$message.error('请上传小程序码')
      } else if (!this.customerList[0]) {
        return this.$message.error('请上传pc端客户二维码')
      } else if (!this.setForm.secret) {
        return this.$message.error('请输入网站Secret')
      } else if (!this.setForm.app_id) {
        return this.$message.error('请输入网站ID')
      } else if (!this.setForm.token) {
        return this.$message.error('请输入token')
      } else if (!this.setForm.aes_key) {
        return this.$message.error('请输入aes_key')
      } else if (!this.LogoImgList[0]) {
        return this.$message.error('请上传logo图')
      } else if (!this.bgList[0]) {
        return this.$message.error('请上传登录页背景图')
      }
      console.log(this.setForm.pc_website_url.split(','))
      this.$request.editWebsite({ ...this.setForm, pc_website_url: this.setForm.pc_website_url.split(',') }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '成功',
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
                title: '成功',
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
    // 获取当前选择的重量及货币配置
    getSetting () {
      this.$request.chooseLocalization().then(res => {
        if (res.ret) {
          this.currencyName = res.data.currency_name
          this.weightName = res.data.weight_name
          this.lengthName = res.data.length_name
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
        length_symbol: length[0].symbol
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '成功',
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
    // 获取在线支付
    getWechat () {
      this.tableLoading = true
      this.$request.getPaymentOnline().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.paymentData[0].enabled = Boolean(res.data.enabled)
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
        // if (res.ret) {
        //   this.emailType = res.data
        // }
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
            title: '操作成功',
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
            title: '操作成功',
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
      console.log('进来了')
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
      } else if (this.activeName === '5') {
        this.getParcel()
      } else if (this.activeName === '7') {
        this.getCategories()
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
        this.getLanguageList()
      } else if (this.activeName === '2') {
        this.getLogisticsData()
      } else if (this.activeName === '3') {
        this.confirmSetting()
        this.getSetting()
        this.getProps()
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
            title: '操作失败',
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
        return this.$message.error('请输入授权KEY')
      }
      this.$request.verifyKd100({
        kd100_app_id: this.logisticsData.kd100_app_id,
        kd100_app_key: this.logisticsData.kd100_app_key
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
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
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 检测邮件配置
    testSmtp () {
      if (this.logisticsData.from_address === '') {
        return this.$message.error('请输入发件人邮件')
      } else if (this.logisticsData.from_name === '') {
        return this.$message.error('请输入发件人名称')
      } else if (this.logisticsData.host === '') {
        return this.$message.error('请输入SMTP域名')
      } else if (this.logisticsData.port === '') {
        return this.$message.error('请输入SMTP端口')
      } else if (this.logisticsData.username === '') {
        return this.$message.error('请输入发件人用户名')
      } else if (this.logisticsData.password === '') {
        return this.$message.error('请输入发件人密码')
      }
      this.$request.verifySmtp({
        host: this.logisticsData.host,
        port: this.logisticsData.port,
        encryption: this.logisticsData.encryption,
        username: this.logisticsData.username,
        password: this.logisticsData.password,
        from_address: this.logisticsData.from_address,
        from_name: this.logisticsData.from_name
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
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
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
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
}
</style>

/* eslint-disable no-array-constructor */
<template>
    <div class="storage-container">
      <el-row class="container-top">
      <el-form ref="user" :model="user" label-width="140px" label-position="left">
         <el-col :lg="12">
          <!-- 重量 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('*重量')" class="weight-style">
                <el-input v-model="user.package_weight" :placeholder="$t('请输入重量')">
                <template slot="append">{{this.localization.weight_unit}}</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
              <div class="line-center"></div>
          <!-- 快递单号 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('*快递单号')">
                <el-input v-model="user.express_num" :placeholder="$t('请输入快递单号')"
                @blur="getNum(user.express_num)" :disabled="(!!this.$route.params.id && !hasStore)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        <!-- 寄往仓库 -->
         <!-- :disabled="(!!this.$route.params.id && !hasStore) || this.shipNum != ''" -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('*寄往仓库')">
                <el-select v-model="user.warehouse_id" clearable
                @change="getAreaData" :placeholder="$t('请选择')">
                  <el-option
                    v-for="item in agentData"
                    :key="item.id"
                    :value="item.id"
                    :label="item.warehouse_name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
           <!-- 客户id -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('客户ID')" class="changeQuery">
                  <el-autocomplete
                  :fetch-suggestions="queryCNSearch"
                  @select="handleSelect"
                  :placeholder="$t('请输入客户ID，不填则默认无人认领包裹')"
                  v-model="user.user_id"
                  :disabled="(!!this.$route.params.id && !hasStore) || this.shipNum != ''">
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 物品名称 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('物品名称')">
                <el-input v-model="user.package_name" :placeholder="$t('请输入物品名称')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 品牌 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('品牌')">
                <el-input v-model="user.brand_name" :placeholder="$t('请输入品牌')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        <!-- 物品总价值 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('物品总价值') + this.localization.currency_unit">
                <el-input v-model="user.package_value" :placeholder="$t('请输入物品总价值')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 备注 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('备注')">
                <el-input v-model="user.remark" :placeholder="$t('请输入备注')"
                type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 物品照片 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item prop="password_confirmation" class="updateChe" :label="$t('物品照片')">
                <span class="img-item" v-for="(item, index) in goodsImgList" :key="index">
                  <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
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
                  <i class="el-icon-plus">
                  </i>
                  </el-upload>
                  <div class="updateImg">{{$t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张')}}</div>
                </el-form-item>
              </el-col>
            </el-row>
          <!-- 保存 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item class="saveBtn">
                <el-button @click="submitStorage" :loading="$store.state.btnLoading">{{$t('保存')}}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      <el-col :lg="12">
        <!-- 服务 -->
        <el-row :gutter="20">
          <el-col>
            <el-form-item :label="$t('服务')" class="service-style">
              <el-checkbox-group v-model="user.chosen_services">
                <el-checkbox v-for="item in updateService" :key="item.id" :label="item.id">{{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          </el-row>
            <div class="line-center"></div>
          <!-- 快递公司 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('快递公司')">
                <el-select v-model="user.express_company_id" clearable
                 :placeholder="$t('请选择')">
                  <el-option
                    v-for="item in expressData"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 寄往地区 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('寄往地区')">
                  <el-select v-model="user.country_id"
                   :disabled="this.user.warehouse_id === '' || this.shipNum != ''" clearable :placeholder="$t('请选择')">
                    <el-option
                      v-for="item in shipData"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 尺寸 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('尺寸')">
                <el-input v-model="user.length"  class="sizeLength" :placeholder="$t('长') + this.localization.length_unit"></el-input>
                <el-input v-model="user.width" class="sizeLength" :placeholder="$t('宽') + this.localization.length_unit"></el-input>
                <el-input v-model="user.height"  class="sizeLength" :placeholder="$t('高') + this.localization.length_unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 商品数量 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('商品数量')">
                <el-input v-model="user.qty" :placeholder="$t('请输入件数')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 件数 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('件数')">
                <el-input v-model="user.number" :placeholder="$t('请输入件数')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 存放货位 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item>
              <div slot="label">
                <span>{{$t('存放货位')}}</span>
                <el-tooltip effect="dark" :content="$t('当您为仓库添加了货位，系统会自动分配货位，同时您也可以自定义填写货位')" placement="top">
                  <span class="el-icon-question icon-question"></span>
                </el-tooltip>
              </div>
                <el-autocomplete
                  :disabled="this.user.warehouse_id === ''"
                  :fetch-suggestions="locationCNSearch"
                  ref="autocompleteRef"
                  @select="locationSelect"
                  :placeholder="$t('请输入存放货位')"
                  v-model="user.location">
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 包裹编码 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('包裹编码')">
                <el-input v-model="user.code" :placeholder="$t('请输入包裹编码')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="this.$route.params.id && this.user.express_line">
            <el-col :span="18">
              <el-form-item :label="$t('更改线路')" class="express">
                  <span class="change-line">{{user.CName}}---{{$t('限重')}}{{user.MaxWeight}}KG</span>
                  <el-button class="btn-main change-btn" @click="changeLine">{{$t('更改')}}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 物品属性 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item :label="$t('物品属性')" class="service-style">
                <el-checkbox-group v-model="user.props">
                  <el-checkbox v-for="item in updateProp" :key="item.id" :label="item.id">{{item.cn_name}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
                    <!-- <el-form-item class="saveBtn"> -->
              <!-- </el-form-item> -->
    <!-- <div class="save-btn">
      <el-button @click="submitStorage" type="primary" :loading="$store.state.btnLoading">保存</el-button>
    </div> -->
    </el-form>
  </el-row>
  <div class="noExpress" v-if="this.shipNum || this.$route.params.id">
  <div class="select-box">
      <h4>{{$t('商品清单')}}</h4>
      <add-btn @click.native="addProduct" v-if="this.shipNum || this.$route.params.id">{{$t('添加商品清单')}}</add-btn>
    </div>
    <el-row :gutter="20" class="id-style">
      <el-col :span="6">
        <p class="upload-top">{{$t('原始上传清单：')}}</p>
        <div v-if="user.item_pictures">
          <div class="left-img" v-for="(item, index) in user.item_pictures" :key="index">
            <span style="cursor:pointer;" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.path}`, imgVisible=true">
              <img :src="`${$baseUrl.IMAGE_URL}${item.path}`" class="itemImg" >
            </span>
          </div>
        </div>
        <div v-else class="nullProduct">{{$t('无')}}</div>
        <p>{{$t('原始商品数量：')}}<span class="remark-font">{{user.qty}}</span></p>
        <p>{{$t('原始商品备注：')}}</p>
        <p v-if="user.remark" class="remark-font">{{user.remark}}</p>
        <p v-else class="noDate">{{$t('暂无数据')}}</p>
      </el-col>
      <el-col :span="18">
        <el-table
          :data="tableData"
          border
          v-loading="tableLoading"
          class="data-list"
          style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <!-- 货品名称 -->
          <el-table-column
          prop="name"
          :label="$t('货品名称')">
          </el-table-column>
          <!-- 材质 -->
          <el-table-column
          prop="material"
          :label="$t('材质')">
          </el-table-column>
          <!-- 数量 -->
          <el-table-column
          prop="qty"
          :label="$t('数量')">
          </el-table-column>
          <!-- 单价 -->
          <el-table-column
          prop="unit_price"
          :label="$t('单价') + this.localization.currency_unit">
          </el-table-column>
          <!-- 总价 -->
          <el-table-column
          prop="total_price"
          :label="$t('总价') + this.localization.currency_unit">
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
          :label="$t('状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">{{$t('正常')}}</span>
            <span v-if="scope.row.status === 1">{{$t('破损')}}</span>
            <span v-if="scope.row.status === 2">{{$t('问题件')}}</span>
          </template>
          </el-table-column>
          <!-- 图片 -->
          <el-table-column :label="$t('图片')" prop="images" width="170">
            <template slot-scope="scope">
              <span v-for="(ele, index) in scope.row.images"
              :key="index" style="cursor:pointer;"
                @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${ele}`, imgVisible=true">
                  <img :src="`${$baseUrl.IMAGE_URL}${ele}`" style="width: 40px; margin-right: 5px;">
                </span>
          </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column :label="$t('操作')" width="130">
            <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editProduct(scope.row.id)">{{$t('编辑')}}</el-button>
                <el-button class="btn-light-red" @click="deleteProduct(scope.row.id)">{{$t('删除')}}</el-button>
            </template>
          </el-table-column>
      </el-table>
      </el-col>
    </el-row>
    </div>
    <!-- <nle-pagination :pageParams="page_params"></nle-pagination> -->
      <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
     </el-dialog>
    </div>
</template>

<script>
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  mixins: [pagination],
  components: {
    // NlePagination,
    AddBtn
  },
  data () {
    return {
      user: {
        express_num: '',
        express_company_id: '',
        user_id: '',
        warehouse_id: '',
        package_weight: '',
        package_value: '',
        package_name: '',
        brand_name: '',
        props: [],
        chosen_services: [],
        country_id: '',
        length: '',
        width: '',
        height: '',
        MaxWeight: '',
        cName: '',
        in_storage_remark: '',
        number: '',
        qty: '',
        code: '',
        location: '',
        package_pictures: ''
      },
      updateProp: [], // 物品属性数据
      updateService: [], // 服务数据
      tableData: [], // 表格数据
      tableLoading: false,
      localization: {},
      agentData: [],
      expressData: [],
      shipData: [],
      goodsImgList: [],
      hasStore: false,
      imgVisible: false,
      imgSrc: '',
      currencyUnit: '',
      areaId: '',
      locationId: '',
      form: {},
      shipNum: '', // 通过快递单号拉取的包裹id
      expressNum: '' // 保存的快递单号
    }
  },
  created () {
    this.getProp() // 获取物品属性
    this.getService() // 获取全部服务
    this.getAgentData()
    this.getExpressData() // 获取全部快递公司
    if (this.$route.params.id) {
      this.getList() // 获取商品详细
      this.getPackageList() // 获取表格数据
      // this.user.warehouse_id = this.$route.params.warehouse_id
      // this.user.express_num = this.$route.params.express_num
      // this.user.user_id = this.$route.params.user_id + '---' + this.$route.params.user_name
      // if (this.$route.query.props) {
      //   let props = JSON.parse(this.$route.query.props)
      //   this.user.props = props.map(item => item.id)
      // }
    }
  },
  methods: {
    // 获取全部物品属性
    getProp () {
      this.$request.getProps().then(res => {
        this.updateProp = res.data
        this.localization = res.localization
      })
    },
    // 获取全部服务
    getService () {
      this.$request.getAllService().then(res => {
        this.updateService = res.data
      })
    },
    getNum (num) {
      if (num) {
        console.log('num', num)
        this.expressNum = num
        this.getShipmentNum()
      } else {
        return this.$message.error(this.$t('请输入快递单号'))
      }
    },
    // 通过快递单号获取id
    getShipmentNum () {
      this.$request.getShipmentNum(this.expressNum).then(res => {
        if (res.ret) {
          this.shipNum = res.data.id
          console.log(this.shipNum, 'shipNum')
          this.getList()
          this.getPackageList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 从包裹快速入库时获取整页数据
    getList () {
      let id
      if (this.$route.params.id) {
        id = this.$route.params.id
      } else {
        id = this.shipNum
      }
      this.$request.getProductDetails(id).then(res => {
        if (res.ret) {
          this.user = res.data
          // this.user.express_num = this.$route.params.express_num
          this.user.user_id = res.data.user_id + '---' + res.data.user_name
          this.user.props = res.data.props.map(item => item.id)
          this.user.chosen_services = res.data.chosen_services.map(item => item.service_id)
          this.user.warehouse_id = res.data.warehouse.id
          if (res.data.express_line) {
            this.$set(this.user, 'CName', res.data.express_line.name)
            this.$set(this.user, 'MaxWeight', res.data.express_line.max_weight)
          }
          if (res.data.express_company) {
            this.user.express_company_id = res.data.express_company.id
          }
          if (res.data.country) {
            this.$set(this.user, 'country_id', res.data.country.id)
          }
          this.areaId = this.user.warehouse_id
          this.locationId = this.areaId
          res.data.package_pictures && (this.goodsImgList = res.data.package_pictures)
          console.log(this.locationId, 'locationId')
          this.updateAreaData()
          this.locationCNSearch()
          // this.user.location =
          // if (res.data.props) {
          //   let props = JSON.parse(res.data.props)
          // }
          this.currencyUnit = res.localization.currency_unit
        }
      })
    },
    // 获取商品列表数据
    getPackageList () {
      let packageId
      if (this.$route.params.id) {
        packageId = this.$route.params.id
      } else {
        packageId = this.shipNum
      }
      this.$request.getPackageList(packageId).then(res => {
        this.tableData = res.data
      })
    },
    // 获取代理列表
    getAgentData () {
      this.$request.getSimpleWarehouse().then(res => {
        this.agentData = res.data
      })
    },
    // 获取快递公司数据
    getExpressData () {
      this.$request.getExpressData().then(res => {
        this.expressData = res.data
      })
    },
    // 获取寄往地区数据
    getAreaData (id) {
      if (id) {
        this.locationId = id
        this.user.location = ''
        this.locationCNSearch()
        console.log(this.locationId, '我是改变的locationId')
        this.$request.getArea(id).then(res => {
          if (res.ret) {
            this.shipData = res.data
          }
        })
      }
    },
    // 更改线路
    changeLine () {
      dialog({ type: 'expressChange' }, data => {
        console.log(data, 'data')
        // this.$set(this.user, 'CName', data.cn_name)
        console.log(this.user, 'CName', data.name)
        this.user.CName = data.name
        this.user.MaxWeight = data.max_weight
        this.user.express_line_id = data.id
      })
    },
    changeShip (e) {
      console.log(e)
      this.$set(this.user, 'country_id', e)
      console.log(this.user.country_id, 'user.country_id')
    },
    // 通过仓库id拉取相对应的地区
    updateAreaData () {
      this.$request.getArea(this.areaId).then(res => {
        this.shipData = res.data
      })
    },
    // 添加商品清单
    addProduct () {
      let ProductId
      if (this.$route.params.id) {
        ProductId = this.$route.params.id
      } else {
        ProductId = this.shipNum
      }
      dialog({ type: 'productList',
        state: 'add',
        id: ProductId,
        currencyUnit: this.currencyUnit }, () => {
        this.getPackageList()
      })
    },
    // 编辑商品清单
    editProduct (ele) {
      let ProductId
      if (this.$route.params.id) {
        ProductId = this.$route.params.id
      } else {
        ProductId = this.shipNum
      }
      dialog({ type: 'productList',
        state: 'edit',
        id: ProductId,
        ele: ele,
        currencyUnit: this.currencyUnit
      }, () => {
        this.getPackageList()
      })
    },
    // 删除商品清单
    deleteProduct (ele) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteSingleDetails(this.$route.params.id, ele).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getPackageList()
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
    // 上传物品照片
    uploadGoodsImg (item) {
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
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 预览图片
    onPreview (image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg (index) {
      this.goodsImgList.splice(index, 1)
    },
    beforeUploadImg (file) {
      if (!(/^image/.test(file.type))) {
        this.$message.info(this.$t('请上传图片类型文件'))
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info(this.$t('上传图片大小不能超过2M'))
        return false
      }
      return true
    },
    // 客户id
    queryCNSearch (queryString, callback) {
      console.log(this.user.user_id)
      var list = [{}]
      this.$request.Automatic({
        keyword: this.user.user_id.toString()
      }).then(res => {
        for (let i of res.data) {
          // i.value = i.id
          i.value = i.id + '---' + i.name
        }
        list = res.data
        callback && callback(list)
      })
    },
    // 货位搜索
    locationCNSearch (queryString, callback) {
      console.log(this.user.location, 'location')
      var list = [{}]
      this.$request.AutoLocation(this.locationId, {
        keyword: this.user.location
      }).then(res => {
        console.log(res.data, 'res data')
        for (let i of res.data) {
          i.value = i.code
          // i.value = i.id + '---' + i.name
        }
        if (!this.user.location) {
          this.user.location = res.data[0].code
        }
        list = res.data
        callback && callback(list)
      }).catch(() => {
        console.log(callback, 'callback')
        // eslint-disable-next-line no-array-constructor
        callback && callback(new Array())
      })
    },
    // 客户id
    handleSelect (item) {
      console.log(item)
      this.supplierId = item.id
      this.supplierName = item.name
    },
    // 货位
    locationSelect (item) {
      // this.ruleForm.en_name = item.name
      console.log(item)
      // this.supplierId = item.id
      // this.supplierName = item.name
    },
    // 保存
    submitStorage () {
      console.log(this.user.location, 'user.location')
      this.user.package_pictures = this.goodsImgList
      if (this.user.express_num === '') {
        return this.$message.error(this.$t('请输入快递单号'))
      } else if (this.user.package_weight === '') {
        return this.$message.error(this.$t('请输入重量'))
      } else if (this.user.warehouse_id === '') {
        return this.$message.error(this.$t('请选择仓库'))
      } else {
        if (this.$route.params.id) { // 如果是从订单跳转过来
          if (this.$route.params.state === 'editWarehouse') {
            this.tableLoading = true
            this.user.user_id = this.user.user_id.split('---')[0]
            this.$request.submitEditPackage(this.$route.params.id, this.user).then(res => {
              this.tableLoading = false
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.user.length = this.user.width = this.user.height = this.user.package_weight = this.user.package_value = ''
                this.user.user_id = this.user.warehouse_id = this.user.package_name = this.user.brand_name = ''
                this.user.express_num = this.user.in_storage_remark = this.user.express_company_id = this.user.number = this.user.qty = this.user.code = ''
                this.goodsImgList = []
                this.user.props = []
                this.user.chosen_services = []
                this.user.location = this.user.country_id = ''
                this.hasStore = true
                this.$router.replace('/station/storage')
              } else {
                this.$message({
                  title: this.$t('操作失败'),
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            this.tableLoading = true
            this.user.user_id = this.user.user_id.split('---')[0]
            this.$request.submitPackage(this.$route.params.id, this.user).then(res => {
              this.tableLoading = false
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.user.length = this.user.width = this.user.height = this.user.package_weight = this.user.package_value = ''
                this.user.user_id = this.user.warehouse_id = this.user.package_name = this.user.brand_name = ''
                this.user.express_num = this.user.in_storage_remark = this.user.express_company_id = this.user.number = this.user.qty = this.user.code = ''
                this.goodsImgList = []
                this.user.props = []
                this.user.chosen_services = []
                this.user.location = this.user.country_id = ''
                this.hasStore = true
                this.$router.replace('/station/storage')
              } else {
                this.$message({
                  title: this.$t('操作失败'),
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
          }
        } else { // 如果是添加
          this.tableLoading = true
          this.user.user_id = this.user.user_id.split('---')[0]
          console.log(this.user.user_id, 'this.user.user_id')
          this.$request.getExpress(this.user).then(res => {
            this.tableLoading = false
            if (res.ret === 1) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.user.length = this.user.width = this.user.height = this.user.package_weight = this.user.package_name = this.user.brand_name = ''
              this.user.user_id = this.user.warehouse_id = this.user.package_value = ''
              this.user.express_num = this.user.in_storage_remark = this.user.express_company_id = this.user.number = this.user.qty = this.user.code = ''
              this.goodsImgList = []
              this.user.props = []
              this.user.chosen_services = []
              this.user.location = this.user.country_id = ''
              this.hasStore = true
              this.shipNum = ''
              console.log(this.hasStore, 'this.hasStore')
            } else if (res.ret === 2) {
              this.$confirm(this.$t('快递单号不存在或客户未预报，请确认是否入库'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.$request.addShipment(this.user).then(res => {
                  if (res.ret) {
                    this.$notify({
                      title: this.$t('操作成功'),
                      message: res.msg,
                      type: 'success'
                    })
                    this.user.length = this.user.width = this.user.height = this.user.package_weight = this.user.package_name = this.user.package_value = this.user.brand_name = ''
                    this.user.user_id = this.user.warehouse_id = ''
                    this.user.express_num = this.user.express_company_id = this.user.in_storage_remark = this.user.number = this.user.qty = this.user.code = this.user.country_id = ''
                    this.user.props = []
                    this.goodsImgList = []
                    this.user.chosen_services = []
                    this.user.location = ''
                  } else {
                    this.$notify({
                      title: this.$t('操作失败'),
                      message: res.msg,
                      type: 'warning'
                    })
                  }
                })
              })
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
  }
}
</script>

<style lang="scss">
.storage-container {
  .container-top {
    background-color: #fff !important;
    padding: 20px;
  }
  .sizeLength {
    width: 33% !important;
  }
  .updateChe {
    .el-form-item__content {
      // margin-left: 0 !important;
    }
  }
  .saveBtn {
    .el-button {
      background-color: #3540A5;
      color: #fff;
      padding: 15px 35px;
    }
  }
  .changeQuery {
    .el-autocomplete {
      width: 100%;
    }
  }
  .weight-style {
    .el-form-item__content .el-input-group {
      height: 80px !important;
    }
    .el-input-group--append .el-input__inner {
      height: 80px !important;
      font-weight: bolder;
      font-size: 30px;
    }
  }
  .service-style {
    .el-checkbox-group {
      height: 80px !important;
    }
  }
  .line-center {
    border: 1px solid #ccc;
    margin-bottom: 20px;
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
      .model-box, .operat-box {
        opacity: 1;
        transition: all .5s ease-in;
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
    background-color: rgba(0, 0, 0, .3);
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
  .save-btn {
    // text-align: center;
  }
  .select-box {
    margin-top: 10px;
    overflow: hidden;
    h4 {
      display: inline-block;
    }
  }
  .id-style {
    background-color: #fff !important;
    .upload-top {
      margin-top: 40px;
    }
  }
  .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
  .left-img {
    display: inline-block;
    // margin-top: 20px;
    // padding: 10px 5px;
  }
  .itemImg {
    border: 1px dashed #ccc;
    display: inline-block;
    margin-right: 15px;
    width: 50px;
    height: 50px;
  }
  .nullProduct {
    padding-left: 70px;
    color: #ccc;
  }
  .remark-font {
    color: #ff9a20;
  }
  .icon-question {
    margin-left: 5px;
    font-size: 18px;
    color: #67C23A;
    position: relative;
    top: 3px;
  }
  .change-line {
    color: #606266;
  }
  .change-btn {
    margin-left: 10px;
  }
}
</style>

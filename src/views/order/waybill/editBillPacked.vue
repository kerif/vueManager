<template>
  <div class="packed-container">
    <div class="receiverMSg">
      <h4>{{ $t('收货人信息') }}</h4>
      <el-row class="container-center" :gutter="20">
        <!-- 姓名 -->
        <el-col :span="7">
          <span class="leftWidth">{{ $t('姓名') }}</span>
          <span>{{ form.address && form.address.receiver_name }}</span>
        </el-col>
        <!-- 手机/联系电话 -->
        <el-col :span="7" :offset="1">
          <span class="leftWidth">{{ $t('手机联系电话') }}</span>
          <span>{{ form.address && form.address.phone }}</span>
        </el-col>
        <!-- 国家/地区 -->
        <el-col :span="7" :offset="1">
          <span class="leftWidth">{{ $t('国家地区') }}</span>
          <span>{{ form.address && form.address.country.cn_name }}</span>
        </el-col>
      </el-row>
      <el-row class="container-center" :gutter="20">
        <!-- 城市 -->
        <el-col :span="7">
          <span class="leftWidth">{{ $t('城市') }}</span>
          <span>{{ form.address && form.address.city }}</span>
        </el-col>
        <!-- 街道/门牌号 -->
        <el-col :span="7" :offset="1">
          <span class="leftWidth">{{ $t('街道门牌号') }}</span>
          <span
            >{{ form.address && form.address.street
            }}{{ form.address && form.address.door_no }}</span
          >
        </el-col>
        <!-- 邮编 -->
        <el-col :span="7" :offset="1">
          <span class="leftWidth">{{ $t('邮编') }}</span>
          <span>{{ form.address && form.address.postcode }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="receiverMSg">
      <h4>{{ $t('打包详情') }}</h4>
      <el-row class="container-center" :gutter="20">
        <!-- 订单号 -->
        <el-col :span="7">
          <span class="leftWidth">{{ $t('订单号') }}</span>
          <span>{{ form.order_sn }}</span>
        </el-col>
        <!-- 线路名称 -->
        <el-col :span="7" :offset="1">
          <span class="leftWidth">{{ $t('线路名称') }}</span>
          <span
            >{{ form.express_line && form.express_line.cn_name }}---{{ $t('限重')
            }}{{ form.express_line && form.express_line.max_weight
            }}{{ localization.weight_unit }}</span
          >
        </el-col>
        <!-- 提交时间 -->
        <el-col :span="7" :offset="1">
          <span class="leftWidth">{{ $t('提交时间') }}</span>
          <span>{{ form.created_at }}</span>
        </el-col>
      </el-row>
      <!-- 客户ID -->
      <el-row class="container-center" :gutter="20">
        <el-col :span="7">
          <span class="leftWidth">{{ $t('客户ID') }}</span>
          <span>{{ form.user_id }}---{{ form.user_name }}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 打包清单 -->
    <h4>{{ $t('包裹清单') }}</h4>
    <div class="add-sty">
      <el-button class="btn-blue" @click="addPackages">{{ $t('添加包裹') }}</el-button>
    </div>
    <el-table :data="PackageData" v-loading="tableLoading" class="data-list" border stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('快递单号')" prop="express_num"></el-table-column>
      <el-table-column :label="$t('物品名称')" prop="package_name"></el-table-column>
      <el-table-column
        :label="$t('物品价值') + this.localization.currency_unit"
        prop="package_value"
      ></el-table-column>
      <el-table-column :label="$t('物品属性')">
        <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">{{ item.cn_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('代理')" prop="agent"></el-table-column>
      <!-- 商品清单 -->
      <el-table-column :label="$t('商品清单')" prop="item_pictures" width="130">
        <template slot-scope="scope">
          <span
            v-for="item in scope.row.item_pictures"
            :key="item.id"
            style="cursor: pointer"
            @click.stop=";(imgSrc = $baseUrl.IMAGE_URL + item.path), (imgVisible = true)"
          >
            <img :src="$baseUrl.IMAGE_URL + item.path" style="width: 40px; margin-right: 5px" />
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('货位')" prop="location"></el-table-column>
    </el-table>
    <div class="receiverMSg">
      <el-form
        ref="params"
        :model="user"
        class="package-form"
        label-width="120px"
        label-position="left"
      >
        <!-- 订单号 -->
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item :label="$t('订单号')" prop="name">
              <el-input v-model="user.order_sn" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <!-- 留仓物品 -->
          <el-col :span="10" :offset="2" v-if="$route.params.parent == 0">
            <el-form-item :label="$t('留仓物品')">
              <el-input
                v-model="user.in_warehouse_item"
                :placeholder="$t('请输入留仓物品')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 客服备注 -->
        <el-row :gutter="20">
          <!-- 货位 -->
          <el-col :span="11" v-if="$route.params.parent == 0">
            <el-form-item :label="$t('货位')">
              <el-input v-model="user.location" :placeholder="$t('请输入货位')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item :label="$t('更改仓库')" class="express">
              <span class="change-line">{{ warehouse.warehouse_name }}</span>
              <el-button
                v-if="$route.params.parent == 0"
                class="btn-main change-btn"
                @click="changeWarehouse"
                >{{ $t('更改') }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 出箱类型 -->
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item :label="$t('出箱类型')">
              <el-radio-group v-model="user.box_type">
                <el-radio :label="1">{{ $t('单箱出库') }}</el-radio>
                <el-radio :label="2">{{ $t('多箱出库') }}</el-radio>
                <el-button @click="originalBox">{{ $t('原箱出库') }}</el-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item :label="$t('更改线路')" class="express">
              <span class="change-line"
                >{{ express.CName }}---{{ $t('限重') }}{{ express.MaxWeight }}KG</span
              >
              <el-button
                class="btn-main change-btn"
                v-if="$route.params.parent == 0"
                @click="changeLine"
                >{{ $t('更改') }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 重量 -->
        <el-row :gutter="20" v-if="this.user.box_type === 1">
          <el-col :span="11">
            <el-form-item :label="$t('重量')" prop="weight">
              <el-input v-model="user.weight" :placeholder="$t('请输入重量')">
                <template slot="append">{{ this.localization.weight_unit }}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 尺寸 -->
          <el-col :span="10" :offset="2">
            <el-form-item :label="$t('尺寸')">
              <el-input
                v-model="user.length"
                class="sizeLength"
                :placeholder="$t('长') + this.localization.length_unit"
              ></el-input>
              <el-input
                v-model="user.width"
                class="sizeLength"
                :placeholder="$t('宽') + this.localization.length_unit"
              ></el-input>
              <el-input
                v-model="user.height"
                class="sizeLength"
                :placeholder="$t('高') + this.localization.length_unit"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="this.user.box_type === 2">
          <el-form-item>
            <el-col :span="18">
              <div class="add-row">
                <el-button @click="addRow" class="btn-deep-purple">{{ $t('添加行') }}</el-button>
              </div>
              <el-table :data="user.box" style="width: 100%" border>
                <el-table-column :label="$t('包裹实际重量') + this.localization.weight_unit">
                  <template slot-scope="scope">
                    <el-input
                      @change="_onTotalWeight(scope.row)"
                      v-model="scope.row.weight"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('长') + this.localization.length_unit">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.length" @blur="changeNum(scope)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('宽') + this.localization.length_unit">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.width" @blur="changeNum(scope)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('高') + this.localization.length_unit">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.height" @blur="changeNum(scope)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('体积重量') + this.localization.weight_unit"
                  v-if="user.base_mode === 1"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.volume_weight" disabled></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('操作')">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, user.box)"
                      class="btn-light-red"
                      >{{ $t('移除') }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <p>{{ $t('实际总重量') }}{{ localization.weight_unit }}：{{ TotalWeight }}</p>
              <p v-if="user.base_mode === 1">
                {{ $t('体积总重量') }}{{ localization.weight_unit }}：{{ UnitTotalWeight }}
              </p>
            </el-col>
          </el-form-item>
        </el-row>
        <!-- 上传打包照片 -->
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item :label="$t('上传打包照片')" class="updateChe">
              <span class="img-item" v-for="(item, index) in baleImgList" :key="item.name">
                <img :src="$baseUrl.IMAGE_URL + item.url" alt class="goods-img" />
                <span class="model-box"></span>
                <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                  <i class="el-icon-delete" @click="onDeleteImg('bale', index)"></i>
                </span>
              </span>
              <el-upload
                v-show="baleImgList.length < 3"
                class="avatar-uploader"
                action
                list-type="picture-card"
                :before-upload="beforeUploadImg"
                :http-request="uploadBaleImg"
                :show-file-list="false"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <div class="updateImg">
                {{ $t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张') }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item prop="password_confirmation" class="updateChe" :label="$t('物品照片')">
              <span class="img-item" v-for="(item, index) in goodsImgList" :key="item.name">
                <img :src="$baseUrl.IMAGE_URL + item.url" alt class="goods-img" />
                <span class="model-box"></span>
                <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                  <i class="el-icon-delete" @click="onDeleteImg('goods', index)"></i>
                </span>
              </span>
              <el-upload
                v-show="goodsImgList.length < 3"
                class="avatar-uploader"
                list-type="picture-card"
                action
                :before-upload="beforeUploadImg"
                :http-request="uploadGoodsImg"
                :show-file-list="false"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <div class="updateImg">
                {{ $t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张') }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 关税金额 -->
        <el-row :gutter="20">
          <el-col :span="11" v-if="$route.params.parent == 0">
            <el-form-item :label="$t('关税金额') + localization.currency_unit">
              <el-input v-model="user.tariff_fee" :placeholder="$t('请输入')"></el-input>
            </el-form-item>
          </el-col>
          <el-col el-col :span="10" :offset="2">
            <el-form-item :label="$t('客服备注')" class="customer">
              <el-input
                type="textarea"
                :placeholder="$t('请输入备注')"
                v-model="user.remark"
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 保险金额  -->
        <el-row :gutter="20" v-if="$route.params.parent == 0">
          <el-col :span="11">
            <el-form-item :label="$t('保险金额') + localization.currency_unit">
              <el-input v-model="user.insurance_fee" :placeholder="$t('请输入')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 增值服务 -->
        <el-row :gutter="20" v-if="$route.params.parent == 0">
          <el-col>
            <el-form-item :label="$t('增值服务')">
              <div v-for="item in updateProp" :key="item.id" class="service">
                <div class="serviceLeft">
                  <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
                </div>
                <div class="serviceRight">
                  <span>{{ localization.currency_unit }}</span>
                  <el-input v-model="item.price" class="add-value-ipt"></el-input>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 渠道增值服务 -->
        <el-row :gutter="20" v-if="$route.params.parent == 0">
          <el-col>
            <el-form-item :label="$t('渠道增值服务')">
              <el-checkbox-group v-model="user.line_service_ids">
                <div v-for="item in lineServices" :key="item.id" class="service">
                  <div class="serviceLeft">
                    <el-checkbox :label="item.id" :disabled="item.is_force === 1">{{
                      item.name
                    }}</el-checkbox>
                  </div>
                  <div class="serviceRight">
                    <span>{{ localization.currency_unit }}</span>
                    <el-input v-model="item.value" disabled class="add-value-ipt"></el-input>
                  </div>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 渠道限制费 -->
        <el-row :gutter="20" v-if="$route.params.parent == 0">
          <el-col>
            <el-form-item :label="$t('渠道限制费')">
              <div class="service">
                <div class="serviceLeft">
                  <span>{{ localization.currency_unit }}</span>
                  <el-input v-model="user.line_rule_fee" class="add-value-ipt" disabled></el-input>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 保存 -->
    <el-row :gutter="20">
      <el-col :span="18">
        <el-button @click="savePacked" type="primary" :loading="$store.state.btnLoading">{{
          $t('保存')
        }}</el-button>
        <span class="save-btn" v-if="form.group_name && form.is_parent === 0"
          >*{{
            $t('不管数据有无更改点击保存后请务必重新操作总订单编辑保存以重新计算正确价格')
          }}！</span
        >
      </el-col>
    </el-row>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      checked: false,
      form: {
        express_line: {
          id: ''
        }
      },
      TotalWeight: '',
      UnitTotalWeight: '',
      user: {
        weight: '',
        width: '',
        length: '',
        order_sn: '',
        height: '',
        remark: '',
        location: '',
        box_type: 1,
        base_mode: 1,
        express_line_id: '',
        warehouse_id: '',
        insurance_fee: '',
        tariff_fee: '',
        services: [],
        in_warehouse_item: '',
        in_warehouse_pictures: [], // 留仓物品照片
        pack_pictures: [], // 打包照片
        box: [],
        line_service_ids: []
      },
      tableLoading: false,
      baleImgList: [],
      goodsImgList: [],
      PackageData: [],
      services: [],
      updateProp: [],
      lineServices: [],
      localization: {},
      imgVisible: false,
      imgSrc: '',
      expressData: [],
      weightName: '',
      lineServiceId: [],
      express: {
        MaxWeight: '',
        cName: ''
      },
      warehouse: {
        warehouse_name: ''
      },
      factor: ''
    }
  },
  created() {
    this.getPackage()
    this.getExpress()
  },
  methods: {
    // 获取多选框
    getProp(arr) {
      this.$request.getAdded().then(res => {
        if (res.ret) {
          let ids = res.data.map(item => item.id)
          this.updateProp = res.data.map(item => {
            return {
              ...item,
              checked: false
            }
          })
          arr.forEach(item => {
            let index = ids.indexOf(item.service_id)
            if (index !== -1) {
              this.updateProp[index].checked = true
              this.updateProp[index].price = item.price
            }
          })
        }
      })
    },
    //获取渠道增值服务
    getExpressServes() {
      this.$request.getExpressServes(this.$route.params.id, this.$route.params.lineId).then(res => {
        if (res.ret) {
          this.lineServices = res.data
          this.lineServices.forEach(item => {
            if (item.is_force) {
              this.user.line_service_ids.push(item.id)
            }
          })
          this.lineServiceId.forEach(item => {
            if (
              this.lineServices.map(ele => ele.id).includes(item) &&
              !this.user.line_service_ids.includes(item)
            ) {
              this.user.line_service_ids.push(item)
            }
          })
        }
      })
    },
    // 计算体积重量
    changeNum(row = {}) {
      const { length, width, height } = row.row
      if (length && width && height) {
        if (this.user.base_mode === 0) {
          this.user.box = this.user.box.map((item, index) => {
            if (index === row.$index) {
              return { ...item, volume_weight: (length * width * height) / this.factor }
            }
            return item
          })
        } else {
          this.user.box = this.user.box.map((item, index) => {
            if (index === row.$index) {
              return { ...item }
            }
            return item
          })
        }
        this.unitVolume()
      }
    },
    // 计算实际总重量
    _onTotalWeight() {
      this.TotalWeight =
        this.user.box.length === 1
          ? this.user.box[0].weight
          : this.user.box
              .map(item => item.weight)
              .reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0)
    },
    // 计算体积总重量
    unitVolume() {
      this.UnitTotalWeight =
        this.user.box.length === 1
          ? this.user.box[0].volume_weight
          : this.user.box
              .map(item => item.volume_weight)
              .reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0)
              .toFixed(2)
    },
    // 原箱出库
    originalBox() {
      if (this.PackageData.length > 1) {
        this.user.box_type = 2
        this.user.box = this.PackageData.map(item => {
          return {
            length: item.length,
            width: item.width,
            height: item.height,
            weight: item.package_weight,
            volume_weight: ((item.length * item.width * item.height) / this.factor).toFixed(3)
          }
        })
        this._onTotalWeight()
        this.unitVolume()
      } else {
        this.user.weight = this.PackageData[0].package_weight
        this.user.length = this.PackageData[0].length
        this.user.width = this.PackageData[0].width
        this.user.height = this.PackageData[0].height
      }
    },
    savePacked() {
      this.user.services = this.updateProp
        .filter(item => item.checked)
        .map(item => {
          return {
            id: item.id,
            price: item.price
          }
        })
      this.user.in_warehouse_pictures = this.goodsImgList.map(item => {
        return {
          url: item.url
        }
      })
      this.user.pack_pictures = this.baleImgList.map(item => {
        return {
          url: item.url
        }
      })
      this.$request.saveOrderPack(this.$route.params.id, this.user).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.$router.go(-1)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 新增行
    addRow() {
      if (this.user.base_mode === 0) {
        this.user.box.push({
          weight: '',
          length: '',
          width: '',
          height: '',
          volume_weight: ''
        })
      } else {
        this.user.box.push({
          weight: '',
          length: '',
          width: '',
          height: ''
        })
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
      this._onTotalWeight()
      this.unitVolume()
      console.log(rows, 'rows')
    },
    // 更改仓库
    changeWarehouse() {
      dialog({ type: 'lineChange', state: 'warehouse' }, data => {
        console.log(data, 'data')
        // this.warehouse.warehouse_id = data.id
        this.user.warehouse_id = data.id
        this.warehouse.warehouse_name = data.warehouse_name
      })
    },
    // 更改线路
    changeLine() {
      dialog({ type: 'lineChange', state: 'line', id: this.user.warehouse_id }, data => {
        console.log(data, 'data')
        this.express.CName = data.name
        this.express.MaxWeight = data.max_weight
        this.user.express_line_id = data.id
      })
    },
    getPackage() {
      this.$request.getOrderDetails(this.$route.params.id).then(res => {
        this.form = res.data
        this.PackageData = res.data.packages
        this.user.tariff_fee = res.data.payment.tariff_fee
        this.user.insurance_fee = res.data.payment.insurance_fee
        this.user.line_rule_fee = res.data.payment.line_rule_fee
        this.user.box_type = res.data.box_type
        this.user.order_sn = res.data.order_sn
        this.user.length = res.data.length
        this.user.width = res.data.width
        this.user.height = res.data.height
        this.user.base_mode = res.data.base_mode
        this.lineServiceId = res.data.payment.line_services.map(item => item.line_service_id)
        this.getExpressServes()
        if (res.data.box_type === 2) {
          // 出箱类型等于多箱出库时
          this.user.box = res.data.box
          this.TotalWeight =
            this.user.box.length === 1
              ? this.user.box[0].weight
              : this.user.box
                  .map(item => item.weight)
                  .reduce(
                    (accumulator, currentValue) => Number(accumulator) + Number(currentValue),
                    0
                  )
          this.UnitTotalWeight =
            this.user.box.length === 1
              ? this.user.box[0].volume_weight
              : this.user.box
                  .map(item => item.volume_weight)
                  .reduce(
                    (accumulator, currentValue) => Number(accumulator) + Number(currentValue),
                    0
                  )
        }
        this.tableLoading = false
        this.form = res.data
        this.baleImgList = res.data.pack_pictures // 打包照片
        this.goodsImgList = res.data.in_warehouse_pictures // 物品照片
        this.paymentData = [res.data.payment]
        this.user.weight = res.data.weight
        this.user.in_warehouse_item = res.data.in_warehouse_item
        this.user.location = res.data.location
        this.services = res.data.services
        this.getProp(res.data.services)
        this.express.CName = this.form.express_line.cn_name
        this.express.MaxWeight = this.form.express_line.max_weight
        this.user.express_line_id = this.form.express_line.id
        this.user.warehouse_id = this.form.warehouse.id
        this.warehouse.warehouse_name = this.form.warehouse.warehouse_name
        this.factor = res.data.express_line.factor > 0 ? res.data.express_line.factor : 6000
        console.log(this.factor, 'this.factor')
        this.localization = res.localization
      })
    },
    // 获取全部线路详情
    getExpress() {
      this.$request.getUsable(this.$route.params.id).then(res => {
        if (res.ret) {
          this.expressData = res.data
        }
      })
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(type, index) {
      if (type === 'bale') {
        this.baleImgList.splice(index, 1)
      } else if (type === 'goods') {
        this.goodsImgList.splice(index, 1)
      }
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
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push({
              name: item.name,
              url: item.path
            })
          })
        }
      })
    },
    // 上传物品照片
    uploadGoodsImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.goodsImgList.push({
              name: item.name,
              url: item.path
            })
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
    // 新增包裹
    addPackages() {
      dialog({ type: 'addPackages', id: this.$route.params.id }, () => {
        this.getPackage()
      })
    }
  },
  computed: {
    addServices() {
      if (!this.updateProp.length || !this.services.length) return []
      let arr = JSON.parse(JSON.stringify(this.updateProp))
      let ids = arr.map(item => item.id)
      this.services.forEach(item => {
        let index = ids.indexOf(item.id)
        if (index !== -1) {
          arr[index].checked = true
        }
      })
      console.log('dcd', this.arr)
      return arr
    }
  }
}
</script>

<style lang="scss">
.packed-container {
  .sizeLength {
    width: 33% !important;
  }
  .updateChe {
    // .el-form-item__content {
    //   margin-left: 0 !important;
    // }
    // .el-form-item__label {
    //   width: 500px !important;
    // }
  }
  .upload_ball {
    text-align: center;
    border: 1px solid #ccc;
    margin-top: 10px;
    border-radius: 5px;
    padding-top: 10px;
  }
  .customer {
    .el-textarea {
      width: 100%;
    }
  }
  .service {
    width: 350px;
    overflow: hidden;
    .el-input__inner {
      // width: 200px;
      // margin-left: 60px;
      line-height: 40px !important;
      margin-bottom: 10px;
    }
    .serviceLeft {
      display: inline-block;
      float: left;
    }
    .serviceRight {
      display: inline-block;
      float: right;
    }
  }
  .saveBtn {
    .el-button {
      background-color: #3540a5;
      color: #fff;
      padding: 15px 35px;
    }
  }
  .updateImg {
    margin-top: 10px;
    color: #ccc;
  }
  .package-form {
    overflow: hidden;
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
      .model-box,
      .operat-box {
        opacity: 1;
        transition: all 0.5s ease-in;
      }
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
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
  }
  .container-center {
    margin-bottom: 20px;
  }
  .receiverMSg {
    padding: 10px;
    margin-bottom: 20px;
    background-color: #fff !important;
  }
  .leftWidth {
    display: inline-block;
    width: 120px;
  }
  .express {
    .el-select {
      width: 100%;
    }
  }
  .add-value-ipt {
    width: calc(100% - 20px);
    margin-left: 5px;
  }
  .change-line {
    color: #606266;
  }
  .change-btn {
    margin-left: 10px;
  }
  .add-row {
    margin-bottom: 10px;
    text-align: right;
  }
  .save-btn {
    padding-left: 30px;
    font-size: 13px;
    color: red;
  }
  .el-checkbox-group {
    font-size: 14px;
  }
  .add-sty {
    text-align: right;
  }
}
</style>

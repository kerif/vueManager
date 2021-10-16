<template>
  <div class="basic-information-container">
    <el-form label-position="top" :model="form" ref="form">
      <el-form-item>
        <el-row v-if="$route.query.state === 'edit'">
          <el-col :span="10">
            <div>{{ $t('所属路线') }}</div>
            <el-select
              v-model="groupName"
              filterable
              clearable
              class="country-select"
              :placeholder="$t('请选择路线')"
            >
              <el-option
                v-for="item in lineList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <div>{{ $t('渠道名称') }}</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.name" :placeholder="$t('请输入内容')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <div>{{ $t('*支持仓库') }}</div>
            <el-select
              v-model="form.warehouse_ids"
              multiple
              filterable
              class="country-select"
              :placeholder="$t('请选择仓库')"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.warehouse_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>{{ $t('*渠道属性') }}</div>
            <el-checkbox-group v-model="form.prop_ids">
              <el-checkbox v-for="item in typeList" :key="item.id" :label="item.id">
                {{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-col>
          <el-col :span="10" class="country-btn">
            <el-button type="primary" @click="addProps">{{ $t('添加属性') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>{{ $t('*送货方式') }}</div>
            <el-radio @change="changeDelivery" v-model="form.is_delivery" :label="0">{{
              $t('仅送货上门')
            }}</el-radio>
            <el-radio @change="changeDelivery" v-model="form.is_delivery" :label="1">{{
              $t('仅自提')
            }}</el-radio>
            <el-radio @change="changeDelivery" v-model="form.is_delivery" :label="2">{{
              $t('送货上门与自提')
            }}</el-radio>
          </el-col>
          <el-col :span="10" class="country-btn" v-if="$route.params.id && form.is_delivery !== 0">
            <el-select
              v-model="form.default_pickup_station_id"
              clearable
              filterable
              allow-create
              default-first-option
              :placeholder="$t('请选择默认自提点')"
            >
              <el-option
                v-for="item in pickList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 设为推荐 -->
      <!-- <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>
              <span>{{ $t('设为推荐') }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('设为推荐后，该路线标为推荐路线。')"
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
            <el-switch
              v-model="form.is_great_value"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
          </el-col>
        </el-row>
      </el-form-item> -->
      <!-- 清关编码 -->
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <!-- <div>清关编码</div> -->
            <div>
              <span>{{ $t('清关编码') }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('开启表示需要提供收件人清关编码。')"
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
            <el-switch
              v-model="form.need_clearance_code"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
          </el-col>
          <el-col :span="10" v-if="form.need_clearance_code === 1">
            <div>{{ $t('清关备注') }}</div>
            <el-input
              v-model="form.clearance_code_remark"
              :placeholder="$t('请输入清关备注')"
              :rows="2"
              type="textarea"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>{{ $t('个人通关码') }}</span>
            </div>
            <el-switch
              v-model="form.need_personal_code"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 下单是否需要身份证 -->
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>{{ $t('下单是否需要身份证') }}</span>
              <!-- <el-tooltip class="item" effect="dark" content="开启表示需要提供收件人清关编码。" placement="top">
                <span class="el-icon-question icon-info"></span>
              </el-tooltip> -->
            </div>
            <el-switch
              v-model="form.need_id_card"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 路线icon -->
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <div>{{ $t('*路线icon') }}</div>
            <el-select
              v-model="form.icon"
              class="country-select"
              @change="onSelectChange"
              :placeholder="$t('请选择路线icon')"
            >
              <el-option
                v-for="item in iconList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10" class="country-btn">
            <el-button type="primary" @click="addIcon">+ {{ $t('新增icon') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-col :span="10">
          <div>
            <el-checkbox class="checkbox-sty" v-model="form.is_unique">{{
              $t('开启线路Icon过滤')
            }}</el-checkbox>
            <!-- <span>{{$t('计重模式')}}</span> -->
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('开启后该线路Icon所有符合条件路线中，仅提供价格最低的一条供选择')"
              placement="top"
            >
              <span class="el-icon-question icon-info"></span>
            </el-tooltip>
          </div>
        </el-col>
      </el-form-item>
      <!-- icon预览 -->
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>{{ $t('icon预览') }}</div>
            <!-- {{icon.icon}} -->
            <div class="icon-img" v-if="icon.icon">
              <span
                style="cursor: pointer"
                @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${icon.icon}`), (imgVisible = true)"
              >
                <img :src="`${$baseUrl.IMAGE_URL}${icon.icon}`" style="width: 100px" />
              </span>
            </div>
            <div v-else>
              <span>{{ $t('无') }}</span>
            </div>
          </el-col>
          <el-col :span="10" style="display: flex">
            <div style="flex: 1">
              <span>{{ $t('渠道标签') }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('渠道标签在客户端仅作展示，无特定功能')"
                placement="top"
              >
                <span class="el-icon-warning-outline icon-info"></span>
              </el-tooltip>
              <el-checkbox-group v-model="form.label_ids">
                <el-checkbox v-for="item in labelList" :key="item.id" :label="item.id">
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div style="width: 100px; margin-top: 25px" class="country-btn">
              <el-button type="primary" @click="addLabels">+ {{ $t('添加标签') }}</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>{{ $t('*备注') }}</div>
            <el-input
              v-model="form.remark"
              :placeholder="$t('请输入内容')"
              :rows="4"
              type="textarea"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="sava-btn"
          :loading="$store.state.btnLoading"
          @click="saveLine"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="setVisible" :title="$t('抛货配置')">
      <el-form></el-form>
    </el-dialog>
  </div>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  name: 'lineAddEdit',
  data() {
    return {
      // is_avg_weight: 0,
      form: {
        name: '',
        warehouse_ids: '',
        // countries: '',
        // first_weight: '',
        // first_money: '',
        // first_cost_money: '',
        // next_cost_money: '',
        // next_weight: '',
        // next_money: '',
        // max_weight: '',
        // factor: '',
        // has_factor: '',
        is_unique: '',
        min_weight: '',
        // reference_time: '',
        // mode: '',
        prop_ids: [],
        is_great_value: 0,
        icon: '',
        need_id_card: '',
        weight_rise: '',
        // multi_box_min_weight: '',
        multi_boxes_ceil: '',
        remark: '',
        clearance_code_remark: '',
        need_clearance_code: 0,
        need_personal_code: 0,
        // ceil_weight: 0,
        // multi_boxes: 0,
        default_pickup_station_id: '',
        is_delivery: 0,
        label_ids: []
      },
      referenceTime: {
        minTime: '',
        maxTime: '',
        symbol: '工作日'
      },
      value: [],
      options: [],
      deliveryList: [],
      modeData: [
        {
          id: 1,
          name: this.$t('首重续重模式')
        },
        {
          id: 2,
          name: this.$t('阶梯价格模式')
        },
        {
          id: 3,
          name: this.$t('首重+阶梯价格档')
        }
      ],
      priceData: [
        {
          name: 0
        },
        {
          name: 0.5
        },
        {
          name: 1
        }
      ],
      iconList: [],
      warehouseList: [], // 获取全部仓库
      lineList: [], //获取所有路线
      typeList: [],
      labelList: [],
      localization: {},
      warehouseIds: [], // 保存支持仓库的id
      imgVisible: false,
      imgSrc: '',
      icon: {},
      itemArr: {},
      setVisible: false,
      dialogVisible: false,
      paramsOptions: [
        {
          id: 1,
          name: this.$t('所有边长')
        },
        {
          id: 2,
          name: this.$t('单边长度')
        },
        {
          id: 3,
          name: this.$t('三边之和')
        }
      ],
      conditionOptions: [
        {
          id: '>',
          name: this.$t('大于')
        },
        {
          id: '>=',
          name: this.$t('大于等于')
        },
        {
          id: '<',
          name: this.$t('小于')
        },
        {
          id: '<=',
          name: this.$t('小于等于')
        }
      ],
      pickList: [],
      groupName: '',
      id: ''
    }
  },
  created() {
    // console.log(this.$route.query.channelId, 'id')
    const add = localStorage.getItem('add')
    console.log(add, 'add')
    if (add) {
      this.form = {
        name: '',
        warehouse_ids: '',
        // countries: '',
        // first_weight: '',
        // first_money: '',
        // first_cost_money: '',
        // next_cost_money: '',
        // next_weight: '',
        // next_money: '',
        // max_weight: '',
        // factor: '',
        // has_factor: '',
        // is_avg_weight: 0,
        is_unique: '',
        min_weight: '',
        // reference_time: '',
        // mode: '',
        prop_ids: [],
        is_great_value: 0,
        icon: '',
        need_id_card: '',
        weight_rise: '',
        // multi_box_min_weight: '',
        remark: '',
        clearance_code_remark: '',
        need_clearance_code: 0,
        need_personal_code: 0,
        // ceil_weight: 0,
        // multi_boxes: 0,
        is_delivery: 0,
        default_pickup_station_id: '',
        label_ids: []
      }
    }
    this.getProp()
    this.getLine()
    this.getWarehouse()
    this.getIcon()
    this.getChannelLabel()
    if (this.$route.params.id) {
      console.log('bianji')
      this.getList()
      this.getPick()
    }
  },
  methods: {
    // 获取自提点数据
    getPick() {
      this.$request.autoPick(this.$route.params.id).then(res => {
        if (res.ret) {
          this.pickList = res.data
        }
      })
    },
    // 编辑时拉取的数据
    getList() {
      this.$request.configBasic(this.$route.params.id).then(res => {
        this.groupName = res.data.group_name
        this.form.name = res.data.name
        this.form.is_great_value = res.data.is_great_value
        this.form.remark = res.data.remark
        this.icon = res.data.icon && res.data.icon
        this.form.icon = res.data.icon && res.data.icon.id
        this.form.prop_ids = res.data.props.map(item => item.id)
        this.form.warehouse_ids = res.data.warehouses.map(item => item.id)
        this.form.is_unique = Boolean(res.data.is_unique)
        this.form.need_clearance_code = res.data.need_clearance_code
        this.form.need_personal_code = res.data.need_personal_code
        this.form.need_id_card = res.data.need_id_card
        this.form.is_delivery = res.data.is_delivery
        this.form.default_pickup_station_id = res.data.default_pickup_station_id
        this.form.label_ids = res.data.labels.map(item => item.id)
      })
    },
    onSelectChange(e) {
      console.log(e)
      this.icon = this.iconList.find(item => item.id === e)
      // console.log(this.form.icon)
    },
    // 获取全部路线icon
    getIcon() {
      this.$request.getAllIcon().then(res => {
        if (res.ret) {
          this.iconList = res.data
        }
      })
    },
    // 添加属性
    addProps() {
      dialog({ type: 'addPackage' }, () => {
        this.getProp()
      })
    },
    // 添加标签
    addLabels() {
      dialog({ type: 'addLabel' }, () => {
        this.getChannelLabel()
      })
    },
    changeDelivery() {
      this.form.default_pickup_station_id = ''
    },
    // 获取多选框
    getProp() {
      this.$request.getProps().then(res => {
        if (res.ret) {
          this.typeList = res.data
          this.localization = res.localization
          console.log(this.typeList)
        }
      })
    },
    // 跳转到增加icon
    addIcon() {
      this.$router.push({ name: 'IconAdd' })
    },
    // 获取支持国家数据
    searchCountry() {
      console.log(111)
      this.$request
        .supportCountry({
          warehouseIds: this.warehouseIds
        })
        .then(res => {
          if (res.ret) {
            this.options = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 获取全部支持仓库
    getWarehouse() {
      this.$request.getAllWarehouse().then(res => {
        this.warehouseList = res.data
      })
    },
    // 获取全部路线
    getLine() {
      this.$request.getLineGroup().then(res => {
        this.lineList = res.data
      })
    },
    // 获取渠道标签多选框
    getChannelLabel() {
      this.$request.lineLabel().then(res => {
        console.log(res)
        if (res.ret) {
          this.labelList = res.data
        }
      })
    },
    saveLine() {
      if (this.form.name === '') {
        return this.$message.error(this.$t('请输入线路名称'))
      } else if (this.form.warehouse_ids === '') {
        return this.$message.error(this.$t('请选择支持仓库'))
      } else if (!this.form.prop_ids[0]) {
        return this.$message.error(this.$t('请选择线路类型'))
      } else if (this.form.remark === '') {
        return this.$message.error(this.$t('请输入备注'))
      }
      if (this.$route.params.id) {
        // 编辑状态
        this.$request
          .updateConfigBasic(this.$route.params.id, {
            ...this.form,
            group_id: this.$route.params.lineId,
            is_unique: Number(this.form.is_unique)
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
      } else {
        // 新建状态
        this.$request
          .newConfigBasic({
            ...this.form,
            group_id: this.$route.query.channelId,
            is_unique: Number(this.form.is_unique)
          })
          .then(res => {
            if (res.ret) {
              const dataId = res.data.id
              this.$router.replace({
                name: 'channelLineEdit',
                params: {
                  id: dataId
                },
                query: {
                  state: 'edit'
                }
              })
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      }
    }
  }
}
</script>
<style lang="scss">
.basic-information-container {
  background-color: #fff !important;
  padding: 20px;
  .country-select {
    width: 100%;
  }
  .sava-btn {
    min-width: 100px;
  }
  .icon-info {
    color: #74b34f;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .max-time {
    position: relative;
    &::before {
      content: '—';
      position: absolute;
      left: -22px;
    }
  }
  .select-box {
    width: 100%;
  }
  .country-btn {
    margin-top: 40px;
    .el-button--primary {
      background-color: #eaecf5;
      border-color: #eaecf5;
      color: #3540a5;
    }
  }
  .icon-img {
    width: 100px;
    img {
      width: 100%;
    }
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .add-row {
    margin-bottom: 10px;
    text-align: right;
  }
  .checkbox-sty {
    margin-right: 0;
  }
}
</style>

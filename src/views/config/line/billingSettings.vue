<template>
  <div class="billing-setting-container">
    <el-form label-position="top" :model="form" ref="form">
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <el-radio>{{ $t('重量计费') }}</el-radio>
            <el-radio>{{ $t('体积计费') }}</el-radio>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <div>{{ $t('渠道最小重量') + localization.weight_unit }}</div>
        <el-row>
          <el-col :span="10">
            <el-input
              v-model="form.multi_box_min_weight"
              :placeholder="$t('请输入内容')"
            ></el-input>
            <el-checkbox>{{ $t('包裹重量不足最小重量时，按最小重量计算') }}</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 计费价格模式 -->
      <el-form-item>
        <div>
          {{ $t('*计费价格模式')
          }}<el-button style="margin-left: 10px" class="btn-green" @click="goIntroduction">{{
            $t('说明')
          }}</el-button>
        </div>
        <el-row>
          <el-col :span="10">
            <el-select
              v-model="form.mode"
              filterable
              class="country-select"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in modeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 首重续重模式 -->
      <div v-if="form.mode === 1">
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <div>{{ $t('*首重') + localization.weight_unit }}</div>
              <el-input v-model="form.first_weight" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
            <el-col :span="5">
              <div>{{ $t('*首费') + localization.currency_unit }}</div>
              <el-input v-model="form.first_money" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
            <el-col :span="5">
              <div>{{ $t('首费成本价') + localization.currency_unit }}</div>
              <el-input v-model="form.first_cost_money" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <div>{{ $t('*续重') + localization.weight_unit }}</div>
              <el-input v-model="form.next_weight" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
            <el-col :span="5">
              <div>{{ $t('*续费') + localization.currency_unit }}</div>
              <el-input v-model="form.next_money" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
            <el-col :span="5">
              <div>{{ $t('续费成本价') + localization.currency_unit }}</div>
              <el-input v-model="form.next_cost_money" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <div>{{ $t('*最小重量') + localization.weight_unit }}</div>
              <el-input v-model="form.min_weight" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
            <el-col :span="5">
              <div>{{ $t('*最大重量') + localization.weight_unit }}</div>
              <el-input v-model="form.max_weight" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <!-- 阶梯价格模式 -->
      <div v-if="form.mode === 2">
        <el-form-item>
          <el-col :span="16">
            <div class="add-row">
              <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
            </div>
            <el-table :data="form.price_grade" style="width: 100%" border>
              <el-table-column :label="$t('起始重量') + localization.weight_unit">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.start"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="'*' + $t('截止重量') + localization.weight_unit">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.end"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                :label="
                  $t('成本价格') + localization.currency_unit + '/' + localization.weight_unit
                "
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.cost_price"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                :label="
                  $t('销售价格') + localization.currency_unit + '/' + localization.weight_unit
                "
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sale_price"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.price_grade)"
                    class="btn-light-red"
                    >{{ $t('移除') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <div>{{ $t('*最小重量') + localization.weight_unit }}</div>
              <el-input
                v-model="form.multi_box_min_weight"
                :placeholder="$t('请输入内容')"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <!-- 首重 + 阶梯价格模式 -->
      <div v-if="form.mode === 3">
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <div>
                {{ $t('*首重价格') + localization.currency_unit + '/' + localization.weight_unit }}
              </div>
              <el-input v-model="form.first_money" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
            <el-col :span="5">
              <div>
                {{ $t('首费成本价') + localization.currency_unit + '/' + localization.weight_unit }}
              </div>
              <el-input v-model="form.first_cost_money" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-col :span="16">
            <div class="add-row">
              <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
            </div>
            <el-table :data="form.price_grade" style="width: 100%" border>
              <el-table-column :label="$t('起始重量') + localization.weight_unit + ' >='">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.start"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="'*' + $t('截止重量') + localization.weight_unit + ' <'">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.end"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('成本价格') + localization.currency_unit">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.cost_price"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('销售价格') + localization.currency_unit">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sale_price"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.price_grade)"
                    class="btn-light-red"
                    >{{ $t('移除') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <div>{{ $t('*最小重量') + localization.weight_unit }}</div>
              <el-input
                v-model="form.multi_box_min_weight"
                :placeholder="$t('请输入内容')"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <!-- 多级续重模式 -->
      <div v-if="form.mode === 4">
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <div>
                {{ $t('*首重') + localization.weight_unit }}
              </div>
              <el-input v-model="form.first_money" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
            <el-col :span="5">
              <div>
                {{ $t('截止重量') + localization.weight_unit }}
              </div>
              <el-input v-model="form.first_cost_money" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-col :span="16">
            <div class="add-row">
              <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
            </div>
            <el-table :data="form.price_grade" style="width: 100%" border>
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column :label="$t('单位续重') + localization.weight_unit">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.start"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.price_grade)"
                    class="btn-light-red"
                    >{{ $t('移除') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
      </div>
      <!-- 包裹重量向上取值 -->
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>{{ $t('包裹重量向上取值') }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  $t('例如包裹重量1.1kg,向上取整0.5，就会变成1.5kg。向上取整1，就会变成2kg。')
                "
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
            <el-select
              v-model="form.weight_rise"
              filterable
              class="country-select"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="(item, index) in priceData"
                :key="index"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>{{ $t('订单多箱打包重量向上取值') }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('订单多箱打包时，每个打包箱重量分别上浮，而不是整个上浮。')"
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
            <el-select
              v-model="form.multi_boxes_ceil"
              filterable
              class="country-select"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="(item, index) in priceData"
                :key="index"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 开启体积重 -->
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>{{ $t('开启体积重') }}</span>
              <!-- <el-tooltip
                class="item"
                effect="dark"
                :content="$t('仅对多箱出库时生效，关闭按统一的重量计算价格。')"
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip> -->
            </div>
            <el-switch
              v-model="form.multi_boxes"
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
    <!-- 计重配置 -->
    <el-dialog title="抛货配置" :visible.sync="dialogVisible" width="55%">
      <el-form ref="throwFrom" :model="throwFrom" label-width="20px">
        <el-form-item>
          <div>
            <span>{{ $t('抛货方式') }}</span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('全抛：实际重量与体积重量两者取大。半抛：（实际重量+体积重量）/2')"
              placement="top"
            >
              <span class="el-icon-question icon-info"></span>
            </el-tooltip>
          </div>
          <el-switch
            v-model="throwFrom.is_avg_weight"
            :active-text="$t('半抛')"
            :active-value="1"
            :inactive-value="0"
            :inactive-text="$t('全抛')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <div>
            <span>{{ $t('免抛条件') }}</span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('在满足免抛条件情况下，不考虑体积重，仅以实重计费')"
              placement="top"
            >
              <span class="el-icon-question icon-info"></span>
            </el-tooltip>
          </div>
          <el-row :gutter="20">
            <el-col :span="1">
              <el-checkbox v-model="throwFrom.checked"></el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-select v-model="throwFrom.type" :placeholder="$t('数据')">
                <el-option
                  v-for="item in paramsOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="throwFrom.condition" :placeholder="$t('条件')">
                <el-option
                  v-for="item in conditionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input v-model="throwFrom.value" :placeholder="$t('请输入限制数值')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('计费价格模式说明')" :visible.sync="dialogDescription">
      <div>
        <h3>1、{{ $t('首重续重模式') }}</h3>
        <div style="padding-left: 20px">
          <span>{{ $t('运费=首费+续重*续费 (超出续重部分按下一续重计费)') }}</span
          ><br />
          <span>{{ $t('例如 若续重为每1kg，7.3KG包裹则按照8KG计费;') }} </span><br />
          <span>{{ $t('若续重为每0.5kg，7.3KG包裹则按7.5KG计费') }}</span>
        </div>
      </div>
      <div>
        <h3>2、{{ $t('阶梯价格模式') }}</h3>
        <div style="padding-left: 20px">
          <span>{{ $t('运费=对应阶梯单价*重量') }}</span
          ><br />
          <span>{{ $t('例如设置为') }}： </span><br />
          <span>{{ $t('阶梯价格:1~5KG 价格10元，') }}</span
          ><br />
          <span>{{ $t(' 5~10kg价格8元，则7.3KG计费为:8*7.3') }}</span>
        </div>
      </div>
      <div>
        <h3>3、{{ $t('单位价格+阶梯总价模式') }}</h3>
        <div style="padding-left: 20px">
          <span>{{ $t('运费=单位价格*重量+对应阶梯价格') }}</span
          ><br />
          <span>{{ $t('例如设置为') }}：</span><br />
          <span>{{ $t('单位价格:5元') }}</span
          ><br />
          <span>{{ $t('阶梯价格:1~5KG 价格100元') }}</span
          ><br />
          <span>{{ $t(' 5~10kg价格180元，则7KG计费为:5*7+180') }}</span
          ><br />
        </div>
      </div>
      <div>
        <h3>4、{{ $t('多级续重模式') }}</h3>
        <div style="padding-left: 20px">
          <span>{{ $t('运费=首费+续重*续费（可设置多级续重模式') }}</span
          ><br />
          <span>{{ $t('例如设置为') }}：</span><br />
          <span>{{ $t('首重 5元/KG') }}</span
          ><br />
          <span>{{ $t('续重一：4元/1KG') }}</span
          ><br />
          <span>{{ $t('续重二：3元/0.5KG') }}</span
          ><br />
          <span>{{ $t('则1.4KG收费为5+3') }}</span
          ><br />
          <span>{{ $t('1.7KG收费为5+4') }}</span
          ><br />
          <span>{{ $t('2.3KG收费为5+4*1+3') }}</span
          ><br />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'lineAddEdit',
  data() {
    return {
      // is_avg_weight: 0,
      form: {
        name: '',
        countries: '',
        first_weight: '',
        first_money: '',
        first_cost_money: '',
        next_cost_money: '',
        next_weight: '',
        next_money: '',
        max_weight: '',
        min_weight: '',
        mode: '',
        weight_rise: '',
        multi_box_min_weight: '',
        multi_boxes_ceil: '',
        remark: '',
        clearance_code_remark: '',
        multi_boxes: 0,
        default_pickup_station_id: '',
        price_grade: []
      },
      dialogDescription: false,
      referenceTime: {
        minTime: '',
        maxTime: '',
        symbol: '工作日'
      },
      value: [],
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
        },
        {
          id: 4,
          name: this.$t('多级续重模式')
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
      localization: {},
      warehouseIds: [], // 保存支持仓库的id
      imgVisible: false,
      imgSrc: '',
      itemArr: {},
      setVisible: false,
      dialogVisible: false,
      throwFrom: {
        is_avg_weight: 0,
        type: '',
        value: '',
        checked: '',
        condition: ''
      },
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
      pickList: []
    }
  },
  created() {
    const add = localStorage.getItem('add')
    console.log(add, 'add')
    if (add) {
      this.form = {
        name: '',
        countries: '',
        first_weight: '',
        first_money: '',
        first_cost_money: '',
        next_cost_money: '',
        next_weight: '',
        next_money: '',
        max_weight: '',
        // is_avg_weight: 0,
        min_weight: '',
        mode: '',
        weight_rise: '',
        multi_box_min_weight: '',
        remark: '',
        clearance_code_remark: '',
        multi_boxes: 0,
        default_pickup_station_id: '',
        price_grade: []
      }
    }
    if (this.$route.params.id) {
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
    goIntroduction() {
      this.dialogDescription = true
    },
    // 编辑时拉取的数据
    getList() {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        // const warehouses = res.data.warehouses.map(item => item.id)
        this.form = res.data
        this.localization = res.localization
        this.form.countries = res.data.countries.map(item => item.id)
        // this.form.is_avg_weight = res.data.is_avg_weight
        this.throwFrom.is_avg_weight = res.data.is_avg_weight
        if (res.data.no_throw_condition) {
          this.throwFrom.type = res.data.no_throw_condition.type
          this.throwFrom.value = res.data.no_throw_condition.value
          this.throwFrom.checked = Boolean(res.data.no_throw_condition.checked)
          this.throwFrom.condition = res.data.no_throw_condition.condition
        }
        // this.supportWarehouse(warehouses)
      })
    },
    onSelectChange(e) {
      console.log(e)
      this.icon = this.iconList.find(item => item.id === e)
      // console.log(this.form.icon)
    },
    // supportWarehouse(item) {
    //   this.warehouseIds = item
    //   if (this.warehouseIds) {
    //     this.searchCountry()
    //   }
    // },
    // 配置
    set() {
      this.dialogVisible = true
      // if (this.$route.params.id && this.form.no_throw_condition) {
      // }
    },
    confirm() {
      this.dialogVisible = false
      console.log(this.throwFrom, 'throwFrom')
    },
    // 跳转到增加icon
    addIcon() {
      this.$router.push({ name: 'IconAdd' })
    },
    // 新增行
    addRow() {
      console.log(this.form.price_grade, 'this.form.price_grade')
      this.form.price_grade.push({
        start: '',
        end: '',
        cost_price: '',
        sale_price: ''
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    saveLine() {
      console.log(this.form.mode, 'mode')
      if (this.form.price_grade.length) {
        this.itemArr = JSON.stringify(this.form.price_grade)
      }
      console.log(this.itemArr, 'this.itemArr')
      if (this.form.mode === 2 && this.itemArr === '') {
        this.$message.error('不能为空')
      }
      if (this.form.name === '') {
        return this.$message.error(this.$t('请输入线路名称'))
      } else if (this.form.countries === '') {
        return this.$message.error(this.$t('请选择支持国家或地区'))
      } else if (this.form.mode === 1 && this.form.first_weight === '') {
        return this.$message.error(this.$t('请输入首重'))
      } else if (this.form.mode === 1 && this.form.first_money === '') {
        return this.$message.error(this.$t('请输入首费'))
      } else if (this.form.mode === 1 && this.form.next_weight === '') {
        return this.$message.error(this.$t('请输入续重'))
      } else if (this.form.mode === 1 && this.form.next_money === '') {
        return this.$message.error(this.$t('请输入续费'))
      } else if (this.form.mode === 1 && this.form.min_weight === '') {
        return this.$message.error(this.$t('请输入最小重量'))
      } else if (this.form.mode === 1 && this.form.max_weight === '') {
        return this.$message.error(this.$t('请输入最大重量'))
      } else if (this.form.remark === '') {
        return this.$message.error(this.$t('请输入备注'))
      }
      if (this.$route.params.id) {
        // 编辑状态
        if (this.form.mode === 1) {
          delete this.form.price_grade
        }
        this.$request
          .saveEditLine(this.$route.params.id, {
            ...this.form,
            no_throw_condition: {
              type: this.throwFrom.type,
              value: Number(this.throwFrom.value),
              checked: Number(this.throwFrom.checked),
              condition: this.throwFrom.condition
            },
            is_avg_weight: this.throwFrom.is_avg_weight
            // price_grade: this.itemArr,
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              // this.$router.push({ name: 'linelist' })
              this.$router.go(-1)
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      } else {
        if (this.form.mode === 1) {
          delete this.form.price_grade
        }
        // 新建状态
        this.$request
          .updateLines({
            ...this.form,
            no_throw_condition: {
              type: this.throwFrom.type,
              value: Number(this.throwFrom.value),
              checked: Number(this.throwFrom.checked),
              condition: this.throwFrom.condition
            },
            is_avg_weight: this.throwFrom.is_avg_weight
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              // this.$router.push({ name: 'linelist' })
              this.$router.go(-1)
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
.billing-setting-container {
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
  .el-tag.el-tag--info {
    border-color: #3540a5;
    color: #3540a5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540a5;
    background-color: #fff;
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

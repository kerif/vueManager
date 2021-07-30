<template>
  <div class="billing-setting-container">
    <el-form label-position="top" :model="form" ref="form">
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <el-radio @change="changeBase" :label="0" v-model="form.base_mode">{{
              $t('重量计费')
            }}</el-radio>
            <el-radio @change="changeBase" :label="1" v-model="form.base_mode">{{
              $t('体积计费')
            }}</el-radio>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <div>{{ $t('渠道最小') + billingName }}{{ unitName }}</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.min_weight" :placeholder="$t('请输入内容')"></el-input>
            <el-checkbox v-model="form.ceil_weight"
              >{{ $t('包裹重量不足最小，') }}{{ billingName }}{{ $t('时') }}{{ $t('按最小')
              }}{{ billingName }}{{ $t('计算') }}</el-checkbox
            >
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
          <el-col :span="10" v-if="form.base_mode === 0">
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
          <el-col :span="10" v-else>
            <el-select
              v-model="form.mode"
              filterable
              class="country-select"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in volumnData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <div v-if="form.mode === 1 || form.mode === 4">
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <div v-if="form.base_mode === 0 && (form.mode === 1 || form.mode === 4)">
                {{ $t('*首重') + unitName }}
              </div>
              <div v-if="form.base_mode === 1 && form.mode === 1">
                {{ $t('*首费体积') + localization.currency_unit + '/' + unitName }}
              </div>
              <el-input v-model="form.first_weight" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
            <el-col :span="5" v-if="form.mode === 4">
              <div>
                {{ $t('截止重量') + unitName }}
              </div>
              <el-input v-model="form.max_weight" :placeholder="$t('请输入内容')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-col :span="16">
            <div class="add-row">
              <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
            </div>
            <el-table :data="form.grades" style="width: 100%" border>
              <el-table-column
                v-if="form.mode === 1"
                :label="$t('起始') + billingName + unitName + ' >='"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.start" :disabled="!status"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                v-if="form.mode === 1"
                :label="'*' + $t('截止') + billingName + unitName + ' <'"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.end"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('单位续重') + unitName">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.unit_weight"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.grades)"
                    class="btn-light-red"
                    >{{ $t('移除') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item v-if="form.base_mode === 0 && (form.mode === 2 || form.mode === 3)">
          <el-row :gutter="10">
            <el-col :span="5">
              <div>{{ $t('多箱出库最小重量') + unitName }}</div>
              <el-input
                v-model="form.multi_box_min_weight"
                :placeholder="$t('请输入内容')"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <div v-if="form.mode === 2 || form.mode === 3">
        <el-form-item>
          <el-col :span="16">
            <div class="add-row">
              <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
            </div>
            <el-table :data="form.grades" style="width: 100%" border>
              <el-table-column :label="$t('起始') + billingName + unitName">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.start"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="'*' + $t('截止') + billingName + unitName">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.end"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.grades)"
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
              <span>{{ $t('包裹') }}{{ billingName }}{{ $t('向上取值') }}</span>
              <!-- <el-tooltip
                class="item"
                effect="dark"
                :content="
                  $t('例如包裹重量1.1kg,向上取整0.5，就会变成1.5kg。向上取整1，就会变成2kg。')
                "
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip> -->
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
              <span>{{ $t('订单多箱打包') }}{{ billingName }}{{ $t('向上取值') }}</span>
              <!-- <el-tooltip
                class="item"
                effect="dark"
                :content="$t('订单多箱打包时，每个打包箱重量分别上浮，而不是整个上浮。')"
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip> -->
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
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>{{ $t('多箱出库计价方式') }}</span>
              <!-- <el-tooltip
                class="item"
                effect="dark"
                :content="$t('订单多箱打包时，每个打包箱重量分别上浮，而不是整个上浮。')"
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip> -->
            </div>
            <el-select
              v-model="form.multi_boxes"
              filterable
              class="country-select"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in ceilData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 开启体积重 -->
      <el-form-item v-if="form.base_mode === 0">
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>{{ $t('开启体积重') }}</span>
            </div>
            <el-switch
              v-model="form.has_factor"
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
      <el-form-item v-if="form.base_mode === 0 && form.has_factor === 1">
        <div>{{ $t('体积系数') }}</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.factor" :placeholder="$t('请输入内容')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <div v-if="form.base_mode === 0 && form.has_factor === 1">
        <el-form-item>
          <div>*{{ $t('体积模式') }}</div>
          <el-row>
            <el-col :span="10">
              <el-radio :label="0" v-model="form.is_avg_weight">{{ $t('全抛') }}</el-radio
              ><br />
              <span style="padding-left: 20px"
                >{{ $t('计费重量') }}：{{ $t('实际重量与体积重量两者取大') }}</span
              >
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-radio :label="1" v-model="form.is_avg_weight">{{ $t('半抛') }}</el-radio
              ><br />
              <span style="padding-left: 20px"
                >{{ $t('计费重量') }}：{{ $t('(实际重量 + 体积重量）/2') }}</span
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <div>
            {{ $t('免抛条件') }}：<span>{{ $t('达成免抛条件时') }}，{{ $t('不计算体积重') }}</span>
          </div>
          <el-row :gutter="20" style="margin-left: 10px">
            <el-col :span="1">
              {{ form.checked }}
              <el-checkbox v-model="form.checked"></el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-select v-model="form.type" :placeholder="$t('数据')">
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
              <el-select v-model="form.condition" :placeholder="$t('条件')">
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
              <el-input v-model="form.value" :placeholder="$t('请输入限制数值')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
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
        factor: '',
        base_mode: '',
        min_weight: '',
        ceil_weight: '',
        first_weight: '',
        first_money: '',
        first_cost_money: '',
        max_weight: '',
        is_avg_weight: 0,
        type: '',
        value: '',
        checked: '',
        condition: '',
        multi_boxes_ceil: '',
        mode: '',
        weight_rise: '',
        multi_box_min_weight: '',
        remark: '',
        clearance_code_remark: '',
        multi_boxes: 0,
        grades: [],
        has_factor: 0
      },
      dialogDescription: false,
      value: [],
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
          name: this.$t('首重单位+阶梯价格模式')
        },
        {
          id: 4,
          name: this.$t('多级续重模式')
        }
      ],
      volumnData: [
        {
          id: 1,
          name: this.$t('首重续重模式')
        },
        {
          id: 2,
          name: this.$t('阶梯价格模式')
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
      ceilData: [
        {
          id: 0,
          name: `${this.$t('不开启多箱计价(按总重量/体积计算价格)')}`
        },
        {
          id: 1,
          name: `${this.$t('多箱单独计算计费(重量/体积相加后计算价格)')}`
        },
        {
          id: 2,
          name: this.$t('多箱单独计算价格后，相加为总价')
        }
      ],
      localization: {},
      imgVisible: false,
      imgSrc: '',
      itemArr: {},
      setVisible: false,
      dialogVisible: false,
      status: true,
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
      billingName: 0,
      unitName: ''
    }
  },
  watch: {
    'form.base_mode': function (val) {
      console.log(val, 'val')
      this.billingName = val === 0 ? this.$t('重量') : this.$t('体积')
      this.unitName = val === 0 ? this.localization.weight_unit : this.$t('(立方)')
      console.log(this.billingName, 'this.billingName')
      console.log(this.unitName, 'this.unitName')
    }
  },
  created() {
    const add = localStorage.getItem('add')
    console.log(add, 'add')
    if (add) {
      this.form = {
        factor: '',
        base_mode: '',
        min_weight: '',
        ceil_weight: '',
        first_weight: '',
        first_money: '',
        first_cost_money: '',
        max_weight: '',
        is_avg_weight: 0,
        type: '',
        value: '',
        checked: '',
        condition: '',
        multi_boxes_ceil: '',
        mode: '',
        weight_rise: '',
        multi_box_min_weight: '',
        remark: '',
        clearance_code_remark: '',
        multi_boxes: 0,
        has_factor: 0,
        grades: []
      }
    }
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    goIntroduction() {
      this.dialogDescription = true
    },
    // 编辑时拉取的数据
    getList() {
      this.$request.getBillingConfig(this.$route.params.id).then(res => {
        this.localization = res.localization
        this.form.mode = res.data.mode
        this.form.base_mode = res.data.base_mode
        this.form.has_factor = res.data.has_factor
        this.form.multi_boxes = res.data.multi_boxes
        this.form.weight_rise = res.data.weight_rise
        this.form.min_weight = res.data.min_weight
        this.form.ceil_weight = Boolean(res.data.ceil_weight)
        this.form.factor = res.data.factor
        this.form.max_weight = res.data.max_weight
        this.form.grades = res.data.grades
        this.form.multi_boxes_ceil = res.data.multi_boxes_ceil
        this.form.first_weight = res.data.first_weight
        this.form.is_avg_weight = res.data.is_avg_weight
        if (res.data.no_throw_condition) {
          console.log(res.data.no_throw_condition.checked, 'res.data.no_throw_condition.checked')
          this.form.type = res.data.no_throw_condition.type
          this.form.value = res.data.no_throw_condition.value
          this.form.checked = Boolean(res.data.no_throw_condition.checked)
          this.form.condition = res.data.no_throw_condition.condition
        }
      })
    },
    changeBase() {
      this.form.mode = ''
    },
    onSelectChange(e) {
      console.log(e)
      this.icon = this.iconList.find(item => item.id === e)
    },
    confirm() {
      this.dialogVisible = false
      console.log(this.form, 'form')
    },
    // 跳转到增加icon
    addIcon() {
      this.$router.push({ name: 'IconAdd' })
    },
    // 新增行
    addRow() {
      console.log(this.form.grades, 'this.form.grades')
      this.form.grades.push({
        start: '',
        end: '',
        unit_weight: ''
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    saveLine() {
      console.log(this.form.mode, 'mode')
      if (this.form.grades.length) {
        this.itemArr = JSON.stringify(this.form.grades)
      }
      console.log(this.itemArr, 'this.itemArr')
      if (this.form.mode === 2 && this.itemArr === '') {
        this.$message.error('不能为空')
      }
      if (this.form.mode === 1 && this.form.first_weight === '') {
        return this.$message.error(this.$t('请输入首重'))
      }
      if (this.$route.params.id) {
        // 编辑状态
        this.$request
          .updateBillingConfig(this.$route.params.id, {
            ...this.form,
            ceil_weight: Number(this.form.ceil_weight),
            no_throw_condition: {
              type: this.form.type,
              value: Number(this.form.value),
              checked: Number(this.form.checked),
              condition: this.form.condition
            }
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

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
              >{{ $t('包裹重量不足最小') }}{{ billingName }}{{ $t('时') }}{{ $t('按最小')
              }}{{ billingName }}{{ $t('计算') }}</el-checkbox
            >
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 计费价格模式 -->
      <el-form-item>
        <div>
          {{ $t('计费价格模式')
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
                {{ $t('首费体积') + localization.currency_unit + '/' + unitName }}
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
          <el-row :gutter="10">
            <el-col :span="16">
              <div class="remark">{{ $t('注意修改计费重量后对应的价格表要重新设置') }}</div>
              <div class="add-row">
                <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
              </div>
              <el-table :data="form.grades" style="width: 100%" border>
                <el-table-column
                  v-if="form.mode === 1"
                  :label="$t('起始') + billingName + unitName + ' >='"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-if="form.mode === 1 && scope.$index === 0"
                      v-model="form.first_weight"
                      :disabled="form.mode === 1 && scope.$index === 0"
                    ></el-input>
                    <el-input v-else v-model="scope.row.start"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="form.mode === 1"
                  :label="'*' + $t('截止') + billingName + unitName + ' <'"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.end" @input="inputEnd(scope)"></el-input>
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
                    <el-button @click="insert(scope.$index, form.grades)" class="btn-deep-blue">{{
                      $t('插入')
                    }}</el-button>
                    <el-button
                      v-if="scope.$index === form.grades.length - 1"
                      @click="addRow"
                      class="btn-deep-purple"
                      >{{ $t('新增') }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
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
      <!-- 开闭区间 -->
      <p v-if="form.mode === 2 || form.mode === 5">
        <span>{{ $t('开闭区间选择') }}</span>
        <el-tooltip
          style="color: #7bc764; padding: 0 20px 0 5px"
          effect="dark"
          :content="
            $t(
              '例：如果设置10~50区间，左闭右开为[10,50)“大于等于10且小于50”，左开右闭为(10,50]“大于10且小于等于50”'
            )
          "
          placement="top-end"
        >
          <i class="el-icon-info"></i>
        </el-tooltip>
        <el-radio v-model="form.range" :label="0">{{ $t('左闭右开') }}</el-radio>
        <el-radio v-model="form.range" :label="1">{{ $t('左开右闭') }}</el-radio>
      </p>
      <div v-if="form.mode === 2 || form.mode === 3">
        <el-form-item>
          <el-row>
            <el-col :span="16">
              <div class="remark">{{ $t('注意修改计费重量后对应的价格表要重新设置') }}</div>
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
                    <el-button @click="insert(scope.$index, form.grades)" class="btn-deep-blue">{{
                      $t('插入')
                    }}</el-button>
                    <el-button
                      v-if="scope.$index === form.grades.length - 1"
                      @click="addRow"
                      class="btn-deep-purple"
                      >{{ $t('新增') }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <div v-if="form.mode === 5">
        <el-form-item>
          <el-row>
            <el-col :span="18">
              <div class="remark">{{ $t('注意修改计费重量后对应的价格表要重新设置') }}</div>
              <div class="add-row">
                <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
              </div>
              <el-table :data="form.grades" style="width: 100%" border>
                <el-table-column :label="$t('起始') + billingName + unitName + ' >='">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="'*' + $t('截止') + billingName + unitName + ' <'">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.end"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('首重') + unitName">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.first_weight"></el-input>
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
                    <el-button @click="insert(scope.$index, form.grades)" class="btn-deep-blue">{{
                      $t('插入')
                    }}</el-button>
                    <el-button
                      v-if="scope.$index === form.grades.length - 1"
                      @click="addRow"
                      class="btn-deep-purple"
                      >{{ $t('新增') }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
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
      <!-- 包裹重量向上取值 -->
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>{{ $t('订单单箱打包') }}{{ billingName }}{{ $t('向上取值') }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                v-if="form.base_mode === 0"
                :content="
                  $t(
                    '假设包裹出库称重2.3，向上取值设置0.5，就是按照2.5计费，向上取值1，就是按3收费'
                  )
                "
                placement="top-start"
              >
                <i class="el-icon-question explain-icon"></i>
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
              <span>{{ $t('订单多箱打包') }}{{ billingName }}{{ $t('向上取值') }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                v-if="form.base_mode === 0"
                :content="
                  $t(
                    '假设包裹出库称重2.3，向上取值设置0.5，就是按照2.5计费，向上取值1，就是按3收费'
                  )
                "
                placement="top-start"
              >
                <i class="el-icon-question explain-icon"></i>
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
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>
              <span>{{ $t('多箱出库计价方式') }}</span>
            </div>
            <el-select
              v-model="form.multi_boxes"
              filterable
              class="country-select"
              popper-class="billing-select"
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
      <el-form-item v-if="form.base_mode !== 0">
        <el-row>
          <el-col :span="10">
            <div>
              <span>{{ $t('开启超重换算') }}</span>
              <el-tooltip
                style="color: #7bc764; padding: 0 20px 0 5px"
                effect="dark"
                :content="$t('开启超重换算时，可考虑超重订单比大计费，如果超过会进行计费换算')"
                placement="top-end"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <el-switch
              v-model="form.weight_trans"
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
      <el-form-item v-if="form.weight_trans === 1 && form.base_mode !== 0">
        <el-row>
          <el-col :span="10">
            <div>
              <span>{{ $t('重量系数') }}</span>
              <el-tooltip
                style="color: #7bc764; padding: 0 20px 0 5px"
                effect="dark"
                :content="
                  $t(`计算方式：超重体积=实重/重量系数。当•1超重体积一大于“出库体积”时，以超垂体积计费。
【例：设置重量系数为500,则当一个订单出库体积为2立方米”，但出库实更为“1800KG-时，超重体积为1800/500=3.6立方米。此时超垂体积大于出库体积，以超重体积3.6立方米计费】`)
                "
                placement="top-end"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <el-input v-model="form.weight_factor" :placeholder="$t('请输入内容')"></el-input>
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
              ><span style="padding-left: 20px">{{ $t('体积重大于实重时生效') }}</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <div>
            {{ $t('免抛条件') }}：<span>{{ $t('达成免抛条件时') }}，{{ $t('不计算体积重') }}</span>
          </div>
          <el-row :gutter="20" style="margin-left: 10px">
            <el-col :span="1">
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
              <div class="unit">
                <el-input v-model="form.value" :placeholder="$t('请输入限制数值')"></el-input>
                <span>{{ localization ? localization.length_unit : '' }}</span>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <div style="red">
            {{
              $t(
                '注: “单边边长”指只要有一边达成条件, 则免抛 “所有边长”指长宽三边全部达成条件, 则免抛'
              )
            }}
          </div>
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
    <el-dialog
      :title="$t('计费价格模式说明')"
      :visible.sync="dialogDescription"
      class="billing-settings-dialog dialog-container"
      width="50%"
    >
      <div>
        <h3>【{{ $t('价格配置方式') }}】</h3>
        <div>{{ $t('价格设置需再在三个选项卡中配置') }}:</div>
        <div>1、{{ $t('计费设置页面配置计费类型与首重续重重量阶梯等基础数据') }}</div>
        <div>2、{{ $t('分区表中设置不同区域分组') }}</div>
        <div>3、{{ $t('在12步骤完成后系统生成空白价格表在价格表中配置具体价格') }}</div>
        <img src="../../../assets/table1.png" />
      </div>
      <div>
        <h3>【{{ $t('计费维度') }}】</h3>
        <div>
          {{
            $t(
              '系统计费维度分为“重量计费“与”体积计费“，重量计费包含考虑体积重量的”全抛“与”半抛“模式；体积计费则根据包裹长宽高（cm）自动换算体积（立方米），以体积计算价格。'
            )
          }}
        </div>
      </div>
      <div>
        <h3>【{{ $t('计费模式') }}】</h3>
        <h4>a) {{ $t('首重续重模式') }}</h4>
        <div>{{ $t('例生成价格表样式如下时') }}:</div>
        <img src="../../../assets/table2.png" />
        <div>{{ $t('计算方式以分区一为例') }}:</div>
        <div>0～5KG：{{ $t('总价') }}50</div>
        <div>
          5～10KG：{{ $t('首费') }}50+（{{ $t('总重量') }}-{{ $t('首重') }}5KG）*
          {{ $t('续单价') }}18/KG
        </div>
        <div>
          10～100KG：{{ $t('首费') }}50+ {{ $t('续费') }}5 * 18 +（{{ $t('总重量') }}-10）*
          {{ $t('续单价') }}15/KG
        </div>
        <div>
          100～999KG：{{ $t('首费') }}50+ {{ $t('续费') }}5 * 18 + {{ $t('续费') }}90 * 15 + （{{
            $t('总重量')
          }}-100）/5 * 35
        </div>
        <div>{{ $t('注灰色部分向上取整') }}</div>
        <h4>b) {{ $t('阶梯价格模式') }}</h4>
        <div>{{ $t('例生成价格表样式如下时') }}:</div>
        <img src="../../../assets/table3.png" />
        <div>
          {{ $t('计算方式重量处于哪一个区间即采用该区间对应的基价单价计算费用') }}
        </div>
        <div>{{ $t('总费用= 基价 + 总重量 * 该区间单价') }}</div>
        <h4>c) {{ $t('多级续重模式') }}</h4>
        <div>{{ $t('例生成价格表样式如下时') }}:</div>
        <img src="../../../assets/table4.png" />
        <div>{{ $t('计算方式') }}：</div>
        <div>
          {{ $t('假设计费重量为') }}5.8KG，{{ $t('首重') }}5，{{ $t('续重') }}0.8，{{
            $t('大于')
          }}0.5{{ $t('不足') }}1，{{ $t('计费为首费') }}50 + 8
        </div>
        <div>
          {{ $t('假设计费重量为') }}5.4KG，{{ $t('首重') }}5，{{ $t('续重') }}0.5，{{
            $t('大于')
          }}0.3{{ $t('不足') }}0.5，{{ $t('计费为首费') }}50 + 5
        </div>
        <div>
          {{ $t('假设计费重量为') }}5.2KG，{{ $t('首重') }}5，{{ $t('续重') }}0.2，{{
            $t('不足')
          }}0.3，{{ $t('计费为首费') }}50 + 4元
        </div>
        <h4>d) {{ $t('阶梯首重续重模式') }}</h4>
        <div>{{ $t('例生成价格表样式如下时') }}:</div>
        <img src="../../../assets/table5.png" />
        <div>
          {{ $t('计算方式重量处于哪一个区间即采用该区间对应的首费续单价计算费用') }}
        </div>
        <div>
          {{ $t('总费用') }} = {{ $t('首费') }} + （{{ $t('总重量') }}-{{ $t('首重') }}） *
          {{ $t('该区间续单价') }}
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
        weight_factor: '',
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
        weight_trans: 0,
        has_factor: 0,
        range: 0
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
          id: 4,
          name: this.$t('多级续重模式')
        },
        {
          id: 5,
          name: this.$t('阶梯首重续重模式')
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
        },
        {
          id: 5,
          name: this.$t('阶梯首重续重模式')
        }
      ],
      priceData: [
        {
          name: 0
        },
        {
          name: 0.1
        },
        {
          name: 0.2
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
          name: `${this.$t('不开启多箱计价按总重量体积计算价格')}`
        },
        {
          id: 2,
          name: `${this.$t('多箱单独计算计费重量重量体积相加后计算价格')}`
        },
        {
          id: 1,
          name: this.$t('多箱单独计算价格后相加为总价')
        }
      ],
      localization: {},
      imgVisible: false,
      imgSrc: '',
      itemArr: {},
      dialogVisible: false,
      status: true,
      weight_factor: '',
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
        },
        {
          id: 4,
          name: this.$t('长宽高乘积')
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
      this.unitName = val === 0 ? this.localization.weight_unit : this.$t('立方')
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
        this.form.range = res.data.range
        this.form.weight_trans = res.data.weight_trans
        this.form.weight_factor = res.data.weight_factor
        this.weight_factor = res.data.weight_factor
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
    // 插入行
    insert(index, arr) {
      arr.splice(index, 0, {
        start: '',
        end: '',
        unit_weight: ''
      })
    },
    // 新增行
    addRow() {
      if (this.form.mode === 1 || this.form.mode === 2 || this.form.mode === 5) {
        if (this.form.grades.length && this.form.grades[this.form.grades.length - 1].end) {
          this.form.grades.push({
            start: this.form.grades[this.form.grades.length - 1].end,
            end: '',
            unit_weight: ''
          })
        } else {
          this.form.grades.push({
            start: '',
            end: '',
            unit_weight: ''
          })
        }
      } else {
        this.form.grades.push({
          start: '',
          end: '',
          unit_weight: ''
        })
      }
    },
    inputEnd(scope) {
      if (this.form.mode === 1 || this.form.mode === 2 || this.form.mode === 5) {
        if (
          this.form.grades.length - 1 > scope.$index &&
          scope.$index !== this.form.grades.length - 1
        ) {
          this.form.grades[scope.$index + 1].start = this.form.grades[scope.$index].end
        }
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    saveLine() {
      if (this.form.mode === 1 && this.form.grades.length) {
        this.form.grades[0].start = this.form.first_weight
        this.itemArr = JSON.stringify(this.form.grades)
      }
      if (this.form.mode === 2 && this.itemArr === '') {
        this.$message.error('不能为空')
      }
      if (this.form.mode === 1 && this.form.first_weight === '')
        return this.$message.error(this.$t('请输入首重'))
      this.form.grades.forEach(item => {
        if (!item.first_weight) {
          item.first_weight = 0
        }
      })
      if (this.form.mode !== 2) {
        let flag = this.form.grades.some(item => {
          return !item.unit_weight
        })
        if (flag) return this.$message.error(this.$t('单位续重不能为空或为0'))
      }
      if (this.$route.params.id) {
        // 编辑状态
        let checkStatus = this.form.checked ? Number(this.form.checked) : ''
        // delete this.form.checked
        this.$request
          .updateBillingConfig(this.$route.params.id, {
            ...this.form,
            ceil_weight: Number(this.form.ceil_weight),
            no_throw_condition: {
              type: this.form.type,
              value: Number(this.form.value),
              checked: checkStatus,
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
  .billing-settings-dialog {
    img {
      max-width: 100%;
    }
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
  .remark {
    float: left;
    color: red;
  }
  .unit {
    display: flex;
  }
}
.billing-select {
  .el-select-dropdown__item {
    width: 100%;
    overflow: auto;
  }
}
.explain-icon {
  position: relative;
  top: 2px;
  margin-left: 5px;
  font-size: 16px;
  color: #74b34f;
}
</style>

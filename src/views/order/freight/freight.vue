<template>
  <div class="freight-container">
    <div class="freight-total">
      <div class="freight-left">
        <el-form label-position="top">
          <el-form-item :label="`*${$t('收货国家')}`">
            <el-cascader
              v-model="selectId"
              :options="countryList"
              filterable
              :props="{ checkStrictly: true }"
              @change="onCountryChange"
              clearable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="`*${$t('邮编')}`">
            <el-input :placeholder="$t('请输入邮编')" v-model="queryInfo.postcode"></el-input>
          </el-form-item>
          <el-form-item :label="`*${$t('寄往仓库')}`">
            <el-select
              v-model="queryInfo.warehouse_id"
              :placeholder="$t('请选择寄往仓库')"
              class="long-item"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.warehouse_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`*${$t('物品重量')}`">
            <el-input
              :placeholder="$t('请输入实际重量')"
              v-model="queryInfo.weight"
              type="number"
            ></el-input>
          </el-form-item>
          <!-- 物品属性 -->
          <el-form-item :label="`*${$t('物品属性')}`">
            <el-select
              v-model="queryInfo.prop_ids"
              multiple
              :placeholder="$t('请选择物品属性')"
              class="long-item"
            >
              <el-option
                v-for="item in propList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('包裹尺寸选填')">
            <el-input
              :placeholder="$t('长')"
              type="number"
              class="short-item"
              v-model="queryInfo.length"
            ></el-input>
            <el-input
              :placeholder="$t('宽')"
              type="number"
              class="short-item"
              v-model="queryInfo.width"
            ></el-input>
            <el-input
              :placeholder="$t('高')"
              type="number"
              class="short-item"
              v-model="queryInfo.height"
            ></el-input>
            <div class="calc-info">
              {{ $t('包裹尺寸为商品打包后实际包裹箱的长宽高用于某些体积重量的线路运费计算') }}
            </div>
          </el-form-item>
        </el-form>
        <el-button
          class="second-btn long-item"
          @click="onResult"
          :loading="$store.state.btnLoading"
          >{{ $t('立即查询') }}</el-button
        >
      </div>
      <div class="freight-right">
        <div class="right-text">{{ $t('查询结果') }}</div>
        <div class="none-box" v-show="isEmpty">
          <img src="../../../assets/wu.png" />
          <div class="right-text">{{ $t('您可以在这里估算运费请在左边输入相关参数') }}!</div>
        </div>
        <div class="result-list">
          <div
            class="result-item is-click"
            v-for="(item, index) in lineList"
            :key="item.id"
            @click="onDetail(item)"
          >
            <img :src="$baseUrl.IMAGE_URL + item.icon.icon" class="result-item_icon" />
            <div class="result-item_content">
              <div class="small-size">{{ item.name }}</div>
              <div>
                {{ $t('运费') }}：{{ localization.currency_unit
                }}{{ item.expire_fee | formatPrice }}
              </div>
              <div>{{ $t('运送时效') }}：{{ item.region.reference_time }}</div>
              <div>
                {{ $t('计费重量') }}：{{ item.count_weight | formatWeight }}
                {{ localization.weight_unit }}
              </div>
            </div>
            <div class="result-item_index">{{ index + 1 }}</div>
            <span class="el-icon-caret-right icon-detail"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatFilter } from '@/mixin'
export default {
  name: 'freight',
  data() {
    return {
      isEmpty: true,
      queryInfo: {
        country_id: '',
        area_id: '',
        sub_area_id: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        warehouse_id: '',
        postcode: '',
        prop_ids: []
      },
      countryList: [],
      selectId: [],
      lineList: [],
      warehouseList: [],
      propList: [],
      localization: {}
    }
  },
  created() {
    this.getCountrys()
    this.getProps()
    this.onCountryChange(false)
  },
  mixins: [formatFilter],
  methods: {
    // 国家列表
    getCountrys() {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
          this.countryList = res.data.map(item => {
            return {
              value: item.id,
              label: item.name,
              children: item.areas.length
                ? item.areas.map(item2 => {
                    return {
                      value: item2.id,
                      label: item2.name,
                      children: item2.areas.length
                        ? item2.areas.map(item3 => {
                            return {
                              value: item3.id,
                              label: item3.name
                            }
                          })
                        : []
                    }
                  })
                : []
            }
          })
        }
      })
    },
    // 物品属性列表
    getProps() {
      this.$request.getPackage().then(res => {
        if (res.ret) {
          this.propList = res.data
          this.localization = res.localization
        }
      })
    },
    // 根据所选国家拉取寄往仓库地址
    onCountryChange() {
      this.queryInfo.country_id = this.selectId[0]
      this.queryInfo.area_id = this.selectId[1] || ''
      this.queryInfo.sub_area_id = this.selectId[2] || ''
      this.$request.getExpressFee({ country_id: this.queryInfo.country_id }).then(res => {
        if (res.ret) {
          this.warehouseList = res.data
          this.queryInfo.warehouse_id = res.data[0].id
        }
      })
    },
    // 计算结果
    onResult() {
      let msg = ''
      if (!this.queryInfo.country_id) {
        msg = this.$t('请选择国家或地区')
      } else if (!this.queryInfo.weight) {
        msg = this.$t('请输入重量')
      } else if (!this.queryInfo.prop_ids.length) {
        msg = this.$t('请选择物品属性')
      }
      if (msg) {
        return this.$message.error(msg)
      }
      this.isEmpty && (this.isEmpty = false)
      this.$request
        .queryExpress({
          ...this.queryInfo,
          weight: Number(this.queryInfo.weight) * 1000
        })
        .then(res => {
          if (res.ret) {
            this.lineList = res.data
            if (!res.data.length) {
              this.$message.error(this.$t('暂无符合条件的路线'))
              this.isEmpty = true
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 路线详情
    onDetail(item) {
      this.$router.push({
        path: '/order/freight/detail/:id',
        name: 'freightDetail',
        params: { id: item.id },
        query: { region: JSON.stringify(item) }
      })
    }
  }
}
</script>
<style lang="scss" scope>
// @import '@/styles/variable.scss';
.freight-container {
  font-size: 0;
  .freight-total {
    background-color: #fff !important;
  }
  .freight-left,
  .freight-right {
    display: inline-block;
    font-size: 14px;
    box-sizing: border-box;
    vertical-align: top;
    padding: 20px;
  }
  .freight-left {
    width: 350px;
  }
  .freight-right {
    padding: 20px 40px;
    width: calc(100% - 350px);
    min-height: calc(100vh - 60px);
    border-left: 15px solid #f0f0f0;
  }
  .short-item {
    width: 88px;
    display: inline-block;
    &:not(:last-child) {
      margin-right: 15px;
    }
  }
  .long-item {
    width: 100%;
  }
  .result-item-title {
    background-color: #74b34f;
    padding: 10px 15px;
    color: #fff;
    text-align: right;
    cursor: pointer;
  }
  .result-item_content {
    display: inline-block;
    vertical-align: top;
    line-height: 25px;
    font-size: 12px;
    margin-left: 15px;
    width: calc(100% - 110px);
  }
  .result-item_icon {
    width: 80px;
    height: 80px;
  }
  .result-item_index,
  .icon-detail {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #cdcdcd;
  }
  .result-item_index {
    left: -20px;
  }
  .icon-detail {
    right: 15px;
    font-size: 18px;
  }
  .result-item {
    cursor: pointer;
    margin-bottom: 20px;
    border: 1px solid #f3f3f3;
    padding: 20px;
    position: relative;
  }
  .result-item:hover {
    background-color: #f8f8f8;
  }
  .right-text {
    line-height: 40px;
  }
  .none-box {
    text-align: center;
    color: #c8c8c8;
    margin-top: 100px;
  }
  .calc-info {
    color: #c8c8c8;
    line-height: 20px;
    margin-top: 10px;
  }
}
</style>

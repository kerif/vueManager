<template>
  <div class="freight-container">
    <div class="freight-total">
      <!--      <div class="freight-left">-->
      <!--        <el-form label-position="top">-->
      <!--          <el-form-item :label="`*${$t('收货国家')}`">-->
      <!--            <el-cascader-->
      <!--              v-model="selectId"-->
      <!--              :options="countryList"-->
      <!--              filterable-->
      <!--              :props="{ checkStrictly: true }"-->
      <!--              @change="onCountryChange"-->
      <!--              clearable-->
      <!--              style="width: 100%"-->
      <!--            ></el-cascader>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item :label="`*${$t('邮编')}`">-->
      <!--            <el-input :placeholder="$t('请输入邮编')" v-model="queryInfo.postcode"></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item :label="`*${$t('寄往仓库')}`">-->
      <!--            <el-select-->
      <!--              v-model="queryInfo.warehouse_id"-->
      <!--              :placeholder="$t('请选择寄往仓库')"-->
      <!--              class="long-item"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for="item in warehouseList"-->
      <!--                :key="item.id"-->
      <!--                :label="item.warehouse_name"-->
      <!--                :value="item.id"-->
      <!--              >-->
      <!--              </el-option>-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item :label="`*${$t('物品重量')}`">-->
      <!--            <el-input-->
      <!--              :placeholder="$t('请输入实际重量')"-->
      <!--              v-model="queryInfo.weight"-->
      <!--              type="number"-->
      <!--            ></el-input>-->
      <!--          </el-form-item>-->
      <!--          &lt;!&ndash; 物品属性 &ndash;&gt;-->
      <!--          <el-form-item :label="`*${$t('物品属性')}`">-->
      <!--            <el-select-->
      <!--              v-model="queryInfo.prop_ids"-->
      <!--              multiple-->
      <!--              :placeholder="$t('请选择物品属性')"-->
      <!--              class="long-item"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for="item in propList"-->
      <!--                :key="item.id"-->
      <!--                :label="item.name"-->
      <!--                :value="item.id"-->
      <!--              >-->
      <!--              </el-option>-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item :label="$t('包裹尺寸选填')">-->
      <!--            <el-input-->
      <!--              :placeholder="$t('长')"-->
      <!--              type="number"-->
      <!--              class="short-item"-->
      <!--              v-model="queryInfo.length"-->
      <!--            ></el-input>-->
      <!--            <el-input-->
      <!--              :placeholder="$t('宽')"-->
      <!--              type="number"-->
      <!--              class="short-item"-->
      <!--              v-model="queryInfo.width"-->
      <!--            ></el-input>-->
      <!--            <el-input-->
      <!--              :placeholder="$t('高')"-->
      <!--              type="number"-->
      <!--              class="short-item"-->
      <!--              v-model="queryInfo.height"-->
      <!--            ></el-input>-->
      <!--            <div class="calc-info">-->
      <!--              {{ $t('包裹尺寸为商品打包后实际包裹箱的长宽高用于某些体积重量的线路运费计算') }}-->
      <!--            </div>-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--        <el-button-->
      <!--          class="second-btn long-item"-->
      <!--          @click="onResult"-->
      <!--          :loading="$store.state.btnLoading"-->
      <!--          >{{ $t('立即查询') }}</el-button-->
      <!--        >-->
      <!--      </div>-->
      <div class="freight-right">
        <div class="search-box">
          <div>
            <div class="search-left">
              <div class="address">
                <el-cascader
                  v-model="selectId"
                  :options="countryList"
                  filterable
                  :props="{ checkStrictly: true }"
                  @change="onCountryChange"
                  clearable
                  style="width: 200px"
                ></el-cascader>
              </div>
              <div class="warehouse">
                <el-select
                  v-model="queryInfo.warehouse_id"
                  :placeholder="$t('请选择寄往仓库')"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.warehouse_name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="weight">
                <el-input :placeholder="$t('请输入实际重量')" v-model="queryInfo.weight">
                  <template slot="suffix">
                    <div class="tip">{{ localization.weight_unit }}</div>
                  </template>
                </el-input>
              </div>
              <div class="volume">
                <el-input
                  :placeholder="$t('长')"
                  class="short-item length"
                  v-model="queryInfo.length"
                ></el-input>
                <el-input
                  :placeholder="$t('宽')"
                  class="short-item width"
                  v-model="queryInfo.width"
                ></el-input>
                <el-input
                  :placeholder="$t('高')"
                  class="short-item height"
                  v-model="queryInfo.height"
                >
                  <template slot="suffix">
                    <div class="tip">{{ localization.length_unit }}</div>
                  </template>
                </el-input>
              </div>
              <div class="post-code">
                <el-input :placeholder="$t('请输入邮编')" v-model="queryInfo.postcode">
                  <template slot="suffix">
                    <div class="tip">{{ localization.weight_unit }}</div>
                  </template>
                </el-input>
              </div>
            </div>
            <div class="attribute">
              <span>{{ $t('物品属性') }}：</span>
              <el-checkbox-group v-model="queryInfo.prop_ids">
                <el-checkbox v-for="item in propList" :key="item.id" :label="item.id">{{
                  item.name
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="search-right">
            <el-button class="search-btn" @click="onResult" type="primary">查询</el-button>
          </div>
        </div>
        <!--        <div class="right-text">{{ $t('查询结果') }}</div>-->
        <div class="right-button">
          <div class="none-box" v-show="isEmpty">
            <img src="../../../assets/wu.png" />
            <div class="right-text">{{ $t('您可以在这里估算运费请在上边输入相关参数') }}!</div>
          </div>
          <div class="result-list">
            <div
              class="result-item is-click"
              v-for="item in lineList"
              :key="item.id"
              @click="onDetail(item)"
            >
              <div class="result-top">
                <img :src="$baseUrl.IMAGE_URL + item.icon.icon" class="result-item_icon" />
                <!--            <div class="result-item_content">-->
                <!--              <div class="small-size">{{ item.name }}</div>-->
                <!--              <div>-->
                <!--                {{ $t('运费') }}：{{ localization.currency_unit-->
                <!--                }}{{ item.expire_fee | formatPrice }}-->
                <!--              </div>-->
                <!--              <div>{{ $t('运送时效') }}：{{ item.region.reference_time }}</div>-->
                <!--              <div>-->
                <!--                {{ $t('计费重量') }}：{{ item.count_weight | formatWeight }}-->
                <!--                {{ localization.weight_unit }}-->
                <!--              </div>-->
                <!--            </div>-->
                <div class="result-info">
                  <div class="name">{{ item.name }}</div>
                  <div>
                    <span class="tip-span">时效：</span>{{ item.region.reference_time }}个工作日
                  </div>
                  <div>
                    <span class="tip-span">{{ $t('预估费用') }}：</span
                    ><span class="price-span"
                      >{{ localization.currency_unit }}{{ item.expire_fee | formatPrice }}</span
                    >
                  </div>
                </div>
                <!--            <div class="result-item_index">{{ index + 1 }}</div>-->
                <span class="el-icon-caret-right icon-detail"></span>
              </div>
              <div class="result-bottom">
                <div>
                  <span class="tip-span">{{ $t('渠道编码') }}：</span> {{ item.channel_code }}
                </div>
                <div>
                  <span class="prop-span" v-for="prop in item.props" :key="prop.id">{{
                    prop.name
                  }}</span>
                </div>
              </div>
            </div>
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
  height: 100%;
  .freight-total {
    height: 100%;
  }
  .freight-left,
  .freight-right {
    display: inline-block;
    font-size: 14px;
    box-sizing: border-box;
    vertical-align: top;
    display: flex;
    flex-direction: column;
  }
  .freight-left {
    width: 350px;
  }
  .freight-right {
    width: calc(100%);
    height: 100%;
    display: flex;
    flex-direction: column;
    .search-box {
      display: flex;
      justify-content: space-between;
      padding-right: 30px;
      background-color: #fff !important;
      padding: 16px;
      border-radius: 10px;
      .tip {
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-right: 8px;
        height: 100%;
        border-left: none;
      }
      .search-left {
        display: flex;
        gap: 16px;
        .common-select-style {
          position: absolute;
          top: -14px;
          left: 24px;
          z-index: 999;
          color: #3641a3;
          padding: 0 4px 0 3px;
          background-color: #fff;
        }
        .warehouse {
          width: 200px;
          border-radius: 6px;
          position: relative;
          &::before {
            content: '交货区域';
            position: absolute;
            top: -10px;
            left: 24px;
            z-index: 999;
            color: #3641a3;
            padding: 0 4px 0 3px;
            background-color: #fff;
          }
        }
        .address {
          width: 200px;
          border-radius: 6px;
          position: relative;
          &::before {
            content: '目的地';
            position: absolute;
            top: -10px;
            left: 24px;
            z-index: 999;
            color: #3641a3;
            padding: 0 4px 0 3px;
            background-color: #fff;
          }
        }
        .weight {
          width: 200px;
          border-radius: 6px;
          position: relative;
          &::before {
            content: '单箱重量';
            position: absolute;
            top: -10px;
            left: 24px;
            z-index: 999;
            color: #3641a3;
            padding: 0 4px 0 3px;
            background-color: #fff;
          }
        }
        .post-code {
          width: 200px;
          border-radius: 6px;
          position: relative;
          &::before {
            content: '邮编';
            position: absolute;
            top: -10px;
            left: 24px;
            z-index: 999;
            color: #3641a3;
            padding: 0 4px 0 3px;
            background-color: #fff;
          }
        }
        .volume {
          display: flex;
          border-radius: 6px;
          position: relative;
          &::before {
            content: '单箱规格';
            position: absolute;
            top: -10px;
            left: 24px;
            z-index: 999;
            color: #3641a3;
            padding: 0 4px 0 3px;
            background-color: #fff;
          }
          .el-input__inner {
            border-radius: 0;
          }
          .short-item {
            margin-right: 0;
            border-radius: 0;
          }
          .length {
            .el-input__inner {
              border-right-color: white;
              border-top-left-radius: 5px;
              border-bottom-left-radius: 5px;
            }
          }
          .width {
            .el-input__inner {
              border-right: none;
              border-left: none;
            }
          }
          .height {
            width: 150px;
            .el-input__inner {
              border-left-color: white;
              border-top-right-radius: 5px;
              border-bottom-right-radius: 5px;
            }
          }
        }
      }
      .attribute {
        margin-top: 16px;
        display: flex;
        align-items: flex-end;
        span {
          margin-bottom: -2px;
        }
      }
    }
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
  .none-box {
    text-align: center;
    color: #c8c8c8;
    margin-top: 100px;
  }
  .right-button {
    background-color: #ffffff;
    margin-top: 16px;
    padding: 0 16px;
    border-radius: 10px;
    flex: 1;
    overflow-y: auto;
  }
  .result-list {
    margin-top: 20px;

    .result-item {
      cursor: pointer;
      border: 1px solid #dadada;
      margin-bottom: 20px;
      .result-top {
        padding: 10px 10px 10px 10px;
        position: relative;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f3f3f3;
        .result-info {
          flex: 1;
          display: flex;
          justify-content: space-around;
          margin-left: 16px;
          .tip-span {
            color: #c8c8c8;
          }
          .price-span {
            color: red;
            font-weight: bold;
          }
          div {
            flex: 1;
          }
        }
      }
      .result-bottom {
        padding: 10px 10px;
        display: flex;
        justify-content: space-between;
        .tip-span {
          color: #c8c8c8;
        }
        .prop-span {
          color: #c8c8c8;
          padding-left: 8px;
        }
      }
      .result-item_content {
        display: inline-block;
        vertical-align: top;
        line-height: 25px;
        font-size: 12px;
        margin-left: 15px;
        width: calc(100% - 110px);
      }
    }
    .result-item:hover {
      background-color: #f8f8f8;
    }
    .right-text {
      line-height: 40px;
    }

    .calc-info {
      color: #c8c8c8;
      line-height: 20px;
      margin-top: 10px;
    }
  }
}
</style>

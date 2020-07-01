<template>
  <div class="freight-container">
    <div class="freight-total">
    <div class="freight-left">
      <el-form label-position="top">
        <el-form-item :label="`*${$t('收货国家')}`">
          <el-select v-model="queryInfo.country_id" filterable
          :placeholder="$t('请选择国家或地区')" class="long-item" @change="onCountryChange">
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`*${$t('物品重量')}`">
          <el-input :placeholder="$t('请输入实际重量')" v-model="queryInfo.weight"
            @blur="onQuery('weight')" type="number"></el-input>
        </el-form-item>
        <!-- 物品属性 -->
        <el-form-item :label="`*${$t('物品属性')}`">
          <el-select v-model="queryInfo.prop_ids" multiple
          :placeholder="$t('请选择物品属性')" class="long-item" @change="onQuery('prop_ids')">
            <el-option
              v-for="item in propList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 用户组 -->
        <!-- <el-form-item :label="`*${$t('用户组')}`">
          <el-select v-model="queryInfo.prop_ids" multiple
          :placeholder="$t('请选择')" class="long-item" @change="onQuery('prop_ids')">
            <el-option
              v-for="item in propList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('包裹尺寸（选填）')">
          <el-input :placeholder="$t('长')" type="number"
            class="short-item" v-model="queryInfo.length" @blur="onQuery('length')"></el-input>
          <el-input :placeholder="$t('宽')" type="number"
          class="short-item" v-model="queryInfo.width" @blur="onQuery('width')"></el-input>
          <el-input :placeholder="$t('高')" type="number"
          class="short-item" v-model="queryInfo.height" @blur="onQuery('height')"></el-input>
          <div class="calc-info">{{$t('包裹尺寸为商品打包后，实际包裹箱的长宽高用于某些体积重量的线路运费计算')}}</div>
        </el-form-item>
        <el-form-item :label="`*${$t('寄往仓库')}`">
          <el-select v-model="queryInfo.warehouse_id" :placeholder="$t('请选择寄往仓库')"
            class="long-item" @change="onQuery('warehouse_id')">
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.warehouse_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button class="second-btn long-item" @click="onResult" :loading="$store.state.btnLoading">{{$t('立即查询')}}</el-button>
    </div>
    <div class="freight-right">
      <div class="right-text">{{$t('查询结果')}}</div>
      <div class="none-box" v-show="isEmpty">
        <img src="../../../assets/wu.png"/>
        <div class="right-text">{{$t('您可以在这里估算运费,请在左边输入相关参数')}}!</div>
      </div>
      <div class="result-list">
        <div class="result-item is-click" v-for="(item, index) in lineList" :key="item.id"
          @click="onDetail(item)">
          <img :src="$baseUrl.IMAGE_URL +item.icon.icon" class="result-item_icon">
          <div class="result-item_content">
            <div class="small-size">{{ item.name }}</div>
            <div>{{$t('运费')}}：{{localization.currency_unit }}{{ item.expire_fee | formatPrice }}</div>
            <div>{{$t('运送时效')}}：{{ item.reference_time }}</div>
            <div>{{$t('计费重量')}}：{{ item.count_weight | formatWeight }} {{localization.weight_unit }}</div>
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
  data () {
    return {
      countryList: [],
      isEmpty: true,
      queryInfo: {
        country_id: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        warehouse_id: '',
        prop_ids: []
      },
      lineList: [],
      warehouseList: [],
      propList: [],
      localization: {}
    }
  },
  created () {
    this.getCountrys()
    this.getProps()
    const query = this.$route.query
    for (const key in query) {
      if (query.hasOwnProperty(key) && query[key]) {
        if (key === 'prop_ids') {
          this.queryInfo[key] = query[key].split(',').map(item => Number(item))
        } else {
          this.queryInfo[key] = Number(query[key])
        }
        if (key === 'country_id') {
          this.onCountryChange(false)
        }
      }
    }
    if (this.queryInfo.country_id && this.queryInfo.weight && this.queryInfo.prop_ids.length) {
      this.onCountryChange(false)
      this.onResult()
    }
  },
  mixins: [formatFilter],
  methods: {
    // 国家列表
    getCountrys () {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
          this.countryList = res.data
        }
      })
    },
    // 物品属性列表
    getProps () {
      this.$request.getPackage().then(res => {
        if (res.ret) {
          this.propList = res.data
          console.log(res.localization, 'localization')
          this.localization = res.localization
        }
      })
    },
    // 根据所选国家拉取寄往仓库地址
    onCountryChange (flag = true) {
      flag && this.handleQueryChange('country_id', this.queryInfo.country_id)
      this.$request.getExpressFee({
        country_id: this.queryInfo.country_id
      }).then(res => {
        if (res.ret) {
          this.warehouseList = res.data
          // 默认选择第一个仓库
          if (res.data.length && flag) {
            this.queryInfo.warehouse_id = res.data[0].id
            this.handleQueryChange('warehouse_id', res.data[0].id)
          }
        }
      })
    },
    // 计算结果
    onResult () {
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
      this.$request.queryExpress({
        ...this.queryInfo,
        weight: Number(this.queryInfo.weight) * 1000
      }).then(res => {
        if (res.ret) {
          this.lineList = res.data
          if (!res.data.length) {
            this.$message.error(this.$t('暂无符合条件的路线'))
            this.isEmpty = true
          }
        }
      })
    },
    // 路线详情
    onDetail (item) {
      this.$router.push({
        name: 'freightDetail',
        params: { id: item.id },
        query: {
          count: JSON.stringify({
            countWeight: item.count_weight,
            exceptFee: item.expire_fee,
            countFirst: item.count_first,
            countNext: item.count_next
          })
        }
      })
    },
    onQuery (key) {
      let value = this.queryInfo[key]
      if (key === 'prop_ids') {
        value = value.join(',')
      }
      if (!value) return
      this.handleQueryChange(key, value)
    },
    handleQueryChange (key, value) {
      if (this.$route) {
        const { name, params, query } = this.$route
        this.$router.replace({
          name,
          params,
          query: {
            ...query,
            [key]: value
          }
        })
      }
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
    min-height: calc(100vh - 180px);
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
    background-color: #74B34F;
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
    margin-bottom: 20px;
    border: 1px solid #F3F3F3;
    padding: 20px;
    position: relative;
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

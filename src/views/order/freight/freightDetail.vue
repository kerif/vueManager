<template>
  <div class="freight-detail-container small-size">
    <div class="freight-total">
    <div class="detail-top">
      <img :src="$baseUrl.IMAGE_URL +(line.icon && line.icon.icon)" class="icon-line">
      <div class="top-right mini-size">
        <div class="small-size">{{ line.name }}</div>
        <div>{{$t('目的地')}}：{{ line.countryStr }}</div>
        <div>{{$t('运送时效')}}：{{ line.reference_time }}</div>
        <div v-if="count">{{$t('预计运费')}}：
          {{ localization.currency_unit }}{{ count.exceptFee | formatPrice }}
          </div>
      </div>
    </div>
    <div class="detail-middle">
      <div class="item-title">{{$t('费用明细')}}</div>
      <div v-if="line.mode === 1">
        <!-- 首重、续重模式 -->
        <div v-if="count">{{$t('计费重量')}}：
          {{ count.countWeight | formatWeight }}{{ this.localization.weight_unit }}
          </div>
        <div v-else>{{$t('首重')}}：
          {{ line.first_weight | formatWeight }}{{ this.localization.weight_unit }}
        </div>
        <div v-if="count">{{$t('预计费用')}}：
          {{ this.localization.currency_unit }}{{ count.exceptFee | formatPrice }}
          </div>
        <div v-else>{{$t('续重')}}：
          {{ line.next_weight | formatWeight }}{{ this.localization.weight_unit }}
          </div>
        <div>{{$t('首重收费')}}：
          {{ this.localization.currency_unit }}{{ (count ? count.countFirst : line.first_money) | formatPrice }}
          </div>
        <div>{{$t('续重收费')}}：
          {{ this.localization.currency_unit }}{{ count ? count.countNext : line.next_money | formatPrice }}
          </div>
      </div>
      <div v-else>
        <!-- 阶梯价格档模式 -->
        <div v-for="item in line.price_grade" :key="item.id">
          <div>
            <span>{{$t('重量范围')}}：</span>
            <span>{{item.start | formatWeight}}~{{item.end | formatWeight}}{{this.localization.weight_unit}}</span>
          </div>
          <div>
            <span>{{$t('运费')}}：</span>
            <span>{{this.localization.currency_unit}}{{item.sale_price | formatPrice}}/{{this.localization.weight_unit}}</span>
          </div>
        </div>
      </div>
      <div v-for="item in line.costs" :key="item.id">
        {{ item.name }}：
        {{ this.localization.currency_unit }}
        {{ item.pivot.price | formatPrice }}
      </div>
    </div>
    <div>
      <div class="item-title">{{$t('线路特点')}}</div>
      <div class="remark">{{ line.remark }}</div>
    </div>
    </div>
  </div>
</template>
<script>
import { formatFilter } from '@/mixin'
export default {
  data () {
    return {
      line: {},
      count: '',
      localization: {}
    }
  },
  mixins: [formatFilter],
  created () {
    this.getDetail()
    if (this.$route.query.count) {
      this.count = JSON.parse(this.$route.query.count)
    }
  },
  methods: {
    getDetail () {
      this.$request.getLineDetail(this.$route.params.id).then(res => {
        if (res.ret) {
          this.line = res.data
          this.localization = res.localization
          this.line.countryStr = this.line.countries.map(item => item.name).join('，')
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.freight-detail-container {
  padding: 40px;
  .detail-middle {
    line-height: 40px;
    margin: 30px 0;
  }
  .item-title {
    font-weight: bold;
    line-height: 30px;
    border-bottom: 1px solid #f0f0f0;
  }
  .detail-top {
    font-size: 0;
  }
  .icon-line {
    width: 80px;
    height: 80px;
  }
  .top-right {
    display: inline-block;
    vertical-align: top;
    line-height: 22px;
    margin-left: 20px;
  }
  .remark {
    margin-top: 20px;
  }
  .freight-total {
    background-color: #fff !important;
    padding: 20px;
  }
}
</style>

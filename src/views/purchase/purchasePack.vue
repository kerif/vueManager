<template>
  <div class="pack-container">
    <div class="content-box">
      <div class="flex-item search-box">
        <el-input
          :placeholder="$t('请输入或扫入拣货单号')"
          class="search-ipt flex-1"
          v-model="value"
          @keyup.native.enter="getCloudDetail"
        ></el-input>
        <el-button type="primary" @click="getCloudDetail">{{ $t('查询') }}</el-button>
      </div>
      <div class="has-border order-box remark">
        <el-row :gutter="10">
          <el-col :span="5">
            <div class="font-bold">{{ $t('分货方案名称') }}</div>
          </el-col>
          <el-col :span="19">
            <div>{{ $t('分货方案备注') }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="has-border">
        <el-row class="order-box" type="flex">
          <el-col :span="5">
            <div class="font-bold left-title">{{ $t('请选择订单号') }}</div>
            <div class="order-list">
              <div class="order-item flex-item cursor-pointer" @click="onOrder">
                <span class="font-bold">#4546557542</span>
                <span>{{ $t('已打包') }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="19" class="right-box">
            <div class="top-box">
              <div class="right-item has-border">
                <div class="font-bold right-tile">{{ $t('打包详细') }}</div>
                <div class="detail-box">
                  <el-row class="row-item">
                    <el-col :span="8">
                      <span>{{ $t('订单号') }}：</span>
                      <span class="font-bold"></span>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('收货点') }}：</span>
                      <el-select v-model="value"></el-select>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('客户编号') }}：</span>
                      <el-select v-model="value"></el-select>
                    </el-col>
                  </el-row>
                  <el-row class="row-item">
                    <el-col :span="8">
                      <span>{{ $t('渠道') }}：</span>
                      <el-select v-model="value"></el-select>
                    </el-col>
                    <el-col :span="8">
                      <span>{{ $t('订单属性') }}：</span>
                      <el-select v-model="value"></el-select>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="right-item has-border">
                <div class="weight-content">
                  <div class="flex-item title-list">
                    <div class="font-bold">{{ $t('装箱') }}</div>
                    <el-button type="primary" @click="onAddBox">{{ $t('添加箱子') }}</el-button>
                  </div>
                  <div class="weight-box">
                    <el-row :gutter="10" class="weight-row">
                      <el-col :span="1">
                        <div class="index-label font-bold">#1</div>
                      </el-col>
                      <el-col :span="7" :offset="1"
                        ><div class="item-weight">
                          <span>{{ $t('已装箱数') }}：</span><span>30</span>
                        </div></el-col
                      >
                      <el-col :span="8">
                        <el-input :placeholder="$t('请扫入商品条码装箱')"></el-input>
                      </el-col>
                      <el-col :span="4" :offset="3">
                        <div class="item-weight">
                          <span class="btn-red" @click="onDelBox(index)"> {{ $t('移除') }}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <el-table :data="skuList">
                    <el-table-column label="#" type="index"></el-table-column>
                    <el-table-column :label="$t('状态')" prop="status">
                      <template>
                        <span class="red-text">{{ $t('未装箱') }}</span>
                        <span>{{ $t('已装箱') }}</span>
                        <span>{{ $t('部分装箱') }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('图片')" prop="img">
                      <template>
                        <img class="img-goods" />
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('商品ID')" prop="goodId"></el-table-column>
                    <el-table-column :label="$t('名称')" prop="name"> </el-table-column>
                    <el-table-column :label="$t('颜色')" prop="color"></el-table-column>
                    <el-table-column :label="$t('总数')" prop="total"></el-table-column>
                    <el-table-column :label="$t('已装箱')">
                      <template slot-scope="scope">
                        <el-row style="margin-bottom: 10px">
                          <el-col :span="3">
                            <span>#1</span>
                          </el-col>
                          <el-col :span="11" :offset="2">
                            <el-input type="number" v-model="scope.row.box"></el-input>
                          </el-col>
                        </el-row>
                        <el-row style="margin-bottom: 10px">
                          <el-col :span="3">
                            <span>#1</span>
                          </el-col>
                          <el-col :span="11" :offset="2">
                            <el-input type="number" v-model="scope.row.box"></el-input>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <div class="bottom-box flex-item">
              <div>
                <el-button>{{ $t('保存') }}</el-button>
                <el-button
                  type="primary"
                  class="calc-btn"
                  :loading="$store.state.btnLoading"
                  @click="onPack"
                  >{{ $t('打包完成') }}</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      reviewTypes: [
        { id: 0, name: '无需复核单箱称重' },
        { id: 1, name: '复核多箱称重' }
      ],
      skuList: [
        {
          status: 1,
          img: '',
          goodId: 1122223,
          name: '裙子',
          color: '白色',
          total: 20,
          box: 20
        }
      ]
    }
  },
  created() {
    this.getProps()
    this.orderAddValues()
  },
  methods: {
    getCloudDetail() {},
    getProps() {},
    orderAddValues() {},
    getLines() {},
    getLineService() {},
    onSku() {},
    onAddBox() {},
    onDelBox() {},
    onOrder() {},
    getOrderDetail() {},
    calcVolumn() {},
    onReviewType() {},
    onPack() {}
  },
  computed: {},
  components: {}
}
</script>
<style lang="scss">
.pack-container {
  font-size: 14px;
  .content-box {
    padding: 20px;
  }
  .search-box {
    padding: 20px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
  }
  .search-ipt {
    margin-right: 15px;
  }
  .title-list {
    justify-content: space-between;
  }
  .add-btn-container {
    line-height: 30px;
    height: 30px;
    padding: 0 40px;
  }
  .order-item {
    justify-content: space-between;
    margin-top: 26px;
    &.selected {
      color: blue;
    }
  }
  .order-list {
    padding: 0 30px 20px 30px;
  }
  .detail-box {
    padding: 20px;
  }
  .row-item {
    margin-bottom: 20px;
  }
  .remark {
    padding: 15px;
    margin-bottom: 10px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .red-text {
    color: #f00;
  }
  .primary-text {
    color: blue;
  }
  .img-goods {
    width: 80px;
  }
  .right-box {
    border-left: 1px solid #eff1f2;
  }
  .top-box {
    background-color: #fbfbfc;
    padding: 12px 15px;
  }
  .left-title {
    padding: 16px 18px;
    border-bottom: 1px solid #eff1f2;
  }
  .right-item {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .right-tile {
    line-height: 48px;
    border-bottom: 1px solid #e8e9eb;
    padding: 0 20px;
  }
  .weight-content {
    padding: 20px;
  }
  .weight-box {
    background-color: #f9f9f9;
    padding: 10px;
    margin: 20px 0;
  }
  .index-label {
    font-size: 24px;
    line-height: 40px;
  }
  .item-weight {
    line-height: 40px;
  }
  .weight-ipt {
    font-size: 20px;
    .el-input__inner {
      font-weight: bold;
    }
  }
  .weight-row {
    margin-top: 10px;
  }
  .total-content {
    padding: 40px;
  }
  .total-size {
    font-size: 20px;
  }
  .label {
    align-self: flex-start;
  }
  .value-label,
  .label {
    min-width: 70px;
    margin-right: 10px;
  }
  .label-tips {
    font-size: 14px;
  }
  .radio-item {
    margin-bottom: 20px;
  }
  .value-ipt {
    max-width: 180px;
    .el-input-group__prepend {
      background-color: #fff;
      font-weight: bold;
    }
  }
  .bottom-box {
    text-align: right;
    padding: 20px;
    border-top: 1px solid #eff1f2;
  }
  .total-value {
    font-size: 48px;
  }
  .calc-btn {
    min-width: 90px;
    margin: 0 20px;
  }
  .check {
    margin-right: 10px;
  }
  .scan-box {
    padding: 20px;
    border: 3px solid #eee;
    margin-bottom: 10px;
  }
  .num-box {
    font-size: 60px;
  }
  .scan-num {
    color: #fa808c;
  }
  .scan-tips {
    color: #ff4154;
    background-color: #ffeff1;
    line-height: 40px;
    margin-top: 15px;
  }
  .font-bold {
    font-weight: 700;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-item {
    display: flex;
    align-items: center;
  }
  .order-box {
    background: #fff;
  }
  .has-border {
    border: 1px solid #eff1f2;
  }
  .btn-red {
    cursor: pointer;
    color: red;
  }
}
</style>

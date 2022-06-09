<template>
  <div class="picking-container">
    <div class="content-box">
      <el-row>
        <el-col :span="14">
          <div class="row-item">
            <el-input
              v-model="value"
              :placeholder="$t('请输入或扫码拣货单号,按Enter键结束')"
              class="ipt"
              @keyup.native.enter="onOrderSn"
            />
          </div>
          <div class="row-item">
            <el-input
              :placeholder="$t('请输入或扫码SKU')"
              class="ipt"
              v-model="value"
              ref="sku"
              @keyup.native.enter="onSku"
            />
          </div>
          <el-button type="primary" class="confirm-btn" @click="onSku">{{ $t('确认') }}</el-button>
          <div class="font-bold scan-tips">{{ $t('请扫描拣货单号及SKU') }}</div>
        </el-col>
        <el-col :span="10">
          <div class="right-item">{{ $t('拣货单号') }}：</div>
          <div class="flex-item right-item num-list">
            <span>
              <span>{{ $t('已扫描') }}：</span>
              <span class="font-bold num"></span>
            </span>
            <span>
              <span>{{ $t('未扫描') }}：</span>
              <span class="font-bold num"></span>
            </span>
            <span>
              <span>{{ $t('箱号') }}：</span>
              <span class="font-bold num"></span>
            </span>
          </div>
          <div>
            <div class="flex-item color-item">
              <div class="color-tip color-green"></div>
              <div>{{ $t('绿色为出库数量下单数量') }}</div>
            </div>
            <div class="flex-item color-item">
              <div class="color-tip color-orange"></div>
              <div>{{ $t('黄色为出库数量下单数量') }}</div>
            </div>
            <div class="flex-item color-item">
              <div class="color-tip"></div>
              <div>{{ $t('白色为出库数量下单数量') }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="order-list">
        <div class="order-item flex-item">
          <div class="index">
            <div>{{ $t('订单号') }}：</div>
            <div class="font-bold index-label"></div>
          </div>
          <div class="order-content flex-1">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-row class="sku-row">
                  <el-col :span="4">图片</el-col>
                  <el-col :span="5">品名</el-col>
                  <el-col :span="5">条码</el-col>
                  <el-col :span="5" class="align-center">{{ $t('预计分货') }}</el-col>
                  <el-col :span="5" class="align-center">{{ $t('实际分货') }}</el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row class="sku-row">
                  <el-col :span="4">图片</el-col>
                  <el-col :span="5">品名</el-col>
                  <el-col :span="5">条码</el-col>
                  <el-col :span="5" class="align-center">{{ $t('预计分货') }}</el-col>
                  <el-col :span="5" class="align-center">{{ $t('实际分货') }}</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-row class="sku-row">
                  <el-col :span="14">
                    <span class="sku-item"></span>
                  </el-col>
                  <el-col :span="5" class="align-center font-bold num-item"></el-col>
                  <el-col :span="5" class="align-center">
                    <el-input
                      class="out-num"
                      v-model="value"
                      type="number"
                      :loading="$store.state.btnLoading"
                    />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="align-right">
        <el-button class="save-btn">{{ $t('保存') }}</el-button>
        <el-button
          class="save-btn"
          type="primary"
          @click="onSave"
          :loading="$store.state.btnLoading"
          >{{ $t('拣货完成') }}</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  methods: {
    onOrderSn() {},
    onSku() {},
    onCheckOut() {},
    onSave() {},
    onPicking() {}
  },
  computed: {}
}
</script>
<style lang="scss">
.picking-container {
  background: #fff !important;
  .content-box {
    padding: 20px;
  }
  .confirm-btn {
    min-width: 100px;
  }
  .row-item {
    margin-bottom: 15px;
  }
  .save-btn {
    margin-top: 20px;
    min-width: 120px;
  }
  .ipt {
    width: 300px;
  }
  .scan-tips {
    color: #f00;
    margin-top: 30px;
    font-size: 20px;
  }
  .num-list {
    justify-content: space-between;
  }
  .num {
    font-size: 30px;
  }
  .flex-1 {
    flex: 1;
  }
  .font-bold {
    font-weight: 700;
  }
  .flex-item {
    display: flex;
    align-items: center;
  }
  .align-right {
    text-align: right;
  }
  .order-list {
    max-height: 500px;
    overflow: auto;
  }
  .right-item {
    margin-bottom: 30px;
  }
  .color-item {
    &:not(:first-child) {
      margin-top: 10px;
    }
  }
  .color-tip {
    width: 28px;
    height: 28px;
    border: 1px solid #333;
    box-sizing: border-box;
    border-radius: 50%;
    margin-right: 15px;
    &.color-green {
      background-color: #3da969;
    }
    &.color-orange {
      background-color: #ff9933;
    }
  }
  .order-item {
    border: 1px solid #efefef;
    margin-top: 20px;
    align-items: stretch;
  }
  .index {
    padding: 20px 20px;
    border-right: 1px solid #efefef;
    position: relative;
  }
  .index-label {
    font-size: 40px;
    margin-top: 20px;
    text-align: center;
  }
  .order-content {
    padding: 20px;
  }
  .order-num {
    margin-right: 50px;
  }
  .sku-row {
    margin-top: 15px;
  }
  .num-item {
    font-size: 26px;
    line-height: 32px;
  }
  .out-num {
    font-size: 20px;
    .el-input__inner {
      text-align: center;
      font-weight: bold;
    }
    &.empty {
      .el-input__inner {
        color: #f00;
      }
    }
  }
  .sku-item {
    height: 30px;
    line-height: 30px;
    display: inline-block;
    padding: 0 25px;
    border: 1px solid #efefef;
    &.all {
      border-color: #efefef;
      background-color: #efefef;
      color: #fff;
    }
    &.wait {
      border-color: #ff9933;
      background-color: #ff9933;
    }
  }
}
</style>

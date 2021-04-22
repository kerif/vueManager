<template>
  <el-dialog :visible.sync="show" :title="state === 'sms' ? $t('购买短信服务') : $t('购买物流查询服务')" class="buying-container" @close="clear">
    <p>{{$t('选择中国大陆短信套餐')}}：</p>
    <div>
      <el-row>
        <el-col :span="5" class="set-meal" v-for="item in chinaData" :key="item.id" @click.native="chooseService(item)" :offset="1" :class="station.id === item.id ? 'selected' : ''">
          <el-badge :value="item.price > 0 ? `${localization.currency_unit}${item.price / item.count}/次` : ''" class="item">
            <span>{{item.name}}</span><br/>
            <span>{{localization.currency_unit}}{{item.price}}/{{item.count}}{{$t('次')}}</span>
          </el-badge>
          <i class="el-icon-check icon-check" v-show="station.id === item.id"></i>
        </el-col>
      </el-row>
    </div>
    <div class="count-sty">
      {{$t('购买数量')}}
      <el-input-number class="add-counts" v-model="onceNum" @change="handleChange" :min="1" :max="100"></el-input-number>
      <span>{{$t('套餐金额')}}：{{localization.currency_unit}}{{station.price}}</span>
    </div>
    <div class="line"></div>
    <p>{{$t('选择国际短信套餐')}}：</p>
    <div>
      <el-row>
        <el-col :span="5" class="set-meal" v-for="item in internationalData" :key="item.id" :offset="1">
          <el-badge :value="item.price > 0 ? `${localization.currency_unit}${item.price / item.count}/次` : ''" class="item">
            <span>{{item.name}}</span><br/>
            <span>{{localization.currency_unit}}{{item.price}}/{{item.count}}{{$t('次')}}</span>
          </el-badge>
        </el-col>
      </el-row>
    </div>
    <div class="count-sty">
      {{$t('购买数量')}}
      <el-input-number class="add-counts" v-model="secondNum" @change="handleChange" :min="1" :max="100"></el-input-number>
      <span>{{$t('套餐金额')}}：{{localization.currency_unit}}600</span>
    </div>
    <div class="line"></div>
    <div class="bottom-main">
      <div class="payment-sty">
        <span>{{$t('应付金额')}}：</span>
        <span class="fee-sty">{{localization.currency_unit}}120000</span>
      </div>
      <el-button class="btn-light-green">{{$t('微信支付')}}</el-button>
      <el-button class="btn-light-green">{{$t('支付宝支付')}}</el-button>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirmShip">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      num: '',
      state: '',
      chinaData: [],
      internationalData: [],
      localization: {},
      onceNum: '',
      secondNum: '',
      station: {}
    }
  },
  methods: {
    getService () {
      let type = this.state === 'sms' ? 'sms' : 'tracking'
      this.$request.serviceType(type).then(res => {
        if (res.ret) {
          this.chinaData = res.data.china
          this.chinaData.unshift({ id: 0, name: '无需', price: 0, count: 0 })
          console.log(this.chinaData, 'this.chinaData')
          this.internationalData = res.data.international
          this.internationalData.unshift({ id: 0, name: '无需', price: 0, count: 0 })
          this.localization = res.localization
        }
      })
    },
    // 选中
    chooseService (item) {
      console.log(item, 'item')
      this.station = item
    },
    // 确认创建发货单
    confirmShip (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.saveShip(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.innerVisible = false
              this.show = true
              // this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            // this.innerVisible = false
          })
        } else {
          return false
        }
      })
    },
    handleChange (value) {
      console.log(value)
    },
    clear () {
    },
    init () {
      this.getService()
    }
  }
}
</script>
<style lang="scss" scope>
.buying-container{
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
  .created-btn {
    margin-left: 5px;
  }
  .content-long {
    .el-scrollbar {
      width: 200px !important;
    }
  }
  .set-meal {
    cursor: pointer;
    background-color: #e8eef4;
    padding: 10px;
  }
  .count-sty {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .line {
    border-top: 1px dashed #ccc;
  }
  .add-counts {
    margin-left: 10px;
    margin-right: 30px;
  }
  .bottom-main {
    margin-top: 20px;
    padding-left: 10px;
    .payment-sty {
      font-size: 16px;
      margin-bottom: 15px;
    }
    .fee-sty{
      font-size: 22px;
      color: red;
    }
  }
  .selected {
    color: #B05529;
    border-color: #B05529;
    position: relative;
  }
  .icon-check {
    color: #B05529;
    position: absolute;
    font-size: 28px;
    bottom: 0;
    right: -10px;
  }
}
.el-select-dropdown__item.hover{
    width: auto;
}
.el-select-dropdown__item {
  width: 180px;
  white-space: nowrap;/*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis;
}
</style>

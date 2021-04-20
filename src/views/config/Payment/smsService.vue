<template>
  <div class="new-user-container">
    <h2>{{$t('短信服务')}}</h2>
    <el-row :gutter="20">
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="radio" :label="1">{{$t('系统内服务短信')}}</el-radio>
          <div class="user-bottom">
            <div class="bottom-left">
              <p>
              {{$t('大陆短信剩余次数')}}：<span class="count-sty">100000</span>
              </p>
              <p>
              {{$t('国际短信剩余次数')}}：<span class="count-sty">0</span>
              </p>
            </div>
            <div class="bottom-right">
              <el-button class="buy-sty">购买</el-button>
            </div>
          </div>
          <div class="details-sty">
            <i class="el-icon-s-order"></i>
            {{$t('详情')}}
          </div>
          <div class="details-sty">
            <i class="el-icon-s-order"></i>
            {{$t('预警')}}
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="radio" :label="1">{{$t('第三方短信服务')}}</el-radio>
          <div class="message-main">
            <span>{{$t('中国大陆短信服务——Appkey')}}：</span><br/>
            <el-input class="input-sty"></el-input>
            <el-button class="buy-sty">{{$t('测试')}}</el-button>
          </div>
          <div class="message-main">
            <span>{{$t('中国大陆短信服务——Appkey')}}：</span><br/>
            <el-input class="input-sty"></el-input>
            <el-button class="buy-sty">{{$t('测试')}}</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="radio" :label="1">{{$t('不开启')}}</el-radio>
          <div class="unopen-sty">
            <p>
            {{$t('暂不开启短信通知')}}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <h2 class="template-sty">{{$t('短信模版（系统内）')}}</h2>
    <el-button class="template-sty btn-green">{{$t('模版示例')}}</el-button>
    <div class="svs-template">
      <el-form :model="ruleForm" label-width="130px">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('发送验证码')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('未入库包裹预警')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('订单支付成功')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('扣款成功')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('订单已发货')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('充值成功')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('包裹已入库')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('到达自提点')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('订单提交成功')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('自提点已签收/出库')">
              <el-input class="input-sty"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="save-btn">
      <el-button type="primary">{{$t('保存')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      validate_email: '',
      ruleForm: {},
      radio: 1
    }
  },
  created () {
    // this.getList()
  },
  methods: {
    getList () {
      this.$request.getCoupons().then(res => {
        this.ruleForm = res.data
      })
    },
    changeOnline (type, val) {
      console.log(type, 'type')
      const status = val === 0 ? 0 : 1
      this.$request.closeCoupons(type, status).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          // this.getWechat()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 新增
    goAdd (type) {
      if (type === 4) {
        this.$router.push({ name: 'rebate', params: { type: type } })
      } else {
        this.$router.push({ name: 'addNew', params: { type: type } })
      }
    },
    // 管理
    goMana (type) {
      if (type === 1) { // 新用户送券
        this.$router.push({ name: 'new', params: { type: type } })
      } else if (type === 2) { // 邀请新人送券
        this.$router.push({ name: 'invite', params: { type: type } })
      } else if (type === 3) { // 被邀请人送券
        this.$router.push({ name: 'invitees', params: { type: type } })
      } else if (type === 4) { // 下单返券
        this.$router.push({ name: 'rebates', params: { type: type } })
      }
      // this.$router.push({ name: 'managementNew', params: { type: type } })
    }
  }
}
</script>
<style lang="scss">
.new-user-container {
  background-color: #F5F5F5 !important;
  padding: 20px;
  .new-top {
    margin-bottom: 10px;
    padding: 20px;
    background: #fff;
    height: 240px;
    .top-img {
      margin-top: 50px;
      margin-bottom: 40px;
      text-align: center;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
  .user-bottom {
    margin-bottom: 40px;
    overflow: hidden;
    .bottom-left {
      // display: inline-block;
      float: left;
    }
    .bottom-right {
      // display: inline-block;
      float: right;
    }
    .switch-sty {
    }
  }
  .user-left {
    margin-left: 20px;
  }
  .font-sty {
    font-size: 12px;
  }
  .buy-sty {
    color: #35B85A;
    border-color: #35B85A;
  }
  .details-sty {
    display: inline-block;
    margin-right: 20px;
  }
  .count-sty {
    color: red;
  }
  .system-sty {
    .el-radio__label {
      font-size: 18px;
    }
  }
  .message-main {
    margin-top: 25px;
    .input-sty {
      margin-top: 5px;
      width: 70%;
      margin-right: 10px;
    }
  }
  .unopen-sty {
    margin-left: 20px;
  }
  .template-sty {
    display: inline-block;
  }
  .svs-template {
    background-color: #fff;
    width: 90%;
    padding: 20px;
    margin-left: 20px;
    .input-sty {
      width: 60%;
    }
  }
  .save-btn {
    margin-top: 20px;
    margin-left: 20px;
  }
}
</style>

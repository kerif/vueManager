<template>
  <div class="sms-service-container">
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
              <el-button class="buy-sty" @click="buying">{{$t('购买')}}</el-button>
            </div>
          </div>
          <div class="details-sty">
            <i class="el-icon-s-order"></i>
            {{$t('详情')}}
          </div>
          <div class="details-sty" @click="alertSms">
            <i class="el-icon-s-order"></i>
            {{$t('预警')}}
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="radio" :label="2">{{$t('第三方短信服务')}}</el-radio>
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
          <el-radio class="system-sty" v-model="radio" :label="3">{{$t('不开启')}}</el-radio>
          <div class="unopen-sty">
            <p>
            {{$t('暂不开启短信通知')}}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 短信模版（系统内） -->
    <div v-if="radio === 1">
      <h2 class="template-sty">{{$t('短信模版（系统内）')}}</h2>
      <el-button class="template-sty btn-green" @click="templateExample">{{$t('模版示例')}}</el-button>
      <div class="svs-template">
        <el-row :gutter="20">
          <el-col :span="10">
            <span>验证码</span>
            <el-tooltip class="item code-sty" effect="dark" :content="$t('仅新增显示，方便审核收款与核对账目，不改变系统结算数据')" placement="top">
              <span class="el-icon-warning icon-info"></span>
            </el-tooltip>
            <el-switch
              class="switch-sty"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="radio === 2">
      <h2 class="template-sty">{{$t('短信模版')}}</h2>
      <span>（{{$t('请输入第三方国内模版ID')}}）</span>
      <!-- <el-button class="template-sty btn-green">{{$t('模版示例')}}</el-button> -->
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
    </div>
    <div class="save-btn">
      <el-button type="primary">{{$t('保存')}}</el-button>
    </div>
    <el-dialog
      :title="$t('模版示例')"
      :visible.sync="dialogVisible"
      width="35%">
      <el-table :data="templateData" border>
        <el-table-column :label="$t('模版ID')"></el-table-column>
        <el-table-column :label="$t('内容')"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      validate_email: '',
      ruleForm: {},
      radio: 1,
      dialogVisible: false,
      templateData: []
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
    // 购买
    buying () {
      dialog({ type: 'buyingService', state: 'sms' })
    },
    // 预警
    alertSms () {
      dialog({ type: 'alertSettings', state: 'sms' })
    },
    // 模版示例
    templateExample () {
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss">
.sms-service-container {
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
    cursor: pointer;
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
  .code-sty {
    padding-left: 5px;
    color: #35B85A;
    font-size: 18px;
  }
  .switch-sty {
    margin-left: 40px;
  }
}
</style>

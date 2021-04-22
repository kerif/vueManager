<template>
  <div class="tracking-service-container">
    <h2>{{$t('物流查询服务')}}</h2>
    <el-row :gutter="20">
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="radio" :label="1">{{$t('系统内服物流查询短信')}}</el-radio>
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
          <div class="details-sty" @click="alertSms">
            <i class="el-icon-s-order"></i>
            {{$t('预警')}}
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="radio" :label="2">{{$t('第三方物流查询服务')}}</el-radio>
          <div class="message-main">
            <p>{{$t('快递100配置')}}</p>
            <span>{{$t('Customer ID')}}：</span><br/>
            <el-input class="input-sty"></el-input><br/>
            <span>{{$t('授权KEY')}}：</span><br/>
            <el-input class="input-sty"></el-input>
            <el-button class="buy-sty">{{$t('测试')}}</el-button>
          </div>
          <div class="message-main">
            <p>{{$t('Tracking more配置')}}</p>
            <span>{{$t('Appkey')}}：</span><br/>
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
            {{$t('暂不开启物流查询服务/定制API对接')}}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="save-btn">
      <el-button type="primary">{{$t('保存')}}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
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
    // 购买
    buying () {
      dialog({ type: 'buyingService', state: 'tracking' }, () => {
        this.getList()
      })
    },
    // 预警
    alertSms () {
      dialog({ type: 'alertSettings', state: 'tracking' })
    }
  }
}
</script>
<style lang="scss">
.tracking-service-container {
  background-color: #F5F5F5 !important;
  padding: 20px;
  .new-top {
    margin-bottom: 10px;
    padding: 20px;
    background: #fff;
    height: 350px;
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
      width: 60%;
      margin-right: 10px;
    }
    span {
      font-size: 14px;
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

<template>
  <div class="tracking-service-container">
    <h2>{{ $t('物流查询服务') }}</h2>
    <el-row :gutter="20">
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="ruleForm.type" :label="2">{{
            $t('系统内物流查询服务')
          }}</el-radio>
          <div class="user-bottom">
            <div class="bottom-left">
              <p>
                {{ $t('快递100查询剩余次数') }}：<span class="count-sty">{{
                  ruleForm.kuaidi100_count
                }}</span>
              </p>
              <p>
                {{ $t('51Tracking查询剩余次数') }}：<span class="count-sty">{{
                  ruleForm.tracking_count
                }}</span>
              </p>
            </div>
            <div class="bottom-right">
              <el-button class="buy-sty" @click="buying">{{ $t('购买') }}</el-button>
            </div>
          </div>
          <!-- <div class="details-sty" @click="alertSms">
            <i class="el-icon-s-order"></i>
            {{$t('预警')}}
          </div> -->
          <!-- <div class="details-sty" @click="purchase">
            <i class="el-icon-s-order"></i>
            {{$t('购买记录')}}
          </div> -->
          <el-button @click="purchase" class="btn-main">{{ $t('购买记录') }}</el-button>
        </div>
      </el-col>
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="ruleForm.type" :label="1">{{
            $t('第三方物流查询服务')
          }}</el-radio>
          <div class="message-main">
            <p>{{ $t('国内物流查询(快递100)') }}</p>
            <p>{{ $t('快递100配置') }}</p>
            <span>{{ $t('Customer ID') }}：</span><br />
            <el-input v-model="ruleForm.kuaidi100_customer_id" class="input-sty"></el-input><br />
            <span>{{ $t('授权KEY') }}：</span><br />
            <el-input v-model="ruleForm.kuaidi100_key" class="input-sty"></el-input>
            <el-button class="buy-sty" @click="testExpress">{{ $t('测试') }}</el-button>
          </div>
          <div style="margin: 25px 0 10px 0">
            <p>{{ $t('国际物流查询') }}</p>
            <el-radio-group v-model="ruleForm.tracking_provider">
              <el-radio :label="0">51tracking</el-radio>
              <el-radio :label="1">17track</el-radio>
            </el-radio-group>
          </div>
          <div class="message-main" v-if="ruleForm.tracking_provider === 0">
            <p>{{ $t('Tracking more配置') }}</p>
            <span>{{ $t('Appkey') }}：</span><br />
            <el-input v-model="ruleForm.tracking_app_key" class="input-sty"></el-input>
            <el-button class="buy-sty" @click="testTracking">{{ $t('测试') }}</el-button>
          </div>
          <div class="message-main" v-else>
            <p>{{ $t('17Track 配置') }}</p>
            <span>{{ $t('Appkey') }}：</span><br />
            <el-input v-model="ruleForm.track_app_key" class="input-sty"></el-input>
            <el-button class="buy-sty" @click="testTrack">{{ $t('测试') }}</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" v-model="ruleForm.type" :label="0">{{
            $t('不开启')
          }}</el-radio>
          <div class="unopen-sty">
            <p>
              {{ $t('暂不开启物流查询服务/定制API对接') }}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="save-btn">
      <el-button type="primary" @click="saveTemplate">{{ $t('保存') }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      validate_email: '',
      ruleForm: {
        type: 2,
        tracking_app_key: '',
        tracking_count: '',
        kuaidi100_customer_id: '',
        kuaidi100_key: '',
        kuaidi100_count: '',
        track_app_key: '',
        tracking_provider: 0
      },
      radio: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.getTrackingData().then(res => {
        this.ruleForm.type = res.data.type
        this.ruleForm.tracking_app_key = res.data['51tracking_app_key']
        this.ruleForm.tracking_count = res.data['51tracking_count']
        this.ruleForm.kuaidi100_count = res.data.kuaidi100_count
        this.ruleForm.kuaidi100_key = res.data.kuaidi100_key
        this.ruleForm.kuaidi100_customer_id = res.data.kuaidi100_customer_id
        this.ruleForm.track_app_key = res.data['17track_app_key']
        this.ruleForm.tracking_provider = res.data.tracking_provider
      })
    },
    // 检测快递100
    testExpress() {
      if (this.ruleForm.kuaidi100_customer_id === '') {
        return this.$message.error('请输入Customer ID')
      } else if (this.ruleForm.kuaidi100_key === '') {
        return this.$message.error(this.$t('请输入授权KEY'))
      }
      this.$request
        .verifyKd100({
          kd100_app_id: this.ruleForm.kuaidi100_customer_id,
          kd100_app_key: this.ruleForm.kuaidi100_key
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 检测Tracking more
    testTracking() {
      if (this.ruleForm.tracking_app_key === '') {
        return this.$message.error('请输入Tracking more的AppKey')
      }
      this.$request
        .verifyTrackingMore({
          trackingmore_key: this.ruleForm.tracking_app_key
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    testTrack() {
      if (this.ruleForm.track_app_key === '') {
        return this.$message.error('请输入17Track more的AppKey')
      }
      this.$request
        .verifyTrackMore({
          '17track_app_key': this.ruleForm.track_app_key
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    saveTemplate() {
      this.$request
        .updateTrackingSystem({
          ...this.ruleForm,
          '51tracking_app_key': this.ruleForm.tracking_app_key,
          '51tracking_count': this.ruleForm.tracking_count,
          '17track_app_key': this.ruleForm.track_app_key
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 购买
    buying() {
      dialog({ type: 'buyingService', state: 'tracking' }, () => {
        this.getList()
      })
    },
    // 预警
    alertSms() {
      dialog({ type: 'alertSettings', state: 'tracking' })
    },
    // 购买记录
    purchase() {
      dialog({ type: 'purchaseHistory', state: 'tracking' })
    }
  }
}
</script>
<style lang="scss">
.tracking-service-container {
  background-color: #f5f5f5 !important;
  padding: 20px;
  .new-top {
    margin-bottom: 10px;
    padding: 20px;
    background: #fff;
    height: 425px;
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
      float: left;
    }
    .bottom-right {
      float: right;
    }
  }
  .user-left {
    margin-left: 20px;
  }
  .font-sty {
    font-size: 12px;
  }
  .buy-sty {
    color: #35b85a;
    border-color: #35b85a;
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
    margin-top: 15px;
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
    color: #35b85a;
    font-size: 18px;
  }
  .switch-sty {
    margin-left: 40px;
  }
}
</style>

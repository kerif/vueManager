<template>
  <div class="api-configure">
    <div class="item">
      <div class="item-top">
        <div>
          <i class="el-icon-chat-line-round icon-sty"></i>
        </div>
        <div>
          <div>{{ $t('短信服务') }}</div>
          <div style="margin-top: 10px">
            <span class="system-sty service-sty" v-if="smsData.type === 2">{{
              $t('您当前正在使用系统内短信服务')
            }}</span>
            <span class="third-sty service-sty" v-if="smsData.type === 1">{{
              $t('您当前正在使用第三方短信服务')
            }}</span>
            <span class="no-sty service-sty" v-if="smsData.type === 0">{{
              $t('您当前未开启短信服务')
            }}</span>
          </div>
          <div v-if="smsData.type === 1" class="sms-sty">
            <div style="margin-bottom: 10px">
              <span class="text-sty">{{ $t('大陆短信服务') }}</span>
              <i
                v-if="smsData.status && smsData.status.china === 1"
                class="el-icon-circle-check icon-china"
              ></i>
              <i v-else class="el-icon-circle-close icon-int"></i>
            </div>
            <div>
              <span class="text-sty">{{ $t('国际短信服务') }}</span>
              <i
                v-if="smsData.status && smsData.status.international === 1"
                class="el-icon-circle-check icon-china"
              ></i>
              <i class="el-icon-circle-close icon-int"></i>
            </div>
          </div>
          <div v-else-if="smsData.type === 2" class="sms-sty">
            <div class="text-sty">
              {{ $t('大陆短信剩余次数') }}：
              <span class="no-sty">
                {{ smsData.count && smsData.count.china }}
              </span>
            </div>
            <div class="text-sty">
              {{ $t('国际短信剩余次数') }}：
              <span class="no-sty">
                {{ smsData.count && smsData.count.international }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="configureBtn">
        <el-button type="primary" @click="goConfiguration('sms')">{{ $t('配置') }}</el-button>
      </div>
    </div>
    <div class="item">
      <div class="item-top">
        <div>
          <i class="el-icon-chat-line-round icon-sty"></i>
        </div>
        <div>
          <div>{{ $t('物流查询服务') }}</div>
          <div>
            <span class="system-sty service-sty" v-if="trackingData.type === 2">{{
              $t('您当前正在使用系统内物流查询')
            }}</span>
            <span class="third-sty service-sty" v-if="trackingData.type === 1">{{
              $t('您当前正在使用第三方物流查询服务')
            }}</span>
            <span class="no-sty service-sty" v-if="trackingData.type === 0">{{
              $t('您当前未开启物流查询')
            }}</span>
          </div>
          <div v-if="trackingData.type === 1" class="sms-sty">
            <div style="margin-bottom: 10px">
              <span class="text-sty">{{ $t('快递100查询') }}</span>
              <i
                v-if="trackingData.status && trackingData.status.kuaidi100 === 1"
                class="el-icon-circle-check icon-china"
              ></i>
              <i v-else class="el-icon-circle-close icon-int"></i>
            </div>
            <div>
              <span class="text-sty">{{ $t('51Track查询') }}</span>
              <i
                v-if="trackingData.status && trackingData.status['51tracking'] === 1"
                class="el-icon-circle-check icon-china"
              ></i>
              <i v-else class="el-icon-circle-close icon-int"></i>
            </div>
          </div>
          <div v-else-if="trackingData.type === 2" class="sms-sty">
            <el-row>
              <el-col :span="14" class="text-sty">{{ $t('快递100剩余次数') }}：</el-col>
              <el-col :span="6"
                ><span class="no-sty">
                  {{ trackingData.count && trackingData.count.kuaidi100 }}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="14" class="text-sty"> {{ $t('51Tracking剩余次数') }}： </el-col>
              <el-col :span="6">
                <span class="no-sty">
                  {{ trackingData.count && trackingData.count['51tracking'] }}
                </span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="configureBtn">
        <el-button type="primary" @click="goConfiguration('tracking')">{{ $t('配置') }}</el-button>
      </div>
    </div>
    <div class="item">
      <div class="item-top">
        <div>
          <i class="el-icon-chat-line-round icon-sty"></i>
        </div>
        <div>
          <div>{{ $t('邮件通知') }}</div>
          <div class="text-sty">{{ $t('邮件配置') }}</div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="configureBtn">
        <el-button type="primary" @click="goConfiguration('email')">{{ $t('配置') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      smsData: {},
      trackingData: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.getApiService().then(res => {
        if (res.ret) {
          this.smsData = res.data.sms
          this.trackingData = res.data.tracking
          console.log(res.data, 'data')
        }
      })
    },
    goConfiguration(status) {
      if (status === 'sms') {
        this.$router.push({ name: 'smsServices' })
      } else if (status === 'tracking') {
        this.$router.push({ name: 'trackingService' })
      } else {
        this.$router.push({ name: 'mailConfigur' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.api-configure {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  .item {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #000;
    .item-top {
      display: grid;
      grid-template-columns: 1fr 3fr;
      align-items: center;
      gap: 20px;
    }
    .configureBtn {
      text-align: right;
      margin-top: 10px;
    }
  }
  .icon-sty {
    font-size: 60px;
  }
  .sms-sty {
    margin-top: 10px;
  }
  .service-sty {
    font-size: 16px;
    font-weight: 900;
  }
  .system-sty {
    color: #15b23e;
  }
  .third-sty {
    color: #3540a5;
  }
  .no-sty {
    color: #df6062;
  }
  .text-sty {
    font-size: 15px;
  }
  .icon-china {
    font-size: 22px;
    color: #15b23e;
    padding-left: 10px;
    vertical-align: middle;
  }
  .icon-int {
    font-size: 22px;
    color: #df6062;
    padding-left: 10px;
    vertical-align: middle;
  }
}
</style>

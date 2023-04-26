<template>
  <div class="api-configure">
    <div class="item">
      <div class="item-top">
        <div style="text-align: center">
          <i class="el-icon-chat-line-round icon-sty"></i>
        </div>
        <div>
          <div class="sms-top">{{ $t('短信服务') }}</div>
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
              <i v-else class="el-icon-circle-close icon-int"></i>
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
        <div style="text-align: center">
          <i class="el-icon-chat-line-round icon-sty"></i>
        </div>
        <div>
          <div class="sms-top">{{ $t('物流查询服务') }}</div>
          <div style="margin-top: 10px">
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
              <el-col :span="14" class="text-sty"> {{ $t('51Tracking剩余次数') }}：</el-col>
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
        <div style="text-align: center">
          <i class="el-icon-chat-line-round icon-sty"></i>
        </div>
        <div>
          <div class="sms-top">{{ $t('邮件通知') }}</div>
          <div class="text-sty" style="margin-top: 10px">{{ $t('邮件配置') }}</div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="configureBtn">
        <el-button type="primary" @click="goConfiguration('email')">{{ $t('配置') }}</el-button>
      </div>
    </div>
    <!-- 地图api -->
    <div class="item">
      <div class="item-top">
        <div style="text-align: center">
          <i class="el-icon-chat-line-round icon-sty"></i>
        </div>
        <div>
          <div class="sms-top">{{ $t('Google地图API') }}</div>
          <div class="text-sty" style="margin-top: 10px">{{ $t('验证拼团或收件地址') }}</div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="configureBtn">
        <el-button type="primary" @click="dialogVisible = true">{{ $t('配置') }}</el-button>
      </div>
    </div>

    <!--    台湾件实名认证-->
    <div class="item">
      <div class="item-top">
        <div style="text-align: center">
          <i class="el-icon-chat-line-round icon-sty"></i>
        </div>
        <div>
          <div class="sms-top">{{ $t('台湾件实名认证') }}</div>
          <div class="text-sty" style="margin-top: 10px">
            {{ $t('通过易立委实名认证，仅支持台湾地址收件人验证') }}
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="configureBtn">
        <el-button type="primary" @click="showTaiWanDialog">{{ $t('配置') }}</el-button>
      </div>
    </div>
    <div>
      <el-dialog
        :visible.sync="dialogVisible"
        :title="$t('配置Google地图API')"
        class="dialog-batchImport"
      >
        <div>
          <el-form label-width="100px" :model="resource">
            <el-form-item :label="$t('开发者KEY')">
              <el-input v-model="resource.key"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('开发者密钥')">
              <el-input v-model="form.secretKey"></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="save(1)">{{ $t('保存') }}</el-button>
            </el-form-item>
            <el-form-item :label="$t('测试海外地址')">
              <el-input v-model="resource.address"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save(2)">{{ $t('保存') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        :visible.sync="taiWanRealVisible"
        :title="$t('台湾件实名认证')"
        class="taiwan-real"
      >
        <div class="taiwan-real-box">
          <el-form label-width="100px" class="real-form" label-position="left" :model="taiWanReal">
            <div class="tip-title">
              {{ $t('使用前请确保能在')
              }}<span class="go-other" @click="goOther">https://eccs.tradevan.com.tw/</span
              >{{ $t('登录') }}
            </div>
            <el-form-item :label="$t('公司统一编号')">
              <el-input v-model="taiWanReal.code" :placeholder="$t('请输入')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('使用者账号')">
              <el-input v-model="taiWanReal.username" :placeholder="$t('请输入')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('使用者密码')" style="margin-bottom: 8px">
              <el-input v-model="taiWanReal.password" :placeholder="$t('请输入')"></el-input>
            </el-form-item>
            <el-form-item label="" style="margin-bottom: 8px">
              <div class="switch-box">
                <el-switch v-model="taiWanReal.check"></el-switch>
                <span>{{ $t('启用申请打包实名认证') }}</span>
              </div>
            </el-form-item>
            <el-form-item label="" style="margin-bottom: 8px">
              <div class="submit-box">
                <el-button type="primary" class="sub-btn" @click="submit"
                  >{{ $t('保存') }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="" style="margin-bottom: 8px">
              <span class="red-font">{{ $t('没有帐号？按需收费，请联系销售人员') }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      smsData: {},
      trackingData: {},
      dialogVisible: false,
      taiWanRealVisible: false,
      value1: false,
      taiWanReal: {
        code: null,
        username: null,
        password: null,
        check: null
      },
      resource: {
        key: '',
        address: ''
      }
    }
  },
  created() {},
  methods: {
    goConfiguration(status) {
      if (status === 'sms') {
        this.$router.push({ name: 'smsServices' })
      } else if (status === 'tracking') {
        this.$router.push({ name: 'trackingService' })
      } else {
        this.$router.push({ name: 'mailConfigur' })
      }
    },
    showTaiWanDialog() {
      this.taiWanRealVisible = true
      this.$request.getTaiWanInfo().then(res => {
        console.log(res.data)
        this.taiWanReal.code = res.data.no
        this.taiWanReal.username = res.data.username
        this.taiWanReal.password = res.data.password
        this.taiWanReal.check = res.data.enabled ? true : false
      })
    },
    goOther() {
      window.open('https://eccs.tradevan.com.tw/')
    },
    submit() {
      let params = {
        no: this.taiWanReal.code,
        username: this.taiWanReal.username,
        password: this.taiWanReal.password,
        enabled: this.taiWanReal.check ? 1 : 0
      }
      console.log(params)
      this.$request.saveTaiWanInfo(params).then(res => {
        this.$message.success(res.msg)
        this.taiWanRealVisible = false
      })
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
    border: 1px solid #f5f5f5;
    border-radius: 10px;

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

  .sms-top {
    font-size: 19px;
    font-weight: 900;
  }
}

::v-deep.taiwan-real {
  .el-dialog {
    width: 700px;

    .el-dialog__body {
      padding: 20px;
    }
  }

  .el-dialog__header {
    background-color: #0e102a;
  }

  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }

  .uploadTmp {
    height: 150px;
    margin-top: -10px;
  }

  .uploadData {
    display: inline-block;
    margin: 0 5px 0 0;
  }

  .taiwan-real-box {
    display: flex;
    justify-content: center;

    .real-form {
      width: 70%;

      .red-font {
        color: red;
      }
    }

    .tip-title {
      font-size: 16px;
      margin-bottom: 16px;
    }

    .go-other {
      cursor: pointer;
      color: #3777ff;
    }

    .switch-box {
      span {
        padding-left: 16px;
      }
    }

    .submit-box {
      .sub-btn {
        width: 100%;
      }
    }
  }
}
</style>

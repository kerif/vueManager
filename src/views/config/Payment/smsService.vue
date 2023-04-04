<template>
  <div class="sms-service-container">
    <h2>{{ $t('短信服务') }}</h2>
    <el-row :gutter="20">
      <el-col :span="7" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" @change="changeType" v-model="ruleForm.type" :label="2">{{
            $t('系统内服务短信')
          }}</el-radio>
          <div class="user-bottom">
            <div class="bottom-left">
              <p>
                {{ $t('大陆短信剩余次数') }}：<span class="count-sty">{{ ruleForm.count }}</span>
              </p>
              <p>
                {{ $t('国际短信剩余次数') }}：<span class="count-sty">{{
                  ruleForm.intl_count
                }}</span>
              </p>
            </div>
            <div class="bottom-right">
              <el-button class="buy-sty" @click="buying">{{ $t('购买') }}</el-button>
            </div>
          </div>
          <!-- <div class="details-sty" @mouseenter="templateDetails">
            <i class="el-icon-s-order"></i>
            {{$t('详情')}}
          </div> -->
          <!-- <div class="details-sty" @click="alertSms">
            <i class="el-icon-s-order"></i>
            {{$t('预警')}}
          </div> -->
          <!-- <div class="details-sty" @mouseenter="purchase">
            <i class="el-icon-s-order"></i>
            {{$t('购买记录')}}
          </div> -->
          <el-button @click="templateDetails(1)" class="btn-main">{{ $t('详情') }}</el-button>
          <el-button @click="purchase" class="btn-main">{{ $t('购买记录') }}</el-button>
        </div>
      </el-col>
      <el-col :span="10" class="user-left">
        <div class="new-top">
          <el-radio class="system-sty" @change="changeType" v-model="ruleForm.type" :label="1">{{
            $t('第三方短信服务')
          }}</el-radio>
          <div style="display: flex; margin-top: 20px">
            <div style="flex: 2">
              <div>{{ $t('聚合') }}</div>
              <div class="message-main">
                <span>{{ $t('中国大陆短信服务——Appkey') }}：</span><br />
                <el-input class="input-sty" v-model="ruleForm.app_key"></el-input>
                <el-button class="buy-sty" @click="test('china')">{{ $t('测试') }}</el-button>
              </div>
              <div class="message-main">
                <span>{{ $t('国际短信服务——Appkey') }}：</span><br />
                <el-input class="input-sty" v-model="ruleForm.intl_app_key"></el-input>
                <el-button class="buy-sty" @click="test('inl')">{{ $t('测试') }}</el-button>
              </div>
            </div>
            <div style="width: 260px">
              <div>Aestron</div>
              <el-form :model="ruleForm.aestron">
                <el-form-item label="SenderId">
                  <el-input
                    class="ipt"
                    placeholder="请输入SenderId,只允许输入数字或者字母"
                    v-model="ruleForm.aestron.sender_id"
                    @input="
                      ruleForm.aestron.sender_id = ruleForm.aestron.sender_id.replace(
                        /[^\w\.\/]/gi,
                        ''
                      )
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item label="AppId">
                  <el-input
                    placeholder="请输入AppId"
                    class="ipt"
                    v-model="ruleForm.aestron.app_id"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Certificate">
                  <el-input
                    class="ipt"
                    placeholder="请输入Certificate"
                    v-model="ruleForm.aestron.certificate"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div>
            <el-form label-width="100px" label-position="left">
              <el-form-item :label="$t('中国大陆')">
                <el-radio-group v-model="ruleForm.area_china_platform">
                  <el-radio :label="1">{{ $t('聚合') }}</el-radio>
                  <!-- <el-radio :label="2">aestron</el-radio> -->
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('国际')">
                <el-radio-group v-model="ruleForm.area_intl_platform">
                  <el-radio :label="1">{{ $t('聚合') }}</el-radio>
                  <el-radio :label="2">Aestron</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
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
              {{ $t('暂不开启短信通知') }}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 短信模版（系统内） -->
    <div v-if="ruleForm.type === 2">
      <h2 class="template-sty">{{ $t('短信模版系统内') }}</h2>
      <!-- <el-button class="template-sty btn-green" @click="templateExample">{{$t('模版示例')}}</el-button> -->
      <div class="template-box">
        <div class="template-main">
          <div class="template-icon">
            <i class="el-icon-warning tip-icon"></i>
          </div>
          <div class="template-msg">
            {{
              $t(
                '变量说明：包裹单号#package#；订单号#order#；充值/扣款金额#amount#；自提点名称#warehouse#'
              )
            }}<br />
            {{ $t('自提点名称#warehouse；作废原因#reason_of_invalidation#') }}
          </div>
        </div>
      </div>
      <div class="svs-template">
        <el-row :gutter="20">
          <el-col :span="10" v-for="item in smsData" :key="item.id">
            <div class="tootip-sty">
              <div style="width: 130px; display: inline-block">
                {{ item.type_name }}
              </div>
              <el-tooltip
                class="item code-sty"
                effect="dark"
                :content="item.content"
                placement="top"
              >
                <span class="el-icon-warning"></span>
              </el-tooltip>
            </div>
            <el-switch
              v-model="item.status"
              class="switch-sty"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 第三方短信服务 -->
    <div v-if="ruleForm.type === 1">
      <h2 class="template-sty">{{ $t('短信模版') }}</h2>
      <!-- <span class="red-title">({{ $t('聚合') }})</span> -->
      <span>（{{ $t('请输入第三方模版ID') }}）</span>
      <!-- <el-button class="template-sty btn-green">{{$t('模版示例')}}</el-button> -->
      <div style="padding: 0 20px">
        <el-tabs v-model="activeName" @tab-click="handleClick(2)">
          <el-tab-pane :label="$t('聚合')" name="0"></el-tab-pane>
          <el-tab-pane label="Aestron" name="1"></el-tab-pane>
        </el-tabs>
        <div v-if="activeName === '0'">
          <div class="template-box">
            <div class="template-main">
              <div class="template-icon">
                <i class="el-icon-warning tip-icon"></i>
              </div>
              <div class="template-msg">
                {{ $t('不填写或填写无效模版ID，默认为不发送该类型信息') }}<br />
                {{
                  $t(
                    '变量说明：包裹单号#package#；订单号#order#；充值/扣款金额#amount#；自提点名称#warehouse#'
                  )
                }}<br />
                {{ $t('自提点名称#warehouse；作废原因#reason_of_invalidation#') }}
              </div>
            </div>
          </div>
          <div class="svs-template">
            <el-form :model="ruleForm" label-width="130px">
              <el-row>
                <el-col :span="10" v-for="item in customerData" :key="item.id">
                  <el-form-item :label="item.type_name">
                    <el-input class="input-sty" v-model="item.template_id"></el-input>
                    <el-input class="input-sty" v-model="item.intl_template_id"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- <div class="template-main">
            <div class="template-icon">
              <i class="el-icon-warning code-sty"></i>
            </div>
            <div class="template-msg">
              {{ $t('不填写或填写无效模版ID，默认为不发送该类型信息') }}<br />
              {{
                $t(
                  '变量说明：包裹单号#package#；订单号#order#；充值/扣款金额#amount#；自提点名称#warehouse#'
                )
              }}<br />
              {{ $t('自提点名称#warehouse；作废原因#reason_of_invalidation#') }}
            </div>
          </div> -->
          </div>
        </div>
        <div v-else>
          <div class="template-box">
            <div class="template-main">
              <div class="template-icon">
                <i class="el-icon-warning tip-icon"></i>
              </div>
              <div class="template-msg">
                {{
                  $t(
                    '变量说明：包裹单号#package#；订单号#order#；充值/扣款金额#amount#；自提点名称#warehouse#'
                  )
                }}<br />
                {{ $t('自提点名称#warehouse；作废原因#reason_of_invalidation#') }}
              </div>
            </div>
          </div>
          <el-table :data="tableData" border>
            <el-table-column type="index"></el-table-column>
            <el-table-column :label="$t('类型')" prop="type_name"></el-table-column>
            <el-table-column :label="$t('是否启用')" prop="status">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  @change="changeStart(scope.row.id, scope.row.status)"
                  :active-text="$t('开')"
                  :inactive-text="$t('关')"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="gray"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column :label="$t('短信描述')" prop="content"></el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="onEdit(scope.row.id)">{{
                  $t('编辑')
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin: 20px 0">
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="save-btn">
      <el-button type="primary" @click="saveTemplate">{{ $t('保存') }}</el-button>
    </div>
    <el-dialog class="details-dialog" :title="$t('详情')" :visible.sync="dialogVisible" width="55%">
      <div class="changeTime">
        <!-- 提交时间 -->
        <el-date-picker
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          @change="onTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
      </div>
      <el-table :data="templateData" border>
        <el-table-column :label="$t('发送时间')" prop="created_at"></el-table-column>
        <el-table-column :label="$t('短信类型')" prop="sub_type_name"></el-table-column>
        <el-table-column :label="$t('请求客户')">
          <template slot-scope="scope">
            <span>{{ scope.row.user_id }}--{{ scope.row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('请求号码')" prop="target"></el-table-column>
        <el-table-column :label="$t('请求类型')">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('国内') }}</span>
            <span v-if="scope.row.type === 2">{{ $t('国际') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('扣除次数')" prop="fee"> </el-table-column>
      </el-table>
      <div class="dialog-bottom">
        <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editDialog" width="30%" :title="$t('编辑')" @close="clear">
      <el-input
        v-model="form.content"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
      ></el-input>
      <div slot="footer">
        <el-button @click="editDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onSave">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      validate_email: '',
      ruleForm: {
        type: 1,
        app_key: '',
        intl_app_key: '',
        count: '',
        intl_count: '',
        area_china_platform: 1,
        area_intl_platform: 1,
        aestron: {
          sender_id: '',
          app_id: '',
          certificate: ''
        }
      },
      radio: 2,
      dialogVisible: false,
      templateData: [],
      smsData: [],
      customerData: [],
      begin_date: '',
      end_date: '',
      timeList: [],
      activeName: '0',
      tableData: [],
      editDialog: false,
      tmpId: '',
      form: {
        content: ''
      }
    }
  },
  created() {
    this.getService()
    this.timeList = this.timeDefault
  },
  computed: {
    // 默认时间
    timeDefault() {
      let date = new Date()
      // 通过时间戳计算
      let defalutStartTime = date.getTime() - 7 * 24 * 3600 * 1000 // 转化为时间戳
      let defalutEndTime = date.getTime()
      let startDateNs = new Date(defalutStartTime)
      let endDateNs = new Date(defalutEndTime)
      // 月，日 不够10补0
      defalutStartTime =
        startDateNs.getFullYear() +
        '-' +
        (startDateNs.getMonth() + 1 >= 10
          ? startDateNs.getMonth() + 1
          : '0' + (startDateNs.getMonth() + 1)) +
        '-' +
        (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      defalutEndTime =
        endDateNs.getFullYear() +
        '-' +
        (endDateNs.getMonth() + 1 >= 10
          ? endDateNs.getMonth() + 1
          : '0' + (endDateNs.getMonth() + 1)) +
        '-' +
        (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      return [defalutStartTime, defalutEndTime]
    }
  },
  methods: {
    // 获取短信服务数据
    getService() {
      this.$request.getSms().then(res => {
        this.ruleForm = res.data
        console.log(this.ruleForm, 'this.ruleForm')
        this.changeType()
      })
    },
    // 获取第三方服务短信
    getThird() {
      this.$request.getSms().then(res => {
        this.ruleForm = res.data
        this.changeType()
      })
    },
    // 测试
    test(status) {
      this.$request
        .verifyConfigs({
          juhe_key: status === 'china' ? this.ruleForm.app_key : this.ruleForm.intl_app_key,
          is_intl: status === 'china' ? 0 : 1
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 切换短信服务
    changeType() {
      this.smsData = []
      this.customerData = []
      console.log(this.ruleForm.type, 'type')
      if (this.ruleForm.type === 2) {
        this.getSms()
      } else if (this.ruleForm.type === 1) {
        this.getCustomer()
      }
    },
    // 获取短信模版数据
    getSms() {
      this.$request.getSmsSystem().then(res => {
        if (res.ret) {
          this.smsData = res.data
        }
      })
    },
    // 获取第三方短信服务
    getCustomer() {
      this.$request.getCustomSystem().then(res => {
        if (res.ret) {
          this.customerData = res.data
        }
      })
    },
    // 购买
    buying() {
      dialog({ type: 'buyingService', state: 'sms' }, () => {
        this.getService()
      })
    },
    // 预警
    alertSms() {
      dialog({ type: 'alertSettings', state: 'sms' })
    },
    // 购买记录
    purchase() {
      dialog({ type: 'purchaseHistory', state: 'sms' })
    },
    // 详情
    templateDetails(type) {
      this.dialogVisible = true
      this.getList(type)
      // smsRecord
    },
    // 获取详情
    getList(type) {
      if (type === 1) {
        this.begin_date = this.timeList[0]
        this.end_date = this.timeList[1]
        let params = {
          page: this.page_params.page,
          size: this.page_params.size
        }
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
        this.$request.smsRecord(params).then(res => {
          if (res.ret) {
            this.templateData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
      } else {
        this.$request
          .smsTemplateList({
            page: this.page_params.page,
            size: this.page_params.size
          })
          .then(res => {
            if (res.ret) {
              this.tableData = res.data
              this.page_params.page = res.meta.current_page
              this.page_params.total = res.meta.total
            }
          })
      }
    },
    // 提交时间
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      console.log(this.begin_date, 'begin_date')
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList(1)
    },
    handleClick(type) {
      if (this.activeName === '1') {
        // this.getTemplateList()
        this.getList(type)
      }
    },
    // getTemplateList() {
    //   this.$request
    //     .smsTemplateList({
    //       page: this.page_params.page,
    //       size: this.page_params.size
    //     })
    //     .then(res => {
    //       if (res.ret) {
    //         this.tableData = res.data
    //         this.page_params.page = res.meta.current_page
    //         this.page_params.total = res.meta.total
    //       }
    //     })
    // },
    changeStart(id, status) {
      console.log(id, status)
      this.$request.smsTmpSwitch(id, Number(status)).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          // this.getTemplateList()
          this.getList(2)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onEdit(id) {
      this.tmpId = id
      this.editDialog = true
      this.getSmsDetail(id)
    },
    getSmsDetail(id) {
      console.log(id)
      this.$request.smsTmpDetail(id).then(res => {
        if (res.ret) {
          this.form.content = res.data.content
        }
      })
    },
    onSave() {
      this.$request.smsTmpEdit(this.tmpId, { content: this.form.content }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.editDialog = false
          // this.getTemplateList()
          this.getList(2)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    clear() {
      this.form.content = ''
    },
    // 保存
    saveTemplate() {
      console.log(this.smsData, 'this.smsData')
      console.log(this.customerData, 'this.customerData')
      console.log(typeof this.customerData, 'this.customerData')
      this.$request
        .updateSmsSystem({
          templates: this.ruleForm.type === 2 ? this.smsData : this.customerData,
          type: this.ruleForm.type,
          intl_app_key: this.ruleForm.intl_app_key,
          app_key: this.ruleForm.app_key,
          area_china_platform: this.ruleForm.area_china_platform,
          area_intl_platform: this.ruleForm.area_intl_platform,
          aestron: this.ruleForm.aestron
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.changeType()
            this.getService()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    }
  }
}
</script>
<style lang="scss">
.sms-service-container {
  background-color: #f5f5f5 !important;
  padding: 20px;
  .new-top {
    margin-bottom: 10px;
    padding: 20px;
    background: #fff;
    height: 450px;
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
  }
  .user-left {
    // margin-left: 20px;
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
    margin-top: 25px;
    .input-sty {
      margin-top: 5px;
      width: 60%;
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
    // margin-left: 20px;
    .input-sty {
      width: 50%;
    }
  }
  .save-btn {
    margin-top: 50px;
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
  .tootip-sty {
    display: inline-block;
    width: 160px;
    margin-bottom: 20px;
  }
  .template-box {
    width: 800px;
    padding: 10px;
    margin: 20px 0;
    background-color: #fef0f0;
  }
  .template-main {
    .template-icon {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    .template-msg {
      display: inline-block;
      font-size: 14px;
      // color: #ccc;
      color: red;
      vertical-align: middle;
    }
    .tip-icon {
      color: red;
    }
  }
  .red-title {
    color: red;
  }
}
.details-dialog {
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .dialog-bottom {
    margin-top: 20px;
  }
  .changeTime {
    margin-bottom: 20px;
  }
}
</style>

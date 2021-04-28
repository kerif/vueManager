<template>
  <div class="mail-configure">
    <div class="logistics-container">
      <div class="form-title">{{ $t('邮箱发件信息配置') }}</div>
      <el-form
        :model="logisticsData"
        ref="ruleForm"
        class="ruleForm-sty"
        label-position="left"
        label-width="150px"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('发件人邮件')" prop="from_address">
              <el-input
                v-model="logisticsData.from_address"
                placeholder="请输入发件人邮件"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('发件人名称')" prop="from_name">
              <el-input
                v-model="logisticsData.from_name"
                :placeholder="$t('请输入发件人名称')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('SMTP域名')" prop="host">
              <el-input v-model="logisticsData.host" :v-html="$t('请输入SMTP域名')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('SMTP端口')" prop="port">
              <el-input v-model="logisticsData.port" :placeholder="$t('请输入SMTP端口')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('发件人用户名')" prop="username">
              <el-input
                v-model="logisticsData.username"
                placeholder="请输入发件人用户名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('发件人密码')" prop="password">
              <el-input
                class="logistic-sty"
                type="password"
                v-model="logisticsData.password"
                :placeholder="$t('请输入发件人密码')"
              ></el-input>
              <div class="test-btn">
                <el-button class="btn-light-red" @click="testSmtp">{{ $t('测试') }}</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('加密方式')">
              <el-radio-group v-model="logisticsData.encryption">
                <el-radio :label="0">{{ $t('无') }}</el-radio>
                <el-radio :label="1">{{ $t('TLS加密') }}</el-radio>
                <el-radio :label="2">{{ $t('SSL加密') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-button
              :loading="$store.state.btnLoading"
              class="save-btn"
              @click="confirmLogistic('ruleForm')"
              >{{ $t('保存') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="form-title">{{ $t('邮件配置') }}</div>
    <div class="select-box">
      <!-- <search-select :placeholder="$t('请选择')" :selectArr="emailType"
            v-model="page_params.type" @search="onGroupChange">
          </search-select> -->
      <el-select
        v-model="page_params.type"
        @change="onGroupChange"
        clearable
        :placeholder="$t('请选择')"
      >
        <el-option v-for="item in emailType" :key="item.id" :value="item.id" :label="item.name">
        </el-option>
      </el-select>
      <add-btn router="emailAdd">{{ $t('添加邮件模版') }}</add-btn>
    </div>
    <el-table
      :data="emailData"
      v-loading="tableLoading"
      class="data-list"
      border
      stripe
      height="550"
    >
      <el-table-column type="index"></el-table-column>
      <!-- 模版类型 -->
      <el-table-column :label="$t('模版类型')" prop="type_name"> </el-table-column>
      <!-- 邮件标题 -->
      <el-table-column :label="$t('邮件标题')" prop="title"></el-table-column>
      <el-table-column :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeEmail($event, scope.row.enabled, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column :label="$t('创建时间')" prop="created_at"></el-table-column>
      <el-table-column
        :label="item.name"
        v-for="item in formatLangData"
        :key="item.id"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row['trans_' + item.language_code]"
            class="el-icon-check icon-sty"
            @click="onEmail(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="onEmail(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="150">
        <template slot-scope="scope">
          <el-button class="btn-dark-green" @click="editEmail(scope.row.id)">{{
            $t('编辑')
          }}</el-button>
          <el-button class="btn-light-red" @click="deleteEmail(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="logistics-container">
      <!-- <div class="form-title">{{ $t("快递100配置") }}</div> -->
      <!-- <el-form-item label="Customer ID" prop="kd100_app_id">
          <el-input
            v-model="logisticsData.kd100_app_id"
            :placeholder="$t('请输入Customer ID')"
            class="logistic-sty"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('授权KEY')" prop="kd100_app_key">
          <el-input
            v-model="logisticsData.kd100_app_key"
            :placeholder="$t('请输入授权KEY')"
            class="logistic-sty"
          ></el-input>
          <div class="test-btn">
            <el-button class="btn-light-red" @click="testExpress">{{
              $t("测试")
            }}</el-button>
          </div>
        </el-form-item>
        <div class="form-title">{{ $t("Tracking more配置") }}</div>
        <el-form-item label="Appkey" prop="trackingmore_key">
          <el-input
            v-model="logisticsData.trackingmore_key"
            :placeholder="$t('请输入AppSecret')"
            class="logistic-sty"
          ></el-input>
          <div class="test-btn">
            <el-button class="btn-light-red" @click="testTracking">{{
              $t("测试")
            }}</el-button>
          </div>
        </el-form-item> -->
      <!-- <el-form-item :label="$t('开启邮箱登录验证')">
              <el-switch
                v-model="logisticsData.validate_email"
                :active-text="$t('开')"
                :active-value="1"
                :inactive-value="0"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </el-form-item> -->
      <!-- <div class="form-title">{{ $t("短信配置——聚合") }}</div>
        <el-form-item label="Appkey" prop="juhe_key">
          <el-input
            v-model="logisticsData.juhe_key"
            placeholder="请输入Appkey"
            class="logistic-sty"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('发送验证码模板ID')" prop="juhe_tpl_id">
          <el-input
            v-model="logisticsData.juhe_tpl_id"
            placeholder="请输入发送验证码模板ID"
            class="logistic-sty"
          ></el-input>
          <div class="test-btn">
            <el-button class="btn-light-red" @click="testJuhe">{{
              $t("测试")
            }}</el-button>
          </div>
        </el-form-item> -->
      <!-- <el-form-item :label="$t('开启短信登录验证')">
              <el-switch
                v-model="logisticsData.validate_phone"
                :active-text="$t('开')"
                :active-value="1"
                :inactive-value="0"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </el-form-item> -->
    </div>
  </div>
</template>

<script>
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
export default {
  components: {
    AddBtn
  },
  mixins: [pagination],
  data() {
    return {
      tableLoading: false,
      languageData: [],
      page_params: {
        type: ''
      },
      emailType: [],
      emailData: [
        {
          enabled: true
        }
      ],
      logisticsData: {
        trackingmore_key: '',
        kd100_app_id: '',
        kd100_app_key: '',
        juhe_key: '',
        juhe_tpl_id: '',
        host: '',
        port: '',
        encryption: '',
        validate_email: '',
        validate_phone: '',
        username: '',
        password: '',
        from_address: '',
        from_name: ''
      }
    }
  },
  created() {
    this.getLanguageList()
    this.getLogisticsData()
    this.getEmail()
    this.getType()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    onGroupChange() {
      this.page_params.handleQueryChange('type', this.page_params.type)
      this.getEmail()
    },
    // 获取模版类型数据
    getType() {
      this.$request.emailType().then(res => {
        if (res.ret) {
          this.emailType = res.data
        }
      })
    },
    // 获取邮件模版
    getEmail() {
      this.tableLoading = true
      this.$request
        .getEmail({
          type: this.page_params.type
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.emailData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 邮件模版 开启或关闭
    changeEmail(event, enabled, id) {
      this.$request.closeEmail(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getEmail()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 邮件模版 修改语言
    onEmail(line, lang) {
      this.emailCode = line['trans_' + lang.language_code]
      this.$router.push({
        name: 'emailLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.emailCode
        }
      })
    },
    // 编辑邮件模版
    editEmail(id) {
      this.$router.push({
        name: 'emailEdit',
        params: {
          id: id
        }
      })
    },
    // 删除单条邮件模版
    deleteEmail(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteAloneEmail(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getEmail()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 检测快递100
    testExpress() {
      if (this.logisticsData.kd100_app_id === '') {
        return this.$message.error('请输入Customer ID')
      } else if (this.logisticsData.kd100_app_key === '') {
        return this.$message.error(this.$t('请输入授权KEY'))
      }
      this.$request
        .verifyKd100({
          kd100_app_id: this.logisticsData.kd100_app_id,
          kd100_app_key: this.logisticsData.kd100_app_key
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
      if (this.logisticsData.trackingmore_key === '') {
        return this.$message.error('请输入Customer ID')
      }
      this.$request
        .verifyTrackingMore({
          trackingmore_key: this.logisticsData.trackingmore_key
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
    // 检测邮件配置
    testSmtp() {
      if (this.logisticsData.from_address === '') {
        return this.$message.error(this.$t('请输入发件人邮件'))
      } else if (this.logisticsData.from_name === '') {
        return this.$message.error(this.$t('请输入发件人名称'))
      } else if (this.logisticsData.host === '') {
        return this.$message.error(this.$t('请输入SMTP域名'))
      } else if (this.logisticsData.port === '') {
        return this.$message.error(this.$t('请输入SMTP端口'))
      } else if (this.logisticsData.username === '') {
        return this.$message.error(this.$t('请输入发件人用户名'))
      } else if (this.logisticsData.password === '') {
        return this.$message.error(this.$t('请输入发件人密码'))
      }
      this.$request
        .verifySmtp({
          host: this.logisticsData.host,
          port: this.logisticsData.port,
          encryption: this.logisticsData.encryption,
          username: this.logisticsData.username,
          validate_phone: this.logisticsData.validate_phone,
          validate_email: this.logisticsData.validate_email,
          password: this.logisticsData.password,
          from_address: this.logisticsData.from_address,
          from_name: this.logisticsData.from_name
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
    // 检测Juhe
    testJuhe() {
      if (this.logisticsData.juhe_key === '') {
        return this.$message.error('请输入Appkey')
      } else if (this.logisticsData.juhe_tpl_id === '') {
        return this.$message.error('请输入发送验证码模板ID')
      }
      this.$request
        .verifyJuhe({
          juhe_key: this.logisticsData.juhe_key,
          juhe_tpl_id: this.logisticsData.juhe_tpl_id
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
    // 物流跟踪配置确认
    confirmLogistic(formName) {
      console.log(this.logisticsData.encryption, 'this.logisticsData.encryption')
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request
            .editLogistics({
              ...this.logisticsData
              // encryption: Number(this.logisticsData.encryption)
            })
            .then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.activeName = '1'
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
    },
    // 获取物流跟踪配置
    getLogisticsData() {
      this.$request.getLogistics().then(res => {
        if (res.ret && res.data) {
          this.logisticsData = res.data
          // this.logisticsData.encryption = Boolean(res.data.encryption)
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mail-configure {
  .ruleForm-sty {
    background-color: #fff;
    padding: 20px 20px 10px 20px;
    margin-bottom: 20px;
  }
  .save-btn {
    color: #fff;
    background-color: #3540a5;
  }
  .form-title {
    font-weight: bold;
    margin-bottom: 15px;
  }
  .test-btn {
    display: inline-block;
    margin-left: 20px;
  }
  .logistic-sty {
    width: 70% !important;
  }
}
</style>

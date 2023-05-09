<template>
  <div class="warehouse-addEdit-container">
    <div class="tips-box">
      <span class="tips-title">{{ $t('温馨提示') }}: </span>
      <span class="tips-content">{{
        $t('当前页面配置的地址为用户发往仓库的真实收件地址请填写有效准确的信息请不要填写座机')
      }}</span>
    </div>
    <div class="warehouse-info">
      <div class="info-left">
        <el-form
          label-position="left"
          class="warehouse-form"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
        >
          <!-- 仓库名称 -->
          <el-form-item :label="$t('仓库名称')" prop="warehouse_name">
            <el-row>
              <el-col :span="20">
                <el-input
                  :placeholder="$t('请输入内容')"
                  v-model="ruleForm.warehouse_name"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('收件人姓名')" prop="receiver_name">
            <el-row>
              <el-col :span="10">
                <el-input
                  :placeholder="$t('请输入内容')"
                  v-model="ruleForm.receiver_name"
                  @input='replaceUserId'
                ></el-input>
              </el-col>
            </el-row>
            <div class="tip-line">
              {{
                $t('您可以在收件人姓名中输入{user_id}或{USER_ID}将自动转化成用户ID或大写的中文数字')
              }}
            </div>
          </el-form-item>
          <el-form-item :label="$t('联系电话')" prop="phone">
            <el-row>
              <el-col :span="20">
                <el-input :placeholder="$t('请输入内容')" v-model="ruleForm.phone"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('邮编')" prop="postcode">
            <el-row>
              <el-col :span="10">
                <el-input :placeholder="$t('请输入内容')" v-model="ruleForm.postcode"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('打印面单地址')" prop="short_address">
            <el-row>
              <el-col :span="20">
                <el-input
                  :placeholder="$t('请输入内容')"
                  v-model="ruleForm.short_address"
                ></el-input>
              </el-col>
            </el-row>
            <div class="tip-line" style='color: #c5c5c6'>
              {{
                $t('*个别出货面单的仓库发件人地址从这里读取')
              }}
            </div>
          </el-form-item>
          <el-form-item :label="$t('')" prop="city">
            <el-row>
              <el-col
                :span="8"

                style="display: flex; align-items: center; flex-direction: row"
              >
                <span style="padding-right: 8px">{{ $t('省') }}</span>
                <el-input :placeholder="$t('请输入')" v-model="ruleForm.province"></el-input>
              </el-col>
              <el-col :span="8" :offset="4" style="display: flex; align-items: center; flex-direction: row">
                <span style="width: 40px">{{ $t('城市') }}</span>
                <el-input :placeholder="$t('请输入')" v-model="ruleForm.city"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <!--          <el-form-item :label="$t('省')" prop="province">-->
          <!--            <el-row>-->
          <!--              <el-col :span="10">-->
          <!--                <el-input :placeholder="$t('请输入')" v-model="ruleForm.province"></el-input>-->
          <!--              </el-col>-->
          <!--            </el-row>-->
          <!--          </el-form-item>-->
          <el-form-item :label="$t('详细收货地址')" prop="address">
            <el-row>
              <el-col :span="20">
                <el-input
                  :placeholder="$t('请输入内容')"
                  type="textarea"
                  :row="3"
                  @input='replaceUserId'
                  v-model="ruleForm.address"
                ></el-input>
              </el-col>
            </el-row>
            <div class="tip-line">
              {{
                $t('您可以在收件人姓名中输入{user_id}或{USER_ID}将自动转化成用户ID或大写的中文数字')
              }}
            </div>
          </el-form-item>
          <el-form-item prop="ignore_lon_lat">
            <el-row>
              <el-col :span="10">
                <div>
                  <span class="address-sty">{{ $t('忽略地址精确度检查') }}</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('选择开启会忽略当次地址精确度检查')"
                    placement="top"
                  >
                    <span class="el-icon-question icon-info"></span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="10" class="radio-box">
                <el-radio-group v-model="ruleForm.ignore_lon_lat">
                  <el-radio :label="1">{{ $t('开启') }}</el-radio>
                  <el-radio :label="0">{{ $t('关闭') }}</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-form-item>

          <el-row>
            <el-col :span="10">
              <el-form-item>
                <div slot="label">
                  <span class="address-sty">{{ $t('免费仓储期天') }}</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('仓储期按自然日计算称重当日为仓储第一天')"
                    placement="top"
                  >
                    <span class="el-icon-question icon-info"></span>
                  </el-tooltip>
                </div>
                <el-input-number
                  v-model="ruleForm.free_store_days"
                  :min="0"
                  :max="999"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="4">
              <el-form-item
                :label="`${$t('超期收费')}${
                  localization.currency_unit ? localization.currency_unit : ''
                }/${$t('天')}`"
              >
                <el-input style="width: 40%" v-model="ruleForm.store_fee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="tips-info">
            <el-form-item
              :label="$t('温馨提示主要提醒客户需要注意的事项在客户端仓库地址页面显示')"
              prop="tips"
            >
              <el-row>
                <el-col :span="20">
                  <el-input
                    :placeholder="$t('请输入温馨提示')"
                    type="textarea"
                    :row="6"
                    v-model="ruleForm.tips"
                  ></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </div>

          <el-form-item prop="support_countries" :label="$t('支持国家地区')">
            <el-col :span="10">
              <el-select
                v-model="ruleForm.support_countries"
                multiple
                filterable
                ref="select"
                collapse-tags
                class="country-select"
                @change="handleSelect"
                :placeholder="$t('请选择国家地区')"
                @remove-tag="removeTag"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" class="country-btn">
              <el-button type="primary" @click="onAddCountry">+ {{ $t('新增国家地区') }}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('自动货位功能')">
            <el-row>
              <el-col :span="10">
                <el-radio-group v-model="ruleForm.auto_location">
                  <el-radio :label="1">{{ $t('开启') }}</el-radio>
                  <el-radio :label="0">{{ $t('关闭') }}</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="10">
                <span style="padding-right: 16px">{{ $t('是否同行货') }}</span>
                <el-radio-group v-model="ruleForm.is_stg">
                  <el-radio :label="0">{{ $t('否') }}</el-radio>
                  <el-radio :label="1">{{ $t('是') }}</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-form-item>
          <!--          <el-form-item :label="$t('是否同行货')">-->
          <!--            <el-row>-->
          <!--              <el-col :span="10">-->
          <!--                <el-radio-group v-model="ruleForm.is_stg">-->
          <!--                  <el-radio :label="0">{{ $t('否') }}</el-radio>-->
          <!--                  <el-radio :label="1">{{ $t('是') }}</el-radio>-->
          <!--                </el-radio-group>-->
          <!--              </el-col>-->
          <!--            </el-row>-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button
              type="primary"
              class="save-btn"
              @click="submit('ruleForm')"
              :loading="$store.state.btnLoading"
              >{{ $t('保存') }}</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="preview-info">
        <div class="preview-title">
          {{ $t('预览区域') }}
        </div>
        <div class="preview-look">
          <div class="preview-line">
            <span class="line-name">{{ ruleForm.warehouse_name }}</span>
            <el-button @click="copyNumber(ruleForm.warehouse_name)">{{ $t('一键复制') }}</el-button>
          </div>
          <div>
            <div class="tips">{{ $t('收件人') }}</div>
            <div class="preview-line">
              <span class="line-name">{{ preview_receiver_name }}</span>
              <el-button @click="copyNumber(preview_receiver_name)">{{ $t('复制') }}</el-button>
            </div>
          </div>
          <div>
            <div class="tips">{{ $t('收件电话') }}</div>
            <div class="preview-line">
              <span class="line-name">{{ ruleForm.phone }}</span>
              <el-button @click="copyNumber(ruleForm.phone)">{{ $t('复制') }}</el-button>
            </div>
          </div>
          <div>
            <div class="tips">{{ $t('详细地址') }}</div>
            <div class="preview-line">
              <span class="line-name">{{ preview_address }}</span>
              <el-button @click="copyNumber(preview_address)">{{ $t('复制') }}</el-button>
            </div>
          </div>
          <div>
            <div class="tips">{{ $t('邮政邮编') }}</div>
            <div class="preview-line">
              <span class="line-name">{{ ruleForm.postcode }}</span>
              <el-button @click="copyNumber(ruleForm.postcode)">{{ $t('复制') }}</el-button>
            </div>
          </div>
          <div class="store-time">
            <div class="preview-line">
              <span class="tips">{{ $t('免费仓储') }}</span>
              <span
                >免费仓储{{ ruleForm.free_store_days }}天，超期收取{{ ruleForm.store_fee }}/天</span
              >
            </div>
          </div>
          <div class="store-time">
            <div class="tips" style="margin-bottom: 16px">{{ $t('温馨提示') }}</div>
            <div class="tips-line">
              <span>{{ ruleForm.tips }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        receiver_name: '',
        warehouse_name: '',
        phone: '',
        postcode: '',
        short_address: '',
        address: '',
        tips: '',
        store_fee: '',
        auto_location: 0,
        free_store_days: 0,
        ignore_lon_lat: 1,
        support_countries: [],
        is_stg: 0,
        city: '',
        province: ''
      },
      all: [
        {
          id: -1,
          name: '全选'
        }
      ],
      options: [],
      localization: {},
      rules: {
        warehouse_name: [{ required: true, message: this.$t('请输入仓库名称'), trigger: 'blur' }],
        receiver_name: [{ required: true, message: this.$t('请输入收件人姓名'), trigger: 'blur' }],
        phone: [{ required: true, message: this.$t('请输入联系电话'), trigger: 'blur' }],
        postcode: [{ required: true, message: this.$t('请输入邮编'), trigger: 'blur' }],
        address: [{ required: true, message: this.$t('请输入地址'), trigger: 'blur' }],
        tips: [{ required: true, message: this.$t('请输入温馨提示'), trigger: 'blur' }],
        support_countries: [
          { required: true, message: this.$t('请选择国家或地区'), trigger: 'blur' }
        ]
      },
      preview_receiver_name:null,
      preview_address:null,

    }
  },
  created() {
    this.getCountry()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    //复制
    copyNumber(value) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', value)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    },
    getList() {
      this.$request.aloneWarehouseAddress(this.$route.params.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.ruleForm.support_countries = res.data.support_countries.map(item => item.id)
          this.ruleForm.ignore_lon_lat = res.data.ignore_lon_lat || 1
          this.replaceUserId()
        }
      })
    },
    //替换user_id
    replaceUserId() {
      console.log(this.ruleForm.receiver_name.indexOf('USER_ID'))
      this.preview_receiver_name = this.ruleForm.receiver_name.replace('{USER_ID}','壹贰叁肆伍')
      this.preview_receiver_name = this.preview_receiver_name.replace('{user_id}','12345')
      this.preview_address = this.ruleForm.address.replace('{USER_ID}','壹贰叁肆伍')
      this.preview_address = this.preview_address.replace('{user_id}','12345')
    },
    // 添加国家或地区
    onAddCountry() {
      dialog(
        {
          type: 'addcountry'
        },
        () => {
          this.getCountry()
        }
      )
    },
    // 获取支持国家数据
    getCountry() {
      this.$request.getEnabledCountry().then(res => {
        this.options = res.data
        this.options.unshift({ id: -1, name: '全选' })
        this.localization = res.localization
      })
    },
    handleSelect(val) {
      if (val.includes(-1)) {
        this.ruleForm.support_countries = this.options.map(item => {
          return item.id
        })
      } else if (val.includes(-1) && val.length - 1 < this.options.length) {
        this.ruleForm.support_countries = this.ruleForm.support_countries.filter(item => {
          return item.id !== -1
        })
      }
    },
    removeTag(tag) {
      if (tag === -1) {
        this.ruleForm.support_countries = []
      }
    },
    submit(formName) {
      // 编辑状态
      this.ruleForm.support_countries = this.ruleForm.support_countries.filter(item => item !== -1)
      if (this.$route.params.id) {
        this.$request
          .editWarehouseAddress(this.$route.params.id, { ...this.ruleForm })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.$router.push({ name: 'warehouse' })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$request.addWarehouseAddress({ ...this.ruleForm }).then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.$router.push({ name: 'warehouse' })
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
      }
    }
  }
}
</script>
<style lang="scss">
.warehouse-addEdit-container {
  padding: 0 16px;
  height: 100%;
  .tips-box {
    padding: 20px 0;
    line-height: 30px;
    background-color: #f6f6d1;
    margin: 20px 20px 20px 0;
    display: inline-block;
    border-radius: 5px;
    border: 1px solid #f0d191;
    width: 100%;
  }
  .tips-title {
    font-weight: bold;
    padding-left: 20px;
  }
  .tips-content {
    font-size: 14px;
  }
  .warehouse-info {
    display: flex;
    gap: 20px;
    .info-left {
      flex: 3;
      padding: 16px;
      background-color: #fff !important;
      overflow-y: auto;
    }
    .preview-info {
      flex: 2;
      display: flex;
      flex-direction: column;
      .preview-title {
        font-size: 20px;
        font-weight: bold;
      }
      .preview-look {
        flex: 1;
        padding: 20px;
        margin-top: 8px;
        background-color: #fff !important;
        .tips {
          font-size: 16px;
          color: #a7a7a7;
        }
        .preview-line {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #eaeaea;
          align-items: center;
          padding-bottom: 16px;
          margin-bottom: 16px;
          .line-name {
            font-size: 18px;
            font-weight: bold;
          }
        }
        .store-time {
          margin-top: 30px;
        }
        .tips-line {
          span {
            font-size: 18px;
            font-weight: 500;
          }
        }
      }
    }
  }
  .warehouse-form {
    // padding-left: 50px;
    .tip-line {
      line-height: 20px;
      color: #ffd194;
    }
    .radio-box {
      display: flex;
      justify-content: end;
      height: 40px;
      align-items: center;
    }
    .tips-info {
      .el-form-item {
        display: flex;
        flex-direction: column;
      }
      .el-form-item__label {
        width: 100% !important;
      }
    }
  }
  .save-btn {
    min-width: 100px;
  }
  .country-select {
    width: 100%;
  }
  .el-tag.el-tag--info {
    border-color: #3540a5;
    color: #3540a5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540a5;
    background-color: #fff;
  }
  .country-btn {
    margin-left: 15px;
    .el-button--primary {
      background-color: #eaecf5;
      border-color: #eaecf5;
      color: #3540a5;
    }
  }
  .icon-info {
    color: #74b34f;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .address-sty {
    color: #606266;
  }
}
</style>

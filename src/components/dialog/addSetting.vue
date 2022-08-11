<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('新增') : $t('修改')"
    class="dialog-add-setting"
    width="55%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <!-- 支付类型名称 -->
      <el-form-item :label="$t('*支付类型名称')">
        <el-input v-model="ruleForm.name"> </el-input>
      </el-form-item>
      <!-- 收款姓名与账号 -->
      <!-- <el-form-item :label="$t('收款姓名与账号')">
        <el-input v-model="ruleForm.account"> </el-input>
      </el-form-item> -->
      <!-- 备注 -->
      <el-form-item :label="$t('备注')">
        <el-input
          type="textarea"
          v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="state === 'add'" class="add-btn" @click="addPay('add')">{{
          $t('新增')
        }}</el-button>
        <el-button type="primary" v-else class="add-btn" @click="addPay('edit')">{{
          $t('新增')
        }}</el-button>
        <el-table :data="ruleForm.payment_setting_connection" border style="width: 100%">
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="name" :label="$t('提示名称')"> </el-table-column>
          <el-table-column prop="content" :label="$t('提示内容')"> </el-table-column>
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
                @click="onLang(scope.row, item, 'edit')"
              ></span>
              <span
                v-else
                class="el-icon-plus icon-sty"
                @click="onLang(scope.row, item, 'add')"
              ></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button
                size="small"
                v-if="state === 'edit'"
                @click="editPay('edit', scope.$index, scope.row.id)"
                >{{ $t('编辑') }}</el-button
              >
              <el-button size="small" v-else @click="editPay('add', scope.$index, scope.row.id)">{{
                $t('编辑')
              }}</el-button>
              <el-button size="small" v-if="state === 'edit'" @click="deletePay(scope.row.id)">{{
                $t('删除')
              }}</el-button>
              <el-button
                size="small"
                v-else
                @click="onDeletePay(scope.$index, ruleForm.payment_setting_connection)"
                >{{ $t('删除') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item :label="$t('上传收款二维码')" class="updateChe">
        <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="baleImgList.length < 1"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <span>{{ $t('结算时显示汇率转换后价格') }}</span>
        <el-tooltip
          class="item code-sty"
          effect="dark"
          :content="$t('仅新增显示，方便审核收款与核对账目，不改变系统结算数据')"
          placement="top"
        >
          <span class="el-icon-question icon-info"></span>
        </el-tooltip>
        <el-switch
          v-model="ruleForm.show_rate"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
      <el-form-item>
        <span>{{ $t('当前结算货币为') }}：</span>
        <span>{{ current }}</span>
      </el-form-item>
      <el-form-item :label="$t('汇率转换显示')">
        <el-select v-model="ruleForm.currency" clearable placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="ruleForm.rate_type" @change="clearRate">
          <el-radio :label="0" class="radio-sty">{{
            $t('获取实时汇率（以客户提交支付汇率为准）')
          }}</el-radio
          ><br />
          <el-radio :label="1">{{ $t('固定汇率') }} </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="ruleForm.rate_type === 1">
        1{{ current }}{{ currentCode }} = &nbsp;
        <el-input
          class="input-sty"
          v-model="ruleForm.rate"
          :placeholder="$t('请输入转换汇率')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button :loading="$store.state.btnLoading" type="primary" @click="confirm">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      languageData: [],
      id: '',
      ruleForm: {
        name: '',
        payment_setting_connection: [],
        remark: '',
        account: '',
        show_rate: 0,
        currency: '',
        rate: '',
        rate_type: 0,
        qr_code: []
      },
      state: '',
      current: '',
      currentCode: '',
      options: [],
      value: '',
      tranAmount: '',
      baleImgList: []
    }
  },
  created() {},
  computed: {
    payment_setting_connection() {
      return this.ruleForm.payment_setting_connection
    },
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    // 获取支持语言
    getLanguageList() {
      if (this.state === 'add') return
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getPayLang() {
      console.log(this.id)
      this.$request.getPayLang(this.id).then(res => {
        if (res.ret) {
          this.ruleForm.payment_setting_connection = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取汇率列表
    getRate() {
      this.$request.getAllRate().then(res => {
        if (res.ret) {
          this.options = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取当前结算货币
    getCurrent() {
      this.$request.currencyPayment().then(res => {
        if (res.ret) {
          this.current = res.data.name
          this.currentCode = res.data.code
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //新增转账支付内容
    addPay(status) {
      dialog(
        {
          type: 'addPay',
          title: this.$t('新增'),
          id: this.id,
          status
        },
        data => {
          if (status === 'add') {
            if (data.name && data.content) {
              this.ruleForm.payment_setting_connection.push(data)
            }
          } else {
            this.getList()
          }
        }
      )
    },
    //修改转账支付内容
    editPay(status, index, payId) {
      dialog(
        {
          type: 'editPay',
          title: this.$t('修改'),
          id: this.id,
          status,
          payId,
          payData: {
            name: this.ruleForm.payment_setting_connection[index].name,
            content: this.ruleForm.payment_setting_connection[index].content
          }
        },
        data => {
          if (status === 'edit') {
            this.getList()
          } else {
            this.$set(this.ruleForm.payment_setting_connection, index, data)
          }
        }
      )
    },
    // 修改语言
    onLang(line, lang, mode) {
      this.payCode = line['trans_' + lang.language_code]
      dialog(
        {
          type: 'addPayLang',
          title: this.$t('收款人翻译内容'),
          line: line,
          lang: lang,
          mode,
          payCode: this.payCode
        },
        () => {
          this.getList()
        }
      )
    },
    onDeletePay(index, rows) {
      rows.splice(index, 1)
    },
    //删除转账支付内容
    deletePay(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deletePay(id).then(res => {
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
      })
    },
    getList() {
      this.$request.editPayments(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          res.data.qr_code && (this.baleImgList[0] = res.data.qr_code)
          this.getPayLang()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm() {
      if (this.baleImgList[0]) {
        this.ruleForm.qr_code = this.baleImgList[0]
      } else {
        this.ruleForm.qr_code = []
      }
      if (!this.ruleForm.name) {
        return this.$message.error(this.$t('请输入支付类型名称'))
      } else if (this.ruleForm.rate_type === 1 && !this.ruleForm.rate) {
        return this.$message.error(this.$t('请输入转换汇率'))
      }
      this.ruleForm.accounts = this.ruleForm.payment_setting_connection.map(item => {
        let account_name = item.name
        let account_content = item.content
        return {
          account_name,
          account_content
        }
      })
      if (this.state === 'add') {
        this.$request.addPayments(this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.updatePayments(this.id, this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        console.log(res)
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    clearRate() {
      if (this.ruleForm.rate_type === 0) {
        this.ruleForm.rate = ''
      }
    },
    clear() {
      this.state = ''
      this.ruleForm.name = ''
      this.ruleForm.payment_setting_connection = []
      this.ruleForm.remark = ''
      this.baleImgList = []
      this.ruleForm.qr_code = []
      this.ruleForm.account = ''
      this.ruleForm.show_rate = 0
      this.ruleForm.currency = ''
      this.ruleForm.currentCode = ''
      this.ruleForm.rate = ''
      this.ruleForm.rate_type = 0
    },
    init() {
      this.getRate()
      this.getCurrent()
      this.getLanguageList()
      if (this.state === 'edit') {
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-add-setting {
  .el-dialog__body {
    margin-left: 20px !important;
  }
  .el-input {
    width: 70%;
  }
  .el-textarea__inner {
    width: 70%;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__label {
      width: 500px !important;
    }
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
    margin-left: 50px;
  }
  .add-btn {
    float: right;
    margin-bottom: 20px;
  }
  .img-item {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    width: 148px;
    height: 148px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      .model-box,
      .operat-box {
        opacity: 1;
        transition: all 0.5s ease-in;
      }
    }
  }
  .model-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .operat-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    i {
      font-size: 20px;
      color: #fff;
      margin-right: 10px;
    }
  }
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
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
  .code-sty {
    padding-right: 10px;
  }
  .input-sty {
    width: 35% !important;
    display: inline-block;
    .el-input__inner {
      // width: 30%;
    }
  }
  .radio-sty {
    margin-bottom: 12px;
  }
}
</style>

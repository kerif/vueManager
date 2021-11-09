<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('请填写付款信息')"
    class="dialog-addPaid"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <!-- 客户ID -->
      <el-form-item :label="$t('客户ID')">
        <span class="right-padding">{{ user_id }} - {{ user_name }}</span>
      </el-form-item>
      <!-- 订单号 -->
      <el-form-item :label="$t('订单号')">
        <span class="right-padding">{{ order_sn }}</span>
      </el-form-item>
      <!-- 应付金额￥ -->
      <el-form-item :label="$t('应付金额￥')">
        <span class="right-padding">{{ actual_payment_fee }}</span>
      </el-form-item>
      <!-- *实付金额￥ -->
      <el-form-item :label="$t('实付金额￥')" prop="confirm_amount">
        <el-input
          class="input-sty"
          v-model="ruleForm.confirm_amount"
          :placeholder="$t('请输入支付金额')"
        ></el-input>
      </el-form-item>
      <!-- *支付方式￥ -->
      <el-form-item :label="$t('*支付方式￥')">
        <el-select
          style="margin-left: 50px"
          v-model="ruleForm.payment_id"
          placeholder="请选择支付方式"
          clearable
        >
          <el-option v-for="item in methodData" :key="item.id" :label="item.name" :value="item.id"
            >{{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 支付状态 -->
      <el-form-item :label="$t('支付状态')">
        <el-radio-group v-model="ruleForm.payStatus" style="margin-left: 50px">
          <el-radio :label="0">{{ $t('待审核') }}</el-radio>
          <el-radio :label="1">{{ $t('审核通过') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')">
        <el-input
          class="input-sty"
          type="textarea"
          v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请填写备注')"
        ></el-input>
      </el-form-item>
      <!-- 转账支付账号 -->
      <el-form-item :label="$t('转账支付账号')" v-if="ruleForm.payment_id">
        <el-input
          class="input-sty"
          v-model="ruleForm.transfer_account"
          :placeholder="$t('请填写转账账号')"
        ></el-input>
      </el-form-item>
      <!-- 外部交易号 -->
      <el-form-item :label="$t('外部交易号')" v-if="ruleForm.payment_id">
        <el-input
          class="input-sty"
          v-model="ruleForm.external_number"
          :placeholder="$t('请填写外部交易号')"
        ></el-input>
      </el-form-item>
      <!--截图-->
      <el-form-item :label="$t('截图')" v-if="ruleForm.payment_id">
        <span class="img-item" v-for="(item, index) in images" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="images.length < 3"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        confirm_amount: '',
        transfer_account: '',
        external_number: '',
        remark: '',
        payment_id: '',
        payStatus: 0
      },
      payment_id: '',
      images: [],
      user_id: '',
      order_sn: '',
      actual_payment_fee: '',
      user_name: '',
      methodData: [],
      show: false,
      id: ''
    }
  },
  methods: {
    getPayMethod() {
      this.$request.payMethod().then(res => {
        console.log(res)
        if (res.ret) {
          this.methodData = res.data
        }
      })
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.images.push(item.path)
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
      this.images.splice(index, 1)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    clear() {
      this.$refs['ruleForm'].resetFields()
      this.$refs['ruleForm'].clearValidate()
      this.ruleForm.confirm_amount = ''
      this.ruleForm.remark = ''
      this.ruleForm.transfer_account = ''
      this.ruleForm.external_number = ''
      this.images = []
    },
    init() {
      this.getPayMethod()
    },
    submit() {
      let info = {
        payment_id: this.ruleForm.payment_id,
        confirm_amount: this.ruleForm.confirm_amount,
        transfer_account: this.ruleForm.transfer_account,
        remark: this.ruleForm.remark,
        images: this.images
      }
      this.$request.paid(this.id, { ...info }).then(res => {
        if (res.ret) {
          console.log(res)
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
  }
}
</script>
<style lang="scss" scoped>
.dialog-addPaid {
  /deep/.input-sty {
    width: 40% !important;
    margin-left: 50px;
  }
  /deep/.el-textarea {
    width: 40% !important;
    margin-left: 50px;
  }
  /deep/.el-form-item__label {
    width: 200px;
  }
  /deep/ .el-dialog__header {
    background-color: #0e102a;
  }
  /deep/.el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-form-item__error {
    margin-left: 250px !important;
  }
  /deep/.el-dialog__close {
    color: #fff;
  }
  /deep/.avatar-uploader .el-upload {
    margin-left: 50px;
  }
  .right-padding {
    padding-left: 50px;
  }
}
</style>

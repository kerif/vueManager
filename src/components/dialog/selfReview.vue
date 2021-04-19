<template>
  <el-dialog :visible.sync="show" :title="$t('审核并支付')" class="dialog-add-setting" width="55%"
  @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 流水号 -->
        <el-form-item :label="$t('流水号')">
          <span>{{ruleForm.serial_no}}</span>
        </el-form-item>
        <!-- 结算自提点 -->
        <el-form-item :label="$t('账单日期')">
          <span>{{ruleForm.time}}</span>
        </el-form-item>
        <!-- 结算申请金额 -->
        <el-form-item :label="$t('结算申请金额') + `${localization.currency_unit ? localization.currency_unit : ''}`">
          <span>{{ruleForm.amount}}</span>
        </el-form-item>
        <!-- 确认金额 -->
        <el-form-item :label="$t('确认金额') + `${localization.currency_unit ? localization.currency_unit : ''}`">
          <el-input v-model="ruleForm.confirm_amount">
          </el-input>
        </el-form-item>
        <!-- 支付方式 -->
        <el-form-item :label="$t('支付方式')">
          <el-input v-model="ruleForm.payment_method">
          </el-input>
        </el-form-item>
        <!-- 支付截图 -->
        <el-form-item :label="$t('支付截图')" class="updateChe">
            <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
            <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
            <span class="model-box"></span>
            <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
            </span>
            </span>
            <el-upload
              v-show="baleImgList.length < 3"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadBaleImg"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
       </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button :loading="$store.state.btnLoading" type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      ruleForm: {
        confirm_amount: '',
        payment_method: '',
        payment_images: []
      },
      state: '',
      current: '',
      currentCode: '',
      options: [],
      value: '',
      tranAmount: '',
      baleImgList: [],
      localization: {},
      id: ''
    }
  },
  methods: {
    getList () {
      this.$request.aloneRecordsDetails(this.id).then(res => {
        if (res.ret) {
          this.ruleForm.serial_no = res.data.serial_no
          this.ruleForm.time = res.data.time
          this.ruleForm.amount = res.data.amount
          this.localization = res.localization
          // res.data.qr_code && (this.baleImgList[0] = res.data.qr_code)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm () {
      // console.log(this.ruleForm.show_rate, 'ruleForm.show_rate')
      if (this.baleImgList) {
        this.ruleForm.payment_images = this.baleImgList
      } else {
        this.ruleForm.payment_images = []
      }
      // if (!this.ruleForm.name) {
      //   return this.$message.error(this.$t('请输入支付类型名称'))
      // } else if (!this.ruleForm.remark && !this.baleImgList[0]) {
      //   return this.$message.error(this.$t('请输入备注'))
      // } else if (this.ruleForm.rate_type === 1 && !this.ruleForm.rate) {
      //   return this.$message.error(this.$t('请输入转换汇率'))
      // }
      this.$request.verifyRecords(this.id, this.ruleForm).then(res => {
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
        this.show = false
      })
    },
    // 上传打包照片
    uploadBaleImg (item) {
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
    onPreview (image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg (index) {
      this.baleImgList.splice(index, 1)
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    clear () {
      this.ruleForm.payment_method = ''
      this.ruleForm.confirm_amount = ''
      this.baleImgList = []
      this.ruleForm.payment_images = []
      this.id = ''
    },
    init () {
      this.getList()
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
      .model-box, .operat-box {
        opacity: 1;
        transition: all .5s ease-in;
      }
    }
  }
  .model-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, .3);
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
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
  .code-sty {
    padding-right: 10px;
  }
  .input-sty {
    width: 35% !important;
    // .el-input {
    // }
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

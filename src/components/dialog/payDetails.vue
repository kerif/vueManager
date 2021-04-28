<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('支付详情')"
    class="dialog-pay-details"
    width="55%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-width="100px">
      <!-- 流水号 -->
      <el-form-item :label="$t('流水号')">
        <span>{{ ruleForm.serial_no }}</span>
      </el-form-item>
      <!-- 结算自提点 -->
      <el-form-item :label="$t('结算自提点')">
        <span>{{ ruleForm.station_name }}</span>
      </el-form-item>
      <!-- 账单日期 -->
      <el-form-item :label="$t('账单日期')">
        <span>{{ ruleForm.time }}</span>
      </el-form-item>
      <!-- 结算申请金额 -->
      <el-form-item :label="$t('结算申请金额')">
        <span>{{ ruleForm.amount }}</span>
      </el-form-item>
      <!-- 确认金额 -->
      <el-form-item :label="$t('确认金额')">
        <span>{{ ruleForm.confirm_amount }}</span>
      </el-form-item>
      <!-- 支付方式 -->
      <el-form-item :label="$t('支付方式')">
        <span>{{ ruleForm.payment_method }}</span>
      </el-form-item>
      <!-- 支付截图 -->
      <el-form-item :label="$t('支付截图')" class="updateChe">
        <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <!-- <el-upload
              v-show="baleImgList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadBaleImg"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload> -->
      </el-form-item>
      <!-- 支付时间 -->
      <el-form-item :label="$t('支付时间')" v-if="state === 'details'">
        <el-input v-model="ruleForm.account"> </el-input>
      </el-form-item>
    </el-form>
    <!-- <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button :loading="$store.state.btnLoading" type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div> -->
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
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
      baleImgList: [],
      id: '',
      XStationId: ''
    }
  },
  methods: {
    getList() {
      this.$request.aloneRecordsDetails(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          res.data.payment_images && (this.baleImgList = res.data.payment_images)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自提点概览 支付详情
    pickData() {
      this.$request
        .pickRecordDetails(this.id, {
          XStationId: this.XStationId
        })
        .then(res => {
          if (res.ret) {
            this.ruleForm = res.data
            res.data.payment_images && (this.baleImgList = res.data.payment_images)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    confirm() {
      // console.log(this.ruleForm.show_rate, 'ruleForm.show_rate')
      if (this.baleImgList[0]) {
        this.ruleForm.qr_code = this.baleImgList[0]
      } else {
        this.ruleForm.qr_code = []
      }
      if (!this.ruleForm.name) {
        return this.$message.error(this.$t('请输入支付类型名称'))
      } else if (!this.ruleForm.remark && !this.baleImgList[0]) {
        return this.$message.error(this.$t('请输入备注'))
      } else if (this.ruleForm.rate_type === 1 && !this.ruleForm.rate) {
        return this.$message.error(this.$t('请输入转换汇率'))
      }
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
          this.show = false
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
          this.show = false
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
      this.ruleForm.name = ''
      this.ruleForm.remark = ''
      this.baleImgList = []
      this.ruleForm.qr_code = []
    },
    init() {
      // 自提点佣金结算 查看支付详情
      if (this.state === 'pay') {
        this.getList()
      } else if (this.state === 'pick') {
        this.pickData()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-pay-details {
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
      // margin-left: 0 !important;
    }
    .el-form-item__label {
      // width: 500px !important;
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

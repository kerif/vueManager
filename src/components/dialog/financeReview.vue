<template>
  <el-dialog :visible.sync="show" :title="$t('审核')" class="dialog-review" width="55%"
  @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 支付金额 -->
        <el-form-item :label="$t('*支付金额')" v-if="state === 'pass'">
          <el-input v-model="ruleForm.pay_amount" :disabled="!!this.$route.params.id">
            <template slot="append">{{this.localization.currency_unit}}</template>
          </el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('备注')" v-if="state === 'pass'">
            <el-input type="textarea" v-model="ruleForm.customer_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :placeholder="$t('请输入备注')"></el-input>
        </el-form-item>
        <!-- 退款方式 -->
        <el-form-item :label="$t('退款方式')" v-if="state === 'pass' && name === 'refund'">
          <el-select class="input-sty" v-model="ruleForm.refund_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label="$t('*其他方式')" v-if="(state === 'pass' && name === 'refund') && ruleForm.refund_type === 2">
            <el-input v-model="ruleForm.refund_method"
            :placeholder="$t('请输入备注具体退款方式')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('*备注')" v-if="state === 'reject'">
            <el-input type="textarea" v-model="ruleForm.customer_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :placeholder="$t('请输入备注')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('上传照片')" class="updateChe">
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
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      ruleForm: {
        pay_amount: '',
        customer_remark: '',
        refund_type: '',
        customer_images: [],
        refund_images: [],
        refund_remark: ''
      },
      state: '',
      id: '',
      options: [
        {
          id: 0,
          name: this.$t('原路返回（仅微信支付，其他方式退回余额）')
        }, {
          id: 1,
          name: this.$t('账户余额')
        }, {
          id: 2,
          name: this.$t('其他方式')
        }
      ],
      userId: '',
      tranAmount: '',
      baleImgList: [],
      localization: {},
      name: ''
    }
  },
  methods: {
    getCountry () {
      this.$request.getCountry().then(res => {
        this.country = res.data
        this.localization = res.localization
      })
    },
    confirm () {
      console.log(this.state, 'this.state')
      this.ruleForm.customer_images = this.baleImgList
      if (this.state === 'pass' && !this.ruleForm.pay_amount && this.ruleForm.pay_amount !== 0) {
        return this.$message.error(this.$t('请输入金额'))
      } else if (this.state === 'reject' && !this.ruleForm.customer_remark) {
        return this.$message.error(this.$t('请输入备注'))
      } else if (this.ruleForm.refund_type === 2 && !this.ruleForm.refund_method) {
        return this.$message.error(this.$t('请输入具体退款方式'))
      }
      // 订单列表审核
      if (this.$route.params.id) {
        if (this.name === 'pay') {
          if (this.state === 'pass') {
            console.log(this.state, 'state 111')
            this.$request.approvedPay(this.id, this.ruleForm).then(res => {
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
            console.log(this.state, 'state 222')
            this.$request.refundPay(this.id, this.ruleForm).then(res => {
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
        } else { // 退款审核或拒绝
          if (this.state === 'pass') {
            console.log(this.state, 'state 333')
            this.$request.approvedRefunds(this.id, {
              refund_amount: this.ruleForm.pay_amount,
              refund_images: this.ruleForm.customer_images,
              refund_remark: this.ruleForm.customer_remark,
              ...this.ruleForm
            }).then(res => {
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
            console.log(this.state, 'state 444')
            this.$request.refundRefunds(this.id, {
              refund_images: this.ruleForm.customer_images,
              refund_remark: this.ruleForm.customer_remark
            }).then(res => {
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
        }
      }
    },
    // 上传打包照片
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
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
      this.$refs['ruleForm'].resetFields()
      this.$refs['ruleForm'].clearValidate()
      this.ruleForm.pay_amount = ''
      this.ruleForm.refund_type = ''
      this.ruleForm.refund_method = ''
      this.ruleForm.customer_remark = ''
      this.baleImgList = []
      this.ruleForm.customer_images = []
    },
    init () {
      console.log(this.name, 'name')
      console.log(this.state, 'state')
      if (this.state === 'pass' && this.$route.params.id) {
        this.ruleForm.pay_amount = this.tranAmount
      } else if (this.state === 'pass' && this.$route.params.id) {
        this.ruleForm.pay_amount = this.tranAmount
      }
      this.getCountry()
    }
  }
}
</script>
<style lang="scss">
.dialog-review {
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
  .input-sty {
    width: 80%;
    .el-input {
      width: 80%;
    }
  }
}
</style>

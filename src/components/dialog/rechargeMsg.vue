<template>
  <el-dialog :visible.sync="show" :title="$t('审核')" class="dialog-recharge" width="35%"
  @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 充值金额 -->
        <el-form-item :label="$t('充值金额')" v-if="state === 'pass'">
          <el-input v-model="rechargeFee" disabled>
            <template slot="append">{{this.currencyUnit}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('*确认金额')" v-if="state === 'pass'">
          <el-input v-model="ruleForm.pay_amount">
            <template slot="append">{{this.currencyUnit}}</template>
          </el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('备注')" v-if="state === 'pass'">
            <el-input type="textarea" v-model="ruleForm.customer_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :placeholder="$t('请输入备注')"></el-input>
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
        customer_images: []
      },
      rechargeFee: '',
      state: '',
      id: '',
      userId: '',
      tranAmount: '',
      baleImgList: [],
      currencyUnit: ''
    }
  },
  methods: {
    confirm () {
      this.ruleForm.customer_images = this.baleImgList
      if (this.state === 'pass' && !this.ruleForm.pay_amount && this.ruleForm.pay_amount !== 0) {
        return this.$message.error(this.$t('请输入金额'))
      } else if (this.state === 'reject' && !this.ruleForm.customer_remark) {
        return this.$message.error(this.$t('请输入备注'))
      }
      // 审核通过
      if (this.state === 'pass') {
        this.$request.rechargePassed(this.id, {
          confirm_amount: this.ruleForm.pay_amount,
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
      } else { // 审核拒绝
        this.$request.rechargeReject(this.id, {
          confirm_amount: this.ruleForm.pay_amount,
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
      // this.$refs['ruleForm'].resetFields()
      // this.$refs['ruleForm'].clearValidate()
      this.ruleForm.pay_amount = ''
      this.ruleForm.customer_remark = ''
      this.baleImgList = []
      this.ruleForm.customer_images = []
    },
    init () {
      console.log(this.tranAmount, 'tranAmount')
      console.log(this.state, 'state')
      this.ruleForm.pay_amount = this.tranAmount
      this.rechargeFee = this.tranAmount
      this.currencyUnit = this.currencyUnit
    }
  }
}
</script>
<style lang="scss">
.dialog-recharge {
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
}
</style>

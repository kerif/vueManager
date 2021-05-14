<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('新增')"
    class="dialog-add-recharge"
    width="35%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <!-- 客户编号 -->
      <el-form-item :label="$t('*客户编号')">
        <!-- <el-input v-model="ruleForm.user_id">
          </el-input> -->
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          :placeholder="$t('请输入客户编号')"
          v-model="ruleForm.user_id"
        >
        </el-autocomplete>
      </el-form-item>
      <!-- 充值金额 -->
      <el-form-item :label="$t('*充值金额') + localization.currency_unit" class="input-style">
        <el-input v-model="ruleForm.tran_amount"> </el-input>
      </el-form-item>
      <!-- 充值方式 -->
      <el-form-item :label="$t('*充值方式')" class="input-style">
        <el-radio-group v-model="ruleForm.payment_type_id">
          <el-radio v-for="item in updateProp" :key="item.id" :label="item.id"
            >{{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 转账账户 -->
      <el-form-item :label="$t('*转账账户')" class="input-style">
        <el-input v-model="ruleForm.transfer_account"> </el-input>
      </el-form-item>
      <!-- 转账备注 -->
      <el-form-item :label="$t('转账备注')" class="input-style">
        <el-input
          type="textarea"
          v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <!-- 上传截图 -->
      <el-form-item :label="$t('上传截图')" class="updateChe">
        <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
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
          :before-upload="beforeUploadImg"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <div class="updateImg">
          {{ $t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张') }}
        </div>
      </el-form-item>
      <!-- 是否审核 -->
      <el-form-item :label="$t('是否审核')">
        <el-switch
          v-model="ruleForm.should_audit"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        user_id: '',
        payment_type_id: '',
        tran_amount: '',
        transfer_account: '',
        should_audit: 0,
        remark: '',
        images: []
      },
      baleImgList: [],
      localization: {},
      rules: {
        user_id: [{ required: true, message: this.$t('请输入客户编号'), trigger: 'blur' }],
        tran_amount: [{ required: true, message: this.$t('请输入充值金额'), trigger: 'change' }],
        payment_type_id: [{ required: true, message: this.$t('请选择充值方式'), trigger: 'blur' }],
        transfer_account: [{ required: true, message: this.$t('请输入转账账户'), trigger: 'blur' }]
      },
      tranAmount: '',
      updateProp: []
    }
  },
  methods: {
    confirm() {
      if (this.baleImgList) {
        this.ruleForm.images = this.baleImgList
      } else {
        this.ruleForm.images = []
      }
      if (this.ruleForm.user_id === '') {
        return this.$message.error(this.$t('请输入客户编号'))
      } else if (this.ruleForm.tran_amount === '') {
        return this.$message.error(this.$t('请输入充值金额'))
      } else if (this.ruleForm.transfer_account === '') {
        return this.$message.error(this.$t('请输入转账账户'))
      }
      this.ruleForm.user_id = this.ruleForm.user_id.split('---')[0]
      this.$request.addRecords(this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    clear() {
      this.$refs['ruleForm'].resetFields()
      this.$refs['ruleForm'].clearValidate()
      this.ruleForm.images = []
      this.ruleForm.user_id = ''
      this.ruleForm.payment_type_id = ''
      this.ruleForm.tran_amount = ''
      this.ruleForm.transfer_account = ''
      this.ruleForm.should_audit = 0
      this.ruleForm.remark = ''
      this.ruleForm.images = []
    },
    // 客户id
    queryCNSearch(queryString, callback) {
      var list = [{}]
      this.$request
        .AutoRecords({
          keyword: this.ruleForm.user_id.toString()
        })
        .then(res => {
          for (let i of res.data) {
            // i.value = i.id
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback(list)
        })
    },
    // 客户id
    handleSelect(item) {
      // this.ruleForm.en_name = item.name
      console.log(item)
      this.supplierId = item.id
      this.supplierName = item.name
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
    beforeUploadImg(file) {
      if (!/^image/.test(file.type)) {
        this.$message.info(this.$t('请上传图片类型文件'))
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info(this.$t('上传图片大小不能超过2M'))
        return false
      }
      return true
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
    // 获取充值方式
    getPaymentType() {
      this.$request.getRechargePaymentType().then(res => {
        if (res.ret) {
          this.updateProp = res.data
          this.ruleForm.payment_type_id = this.updateProp[0].id
          this.localization = res.localization
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    init() {
      this.getPaymentType()
    }
  }
}
</script>
<style lang="scss">
.dialog-add-recharge {
  .el-dialog__body {
    margin-left: 20px !important;
  }
  .input-style {
    .el-input {
      width: 70%;
    }
    .el-textarea {
      width: 70%;
    }
  }
  .el-autocomplete {
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
  .updateImg {
    margin-top: 10px;
    color: #ccc;
  }
}
</style>

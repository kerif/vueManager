<template>
  <el-dialog :visible.sync="show" :title="$t('审核')" class="dialog-addInvoicing">
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
      <!--开票金额  -->
      <el-form-item :label="$t('开票金额')" v-if="state === 'pass'">
        <el-input v-model="ruleForm.money"> </el-input>
      </el-form-item>
      <!-- 发票号码 -->
      <el-form-item :label="$t('发票号码')" v-if="state === 'pass'">
        <el-input v-model="ruleForm.invoices_number"> </el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')" v-if="state === 'pass'">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleForm.remarks"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <!-- 作废申请 -->
      <!-- 备注 -->
      <el-form-item :label="$t('备注')">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleForm.remarks"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <!-- 重开发票 -->
      <!--开票金额  -->
      <el-form-item :label="$t('开票金额')">
        <el-input v-model="ruleForm.money"> </el-input>
      </el-form-item>
      <!-- 发票号码 -->
      <el-form-item :label="$t('发票号码')">
        <el-input v-model="ruleForm.invoices_number"> </el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleForm.remarks"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <!--附件-->
      <el-form-item :label="$t('附件')">
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
        money: '',
        invoices_number: '',
        remarks: ''
      },
      baleImgList: []
    }
  },
  methods: {
    // 上传打包照片
    uploadBaleImg(item) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-addInvoicing {
  /deep/ .el-dialog__header {
    background-color: #0e102a;
  }
  /deep/.el-input {
    width: 50%;
  }
  /deep/.el-textarea {
    width: 50%;
  }
  /deep/.el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  /deep/.el-dialog__close {
    color: #fff;
  }
}
</style>

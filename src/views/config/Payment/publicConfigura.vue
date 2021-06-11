<template>
  <div class="setPublic-container">
    <el-form
      :model="setForm"
      ref="setForm"
      class="demo-ruleForm"
      label-width="150px"
      label-position="left"
    >
      <el-form-item label="AppId">
        <el-input v-model="setForm.app_id"> </el-input>
      </el-form-item>
      <el-form-item :label="`AppSecret${$t('密钥')}`">
        <el-input v-model="setForm.secret"> </el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="setForm.token"> </el-input>
      </el-form-item>
      <el-form-item label="aes_key">
        <el-input v-model="setForm.aes_key"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('公众号二维码')" class="updateChe">
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
    </el-form>
    <el-button :loading="$store.state.btnLoading" class="save-btn" @click="editOthers">{{
      $t('保存')
    }}</el-button>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      setForm: {
        image: '',
        secret: '',
        token: '',
        aes_key: '',
        app_id: ''
      },
      visibleOauth: false,
      baleImgList: []
    }
  },
  created() {
    this.getOthers()
  },
  methods: {
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 获取pc端配置
    getOthers() {
      this.$request.getWechatOa().then(res => {
        this.setForm.app_id = res.data.app_id
        this.setForm.secret = res.data.secret
        this.setForm.token = res.data.token
        this.setForm.aes_key = res.data.aes_key
        res.data.image && (this.baleImgList[0] = res.data.image)
        // this.$set(this.baleImgList, 0, res.data.image)
      })
    },
    // 修改pc端配置
    editOthers() {
      if (this.baleImgList[0]) {
        this.setForm.image = this.baleImgList[0]
      } else {
        this.setForm.image = []
      }
      this.$request.updateWechatOa(this.setForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getOthers()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
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
    // 删除小程序码
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    uploadLogo(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.LogoImgList.push(item.path)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.setPublic-container {
  .save-btn {
    color: #fff;
    background-color: #3540a5;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>

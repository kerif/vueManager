<template>
  <el-dialog
    :visible.sync="showAbnormal"
    :title="$t('转为异常件')"
    :before-close="close"
    class="abnormal-container"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
      <el-form-item :label="$t('异常说明')">
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="$t('请输入内容')"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleForm.textarea"
          class="text"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('上传图片')">
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
    <div slot="footer">
      <el-button @click="close">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        textarea: ''
      },
      baleImgList: []
    }
  },
  props: {
    showAbnormal: {
      type: Boolean,
      default: false
    },
    selectIDs: {
      type: Array,
      required: true
    }
  },
  created() {},
  methods: {
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
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
    close() {
      this.$emit('passVal', false)
    },
    confirm() {
      let params = {
        remark: this.ruleForm.textarea,
        ids: this.selectIDs,
        images: this.baleImgList
      }
      this.$request.AbnormalPiece(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.$emit('passVal', false)
          this.$parent.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.ruleForm.textarea = ''
      this.baleImgList = []
    }
  }
}
</script>

<style lang="scss">
.abnormal-container {
  font-size: 14px;
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
  .text {
    width: 80%;
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
    margin-left: 50px;
  }
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
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
}
</style>

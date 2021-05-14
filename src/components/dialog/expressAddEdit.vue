<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('新增') : $t('修改')"
    class="dialog-add-express"
    width="35%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <!-- 公司名称 -->
      <el-form-item :label="$t('*公司名称')">
        <el-input v-model="ruleForm.name"> </el-input>
      </el-form-item>
      <!-- 快递公司名称 -->
      <el-form-item :label="$t('*快递公司代码')">
        <el-input v-model="ruleForm.code"> </el-input>
      </el-form-item>
      <!-- 联系电话 -->
      <el-form-item :label="$t('联系电话')">
        <el-input v-model="ruleForm.contact_phone"> </el-input>
      </el-form-item>
      <!-- 官网 -->
      <el-form-item :label="$t('官网')">
        <el-input v-model="ruleForm.website"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('LOGO')" class="updateChe">
        <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
          <img :src="item" alt="" class="goods-img" />
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
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
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
        name: '',
        contact_phone: '',
        website: '',
        code: '',
        logo: []
      },
      state: '',
      tranAmount: '',
      baleImgList: []
    }
  },
  methods: {
    getList() {
      this.$request.getExpressDetails(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          res.data.logo && (this.baleImgList[0] = res.data.logo)
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
        this.ruleForm.logo = this.baleImgList[0]
      } else {
        this.ruleForm.logo = []
      }
      if (!this.ruleForm.name) {
        return this.$message.error(this.$t('请输入公司名称'))
      } else if (!this.ruleForm.code) {
        return this.$message.error(this.$t('请输入快递公司代码'))
      }
      if (this.state === 'add') {
        this.$request.addExpress(this.ruleForm).then(res => {
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
        this.$request.updateExpress(this.id, this.ruleForm).then(res => {
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
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.contact_phone = ''
      this.ruleForm.website = ''
      this.ruleForm.code = ''
      this.baleImgList = []
      this.ruleForm.logo = []
      this.state = ''
    },
    init() {
      console.log(this.id, '我是接受id')
      if (this.state === 'edit') {
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-add-express {
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
}
</style>

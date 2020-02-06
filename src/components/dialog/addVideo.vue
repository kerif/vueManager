<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? '新增' : '修改'" class="dialog-add-setting" width="35%"
  @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 标题 -->
        <el-form-item label="标题">
          <el-input v-model="ruleForm.name">
          </el-input>
        </el-form-item>
        <!-- 介绍 -->
        <el-form-item label="介绍">
            <el-input type="textarea" v-model="ruleForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注"></el-input>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面" class="updateChe">
            <span class="img-item" v-for="(item, index) in baleImgList" :key="item.name">
            <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img">
            <span class="model-box"></span>
            <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                <i class="el-icon-delete" @click="onDeleteImg('bale', index)"></i>
            </span>
            </span>
          <el-upload
            v-show="baleImgList.length < 1"
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="uploadBaleImg"
            :show-file-list="false">
            <i class="el-icon-plus">
            </i>
        </el-upload>
         <div class="updateImg">仅支持jpg, 宽度 300px、高度 225px</div>
    </el-form-item>
    <!-- 视频 -->
    <el-form-item class="updateChe" label="物品照片">
      <span class="img-item" v-for="(item, index) in goodsImgList" :key="item.name">
        <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img">
        <span class="model-box"></span>
        <span class="operat-box">
          <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
          <i class="el-icon-delete" @click="onDeleteImg('goods', index)"></i>
        </span>
      </span>
      <el-upload
        v-show="goodsImgList.length < 3"
        class="avatar-uploader"
        list-type="picture-card"
        action=""
        :before-upload="beforeUploadImg"
        :http-request="uploadGoodsImg"
        :show-file-list="false"
        >
        <i class="el-icon-plus">
        </i>
      </el-upload>
      <div class="updateImg">仅支持mp4, 视频最佳比例为：3：2 比例， 大小不超过30M</div>
    </el-form-item>
    <!-- 是否显示 -->
    <el-form-item label="是否显示">
        <el-switch
          v-model="ruleForm.enabled"
          @change="changeShow($event)"
          active-text="开"
          inactive-text="关"
          active-color="#13ce66"
          inactive-color="gray">
        </el-switch>
    </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        enabled: true,
        remark: '',
        qr_code: [],
        qr_video: []
      },
      state: '',
      tranAmount: '',
      baleImgList: [], // 封面
      goodsImgList: [] // 视频
    }
  },
  methods: {
    getList () {
      this.$request.editPayments(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          res.data.qr_code && (this.baleImgList[0] = { url: res.data.qr_code })
          res.data.qr_video && (this.goodsImgList[0] = { url: res.data.qr_video })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 是否显示
    changeShow (event) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeCategories(this.$route.params.id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    beforeUploadImg (file) {
      if (!(/^image/.test(file.type))) {
        this.$message.info('请上传图片类型文件')
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info('上传图片大小不能超过2M')
        return false
      }
      return true
    },
    confirm () {
      if (this.baleImgList[0]) {
        this.ruleForm.qr_code = this.baleImgList[0].url
      } else {
        this.ruleForm.qr_code = []
      }
      if (this.goodsImgList[0]) {
        this.ruleForm.qr_video = this.goodsImgList[0].url
      } else {
        this.ruleForm.qr_video = []
      }
      // this.user.in_warehouse_pictures = this.goodsImgList.map(item => {
      //   return {
      //     url: item.url
      //   }
      // })
      if (!this.ruleForm.name) {
        return this.$message.error('请输入支付类型名称')
      } else if (!this.ruleForm.remark && !this.baleImgList[0]) {
        return this.$message.error('请输入备注')
      }
      if (this.state === 'add') {
        this.$request.addPayments(this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '成功',
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
              title: '成功',
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
        console.log(res)
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push({
              name: item.name,
              url: item.path
            })
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
    onDeleteImg (type, index) {
      if (type === 'bale') {
        this.baleImgList.splice(index, 1)
      } else if (type === 'goods') {
        this.goodsImgList.splice(index, 1)
      }
    },
    // 上传封面
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 上传视频
    uploadGoodsImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.goodsImgList.push({
              name: item.name,
              url: item.path
            })
          })
        }
      })
    },
    clear () {
      this.ruleForm.name = ''
      this.ruleForm.remark = ''
      this.baleImgList = []
      this.ruleForm.qr_code = []
    },
    init () {
      console.log(this.id, '我是接受id')
      if (this.state === 'edit') {
        this.getList()
      }
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
  .updateImg {
    margin-top: 10px;
    color: #ccc;
  }
}
</style>

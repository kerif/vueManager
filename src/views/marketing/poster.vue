<template>
  <div class="poster-container">
    <!-- 海报配置 -->
      <div class="poster-left">
        <img v-show="choosePoster" :src="$baseUrl.IMAGE_URL +  choosePoster" class="img-poster">
        <div class="left-top" v-if="this.backgroundList.display_user_avatar === 1" style="position: relative">
          <img src="../../assets/user.png">
        </div>
        <h3 v-if="this.backgroundList.display_user_name === 1" style="position: relative">{{$t('张三')}}</h3>
        <p v-if="this.backgroundList.display_share_info === 1" style="position: relative">{{backgroundList.share_info}}</p>
        <div class="left-bottom">
          <img src="../../assets/code.png" :style="{width: backgroundList.avatar_size + 'px', height: backgroundList.avatar_size + 'px'}">
        </div>
      </div>
      <div class="poster-right">
        <h4>{{$t('设置面板')}}</h4>
        <el-form :model="backgroundList" ref="ruleForm" class="demo-ruleForm"
        label-width="140px">
        <!-- 开启用户头像 -->
          <el-form-item :label="$t('开启用户头像')">
            <el-switch
              v-model="backgroundList.display_user_avatar"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
          </el-form-item>
          <!-- 开启显示用户名称 -->
          <el-form-item :label="$t('开启显示用户名称')">
            <el-switch
              v-model="backgroundList.display_user_name"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
          </el-form-item>
          <!-- 开启显示宣传语 -->
          <el-form-item :label="$t('开启显示宣传语')">
            <el-switch
              v-model="backgroundList.display_share_info"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
          </el-form-item>
            <!-- 宣传语 -->
            <el-form-item :label="$t('宣传语')">
              <el-input v-model="backgroundList.share_info"></el-input>
            </el-form-item>
            <!-- 二维码头像尺寸 -->
            <el-form-item :label="$t('二维码尺寸')" class="slogan">
              <el-input v-model="backgroundList.avatar_size" @blur="changeSize">
              </el-input>px
              <p class="slogan-height">{{$t('高和宽一致，只需要填写一个参数')}}</p>
            </el-form-item>
        <!-- 背景图像 -->
          <el-form-item :label="$t('背景图像')">
              <span class="img-item" v-for="(item, index) in backgroundImg" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="previewBackground(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteBg(index)"></i>
              </span>
              </span>
              <el-upload
                v-show="backgroundImg.length < 5"
                class="avatar-uploader"
                action=""
                list-type="picture-card"
                :http-request="uploadBgImg"
                :show-file-list="false">
                <i class="el-icon-plus">
                </i>
            </el-upload><br/>
            <span class="suggest-btn">{{$t('背景图像上传最多不超过五张，建议尺寸750px*1334px')}}</span>
          </el-form-item>
          <!-- 分享链接自定义图片 -->
          <el-form-item :label="$t('分享链接自定义图片')">
              <span class="img-item" v-for="(item, index) in shareImg" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="previewBackground(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteShare(index)"></i>
              </span>
              </span>
              <el-upload
                v-show="shareImg.length < 1"
                class="avatar-uploader"
                action=""
                list-type="picture-card"
                :http-request="uploadShareImg"
                :show-file-list="false">
                <i class="el-icon-plus">
                </i>
            </el-upload><br/>
            <span class="suggest-btn">{{$t('链接自定义图片只需要上传一张，显示图片长宽比5:4')}}</span>
          </el-form-item>
          <div class="background-btn">
            <el-button class="save-btn" @click="updateBackground">{{$t('保存')}}</el-button>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      activeName: '',
      appletForm: {
        app_id: '',
        secret: '',
        token: '',
        aes_key: ''
      },
      tableLoading: false,
      severData: [],
      businessData: [],
      baleImgList: [], // 小程序首页视频入口图
      backgroundImg: [], // 海报配置背景图像
      shareImg: [], // 分享链接图像
      choosePoster: '',
      backgroundList: { // 海报配置
        display_user_avatar: 0,
        display_user_name: 0,
        display_share_info: 0,
        avatar_size: '',
        background_images: [],
        share_image: '',
        share_info: ''
      },
      params: {
        instruction: ''
      }
    }
  },
  created () {
    this.getBackground()
  },
  methods: {
    changeSize () {
      if (this.backgroundList.avatar_size > 200) {
        this.backgroundList.avatar_size = 200
        this.$message.error(this.$t('二维码尺寸最大不能超过200px'))
      }
    },
    // 获取海报配置
    getBackground () {
      this.$request.getProgramShare().then(res => {
        this.backgroundList = res.data
        res.data.background_images && (this.backgroundImg = res.data.background_images)
        res.data.share_image && (this.shareImg[0] = res.data.share_image)
      })
    },
    // 保存
    updateBackground () {
      if (this.baleImgList) {
        this.backgroundList.background_images = this.backgroundImg
      } else {
        this.backgroundList.background_images = []
      }
      if (this.shareImg[0]) {
        this.backgroundList.share_image = this.shareImg[0]
      } else {
        this.backgroundList.share_image = []
      }
      if (!this.backgroundImg[0]) {
        return this.$message.error(this.$t('请上传背景图像'))
      } else if (this.backgroundList.avatar_size === '') {
        return this.$message.error(this.$t('二维码尺寸不能为空'))
      }
      this.$request.updateProgramShare(this.backgroundList).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.$router.go(-1)
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
    // 预览小程序海报
    previewBackground (image) {
      console.log(image, 'image')
      this.choosePoster = image
    },
    // 上传海报配置背景图像
    uploadBgImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.backgroundImg.push(item.path)
          })
        }
      })
    },
    // 上传分享链接图像
    uploadShareImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.shareImg.push(item.path)
          })
        }
      })
    },
    // 上传小程序首页视频图片
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
    // 删除海报配置 背景图
    onDeleteBg (index) {
      this.backgroundImg.splice(index, 1)
    },
    // 删除分享链接图
    onDeleteShare (index) {
      this.shareImg.splice(index, 1)
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 添加转运快递单号
    edit (row) {
      row.disabled = !row.disabled
    },
    // 取消
    cancel (row) {
      row.template_id = row.copySN
      row.disabled = true
    },
    // 判断是新增 还是 编辑
    changeText () {
      this.$emit('input', this.editor.txt.html())
    }
  }
}
</script>

<style lang="scss">
.poster-container {
   .tabLength {
    // width: 560px !important;
    width: 500px !important;
  }
  .applet-left {
    padding: 15px;
    background-color: #fff !important;
  }
  .savaBtn {
    background-color: #3540A5;
    color: #fff;
    width: 100px;
  }
  .el-input__inner {
    width: 60%;
  }
  .setOthers {
    background-color: #fff !important;
    padding: 20px;
    .el-input {
      width: 30%;
    }
    .el-textarea__inner {
      width: 30%;
      background-color: #F5F5F5;
    }
    .goods-img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
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
  }
  .setOthers {
    background-color: #fff !important;
    padding: 20px;
    .el-input {
      width: 30%;
    }
    .el-textarea__inner {
      width: 30%;
      background-color: #F5F5F5;
    }
  }
    .goods-img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
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
      // margin-left: 50px;
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
  .save-btn {
    color: #fff;
    background-color: #3540A5;
  }
  .preview-btn {
    color: #fff;
    background-color: #8d97fa;
    padding: 12px 50px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .suggest-btn {
    color: gray;
    font-size: 12px;
  }
  .poster-left {
    width:300px;
    height: 580px;
    overflow: hidden;
    vertical-align: top;
    display: inline-block;
    text-align: center;
    background-color: #fff;
    padding: 20px 10px;
    position: relative;
    margin-right:40px;
    .left-top {
      img {
        width: 80px;
        height: 80px;
        padding: 5px;
        border-radius: 50%;
        border: 1px solid #ccc;
      }
    }
  }
  .poster-right {
    width: calc(100%-360px);
    width: -moz-calc(100% - 360px);
    width: -webkit-calc(100% - 360px);
    vertical-align: top;
    display: inline-block;
    background-color: #fff;
    padding:15px;
    height: 1080px;
    box-sizing: border-box;
  }
  .background-btn {
    margin-left: 120px;
  }
  .slogan {
    .el-input {
      width: 30% !important;
    }
  }
  .slogan-height {
    margin: 0;
  }
  .left-bottom {
    position: absolute;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    img {
      // width:100px;
      // height: 100px;
      border-radius: 50%;
      border: 1px solid #ccc;
      padding: 5px;
    }
  }
  .img-poster {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .Features-container {
     background-color: #fff !important;
     padding: 20px;
  }
  .how-container {
     background-color: #fff !important;
     padding: 20px;
     .w-e-text-container {
       height: 600px !important;
     }
  }
}
</style>

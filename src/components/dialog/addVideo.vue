<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? '新增' : '修改'" class="dialog-add-setting" width="35%"
  @close="clear">
    <el-form :model="video" ref="ruleForm" class="demo-ruleForm"
    label-position="top" :rules="rules">
        <!-- 标题 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="video.title">
          </el-input>
        </el-form-item>
        <!-- 介绍 -->
        <el-form-item label="介绍" prop="content">
            <el-input type="textarea" v-model="video.content"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注"></el-input>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面" class="updateChe" prop="cover">
            <span class="img-item" v-if="video.cover">
            <img :src="$baseUrl.IMAGE_URL + video.cover" alt="" class="goods-img">
            <span class="model-box"></span>
            <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(video.cover)"></i>
                <i class="el-icon-delete" @click="onDeleteImg"></i>
            </span>
            </span>
          <el-upload
            v-show="!video.cover"
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
    <el-form-item class="updateChe" label="视频" prop="video">
      <img src="../../assets/gb.png" @click="video.video = ''" v-if="video.video" class="closed" />
      <video-player
        class='video-player vjs-custom-skin'
        ref="videoPlayer" v-if="video.video"
        :playsinline="true"
        :options="playerOptions"
      />
      <el-upload
        v-else
        class="avatar-uploader"
        list-type="picture-card"
        action=""
        :before-upload="beforeUploadVideo"
        :http-request="uploadVideo"
        :show-file-list="false"
        >
        <i class="el-icon-plus">
        </i>
      </el-upload>
      <div class="updateImg">仅支持mp4, 视频最佳比例为：3：2 比例， 大小不超过30M</div>
    </el-form-item>
    <!-- 是否显示 -->
    <el-form-item label="是否显示" prop="enabled">
        <el-switch
          v-model="video.enabled"
          active-text="开"
          inactive-text="关"
          active-color="#13ce66"
          inactive-color="gray">
        </el-switch>
    </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
import * as qiniu from 'qiniu-js'
import { videoPlayer as VideoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
const videoUrl = 'http://q55zf5gh1.bkt.clouddn.com/'
export default {
  data () {
    return {
      uploadToken: '',
      qnConfig: {
        region: qiniu.region.z2,
        retryCount: 5
      },
      video: {
        title: '', // 标题
        content: '', // 内容
        cover: '', // 封面
        video: '', // 视频
        enabled: false // 是否可用
      },
      state: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '请输入封面', trigger: 'blur' }
        ],
        video: [
          { required: true, message: '请上传视频', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '请选择是否显示', trigger: 'blur' }
        ]
      },
      tranAmount: '',
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [],
        poster: '../../static/images/test.jpg', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      baleImgList: [], // 封面
      goodsImgList: [] // 视频
    }
  },
  components: {
    VideoPlayer
  },
  methods: {
    getList () {
      // this.$request.editPayments(this.id).then(res => {
      //   if (res.ret) {
      //     this.ruleForm = res.data
      //     res.data.qr_code && (this.baleImgList[0] = { url: res.data.qr_code })
      //     res.data.qr_video && (this.goodsImgList[0] = { url: res.data.qr_video })
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      // })
      this.$request.getSingleVideo(this.id).then(res => {
        this.video = res.data
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
    confirm (formName) {
      console.log(Number(this.video.enabled), 'enabled')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id) { // 编辑视频
            this.$request.editVideo(this.id, {
              ...this.video,
              enabled: ~~this.video
            }).then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: '操作成功',
                  message: res.msg
                })
                this.show = false
                this.success()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else { // 新增视频
            this.$request.addVideo({
              ...this.video,
              enabled: ~~this.video
            }).then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: '操作成功',
                  message: res.msg
                })
                this.show = false
                this.success()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    clear () {
      this.$refs['ruleForm'].resetFields()
      this.$refs['ruleForm'].clearValidate()
    },
    // 上传视频
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        console.log(res)
        if (res.ret) {
          // res.data.forEach(item => {
          //   this.baleImgList.push({
          //     name: item.name,
          //     url: item.path
          //   })
          // })
          this.video.cover = res.data[0].path
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
      // if (type === 'bale') {
      //   this.baleImgList.splice(index, 1)
      // } else if (type === 'goods') {
      //   this.goodsImgList.splice(index, 1)
      // }
      this.video.cover = ''
    },
    // 上传封面
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    init () {
      console.log(this.id, '我是接受id')
      if (this.state === 'edit') {
        this.getList()
      }
      this.getUploadToken()
    },
    // 获取视频上传临时 token
    getUploadToken () {
      this.$request.getVideoUploadToken().then(res => {
        if (res.ret) {
          this.uploadToken = res.data
        }
      })
    },
    // 上传视频之前判断视频格式
    beforeUploadVideo (item) {
      console.log(this.conver(item.size))
      if (!(/video\/mp4/.test(item.type))) {
        this.$message.error('请上传 mp4 格式的视频')
        return false
      } else if (!this.conver(item.size)) {
        this.$message.error('请上传 视频 不能超过30M')
        return false
      }
      return true
    },
    conver (limit) {
      const size = (limit / (1024 * 1024)).toFixed(2)
      console.log(size, 'size')
      return size <= 30
    },
    // 上传视频
    uploadVideo (video) {
      const self = this
      let file = video.file
      let fileName = this.getVideoName() + file.name
      const observable = qiniu.upload(
        file,
        fileName,
        self.uploadToken,
        {
          fname: file.name,
          params: {},
          mimeType: null
        },
        self.qnConfig
      )
      // 开始上传
      observable.subscribe({
        next (res) {
          console.log('next', res.total)
        },
        error (error) {
          console.log('error', error)
        },
        complete (res) {
          if (res.status) {
            self.playerOptions.sources = [{ src: videoUrl + res.data.url, type: video.type }]
            self.video.video = res.data.url
          }
        }
      })
    },
    // 根据当前时间戳进行 base64 编码再与原文件名拼接生成文件资源名
    getVideoName () {
      let time = new Date().getTime()
      if (window.btoa) {
        return window.btoa(time.toString())
      } else {
        return time
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-add-setting {
  .video-js .vjs-big-play-button {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .closed {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    z-index: 1;
    right: 0;
  }
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

<template>
  <div>
    <div :class="['message', { 'on-progress': onProgress }]">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="progress"></el-progress>
    </div>
    <div id="editor" :value="textContent"></div>
    <el-button class="save" type="primary" @click="submit">{{ $t('保存') }}</el-button>
  </div>
</template>

<script>
import E from 'wangeditor'
import COS from 'cos-js-sdk-v5'
import baseApi from '@/lib/axios/baseApi'
export default {
  data() {
    return {
      editor: '',
      textContent: '',
      progress: 0,
      params: {},
      onProgress: false
    }
  },
  props: {
    content: {
      type: String
    }
  },
  watch: {
    content: {
      handler(next) {
        this.editor.txt.html(next)
      }
    }
  },
  created() {
    if (localStorage.getItem('secret')) {
      const params = JSON.parse(localStorage.getItem('secret'))
      const time = new Date(params.configs.expiration)
      const currentTime = new Date()
      if (currentTime > time) {
        this.getTempKeys()
      } else {
        this.params = params
      }
    } else {
      this.getTempKeys()
    }
  },
  mounted() {
    this.editor = new E('#editor')
    this.editor.config.customUploadVideo = (resultFiles, insertVideoFn) => {
      this.uploadFile(resultFiles)
        .then(res => {
          insertVideoFn(res)
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
    this.editor.config.uploadImgServer = `${baseApi.BASE_API_URL}/upload/images`
    this.editor.config.uploadImgParams = {}
    this.editor.config.uploadImgHeaders = {
      Authorization: this.$store.state.token
    }
    this.editor.config.uploadFileName = `images[${0}][file]`
    this.editor.config.uploadImgHooks = {
      customInsert: (insertImg, result) => {
        if (result.ret === 1) {
          this.$message.success(this.$t('上传成功'))
          let url = `${baseApi.IMAGE_URL}${result.data[0].path}`
          insertImg(url)
        }
      }
    }
    this.editor.config.zIndex = 500
    this.editor.config.showLinkImg = true
    this.editor.create()
    this.editor.txt.html(this.content)
  },
  methods: {
    getTempKeys() {
      this.$request.getTempKeys().then(res => {
        if (res.ret) {
          this.params = res.data
          localStorage.setItem('secret', JSON.stringify(res.data))
        }
      })
    },
    uploadFile(data) {
      return new Promise((resolve, reject) => {
        const cos = new COS({
          SecretId: this.params.configs.credentials.tmpSecretId,
          SecretKey: this.params.configs.credentials.tmpSecretKey,
          SecurityToken: this.params.configs.credentials.sessionToken,
          StartTime: this.params.configs.startTime,
          ExpiredTime: this.params.configs.expiredTime
        })
        const that = this
        cos.uploadFile(
          {
            Bucket: this.params.bucket,
            Region: this.params.region /* 存储桶所在地域，必须字段 */,
            Key: `${this.params.base_path}/${data[0].name}${Math.random()}`,
            Body: data[0],
            onProgress: function (progressData) {
              that.onProgress = true
              that.progress = +Number(
                (progressData.loaded / 1024 / (progressData.total / 1024)) * 100
              ).toFixed(2)
              if (that.progress === 100) {
                that.onProgress = false
              }
            },
            onFileFinish: function () {
              const timer = setTimeout(() => {
                that.progress = 0
                clearTimeout(timer)
              }, 2000)
            }
          },
          function (err, data) {
            if (err) {
              reject(err)
            } else {
              let reg = /\S+\.com/
              resolve(`${baseApi.IMAGE_URL}/storage${data.Location.replace(reg, '')}`)
            }
          }
        )
      })
    },
    submit() {
      this.$emit('submit', this.editor.txt.html())
    }
  }
}
</script>
<style lang="scss" scoped>
.message {
  position: fixed;
  top: -10px;
  left: 0;
  right: 0;
  width: 35%;
  margin: 0 auto;
  z-index: 99;
  opacity: 0;
  transition: all 2s;
}
.on-progress {
  opacity: 1;
  transform: translateY(125px);
}
.save {
  margin-top: 20px;
}
</style>

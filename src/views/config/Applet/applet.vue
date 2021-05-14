<template>
  <div></div>
</template>

<script>
import dialog from '@/components/dialog'
import Wangeditor from 'wangeditor'
import baseApi from '@/lib/axios/baseApi'
export default {
  data() {
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
      options: [],
      businessData: [],
      baleImgList: [], // 小程序首页视频入口图
      evaluationImgList: [], // 小程序首页评论入口图
      customerList: [], // 小程序预报页图
      freightList: [], // 小程序运费查询页面
      logisticsList: [], // 物流查询页面
      supportList: [], // 支持与帮助中心图
      shareList: [], // 分享图
      indexList: [], // 首页
      videoList: [], // 视频区
      commentList: [], // 评论区
      centerList: [], // 个人中心背景
      licenseList: [], // 协议背景图
      approveList: [], // 增加代理成功提示
      warehouseList: [], // 仓库背景图
      messageData: [],
      backgroundImg: [], // 海报配置背景图像
      choosePoster: '',
      setForm: {
        freight_image: [],
        video_entrance_image: [],
        comment_entrance_image: [],
        forecast_image: []
      },
      backgroundList: {
        // 海报配置
        display_user_avatar: 0,
        display_user_name: 0,
        display_share_info: 0,
        avatar_size: '',
        background_images: [],
        share_info: ''
      },
      validateList: {
        // 功能配置
        validate_phone: '',
        validate_email: ''
      },
      params: {
        title: '',
        language: '',
        content: ''
      },
      editor: null,
      rules: {
        app_id: [{ required: true, message: this.$t('请输入AppId'), trigger: 'change' }],
        secret: [{ required: true, message: this.$t('请输入AppSecret'), trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.editor = new Wangeditor('#editor')
    this.editor.customConfig.menus = [
      'head',
      'fontSize',
      'fontName',
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'foreColor',
      'backColor',
      'link',
      'list',
      'justify',
      'quote',
      'video',
      'image',
      'table'
    ]
    this.editor.customConfig.onchange = html => {
      this.params.content = html
    }
    this.editor.customConfig.uploadImgServer = `${baseApi.BASE_API_URL}/upload/images`
    this.editor.customConfig.uploadImgParams = {}
    this.editor.customConfig.uploadImgHeaders = {
      Authorization: this.$store.state.token
    }
    this.editor.customConfig.uploadFileName = `images[${0}][file]`
    this.editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result) => {
        console.log(result)
        if (result.ret === 1) {
          this.$message.success(this.$t('上传成功'))
          let url = `${baseApi.IMAGE_URL}${result.data[0].path}`
          insertImg(url)
        }
      }
    }
    this.editor.customConfig.zIndex = 500
    this.editor.customConfig.showLinkImg = true
    this.editor.create()
    console.log(this.editor, 'this.editor')
  },
  created() {
    this.activeName = '1'
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request.getMini().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.appletForm = res.data
          this.severData = [res.data]
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取语言列表
    getLanguage() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    // 切换语言
    changeLang() {
      this.$request
        .getTranshipment({
          lang: this.params.language
        })
        .then(res => {
          if (res.ret) {
            this.params.title = res.data.title
            this.params.content = res.data.content
            this.params.language = res.data.language
            this.editor.txt.html(this.params.content)
          }
        })
    },
    getPick() {
      this.tableLoading = true
      this.$request.getTemplate().then(res => {
        this.tableLoading = false
        if (res.ret) {
          console.log('data', res.data)
          res.data.forEach(item => {
            item.disabled = true
            item.copySN = item.template_id
          })
          this.messageData = res.data
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    changeSize() {
      if (this.backgroundList.avatar_size > 200) {
        this.backgroundList.avatar_size = 200
        this.$message.error(this.$t('二维码尺寸最大不能超过200px'))
      }
    },
    // 获取图片配置
    getImg() {
      this.$request.getProgramImg().then(res => {
        this.setForm = res.data
        res.data.video_entrance_image && (this.baleImgList[0] = res.data.video_entrance_image)
        res.data.comment_entrance_image &&
          (this.evaluationImgList[0] = res.data.comment_entrance_image)
        res.data.forecast_image && (this.customerList[0] = res.data.forecast_image)
        res.data.freight_image && (this.freightList[0] = res.data.freight_image)
        res.data.track_image && (this.logisticsList[0] = res.data.track_image)
        res.data.support_image && (this.supportList[0] = res.data.support_image)
        res.data.share_image && (this.shareList[0] = res.data.share_image)
        res.data.index_image && (this.indexList[0] = res.data.index_image)
        res.data.video_image && (this.videoList[0] = res.data.video_image)
        res.data.comment_image && (this.commentList[0] = res.data.comment_image)
        res.data.user_center_image && (this.centerList[0] = res.data.user_center_image)
        res.data.license_image && (this.licenseList[0] = res.data.license_image)
        res.data.agent_approve_image && (this.approveList[0] = res.data.agent_approve_image)
        res.data.warehouse_image && (this.warehouseList[0] = res.data.warehouse_image)
      })
    },
    // 获取海报配置
    getBackground() {
      this.$request.getProgramShare().then(res => {
        this.backgroundList = res.data
        res.data.background_images && (this.backgroundImg = res.data.background_images)
      })
    },
    // 修改海报配置
    updateBackground() {
      if (this.baleImgList) {
        this.backgroundList.background_images = this.backgroundImg
      } else {
        this.backgroundList.background_images = []
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
          this.getBackground()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取功能配置
    getValidate() {
      this.$request.getValidate().then(res => {
        if (res.ret) {
          this.validateList = res.data
        }
      })
    },
    // 更新功能配置
    saveValidate() {
      this.$request.updateValidate(this.validateList).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getValidate()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    saveDev(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.updateMini(this.appletForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
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
        } else {
          return false
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
    // 预览小程序海报
    previewBackground(image) {
      console.log(image, 'image')
      this.choosePoster = image
    },
    // 上传海报配置背景图像
    uploadBgImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.backgroundImg.push(item.path)
          })
        }
      })
    },
    // 上传小程序首页视频图片
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
    // 上传小程序首页评论入口图
    uploadEvaluationImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.evaluationImgList.push(item.path)
          })
        }
      })
    },
    // 上传物流查询页面图
    uploadTrack(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.logisticsList.push(item.path)
          })
        }
      })
    },
    // 上传支持与帮助中心图
    uploadSupport(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.supportList.push(item.path)
          })
        }
      })
    },
    // 上传分享图
    uploadShare(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.shareList.push(item.path)
          })
        }
      })
    },
    // 上传首页
    uploadIndex(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.indexList.push(item.path)
          })
        }
      })
    },
    // 上传视频区
    uploadVideo(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.videoList.push(item.path)
          })
        }
      })
    },
    // 个人中心背景图片
    uploadCenter(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.centerList.push(item.path)
          })
        }
      })
    },
    // 协议背景图片
    uploadLicense(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.licenseList.push(item.path)
          })
        }
      })
    },
    // 代理成功提示图
    uploadApprove(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.approveList.push(item.path)
          })
        }
      })
    },
    // 仓库背景图
    uploadWarehouse(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.warehouseList.push(item.path)
          })
        }
      })
    },
    // 上传评论区
    uploadComment(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.commentList.push(item.path)
          })
        }
      })
    },
    // 上传小程序预报页图
    uploadCustomer(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.customerList.push(item.path)
          })
        }
      })
    },
    // 上传小程序运费查询页图
    uploadFreight(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.freightList.push(item.path)
          })
        }
      })
    },
    // 删除海报配置 背景图
    onDeleteBg(index) {
      this.backgroundImg.splice(index, 1)
    },
    // 删除小程序首页视频入口图
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    // 删除小程序首页评论入口图
    onDeleteEva(index) {
      this.evaluationImgList.splice(index, 1)
    },
    // 删除物流查询页面
    onDeleteTrack(index) {
      this.logisticsList.splice(index, 1)
    },
    // 删除支持与帮助中心图
    onDeleteSupport(index) {
      this.supportList.splice(index, 1)
    },
    // 分享图
    onDeleteShare(index) {
      this.shareList.splice(index, 1)
    },
    // 首页图
    onDeleteIndex(index) {
      this.indexList.splice(index, 1)
    },
    // 视频图
    onDeleteVideo(index) {
      this.videoList.splice(index, 1)
    },
    // 个人中心背景图
    onDeleteCenter(index) {
      this.centerList.splice(index, 1)
    },
    // 协议背景图片
    onDeleteLicense(index) {
      this.licenseList.splice(index, 1)
    },
    // 代理成功提示图
    onDeleteApprove(index) {
      this.approveList.splice(index, 1)
    },
    // 仓库背景图
    onDeleteWarehouse(index) {
      this.warehouseList.splice(index, 1)
    },
    onDeleteComment(index) {
      this.commentList.splice(index, 1)
    },
    // 删除小程序预报页图
    onDeleteCus(index) {
      this.customerList.splice(index, 1)
    },
    // 删除小程序运费查询页图
    onDeleteFre(index) {
      this.freightList.splice(index, 1)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 添加转运快递单号
    edit(row) {
      row.disabled = !row.disabled
    },
    // 修改图片配置
    editOthers() {
      if (this.baleImgList[0]) {
        this.setForm.video_entrance_image = this.baleImgList[0]
      } else {
        this.setForm.video_entrance_image = []
      }
      if (this.customerList[0]) {
        this.setForm.forecast_image = this.customerList[0]
      } else {
        this.setForm.forecast_image = []
      }
      if (this.evaluationImgList[0]) {
        this.setForm.comment_entrance_image = this.evaluationImgList[0]
      } else {
        this.setForm.comment_entrance_image = []
      }
      if (this.logisticsList[0]) {
        this.setForm.track_image = this.logisticsList[0]
      } else {
        this.setForm.track_entrance_image = []
      }
      if (this.supportList[0]) {
        this.setForm.support_image = this.supportList[0]
      } else {
        this.setForm.support_image = []
      }
      if (this.shareList[0]) {
        this.setForm.share_image = this.shareList[0]
      } else {
        this.setForm.share_image = []
      }
      if (this.indexList[0]) {
        this.setForm.index_image = this.indexList[0]
      } else {
        this.setForm.index_image = []
      }
      if (this.videoList[0]) {
        this.setForm.video_image = this.videoList[0]
      } else {
        this.setForm.video_image = []
      }
      if (this.commentList[0]) {
        this.setForm.comment_image = this.commentList[0]
      } else {
        this.setForm.comment_image = []
      }
      if (this.freightList[0]) {
        this.setForm.freight_image = this.freightList[0]
      } else {
        this.setForm.freight_image = []
      }
      if (this.centerList[0]) {
        this.setForm.user_center_image = this.centerList[0]
      } else {
        this.setForm.user_center_image = []
      }
      if (this.licenseList[0]) {
        this.setForm.license_image = this.licenseList[0]
      } else {
        this.setForm.license_image = []
      }
      if (this.approveList[0]) {
        this.setForm.agent_approve_image = this.approveList[0]
      } else {
        this.setForm.agent_approve_image = []
      }
      if (this.warehouseList[0]) {
        this.setForm.warehouse_image = this.warehouseList[0]
      } else {
        this.setForm.warehouse_image = []
      }
      this.$request.changeProgramImg(this.setForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getImg()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 取消
    cancel(row) {
      row.template_id = row.copySN
      row.disabled = true
    },
    // 保存添加转运快递单号
    saveLogistics(row) {
      console.log(row, 'row')
      if (!row.template_id) {
        return this.$message.error(this.$t('请输入模版标示'))
      }
      this.$request
        .updateTemplate({
          type: row.type,
          template_id: row.template_id
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('保存成功'),
              message: res.msg,
              type: 'success'
            })
            row.copySN = row.template_id
            row.disabled = true
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 获取如何下单
    getHowOrder() {
      this.$request.getTranshipment().then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.params.language = res.data.language
          this.editor.txt.html(this.params.content)
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText() {
      this.$emit('input', this.editor.txt.html())
    },
    // 保存如何下单
    saveHowOrder() {
      this.$request.updateTranshipment(this.params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getHowOrder()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    handleClick() {
      if (this.activeName === '1') {
        this.getList()
      } else if (this.activeName === '2') {
        this.getPick()
      } else if (this.activeName === '3') {
        this.getImg()
      } else if (this.activeName === '4') {
        this.getBackground()
      } else if (this.activeName === '5') {
        this.getValidate()
      } else if (this.activeName === '6') {
        this.getHowOrder()
        this.getLanguage()
      }
    }
  }
}
</script>

<style lang="scss">
.applet-container {
  .tabLength {
    width: 560px !important;
    // width: 300px !important;
  }
  .applet-left {
    padding: 15px;
    background-color: #fff !important;
  }
  .savaBtn {
    background-color: #3540a5;
    color: #fff;
    width: 100px;
  }
  .input-sty {
    width: 60%;
  }
  .el-input__inner {
  }
  .setOthers {
    background-color: #fff !important;
    padding: 20px;
    .el-input {
      width: 30%;
    }
    .el-textarea__inner {
      width: 30%;
      background-color: #f5f5f5;
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
  }
  .setOthers {
    background-color: #fff !important;
    padding: 20px;
    .el-input {
      width: 30%;
    }
    .el-textarea__inner {
      width: 30%;
      background-color: #f5f5f5;
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
  .save-btn {
    color: #fff;
    background-color: #3540a5;
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
    width: 300px;
    height: 580px;
    overflow: hidden;
    vertical-align: top;
    display: inline-block;
    text-align: center;
    background-color: #fff;
    padding: 20px 10px;
    position: relative;
    margin-right: 40px;
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
    padding: 15px;
    height: 880px;
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

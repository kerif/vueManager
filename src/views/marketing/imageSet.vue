<template>
  <div class="image-set-container">
    <div class="setOthers">
      <el-form :model="setForm" ref="setForm" class="demo-ruleForm"
      label-position="top">
      <el-row :gutter="20">
        <!-- 小程序首页视频入口图 -->
        <!-- <el-col :span="8">
        <div class="new-top">
          <el-form-item class="updateChe">
            <span class="img-item" v-for="(item, index) in baleImgList.slice(0, 1)" :key="index">
            <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
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
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
            </el-upload>
          </el-form-item>
          <p class="font-sty">{{$t('小程序首页视频入口图')}}</p>
          <div class="user-bottom">
            <div class="bottom-right">
              <span class="suggest-btn">{{$t('建议尺寸：345px*120px')}}</span>
            </div>
          </div>
        </div>
        </el-col> -->
          <!-- 小程序首页评论入口图 -->
        <!-- <el-col :span="8">
          <div class="new-top">
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in evaluationImgList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteEva(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="evaluationImgList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadEvaluationImg"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
          </el-form-item>
          <p class="font-sty">{{$t('小程序首页评论入口图')}}</p>
           <div class="user-bottom">
            <div class="bottom-right">
              <span class="suggest-btn">{{$t('建议尺寸：345px*120px')}}</span>
            </div>
          </div>
          </div>
        </el-col> -->
          <!-- 小程序预报页图 -->
        <el-col :span="8">
          <div class="new-top">
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in customerList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteCus(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="customerList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadCustomer"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
          </el-form-item>
          <p class="font-sty">{{$t('小程序预报页图')}}</p>
          <div class="user-bottom">
            <!-- <div class="bottom-left">
              <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
            </div> -->
            <div class="bottom-right">
              <span class="suggest-btn">{{$t('建议尺寸：355px*160px')}}</span>
            </div>
          </div>
          </div>
        </el-col>
      <!-- 代理成功提示图 -->
        <el-col :span="8">
          <div class="new-top">
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in approveList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteApprove(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="approveList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadApprove"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload><br/>
          </el-form-item>
          <p class="font-sty">{{$t('代理成功提示图')}}</p>
          <div class="user-bottom">
              <!-- <div class="bottom-left">
                <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
              </div> -->
              <div class="bottom-right">
                <span class="suggest-btn">{{$t('建议尺寸：612px*542px')}}</span>
              </div>
          </div>
          </div>
        </el-col>
      <!-- 仓库背景图 -->
        <el-col :span="8">
          <div class="new-top">
          <el-form-item  class="updateChe">
              <span class="img-item" v-for="(item, index) in warehouseList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteWarehouse(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="warehouseList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadWarehouse"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload><br/>
          </el-form-item>
          <p class="font-sty">{{$t('仓库背景图')}}</p>
          <div class="user-bottom">
              <!-- <div class="bottom-left">
                <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
              </div> -->
              <div class="bottom-right">
                <span class="suggest-btn">{{$t('建议尺寸：612px*542px')}}</span>
              </div>
          </div>
          </div>
        </el-col>
        </el-row>
      <el-row :gutter="20">
        <!-- 小程序运费查询页图 -->
        <el-col :span="8">
          <div class="new-top">
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in freightList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteFre(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="freightList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadFreight"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload><br/>
          </el-form-item>
          <p class="font-sty">{{$t('小程序运费查询页图')}}</p>
          <div class="user-bottom">
            <!-- <div class="bottom-left">
              <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
            </div> -->
            <div class="bottom-right">
              <span class="suggest-btn">{{$t('建议尺寸：355px*160px')}}</span>
            </div>
          </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="new-top">
          <!-- 物流查询页图” -->
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in logisticsList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteTrack(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="logisticsList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadTrack"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
          </el-form-item>
          <p class="font-sty">{{$t('物流查询页图')}}</p>
          <div class="user-bottom">
            <!-- <div class="bottom-left">
              <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
            </div> -->
            <div class="bottom-right">
              <span class="suggest-btn">{{$t('建议尺寸：355px*160px')}}</span>
            </div>
          </div>
          </div>
        </el-col>
        <el-col :span="8">
        <!-- 支持与帮助中心 -->
          <div class="new-top">
          <el-form-item class="updateChe">
            <span class="img-item" v-for="(item, index) in supportList" :key="index">
            <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
            <span class="model-box"></span>
            <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                <i class="el-icon-delete" @click="onDeleteSupport(index)"></i>
            </span>
            </span>
            <el-upload
              v-show="supportList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadSupport"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
          </el-form-item>
          <p class="font-sty">{{$t('支持与帮助中心')}}</p>
          <div class="user-bottom">
            <!-- <div class="bottom-left">
              <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
            </div> -->
            <div class="bottom-right">
              <span class="suggest-btn">{{$t('建议尺寸：355px*160px')}}</span>
            </div>
          </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <!-- 分享页 -->
        <!-- <el-col :span="8">
          <div class="new-top">
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in shareList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteShare(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="shareList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadShare"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload><br/>
          </el-form-item>
          <p class="font-sty">{{$t('分享页')}}</p>
          <div class="user-bottom">
            <div class="bottom-right">
              <span class="suggest-btn">{{$t('建议尺寸：750px*1204px')}}</span>
            </div>
          </div>
          </div>
        </el-col> -->
        <!-- 协议背景图片 -->
        <el-col :span="8">
          <div class="new-top">
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in licenseList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteLicense(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="licenseList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadLicense"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
          </el-form-item>
          <p class="font-sty">{{$t('协议背景图片')}}</p>
          <div class="user-bottom">
              <!-- <div class="bottom-left">
                <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
              </div> -->
              <div class="bottom-right">
                <span class="suggest-btn">{{$t('建议尺寸：710px*120px')}}</span>
              </div>
          </div>
          </div>
        </el-col>
        <!-- 首页 -->
        <el-col :span="8">
          <div class="new-top">
          <el-form-item class="updateChe">
            <span class="img-item" v-for="(item, index) in indexList" :key="index">
            <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
            <span class="model-box"></span>
            <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                <i class="el-icon-delete" @click="onDeleteIndex(index)"></i>
            </span>
            </span>
            <el-upload
              v-show="indexList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadIndex"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
          </el-form-item>
          <p class="font-sty">{{$t('首页')}}</p>
          <div class="user-bottom">
            <!-- <div class="bottom-left">
              <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
            </div> -->
            <div class="bottom-right">
              <span class="suggest-btn">{{$t('建议尺寸：355px*160px')}}</span>
            </div>
          </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="new-top">
          <!-- 视频区 -->
            <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in videoList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteVideo(index)"></i>
              </span>
              </span>
              <el-upload
                v-show="videoList.length < 1"
                class="avatar-uploader"
                action=""
                list-type="picture-card"
                :http-request="uploadVideo"
                :show-file-list="false">
                <i class="el-icon-plus">
                </i>
              </el-upload>
              </el-form-item>
            <p class="font-sty">{{$t('视频区')}}</p>
            <div class="user-bottom">
              <!-- <div class="bottom-left">
                <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
              </div> -->
              <div class="bottom-right">
                <span class="suggest-btn">{{$t('建议尺寸：355px*160px')}}</span>
              </div>
          </div>
          </div>
        </el-col>
        </el-row>
      <el-row :gutter="20">
        <!-- 评论区 -->
        <el-col :span="8">
          <div class="new-top">
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in commentList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteComment(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="commentList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadComment"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
          </el-form-item>
          <p class="font-sty">{{$t('评论区')}}</p>
          <div class="user-bottom">
              <!-- <div class="bottom-left">
                <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
              </div> -->
              <div class="bottom-right">
                <span class="suggest-btn">{{$t('建议尺寸：355px*160px')}}</span>
              </div>
          </div>
          </div>
        </el-col>
      <el-col :span="8">
        <div class="new-top">
        <!-- 个人中心背景图片 -->
          <el-form-item class="updateChe">
              <span class="img-item" v-for="(item, index) in centerList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                  <i class="el-icon-delete" @click="onDeleteCenter(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="centerList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadCenter"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload><br/>
          </el-form-item>
         <p class="font-sty">{{$t('个人中心背景图片')}}</p>
          <div class="user-bottom">
              <!-- <div class="bottom-left">
                <el-button class="btn-deep-blue">{{$t('编辑')}}</el-button>
              </div> -->
              <div class="bottom-right">
                <span class="suggest-btn">{{$t('建议尺寸：750px*480px')}}</span>
              </div>
          </div>
          </div>
        </el-col>
        </el-row>
      <el-row :gutter="20">
      </el-row>
    </el-form>
    <el-button class="save-btn" @click="editOthers">{{$t('保存')}}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      tableLoading: false,
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
      }
    }
  },
  created () {
    this.getImg()
  },
  methods: {
    // 获取图片配置
    getImg () {
      this.$request.getProgramImg().then(res => {
        this.setForm = res.data
        res.data.video_entrance_image && (this.baleImgList[0] = res.data.video_entrance_image)
        res.data.comment_entrance_image && (this.evaluationImgList[0] = res.data.comment_entrance_image)
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
    // 上传小程序首页评论入口图
    uploadEvaluationImg (item) {
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
    uploadTrack (item) {
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
    uploadSupport (item) {
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
    uploadShare (item) {
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
    uploadIndex (item) {
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
    uploadVideo (item) {
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
    uploadCenter (item) {
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
    uploadLicense (item) {
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
    uploadApprove (item) {
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
    uploadWarehouse (item) {
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
    uploadComment (item) {
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
    uploadCustomer (item) {
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
    uploadFreight (item) {
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
    onDeleteBg (index) {
      this.backgroundImg.splice(index, 1)
    },
    // 删除小程序首页视频入口图
    onDeleteImg (index) {
      this.baleImgList.splice(index, 1)
    },
    // 删除小程序首页评论入口图
    onDeleteEva (index) {
      this.evaluationImgList.splice(index, 1)
    },
    // 删除物流查询页面
    onDeleteTrack (index) {
      this.logisticsList.splice(index, 1)
    },
    // 删除支持与帮助中心图
    onDeleteSupport (index) {
      this.supportList.splice(index, 1)
    },
    // 分享图
    onDeleteShare (index) {
      this.shareList.splice(index, 1)
    },
    // 首页图
    onDeleteIndex (index) {
      this.indexList.splice(index, 1)
    },
    // 视频图
    onDeleteVideo (index) {
      this.videoList.splice(index, 1)
    },
    // 个人中心背景图
    onDeleteCenter (index) {
      this.centerList.splice(index, 1)
    },
    // 协议背景图片
    onDeleteLicense (index) {
      this.licenseList.splice(index, 1)
    },
    // 代理成功提示图
    onDeleteApprove (index) {
      this.approveList.splice(index, 1)
    },
    // 仓库背景图
    onDeleteWarehouse (index) {
      this.warehouseList.splice(index, 1)
    },
    onDeleteComment (index) {
      this.commentList.splice(index, 1)
    },
    // 删除小程序预报页图
    onDeleteCus (index) {
      this.customerList.splice(index, 1)
    },
    // 删除小程序运费查询页图
    onDeleteFre (index) {
      this.freightList.splice(index, 1)
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 修改图片配置
    editOthers () {
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
    }
  }
}
</script>

<style lang="scss">
.image-set-container {
   .tabLength {
    // width: 560px !important;
    width: 500px !important;
  }
  .setOthers {
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
      // width: 300px;
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
  .suggest-btn {
    color: gray;
    font-size: 12px;
  }
  .new-top {
    margin-bottom: 10px;
    padding: 20px;
    background: #fff;
  }
  .user-bottom {
    overflow: hidden;
    .bottom-left {
      float: left;
    }
    .bottom-right {
      float: right;
    }
  }
  .font-sty {
    color: #606266;
    font-size: 14px;
  }
}
</style>

<template>
  <div class="applet-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="handleClick">
      <!-- 开发配置 -->
      <el-tab-pane label="开发配置" name="1"></el-tab-pane>
      <!-- 消息模版 -->
      <el-tab-pane label="消息模版" name="2"></el-tab-pane>
      <!-- 图片配置 -->
      <el-tab-pane label="图片配置" name="3"></el-tab-pane>
    </el-tabs>
    <el-row v-if="activeName === '1'">
      <el-col :span="11">
        <div class="applet-left">
        <h4>开发者id</h4>
        <el-form :model="appletForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
          <el-form-item label="AppId(小程序ID)" prop="app_id">
            <el-input placeholder="请输入AppId" v-model="appletForm.app_id"></el-input>
          </el-form-item>
          <el-form-item label="AppSecret(小程序密钥)" prop="secret">
            <el-input placeholder="请输入AppSecret" v-model="appletForm.secret"></el-input>
          </el-form-item>
          <el-form-item label="小程序token">
            <el-input placeholder="请输入小程序token" v-model="appletForm.token"></el-input>
          </el-form-item>
          <el-form-item label="aes_key">
            <el-input placeholder="请输入aes_key" v-model="appletForm.aes_key"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="savaBtn" @click="saveDev('ruleForm')">保存</el-button>
        </div>
      </el-col>
       <el-col :span="12" :offset="1">
         <div class="right-server">
           <h4>服务器域名</h4>
            <el-table class="data-list" border stripe
              :data="severData"
              v-loading="tableLoading">
              <el-table-column label="服务器配置">request合法域名</el-table-column>
              <el-table-column label="域名" prop="server_url"></el-table-column>
            </el-table>
            <h4>业务域名</h4>
            <el-table class="data-list" border stripe
              :data="severData"
              v-loading="tableLoading">
              <el-table-column label="配置信息">request合法域名</el-table-column>
              <el-table-column label="信息" prop="server_url"></el-table-column>
            </el-table>
         </div>
       </el-col>
    </el-row>
    <div v-if="activeName === '2'">
      <el-table :data="messageData" v-loading="tableLoading" class="data-list" border stripe>
        <el-table-column label="id" prop="type" width="100"></el-table-column>
        <el-table-column label="模版类型" prop="type_name">
        </el-table-column>
        <el-table-column label="模版标示">
          <template slot-scope="scope">
          <template>
          <el-input v-model="scope.row.template_id" :disabled="scope.row.disabled"></el-input>
          </template>
        </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="btn-green" @click="edit(scope.row)" v-if="scope.row.disabled">编辑</el-button>
          <el-button size="small" class="btn-light-red detailsBtn"
           v-show="!scope.row.disabled"
           @click="saveLogistics(scope.row)">保存</el-button>
          <el-button size="small" class="btn-blue detailsBtn"
          v-show="!scope.row.disabled" @click="cancel(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="activeName === '3'">
      <div class="setOthers">
        <el-form :model="setForm" ref="setForm" class="demo-ruleForm"
        label-position="top" :rules="rules">
        <el-row :gutter="20">
         <el-col :span="6">
            <!-- 小程序首页视频入口图 -->
            <el-form-item label="*小程序首页视频入口图" class="updateChe">
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
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：173px*60px</span>
            </el-form-item>
          </el-col>
            <!-- 小程序首页评论入口图 -->
          <el-col :span="6">
            <el-form-item label="*小程序首页评论入口图" class="updateChe">
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
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：173px*60px</span>
            </el-form-item>
          </el-col>
            <!-- 小程序预报页图 -->
          <el-col :span="6">
            <el-form-item label="*小程序预报页图" class="updateChe">
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
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：355px*160px</span>
            </el-form-item>
          </el-col>
            <!-- 小程序运费查询页图 -->
          <el-col :span="6">
            <el-form-item label="*小程序运费查询页图" class="updateChe">
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
            <span class="suggest-btn">建议尺寸：355px*160px</span>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row :gutter="20">
         <el-col :span="6">
            <!-- 物流查询页图” -->
            <el-form-item label="*物流查询页图" class="updateChe">
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
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：173px*60px</span>
            </el-form-item>
          </el-col>
            <!-- 支持与帮助中心 -->
          <el-col :span="6">
            <el-form-item label="*支持与帮助中心" class="updateChe">
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
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：173px*60px</span>
            </el-form-item>
          </el-col>
          <!-- 分享页 -->
          <el-col :span="6">
            <el-form-item label="*分享页" class="updateChe">
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
            <span class="suggest-btn">建议尺寸：355px*160px</span>
            </el-form-item>
          </el-col>
          <!-- 首页 -->
          <el-col :span="6">
            <el-form-item label="*首页" class="updateChe">
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
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：355px*160px</span>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row :gutter="20">
         <el-col :span="6">
          <!-- 视频区 -->
            <el-form-item label="*视频区" class="updateChe">
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
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：173px*60px</span>
            </el-form-item>
          </el-col>
          <!-- 评论区 -->
          <el-col :span="6">
            <el-form-item label="*评论区" class="updateChe">
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
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：173px*60px</span>
            </el-form-item>
          </el-col>
          </el-row>
          </el-form>
          <el-button class="save-btn" @click="editOthers">保存</el-button>
        </div>
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
      evaluationImgList: [], // 小程序首页评论入口图
      customerList: [], // 小程序预报页图
      freightList: [], // 小程序运费查询页面
      logisticsList: [], // 物流查询页面
      supportList: [], // 支持与帮助中心图
      shareList: [], // 分享图
      indexList: [], // 首页
      videoList: [], // 视频区
      commentList: [], // 评论区
      messageData: [],
      setForm: {
        freight_image: [],
        video_entrance_image: [],
        comment_entrance_image: [],
        forecast_image: []
      },
      rules: {
        app_id: [
          { required: true, message: '请输入AppId', trigger: 'change' }
        ],
        secret: [
          { required: true, message: '请输入AppSecret', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.activeName = '1'
    this.getList()
  },
  methods: {
    getList () {
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
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getPick () {
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
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
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
      })
    },
    saveDev (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.updateMini(this.appletForm).then(res => {
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
        } else {
          return false
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
    // 上传评论区
    uploadComment (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.commentList.push(item)
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
    // 添加转运快递单号
    edit (row) {
      row.disabled = !row.disabled
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
      if (!this.baleImgList[0]) {
        return this.$message.error('请上传小程序首页视频入口图')
      } else if (!this.customerList[0]) {
        return this.$message.error('请上传小程序预报页图')
      } else if (!this.evaluationImgList[0]) {
        return this.$message.error('请上传小程序首页评论入口图')
      } else if (!this.freightList[0]) {
        return this.$message.error('请上传小程序运费查询页图')
      } else if (!this.logisticsList[0]) {
        return this.$message.error('请上传物流查询页面')
      } else if (!this.supportList[0]) {
        return this.$message.error('请上传支持与帮助中心图')
      } else if (!this.shareList[0]) {
        return this.$message.error('请上传分享图')
      } else if (!this.indexList[0]) {
        return this.$message.error('请上传首页图')
      } else if (!this.videoList[0]) {
        return this.$message.error('请上传视频区图')
      } else if (!this.commentList[0]) {
        return this.$message.error('请上传评论区图')
      }
      this.$request.changeProgramImg(this.setForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '成功',
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
    cancel (row) {
      row.template_id = row.copySN
      row.disabled = true
    },
    // 保存添加转运快递单号
    saveLogistics (row) {
      console.log(row, 'row')
      if (!row.template_id) {
        return this.$message.error('请输入模版标示')
      }
      this.$request.updateTemplate({
        type: row.type,
        template_id: row.template_id
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: '保存成功',
            message: res.msg,
            type: 'success'
          })
          row.copySN = row.template_id
          row.disabled = true
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    handleClick () {
      if (this.activeName === '1') {
        this.getList()
      } else if (this.activeName === '2') {
        this.getPick()
      } else if (this.activeName === '3') {
        this.getImg()
        console.log('111')
      }
    }
  }
}
</script>

<style lang="scss">
.applet-container {
   .tabLength {
    width: 300px !important;
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
  }
  .save-btn {
    color: #fff;
    background-color: #3540A5;
  }
  .suggest-btn {
    color: gray;
    font-size: 12px;
  }
}
</style>

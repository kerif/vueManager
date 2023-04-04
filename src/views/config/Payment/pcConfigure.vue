<template>
  <div class="setOthers-container">
    <el-form
      :model="setForm"
      ref="setForm"
      class="demo-ruleForm"
      label-width="150px"
      label-position="left"
    >
      <!-- 网站名称 -->
      <el-form-item :label="$t('网站名称')">
        <el-input v-model="setForm.website_name"> </el-input>
        <el-button
          class="btn-deep-purple others-btn"
          v-for="item in formatLangData"
          :key="item.id"
          @click="onPc(item)"
          >{{ item.name }}</el-button
        >
      </el-form-item>
      <!-- 网站链接 -->
      <el-form-item class="url-sty">
        <div slot="label">
          <span>{{ $t('网站链接') }}</span>
          <el-tooltip
            effect="dark"
            :content="
              $t(
                '主要用于集运插件识别（非常重要,多个用英文逗号切分，例如www.baidu.com,www.google.com'
              )
            "
            placement="top"
          >
            <span class="el-icon-question icon-question"></span>
          </el-tooltip>
        </div>
        <el-input
          v-model="setForm.pc_website_url"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4 }"
        >
        </el-input>
      </el-form-item>
      <el-form-item class="url-sty">
        <div slot="label">
          <span>{{ $t('H5链接') }}</span>
          <el-tooltip
            effect="dark"
            :content="
              $t(
                '主要用于集运插件识别（非常重要,多个用英文逗号切分，例如http.www.baidu.com,http.www.google.com'
              )
            "
            placement="top"
          >
            <span class="el-icon-question icon-question"></span>
          </el-tooltip>
        </div>
        <el-input
          v-model="setForm.h5_website_url"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4 }"
        >
        </el-input>
      </el-form-item>
      <!-- 网站ID -->
      <el-form-item :label="$t('网站ID')">
        <el-input v-model="setForm.app_id"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('备案号')">
        <el-input v-model="setForm.icp"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('网站Secret')">
        <el-input v-model="setForm.secret"> </el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="setForm.token"> </el-input>
      </el-form-item>
      <el-form-item label="aes_key">
        <el-input v-model="setForm.aes_key"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('第三方登录')">
        <el-popover width="500" placement="right" v-model="visibleOauth">
          <el-form ref="form" :model="oauthData" label-width="120px">
            <el-form-item label="Google ID">
              <el-input v-model="oauthData.google_id"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Google 密钥')">
              <el-input v-model="oauthData.google_secret"></el-input>
            </el-form-item>
            <el-form-item label="Line ID">
              <el-input v-model="oauthData.line_id"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Line 密钥')">
              <el-input v-model="oauthData.line_secret"></el-input>
            </el-form-item>
            <el-form-item label="Facebook ID">
              <el-input v-model="oauthData.facebook_id"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Facebook 密钥')">
              <el-input v-model="oauthData.facebook_secret"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visibleOauth = false">{{
              $t('取消')
            }}</el-button>
            <el-button type="primary" size="mini" @click="saveOauth">{{ $t('确定') }}</el-button>
          </div>
          <el-button slot="reference" @click="goOauth">{{ $t('配置') }}</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item :label="$t('客服时间')">
        <el-input v-model="setForm.customer_time"></el-input>
      </el-form-item>
      <el-form-item :label="$t('客服链接')">
        <el-input v-model="setForm.customer_url"></el-input>
      </el-form-item>
      <el-form-item :label="$t('小程序码')" class="updateChe">
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
      <!-- pc端客服二维码 -->
      <el-form-item :label="$t('pc端客服二维码')" class="updateChe">
        <span class="img-item" v-for="(item, index) in customerList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
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
          :http-request="customerImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
      </el-form-item>
      <!-- LOGO -->
      <el-form-item label="LOGO" class="updateChe">
        <span class="img-item" v-for="(item, index) in LogoImgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteLogo(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="LogoImgList.length < 1"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadLogo"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <div style="color: gray; margin-left: 140px">LOGO{{ $t('建议尺寸') }}：90px*20px</div>
      </el-form-item>
      <!-- 登录页背景图 -->
      <el-form-item :label="$t('登录页背景图')" class="updateChe">
        <span class="img-item" v-for="(item, index) in bgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteBg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="bgList.length < 1"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="bgImg"
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
        website_name: '',
        default_img: [],
        customer_qr_code: [],
        pc_website_url: '',
        h5_website_url: '',
        secret: '',
        app_id: '',
        icp: '',
        token: '',
        aes_key: '',
        customer_time: '',
        customer_url: ''
      },
      visibleOauth: false,
      oauthData: {
        google_id: '',
        google_secret: '',
        line_id: '',
        line_secret: '',
        facebook_id: '',
        facebook_secret: ''
      },
      baleImgList: [],
      customerList: [],
      LogoImgList: [],
      bgList: [],
      languageData: []
    }
  },
  created() {
    this.getOthers()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // pc端配置 第三方登录 获取数据
    goOauth() {
      // this.visibleOauth = true
      this.$request.getOauth().then(res => {
        if (res.ret) {
          this.oauthData = res.data
        }
      })
    },
    // pc端配置 修改语言
    onPc(item) {
      console.log(item, 'item')
      dialog({ type: 'pcLang', lang: item }, () => {
        this.getOthers()
      })
    },
    // 更新第三方登录配置数据
    saveOauth() {
      this.$request.updateOauth(this.oauthData).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.visibleOauth = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取pc端配置
    getOthers() {
      this.$request.getWebsite().then(res => {
        this.setForm = res.data
        this.setForm.pc_website_url = res.data.pc_website_url.map(item => item.url).toString()
        this.setForm.h5_website_url = res.data.h5_website_url
        res.data.default_img && (this.baleImgList[0] = res.data.default_img)
        res.data.customer_qr_code && (this.customerList[0] = res.data.customer_qr_code)
        res.data.logo_image && (this.LogoImgList[0] = res.data.logo_image)
        res.data.background_image && (this.bgList[0] = res.data.background_image)
      })
    },
    // 修改pc端配置
    editOthers() {
      if (this.baleImgList[0]) {
        this.setForm.default_img = this.baleImgList[0]
      } else {
        this.setForm.default_img = []
      }
      if (this.customerList[0]) {
        this.setForm.customer_qr_code = this.customerList[0]
      } else {
        this.setForm.customer_qr_code = []
      }
      if (this.LogoImgList[0]) {
        this.setForm.logo_image = this.LogoImgList[0]
      } else {
        this.setForm.logo_image = []
      }
      if (this.bgList[0]) {
        this.setForm.background_image = this.bgList[0]
      } else {
        this.setForm.background_image = []
      }
      if (!this.setForm.website_name) {
        return this.$message.error(this.$t('请输入网站名称'))
      }
      console.log(this.setForm.pc_website_url.split(','))
      this.$request
        .editWebsite({ ...this.setForm, pc_website_url: this.setForm.pc_website_url.split(',') })
        .then(res => {
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
    // pc端客服二维码
    customerImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.customerList.push(item.path)
          })
        }
      })
    },
    // 删除pc端二维码
    onDeleteCus(index) {
      this.customerList.splice(index, 1)
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
    },
    // 删除logo
    onDeleteLogo(index) {
      this.LogoImgList.splice(index, 1)
    },
    // 删除登录页背景图
    onDeleteBg(index) {
      this.bgList.splice(index, 1)
    },
    // 登录页背景图
    bgImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.bgList.push(item.path)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.setOthers-container {
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

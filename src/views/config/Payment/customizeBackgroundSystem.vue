<template>
  <div>
    <el-form label-width="100px" label-position="left" :model="form">
      <el-form-item :label="$t('后台域名')">
        <el-tooltip
          class="info"
          effect="dark"
          :content="
            $t(
              '需登录域名购买平台,对域名进行解析: 将该域名 CNAME 解析到 8.haiouoms.com, 解析后再将域名填入'
            )
          "
          placement="top-start"
        >
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
        <el-input
          v-model="form.domain"
          :placeholder="$t('请输入解析后的域名')"
          class="input-sty"
          clearable
        ></el-input>
        <el-button style="margin-left: 10px" @click="showExample(1)">{{
          $t('查看示例')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('页面标题')">
        <el-input
          v-model="form.title"
          :placeholder="$t('请输入页面标题')"
          class="input-sty"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('页面logo')">
        <span class="img-item" v-if="form.icon">
          <img :src="$baseUrl.IMAGE_URL + form.icon" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.icon)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(1)"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.icon"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="
            item => {
              uploadBaleImg(1, item)
            }
          "
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <span>{{ $t('建议尺寸') }}: 16px*16px</span>
      </el-form-item>
      <el-form-item :label="$t('登录页标题')">
        <el-input
          :placeholder="$t('请输入页面标题')"
          v-model="form.login_title"
          class="input-sty"
          clearable
        ></el-input>
        <el-button style="margin-left: 10px" @click="showExample(2)">{{
          $t('查看示例')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('登录页logo')">
        <span class="img-item" v-if="form.login_logo">
          <img :src="$baseUrl.IMAGE_URL + form.login_logo" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.login_logo)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(2)"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.login_logo"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="
            item => {
              uploadBaleImg(2, item)
            }
          "
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <span>{{ $t('建议尺寸') }}: 46px*46px</span>
      </el-form-item>
      <el-form-item :label="$t('登录页广告图')">
        <span class="img-item" v-if="form.login_image">
          <img :src="$baseUrl.IMAGE_URL + form.login_image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.login_image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(3)"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.login_image"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="
            item => {
              uploadBaleImg(3, item)
            }
          "
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <span>{{ $t('建议尺寸') }}: 500px*450px</span>
      </el-form-item>
      <el-form-item :label="$t('导航栏名称')">
        <el-input
          v-model="form.sidebar_title"
          :placeholder="$t('请输入导航栏展示系统名称')"
          class="input-sty"
          clearable
        ></el-input>
        <el-button style="margin-left: 10px" @click="showExample(3)">{{
          $t('查看示例')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('导航栏图标')">
        <span class="img-item" v-if="form.sidebar_image">
          <img :src="$baseUrl.IMAGE_URL + form.sidebar_image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.sidebar_image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(4)"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.sidebar_image"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="
            item => {
              uploadBaleImg(4, item)
            }
          "
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <span>{{ $t('建议尺寸') }}: 61px*65px</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="save-btn" @click="onConfirm">{{ $t('保存') }}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="imgDialog">
      <div style="text-align: center">
        <img :src="imgUrl" style="max-width: 100%" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      imgDialog: false,
      imgUrl: '',
      form: {
        domain: '',
        title: '',
        icon: '',
        login_title: '',
        login_logo: '',
        login_image: '',
        sidebar_title: '',
        sidebar_image: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.configInfo().then(res => {
        this.form = res.data
      })
    },
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    onDeleteImg(pic) {
      if (pic === 1) {
        this.form.icon = ''
      } else if (pic === 2) {
        this.form.login_logo = ''
      } else if (pic === 3) {
        this.form.login_image = ''
      } else {
        this.form.sidebar_image = ''
      }
    },
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    showExample(type) {
      let url
      this.imgDialog = true
      if (type === 1) {
        url = require('../../../assets/example1.jpg')
      } else if (type === 2) {
        url = require('../../../assets/example2.jpg')
      } else {
        url = require('../../../assets/example3.jpg')
      }
      this.imgUrl = url
    },
    uploadBaleImg(pic, item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          if (pic === 1) {
            this.form.icon = res.data[0].path
          } else if (pic === 2) {
            this.form.login_logo = res.data[0].path
          } else if (pic === 3) {
            this.form.login_image = res.data[0].path
          } else {
            this.form.sidebar_image = res.data[0].path
          }
        }
      })
    },
    onConfirm() {
      this.$request.updateConfigInfo({ ...this.form }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
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

<style>
.info {
  position: absolute;
  top: 10px;
  left: -35px;
  color: #35b85a;
  font-size: 18px;
}
.input-sty {
  width: 60%;
}
</style>

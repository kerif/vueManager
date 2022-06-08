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
          v-model="value"
          :placeholder="$t('请输入解析后的域名')"
          class="input-sty"
        ></el-input>
        <el-button style="margin-left: 10px" @click="showExample(1)">{{
          $t('查看示例')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('页面标题')">
        <el-input v-model="value" :placeholder="$t('请输入页面标题')" class="input-sty"></el-input>
      </el-form-item>
      <el-form-item :label="$t('页面logo')">
        <span class="img-item" v-if="form.image">
          <img :src="$baseUrl.IMAGE_URL + form.image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.image"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <span>{{ $t('建议尺寸') }}: 16*16</span>
      </el-form-item>
      <el-form-item :label="$t('登录页标题')">
        <el-input :placeholder="$t('请输入页面标题')" class="input-sty"></el-input>
        <el-button style="margin-left: 10px" @click="showExample(2)">{{
          $t('查看示例')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('登录页logo')">
        <span class="img-item" v-if="form.image">
          <img :src="$baseUrl.IMAGE_URL + form.image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.image"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <span>{{ $t('建议尺寸') }}: 46*46</span>
      </el-form-item>
      <el-form-item :label="$t('登录页广告图')">
        <span class="img-item" v-if="form.image">
          <img :src="$baseUrl.IMAGE_URL + form.image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.image"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <span>{{ $t('建议尺寸') }}: 500*450</span>
      </el-form-item>
      <el-form-item :label="$t('导航栏名称')">
        <el-input
          v-model="value"
          :placeholder="$t('请输入导航栏展示系统名称')"
          class="input-sty"
        ></el-input>
        <el-button style="margin-left: 10px" @click="showExample(3)">{{
          $t('查看示例')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('导航栏图标')">
        <span class="img-item" v-if="form.image">
          <img :src="$baseUrl.IMAGE_URL + form.image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.image"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <span>{{ $t('建议尺寸') }}: 61*65</span>
      </el-form-item>
    </el-form>
    <!-- 查看图片 -->
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
      value: '',
      imgDialog: false,
      imgUrl: '',
      form: {
        image: ''
      }
    }
  },
  methods: {
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    onDeleteImg() {
      this.form.image = ''
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
    uploadBaleImg() {}
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

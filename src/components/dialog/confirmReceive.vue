<template>
  <el-dialog :visible.sync="show" :title="$t('确认收货')">
    <el-form>
      <el-form-item :label="$t('收货箱数')">
        <el-input v-model="value"></el-input>
      </el-form-item>
      <el-form-item :label="$t('照片')">
        <span class="img-item" v-if="image">
          <img :src="$baseUrl.IMAGE_URL + image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg"></i>
          </span>
        </span>
        <el-upload
          v-show="!image"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('备注')">
        <el-input type="textarea" v-model="value"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      image: '',
      value: ''
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
      this.image = ''
    },
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    uploadBaleImg() {},
    submit() {}
  }
}
</script>

<style></style>

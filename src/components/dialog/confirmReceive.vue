<template>
  <el-dialog :visible.sync="show" :title="$t('确认收货')" @close="clear">
    <el-form :model="form" label-width="100px" :rules="rules">
      <el-form-item :label="$t('收货箱数')" prop="box_count">
        <el-input v-model="form.box_count"></el-input>
      </el-form-item>
      <el-form-item :label="$t('照片')">
        <span class="img-item" v-if="form.images">
          <img :src="$baseUrl.IMAGE_URL + form.images" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(form.images)"></i>
            <i class="el-icon-delete" @click="onDeleteImg"></i>
          </span>
        </span>
        <el-upload
          v-show="!form.images"
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
        <el-input type="textarea" v-model="form.remark"></el-input>
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
      id: '',
      form: {
        box_count: '',
        images: '',
        remark: ''
      },
      rules: {
        box_count: [{ required: true, message: this.$t('请输入收货箱数'), trigger: 'blur' }]
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
      this.form.images = ''
    },
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.form.images = res.data[0].path
        }
      })
    },
    clear() {
      this.form.box_count = ''
      this.form.images = ''
      this.form.remark = ''
    },
    submit() {
      this.$request.confirmReceive(this.id, this.form).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
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

<style></style>

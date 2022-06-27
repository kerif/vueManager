<template>
  <el-dialog :visible.sync="show" :title="$t('确认收货')" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="rules">
      <el-form-item :label="$t('收货箱数')" prop="box_count">
        <el-input v-model="ruleForm.box_count"></el-input>
      </el-form-item>
      <el-form-item :label="$t('照片')">
        <span class="img-item" v-if="ruleForm.images">
          <img :src="$baseUrl.IMAGE_URL + ruleForm.images" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(ruleForm.images)"></i>
            <i class="el-icon-delete" @click="onDeleteImg"></i>
          </span>
        </span>
        <el-upload
          v-show="!ruleForm.images"
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
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      id: '',
      ruleForm: {
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
      this.ruleForm.images = ''
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
          this.ruleForm.images = res.data[0].path
        }
      })
    },
    clear() {
      this.ruleForm.box_count = ''
      this.ruleForm.images = ''
      this.ruleForm.remark = ''
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.confirmReceive(this.id, this.ruleForm).then(res => {
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
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style></style>

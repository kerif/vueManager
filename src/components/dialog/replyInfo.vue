<template>
  <el-dialog :visible.sync="show" :title="$t('回复')" @close="clear">
    <el-form label-position="left" :model="form">
      <el-form-item :label="$t('回复名称')" prop="user_name">
        <el-input
          v-if="edit"
          v-model="form.user_name"
          style="width: 45%"
          :placeholder="$t('客服小二')"
        ></el-input>
        <div v-else>
          <span>{{ $t('客服小二') }}</span>
          <i class="el-icon-edit" @click="edit = !edit"></i>
        </div>
      </el-form-item>
      <el-form-item :label="$t('上传图片')" prop="images">
        <span class="img-item" v-for="(item, index) in form.images" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="form.images.length < 1"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i> </el-upload
        ><br />
      </el-form-item>
      <el-form-item :label="$t('回复内容')" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          placeholder="请输入内容"
          v-model="form.content"
          style="width: 80%"
        >
        </el-input>
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
      edit: false,
      form: {
        images: [],
        user_name: '',
        content: ''
      }
    }
  },
  methods: {
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      this.form.images.splice(index, 1)
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
          res.data.forEach(item => {
            this.form.images.push(item.path)
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    submit() {
      let params = {
        ...this.form
      }
      params.user_name = params.user_name !== '' ? this.form.user_name : this.$t('客服小二')
      this.$request.answerInfo(this.id, params).then(res => {
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
    },
    clear() {
      this.id = ''
      this.form.images = []
      this.form.user_name = ''
      this.form.content = ''
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader {
  display: inline-block;
  vertical-align: top;
  margin-left: 50px;
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
</style>

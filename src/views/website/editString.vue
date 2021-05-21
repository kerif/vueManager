<template>
  <div class="edit-string-container">
    <el-form label-position="top">
      <el-form-item :label="$t('字符串1')">
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.content1"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('字符串2')" v-if="type === 7 || type === 8">
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.content2"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 编辑图片 -->
      <el-form-item :label="$t('内容')" class="updateChe" v-if="type === 6 || type === 7">
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
          <i class="el-icon-plus"> </i> </el-upload
        ><br />
        <span>{{ $t('建议尺寸') }}&nbsp;{{ size }}</span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="saveNotice"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      form: {
        image: '',
        content1: '',
        content2: ''
      },
      baleImgList: [],
      type: '',
      size: ''
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
      this.type = this.$route.params.type
    }
  },
  methods: {
    getList() {
      this.$request.getBlocksDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.type = res.data.type
          this.size = res.data.size
          res.data.content.image && (this.baleImgList[0] = res.data.content.image)
          this.form.content1 = res.data.content.content1
          this.form.content2 = res.data.content.content2
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
    // 删除图片
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        console.log(res)
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    saveNotice() {
      if (this.baleImgList[0]) {
        this.form.image = this.baleImgList[0]
      } else {
        this.form.image = ''
      }
      this.$request
        .updateBlocksDetails(this.$route.params.id, {
          content: {
            image: this.form.image,
            content1: this.form.content1,
            content2: this.form.content2 ? this.form.content2 : ''
          }
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.tips,
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss">
.edit-string-container {
  background-color: #fff !important;
  .input-sty {
    width: 50%;
  }
  .clear-btn {
    margin-top: 40px;
  }
  .map-box {
    width: 100%;
    height: 400px;
    margin-top: 15px;
  }
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
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
</style>

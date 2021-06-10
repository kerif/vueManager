<template>
  <div class="edit-images-container">
    <el-form label-position="top">
      <!-- 编辑图片 -->
      <el-form-item :label="$t('图片一')" class="updateChe">
        <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index, 'first')"></i>
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
      <el-form-item :label="$t('图片二')" class="updateChe">
        <span class="img-item" v-for="(item, index) in secondImgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index, 'second')"></i>
          </span>
        </span>
        <el-upload
          v-show="secondImgList.length < 1"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadSecondImg"
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
      size: '',
      params: {
        image1: '',
        image2: ''
      },
      type: '',
      baleImgList: [],
      secondImgList: [],
      activeName: '',
      map: null,
      marker: null
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
      this.type = this.$route.params.type
    }
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    getList() {
      this.$request.getBlocksDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.size = res.data.size
          console.log(res.data.content.image1, 'res.data.content.image1')
          if (res.data.content) {
            res.data.content.image1 && this.$set(this.baleImgList, 0, res.data.content.image1)
            res.data.content.image2 && this.$set(this.secondImgList, 0, res.data.content.image2)
            console.log(this.baleImgList[0], 'this.baleImgList[0]')
          }
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
    onDeleteImg(index, type) {
      if (type === 'first') {
        this.baleImgList.splice(index, 1)
      } else {
        this.secondImgList.splice(index, 1)
      }
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 上传照片1
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
    // 上传照片2
    uploadSecondImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        console.log(res)
        if (res.ret) {
          res.data.forEach(item => {
            this.secondImgList.push(item.path)
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
        this.params.image1 = this.baleImgList[0]
      } else {
        this.params.image1 = ''
      }
      if (this.secondImgList[0]) {
        this.params.image2 = this.secondImgList[0]
      } else {
        this.params.image2 = ''
      }
      this.$request
        .updateBlocksDetails(this.$route.params.id, {
          content: {
            image1: this.params.image1,
            image2: this.params.image2
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
.edit-images-container {
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

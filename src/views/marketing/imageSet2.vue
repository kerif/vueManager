<template>
  <div class="image-set-container">
    <div class="setOthers">
      <el-form :model="setForm" ref="setForm" class="demo-ruleForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in customerList" :key="index">
            <div class="new-top">
              <el-form-item class="updateChe">
                <span class="img-item" v-if="item.url">
                  <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img" />
                  <span class="model-box"></span>
                  <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                    <i class="el-icon-delete" @click="onDeleteCus(index)"></i>
                  </span>
                </span>
                <el-upload
                  v-show="!item.url"
                  class="avatar-uploader"
                  action=""
                  list-type="picture-card"
                  :http-request="uploadBgImg"
                  :show-file-list="false"
                >
                  <i class="el-icon-plus"> </i>
                </el-upload>
              </el-form-item>
              <p v-if="item.name === 'forecast_image'" class="font-sty">
                {{ $t('小程序预报页图') }}
              </p>
              <p v-else-if="item.name === 'agent_approve_image'" class="font-sty">
                {{ $t('代理成功提示图') }}
              </p>
              <p v-else-if="item.name === 'warehouse_image'" class="font-sty">
                {{ $t('仓库背景图') }}
              </p>
              <p v-else-if="item.name === 'freight_image'" class="font-sty">
                {{ $t('小程序运费查询页图') }}
              </p>
              <p v-else-if="item.name === 'track_image'" class="font-sty">
                {{ $t('物流查询页图') }}
              </p>
              <p v-else-if="item.name === 'support_image'" class="font-sty">
                {{ $t('支持与帮助中心') }}
              </p>
              <p v-else-if="item.name === 'license_image'" class="font-sty">
                {{ $t('协议背景图片') }}
              </p>
              <p v-else-if="item.name === 'index_image'" class="font-sty">
                {{ $t('H5登录/注册页') }}
              </p>
              <p v-else-if="item.name === 'comment_image'" class="font-sty">
                {{ $t('评论区') }}
              </p>
              <p v-else-if="item.name === 'user_center_image'" class="font-sty">
                {{ $t('个人中心背景图片') }}
              </p>
              <p v-else-if="item.name === 'group_buying_image'" class="font-sty">
                {{ $t('拼团背景图片') }}
              </p>
              <p v-else-if="item.name === 'backup_img1'" class="font-sty">
                {{ $t('备用图片1') }}
              </p>
              <p v-else-if="item.name === 'backup_img2'" class="font-sty">
                {{ $t('备用图片2') }}
              </p>
              <p v-else-if="item.name === 'backup_img3'" class="font-sty">
                {{ $t('备用图片3') }}
              </p>
              <p v-else-if="item.name === 'backup_img4'" class="font-sty">
                {{ $t('备用图片4') }}
              </p>
              <div class="user-bottom">
                <div class="bottom-right">
                  <span v-if="item.name === 'forecast_image'" class="suggest-btn">
                    {{ $t('建议尺寸：355px*160px') }}
                  </span>
                  <span v-else-if="item.name === 'agent_approve_image'" class="suggest-btn">
                    {{ $t('建议尺寸：612px*542px') }}
                  </span>
                  <span v-else-if="item.name === 'warehouse_image'" class="suggest-btn">
                    {{ $t('建议尺寸：612px*542px') }}
                  </span>
                  <span v-else-if="item.name === 'freight_image'" class="suggest-btn">
                    {{ $t('建议尺寸：355px*160px') }}
                  </span>
                  <span v-else-if="item.name === 'track_image'" class="suggest-btn">
                    {{ $t('建议尺寸：355px*160px') }}
                  </span>
                  <span v-else-if="item.name === 'support_image'" class="suggest-btn">
                    {{ $t('建议尺寸：355px*160px') }}
                  </span>
                  <span v-else-if="item.name === 'license_image'" class="suggest-btn">
                    {{ $t('建议尺寸：710px*120px') }}
                  </span>
                  <span v-else-if="item.name === 'index_image'" class="suggest-btn">
                    {{ $t('建议尺寸：355px*160px') }}
                  </span>
                  <span v-else-if="item.name === 'comment_image'" class="suggest-btn">
                    {{ $t('建议尺寸：355px*160px') }}
                  </span>
                  <span v-else-if="item.name === 'user_center_image'" class="suggest-btn">
                    {{ $t('建议尺寸：750px*480px') }}
                  </span>
                  <span v-else-if="item.name === 'group_buying_image'" class="suggest-btn">
                    {{ $t('建议尺寸：355px*160px') }}
                  </span>
                  <span v-else-if="item.name === 'backup_img1'" class="suggest-btn">
                    {{ $t('备用图片1') }}
                  </span>
                  <span v-else-if="item.name === 'backup_img2'" class="suggest-btn">
                    {{ $t('备用图片2') }}
                  </span>
                  <span v-else-if="item.name === 'backup_img3'" class="suggest-btn">
                    {{ $t('备用图片3') }}
                  </span>
                  <span v-else-if="item.name === 'backup_img4'" class="suggest-btn">
                    {{ $t('备用图片4') }}
                  </span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      setForm: {
        customerList: []
      },
      customerList: []
    }
  },
  created() {
    this.getImg()
  },
  methods: {
    // 获取图片配置
    getImg() {
      this.$request.getProgramImg().then(res => {
        if (res.data) {
          this.customerList = Object.entries(res.data)
          this.customerList = this.customerList.map(item => {
            return {
              name: item[0],
              url: item[1]
            }
          })
          console.log(this.customerList, 'this.customerList')
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
    // 预览小程序海报
    previewBackground(image) {
      console.log(image, 'image')
      this.choosePoster = image
    },
    // 上传海报配置背景图像
    uploadBgImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.customerList.push(item.path)
          })
        }
      })
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 删除小程序预报页图
    onDeleteCus(index) {
      this.customerList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.image-set-container {
  .tabLength {
    // width: 560px !important;
    width: 500px !important;
  }
  .setOthers {
    padding: 20px;
    .el-input {
      width: 30%;
    }
    .el-textarea__inner {
      width: 30%;
      background-color: #f5f5f5;
    }
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
    // width: 300px;
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
  .save-btn {
    color: #fff;
    background-color: #3540a5;
  }
  .suggest-btn {
    color: gray;
    font-size: 12px;
  }
  .new-top {
    margin-bottom: 10px;
    padding: 20px;
    background: #fff;
    min-height: 260px;
  }
  .user-bottom {
    overflow: hidden;
    .bottom-left {
      float: left;
    }
    .bottom-right {
      float: right;
    }
  }
  .font-sty {
    color: #606266;
    font-size: 14px;
  }
}
</style>

<template>
  <div class="block-edit-others-container">
    <el-form label-position="top">
      <el-form-item :label="$t('区块说明')">
        <el-row>
          <el-col :span="10">
            <span>{{ description }}</span>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 编辑图片 -->
      <el-form-item :label="$t('内容')" class="updateChe" v-if="type === 'image'">
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
      <!-- 编辑颜色1 -->
      <el-form-item :label="$t('主色调1')" class="updateChe" v-if="type === 'color'">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.color1"></el-input>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-color-picker v-model="params.color1"></el-color-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 编辑颜色2 -->
      <el-form-item :label="$t('主色调2')" class="updateChe" v-if="type === 'color'">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.color2"></el-input>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-color-picker v-model="params.color2"></el-color-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-show="type === 'location'">
        <el-row :gutter="20">
          <el-col :span="5">
            <div>{{ $t('经度') }}</div>
            <el-input v-model="params.lon"></el-input>
          </el-col>
          <el-col :span="5">
            <div>{{ $t('纬度') }}</div>
            <el-input v-model="params.lat"></el-input>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" plain class="clear-btn" @click="onClearMap">{{
              $t('清除')
            }}</el-button>
            <el-button type="primary" plain class="clear-btn" @click="savePoint">{{
              $t('保存')
            }}</el-button>
          </el-col>
        </el-row>
        <div id="map" class="map-box"></div>
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
import TMap from 'TMap'
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      description: '',
      params: {
        image: '',
        color1: null,
        color2: null,
        lon: '', // 经度
        lat: '' // 纬度
      },
      type: '',
      size: '',
      baleImgList: [],
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
  mounted() {
    if (this.type === 'location') {
      this.initMap()
    }
  },
  methods: {
    // 初始化地图信息
    initMap() {
      let point = new TMap.LatLng(39.902584, 116.394815)
      const map = new TMap.Map(document.getElementById('map'), {
        center: point,
        zoom: 11,
        draggableCursor: 'crosshair'
      })
      this.map = map
      TMap.event.addListener(this.map, 'click', this.onPoint)
    }, // 选取地图上的点
    onPoint(e) {
      this.params.lon = e.latLng.lng
      this.params.lat = e.latLng.lat
      if (!this.marker) {
        this.marker = new TMap.Marker({
          position: e.latLng,
          map: this.map
        })
      } else {
        this.marker.setPosition(e.latLng)
      }
    },
    // 清除地址选点
    onClearMap() {
      this.params.lat = ''
      this.params.lon = ''
      this.marker.setPosition(null)
    },
    savePoint() {
      const point = new TMap.LatLng(this.params.lat, this.params.lon)
      if (!this.marker) {
        this.marker = new TMap.Marker({
          position: point,
          map: this.map
        })
      } else {
        this.marker.setPosition(new TMap.LatLng(this.params.lat, this.params.lon))
      }
      this.$nextTick(() => {
        this.map.panTo(point)
      })
    },
    getList() {
      this.$request.getBlocksDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.description = res.data.description
          this.size = res.data.size
          res.data.content && (this.baleImgList[0] = res.data.content)
          this.params.color1 = res.data.content && res.data.content.color1
          this.params.color2 = res.data.content && res.data.content.color2
          if (res.data.content && res.data.content.lon) {
            this.params.lat = res.data.content && res.data.content.lat
            this.params.lon = res.data.content && res.data.content.lon
            this.savePoint()
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
        this.params.image = this.baleImgList[0]
      } else {
        this.params.image = ''
      }
      if (this.type === 'image') {
        this.$request
          .updateBlocks(this.$route.params.id, {
            content: this.params.image
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
      } else {
        this.$request
          .updateBlocksDetails(this.$route.params.id, {
            content: {
              image: this.params.image,
              color1: this.params.color1,
              color2: this.params.color2,
              lat: this.params.lat,
              lon: this.params.lon
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
}
</script>

<style lang="scss">
.block-edit-others-container {
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

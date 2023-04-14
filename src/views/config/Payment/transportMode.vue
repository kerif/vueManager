<template>
  <div class="transport-mode">
    <div class="mode-box">
      <div :class="['mode-item', !this.spu_enabled && isStart ? 'select-item' : '']">
        <div class="select" v-if="!this.spu_enabled && isStart">
          <span class="start-text">{{ $t('已启用') }}</span>
        </div>
        <div class="mode-title">{{ $t('传统模式') }}</div>
        <div class="mode-content">{{ $t('按包裹集包生成订单') }}</div>
        <div @click="openImg(0)">
          <img :src="imgPath" class="img-box" />
        </div>
        <div class="mode-remark"></div>
        <el-button class="start-btn" v-if="!isStart" @click="onStart(0)">{{
          $t('启用')
        }}</el-button>
      </div>
      <div :class="['mode-item', this.spu_enabled && isSpuSatrt ? 'select-item' : '']">
        <div class="select" v-if="this.spu_enabled && isSpuSatrt">
          <span class="start-text">{{ $t('已启用') }}</span>
        </div>
        <div class="mode-title">{{ $t('电商模式') }}</div>
        <div class="mode-content">{{ $t('按商品集包生成订单') }}</div>
        <div @click="openImg(1)">
          <img :src="imgPath1" class="img-box" />
        </div>
        <div class="mode-remark">{{ $t('注: 订单下的商品不支持单个退货') }}</div>
        <el-button class="start-btn" v-if="!isSpuSatrt" @click="onStart(1)">{{
          $t('启用')
        }}</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img-box">
        <img :src="imgSrc" class="img-dialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spu_enabled: 0,
      imgVisible: false,
      imgSrc: '',
      isStart: false,
      isSpuSatrt: false,
      imgPath: require('@/assets/mode1.png'),
      imgPath1: require('@/assets/mode2.jpg')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.getTransportMode().then(res => {
        if (res.ret) {
          this.spu_enabled = res.data.spu_enabled
          if (res.data.spu_enabled === 0) {
            this.isStart = true
          } else {
            this.isSpuSatrt = true
          }
        }
      })
    },
    onStart(type) {
      if (type == 0) {
        this.isStart = true
        this.isSpuSatrt = false
        this.spu_enabled = 0
      } else {
        this.isSpuSatrt = true
        this.isStart = false
        this.spu_enabled = 1
      }
      this.$request
        .updateTransportMode({
          spu_enabled: this.spu_enabled
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    openImg(type) {
      this.imgVisible = true
      if (type == 0) {
        this.imgSrc = this.imgPath
      } else {
        this.imgSrc = this.imgPath1
      }
    }
  }
}
</script>

<style lang="scss">
.mode-box {
  display: flex;
  .mode-item {
    position: relative;
    width: 300px;
    height: 450px;
    margin-right: 30px;
    background: #f5f5f5;
    border-radius: 10px;
    text-align: center;
    .mode-title {
      margin: 45px 0 15px 0;
      font-size: 20px;
      font-weight: 600;
    }
    .mode-content {
      margin-bottom: 15px;
    }
    .img-box {
      width: 240px;
      height: 200px;
      cursor: pointer;
      margin-bottom: 15px;
    }
    .mode-remark {
      font-size: 14px;
      margin-bottom: 15px;
    }
    .start-btn {
      border-radius: 20px;
      width: 100px;
      color: #fff;
      background-color: #3540a5;
    }
    .select {
      position: absolute;
      width: 100px;
      height: 40px;
      background-color: #3540a5;
      border-radius: 0 0 20px 0;
      .start-text {
        margin-top: 10px;
        display: inline-block;
        color: #fff;
        text-align: center;
      }
    }
  }
  .select-item {
    border: 2px solid #3540a5;
  }
}
.img-box {
  text-align: center;
  .img-dialog {
    width: 50%;
  }
}
</style>

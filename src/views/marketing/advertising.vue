<template>
  <div class="advertising-container">
    <el-row :gutter="16">
      <el-col :span="8" class="user-left">
        <div class="new-top">
          <div class="top-img">
            <img src="../../assets/carousel.png" />
            <p>
              <strong
                ><span>{{ $t('小程序/H5轮播图管理') }}</span></strong
              >
            </p>
          </div>
          <div class="user-bottom">
            <div class="bottom-left">
              <!-- <el-button class="btn-deep-blue" @click="goAdd(item.type)">{{$t('增加')}}</el-button> -->
              <el-button class="btn-deep-purple" @click="goBanner">{{ $t('管理') }}</el-button>
            </div>
            <!-- <div class="bottom-right">
              <el-switch
                class="switch-sty"
                @change="changeOnline(item.type, item.status)"
                v-model="item.status"
                :active-text="$t('开')"
                :active-value="1"
                :inactive-value="0"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </div> -->
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="user-left">
        <div class="new-top">
          <div class="top-img">
            <img src="../../assets/poster.png" />
            <p>
              <strong
                ><span>{{ $t('小程序/H5海报管理') }}</span></strong
              >
            </p>
          </div>
          <div class="user-bottom">
            <div class="bottom-left">
              <el-button class="btn-deep-purple" @click="goPoster">{{ $t('管理') }}</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="user-left">
        <div class="new-top">
          <div class="top-img">
            <img src="../../assets/advertising.png" />
            <p>
              <strong
                ><span>{{ $t('小程序/H5页面广告管理') }}</span></strong
              >
            </p>
          </div>
          <div class="user-bottom">
            <div class="bottom-left">
              <el-button class="btn-deep-purple" @click="goImage">{{ $t('管理') }}</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" v-if="this.enabled === 1">
      <el-col :span="8" class="user-left">
        <div class="new-top">
          <div class="top-img">
            <img src="../../assets/carousel.png" />
            <p>
              <strong
                ><span>{{ $t('弹窗广告管理') }}</span></strong
              >
            </p>
          </div>
          <div class="user-bottom">
            <div class="bottom-left">
              <el-button class="btn-deep-purple" @click="goAdvertise">{{ $t('管理') }}</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      validate_email: '',
      enabled: 0
    }
  },
  created() {
    this.getList()
    this.getConfig()
  },
  methods: {
    getList() {},
    changeOnline(type, val) {
      const status = val === 0 ? 0 : 1
      this.$request.closeCoupons(type, status).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          // this.getWechat()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 轮播图管理
    goBanner() {
      this.$router.push({ name: 'bannerList' })
    },
    // 海报管理
    goPoster() {
      this.$router.push({ name: 'poster' })
    },
    // 新增
    goAdd(type) {
      if (type === 4) {
        this.$router.push({ name: 'rebate', params: { type: type } })
      } else {
        this.$router.push({ name: 'addNew', params: { type: type } })
      }
    },
    // 页面广告管理
    goImage() {
      this.$router.push({ name: 'imageSet' })
    },
    getConfig() {
      this.$request.getFunConfig().then(res => {
        this.enabled = res.data[1].enabled
      })
    },
    goAdvertise() {
      this.$router.push({ name: 'advertiseList' })
    }
  }
}
</script>
<style lang="scss">
.advertising-container {
  background-color: #f5f5f5 !important;
  .new-top {
    margin-bottom: 10px;
    padding: 20px;
    background: #fff;
    .top-img {
      margin-top: 50px;
      margin-bottom: 40px;
      text-align: center;
      img {
        width: 40px;
        height: 40px;
      }
    }
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
  .user-left {
    //margin-left: 30px;
  }
}
</style>

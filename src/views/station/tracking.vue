<template>
  <div class="tracking-container">
    <div class="search-main">
      <div class="main-top">
        <div class="number-sty">{{ $t('单号查询') }}:</div>
        <div class="search-sty">
          <el-select v-model="expressType" :placeholder="$t('请选择')">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <el-input v-model="expressNumber" @keyup.enter.native="goExpress" class="input-sty">
        </el-input>
        <el-button @click.native="goExpress">{{ $t('查询') }}</el-button>
        <el-button @click.native="trackingMana">{{ $t('管理自定义物流轨迹') }}</el-button>
      </div>
      <div class="express-content" v-loading="$store.state.btnLoading">
        <div v-if="TrackingData.length" class="line-sty">
          <div class="content-top">
            <div class="time">{{ $t('时间') }}</div>
            <div style="padding-left: 2em">{{ $t('跟踪进度') }}</div>
          </div>
          <ul class="result-list">
            <li
              :class="{ 'last-finish': index === 0 }"
              v-for="(item, index) in TrackingData"
              :key="index"
            >
              <div class="time">{{ item.ftime }}</div>
              <div class="dot">
                <span class="out-dot dot-box"> </span>
                <span class="in-dot dot-box"></span>
              </div>
              <div class="text">{{ item.context }}</div>
            </li>
          </ul>
        </div>
        <div class="empty-box" v-else>
          <img src="../../assets/empty.png" />
          <div>{{ $t('暂无物流消息') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tracking',
  data() {
    return {
      options: [
        {
          id: 1,
          name: this.$t('订单号')
        },
        {
          id: 2,
          name: this.$t('物流单号')
        }
      ],
      expressType: 1,
      expressNumber: '',
      TrackingData: [],
      isEmpty: false
    }
  },
  created() {
    console.log(this.$route.query, 'this.$route.query.orderSn')
    if (this.$route.query.orderSn) {
      this.expressNumber = this.$route.query.orderSn
      this.goExpress()
    }
  },
  methods: {
    goExpress() {
      if (!this.expressNumber) {
        return this.$message.error(this.$t('请输入单号'))
      }
      console.log(this.expressNumber, 'expressNumber')
      if (this.expressType === 1) {
        this.$request
          .goTracking({
            order_sn: this.expressNumber
          })
          .then(res => {
            if (res.ret) {
              this.TrackingData = res.data.data
              if (!this.TrackingData.length) {
                this.isEmpty = true
              } else {
                this.isEmpty = false
              }
            } else {
              this.TrackingData = []
              this.isEmpty = true
            }
          })
      } else if (this.expressType === 2) {
        this.$request
          .goTracking({
            track_no: this.expressNumber
          })
          .then(res => {
            if (res.ret) {
              this.TrackingData = res.data.data
              console.log(res.data.data, 'TrackingData')
              if (!this.TrackingData.length) {
                this.isEmpty = true
              } else {
                this.isEmpty = false
              }
            } else {
              // this.$notify({
              //   title: this.$t('操作失败'),
              //   message: res.msg,
              //   type: 'warning'
              // })
              this.TrackingData = []
              this.isEmpty = true
            }
          })
      }
    },
    // 管理自定义物流轨迹
    trackingMana() {
      this.$router.push({ name: 'logistics' })
    }
  }
}
</script>

<style lang="scss" scope>
.tracking-container {
  .search-main {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    // line-height: 35px;
  }
  .number-sty {
    display: inline-block;
    margin-right: 10px;
  }
  .search-sty {
    margin-bottom: 20px;
    display: inline-block;
    margin-right: 10px;
  }
  .input-sty {
    width: 30%;
    margin-right: 10px;
  }
  .dot-box {
    display: inline-block;
    border-radius: 50%;
  }
  .out-dot {
    width: 16px;
    height: 16px;
    background-color: #bcbcbc;
    opacity: 0.4;
    margin-top: 2px;
  }
  .in-dot {
    width: 10px;
    height: 10px;
    background-color: #bcbcbc;
    position: absolute;
    left: 3px;
    top: 5px;
  }
  .content-top {
    display: flex;
  }
  .express-content {
    font-size: 14px;
    text-align: center;
  }
  .time {
    width: 155px;
  }
  .result-list {
    padding: 0;
    li {
      display: flex;
      padding-bottom: 30px;
      &:not(:last-child) {
        .text::before {
          content: '';
          position: absolute;
          left: -8px;
          border-left: 1px solid #a8b7bf;
          height: calc(100% + 10px);
          top: 20px;
        }
      }
    }
    .last-finish {
      .out-dot {
        background-color: #35a581;
      }
      .in-dot {
        background-color: #35a581;
      }
    }
  }
  .text {
    padding-left: 10px;
    position: relative;
    flex: 1;
  }
  .dot {
    position: relative;
    width: 16px;
    height: 16px;
  }
  .main-top {
    text-align: center;
  }
  .empty-box {
    text-align: center;
    img {
      width: 150px;
    }
  }
  .line-sty {
    text-align: center;
    width: 600px;
    margin: auto;
  }
}
</style>

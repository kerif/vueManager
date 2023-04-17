<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('物流轨迹')"
    class="dialog-claim"
    @close="clear"
  >
    <div class='detail-box'>
      <div class="express-content" v-loading="$store.state.btnLoading">
        <div class="search-flex">
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
<!--          <div class="search-btn">-->
<!--             <el-button @click="onUpdate">{{ $t('更新物流') }}</el-button>-->
<!--          </div>-->
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="cancelDialog">{{ $t('取消') }}</el-button>
<!--      <el-button type="primary" @click="cancelDialog">{{ $t('确定') }}</el-button>-->
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      remark: null,
      user: {
        user_id: ''
      },
      staff: '',
      status: '',
      supplierId: '',
      id: [],
      expressType:'',
      rules: {
        user_id: [{ required: true, message: this.$t('请输入认领用户'), trigger: 'change' }]
      },
      TrackingData: [],
    }
  },
  mounted() {
    console.log('this.code', this.id)
  },
  watch:{
    id(newVlue){
      this.goExpress()
    }
  },
  methods: {
    goExpress() {
      console.log('expressType', this.expressType)
      if (this.expressType == 1) {
        this.$request
          .goTracking({
            order_sn: this.id
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
      } else if (this.expressType == 2) {
        this.$request
          .goTracking({
            track_no: this.id
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
    queryCNSearch(queryString, callback) {
      console.log(this.user.user_id)
      var list = [{}]
      this.$request
        .getClaimList({
          keyword: this.user.user_id.toString()
        })
        .then(res => {
          for (let i of res.data) {
            // i.value = i.id
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback(list)
        })
    },
    handleSelect(item) {
      this.supplierId = item.id
      this.supplierName = item.name
    },
    confirm() {
      this.$request
        .setOrderRemark(this.id, {
          remark: this.remark
        })
        .then(res => {
          this.$message.success(res.msg)
          this.remark = null
          this.show = false
          this.success()
        })
    },
    clear() {
      this.user.user_id = ''
      this.status = ''
      this.remark = null
    },
    cancelDialog() {
      this.remark = null
      this.show = false
    },
    init() {}
  }
}
</script>
<style lang="scss">
.dialog-claim {
  // .changeQuery {
  //   .el-autocomplete {
  //     width: 100%;
  //   }
  // }
  .detail-box{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 200px !important;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
  .express-content {
    font-size: 14px;
    text-align: center;
  }
  .time {
    width: 155px;
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
    width: 500px;
    img {
      width: 150px;
    }
  }
  .line-sty {
    width: 500px;
  }
  .search-flex {
    display: flex;
    justify-content: center;
  }
  .search-btn {
    width: 200px;
  }
}
</style>

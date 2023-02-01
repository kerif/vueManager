<template>
  <div class="new-user-container">
    <el-row :gutter="20">
      <el-col :span="7" class="user-left" v-for="(item, index) in ruleForm" :key="index">
        <div class="new-top">
          <!-- 新用户送券 -->
          <div v-if="item.type === 1">
            <div class="top-img">
              <img src="../../../assets/top-1.png" />
              <p>
                <strong
                  ><span>{{ $t('新用户送券') }}</span></strong
                >
              </p>
            </div>
            <p class="font-sty">{{ $t('用户注册即送券') }}</p>
          </div>
          <!-- 邀请新人送券 -->
          <div v-if="item.type === 2">
            <div class="top-img">
              <img src="../../../assets/top-2.png" />
              <p>
                <strong
                  ><span>{{ $t('邀请新人送券') }}</span></strong
                >
              </p>
            </div>
            <p class="font-sty">{{ $t('邀请新人达成要求后邀请人可获券') }}</p>
          </div>
          <!-- 被邀请人送券 -->
          <div v-if="item.type === 3">
            <div class="top-img">
              <img src="../../../assets/top-3.png" />
              <p>
                <strong
                  ><span>{{ $t('被邀请人送券') }}</span></strong
                >
              </p>
            </div>
            <p class="font-sty">
              {{ $t('新人通过老客户链接注册登录即可获券与新用户送券同时享受') }}
            </p>
          </div>
          <!-- 下单返券 -->
          <div v-if="item.type === 4">
            <div class="top-img">
              <img src="../../../assets/top-4.png" />
              <p>
                <strong
                  ><span>{{ $t('下单返券') }}</span></strong
                >
              </p>
            </div>
            <p class="font-sty">{{ $t('客户订单支付成功后即可返券') }}</p>
          </div>
          <!-- <div v-if="item.type === 5">
            <div class="top-img">
              <img src="../../../assets/top-4.png" />
              <p>
                <strong
                  ><span>{{ $t('关注公众号领券') }}</span></strong
                >
              </p>
            </div>
            <p class="font-sty">{{ $t('用户关注公众号即可领取') }}</p>
          </div>
          <div v-if="item.type === 6">
            <div class="top-img">
              <img src="../../../assets/top-4.png" />
              <p>
                <strong
                  ><span>{{ $t('生日营销') }}</span></strong
                >
              </p>
            </div>
            <p class="font-sty">{{ $t('根据用户生日日期发放生日券') }}</p>
          </div>
          <div v-if="item.type === 7">
            <div class="top-img">
              <img src="../../../assets/top-4.png" />
              <p>
                <strong
                  ><span>{{ $t('普通优惠券') }}</span></strong
                >
              </p>
            </div>
            <p class="font-sty">{{ $t('生成普通优惠券,生成后需要投放才能在用户的券包中') }}</p>
          </div>
          <div v-if="item.type === 8">
            <div class="top-img">
              <img src="../../../assets/top-4.png" />
              <p>
                <strong
                  ><span>{{ $t('用户抢券') }}</span></strong
                >
              </p>
            </div>
            <p class="font-sty">{{ $t('生成二维码抢券页面,由用户点击领取') }}</p>
          </div> -->
          <div class="user-bottom">
            <div class="bottom-left">
              <el-button class="btn-deep-blue" @click="goAdd(item.type)">{{
                $t('增加')
              }}</el-button>
              <el-button class="btn-deep-purple" @click="goMana(item.type)">{{
                $t('管理')
              }}</el-button>
            </div>
            <div class="bottom-right">
              <el-switch
                class="switch-sty"
                @change="changeOnline(item.type, item.status)"
                v-model="item.status"
                :active-text="$t('开')"
                :active-value="1"
                :inactive-value="0"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray"
              >
              </el-switch>
            </div>
            <div v-if="item.type === 3" class="coupon-sty">
              <el-checkbox @change="changeUnique(item.type)" v-model="isUnique">{{
                $t('关闭两券共享')
              }}</el-checkbox>
              <el-tooltip
                class="item code-sty"
                effect="dark"
                :content="$t('与新用户送券同时开启时仅享受被邀请人券不勾选则两券共享')"
                placement="top"
              >
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
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
      ruleForm: [],
      isUnique: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.getCoupons().then(res => {
        this.ruleForm = res.data
        res.data.forEach(item => {
          if (item.type === 3) {
            console.log(11)
            this.isUnique = Boolean(item.is_unique)
            // return Boolean(item.is_unique)
          }
        })
        console.log(this.isUnique, 'isUnique')
      })
    },
    changeOnline(type, val) {
      const status = val === 0 ? 0 : 1
      this.$request.closeCoupons(type, status).then(res => {
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
    // 开启或关闭 两券共享
    changeUnique(type) {
      const status = Number(this.isUnique) === 0 ? 0 : 1
      this.$request.closeUnique(type, status).then(res => {
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
    // 新增
    goAdd(type) {
      if (type === 4) {
        this.$router.push({ name: 'rebate', params: { type: type } })
      } else {
        this.$router.push({ name: 'addNew', params: { type: type } })
      }
      // else if (type === 5 || type === 6 || type === 7 || type === 8) {
      //   this.$router.push({ name: 'ordinary', params: { type: type } })
      // }
    },
    // 管理
    goMana(type) {
      if (type === 1) {
        // 新用户送券
        this.$router.push({ name: 'new', params: { type: type } })
      } else if (type === 2) {
        // 邀请新人送券
        this.$router.push({ name: 'invite', params: { type: type } })
      } else if (type === 3) {
        // 被邀请人送券
        this.$router.push({ name: 'invitees', params: { type: type } })
      } else if (type === 4) {
        // 下单返券
        this.$router.push({ name: 'rebates', params: { type: type } })
      }
      // else if (type === 5 || type === 6) {
      //   this.$router.push({ name: 'new', params: { type: type } })
      // } else if (type === 7 || type === 8) {
      //   this.$router.push({ name: 'voucher', params: { type: type } })
      // }
      // this.$router.push({ name: 'managementNew', params: { type: type } })
    }
  }
}
</script>
<style lang="scss">
.new-user-container {
  background-color: #f5f5f5 !important;
  padding: 20px;
  .new-top {
    margin-bottom: 10px;
    padding: 20px;
    background: #fff;
    height: 260px;
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
    .switch-sty {
    }
  }
  .user-left {
    margin-left: 30px;
  }
  .font-sty {
    font-size: 12px;
  }
  .coupon-sty {
    clear: both;
    .el-checkbox {
      margin-left: 0 !important;
    }
  }
  .code-sty {
    padding-left: 5px;
    color: green;
  }
}
</style>

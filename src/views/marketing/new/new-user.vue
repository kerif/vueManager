<template>
  <div class="new-user-container">
    <el-row :gutter="20">
      <el-col :span="7" class="user-left" v-for="(item, index) in ruleForm" :key="index">
        <div class="new-top">
          <div class="top-img" v-if="item.type === 1">
            <img src="../../../assets/top-1.png">
            <p>
                <strong><span>{{$t('新用户送券')}}</span></strong>
              </p>
          </div>
          <div class="top-img" v-if="item.type === 2">
            <img src="../../../assets/top-2.png">
            <p>
                <strong><span>{{$t('邀请新人送券')}}</span></strong>
              </p>
          </div>
          <div class="top-img" v-if="item.type === 3">
            <img src="../../../assets/top-3.png">
            <p>
                <strong><span>{{$t('被邀请人送券')}}</span></strong>
              </p>
          </div>
          <div class="user-bottom">
            <div class="bottom-left">
              <el-button class="btn-deep-blue" @click="goAdd(item.type)">{{$t('增加')}}</el-button>
              <el-button class="btn-deep-purple" @click="goMana(item.type)">{{$t('管理')}}</el-button>
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
                inactive-color="gray">
              </el-switch>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      validate_email: '',
      ruleForm: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$request.getCoupons().then(res => {
        this.ruleForm = res.data
      })
    },
    changeOnline (type, val) {
      console.log(type, 'type')
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
    // 新增
    goAdd (type) {
      this.$router.push({ name: 'addNew', params: { type: type } })
    },
    // 管理
    goMana (type) {
      this.$router.push({ name: 'managementNew', params: { type: type } })
    }
  }
}
</script>
<style lang="scss">
.new-user-container {
  background-color: #F5F5F5 !important;
  padding: 20px;
  .new-top {
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
      // display: inline-block;
      float: left;
    }
    .bottom-right {
      // display: inline-block;
      float: right;
    }
    .switch-sty {
    }
  }
  .user-left {
    margin-left: 30px;
  }
}
</style>

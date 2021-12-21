<template>
  <div class="viplist-details">
    <div>
      <el-row :gutter="20">
        <el-col :span="20">
          <h3>{{ $t('基本信息') }}</h3>
        </el-col>
        <el-col :span="4">
          <el-button class="btn-light-red">{{ $t('合并') }}</el-button>
          <el-button class="btn-deep-blue" @click="editInfo">{{ $t('修改') }}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="demo-basic--circle">
            <div class="block">
              <el-avatar :size="80" :src="circleUrl"></el-avatar>
              <div class="title">{{ $t('头像') }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户ID:') }}</span>
              <span>{{ this.$route.params.id }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('VIP等级:') }}</span>
              <span>{{ this.info.memberLevelName }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('余额:') }}</span>
              <span>{{ this.info.balance }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('所属客服:') }}</span>
              <span>{{ this.info.customerName }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('注册日期:') }}</span>
              <span>{{ this.info.createdAt }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户昵称:') }}</span>
              <span>{{ this.info.name }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('EMAIL:') }}</span>
              <span>{{ this.info.email }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('积分:') }}</span>
              <span>{{ this.info.point }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('所属销售:') }}</span>
              <span>{{ this.info.saleName }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('最后登录时间:') }}</span>
              <span>{{ this.info.lastLogin }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户组:') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('手机号:') }}</span>
              <span>{{ this.info.phone }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('订单数:') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('微信号:') }}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 30px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('包裹列表')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('订单列表')" name="2"></el-tab-pane>
        <el-tab-pane :label="$t('地址')" name="3"></el-tab-pane>
        <el-tab-pane :label="$t('券包')" name="4"></el-tab-pane>
        <el-tab-pane :label="$t('邀请记录')" name="5"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vipListDetails',
  data() {
    return {
      activeName: '1',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      info: {}
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.info = JSON.parse(this.$route.query.info)
      console.log(this.info)
    },
    handleClick() {},
    editInfo() {}
  }
}
</script>

<style lang="scss">
.viplist-details {
  font-size: 14px;
  background-color: #fff !important;
  .leftWidth {
    width: 120px;
    padding: 10px 0;
    display: inline-block;
  }
  .title {
    width: 80px;
    margin-top: 10px;
    text-align: center;
  }
}
</style>

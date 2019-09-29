<template>
  <el-header class="layout-header">
   <div @click="switchLeft" class="TransferLeft">
     <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
       style="font-size:24px;"></i>
    </div>
    <span class="user-box">momo.zxy</span>
    <span class="el-icon-switch-button logout-icon" @click="onLogout"></span>
  </el-header>
</template>
<script>
export default {
  methods: {
    onLogout () {
      this.$confirm('是否确认退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.logout().then(res => {
          if (res.ret) {
            this.$store.commit('removeToken')
            this.$router.replace({ name: 'login' })
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '退出失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    switchLeft () {
      this.$store.commit('switchCollapse', !this.$store.state.isCollapse)
    }
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    }
  }
}
</script>
<style lang="scss">
.layout-header {
  @keyframes move {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  height: 60px;
  line-height: 60px;
  text-align: right;
  .user-box {
    margin-right: 30px;
  }
  .logout-icon {
    font-size: 20px;
    position: relative;
    top: 4px;
    cursor: pointer;
    &:hover {
      color: #3540A5;
      animation: move .3s ease-in 2;
    }
  }
  .TransferLeft {
    float: left;
    height: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>

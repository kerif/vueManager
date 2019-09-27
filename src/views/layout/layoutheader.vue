<template>
  <el-header class="layout-header">
    <span class="user-box">momo.zxy</span>
    <span class="el-icon-switch-button logout-icon" @click="onLogout"></span>
  </el-header>
</template>
<script>
export default {
  methods: {
    onLogout () {
      this.$request.logout().then(res => {
        if (res.ret) {
          this.$store.commit('removeToken')
          this.$router.replace({ name: 'login' })
        }
      })
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
}
</style>

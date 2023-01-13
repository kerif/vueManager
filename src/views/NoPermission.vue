<template>
  <div class="no-permission">
    <div>
      <div class="bullshit__oops">No Permission</div>
      <div class="bullshit__headline">{{ $t('抱歉，您暂无权限查看当前页面') }}.</div>
      <div class="bullshit__info">{{ $t('请联系管理员') }}<br /></div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    isPermissionFilterArr() {
      return this.$store.state.isPermissionFilterArr
    }
  },
  methods: {
    back() {
      // 101 为首页跳转页面的权限id
      if (!this.isPermissionFilterArr.includes(101)) {
        this.$router.push({ name: 'reset-password' })
      } else {
        this.$router.push({ path: '/' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.no-permission {
  position: relative;
  width: 100%;
  background: #f0f2f5;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .bullshit {
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #97c1ff;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #97c1ff;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: #636f7a;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #97c1ff;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
  .link-type {
    color: #97c1ff;
  }
}
</style>

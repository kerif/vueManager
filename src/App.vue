<template>
  <div id="app">
    <!-- <router-view/> -->
   <keep-alive include="shipContainer">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<style lang="scss">
@import './styles/main.scss';
@import './styles/nprogress.scss';
@import './assets/iconfont/iconfont.css';
</style>

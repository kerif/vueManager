<template>
  <el-footer :class="['layout-footer', isCollapse && 'layout-footers']">
    <div class="footer-style">© (2019) NLETECH <a href="http://www.beian.miit.gov.cn" target="_blank">{{$t('湘ICP备17000173号-5')}}</a></div>
  </el-footer>
</template>
<script>
export default {
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    }
  }
}
</script>
<style lang="scss">
.layout-footer {
  height: 50px !important;
  line-height: 50px;
  border-top: 1px solid #ecedf0;
  color: #3540a5;
  padding-left: 30px;
  position: fixed;
  bottom: 0;
  width: calc(100vw - 230px);
  background: #fff;
  text-align: center;
  right: 0;
  transition: all 0.3s ease-in;
}
.layout-footers {
  width: 100%;
}
.footer-style {
  a {
    text-decoration: none;
  }
}
</style>

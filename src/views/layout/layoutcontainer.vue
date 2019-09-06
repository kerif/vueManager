<template>
  <el-container class="layout-contaniner">
    <layout-aside></layout-aside>
    <el-container direction="vertical">
      <layout-header></layout-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <layout-footer></layout-footer>
    </el-container>
  </el-container>
</template>
<script>
import LayoutAside from './layoutaside'
import LayoutHeader from './layoutheader'
import LayoutFooter from './layoutfooter'
export default {
  components: {
    LayoutAside,
    LayoutHeader,
    LayoutFooter
  }
}
</script>
<style lang="scss">
</style>

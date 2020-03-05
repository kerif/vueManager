<template>
  <el-dialog :visible.sync="show" class="dialog-preview-bg" title="预览">
    <!-- <div>
      <img :src="$baseUrl.IMAGE_URL + image" alt="" class="preview-img">
    </div> -->
      <div class="left-top" v-if="this.backgroundList.display_user_avatar === 1">
        <img src="../../../assets/user.png">
      </div>
      <h3 v-if="this.backgroundList.display_user_name === 1">张三</h3>
      <p v-if="this.backgroundList.display_share_info === 1">{{backgroundList.share_info}}</p>
      <div class="left-bottom">
        <img src="../../../assets/code.png" :style="{width: backgroundList.avatar_size + 'px', height: backgroundList.avatar_size + 'px'}">
      </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      image: ''
    }
  },
  methods: {
    init () {
    }
  }
}
</script>
<style lang="scss">
.dialog-preview-bg {
  // .preview-img {
  //   width: 100%;
  // }
  .poster-left {
    height: 880px;
    text-align: center;
    background-color: #fff;
    padding: 20px;
    position: relative;
    .left-top {
      img {
        width: 80px;
        height: 80px;
        padding: 5px;
        border-radius: 50%;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>

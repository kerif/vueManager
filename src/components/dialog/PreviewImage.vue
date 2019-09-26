<template>
  <el-dialog :visible.sync="show" class="dialog-preview">
    <div>
      <img :src="$baseUrl.IMAGE_URL + image" alt="" class="preview-img">
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      image: ''
    }
  }
}
</script>
<style lang="scss">
.dialog-preview {
  .preview-img {
    width: 100%;
  }
}
</style>

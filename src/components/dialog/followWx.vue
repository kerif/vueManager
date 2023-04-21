<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('关注公众号')"
    class="props-dialog"
    width="35%"
  >
    <div class='img-box'>
      <img
        style="width: 250px; height: 250px"
        src="../../assets/wechat.jpg"
        />
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    init() {}
  }
}
</script>
<style lang="scss" scoped>
.props-dialog {
  .el-input {
    width: 40%;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
  .color-box {
    display: flex;
    align-items: center;
  }
  .img-box{
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>

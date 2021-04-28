<template>
  <el-dialog :visible.sync="show" :title="$t('关于我们')" class="check-we-dialog" @close="clear">
    <div class="us-sty">
      <h3>【{{ $t('仓库桌面端exe文件下载') }}】</h3>
      <span>{{ $t('下载地址') }}：</span><br />
      <span>http://des-update.nle-tech.com/jiyun/update.html</span><br />
      <h3>【{{ $t('仓库管理App下载') }}】</h3>
      <br />
      <span>{{ $t('App Store 或 应用市场 搜索“包裹集运助手”') }}</span>
      <span>IOS版本：https://apps.apple.com/cn/app/id1492557133</span><br />
      <span>Android版本：https://appgallery.huawei.com/#/app/C101931567</span><br />
      <div class="img-container img-right">
        <img class="img-sty" src="../../assets/ios.png" /><br />
        <span>IOS</span>
      </div>
      <div class="img-container">
        <img class="img-sty" src="../../assets/android.png" /><br />
        <span>Android</span>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        status: ''
      },
      baleImgList: []
    }
  },
  methods: {
    clear() {},
    init() {}
  }
}
</script>
<style lang="scss">
.check-we-dialog {
  .us-sty {
    padding-left: 20px;
  }
  .status-box {
    text-align: center;
    margin: 20 0;
  }
  .el-input {
    width: 100% !important;
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
  .input-style {
    .el-input__inner {
      width: 70%;
    }
    .el-textarea__inner {
      width: 70%;
    }
  }
  .el-form-item__label {
    margin-right: 40px;
  }
  .img-container {
    display: inline-block;
    text-align: center;
  }
  .img-right {
    margin-right: 20px;
    margin-top: 20px;
  }
  .img-sty {
    width: 100px;
  }
}
</style>

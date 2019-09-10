<template>
  <el-dialog :visible.sync="show" title="修改客户组" class="dialog-container">
    <div>客户组中文名*</div>
    <el-select>
      <el-option label="李四" value="李四"></el-option>
    </el-select>
    <div slot="footer">
      <el-button>取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.dialog-container {
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }
  .el-dialog__close {
    color: #FFF;
  }
}
</style>

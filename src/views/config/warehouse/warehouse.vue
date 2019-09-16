<template>
  <div class="warehouse-container">
  <el-form label-position="top" class="warehouse-form">
    <el-form-item label="收件人姓名" required>
      <el-row>
        <el-col :span="10"><el-input placeholder="请输入内容"></el-input></el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="联系电话">
      <el-row>
        <el-col :span="10"><el-input placeholder="请输入内容"></el-input></el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="邮编">
      <el-row>
        <el-col :span="10"><el-input placeholder="请输入内容"></el-input></el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="地址">
      <el-row>
        <el-col :span="10"><el-input placeholder="请输入内容" type="textarea" :row="2"></el-input></el-col>
      </el-row>
    </el-form-item>
    <el-form-item><el-button type="primary" class="save-btn">保存</el-button></el-form-item>
  </el-form>
  </div>
</template>
<style lang="scss">
.warehouse-container {
  .warehouse-form {
    padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
}
</style>

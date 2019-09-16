<template>
  <el-dialog :visible.sync="show" title="修改状态" class="change-status-dialog dialog-container" width="35%">
    <div class="status-box">
      <el-select v-model="status">
        <el-option label="已处理" :value="1"></el-option>
      </el-select>
    </div>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm(ruleForm)">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      status: ''
    }
  }
}
</script>
<style lang="scss">
.change-status-dialog {
  .status-box {
    text-align: center;
    margin: 20 0;
  }
}
</style>

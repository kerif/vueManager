<template>
  <div class="panel-container">
   <el-row :gutter="20">
     <el-col :span="6" class="addCustomer">
       <span>当月新增客户</span>
       <h3>12222</h3>
       <span>总用户</span>
       <span>12455</span>
     </el-col>
     <el-col :span="6" :offset="1" class="addCustomer">
        <span>当月新增客户</span>
       <h3>12222</h3>
       <span>总用户</span>
       <span>12455</span>
     </el-col>
     <el-col :span="6" :offset="1" class="addCustomer">
        <span>当月新增客户</span>
        <h3>12222</h3>
        <span>总用户</span>
        <span>12455</span>
     </el-col>
   </el-row>
  </div>
</template>

<script>
export default {
}
</script>
<style lang="scss">
.panel-container {
  .addCustomer {
    border: 1px solid #ccc;
    padding: 10px;
  }
}
</style>

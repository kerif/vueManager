<template>
  <div class="bill-details-container">
    <div>
    <div class="receiverMSg">
    <h4>收货人信息</h4>
    <el-row class="container-center" :gutter="20">
      <!-- 姓名 -->
      <el-col :span="6">
        <span class="leftWidth">姓名</span>
        <span>vanora</span>
      </el-col>
      <!-- 手机/联系电话 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">手机/联系电话</span>
         <span>12345678</span>
      </el-col>
      <!-- 发货地址 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">发货地址</span>
         <span>湖南省长沙市岳麓区麓谷企业广场</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
     <!-- 邮箱 -->
      <el-col :span="6">
        <span class="leftWidth">邮箱</span>
        <span>1270754175@qq.com</span>
      </el-col>
      <!-- 备用邮箱1 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">备用邮箱1</span>
         <span>12345678@qq.com</span>
      </el-col>
      <!-- 备用邮箱2 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">备用邮箱2</span>
         <span>1212121212@qq.com</span>
      </el-col>
    </el-row>
    </div>
    <div class="receiverMSg">
    <h4>运单详情</h4>
    <el-row class="container-center"  :gutter="20">
      <!-- 转运单号 -->
      <el-col :span="6">
        <span class="leftWidth">转运单号</span>
        <span>1212121</span>
      </el-col>
      <!-- 线路名称 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">线路名称</span>
         <span>荷兰荷兰憨憨</span>
      </el-col>
      <!-- 提交时间 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">提交时间</span>
         <span>2019-11-11</span>
      </el-col>
    </el-row>
    <el-row class="container-center"  :gutter="20">
     <!-- 增值服务 -->
      <el-col :span="6">
        <span class="leftWidth">增值服务</span>
        <span>外箱加固/保险费¥20</span>
      </el-col>
    </el-row>
    </div>
    </div>
   <el-table class="data-list" border stripe :data="oderData">
      <!-- 预计重量kg -->
      <el-table-column label="预计重量kg" prop="id"></el-table-column>
      <!-- 称重重量kg -->
      <el-table-column label="称重重量kg" prop="name"></el-table-column>
      <!-- 尺寸（长宽高cm） -->
      <el-table-column label="尺寸（长宽高cm）" prop="group"></el-table-column>
      <!-- 预计费用¥ -->
      <el-table-column label="预计费用¥"></el-table-column>
      <!-- 实际费用¥ -->
      <el-table-column label="实际费用¥" prop="last_login"></el-table-column>
      <!-- 包裹价值 -->
      <el-table-column label="包裹价值"></el-table-column>
      <!-- 包含的包裹 -->
      <el-table-column label="包含的包裹"></el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      oderData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.bill-details-container {
  .container-center {
    margin-bottom: 20px;
  }
  .receiverMSg {
    border-bottom: 1px #ccc solid;
  }
  .leftWidth {
    display: inline-block;
    width: 120px;
  }
}
</style>

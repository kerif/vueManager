<template>
  <div class="panel-container">
   <el-row :gutter="20">
     <el-col :span="16">
       <el-row>
         <el-col :span="8">
           <div class="addCustomer">
              <span>当月新增客户</span>
              <h3>12222</h3>
              <span>总用户</span>
              <span class="count">12455</span>
              </div>
         </el-col>
         <el-col :span="7" :offset="1">
           <div class="addCustomer">
              <span>当月新增订单</span>
              <h3>12222</h3>
              <span>总运单</span>
              <span class="count">12455</span>
              </div>
         </el-col>
         <el-col :span="7" :offset="1">
           <div class="addCustomer">
              <span>当月新增发货单</span>
              <h3>12222</h3>
              <span>总发货单</span>
              <span class="count">12455</span>
              </div>
         </el-col>
       </el-row>
       <el-row :gutter="20">
         <el-col class="main">
           <el-row>
             <el-col :span="7">
              <div class="main-box">
                <div class="left-box">
                    <img src="../../assets/storage.png">
                </div>
                <div>
                  包裹入库
                </div>
              </div>
              </el-col>
              <!-- 拣货打包 -->
              <el-col :span="7" :offset="1">
              <div class="main-box">
                <div class="left-box">
                    <img src="../../assets/bale.png">
                </div>
                <div>
                  拣货打包
                </div>
              </div>
              </el-col>
              <!-- 运单发货 -->
              <el-col :span="7" :offset="1">
              <div class="main-box">
                <div class="left-box">
                    <img src="../../assets/ship.png">
                </div>
                <div>
                  运单发货
                </div>
              </div>
              </el-col>
           </el-row>
         </el-col>
       </el-row>
     </el-col>
     <el-col :span="6" class="panel-right">
       <div class="waitMsg">待处理消息</div>
       <ul>
         <li>
           未入库包裹
           <div class="msg-right">11</div>
           </li>
         <li>
           待拣货包裹
           <div class="msg-right">6</div>
           </li>
         <li>
           未支付包裹
           <div class="msg-right">6</div>
           </li>
       </ul>
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
    background: #E5E7FB;
  }
  .panel-right {
    border: 1px solid #ccc;
    padding: 0 !important;
  }
  .count {
    padding-left: 20px;
  }
  .waitMsg {
    background-color: #3540A5;
    color: #ccc;
    line-height: 35px;
    font-size: 14px;
    padding-left: 20px;
  }
  h3 {
    border-bottom: 1px solid #ccc;
  }
  ul {
    padding: 0 35px;
    overflow: hidden;
    li {
      line-height: 35px;
      border-bottom: 1px solid #ccc;
    }
  }
  .left-box {
    width: 50px;
    height: 100%;
    float: left;
  }
  .main-box {
    overflow: hidden;
  }
  .msg-right {
    float: right;
    color: red;
  }
  .main {
    border: 1px solid #ccc;
    margin-top: 15px;
  }
}
</style>

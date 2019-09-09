<template>
  <div class="login-container">
    <div class="login-header">
      <span class="app-name">TKK</span>
      <span>管理员</span>
    </div>
    <div class="login-main">
      <div class="info-box">
        <p class="info-title">欢迎登录</p>
        <el-form>
          <el-form-item>
            <el-input prefix-icon="el-icon-user" placeholder="请输入账户"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-unlock"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox class="login-checkbox"></el-checkbox>
            <span class="info-text">此设备上保留登录信息</span>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login-footer">© (2019) NLETECH科技</div>
  </div>
</template>
<style lang="scss">
.login-container {
  height: 100%;
  height: 100vh;
  background-color: #3540A5;
  position: relative;
  overflow: hidden;
  .login-header {
    color: #fff;
    font-size: 18px;
    padding: 10px 15px;
    font-weight: bold;
    border-bottom: 1px solid #4A55B7;
  }
  .app-name {
    font-size: 35px;
  }
  .login-main {
    background-color: #fff;
    border-radius: 4px;
    width: 600px;
    height: 430px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .info-box {
    width: 50%;
    margin: 30px auto;
  }
  .info-title {
    font-size: 18px;
    margin: 40px 0;
  }
  .login-footer {
    color: #3540A5;
    text-align: center;
    padding: 10px 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 14px;
    background-color: #fff;
  }
  .login-checkbox {
    margin-right: 5px;
  }
  .info-text {
    font-size: 12px;
  }
  .login-btn {
    width: 100%;
    height: 40px;
    color: #fff;
    border-color: #35B85A;
    background-color: #35B85A;
  }
}
</style>

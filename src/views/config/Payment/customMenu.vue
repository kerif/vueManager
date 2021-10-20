<template>
  <div class="customMenu-container">
    <div class="remark">
      {{ $t('*公众号菜单主菜单最多只能是三级，每级主菜单最多可以有五个子菜单栏目') }}
    </div>
    <el-button type="success">添加菜单</el-button>
    <el-dialog :visible.sync="show" :title="$t('菜单设置')" @close="clear">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
        <!-- 菜单名称 -->
        <el-form-item :label="$t('菜单名称')">
          <el-input v-model="ruleForm.ruleName" placeholder="请输入规则名称,最多60个字"> </el-input>
        </el-form-item>
        <!-- 菜单类型 -->
        <el-form-item>
          <el-radio-group v-model="radio">
            <el-radio :label="1">发送文字消息</el-radio>
            <el-radio :label="2">发送图片消息</el-radio>
            <el-radio :label="3">跳转网页</el-radio>
            <el-radio :label="4">跳转小程序</el-radio>
          </el-radio-group>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea">
          </el-input>
        </el-form-item>
        <!-- 图片 -->
        <el-upload class="avatar-uploader">
          <img :src="imageUrl" class="avatar" />
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- 网页 -->
        <div>{{ $t('订阅者点击菜单会跳到以下链接') }}</div>
        <el-form-item :label="$t('页面地址')">
          <el-input v-model="ruleForm.ruleName"> </el-input>
        </el-form-item>
        <!-- 小程序 -->
        <div>{{ $t('订阅者点击该子菜单会跳到以下小程序') }}</div>
        <el-form-item :label="$t('小程序')">
          <el-input v-model="ruleForm.app" placeholder="请输入小程序的appid"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('小程序路径')">
          <el-input v-model="ruleForm.appPath" placeholder="请输入小程序的页面路径"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('备用网页')">
          <el-input
            v-model="ruleForm.ruleName"
            placeholder="旧版微信客户端无法支持小程序,用户点击菜单时将会打开备用网页"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button>{{ $t('保存') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: 1,
      textarea: '',
      show: false,
      ruleForm: {
        ruleName: ''
      }
    }
  },
  methods: {
    clear() {}
  }
}
</script>

<style lang="scss">
.customMenu-container {
  font-size: 14px;
  background-color: #fff !important;
  .remark {
    color: red;
  }
}
</style>

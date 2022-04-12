<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('添加说明')"
    class="addExplain-dialog"
    width="50%"
    @close="clear"
  >
    <el-form :model="ruleForm" class="demo-ruleForm" label-position="top">
      <el-form-item v-for="item in stringData" :key="item.id" :label="item.name">
        <el-input
          type="textarea"
          v-model="item.value"
          :rows="2"
          :placeholder="$t('请输入内容')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      stringData: []
    }
  },
  created() {
    this.getLanguage()
  },
  methods: {
    getLanguage() {
      this.$request.getString().then(res => {
        this.stringData = res.data.filter(item => item.language_code !== 'zh_CN')
      })
    }
  }
}
</script>

<style lang="scss">
.addExplain-dialog {
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
}
</style>

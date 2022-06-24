<template>
  <el-dialog :title="$t('规则说明')" :visible.sync="show" @close="clear">
    <div>{{ $t('该说明将显示在客户端(小程序/网站), 方便客户理解规则') }}</div>
    <div v-for="item in illustrate" :key="item.code">
      <p>{{ item.name }}</p>
      <el-input type="textarea" :rows="5" v-model="langObj[item.code]"></el-input>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      illustrate: [],
      langObj: {}
    }
  },
  methods: {
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.illustrate = res.data.map(item => {
            let name = item.name
            let code = item.language_code
            return {
              name,
              code
            }
          })
          this.illustrate.forEach(item => {
            this.$set(item, item.code, '')
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onConfirm() {
      this.success(this.langObj)
      this.show = false
    },
    clear() {
      this.illustrate = []
      this.langObj = {}
    },
    init() {
      this.getLanguageList()
    }
  }
}
</script>

<style></style>

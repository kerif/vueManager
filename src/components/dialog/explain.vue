<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    width="50%"
    class="explain dialog-container"
    @close="clearn"
  >
    <p class="tips">{{ '*' + $t('该说明将显示在客户端（小程序/网站），方便客户理解规则') }}</p>
    <div v-for="item in illustrate" :key="item.code">
      <p>{{ item.name }}</p>
      <el-input type="textarea" :rows="5" v-model="langObj[item.code]"></el-input>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      illustrate: [],
      langObj: {},
      title: ''
    }
  },
  methods: {
    // 获取支持语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.illustrate = res.data.map(item => {
            let name = item.name
            let code = item.language_code
            let id = item.id
            return {
              id,
              name,
              code
            }
          })
          this.illustrate.sort(this.objectSort('id'))
          this.illustrate.forEach(item => {
            this.$set(item, item.code, '')
          })
          // if (!this.langObj.length) {
          //   this.langObj = this.illustrate.map(item => {
          //     return {
          //       [item.code]: ''
          //     }
          //   })
          // }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    objectSort(id) {
      return (obj1, obj2) => {
        return obj1[id] - obj2[id]
      }
    },
    submit() {
      if (this.type === 'getGradeTips') {
        // 修改等级说明
        this.$request.editGradeTips({ illustrate: { ...this.langObj } }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.tipsDialog = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
        this.show = false
        return
      }
      this.success(this.langObj)
      this.show = false
    },
    clearn() {
      this.illustrate = []
      this.langObj = {}
    },
    init() {
      if (this.type === 'getGradeTips') {
        this.title = this.$t('等级说明')
      } else if (this.type === 'explain') {
        this.title = this.$t('购买价格说明')
      } else if (this.type === 'evaluation') {
        this.title = this.$t('评价规则说明')
      }
      this.getLanguageList()
    }
  }
}
</script>
<style scoped lang="scss">
.explain {
  .tips {
    color: red;
  }
}
</style>

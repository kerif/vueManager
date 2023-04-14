<template>
  <div class="edit-content-container">
    <div class="lang-sty" v-if="lang.name">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{ $t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息') }}
      </p>
    </div>
    <el-form label-position="top" :model="params" ref="ruleForm" class="demo-ruleForm">
      <!-- 单页详情 -->
      <el-form-item :label="$t('内容详情')">
        <el-row>
          <el-col :span="20">
            <editor :content="params.content" @submit="saveNotice" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import editor from '@/components/editor.vue'
export default {
  components: { editor },
  data() {
    return {
      params: {
        content: '',
        language: ''
      },
      editor: null,
      line: {
        id: '',
        name: ''
      },
      lang: {
        name: '',
        language_code: ''
      },
      transCode: ''
    }
  },
  created() {
    // 如果是编辑语言
    if (this.$route.params.lang) {
      this.line = JSON.parse(this.$route.params.line)
      this.lang = JSON.parse(this.$route.params.lang)
      this.transCode = this.$route.params.transCode
      this.params.language = this.lang.language_code
      if (this.transCode === 1) {
        this.getList()
      }
    } else {
      this.getDetails()
    }
  },
  methods: {
    getList() {
      this.$request
        .getContentTranslate(this.line.id, {
          lang: this.params.language
        })
        .then(res => {
          if (res.ret) {
            this.params.content = res.data.content
          }
        })
    },
    // 编辑的时候 获取详细
    getDetails() {
      this.$request.getContentDetails(this.$route.query.id).then(res => {
        if (res.ret) {
          this.params.content = res.data.content
        }
      })
    },
    saveNotice(data) {
      this.params.content = data
      if (this.params.content === '') {
        return this.$message.error(this.$t('请输入内容'))
      }
      // 编辑数据
      if (this.$route.query.id) {
        this.$request
          .updateContentDetails(this.$route.query.id, {
            content: this.params.content
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.tips,
                type: 'success'
              })
              this.$router.go(-1)
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
        // 编辑多语言
        this.$request.updateContentTranslate(this.line.id, this.params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.tips,
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.edit-content-container {
  background-color: #fff !important;
  padding: 0 16px 16px 16px;
  min-height: 100%;
  .lang-sty {
    line-height: 40px;
    color: #e6a344;
    // margin-left: 80px;
    width: 66%;
    p {
      background-color: #fdf6ed;
    }
  }
  .icon-info {
    color: #e6a344;
    font-size: 18px;
    margin-left: 15px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
</style>

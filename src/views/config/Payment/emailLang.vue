<template>
  <div class="email-lang">
    <div class="lang-sty">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{ $t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息') }}
      </p>
    </div>
    <el-form label-position="top" :model="params" ref="ruleForm" class="demo-ruleForm">
      <!-- 邮件标题 -->
      <el-form-item :label="$t('邮件标题')">
        <el-row>
          <el-col :span="10">
            <el-input :placeholder="$t('请输入内容')" v-model="params.title"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <!-- 邮件内容 -->
      <el-form-item :label="$t('邮件内容')">
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
        title: '',
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
    this.line = JSON.parse(this.$route.params.line)
    this.lang = JSON.parse(this.$route.params.lang)
    this.transCode = this.$route.params.transCode
    this.params.language = this.lang.language_code
    if (this.transCode === 1) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request
        .emailLang(this.line.id, {
          lang: this.params.language
        })
        .then(res => {
          if (res.ret) {
            this.params.title = res.data.title
            this.params.content = res.data.content
          }
        })
    },
    saveNotice(data) {
      this.params.content = data
      if (this.params.title === '') {
        return this.$message.error(this.$t('请输入标题'))
      } else if (this.params.content === '') {
        return this.$message.error(this.$t('请输入内容'))
      }
      this.$request.updateEmailLang(this.line.id, this.params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.tips,
            type: 'success'
          })
          // this.$router.push({ name: 'noticelist' })
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
</script>

<style lang="scss">
.email-lang {
  background-color: #fff !important;
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

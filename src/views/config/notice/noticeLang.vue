<template>
  <div class="notice-lang">
    <div class="lang-sty">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{'请注意以下内容请输入对应的' + '【' + this.lang.name + '】' +'信息'}}
        </p>
    </div>
    <el-form label-position="top" :model="params" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="*标题">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="params.title"></el-input></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="*内容">
        <el-row>
          <el-col :span="20">
            <div id="editor" :value="params.content" @input="changeText"></div>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="save-btn" @click="saveNotice()"
        :loading="$store.state.btnLoading">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Wangeditor from 'wangeditor'
import baseApi from '@/lib/axios/baseApi'
export default {
  data () {
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
  mounted () {
    this.editor = new Wangeditor('#editor')
    this.editor.customConfig.menus = ['head', 'fontSize', 'fontName', 'bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'video', 'image', 'table']
    this.editor.customConfig.onchange = (html) => {
      this.params.content = html
    }
    this.editor.customConfig.uploadImgServer = `${baseApi.BASE_API_URL}/upload/images`
    this.editor.customConfig.uploadImgParams = {}
    this.editor.customConfig.uploadImgHeaders = {
      'Authorization': this.$store.state.token
    }
    this.editor.customConfig.uploadFileName = `images[${0}][file]`
    this.editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result, editor) => {
        console.log(result)
        if (result.ret === 1) {
          this.$message.success('上传成功')
          let url = `${baseApi.IMAGE_URL}${result.data[0].path}`
          insertImg(url)
        }
      }
    }
    this.editor.customConfig.showLinkImg = true
    this.editor.create()
    console.log(this.editor, 'this.editor')
  },
  created () {
    // console.log(JSON.parse(this.$route.params.line), 'line')
    // console.log(JSON.parse(this.$route.params.lang), 'lang')
    // console.log(this.$route.params.transCode, 'transCode')
    this.line = JSON.parse(this.$route.params.line)
    this.lang = JSON.parse(this.$route.params.lang)
    this.transCode = this.$route.params.transCode
    this.params.language = this.lang.language_code
    console.log(typeof (this.transCode), ' this.$route.params.transCode')
    if (this.transCode === 1) {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$request.noticeLang(this.line.id, {
        lang: this.params.language
      }).then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.editor.txt.html(this.params.content)
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText () {
      this.$emit('input', this.editor.txt.html())
    },
    saveNotice () {
      if (this.params.title === '') {
        return this.$message.error('请输入标题')
      } else if (this.params.content === '') {
        return this.$message.error('请输入内容')
      }
      this.$request.updateNoticeLang(this.line.id, this.params).then(res => {
        if (res.ret) {
          this.$notify({
            title: '操作成功',
            message: res.tips,
            type: 'success'
          })
          // this.$router.push({ name: 'noticelist' })
          this.$router.go(-1)
        } else {
          this.$notify({
            title: '操作失败',
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
.notice-lang {
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

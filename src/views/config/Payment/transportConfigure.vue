<template>
  <div class="how-container">
    <el-form label-position="top">
      <el-form-item :label="$t('选择语言')">
        <el-select
          v-model="params.language"
          placeholder="请选择"
          @change="changeLang"
        >
          <el-option
            v-for="item in options"
            :key="item.language_code"
            :label="item.name"
            :value="item.language_code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('标题')">
        <el-input class="input-sty" v-model="params.title"></el-input>
      </el-form-item>
      <!-- 如何下单 -->
      <el-form-item :label="$t('内容')">
        <el-row>
          <el-col :span="20">
            <div id="editor" :value="params.content" @input="changeText"></div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="saveHowOrder"
          :loading="$store.state.btnLoading"
          >{{ $t("保存") }}</el-button
        >
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
        language: '',
        content: ''
      },
      options: []
    }
  },
  created () {
    this.getHowOrder()
    this.getLanguage()
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
          this.$message.success(this.$t('上传成功'))
          let url = `${baseApi.IMAGE_URL}${result.data[0].path}`
          // insertImg(url)
          editor.cmd.do('insertHTML', `<div class='img-wrap'><img class='add-img' style="max-width:100%;" src=${url} alt=''></div>`)
        }
      }
    }
    this.editor.customConfig.zIndex = 500
    this.editor.customConfig.showLinkImg = true
    this.editor.create()
    console.log(this.editor, 'this.editor')
  },
  methods: {
    // 获取语言列表
    getLanguage () {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    // 切换语言
    changeLang () {
      this.$request.getTranshipment({
        lang: this.params.language
      }).then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.params.language = res.data.language
          this.editor.txt.html(this.params.content)
        }
      })
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 获取如何下单
    getHowOrder () {
      this.$request.getTranshipment().then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.params.language = res.data.language
          this.editor.txt.html(this.params.content)
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText () {
      this.$emit('input', this.editor.txt.html())
    },
    // 保存如何下单
    saveHowOrder () {
      this.$request.updateTranshipment(this.params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getHowOrder()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}

</script>
<style scoped>
</style>

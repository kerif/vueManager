<template>
  <div class="notice-add-container">
    <el-form label-position="top">
      <el-form-item label="标题">
        <el-row>
          <el-col :span="10"><el-input placeholder="请输入内容" v-model="params.title"></el-input></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="问题类型">
        <el-row>
          <el-col :span="10">
            <el-radio-group v-model="params.type">
              <el-radio :label="1">常见问题</el-radio>
              <el-radio :label="2">其他问题</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="内容">
        <el-row>
          <el-col :span="20"><div id="editor" :value="params.body"></div></el-col>
        </el-row>
      </el-form-item>
      <el-form-item><el-button type="primary" class="save-btn">保存</el-button></el-form-item>
    </el-form>
  </div>
</template>
<script>
import Wangeditor from 'wangeditor'
export default {
  data () {
    return {
      params: {
        title: '',
        type: '',
        body: ''
      },
      editor: null
    }
  },
  mounted () {
    this.editor = new Wangeditor('#editor')
    this.editor.customConfig.menus = ['head', 'fontSize', 'fontName', 'bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'video', 'image', 'table']
    this.editor.customConfig.onChange = (html) => {
      this.params.body = html
    }
    this.editor.customConfig.uploadImgServer = ``
    this.editor.customConfig.uploadImgParams = {}
    this.editor.customConfig.uploadImgHeaders = {
      // 'Authorization': this.$store.state.token.token
    }
    this.editor.customConfig.uploadFileName = 'image'
    this.editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result, editor) => {
        if (result.ret === 1) {
          this.$message.success('上传成功')
          let url = result.data
          insertImg(url)
        }
      }
    }
    this.editor.customConfig.showLinkImg = true
    this.editor.create()
  }
}
</script>

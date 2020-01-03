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
            <el-radio-group v-model="params.type_id">
              <el-radio :label="1">常见问题</el-radio>
              <el-radio :label="2">其他问题</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="内容">
        <el-row>
          <el-col :span="20">
            <div id="editor" :value="params.content" @input="changeText"></div>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="save-btn" @click="saveNotice"
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
        type_id: '',
        content: ''
      },
      editor: null
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
  },
  created () {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$request.getNoticeDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.params.type_id = res.data.type
          this.editor.txt.html(this.params.content)
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText () {
      this.$emit('input', this.editor.txt.html())
    },
    saveNotice () {
      if (!this.$route.params.id) { // 如果是新增状态
        this.$request.saveNotice(this.params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            this.$router.push({ name: 'noticelist' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else { // 如果是编辑状态
        this.$request.saveNoticeDetails(this.$route.params.id, this.params).then(res => {
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
}
</script>

<style lang="scss">
.notice-add-container {
  background-color: #fff !important;
  .el-input__inner{
    background-color: #F5F5F5;
  }
  .el-textarea__inner {
    background-color: #F5F5F5;
  }
  .el-radio__inner {
    background-color: #F5F5F5;
  }
}
</style>

<template>
  <div class="public-add-container">
    <el-form label-position="top">
      <!-- 公告标题 -->
      <el-form-item label="*公告标题">
        <el-row>
          <el-col :span="10"><el-input placeholder="公告标题不超过30个字" v-model="params.title"></el-input></el-col>
        </el-row>
      </el-form-item>
      <!-- 公告详情 -->
      <el-form-item label="*公告详情">
        <el-row>
          <el-col :span="20">
            <div id="editor" :value="params.content" @input="changeText"></div>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="文件上传">
        <el-row>
          <el-col :span="20">
            <el-upload
              class="upload-demo"
              action=""
              :limit="3"
              :on-remove="onFileRemove"
              :file-list="fileList"
              :before-upload="beforeUploadImg"
              :http-request="uploadBaleImg">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">支持格式：.rar .zip .doc .docx .pdf，单个文件不能超过3MB</div>
            </el-upload>
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
        content: ''
      },
      fileList: [],
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
    console.log(this.editor, 'this.editor')
  },
  created () {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$request.getSingleAnnouncements(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.editor.txt.html(this.params.content)
          this.fileList = res.data.attachments.map(item => {
            const arr = item.split('/')
            return {
              name: arr[arr.length - 1],
              url: item
            }
          })
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText () {
      this.$emit('input', this.editor.txt.html())
    },
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.fileList.push({
              name: item.name,
              url: item.path
            })
          })
        }
      })
    },
    onUpload (file) {
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      return this.$request.uploadFiles(params)
    },
    beforeUploadImg (file) {
      console.log(file)
      const mimeList = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (mimeList.indexOf(file.type) === -1) {
        this.$message.info('请上传格式正确的文件')
        return false
      } else if (file.size > 1024 * 1024 * 3) {
        this.$message.info('上传图片大小不能超过3MB')
        return false
      }
      return true
    },
    saveNotice () {
      if (this.fileList.length) {
        this.params.attachments = this.fileList.map(item => item.url)
      }
      if (!this.$route.params.id) { // 如果是新增状态
        this.$request.addAnnouncements(this.params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else { // 如果是编辑状态
        this.$request.updateAnnouncements(this.$route.params.id, this.params).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.tips,
              type: 'success'
            })
            // this.$router.push({ name: 'public' })
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
    },
    // 文件删除
    onFileRemove (file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>

<style lang="scss">
.public-add-container {
  background-color: #fff !important;
}
</style>

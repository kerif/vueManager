<template>
  <div class="public-add-container">
    <el-form label-position="top">
      <!-- 公告标题 -->
      <el-form-item :label="$t('公告标题')">
        <el-row>
          <el-col :span="10"
            ><el-input :placeholder="$t('公告标题不超过30个字')" v-model="params.title"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <!-- 公告详情 -->
      <el-form-item :label="$t('公告详情')">
        <el-row>
          <el-col :span="20">
            <editor :content="params.content" @submit="saveNotice" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('文件上传')">
        <el-row>
          <el-col :span="20">
            <el-upload
              class="upload-demo"
              action=""
              :limit="3"
              :on-remove="onFileRemove"
              :file-list="fileList"
              :before-upload="beforeUploadImg"
              :http-request="uploadBaleImg"
            >
              <el-button size="small" type="primary">{{ $t('点击上传') }}</el-button>
              <div slot="tip" class="el-upload__tip">
                {{ $t('支持格式：.doc .docx .pdf，单个文件不能超过3MB') }}
              </div>
            </el-upload>
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
        content: ''
      },
      fileList: [],
      editor: null
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getSingleAnnouncements(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
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
    uploadBaleImg(item) {
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
    onUpload(file) {
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      return this.$request.uploadFiles(params)
    },
    beforeUploadImg(file) {
      if (file.size > 1024 * 1024 * 4) {
        this.$message.error(this.$t('上传图片大小不能超过4MB'))
        return false
      }
      return true
    },
    saveNotice(data) {
      this.params.content = data
      if (this.fileList.length) {
        this.params.attachments = this.fileList.map(item => item.url)
      }
      if (!this.$route.params.id) {
        // 如果是新增状态
        this.$request.addAnnouncements(this.params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.push({ name: 'Public' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        // 如果是编辑状态
        this.$request.updateAnnouncements(this.$route.params.id, this.params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.tips,
              type: 'success'
            })
            this.$router.push({ name: 'Public' })
            // this.$router.go(-1)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    // 文件删除
    onFileRemove(file, fileList) {
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

<template>
  <div class="public-add-container">
    <div class="public-add-left">
      <el-form label-position="top">
        <!-- 公告标题 -->
        <el-form-item label="公告标题" required>
          <el-row>
            <el-col :span="24"
              ><el-input :placeholder="$t('公告标题不超过30个字')" v-model="params.title"></el-input
            ></el-col>
          </el-row>
        </el-form-item>
        <!-- 公告详情 -->
        <el-form-item label="公告详情" required>
          <el-row>
            <el-col :span="24">
              <el-input
                type="textarea"
                resize="none"
                :autosize="{ minRows: 15, maxRows: 15 }"
                v-model="params.content"
              ></el-input>
            </el-col>
            <el-col :span="20" class="targge">
              <el-switch
                v-model="isNoPreview"
                active-text="开"
                inactive-text="关"
                active-color="#478cfe"
                :disabled="true"
                @click.native="isNoPreviewFunc(isNoPreview)"
              />
              <label class="preview">{{ $t('预览弹窗') }}</label>
            </el-col>
            <el-col :span="4">
              <el-link
                @click.native="dialogPreviewFunc()"
                class="editPreview-elLink"
                :underline="false"
                >{{ $t('修改弹窗提示') }}</el-link
              ></el-col
            >
          </el-row>
        </el-form-item>

        <el-form-item>
          <template slot="label">
            {{ $t('附件上传 ') }}
            <span class="el-upload__tip">{{
              $t(' 支持格式：.doc .docx .pdf，单个文件不能超过3MB')
            }}</span>
          </template>
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
                <el-button style="color: black" size="small" type="info">{{
                  $t('点击上传')
                }}</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button class="save" @click="saveNotice">{{ $t('保存') }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="public-add-center"></div>

    <div class="public-add-right">
      <p class="preview-box-tips" style="font-size: 14px;">{{ $t('* 界面预览效果仅供参考') }}</p>
      <div class="previewBox">
        <div>
          <h3 class="text">{{ params.title }}</h3>
          <p class="time text">{{ params.created_at }}</p>
          <pre class="text textCont">{{ params.content }}</pre>
        </div>
        <transition name="el-zoom-in-top">
          <div class="previewBox_dialog" v-show="isNoPreview">
            <div class="dialog-container isNoneBorder">
              <h3>{{ params.title }}</h3>
              <pre>{{ params.content.substring(0, 100)+'...'}}</pre>
            </div>
          </div> 
        </transition>
        <div class="previewBox_model" v-show="isNoPreview"></div>
      </div>
    </div>

    <!-- 弹框预览 -->
    <el-dialog title="弹框内容" :visible.sync="dialogPreview" width="40%">
      <div class="dialog-container">
        <el-input
          type="textarea"
          resize="none"
          rows="12"
          v-model="params.content"
        ></el-input>
      </div>
      <div style="margin-top: 20px;">
        <el-switch
            v-model="deadlineContent"
            active-text="开"
            inactive-text="关"
            active-color="#478cfe"
            :disabled="true"
            @click.native="deadlineContentFunc(deadlineContent)"
          />
          <label class="preview">{{ $t('自动截止公告内容') }}</label>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPreview = false">确 定</el-button>
      </span>
    </el-dialog>
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
        created_at:'',
        cover_content:'',
      },
      fileList: [],
      editor: null,
      isNoPreview: false,
      dialogPreview: false,
      deadlineContent:false
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
          this.params.content = res.data.content.replace(/<p>/g, '').replaceAll('</p>', '')
          this.params.created_at= res.data.created_at

          console.log(this.params.content)

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
    //保存按钮
    saveNotice() {
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
    },

    // 展示预览效果
    isNoPreviewFunc() {
      this.isNoPreview = !this.isNoPreview
    },
    dialogPreviewFunc() {
      this.dialogPreview = !this.dialogPreview
    },
    // 自动截断公告内容
    deadlineContentFunc() {
      this.deadlineContent = !this.deadlineContent

      
    },
  }
}
</script>

<style lang="scss">
.public-add-container {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  // height: 100%;

  .public-add-left {
    padding: 6px 30px;
    box-sizing: border-box;
    width: 60%;
  }
 .public-add-center{
    width:20px;
    background-color: #f5f5f5;
  }
  .public-add-right {
    width: 40%;
    background-color: #f5f5f5; 
  }
  .preview-box-tips {
    color: #ebaf62;
  }
  .previewBox {
    background-color: #fff;
    padding: 6px 30px 30px;
    box-sizing: border-box;
    position: relative;
    height: 695px;

    h3{
      text-align: center;
      margin-bottom: 0 !important;
    }
    .time{
      text-align: center;
      color: #606266;
      font-size: 12px;
      margin-top: 0 !important;
    }
    .text{
      width: 100%;
      word-break: break-all;
      word-wrap: break-word;
      line-height: 1.5;
    }
    .textCont{
      height: 550px;
      overflow: hidden;
    }
  }
  .previewBox_dialog{
    width: 50%;
    height: 60%;
    padding: 0 20px 20px;
    box-sizing: border-box;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 4;
    background-color: #fff;
    border-radius: 20px;
    transition: all 0.2s;
  }
  .isNoneBorder{
    border: none !important;
  }
  .previewBox_model{
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%; 
    height: 100%;
    opacity: 0.5;
    background-color: #333;
  }
  pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    font-size: 16px;
  }

  .upload-demo button {
    background-color: #d0d0d0;
    border-color: transparent;
  }
  .el-switch__label * {
    font-size: 12px;
    display: inline-block;
  }
  .el-switch__label {
    line-height: 2;
    position: absolute;
    display: none;
    color: #fff !important;
    font-size: 12px !important;
    cursor: pointer !important;
  }
  .targge {
    opacity: 1;
    .el-switch__core {
      cursor: pointer !important;
    }
  }
  /*打开时文字位置设置*/
  .el-switch__label--right {
    z-index: 1;
  }
  /*关闭时文字位置设置*/
  .el-switch__label--left {
    z-index: 1;
    left: 22px;
  }
  /*显示文字*/
  .el-switch__label.is-active {
    display: block;
  }
  /*开关宽度*/
  .el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 50px !important;
    cursor: pointer !important;
  }
  .preview {
    margin-left: 10px;
    color: #606266;
    font-size: 12px;
  }
  .editPreview-elLink {
    color: #409eff;
    &:hover {
      color: #7bbafa;
    }
  }
  .dialog-container {
    width: 100%;
    line-height: 1.5;
  }
  .dialog-footer {
    button {
      color: #fff;
      background-color: #3b8ece !important;
      padding-left: 40px;
      padding-right: 40px;
    }
  }
  .save {
    color: #fff;
    background-color: #3b8ece;
    padding-left: 40px;
    padding-right: 40px;
  }
}
</style>

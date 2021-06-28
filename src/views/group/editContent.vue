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
      <el-form-item :label="$t('*内容详情')">
        <el-row>
          <el-col :span="20">
            <div id="editor" :value="params.description" @input="changeText"></div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="saveContent"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Wangeditor from 'wangeditor'
import baseApi from '@/lib/axios/baseApi'
export default {
  data() {
    return {
      params: {
        description: '',
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
  mounted() {
    this.editor = new Wangeditor('#editor')
    this.editor.customConfig.menus = [
      'head',
      'fontSize',
      'fontName',
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'foreColor',
      'backColor',
      'link',
      'list',
      'justify',
      'quote',
      'video',
      'image',
      'table'
    ]
    this.editor.customConfig.onchange = html => {
      this.params.description = html
    }
    this.editor.customConfig.uploadImgServer = `${baseApi.BASE_API_URL}/upload/images`
    this.editor.customConfig.uploadImgParams = {}
    this.editor.customConfig.uploadImgHeaders = {
      Authorization: this.$store.state.token
    }
    this.editor.customConfig.uploadFileName = `images[${0}][file]`
    this.editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result) => {
        console.log(result)
        if (result.ret === 1) {
          this.$message.success('上传成功')
          let url = `${baseApi.IMAGE_URL}${result.data[0].path}`
          insertImg(url)
        }
      }
    }
    this.editor.customConfig.zIndex = 500
    this.editor.customConfig.showLinkImg = true
    this.editor.create()
    console.log(this.editor, 'this.editor')
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
        .pageLang(this.line.id, {
          lang: this.params.language
        })
        .then(res => {
          if (res.ret) {
            this.params.title = res.data.title
            this.params.description = res.data.description
            this.params.tags = res.data.tags
            this.editor.txt.html(this.params.description)
          }
        })
    },
    // 编辑的时候 获取详细
    getDetails() {
      this.$request.getContentDetails(this.$route.query.id).then(res => {
        if (res.ret) {
          this.params.description = res.data.description
          this.editor.txt.html(this.params.description)
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText() {
      this.$emit('input', this.editor.txt.html())
    },
    saveContent() {
      if (this.params.description === '') {
        return this.$message.error(this.$t('请输入内容'))
      }
      if (this.$route.query.id) {
        this.$request.updatePageLang(this.line.id, this.params).then(res => {
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
        this.$request.updatePageLang(this.line.id, this.params).then(res => {
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

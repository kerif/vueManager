<template>
  <div class="sick-tips-container">
    <el-form label-position="top">
      <el-form-item :label="$t('标题')">
        <el-row>
          <el-col :span="10"
            ><el-input
              :placeholder="$t('请输入内容')"
              v-model="params.risk_warning_title"
            ></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <!-- <el-form-item label="问题类型">
        <el-row>
          <el-col :span="10">
            <el-radio-group v-model="params.type_id">
              <el-radio :label="1">常见问题</el-radio>
              <el-radio :label="2">其他问题</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form-item> -->
      <el-form-item :label="$t('内容')">
        <el-row>
          <el-col :span="20">
            <div id="editor" :value="params.risk_warning_content" @input="changeText"></div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="saveNotice"
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
        risk_warning_title: '',
        risk_warning_content: ''
      },
      editor: null
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
      this.params.risk_warning_content = html
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
          this.$message.success(this.$t('上传成功'))
          let url = `${baseApi.IMAGE_URL}${result.data[0].path}`
          insertImg(url)
        }
      }
    }
    this.editor.customConfig.showLinkImg = true
    this.editor.create()
    console.log(this.editor, 'this.editor')
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getRiskDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.risk_warning_title = res.data.risk_warning_title
          this.params.risk_warning_content = res.data.risk_warning_content
          this.editor.txt.html(this.params.risk_warning_content)
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText() {
      this.$emit('input', this.editor.txt.html())
    },
    saveNotice() {
      if (!this.$route.params.id) {
        // 如果是新增状态
        this.$request.saveNotice(this.params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            // this.$router.push({ name: 'noticelist' })
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        // 如果是编辑状态
        this.$request.updateRiskDetails(this.$route.params.id, this.params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.tips,
              type: 'success'
            })
            // this.$router.push({ name: 'payment',
            //   query: {
            //     activeName: '7'
            //   } })
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
.sick-tips-container {
  background-color: #fff !important;
}
</style>

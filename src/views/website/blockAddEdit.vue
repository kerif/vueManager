<template>
  <div class="block-edit-container">
    <el-form label-position="top">
      <!-- 标题 -->
      <el-form-item :label="$t('区块名')">
        <el-row>
          <el-col :span="10"
            ><span>{{ params.name }}</span></el-col
          >
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('*标签')">
        <el-row>
          <el-col :span="10"
            ><el-input :placeholder="$t('请输入标签')" v-model="params.description"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <!-- 区块详情 -->
      <el-form-item :label="$t('*区块详情')">
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
        name: '',
        content: '',
        description: ''
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
      this.params.content = html
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
    this.editor.customConfig.zIndex = 500
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
      this.$request.getBlocksDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.name = res.data.name
          this.params.content = res.data.content
          this.params.description = res.data.description
          this.editor.txt.html(this.params.content)
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText() {
      this.$emit('input', this.editor.txt.html())
    },
    saveNotice() {
      if (!this.params.description) {
        return this.$message.error(this.$t('请输入标签'))
      }
      this.$request.updateBlocksDetails(this.$route.params.id, this.params).then(res => {
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
</script>

<style lang="scss">
.block-edit-container {
  background-color: #fff !important;
}
</style>
